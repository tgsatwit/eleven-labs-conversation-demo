import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// Function to extract audio from video using ffmpeg
async function extractAudioFromVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vn', // Disable video
      '-acodec', 'libmp3lame',
      '-ac', '2', // 2 channels
      '-ab', '160k', // Bitrate
      '-ar', '44100', // Sample rate
      outputPath
    ]);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(err);
    });
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const timestamp = Date.now();
    const tempInputPath = path.join(tempDir, `temp-${timestamp}-input-${file.name}`);
    fs.writeFileSync(tempInputPath, buffer);

    let audioFilePath = tempInputPath;

    // If it's a video file, extract the audio
    if (file.type.startsWith('video/')) {
      const tempAudioPath = path.join(tempDir, `temp-${timestamp}-audio.mp3`);
      await extractAudioFromVideo(tempInputPath, tempAudioPath);
      audioFilePath = tempAudioPath;
    }

    try {
      // Use OpenAI's Whisper API
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
      });

      return NextResponse.json({ transcription });
    } finally {
      // Clean up: delete temporary files
      fs.unlinkSync(tempInputPath);
      if (audioFilePath !== tempInputPath) {
        fs.unlinkSync(audioFilePath);
      }
    }

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 