import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-dental-mint/30 ${containerClassName}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt || 'Hình ảnh Nha Khoa Nụ Cười Xanh'}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-dental-mint/40 to-white/80 p-4 text-center">
          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-dental-accent mb-2">
            <Stethoscope className="h-6 w-6 text-dental-accent" />
          </div>
          <span className="text-xs font-semibold text-dental-text/80 line-clamp-2">
            {fallbackTitle || alt || 'Nha Khoa Nụ Cười Xanh'}
          </span>
          <span className="text-[10px] text-dental-muted mt-0.5">Hình ảnh minh họa chuyên khoa</span>
        </div>
      )}
    </div>
  );
};

