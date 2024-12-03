import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/logo192.png"
      alt="Gestalts Logo"
      width={32}
      height={32}
      className="rounded-lg"
    />
  );
}
