import React, { useState, useEffect, useRef } from 'react';

interface PosterPreviewWrapperProps {
  aspectRatio: 'flyer' | 'square';
  children: React.ReactNode;
}

export const PosterPreviewWrapper: React.FC<PosterPreviewWrapperProps> = ({
  aspectRatio,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(420);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use ResizeObserver to track container resizing dynamically
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setContainerWidth(width);
      }
    });

    observer.observe(el);

    // Initial measurement
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      setContainerWidth(rect.width);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const baseWidth = aspectRatio === 'square' ? 480 : 420;
  const baseHeight = aspectRatio === 'square' ? 480 : 543.5;
  const scale = Math.min(1, containerWidth / baseWidth);
  const scaledHeight = baseHeight * scale;

  return (
    <div 
      ref={containerRef} 
      className="w-full relative flex justify-center items-start overflow-hidden" 
      style={{ height: `${scaledHeight}px` }}
    >
      <div
        className="absolute top-0 origin-top shrink-0"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
