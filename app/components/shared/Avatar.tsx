import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  const pixelSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="object-cover"
        />
      ) : (
        <span className="text-gray-500 dark:text-gray-400 font-semibold">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
