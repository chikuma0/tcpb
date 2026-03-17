interface TcpbLogoProps {
  className?: string;
  size?: 'micro' | 'footer';
  decorative?: boolean;
}

export default function TcpbLogo({
  className = '',
  size = 'micro',
  decorative = false,
}: TcpbLogoProps) {
  const sizeClass =
    size === 'micro'
      ? 'w-[72px] sm:w-[82px] md:w-[92px]'
      : 'w-[84px] sm:w-[96px] md:w-[108px]';

  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Tokyo Community Power Bank'}
      aria-hidden={decorative ? true : undefined}
      className={`${sizeClass} shrink-0 bg-current ${className}`.trim()}
      style={{
        aspectRatio: '462 / 550',
        WebkitMaskImage: 'url(/tcpb-logo.png)',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskImage: 'url(/tcpb-logo.png)',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
      }}
    />
  );
}
