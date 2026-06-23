import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeImageProps {
  url: string;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export const QRCodeImage: React.FC<QRCodeImageProps> = ({
  url,
  className = '',
  darkColor = '#000000',
  lightColor = '#ffffff'
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!url) return;
    
    QRCode.toDataURL(url, {
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor
      }
    })
      .then(setDataUrl)
      .catch(err => console.error('Failed to generate real QR code', err));
  }, [url, darkColor, lightColor]);

  if (!url) return null;

  if (!dataUrl) {
    // Pulse loading placeholder
    return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />;
  }

  return (
    <img 
      src={dataUrl} 
      alt="Adoption Link QR Code" 
      className={className} 
      referrerPolicy="no-referrer"
    />
  );
};
