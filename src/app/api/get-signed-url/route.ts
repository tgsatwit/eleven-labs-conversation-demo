import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
    
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }

    if (!agentId) {
      throw new Error('NEXT_PUBLIC_AGENT_ID is not set');
    }

    console.log('Requesting signed URL for agent:', agentId);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error response:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response:', data);
    
    if (!data.signed_url) {
      console.error('No signed_url in response:', data);
      throw new Error('No signed URL in response');
    }
    
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get signed URL' },
      { status: 500 }
    );
  }
}
