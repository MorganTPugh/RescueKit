import React from 'react';
import { FosterPetData, PosterDesignSettings } from '../types';
import { THEMES } from '../data';
import { QRCodeImage } from './QRCodeImage';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Info, 
  Check, 
  Mail, 
  Phone, 
  Globe, 
  User, 
  Compass, 
  Activity, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Flame,
  Award,
  Copy
} from 'lucide-react';

interface PosterTemplateProps {
  pet: FosterPetData;
  settings: PosterDesignSettings;
  setPet?: React.Dispatch<React.SetStateAction<FosterPetData>>;
  isPrintable?: boolean;
}

const RepositionableImage: React.FC<{
  src: string;
  alt: string;
  pet: FosterPetData;
  setPet?: React.Dispatch<React.SetStateAction<FosterPetData>>;
  className?: string;
  isSecondary?: boolean;
}> = ({ src, alt, pet, setPet, className = "", isSecondary = false }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const startOffsetXRef = React.useRef(0);
  const startOffsetYRef = React.useRef(0);
  const pinchStartDistRef = React.useRef<number | null>(null);
  const pinchStartZoomRef = React.useRef<number>(1);
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);

  const keyZoom = isSecondary ? 'photoZoom2' : 'photoZoom';
  const keyOffsetX = isSecondary ? 'photoOffsetX2' : 'photoOffsetX';
  const keyOffsetY = isSecondary ? 'photoOffsetY2' : 'photoOffsetY';

  const zoomValue = pet[keyZoom] ?? 1;
  const offsetXValue = pet[keyOffsetX] ?? 0;
  const offsetYValue = pet[keyOffsetY] ?? 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!setPet || e.button !== 0) return;
    e.preventDefault();
    setContextMenu(null);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startOffsetXRef.current = pet[keyOffsetX] ?? 0;
    startOffsetYRef.current = pet[keyOffsetY] ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !setPet) return;
    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pctX = (deltaX / rect.width) * 100 * (1 / zoomValue);
    const pctY = (deltaY / rect.height) * 100 * (1 / zoomValue);

    setPet(prev => ({
      ...prev,
      [keyOffsetX]: Math.min(150, Math.max(-150, Math.round(startOffsetXRef.current + pctX))),
      [keyOffsetY]: Math.min(150, Math.max(-150, Math.round(startOffsetYRef.current + pctY)))
    }));
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!setPet) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cw = containerRef.current?.clientWidth ?? 200;
    const ch = containerRef.current?.clientHeight ?? 200;
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    setContextMenu({
      x: Math.min(rawX, cw - 148),
      y: Math.min(rawY, ch - 72),
    });
  };

  const handleZoomIn = () => {
    setPet?.(prev => ({ ...prev, [keyZoom]: Math.min(3, parseFloat(((prev[keyZoom] ?? 1) + 0.25).toFixed(2))) }));
    setContextMenu(null);
  };

  const handleZoomOut = () => {
    setPet?.(prev => ({ ...prev, [keyZoom]: Math.max(1, parseFloat(((prev[keyZoom] ?? 1) - 0.25).toFixed(2))) }));
    setContextMenu(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!setPet) return;
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      pinchStartDistRef.current = null;
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      startOffsetXRef.current = pet[keyOffsetX] ?? 0;
      startOffsetYRef.current = pet[keyOffsetY] ?? 0;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoomRef.current = pet[keyZoom] ?? 1;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!setPet) return;
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pctX = (deltaX / rect.width) * 100 * (1 / zoomValue);
      const pctY = (deltaY / rect.height) * 100 * (1 / zoomValue);
      setPet(prev => ({
        ...prev,
        [keyOffsetX]: Math.min(150, Math.max(-150, Math.round(startOffsetXRef.current + pctX))),
        [keyOffsetY]: Math.min(150, Math.max(-150, Math.round(startOffsetYRef.current + pctY)))
      }));
    } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / pinchStartDistRef.current;
      const newZoom = Math.min(3, Math.max(1, pinchStartZoomRef.current * scale));
      setPet(prev => ({ ...prev, [keyZoom]: parseFloat(newZoom.toFixed(2)) }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStartDistRef.current = null;
    if (e.touches.length === 0) isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!setPet) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    setPet(prev => {
      const currentZoom = prev[keyZoom] ?? 1;
      const nextZoom = Math.min(3, Math.max(1, currentZoom + zoomDelta));
      return { ...prev, [keyZoom]: parseFloat(nextZoom.toFixed(2)) };
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none active:cursor-grabbing cursor-grab z-10 touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
    >
      {/* Image clipped to the container bounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover select-none ${className}`}
          style={{
            transform: `scale(${zoomValue}) translate(${offsetXValue}%, ${offsetYValue}%)`,
            transformOrigin: 'center center',
            transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out'
          }}
        />
      </div>

      {/* Right-click zoom context menu */}
      {contextMenu && setPet && (
        <div
          className="absolute z-50 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden text-[11px] font-bold"
          style={{ left: contextMenu.x, top: contextMenu.y, minWidth: '140px' }}
          onMouseDown={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 text-left hover:bg-indigo-50 text-slate-700 cursor-pointer transition-colors"
          >
            🔍 Zoom In
          </button>
          <div className="border-t border-stone-100" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 text-left hover:bg-indigo-50 text-slate-700 cursor-pointer transition-colors"
          >
            🔎 Zoom Out
          </button>
        </div>
      )}

      {setPet && (
        <div className="poster-drag-hint absolute bottom-1 right-1 bg-black/55 text-white rounded-md text-[7.5px] py-0.5 px-1.5 font-sans pointer-events-none select-none z-30 leading-none opacity-80">
          Drag · Pinch/scroll to zoom · Right-click to zoom
        </div>
      )}
    </div>
  );
};

// Custom SVG Icons for pets when no photos are uploaded
const PetSvgIllustration = ({ species }: { species: string }) => {
  if (species === 'cat') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full text-rose-300 fill-current opacity-85" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20c-15 0-25 10-25 25 0 12.3 8.3 22 18.5 24.3C40 76.5 35 85 20 85h60c-15 0-20-8.5-23.5-15.7C66.7 67 75 57.3 75 45c0-15-10-25-25-25zm-20 5c3-1 6-4 8-8 1 3 3 5 5 7-5 2-10 2-13 1zm40 1c-3-1-5-3-7-7 1 3 3 5 6 8 3 1 7 1 9-1z" />
        <circle cx="40" cy="45" r="4" fill="#1e293b" />
        <circle cx="60" cy="45" r="4" fill="#1e293b" />
        <path d="M47 52l3 3 3-3z" fill="#f43f5e" />
        <path d="M50 55c-2 0-3 1-3 2s1 2 3 2 3-1 3-2-1-2-3-2z" fill="#1e293b" />
      </svg>
    );
  } else if (species === 'dog') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-300 fill-current opacity-85" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15C33.4 15 20 28.4 20 45s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30zm-18 8c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm36 0c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zM50 67c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm0-35c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
        <circle cx="42" cy="44" r="5" fill="#1e293b" />
        <circle cx="58" cy="44" r="5" fill="#1e293b" />
        <path d="M48 52l2 2 2-2z" fill="#1e293b" />
        <path d="M46 56c1-1 3 0 4 1 1-1 3-2 4-1 1 2-1 4-4 4s-5-2-4-4z" fill="#f43f5e" />
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full text-amber-300 fill-current opacity-85" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 30c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z" />
        <path d="M42 32c0-8-5-17-9-17s-7 6-7 14 6 15 9 17l7-14zm16 0l7 14c3-2 9-9 9-17s-3-14-7-14-9 9-9 17z" />
        <circle cx="43" cy="46" r="3" fill="#1e293b" />
        <circle cx="57" cy="46" r="3" fill="#1e293b" />
        <path d="M48 50l2 1 2-1z" fill="#f43f5e" />
      </svg>
    );
  }
};

const getDynamicBioStyle = (text: string, templateId: string, isSquare: boolean) => {
  const n = Math.max(text.length, 1);

  // Formula: safeSize = sqrt(W × H × fill / (n × k × 1.3))
  // W, H = inner text-area dimensions measured from live DOM at preview render scale.
  // k = character-width ratio derived per-template from DOM (textWidth / (fontSize × charsPerLine)).
  // fill = 0.78 targets ~78% box fill, giving overflow headroom for word-wrap variability.
  // maxPx is the largest safe font for the shortest realistic bio (~80 chars).
  const fill = 0.78;
  const lh = 1.3; // formula constant; actual lineHeight output is computed separately below

  let W: number, H: number, k: number, minPx: number, maxPx: number;

  if (isSquare) {
    // Square poster renders at 418×418 px
    minPx = 8.0;
    W = 169; H = 252; k = 0.415; maxPx = 20.0; // default (covers unmapped templates)

    if (templateId === 'whimsical') {
      W = 164; H = 223; k = 0.416; maxPx = 18.0; // Fredoka — measured inner text area
    } else if (templateId === 'comic') {
      W = 176; H = 249; k = 0.360; maxPx = 22.0;
    } else if (templateId === 'editorial') {
      W = 169; H = 252; k = 0.382; maxPx = 22.0;
    } else if (templateId === 'minimalist') {
      W = 373; H = 110; k = 0.459; maxPx = 22.0; // full-width photo: wide, short box
    } else if (templateId === 'polaroid') {
      W = 140; H = 257; k = 0.415; maxPx = 22.0;
    } else if (templateId === 'bio-only') {
      W = 520; H = 460; k = 0.430; maxPx = 28.0; minPx = 13.5;
    } else if (templateId === 'two-photos' || templateId === 'extreme-duo') {
      W = 220; H = 122; k = 0.411; maxPx = 16.0;
    } else if (templateId === 'comic-2-photos') {
      W = 220; H = 118; k = 0.411; maxPx = 16.0;
    } else if (templateId === 'editorial-2-photos') {
      W = 165; H = 220; k = 0.390; maxPx = 21.0;
    }
  } else {
    // Flyer poster renders at 378×489 px
    minPx = 7.5;
    W = 163; H = 250; k = 0.430; maxPx = 17.0; // default

    if (templateId === 'whimsical') {
      W = 141; H = 286; k = 0.394; maxPx = 19.0;
    } else if (templateId === 'comic') {
      W = 134; H = 193; k = 0.471; maxPx = 15.0; // narrow col + feature cards shrink bio area
    } else if (templateId === 'editorial') {
      W = 133; H = 234; k = 0.426; maxPx = 18.0;
    } else if (templateId === 'minimalist') {
      W = 183; H = 158; k = 0.475; maxPx = 16.0; // full-width photo: wide but short
    } else if (templateId === 'polaroid') {
      W = 119; H = 255; k = 0.443; maxPx = 16.0; // measured para dims; H scaled to compensate for word-wrap efficiency
    } else if (templateId === 'bio-only') {
      W = 680; H = 640; k = 0.430; maxPx = 25.0; minPx = 12.5;
    } else if (templateId === 'two-photos' || templateId === 'extreme-duo') {
      W = 189; H = 124; k = 0.411; maxPx = 15.0;
    } else if (templateId === 'comic-2-photos') {
      W = 189; H = 140; k = 0.411; maxPx = 15.0;
    } else if (templateId === 'editorial-2-photos') {
      W = 133; H = 210; k = 0.426; maxPx = 17.0;
    }
  }

  const safeSize = Math.sqrt((W * H * fill) / (n * k * lh));
  const fontSize = Math.min(maxPx, Math.max(minPx, safeSize));
  const lineHeight = fontSize > 15 ? '1.4' : fontSize > 12 ? '1.3' : '1.2';
  return { fontSize: `${fontSize.toFixed(1)}px`, lineHeight };
};

export const PosterTemplates: React.FC<PosterTemplateProps> = ({ pet, settings, setPet, isPrintable = true }) => {
  const printClass = isPrintable ? 'poster-print-container' : 'poster-preview-only';
  const [copied, setCopied] = React.useState(false);

  const handleCopyBio = () => {
    const textToCopy = pet.estimatedBio || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];
  const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
  const secondaryPhotos = pet.photos.slice(1, 3);
  
  const getFontFamilyClass = () => {
    switch (settings.templateId) {
      case 'whimsical':
        return 'font-playful select-none';
      case 'minimalist':
        return 'font-sans';
      case 'editorial':
      case 'editorial-2-photos':
        return 'font-serif';
      case 'comic':
      case 'comic-2-photos':
        return 'font-outfit tracking-tight';
      case 'polaroid':
        return 'font-sans';
      default:
        return 'font-sans';
    }
  };

  const renderCompatLabel = (val: string) => {
    switch (val) {
      case 'yes':
        return <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded text-[9.5px] font-bold font-sans">✓ Yes</span>;
      case 'no':
        return <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 border border-rose-300 px-1.5 py-0.5 rounded text-[9.5px] font-bold font-sans">✗ No</span>;
      case 'selective':
        return <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded text-[9.5px] font-bold font-sans">✦ Select</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-stone-500 bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded text-[9.5px] font-normal font-sans">? Unknown</span>;
    }
  };

  const getBadgeStyle = () => {
    switch (settings.templateId) {
      case 'comic':
      case 'comic-2-photos':
        return 'bg-yellow-300 text-stone-900 border-2 border-stone-900 tracking-wider font-extrabold shadow-[2px_2px_0px_#000000] rounded-sm';
      case 'editorial':
      case 'editorial-2-photos':
        return 'bg-stone-900 text-white tracking-[0.15em] uppercase font-bold text-[9px] px-3 py-1 rounded-none';
      case 'minimalist':
        return 'bg-stone-100 text-stone-900 border border-stone-300 tracking-wider uppercase font-semibold text-[9px] px-3 py-0.5 rounded-md';
      case 'polaroid':
        return 'bg-rose-500 text-white font-serif px-4 py-0.5 tracking-wide shadow-sm rounded-full';
      case 'whimsical':
        return 'bg-amber-100 text-[#0f5c3a] border-2 border-dashed border-[#0f5c3a]/55 tracking-wide font-handwritten font-black text-[12px] md:text-[13.5px] px-3.5 py-0.5 shadow-2xs rounded-tl-[15px] rounded-br-[12px] rotate-[-1.5deg]';
      default:
        return `${currentTheme.badgeBg} border rounded-full font-bold px-4 py-0.5 text-xs tracking-wide shadow-3xs`;
    }
  };

  // Convert comparative yes/no labels cleanly to visual markers for index spreadsheets
  const renderTableCheckmark = (val: string) => {
    switch (val) {
      case 'yes':
        return <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide">YES</span>;
      case 'no':
        return <span className="text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide">NO</span>;
      case 'selective':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide">SELECTIVE</span>;
      default:
        return <span className="text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded text-[8px] font-bold">N/A</span>;
    }
  };

  if (settings.aspectRatio === 'square') {
    if (settings.templateId === 'bio-only') {
      return (
        <div 
          id="print-poster-card" 
          className={`${printClass} aspect-ratio-square w-full h-full relative bg-amber-50/15 border border-stone-200 rounded-2xl flex flex-col justify-between p-6 selection:bg-indigo-100 font-sans text-stone-800`}
        >
          {/* Header Action Row */}
          <div className="flex items-center justify-between border-b border-stone-150 pb-3.5 mb-3 shrink-0 select-none">
            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-widest font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-550"></span>
              <span>Adoption Listing Biography</span>
            </div>
            <button
              type="button"
              onClick={handleCopyBio}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-[10px] font-black tracking-wide flex items-center gap-1.5 border transition-all ${
                copied 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-indigo-600 border-indigo-750 text-white hover:bg-indigo-700 shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Clean, high-density copyholder readable content area */}
          <div className="flex-1 flex flex-col justify-start overflow-hidden pr-1 leading-relaxed min-h-0 select-text">
            <p 
              className="font-serif text-stone-855 leading-relaxed text-left select-text whitespace-pre-wrap pr-1"
              style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!", "bio-only", true)}
            >
              {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
            </p>
          </div>

          {/* Quick info-tag at the bottom */}
          <div className="border-t border-stone-150 pt-3 mt-3.5 text-center text-[10px] font-medium text-stone-500 shrink-0 select-none leading-relaxed">
            Copy and paste your final biography to wherever your pet may be seen by others - social media, petfinder, etc. Descriptions are best alongside cute photos!
          </div>
        </div>
      );
    }

    if (settings.templateId === 'extreme-duo') {
      const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
      const secondaryPhoto = pet.photos.length > 1 ? pet.photos[1] : null;

      return (
        <div 
          id="print-poster-card" 
          className={`${printClass} aspect-ratio-square w-full h-full relative border flex flex-col justify-between overflow-hidden p-[12px] md:p-[14px] selection:bg-rose-105 shadow-2xl bg-white border-slate-250 rounded-2xl ${getFontFamilyClass()} ${currentTheme.textClass}`}
        >
          {/* Subtle themed background */}
          <div className={`absolute inset-0 pointer-events-none -z-10 ${currentTheme.bgClass}`}></div>
          <div className="absolute inset-2 border border-slate-350/20 rounded-xl pointer-events-none -z-10"></div>
          <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-300/50 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>

          {/* 1. Header (Compact and clean) */}
          <div className="flex items-center justify-between w-full border-b border-stone-250 pb-1 mt-0 select-none shrink-0 leading-none">
            <div className="text-left py-0.5">
              <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900 font-sans">
                Meet {pet.name || 'Lovely Foster'}!
              </h1>
            </div>
            <div className="flex flex-col items-end text-right gap-1 shrink-0 select-none leading-none">
              <span className={`inline-flex items-center justify-center font-black uppercase tracking-widest text-[7px] px-1.5 py-0.5 rounded leading-none transition-all duration-300 ${getBadgeStyle()}`}>
                {settings.headingText || 'Adopt Me!'}
              </span>
              {pet.breed && (
                <div className="text-[8.5px] font-black uppercase tracking-wider text-stone-550 block">
                  🐾 {pet.breed}
                </div>
              )}
            </div>
          </div>

          {/* 2. Photo Grid (Two GIANT Photos side-by-side, taking up 55% height, reduced margins) */}
          <div className="grid grid-cols-2 gap-2 mt-1 mb-1 h-[55%] shrink-0 relative">
            {/* Photo 1 */}
            <div className="relative h-full rounded-xl overflow-hidden border bg-stone-50 border-slate-250/75 shadow-3xs">
              {primaryPhoto ? (
                <RepositionableImage 
                  src={primaryPhoto} 
                  alt={`${pet.name} Photo 1`} 
                  pet={pet} 
                  setPet={setPet} 
                  className="rounded-xl"
                  isSecondary={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-3 opacity-80">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
            </div>

            {/* Photo 2 */}
            <div className="relative h-full rounded-xl overflow-hidden border bg-stone-50 border-slate-250/75 shadow-3xs">
              {secondaryPhoto ? (
                <RepositionableImage 
                  src={secondaryPhoto} 
                  alt={`${pet.name} Photo 2`} 
                  pet={pet} 
                  setPet={setPet} 
                  className="rounded-xl"
                  isSecondary={true}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-3 opacity-50">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
            </div>
          </div>

          {/* 3. Horizontal Story Box (Simple & Focused on the bio description - no scroll bar, expanded space) */}
          <div className="flex-1 min-h-0 relative select-text text-left pt-1 pb-1 overflow-hidden">
            <p 
              className="font-serif whitespace-pre-wrap select-text leading-relaxed text-slate-805"
              style={getDynamicBioStyle(pet.estimatedBio || "Use our AI generator or write a custom detailed bio for this sweetheart here! Showing giant beautiful photos helps captivate families instantly.", 'extreme-duo', true)}
            >
              {pet.estimatedBio || "Use our AI generator or write a custom detailed bio for this sweetheart here! Showing giant beautiful photos helps captivate families instantly."}
            </p>
          </div>

          {/* 4. Pure Footer with Rescue Details (No city & state location for extreme-duo) */}
          <div className="border-t border-slate-200/80 pt-1.5 select-none shrink-0 text-left">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-[10px] font-black text-rose-600 block uppercase tracking-wider leading-none">
                    {pet.rescueOrg || 'Independent Foster Direct Adoptions'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[8.5px] font-bold text-slate-500 leading-none">
                  {pet.fosterEmail && (
                    <span className="flex items-center gap-0.5">
                      <Mail className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                      <span className="truncate">{pet.fosterEmail}</span>
                    </span>
                  )}
                  {pet.fosterPhone && (
                    <span className="flex items-center gap-0.5">
                      <Phone className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                      <span>{pet.fosterPhone}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Website QR Code / Heart placeholder */}
              <div className="py-1 px-1.5 border border-slate-205 rounded-xl bg-slate-50/10 text-slate-650 flex items-center justify-between gap-1 shrink-0">
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[7.5px] font-extrabold text-[#111827] max-w-[85px] truncate block leading-tight">
                    {pet.rescueWebsite ? pet.rescueWebsite.replace('https://', '').replace('http://', '').replace('www.', '') : 'Inquire Online'}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 p-0.5 rounded-lg w-7 h-7 relative flex items-center justify-center shrink-0">
                  {pet.rescueWebsite ? (
                    <QRCodeImage 
                      url={pet.rescueWebsite} 
                      className="w-full h-full object-contain" 
                      darkColor="#0f172a" 
                      lightColor="#ffffff00" 
                    />
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-rose-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (settings.templateId === 'two-photos' || settings.templateId === 'comic-2-photos') {
      const isComic2 = settings.templateId === 'comic-2-photos';
      const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
      const secondaryPhoto = pet.photos.length > 1 ? pet.photos[1] : null;
      
      return (
        <div 
          id="print-poster-card" 
          className={`${printClass} aspect-ratio-square w-full h-full relative border flex flex-col justify-between overflow-hidden p-[12px] md:p-[14px] selection:bg-rose-105 shadow-2xl ${
            isComic2 
              ? 'bg-[#fefaf2] border-pink-100 rounded-3xl' 
              : 'bg-white border-slate-250 rounded-2xl'
          } ${getFontFamilyClass()} ${currentTheme.textClass}`}
        >
          {/* Subtle themed backgrounds */}
          <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-300/50 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>
          {isComic2 ? (
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-[#fefaf2]">
              <div className="absolute top-2 right-4 text-rose-300 opacity-55 text-3xl font-sans font-normal">♥</div>
              <div className="absolute top-8 right-10 text-rose-200 opacity-40 text-xl font-sans font-normal">♥</div>
              <div className="absolute bottom-20 left-4 text-rose-200 opacity-30 text-2xl font-sans font-normal">♥</div>
              <div className="absolute bottom-10 right-14 text-rose-100 opacity-20 text-4xl font-sans font-normal">🐾</div>
              <div className="absolute inset-2 border border-pink-100/60 rounded-2xl opacity-60 pointer-events-none"></div>
            </div>
          ) : (
            <>
              <div className={`absolute inset-0 pointer-events-none -z-10 ${currentTheme.bgClass}`}></div>
              <div className="absolute inset-2 border border-slate-350/20 rounded-xl pointer-events-none -z-10"></div>
            </>
          )}
          
          {/* 1. Header (Very Compact) */}
          <div className="flex items-center justify-between w-full border-b border-stone-200 pb-1 mt-0 select-none shrink-0 leading-none">
            <div className="flex flex-col text-left">
              <span className={`inline-flex items-center text-center justify-center font-black uppercase tracking-wider text-[7px] px-1.5 py-0.5 rounded leading-none transition-all duration-300 ${getBadgeStyle()} mb-0.5`}>
                {isComic2 && <Heart className="w-2.5 h-2.5 mr-0.5 text-rose-500" />}
                <span>{settings.headingText || 'Adopt Me!'}</span>
              </span>
              <h1
                className={`text-lg md:text-xl font-bold tracking-tight leading-none ${
                  isComic2 ? 'font-extrabold font-playful' : 'text-slate-900 font-sans'
                }`}
                style={isComic2 ? { color: currentTheme.themeColorHex } : undefined}
              >
                Meet {pet.name || 'Lovely Foster'}!
              </h1>
            </div>
            {/* Minimal species badge */}
            <div className={`text-[8.5px] font-bold rounded-full px-2 py-0.5 capitalize shrink-0 border ${
              isComic2
                ? `${currentTheme.badgeBg}`
                : 'text-slate-550 bg-slate-50 border-slate-200'
            }`}>
              {isComic2 ? '🌸' : '🌿'} {pet.breed || pet.species}
            </div>
          </div>

          {/* 2. Photo Grid (Takes up space for 2 photos) */}
          <div className="grid grid-cols-2 gap-2 my-1 h-[50%] shrink-0 relative">
            {/* Photo 1 Container */}
            <div className={`relative h-full rounded-xl overflow-hidden border bg-slate-50 group ${isComic2 ? 'border-pink-200/80 shadow-3xs' : 'border-slate-200'}`}>
              {primaryPhoto ? (
                <RepositionableImage 
                  src={primaryPhoto} 
                  alt={`${pet.name} Photo 1`} 
                  pet={pet} 
                  setPet={setPet} 
                  className="rounded-xl"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
            </div>

            {/* Photo 2 Container */}
            <div className={`relative h-full rounded-xl overflow-hidden border bg-slate-50 group ${isComic2 ? 'border-pink-200/80 shadow-3xs' : 'border-slate-200'}`}>
              {secondaryPhoto ? (
                <RepositionableImage 
                  src={secondaryPhoto} 
                  alt={`${pet.name} Photo 2`} 
                  pet={pet} 
                  setPet={setPet} 
                  className="rounded-xl"
                  isSecondary={true}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-3 opacity-60">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
            </div>
          </div>

          {/* 3. Concise Info & Story Box */}
          <div className="flex-1 flex gap-2 min-h-0 relative select-text pt-0.5">
            {/* Concise Story Block (58%) */}
            <div className="w-[58%] flex flex-col justify-start text-left min-h-0">
              <div className="overflow-hidden pr-1 flex-1 leading-snug select-text">
                <p 
                  className={`font-serif whitespace-pre-wrap select-text leading-normal ${
                    isComic2 ? 'text-stone-850' : 'text-slate-800'
                  }`}
                  style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some animal information to write a custom biography. This space keeps things tidy and sweet!", settings.templateId, true)}
                >
                  {pet.estimatedBio || "Please fill in some animal information to write a custom biography. This space keeps things tidy and sweet!"}
                </p>
              </div>
            </div>

            {/* Fast Stats Row (42%) */}
            <div className={`w-[42%] flex flex-col justify-start gap-1 border-l pl-2 select-none h-full min-h-0 ${
              isComic2 ? 'border-pink-100/70' : 'border-slate-250/50'
            }`}>
              <div className="flex flex-col gap-0.5">
                {/* Basic info box */}
                <div className={`p-1.5 rounded border flex flex-col gap-1.5 text-[8.5px] font-bold ${
                  isComic2
                    ? 'bg-[#fffcfb] border-pink-200/60 text-slate-700'
                    : `${currentTheme.bgClass} ${currentTheme.borderClass} text-slate-700`
                }`}>
                  <div className={`flex justify-start items-center border-b border-dashed pb-1 ${
                    isComic2 ? 'border-pink-105' : 'border-slate-200/50'
                  }`}>
                    <span className={`${isComic2 ? 'text-rose-600' : 'text-slate-900'} font-extrabold truncate text-[10px]`}>
                      {pet.age || 'Unknown'}{pet.weight ? `, ${pet.weight}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isComic2 ? 'text-pink-400' : 'text-slate-404'} text-[7px] uppercase shrink-0`}>Housetrained</span>
                    <span className={`${isComic2 ? 'text-rose-700' : 'text-slate-900'} font-extrabold max-w-[55px] truncate`}>{pet.houseTrained === 'yes' ? '✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : '✗'}</span>
                  </div>
                </div>

                {/* Social compatibility boxes (1 word & answer below in separate boxes) */}
                <div className="grid grid-cols-3 gap-0.5">
                  <div className={`${isComic2 ? 'bg-pink-50/50 border-pink-100/60' : 'bg-[#fcfdfd]/95 border-slate-200/80'} border p-1 rounded text-center`}>
                    <span className={`text-[6px] block font-bold uppercase leading-none ${isComic2 ? 'text-pink-500' : 'text-slate-404'}`}>DOGS</span>
                    <span className={`${isComic2 ? 'text-rose-755' : 'text-slate-900'} text-[7.5px] font-black leading-none block mt-0.5`}>
                      {pet.goodWithDogs === 'yes' ? 'Yes' : pet.goodWithDogs === 'no' ? 'No' : 'Maybe'}
                    </span>
                  </div>
                  <div className={`${isComic2 ? 'bg-pink-50/50 border-pink-100/60' : 'bg-[#fcfdfd]/95 border-slate-200/80'} border p-1 rounded text-center`}>
                    <span className={`text-[6px] block font-bold uppercase leading-none ${isComic2 ? 'text-pink-500' : 'text-slate-404'}`}>CATS</span>
                    <span className={`${isComic2 ? 'text-rose-755' : 'text-slate-900'} text-[7.5px] font-black leading-none block mt-0.5`}>
                      {pet.goodWithCats === 'yes' ? 'Yes' : pet.goodWithCats === 'no' ? 'No' : 'Maybe'}
                    </span>
                  </div>
                  <div className={`${isComic2 ? 'bg-pink-50/50 border-pink-100/60' : 'bg-[#fcfdfd]/95 border-slate-200/80'} border p-1 rounded text-center`}>
                    <span className={`text-[6px] block font-bold uppercase leading-none ${isComic2 ? 'text-pink-500' : 'text-slate-404'}`}>KIDS</span>
                    <span className={`${isComic2 ? 'text-rose-755' : 'text-slate-900'} text-[7.5px] font-black leading-none block mt-0.5`}>
                      {pet.goodWithKids === 'yes' ? 'Yes' : pet.goodWithKids === 'no' ? 'No' : 'Maybe'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personality traits moved under basic info/compatibility space */}
              {pet.traits.length > 0 && (
                <div className="flex flex-wrap gap-0.5">
                  {pet.traits.slice(0, 3).map((t, idx) => (
                    <span key={idx} className={`text-[7.5px] font-bold border px-1 py-0.5 rounded capitalize leading-none inline-flex items-center whitespace-nowrap shrink-0 ${currentTheme.badgeBg}`}
                    >
                      <span className="mr-0.5 shrink-0 text-[7px]">✨</span>
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Contact Row (Very Compact) */}
          <div className={`mt-1 pt-1 border-t flex items-center justify-between z-10 w-full shrink-0 ${
            isComic2 ? 'border-pink-100' : 'border-slate-200'
          }`}>
            <div className="flex flex-col text-left min-w-0 max-w-[72%]">
              <h4 className={`text-[9px] md:text-[9.5px] font-extrabold truncate leading-none ${
                isComic2 ? 'text-rose-800' : 'text-stone-900'
              }`}>
                {pet.rescueOrg || 'Independent Foster Partner'}
              </h4>
              <p className="text-[7.5px] text-stone-500 font-medium truncate mt-0.5">
                {[pet.fosterEmail, pet.fosterPhone].filter(Boolean).join(' • ')}
              </p>
            </div>
            
            {/* Tiny QR Code Indicator */}
            {pet.rescueWebsite ? (
              <div className={`border p-0.5 rounded-lg w-6.5 h-6.5 flex items-center justify-center shrink-0 shadow-3xs ${
                isComic2 ? 'bg-[#fffcfb] border-pink-200' : 'bg-stone-50 border-stone-200'
              }`}>
                <QRCodeImage 
                  url={pet.rescueWebsite} 
                  className="w-full h-full object-contain" 
                  darkColor={isComic2 ? currentTheme.themeColorHex : '#1c1917'}
                  lightColor="#ffffff00"
                />
              </div>
            ) : (
              <Heart className="w-4.5 h-4.5 text-rose-300" style={{ color: isComic2 ? currentTheme.themeColorHex : undefined }} />
            )}
          </div>
          
          <div
            className={`absolute bottom-0 inset-x-0 h-[3px] opacity-90 ${!isComic2 ? 'bg-gradient-to-r from-teal-400 via-[#4f46e5] to-red-400' : ''}`}
            style={isComic2 ? { backgroundColor: currentTheme.themeColorHex } : undefined}
          ></div>
        </div>
      );
    }

    if (settings.templateId === 'editorial-2-photos') {
      const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
      const secondaryPhoto = pet.photos.length > 1 ? pet.photos[1] : null;

      return (
        <div
          id="print-poster-card"
          className={`${printClass} aspect-ratio-square w-full h-full relative border flex flex-col justify-between overflow-hidden p-4 selection:bg-rose-105 shadow-2xl bg-white border-slate-200 rounded-2xl font-serif ${currentTheme.textClass}`}
        >
          {/* Editorial black borders */}
          <div className="absolute inset-0 pointer-events-none -z-10 border-t-[5px] border-b-[5px] border-stone-900">
            <div className="absolute inset-3 border border-stone-200/60"></div>
          </div>
          <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-400/40 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>

          {/* Header */}
          <div className="flex items-center gap-2 shrink-0 border-b-2 border-stone-900 pb-2 select-none">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-serif font-black tracking-tight text-stone-900 leading-none">
                Meet {pet.name || 'Lovely Foster'}!
              </h1>
              <p className="text-[8px] uppercase tracking-[0.12em] text-stone-500 font-sans font-semibold mt-1 leading-none">
                A {pet.breed || pet.species} seeking a loving home
              </p>
            </div>
            <div className={`inline-flex items-center text-center justify-center transition-all ${getBadgeStyle()} shrink-0`}>
              <span className="font-bold uppercase tracking-wider text-[8px] px-2 py-0.5 leading-none">{settings.headingText || 'Adopt Me!'}</span>
            </div>
          </div>

          {/* 2-column main area */}
          <div className="flex-1 grid gap-2 z-10 h-full items-stretch w-full min-h-0 mt-2" style={{ gridTemplateColumns: '1fr 1fr' }}>

            {/* LEFT: bio + traits + compat */}
            <div className="flex flex-col h-full select-text space-y-1.5 font-sans min-h-0 overflow-hidden">
              {pet.traits.length > 0 && (
                <div className="flex flex-wrap gap-0.5 shrink-0">
                  {pet.traits.slice(0, 4).map((t, idx) => {
                    const capTrait = t.charAt(0).toUpperCase() + t.slice(1);
                    return (
                      <span key={idx} className={`inline-flex items-center whitespace-nowrap shrink-0 text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-full ${currentTheme.badgeBg} border border-opacity-45 shadow-3xs`}>
                        <span className="mr-0.5 shrink-0">✨</span>
                        <span>{capTrait}</span>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="flex-1 min-h-0 overflow-hidden">
                <div className="h-full bg-[#fcfbf9] border border-stone-200/70 p-1.5 rounded-lg overflow-hidden flex flex-col justify-start select-text">
                  <p
                    className="italic text-slate-700 select-text"
                    style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information to generate a charming adoption story for this lovely foster pet.", 'editorial-2-photos', true)}
                  >
                    {pet.estimatedBio || "Please fill in some basic animal information to generate a charming adoption story for this lovely foster pet."}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 shrink-0">
                {[
                  { label: 'Dogs', val: pet.goodWithDogs },
                  { label: 'Cats', val: pet.goodWithCats },
                  { label: 'Kids', val: pet.goodWithKids },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 rounded py-0.5 text-center border font-sans ${
                    item.val === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    item.val === 'no' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    'bg-stone-50 border-stone-200 text-stone-500'
                  }`}>
                    <span className="text-[5.5px] uppercase font-black block leading-none">{item.label}</span>
                    <span className="text-[7px] font-black block mt-0.5 leading-none">
                      {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: 2 stacked photos */}
            <div className="border-l border-stone-350 pl-2 flex flex-col h-full gap-1.5 min-h-0 overflow-hidden">
              <div className="flex-1 relative overflow-hidden border-[2px] border-stone-900 group min-h-0">
                {primaryPhoto ? (
                  <RepositionableImage src={primaryPhoto} alt={`${pet.name} Photo 1`} pet={pet} setPet={setPet} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-stone-50">
                    <PetSvgIllustration species={pet.species} />
                  </div>
                )}
              </div>
              <div className="flex-1 relative overflow-hidden border-[2px] border-stone-900 group min-h-0">
                {secondaryPhoto ? (
                  <RepositionableImage src={secondaryPhoto} alt={`${pet.name} Photo 2`} pet={pet} setPet={setPet} isSecondary={true} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-stone-50 opacity-60">
                    <PetSvgIllustration species={pet.species} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1.5 pt-1.5 border-t-2 border-stone-900 flex items-center justify-between z-10 w-full shrink-0 select-text">
            <div className="flex flex-col text-left min-w-0 gap-0.5 font-sans">
              <h5 className="text-[9px] font-black text-stone-900 leading-none truncate">{pet.rescueOrg || 'Independent Rescuer'}</h5>
              <span className="text-[7.5px] text-stone-500 font-medium truncate">{[pet.fosterEmail, pet.fosterPhone].filter(Boolean).join(' • ')}</span>
            </div>
            {pet.rescueWebsite && (
              <div className="bg-white border border-stone-200 p-0.5 rounded w-7 h-7 flex items-center justify-center shrink-0 ml-2">
                <QRCodeImage url={pet.rescueWebsite} className="w-full h-full object-contain" darkColor="#0f172a" lightColor="#ffffff" />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        id="print-poster-card"
        className={`${printClass} aspect-ratio-square w-full h-full relative border flex flex-col justify-between overflow-hidden p-4 selection:bg-rose-105 shadow-2xl ${settings.templateId === 'whimsical' ? 'bg-[#fdfbf6] border-[#b3cca8]/25 rounded-3xl' : settings.templateId === 'comic' ? 'bg-[#fefaf2] border-pink-100 rounded-3xl' : 'bg-white border-slate-200 rounded-2xl'} ${getFontFamilyClass()} ${currentTheme.textClass}`}
      >
        {/* BACKGROUND GRAPHICS */}
        <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-300/50 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>
        {settings.templateId === 'whimsical' && (
          <>
            <div className="absolute inset-2 pointer-events-none -z-10 border-2 border-dashed border-[#2d5a27]/15 rounded-2xl"></div>
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-35">
              <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-rose-100/35 mix-blend-multiply filter blur-xl"></div>
              <div className="absolute bottom-6 right-6 w-36 h-36 rounded-full bg-orange-100/35 mix-blend-multiply filter blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-teal-100/20 mix-blend-multiply filter blur-lg"></div>
              <div className="absolute top-3 right-3 text-rose-200/40 text-[10px]">🐾</div>
              <div className="absolute top-12 left-12 text-teal-200/40 text-[11px]">✨</div>
              <div className="absolute bottom-3 left-3 text-orange-200/40 text-[10px]">🎾</div>
            </div>
          </>
        )}

        {settings.templateId === 'comic' && (
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" style={{background: 'radial-gradient(ellipse at 72% 22%, #ffe4ef 0%, #fff5f9 40%, #fefaf2 100%)'}}>
            {/* Sweet Romance — SVG hearts replacing unicode chars */}
            <svg className="absolute top-3 right-5 w-12 h-12 text-rose-300 opacity-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <svg className="absolute top-8 right-14 w-7 h-7 text-rose-200 opacity-40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <svg className="absolute bottom-24 left-4 w-9 h-9 text-rose-200 opacity-30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <svg className="absolute top-[38%] left-2 w-5 h-5 text-rose-200 opacity-[0.18] rotate-[-12deg]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <div className="absolute inset-3 border border-rose-100/40 rounded-2xl pointer-events-none"></div>
          </div>
        )}

        {settings.templateId === 'polaroid' && (
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[#faf8f5] border-[6px] border-white shadow-inner font-mono">
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-stone-100/30 to-transparent"></div>
          </div>
        )}

        {settings.templateId === 'editorial' && (
          <div className="absolute inset-0 pointer-events-none -z-10 border-t-[5px] border-b-[5px] border-stone-900 font-sans">
            <div className="absolute inset-3 border border-stone-200/60"></div>
          </div>
        )}

        {/* ========== CLEAN MODERN SQUARE: FULL-WIDTH PHOTO STRIP LAYOUT ========== */}
        {settings.templateId === 'minimalist' && (
          <div className="flex flex-col h-full z-10 gap-1.5">

            {/* Header row */}
            <div className="flex items-center justify-between shrink-0 border-b border-stone-200 pb-1.5 select-none">
              <div className="min-w-0">
                <h1 style={{ color: currentTheme.themeColorHex }} className="text-[20px] font-sans font-black tracking-tight uppercase leading-none truncate">
                  {pet.name || 'Lovely Foster'}
                </h1>
                <p className="text-[8px] font-semibold text-stone-500 mt-0.5 leading-none truncate">
                  {pet.breed} &nbsp;·&nbsp; {pet.location || 'Local Area'} &nbsp;·&nbsp; {pet.age || 'Age N/A'}
                </p>
              </div>
              <div style={{ backgroundColor: currentTheme.themeColorHex }} className="w-8 h-8 rounded-full flex flex-col items-center justify-center text-center text-white tracking-widest text-[6.5px] uppercase font-black shadow-md shrink-0 ml-2">
                <span className="leading-tight">Adopt</span>
                <span className="leading-tight font-extrabold text-[7.5px]">Me!</span>
              </div>
            </div>

            {/* Full-width landscape photo strip */}
            <div className="flex-[5] min-h-0 w-full overflow-hidden relative rounded-xl border border-slate-100 shadow-sm group">
              {primaryPhoto ? (
                <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-amber-50/50">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
              <div className={`absolute top-1.5 right-1.5 flex flex-col items-center justify-center text-center w-7 h-7 rounded-full border shadow-sm ${currentTheme.badgeBg} border-opacity-45 p-1 z-10`}>
                <Heart className="w-2.5 h-2.5 text-red-500 shrink-0" />
              </div>
            </div>

            {/* Traits row */}
            {pet.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 shrink-0">
                {pet.traits.map((t, idx) => {
                  const capTrait = t.charAt(0).toUpperCase() + t.slice(1);
                  return (
                    <span key={idx} className={`inline-flex items-center whitespace-nowrap shrink-0 text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-full ${currentTheme.badgeBg} border border-opacity-45 shadow-3xs`}>
                      <span className="mr-0.5 shrink-0">✨</span>
                      <span>{capTrait}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Bio box */}
            <div className="flex-[4] min-h-0 overflow-hidden">
              <div className="h-full bg-stone-50/80 border border-slate-200/40 p-2 rounded-xl shadow-2xs overflow-hidden flex flex-col justify-start select-text">
                <p
                  className="indent-1 first-letter:text-lg first-letter:font-black first-letter:mr-0.5 italic text-slate-700 select-text"
                  style={getDynamicBioStyle(pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles.", 'minimalist', true)}
                >
                  {pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles."}
                </p>
              </div>
            </div>

            {/* Stats pills + compat strip + contact footer */}
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex flex-wrap gap-1">
                {[
                  { label: pet.breed || 'Unknown' },
                  { label: pet.age || 'Age N/A' },
                  { label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown sex' },
                  { label: pet.weight || 'Medium' },
                  { label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                ].map((item, i) => (
                  <span key={i} className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${currentTheme.bgClass} border ${currentTheme.borderClass} text-slate-700`}>
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                {[
                  { label: 'Dogs', val: pet.goodWithDogs },
                  { label: 'Cats', val: pet.goodWithCats },
                  { label: 'Kids', val: pet.goodWithKids },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 rounded-lg py-1.5 text-center border ${
                    item.val === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    item.val === 'no' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    'bg-stone-50 border-stone-200 text-stone-500'
                  }`}>
                    <span className="text-[9px] uppercase font-black block leading-none">{item.label}</span>
                    <span className="text-[12px] font-black block mt-0.5 leading-none">
                      {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col text-left min-w-0">
                  <h5 className="text-[8px] font-black text-slate-900 leading-none truncate">{pet.rescueOrg || 'Independent Rescuer'}</h5>
                  <span className="text-[7px] text-slate-500 font-bold mt-0.5 truncate leading-none">{pet.fosterEmail || pet.rescueWebsite || ''}</span>
                </div>
                {pet.rescueWebsite && (
                  <div className="bg-white border border-slate-200 p-0.5 rounded w-7 h-7 flex items-center justify-center shrink-0 ml-2">
                    <QRCodeImage url={pet.rescueWebsite} className="w-full h-full object-contain" darkColor="#0f172a" lightColor="#ffffff" />
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* HIGH-DENSITY 2-COLUMN CROWDED VIEW */}
        {settings.templateId !== 'minimalist' && (
        <div className="grid grid-cols-12 gap-2.5 h-full z-10">
          
          {/* LEFT SIDE: DETAILS, BULLETS, STORIES */}
          <div className={`${settings.templateId === 'polaroid' ? 'col-span-5' : 'col-span-6'} flex flex-col justify-between h-full py-0.5 pr-0.5`}>            {/* COMPACT HEADLINES */}
            <div>
              {settings.templateId === 'whimsical' ? (
                <div className="flex items-center justify-between gap-1 w-full mt-1.5 border-b border-[#2d5a27]/15 pb-1.5 shrink-0 select-none">
                  <div className="relative inline-block mt-0.5 pl-1">
                    <h1 className="text-[24px] font-handwritten font-black tracking-tight text-[#0f5c3a] leading-none mb-0.5">
                      Meet {pet.name || 'Lovely Foster'}!
                    </h1>
                    <svg className="absolute -bottom-1.5 left-1 w-[calc(100%-8px)] h-2 text-rose-350 pointer-events-none" fill="none" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M1 5 Q 25 -2, 50 5 T 99 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className={`inline-flex items-center text-center justify-center py-0.5 transition-all duration-300 ${getBadgeStyle()} mr-1 shrink-0`}>
                    <Sparkles className="w-2.5 h-2.5 mr-0.5 text-orange-500" />
                    <span className="font-bold uppercase tracking-wider text-[8px] px-1.5 py-0.5">{settings.headingText || 'Adopt Me!'}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center text-center justify-center font-black uppercase tracking-wider text-[8px] px-2 py-0.5 rounded leading-none transition-all duration-300 ${getBadgeStyle()}`}>
                      {settings.templateId === 'comic' && <Heart className="w-2.5 h-2.5 mr-0.5 text-rose-500" />}
                      <span>{settings.headingText || 'Adopt Me!'}</span>
                    </span>
                  </div>

                  {/* Toned Down Pet Name Headline */}
                  {settings.templateId === 'editorial' ? (
                    <div className="mt-1">
                      <h1 className="text-xl font-serif font-black tracking-tight text-stone-900 border-b border-stone-800 uppercase inline-block leading-none mt-0.5">
                        Meet {pet.name || 'Lovely Foster'}!
                      </h1>
                    </div>
                  ) : settings.templateId === 'comic' ? (
                    <div className="flex flex-col items-start mb-1 w-full relative select-none">
                      <h1 className="text-xl font-extrabold tracking-tight text-[#db2777] font-playful relative leading-none mb-1 text-shadow-3xs">
                        Meet {pet.name || 'Lovely Foster'}!
                      </h1>
                      
                      {/* Hand-drawn style pink brush banner for tagline */}
                      <div className="bg-[#db2777] text-white px-2.5 py-0.5 text-[8.5px] font-bold font-sans uppercase tracking-wider rounded shadow-3xs border border-white/10 flex items-center justify-center gap-1 rotate-[-0.5deg] max-w-[100%] leading-none">
                        <span>💖 A sweet {pet.gender === 'girl' ? 'female' : pet.gender === 'boy' ? 'male' : 'companion'}!</span>
                      </div>
                    </div>
                  ) : settings.templateId === 'polaroid' ? (
                    <div className="mt-0.5">
                      <h1 className="text-xl font-serif font-bold text-stone-800 leading-none">
                        Meet {pet.name || 'Sweet Pet'}!
                      </h1>
                    </div>
                  ) : (
                    <div className="mt-0.5">
                      <h1 className="text-2xl font-display font-extrabold tracking-tight capitalize leading-none font-sans text-stone-900">
                        Meet {pet.name || 'Lovely Foster'}!
                      </h1>
                    </div>
                  )}
                </>
              )}

              {/* Compact subtitle details */}
              <div className="mt-1 font-bold text-[9.5px] text-slate-500">
                {settings.templateId === 'comic' ? (
                  <span className="font-extrabold text-[#db2777] block text-[9px] tracking-tight leading-none">
                    💖 Adoptable {pet.breed}
                  </span>
                ) : settings.templateId === 'editorial' ? (
                  <span className="text-[8px] uppercase tracking-[0.1em] text-stone-605 block italic leading-none">
                    {pet.breed} seeking safe harbor
                  </span>
                ) : settings.templateId === 'whimsical' ? (
                  <span className="inline-block text-[11.5px] font-bold text-[#2d5a27]/85 leading-none font-handwritten mt-2.5 select-text">
                    🌿 {pet.breed} • {pet.location || 'Local Area'}
                  </span>
                ) : (
                  <span className="inline-block text-[10px] font-semibold text-slate-500 leading-none">
                    💖 {pet.breed} • {pet.location}
                  </span>
                )}
              </div>
            </div>

            {/* TRAIT BADGES (Brings high informational density to the Instagram square version!) */}
            {pet.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-start my-1.5 shrink-0">
                {pet.traits.map((t, idx) => {
                  const capTrait = t.charAt(0).toUpperCase() + t.slice(1);
                  if (settings.templateId === 'whimsical') {
                    const rotations = ['rotate-[1deg]', 'rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]'];
                    const rotation = rotations[idx % rotations.length];
                    return (
                      <span 
                        key={idx} 
                        className={`inline-flex items-center whitespace-nowrap shrink-0 text-[10.5px] font-bold font-handwritten px-2.5 py-0.5 text-emerald-955 bg-[#fffdf0] border border-[#2d5a27]/30 shadow-3xs rounded-tl-lg rounded-br-lg rounded-tr-xs rounded-bl-xs ${rotation} print:transform-none`}
                      >
                        <span className="font-sans mr-1 text-[11px] text-amber-500 shrink-0">🌸</span>
                        <span>{capTrait}</span>
                      </span>
                    );
                  }
                  return (
                    <span 
                      key={idx} 
                      className={`inline-flex items-center whitespace-nowrap shrink-0 text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-full ${currentTheme.badgeBg} border border-opacity-45 shadow-3xs`}
                    >
                      <span className="mr-0.5 shrink-0">✨</span>
                      <span>{capTrait}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* EXPANDED BIO STORY CARD (Much larger text box to fit far more info inside square poster!) */}
            <div className="flex-1 flex flex-col justify-stretch min-h-0 my-1 overflow-hidden">
              {settings.templateId === 'whimsical' ? (
                <div className="h-full bg-[#fdfbf2] border-2 border-dashed border-[#2d5a27]/15 p-3 rounded-[24px_16px_32px_20px] text-[11.5px] font-bold text-stone-850 shadow-3xs overflow-hidden relative select-text flex flex-col justify-start font-playful">
                  <p 
                    className="indent-1 text-stone-700 select-text italic"
                    style={getDynamicBioStyle(pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles.", "whimsical", true)}
                  >
                    {pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles."}
                  </p>
                </div>
              ) : settings.templateId === 'comic' ? (
                <div className="h-full relative flex flex-col justify-start overflow-hidden select-text py-1 pl-3 pr-0.5">
                  <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-rose-200" />
                  <p
                    className="italic text-stone-800 font-semibold select-text leading-snug"
                    style={getDynamicBioStyle(pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles.", "comic", true)}
                  >
                    {pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles."}
                  </p>
                </div>
              ) : (
                <div className="h-full bg-stone-50/80 border border-slate-200/40 p-2.5 rounded-xl text-[9.5px] leading-relaxed font-semibold text-slate-705 shadow-2xs overflow-hidden relative select-text flex flex-col justify-start">
                  <p 
                    className="indent-1 first-letter:text-lg first-letter:font-black first-letter:mr-0.5 italic text-slate-700 select-text"
                    style={getDynamicBioStyle(pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles.", settings.templateId, true)}
                  >
                    {pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles."}
                  </p>
                </div>
              )}
            </div>

            {/* CONTACT FOOTER */}
            <div className="pt-1.5 border-t border-slate-100 flex flex-col text-left shrink-0 font-sans">
              <h5 className="text-[8.5px] font-black text-slate-955 leading-none truncate">{pet.rescueOrg || 'Independent Rescuer'}</h5>
              <div className="text-[7.5px] text-slate-500 font-bold flex flex-wrap gap-x-1 mt-0.5 truncate leading-none">
                {pet.fosterEmail && <span className="opacity-95">{pet.fosterEmail}</span>}
                {pet.fosterEmail && pet.fosterPhone && <span className="text-slate-300">•</span>}
                {pet.fosterPhone && <span className="opacity-95">{pet.fosterPhone}</span>}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: PHOTO SLOT, DETAILED STAT VALUES & INSTANT SCAN QR */}
          <div className={`${settings.templateId === 'polaroid' ? 'col-span-7' : 'col-span-6'} flex flex-col justify-between h-full py-0.5 relative border-l border-slate-100 pl-2`}>
            <div className="flex-1 w-full min-h-0 relative mb-1">
              {settings.templateId === 'polaroid' ? (
                <div className="bg-white p-2 pb-4.5 border border-stone-250 shadow-md rotate-[-0.5deg] w-full max-w-[260px] aspect-[1/1.12] flex flex-col group mx-auto">
                  <div className="w-full aspect-square bg-stone-100 relative rounded-sm overflow-hidden border border-stone-200/50">
                    {primaryPhoto ? (
                      <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-2 bg-amber-50">
                        <PetSvgIllustration species={pet.species} />
                      </div>
                    )}
                  </div>
                  <div className="text-center pt-1.5 flex-1 flex items-center justify-center leading-none shrink-0">
                    <span className="font-serif italic text-rose-850 font-bold text-[8.5px] leading-none">Ready for cuddles! 📷</span>
                  </div>
                </div>
              ) : settings.templateId === 'comic' ? (
                <div className="relative h-full w-full flex items-stretch" style={{padding: '3px 3px 14px 3px'}}>
                  <div className="absolute inset-0 bg-rose-200/20 blur-xl" style={{borderRadius: '55% 45% 48% 52% / 48% 52% 48% 52%'}} />
                  <div
                    className="relative w-full h-full overflow-hidden shadow-[0_6px_24px_rgba(219,39,119,0.20),0_2px_6px_rgba(219,39,119,0.10)]"
                    style={{borderRadius: '52% 48% 56% 44% / 44% 52% 48% 56%'}}
                  >
                    {primaryPhoto ? (
                      <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-4 bg-rose-50/60">
                        <PetSvgIllustration species={pet.species} />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#db2777] text-white px-2.5 py-1 rounded-full text-[7.5px] font-extrabold shadow-md border border-white/30 rotate-[-1deg] flex items-center gap-1 z-20 whitespace-nowrap">
                    <Heart className="w-2 h-2 fill-white shrink-0" />
                    <span>Give {pet.name || 'me'} a forever home!</span>
                  </div>
                </div>
              ) : settings.templateId === 'whimsical' ? (
                <div className="bg-[#fffefe] p-1 pb-3 border-2 border-dashed border-[#b3cca8]/40 shadow-md rotate-[-1.5deg] h-full w-full flex flex-col justify-between rounded-[8px_32px_12px_24px] relative">
                  {/* Absolute Taped corners visual effect! */}
                  <div className="absolute -top-1.5 left-4 w-9 h-4 bg-yellow-105/60 backdrop-blur-3xs border-x border-dashed border-stone-500/20 rotate-[12deg] shadow-3xs z-30"></div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-4 bg-indigo-150/45 backdrop-blur-3xs border-y border-dashed border-stone-500/10 rotate-[-15deg] shadow-3xs z-30"></div>
                  
                  <div className="flex-1 h-0 w-full bg-stone-150 relative rounded-[4px_24px_8px_16px] overflow-hidden border border-[#b3cca8]/20">
                    {primaryPhoto ? (
                      <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-2 bg-[#fdfaf2]">
                        <PetSvgIllustration species={pet.species} />
                      </div>
                    )}
                  </div>
                  {/* Little absolute organic doodle floating notes */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col items-center justify-center text-center w-7 h-7 rounded-full bg-rose-100 border border-rose-300 rotate-[10deg] shadow-3xs p-0.5 z-20">
                    <Heart className="w-3 h-3 text-red-500 shrink-0" />
                  </div>
                </div>
              ) : (
                <div className={`w-full h-full overflow-hidden relative rounded-xl border ${currentTheme.borderClass} shadow-3xs group`}>
                  {primaryPhoto ? (
                    <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                  ) : (
                    <div className="w-full h-full absolute inset-0 flex items-center justify-center p-4 bg-amber-50">
                      <PetSvgIllustration species={pet.species} />
                    </div>
                  )}

                  {/* Stamp sticker curve */}
                  <div className={`absolute top-1.5 right-1.5 flex flex-col items-center justify-center text-center w-8 h-8 rounded-full border shadow-3xs ${currentTheme.badgeBg} border-opacity-45 p-0.5 z-20`}>
                    <Heart className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="text-[5.5px] font-black uppercase tracking-tighter leading-none text-slate-800">Loves You</span>
                  </div>

                  {/* Species identifier badge */}
                  <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-3xs text-white px-1.5 py-0.5 text-[6.5px] rounded-full font-black uppercase tracking-wider font-sans">
                    {pet.species === 'other' ? (pet.customSpecies || 'Other') : pet.species}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE STATS MATRIX CARD (Princess / Sweet Romance / Standard designs) */}
            {settings.templateId === 'whimsical' ? (
              <div className="my-1.5 p-2.5 rounded-[22px_10px_18px_26px] border-2 border-dotted border-amber-300/80 bg-[#fffdf5]/80 flex flex-col gap-1.5 shadow-2xs text-[10.5px] md:text-[11px] font-bold text-[#0f5c3a] font-playful relative overflow-hidden">
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 font-playful">
                  <div className="min-w-0 border-b border-dashed border-amber-200 pb-1.5 col-span-2 text-center font-playful">
                    <span className="text-stone-850 font-extrabold block text-[13.5px] md:text-[14.5px] leading-tight break-words font-playful">{pet.breed || 'Unknown'}</span>
                  </div>
                  <div className="min-w-0 border-b border-dashed border-amber-200 pb-1 col-span-2 flex justify-between items-center">
                    <span className="text-[#a27b3e] text-[9.5px] md:text-[10.5px] uppercase font-bold leading-none font-handwritten">Age:</span>
                    <span className="text-stone-850 font-extrabold leading-none text-[11px] md:text-[12px] font-playful">{pet.age || 'Unknown Age'}</span>
                  </div>
                  <div className="min-w-0 border-b border-dashed border-amber-200 pb-1 col-span-2 flex justify-between items-center">
                    <span className="text-[#a27b3e] text-[9.5px] md:text-[10.5px] uppercase font-bold leading-none font-handwritten">Weight:</span>
                    <span className="text-stone-850 font-extrabold leading-none text-[11px] md:text-[12px] font-playful">{pet.weight || 'Medium'}</span>
                  </div>
                  <div className="min-w-0 border-b border-dashed border-amber-200 pb-1.5 col-span-2 flex justify-between items-center">
                    <span className="text-[#a27b3e] text-[9.5px] md:text-[10.5px] uppercase font-bold leading-none font-handwritten">Housetrained?</span>
                    <span className="text-stone-850 font-extrabold leading-none text-[11px] md:text-[12px] font-playful">
                      {pet.houseTrained === 'yes' ? '✓ Yup!' : pet.houseTrained === 'working-on-it' ? 'Learning!' : '✗ Not yet'}
                    </span>
                  </div>
                  <div className="min-w-0 col-span-2">
                    <span className="text-[#a27b3e] block text-[9.5px] md:text-[10.5px] uppercase font-bold leading-none mb-1 font-handwritten text-center">Gets Along Best With:</span>
                    <div className="grid grid-cols-3 gap-1 mt-0.5 text-center text-[8.5px] md:text-[9px] font-bold font-sans">
                      <div className="bg-white/90 border border-amber-200 px-0.5 py-0.5 rounded leading-none">
                        <span className="text-[#a27b3e] text-[6.5px] md:text-[7.5px] block font-bold leading-none uppercase font-sans">DOGS</span>
                        <span className="text-stone-850 font-extrabold leading-none block mt-0.5 text-[8.5px] md:text-[9px] font-sans">{pet.goodWithDogs === 'yes' ? '✓ OK' : pet.goodWithDogs === 'no' ? '✗ No' : '✦ Select'}</span>
                      </div>
                      <div className="bg-white/90 border border-amber-200 px-0.5 py-0.5 rounded leading-none">
                        <span className="text-[#a27b3e] text-[6.5px] md:text-[7.5px] block font-bold leading-none uppercase font-sans">CATS</span>
                        <span className="text-stone-850 font-extrabold leading-none block mt-0.5 text-[8.5px] md:text-[9px] font-sans">{pet.goodWithCats === 'yes' ? '✓ OK' : pet.goodWithCats === 'no' ? '✗ No' : '✦ Select'}</span>
                      </div>
                      <div className="bg-white/90 border border-[#b3cca8] px-0.5 py-0.5 rounded leading-none">
                        <span className="text-[#a27b3e] text-[6.5px] md:text-[7.5px] block font-bold leading-none uppercase font-sans">KIDS</span>
                        <span className="text-stone-850 font-extrabold leading-none block mt-0.5 text-[8.5px] md:text-[9px] font-sans">{pet.goodWithKids === 'yes' ? '✓ OK' : pet.goodWithKids === 'no' ? '✗ No' : '✦ Select'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : settings.templateId === 'comic' ? (
              <div className="my-1 flex flex-col gap-1 font-sans">
                {/* Pill ribbon */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { icon: '🎂', label: pet.age || 'Age N/A' },
                    { icon: '✦', label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown' },
                    { icon: '⚖️', label: pet.weight || 'Medium' },
                    { icon: '🏠', label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                  ].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white/80 border border-rose-100 px-1.5 py-0.5 rounded-full text-[7px] font-bold text-stone-700 shadow-sm shrink-0">
                      <span className="text-[8px] leading-none">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>
                {/* Color-coded compatibility strip */}
                <div className="flex gap-1">
                  {[
                    { label: 'Dogs', val: pet.goodWithDogs },
                    { label: 'Cats', val: pet.goodWithCats },
                    { label: 'Kids', val: pet.goodWithKids },
                  ].map((item, i) => (
                    <div key={i} className={`flex-1 rounded-xl py-1 text-center ${
                      item.val === 'yes' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                      item.val === 'no' ? 'bg-rose-50 border border-rose-200 text-rose-700' :
                      'bg-stone-50 border border-stone-200 text-stone-500'
                    }`}>
                      <span className="text-[5.5px] uppercase font-black block leading-none">{item.label}</span>
                      <span className="text-[7px] font-black block mt-0.5 leading-none">
                        {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* square: minimalist / editorial / polaroid — pill ribbon + compat */
              <div className="my-1 flex flex-col gap-1 font-sans">
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: pet.breed || 'Unknown' },
                    { label: pet.age || 'Age N/A' },
                    { label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown sex' },
                    { label: pet.weight || 'Medium' },
                    { label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                  ].map((item, i) => (
                    <span key={i} className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[7px] font-bold shrink-0 ${
                      settings.templateId === 'editorial'
                        ? 'bg-stone-900 text-white'
                        : settings.templateId === 'polaroid'
                        ? 'bg-stone-100 text-stone-700 border border-stone-300'
                        : `${currentTheme.bgClass} border ${currentTheme.borderClass} text-slate-700`
                    }`}>
                      {item.label}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {[
                    { label: 'Dogs', val: pet.goodWithDogs },
                    { label: 'Cats', val: pet.goodWithCats },
                    { label: 'Kids', val: pet.goodWithKids },
                  ].map((item, i) => (
                    <div key={i} className={`flex-1 rounded-xl py-1 text-center border ${
                      item.val === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                      item.val === 'no' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                      'bg-stone-50 border-stone-200 text-stone-500'
                    }`}>
                      <span className="text-[5.5px] uppercase font-black block leading-none">{item.label}</span>
                      <span className="text-[7px] font-black block mt-0.5 leading-none">
                        {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADOPTION QR CODE CAPTURE */}
            <div className="py-1 px-2 border border-slate-150 rounded-xl bg-sky-50/10 text-slate-700 flex items-center justify-between gap-1.5 shrink-0">
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[11px] font-black text-rose-700 hover:underline truncate block w-full leading-snug">
                  {pet.rescueWebsite ? pet.rescueWebsite.replace('https://', '').replace('http://', '').replace('www.', '') : 'Help me adopt!'}
                </span>
              </div>

              {/* Adoption QR code visualizer */}
              <div className="bg-white border border-slate-200 p-0.5 rounded w-8 h-8 relative flex items-center justify-center shrink-0">
                {pet.rescueWebsite ? (
                  <QRCodeImage 
                    url={pet.rescueWebsite} 
                    className="w-full h-full object-contain" 
                    darkColor="#0f172a" 
                    lightColor="#ffffff" 
                  />
                ) : (
                  <Heart className="w-3.5 h-3.5 text-rose-300" />
                )}
              </div>
            </div>

          </div>

        </div>
        )}

      </div>
    );
  }

  // ==================== US LETTER / PORTRAIT FLYER (8.5x11) ====================
  if (settings.templateId === 'bio-only') {
    return (
      <div 
        id="print-poster-card" 
        className={`${printClass} poster-proportions w-full h-full relative bg-amber-50/15 border border-stone-200 rounded-2xl flex flex-col justify-between p-8 selection:bg-indigo-100 font-sans text-stone-800`}
      >
        {/* Header Action Row */}
        <div className="flex items-center justify-between border-b border-stone-150 pb-4 mb-4 shrink-0 select-none">
          <div className="flex items-center gap-2 text-xs md:text-[13px] text-stone-500 font-bold uppercase tracking-widest font-mono">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-550"></span>
            <span>Adoption Listing Biography</span>
          </div>
          <button
            type="button"
            onClick={handleCopyBio}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 border transition-all ${
              copied 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-indigo-600 border-indigo-750 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Bio Text</span>
              </>
            )}
          </button>
        </div>

        {/* Clean, high-density copyholder readable content area */}
        <div className="flex-1 flex flex-col justify-start overflow-hidden pr-2 leading-relaxed min-h-0 select-text">
          <p 
            className="font-serif text-stone-850 leading-relaxed text-left select-text whitespace-pre-wrap pr-1"
            style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!", "bio-only", false)}
          >
            {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
          </p>
        </div>

        {/* Quick info-tag at the bottom */}
        <div className="border-t border-stone-150 pt-4 mt-5 text-center text-xs font-medium text-stone-500 shrink-0 select-none leading-relaxed">
          Copy and paste your final biography to wherever your pet may be seen by others - social media, petfinder, etc. Descriptions are best alongside cute photos!
        </div>
      </div>
    );
  }

  if (settings.templateId === 'extreme-duo') {
    const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
    const secondaryPhoto = pet.photos.length > 1 ? pet.photos[1] : null;

    return (
      <div 
        id="print-poster-card" 
        className={`${printClass} poster-proportions w-full h-full relative border flex flex-col justify-between overflow-hidden p-4 md:p-[20px] selection:bg-rose-105 shadow-2xl bg-white border-slate-200 rounded-2xl ${getFontFamilyClass()} ${currentTheme.textClass}`}
      >
        {/* Subtle background styles */}
        <>
          <div className={`absolute inset-0 pointer-events-none -z-10 ${currentTheme.bgClass}`}></div>
          <div className="absolute inset-2 border border-slate-350/20 rounded-xl pointer-events-none -z-10"></div>
        </>
        <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-300/50 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>

        {/* 1. Header (Very Compact) */}
        <div className="flex items-center justify-between w-full border-b border-stone-200 pb-1.5 mt-0 select-none shrink-0 leading-none">
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight leading-none text-slate-900 font-sans">
              Meet {pet.name || 'Lovely Foster'}!
            </h1>
          </div>
          {/* Badge & breed on right side above */}
          <div className="flex flex-col items-end text-right gap-1 shrink-0 select-none">
            <span className={`inline-flex items-center justify-center font-black uppercase tracking-widest text-[8px] px-2 py-0.5 rounded leading-none transition-all duration-300 ${getBadgeStyle()}`}>
              {settings.headingText || 'Adopt Me!'}
            </span>
            {pet.breed && (
              <div className="text-[10px] font-bold tracking-wider text-slate-555 uppercase">
                🐾 {pet.breed}
              </div>
            )}
          </div>
        </div>

        {/* 2. Photo Grid (Two GIANT Photos side-by-side, taking up 55% vertical height, reduced margins) */}
        <div className="grid grid-cols-2 gap-3 mt-1.5 mb-1.5 h-[55%] shrink-0 relative">
          {/* Photo 1 Container */}
          <div className="relative h-full rounded-2xl overflow-hidden border bg-stone-50 border-slate-200 shadow-sm">
            {primaryPhoto ? (
              <RepositionableImage 
                src={primaryPhoto} 
                alt={`${pet.name} Photo 1`} 
                pet={pet} 
                setPet={setPet} 
                className="rounded-2xl"
                isSecondary={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-stone-50 opacity-80">
                <PetSvgIllustration species={pet.species} />
              </div>
            )}
          </div>

          {/* Photo 2 Container */}
          <div className="relative h-full rounded-2xl overflow-hidden border bg-stone-50 border-slate-200 shadow-sm">
            {secondaryPhoto ? (
              <RepositionableImage 
                src={secondaryPhoto} 
                alt={`${pet.name} Photo 2`} 
                pet={pet} 
                setPet={setPet} 
                className="rounded-2xl"
                isSecondary={true}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-stone-50 opacity-50">
                <PetSvgIllustration species={pet.species} />
              </div>
            )}
          </div>
        </div>

        {/* 3. Horizontal Story Box (Simple & Focused on the bio description - no scroll bar, expanded space) */}
        <div className={`flex-1 flex flex-col justify-start text-left min-h-0 relative select-text mt-1 mb-1.5 overflow-hidden p-2.5 rounded-xl border ${currentTheme.bgClass} ${currentTheme.borderClass}`}>
          <p 
            className="font-serif whitespace-pre-wrap select-text leading-relaxed font-normal text-slate-800"
            style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or write a custom bio directly!", settings.templateId, false)}
          >
            {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
          </p>
        </div>

        {/* 4. Footer Contacts Panel (No location details) */}
        <div className="mt-1 pt-1.5 border-t grid grid-cols-12 gap-3 items-center z-10 w-full shrink-0 select-text bg-white border-stone-200">
          <div className="col-span-8 flex flex-col text-left select-text leading-tight">
            <h4 className="text-[11px] md:text-[12px] font-black truncate text-stone-900">
              {pet.rescueOrg || 'Independent Rescuer'}
            </h4>
            
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[9px] md:text-[9.5px] font-medium select-text text-stone-500">
              {pet.fosterEmail && (
                <div className="flex items-center gap-0.5 select-text">
                  <Mail className="w-3 h-3 inline-block shrink-0 text-stone-400" />
                  <span className="truncate select-text">{pet.fosterEmail}</span>
                </div>
              )}
              {pet.fosterEmail && pet.fosterPhone && <span className="text-stone-300">•</span>}
              {pet.fosterPhone && (
                <div className="flex items-center gap-0.5 select-text">
                  <Phone className="w-3 h-3 inline-block shrink-0 text-stone-400" />
                  <span className="select-text">{pet.fosterPhone}</span>
                </div>
              )}
            </div>
            {pet.rescueWebsite && (
              <div className="flex items-center gap-0.5 text-[9px] md:text-[9.5px] font-extrabold mt-0.5 select-all text-rose-750">
                <Globe className="w-3 h-3 shrink-0 text-rose-450" />
                <span className="truncate hover:underline select-all">{pet.rescueWebsite.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>

          <div className="col-span-4 flex items-center justify-end gap-2 select-none shrink-0 border-0">
            <div className="text-right hidden sm:block font-sans">
              <span className="text-[7px] uppercase font-black block leading-none text-rose-500">Find out more</span>
              <span className="text-[8px] font-black uppercase block mt-0.5 leading-none text-slate-800">Scan to Site</span>
            </div>
            
            <div className="bg-white border border-slate-200 p-0.5 rounded-lg w-10 h-10 relative flex items-center justify-center shrink-0">
              {pet.rescueWebsite ? (
                <QRCodeImage 
                  url={pet.rescueWebsite} 
                  className="w-full h-full object-contain" 
                  darkColor="#0f172a" 
                  lightColor="#ffffff00" 
                />
              ) : (
                <Heart className="w-4 h-4 text-rose-350" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (settings.templateId === 'two-photos' || settings.templateId === 'comic-2-photos') {
    const isComic2 = settings.templateId === 'comic-2-photos';
    const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
    const secondaryPhoto = pet.photos.length > 1 ? pet.photos[1] : null;

    return (
      <div 
        id="print-poster-card" 
        className={`${printClass} poster-proportions w-full h-full relative border flex flex-col justify-between overflow-hidden p-3.5 md:p-4 selection:bg-rose-105 shadow-2xl ${
          isComic2 
            ? 'bg-[#fefaf2] border-pink-100 rounded-3xl' 
            : 'bg-white border-slate-200 rounded-2xl'
        } ${getFontFamilyClass()} ${currentTheme.textClass}`}
      >
        {/* Subtle background styles */}
        <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-300/50 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>
        {isComic2 ? (
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-[#fefaf2]">
            <div className="absolute top-4 right-8 text-rose-300 opacity-55 text-4xl font-sans font-normal">♥</div>
            <div className="absolute top-12 right-16 text-rose-200 opacity-40 text-2xl font-sans font-normal">♥</div>
            <div className="absolute bottom-32 left-8 text-rose-200 opacity-35 text-3xl font-sans font-normal">♥</div>
            <div className="absolute bottom-20 right-24 text-rose-100 opacity-25 text-5xl font-sans font-normal">🐾</div>
            <div className="absolute top-[20%] left-6 text-orange-100 opacity-30 text-2xl font-sans font-normal">🌸</div>
            <div className="absolute inset-3 border border-pink-105/60 rounded-2xl opacity-60 pointer-events-none"></div>
          </div>
        ) : (
          <>
            <div className={`absolute inset-0 pointer-events-none -z-10 ${currentTheme.bgClass}`}></div>
            <div className="absolute inset-4 border border-slate-350/20 rounded-xl pointer-events-none -z-10"></div>
          </>
        )}
        
        {/* 1. Upper Header Section (Way smaller, no 'adoption search') */}
        <div className={`w-full flex items-center justify-between mt-0 mb-1.5 z-10 font-sans shrink-0 border-b pb-1 select-none ${
          isComic2 ? 'border-pink-100' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2 pl-1 min-w-0">
            <span className={`inline-flex items-center shrink-0 font-black uppercase tracking-wider text-[7px] px-2 py-0.5 rounded transition-all duration-300 ${getBadgeStyle()}`}>
              {isComic2 && <Heart className="w-2 h-2 mr-0.5 text-rose-500" />}
              <span>{settings.headingText || 'Adopt Me!'}</span>
            </span>
            <h1
              className={`text-xl font-black tracking-tight leading-none truncate ${
                isComic2 ? 'font-playful' : 'text-slate-900 font-sans'
              }`}
              style={isComic2 ? { color: currentTheme.themeColorHex } : undefined}
            >
              Meet {pet.name || 'Lovely Foster'}!
            </h1>
          </div>
          <span className={`text-[9px] font-black rounded-full px-2 py-0.5 uppercase truncate max-w-[130px] shrink-0 ml-2 border ${
            isComic2
              ? `${currentTheme.badgeBg}`
              : 'text-slate-600 bg-stone-100 border-stone-200'
          }`}>{isComic2 ? '🌸' : '🌿'} {pet.breed || pet.species}</span>
        </div>

        {/* 2. Double Large Photo Grid (Takes up less space to prevent overlap) */}
        <div className="grid grid-cols-2 gap-3 my-1.5 h-[46%] shrink-0 relative border-0">
          {/* Photo 1 Container */}
          <div className={`relative h-full rounded-2xl overflow-hidden border bg-slate-50 shadow-sm group ${
            isComic2 ? 'border-pink-100 shadow-3xs' : 'border-slate-200'
          }`}>
            {primaryPhoto ? (
              <RepositionableImage 
                src={primaryPhoto} 
                alt={`${pet.name} Photo 1`} 
                pet={pet} 
                setPet={setPet} 
                className="rounded-2xl"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-stone-50">
                <PetSvgIllustration species={pet.species} />
              </div>
            )}
          </div>

          {/* Photo 2 Container */}
          <div className={`relative h-full rounded-2xl overflow-hidden border bg-slate-50 shadow-sm group ${
            isComic2 ? 'border-pink-100 shadow-3xs' : 'border-slate-200'
          }`}>
            {secondaryPhoto ? (
              <RepositionableImage 
                src={secondaryPhoto} 
                alt={`${pet.name} Photo 2`} 
                pet={pet} 
                setPet={setPet} 
                className="rounded-2xl"
                isSecondary={true}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-stone-50 opacity-60">
                <PetSvgIllustration species={pet.species} />
              </div>
            )}
          </div>
        </div>

        {/* 3. Concise Info & Story Box */}
        <div className="flex-1 grid grid-cols-12 gap-4 mt-2 min-h-0 relative select-text">
          {/* Concise Story Block (col-span-7) */}
          <div className="col-span-7 flex flex-col justify-start text-left min-h-0 gap-1">
            {/* Traits here so they never overflow off the page */}
            {pet.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 shrink-0">
                {pet.traits.map((t, idx) => (
                  <span key={idx} className={`inline-flex items-center whitespace-nowrap shrink-0 text-[7.5px] font-extrabold border px-1.5 py-0.5 rounded capitalize leading-none ${currentTheme.badgeBg}`}>
                    <span className="mr-0.5 text-[7px]">✨</span>
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}
            <div className="overflow-hidden pr-2 flex-1 leading-relaxed select-text font-serif">
              <p
                className={`font-serif whitespace-pre-wrap select-text leading-relaxed font-normal ${
                  isComic2 ? 'text-stone-850' : 'text-slate-800'
                }`}
                style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or write a custom bio directly!", settings.templateId, false)}
              >
                {pet.estimatedBio || "Please fill in some animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or write a custom bio directly!"}
              </p>
            </div>
          </div>

          {/* Fact Sheet Column (col-span-4) */}
          <div className={`col-span-5 flex flex-col justify-start gap-1 select-none border-l pl-4 h-full min-h-0 ${
            isComic2 ? 'border-pink-100/70' : 'border-slate-250/50'
          }`}>
            <div className="flex flex-col gap-1 w-full font-sans">
              
              {/* Basic Information Box */}
              <div className={`p-1.5 rounded-lg border font-sans flex flex-col gap-1 text-[8.5px] md:text-[9.5px] font-bold ${
                isComic2 
                  ? 'bg-[#fffcfb] border-pink-200/60 text-slate-700' 
                  : `${currentTheme.borderClass} ${currentTheme.bgClass} text-slate-755`
              }`}>
                <div className={`flex justify-start items-center border-b border-dashed pb-1 font-sans ${
                  isComic2 ? 'border-pink-100/70' : 'border-slate-200/50'
                }`}>
                  <span className={`${isComic2 ? 'text-rose-600' : 'text-slate-900'} font-extrabold truncate font-sans text-[9px] md:text-[10px]`}>
                    {pet.age || 'Unknown Age'}{pet.weight ? `, ${pet.weight}` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center font-sans">
                  <span className={`${isComic2 ? 'text-pink-400' : 'text-slate-404'} text-[7.5px] uppercase shrink-0 font-sans`}>Housetrained</span>
                  <span className={`${isComic2 ? 'text-rose-700' : 'text-slate-900'} font-extrabold max-w-[85px] truncate font-sans`}>{pet.houseTrained === 'yes' ? '✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : '✗'}</span>
                </div>
              </div>

              {/* Social Compatibility columns (1 word & answer below in separate boxes) */}
              <div className="grid grid-cols-3 gap-0.5 font-sans">
                <div className={`${isComic2 ? 'bg-pink-50/50 border-pink-100/60' : 'bg-[#fcfdfd]/95 border-slate-200'} border p-1 rounded-lg text-center shadow-3xs flex flex-col justify-center items-center font-sans`}>
                  <span className={`text-[6.5px] font-black block leading-none font-sans select-none ${isComic2 ? 'text-[#db2777]' : 'text-slate-404'}`}>DOGS</span>
                  <span className={`${isComic2 ? 'text-rose-755' : 'text-slate-900'} text-[8px] font-black leading-none block mt-1 font-sans`}>
                    {pet.goodWithDogs === 'yes' ? 'YES' : pet.goodWithDogs === 'no' ? 'NO' : 'MAYBE'}
                  </span>
                </div>
                <div className={`${isComic2 ? 'bg-pink-50/50 border-pink-100/60' : 'bg-[#fcfdfd]/95 border-slate-200'} border p-1 rounded-lg text-center shadow-3xs flex flex-col justify-center items-center font-sans`}>
                  <span className={`text-[6.5px] font-black block leading-none font-sans select-none ${isComic2 ? 'text-[#db2777]' : 'text-slate-404'}`}>CATS</span>
                  <span className={`${isComic2 ? 'text-rose-755' : 'text-slate-900'} text-[8px] font-black leading-none block mt-1 font-sans`}>
                    {pet.goodWithCats === 'yes' ? 'YES' : pet.goodWithCats === 'no' ? 'NO' : 'MAYBE'}
                  </span>
                </div>
                <div className={`${isComic2 ? 'bg-pink-50/50 border-pink-100/60' : 'bg-[#fcfdfd]/95 border-slate-200'} border p-1 rounded-lg text-center shadow-3xs flex flex-col justify-center items-center font-sans`}>
                  <span className={`text-[6.5px] font-black block leading-none font-sans select-none ${isComic2 ? 'text-[#db2777]' : 'text-slate-404'}`}>KIDS</span>
                  <span className={`${isComic2 ? 'text-rose-755' : 'text-slate-900'} text-[8px] font-black leading-none block mt-1 font-sans`}>
                    {pet.goodWithKids === 'yes' ? 'YES' : pet.goodWithKids === 'no' ? 'NO' : 'MAYBE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Traits moved to bio column to prevent overflow */}
          </div>
        </div>

        {/* 4. Footer Contacts Panel (Shorter Contact Info Footer) */}
        <div className={`mt-0.5 pt-1 border-t grid grid-cols-12 gap-2 items-center z-10 w-full shrink-0 select-text ${
          isComic2 ? 'bg-[#fefaf2] border-pink-100' : 'bg-white border-stone-200'
        }`}>
          <div className="col-span-8 flex flex-col text-left select-text leading-tight">
            <h4 className={`text-[10.5px] md:text-[11px] font-black truncate ${isComic2 ? 'text-rose-800' : 'text-stone-900'}`}>
              {pet.rescueOrg || 'Independent Rescuer'}
            </h4>
            
            <div className={`mt-0.5 flex flex-wrap items-center gap-x-2 text-[8.5px] md:text-[9px] font-medium select-text ${
              isComic2 ? 'text-pink-600' : 'text-stone-500'
            }`}>
              {pet.fosterEmail && (
                <div className="flex items-center gap-0.5 select-text">
                  <Mail className={`w-2.5 h-2.5 inline-block shrink-0 ${isComic2 ? 'text-pink-400' : 'text-stone-404'}`} />
                  <span className="truncate select-text">{pet.fosterEmail}</span>
                </div>
              )}
              {pet.fosterEmail && pet.fosterPhone && <span className={isComic2 ? 'text-pink-300' : 'text-stone-300'}>•</span>}
              {pet.fosterPhone && (
                <div className="flex items-center gap-0.5 select-text">
                  <Phone className={`w-2.5 h-2.5 inline-block shrink-0 ${isComic2 ? 'text-pink-400' : 'text-stone-404'}`} />
                  <span className="select-text">{pet.fosterPhone}</span>
                </div>
              )}
            </div>
            {pet.rescueWebsite && (
              <div className={`flex items-center gap-0.5 text-[8.5px] md:text-[9px] font-extrabold mt-0.5 select-all ${
                isComic2 ? 'text-rose-600' : 'text-rose-700'
              }`}>
                <Globe className={`w-2.5 h-2.5 shrink-0 ${isComic2 ? 'text-pink-400' : 'text-rose-450'}`} />
                <span className="truncate hover:underline select-all">{pet.rescueWebsite.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>

          <div className="col-span-4 flex items-center justify-end gap-2 select-none shrink-0 border-0">
            <div className="text-right hidden sm:block font-sans">
              <span className={`text-[6.5px] uppercase font-black block leading-none ${isComic2 ? 'text-rose-500' : 'text-rose-500'}`}>Find out more</span>
              <span className={`text-[7.5px] font-black uppercase block mt-0.5 leading-none ${isComic2 ? 'text-rose-650' : 'text-slate-800'}`}>Scan to Site</span>
            </div>
            
            <div className={`border p-0.5 rounded-lg w-11 h-11 relative flex items-center justify-center shadow-3xs shrink-0 ${
              isComic2 ? 'bg-[#fffcfb] border-pink-200' : 'bg-stone-50 border-stone-200'
            }`}>
              {pet.rescueWebsite ? (
                <QRCodeImage 
                  url={pet.rescueWebsite} 
                  className="w-full h-full object-contain" 
                  darkColor={isComic2 ? '#db2777' : '#1c1917'} 
                  lightColor="#ffffff00"
                />
              ) : (
                <Heart className="w-5 h-5 text-rose-350" style={{ color: isComic2 ? currentTheme.themeColorHex : undefined }} />
              )}
            </div>
          </div>
        </div>

        {/* Styled Bottom Banner Line */}
        <div
          className={`absolute bottom-0 inset-x-0 h-1 md:h-1.5 opacity-90 ${!isComic2 ? 'bg-gradient-to-r from-teal-400 via-[#4f46e5] to-red-400' : ''}`}
          style={isComic2 ? { backgroundColor: currentTheme.themeColorHex } : undefined}
        ></div>
      </div>
    );
  }

  if (settings.templateId === 'editorial-2-photos') {
    const primaryPhoto = pet.photos.length > 0 ? pet.photos[0] : null;
    const secondaryPhoto = pet.photos.length > 1 ? pet.photos[1] : null;

    return (
      <div
        id="print-poster-card"
        className={`${printClass} poster-proportions w-full h-full relative border flex flex-col justify-between overflow-hidden p-4.5 md:p-[20px] selection:bg-rose-105 shadow-2xl bg-white border-slate-200 rounded-2xl font-serif ${currentTheme.textClass}`}
      >
        {/* Editorial black stripe borders */}
        <div className="absolute inset-0 pointer-events-none -z-10 border-t-[6px] border-b-[6px] border-stone-900">
          <div className="absolute inset-x-4 top-4 bottom-4 border border-stone-200/60"></div>
        </div>
        <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-400/40 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>

        {/* Header */}
        <div className="w-full flex items-end justify-between mt-0 mb-2.5 z-10 font-sans shrink-0 border-b-2 border-stone-900 pb-2 select-none">
          <div className="text-left font-serif pl-1">
            <h1 className="text-2.5xl md:text-3xl font-serif font-black tracking-tight text-stone-900 leading-none">
              Meet {pet.name || 'Lovely Foster'}!
            </h1>
            <p className="text-[9px] md:text-[9.5px] uppercase tracking-[0.14em] text-stone-500 font-sans font-semibold mt-1.5 leading-none">
              A {pet.breed || pet.species} seeking a tranquil sanctuary
            </p>
          </div>
          <div className={`inline-flex items-center text-center justify-center py-1 transition-all duration-300 ${getBadgeStyle()} mr-1 shrink-0`}>
            <span className="font-bold uppercase tracking-wider text-[9px] md:text-[10px] px-3 py-1 leading-none">{settings.headingText || 'Adopt Me!'}</span>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="flex-1 grid gap-2 md:gap-3 z-10 h-full items-stretch w-full min-h-0" style={{ gridTemplateColumns: '11fr 13fr' }}>

          {/* LEFT: traits + bio + stats */}
          <div className="flex flex-col justify-stretch h-full select-text space-y-2 font-sans min-h-0 overflow-hidden">
            {pet.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-start shrink-0">
                {pet.traits.map((t, idx) => {
                  const capTrait = t.charAt(0).toUpperCase() + t.slice(1);
                  return (
                    <span key={idx} className={`inline-flex items-center whitespace-nowrap shrink-0 text-[10px] md:text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${currentTheme.badgeBg} border border-opacity-45 shadow-3xs`}>
                      <span className="mr-0.5 shrink-0">✨</span>
                      <span>{capTrait}</span>
                    </span>
                  );
                })}
              </div>
            )}
            <div className="flex-1 flex flex-col justify-start min-h-0">
              <div className="bg-[#fcfbf9] border border-stone-200/70 p-2 rounded-xl relative shadow-3xs flex flex-col justify-start overflow-hidden h-full">
                <h4 className="text-[11.5px] md:text-[12.5px] font-extrabold uppercase tracking-widest text-[#4f46e5] mb-1 leading-none font-sans">Meet {pet.name || 'Lovely Foster'}!</h4>
                <p
                  className="italic text-slate-700 font-medium select-text indent-2 pr-1"
                  style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!", 'editorial-2-photos', false)}
                >
                  {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex flex-wrap gap-1">
                {[
                  { label: pet.breed || 'Unknown' },
                  { label: pet.age || 'Age N/A' },
                  { label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown sex' },
                  { label: pet.weight || 'Medium' },
                  { label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-[7.5px] font-bold shrink-0 bg-stone-900 text-white">
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {[
                  { label: 'Dogs', val: pet.goodWithDogs },
                  { label: 'Cats', val: pet.goodWithCats },
                  { label: 'Kids', val: pet.goodWithKids },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 rounded-xl py-1 text-center border ${
                    item.val === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    item.val === 'no' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    'bg-stone-50 border-stone-200 text-stone-500'
                  }`}>
                    <span className="text-[6px] uppercase font-black block leading-none">{item.label}</span>
                    <span className="text-[7.5px] font-black block mt-0.5 leading-none">
                      {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: 2 stacked photos */}
          <div className="border-l border-stone-350 pl-2 flex flex-col h-full gap-2 min-h-0 overflow-hidden">
            <div className="flex-1 w-full relative overflow-hidden border-[2px] border-stone-900 group min-h-0">
              {primaryPhoto ? (
                <RepositionableImage src={primaryPhoto} alt={`${pet.name} Photo 1`} pet={pet} setPet={setPet} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-stone-50">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
            </div>
            <div className="flex-1 w-full relative overflow-hidden border-[2px] border-stone-900 group min-h-0">
              {secondaryPhoto ? (
                <RepositionableImage src={secondaryPhoto} alt={`${pet.name} Photo 2`} pet={pet} setPet={setPet} isSecondary={true} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-stone-50 opacity-60">
                  <PetSvgIllustration species={pet.species} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-1 pt-1 border-t-2 border-stone-900 grid grid-cols-12 gap-3 items-center z-10 w-full shrink-0">
          <div className="col-span-8 flex flex-col text-left font-sans">
            <h4 className="text-[12.5px] md:text-[13.5px] font-extrabold text-stone-900 truncate">
              {pet.rescueOrg || 'Independent Rescuer'}
            </h4>
            <div className="mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-x-2.5 text-[9.5px] md:text-[10px] text-stone-600 font-medium">
              {pet.fosterEmail && (
                <div className="flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5 text-stone-400 inline-block shrink-0" />
                  <span className="truncate">{pet.fosterEmail}</span>
                </div>
              )}
              {pet.fosterPhone && (
                <div className="flex items-center gap-1 mt-0.5 sm:mt-0">
                  <Phone className="w-2.5 h-2.5 text-stone-400 inline-block shrink-0" />
                  <span>{pet.fosterPhone}</span>
                </div>
              )}
            </div>
            {pet.rescueWebsite && (
              <div className="flex items-center gap-1 text-[9px] font-extrabold mt-0.5 select-all text-rose-700">
                <Globe className="w-2.5 h-2.5 shrink-0 text-rose-400" />
                <span className="truncate">{pet.rescueWebsite.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>
          <div className="col-span-4 flex items-center justify-end gap-2 select-none shrink-0">
            <div className="text-right hidden sm:block font-sans">
              <span className="text-[7px] uppercase font-black block leading-none text-stone-500">Scan to Site</span>
            </div>
            <div className="bg-white border border-stone-300 p-0.5 rounded-lg w-10 h-10 relative flex items-center justify-center shrink-0">
              {pet.rescueWebsite ? (
                <QRCodeImage url={pet.rescueWebsite} className="w-full h-full object-contain" darkColor="#0f172a" lightColor="#ffffff00" />
              ) : (
                <Heart className="w-4 h-4 text-rose-350" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="print-poster-card"
      className={`${printClass} poster-proportions w-full h-full relative border flex flex-col justify-between overflow-hidden p-4.5 md:p-[20px] selection:bg-rose-105 shadow-2xl ${settings.templateId === 'whimsical' ? 'bg-[#fdfbf6] border-[#b3cca8]/20 rounded-3xl' : settings.templateId === 'comic' ? 'bg-[#fefaf2] border-pink-100 rounded-3xl' : 'bg-white border-slate-200 rounded-2xl'} ${getFontFamilyClass()} ${currentTheme.textClass}`}
    >

      {/* BACKGROUND GRAPHIC ACCENTS BASED ON TEMPLATE STYLE */}
      <div className="absolute bottom-1.5 right-2 text-[6px] text-slate-300/50 font-mono select-none pointer-events-none z-50 leading-none">Powered by Rescue-kit.org</div>
      {settings.templateId === 'whimsical' && (
        <div className="absolute inset-0 pointer-events-none -z-10 opacity-40">
          <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-rose-105/40 mix-blend-multiply filter blur-2xl"></div>
          <div className="absolute bottom-12 right-12 w-52 h-52 rounded-full bg-orange-105/40 mix-blend-multiply filter blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-36 h-36 rounded-full bg-teal-100/20 mix-blend-multiply filter blur-xl"></div>
          {/* Paw patterns */}
          <div className="absolute top-6 right-6 text-rose-200/50 transform rotate-12 text-sm">🐾</div>
          <div className="absolute bottom-24 left-6 text-orange-200/50 transform rotate-[-12deg] text-sm">🐾</div>
          <div className="absolute top-1/3 right-8 text-teal-200/50 transform rotate-[45deg] text-sm">🐾</div>
        </div>
      )}

      {settings.templateId === 'comic' && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" style={{background: 'radial-gradient(ellipse at 68% 28%, #ffe4ef 0%, #fff5f9 38%, #fefaf2 100%)'}}>
          {/* Large SVG heart — top right, background element */}
          <svg className="absolute -top-10 -right-10 w-64 h-64 text-rose-200 opacity-[0.10]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {/* Medium SVG heart — bottom left */}
          <svg className="absolute -bottom-6 -left-6 w-44 h-44 text-rose-100 opacity-[0.14]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {/* Small accent heart — mid left, tilted */}
          <svg className="absolute top-[38%] left-2 w-14 h-14 text-rose-200 opacity-[0.18] rotate-[-12deg]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {/* Subtle inner border accent */}
          <div className="absolute inset-3.5 border border-rose-100/40 rounded-2xl pointer-events-none"></div>
        </div>
      )}

      {settings.templateId === 'polaroid' && (
        <div className="absolute inset-0 pointer-events-none -z-10 bg-[#faf8f5] border-[10px] border-white shadow-inner">
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-stone-100/40 to-transparent"></div>
        </div>
      )}

      {settings.templateId === 'editorial' && (
        <div className="absolute inset-0 pointer-events-none -z-10 border-t-[6px] border-b-[6px] border-stone-900">
          <div className="absolute inset-x-4 top-4 bottom-4 border border-stone-200/60"></div>
        </div>
      )}

      {/* ==================== 1. UPPER HEADER SECTION (COMPACT SIZE FOR HIGHER DENSITY) ==================== */}
      {settings.templateId === 'whimsical' ? (
        <div className="w-full flex items-center justify-between mt-0 mb-2 z-10 font-sans shrink-0 border-b border-[#2d5a27]/10 pb-1 select-none">
          {/* Left top: Meet Barnaby! */}
          <div className="relative inline-block pl-2 mt-1">
            <h1 className="text-[38px] font-handwritten font-black tracking-tight text-[#0f5c3a] leading-none mb-0.5">
              Meet {pet.name || 'Lovely Foster'}!
            </h1>
            <svg className="absolute -bottom-1 left-2 w-[calc(100%-12px)] h-2 text-rose-350 pointer-events-none" fill="none" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M1 5 Q 25 -2, 50 5 T 99 5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Right top: Adopt me! Badge */}
          <div className={`inline-flex items-center text-center justify-center py-1 transition-all duration-300 ${getBadgeStyle()} mr-1 shrink-0`}>
            <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-500" />
            <span className="font-bold uppercase tracking-wider text-[10px] md:text-[12px] px-3 py-0.5">{settings.headingText || 'Adopt Me!'}</span>
          </div>
        </div>
      ) : settings.templateId === 'editorial' ? (
        <div className="w-full flex items-end justify-between mt-0 mb-2.5 z-10 font-sans shrink-0 border-b-2 border-stone-900 pb-2 select-none">
          {/* Left top: Meet Barnaby! and Subheader */}
          <div className="text-left font-serif pl-1">
            <h1 className="text-2.5xl md:text-3xl font-serif font-black tracking-tight text-stone-900 leading-none">
              Meet {pet.name || 'Lovely Foster'}!
            </h1>
            <p className="text-[9px] md:text-[9.5px] uppercase tracking-[0.14em] text-stone-605 font-sans font-semibold mt-1.5 leading-none">
              A {pet.traits?.[0] ? `${pet.traits[0].toLowerCase()} ` : ''}{pet.breed} seeking a tranquil sanctuary
            </p>
          </div>

          {/* Right top: Adopt me! Badge */}
          <div className={`inline-flex items-center text-center justify-center py-1 transition-all duration-300 ${getBadgeStyle()} mr-1 shrink-0`}>
            <span className="font-bold uppercase tracking-wider text-[9px] md:text-[10px] px-3 py-1 leading-none">{settings.headingText || 'Adopt Me!'}</span>
          </div>
        </div>
      ) : settings.templateId === 'minimalist' ? (
        <div className="w-full flex items-center justify-between mt-0 mb-1.5 z-10 font-sans shrink-0 border-b border-stone-200 pb-1.5 select-none">
          <div className="text-left pl-1 min-w-0">
            <h1
              style={{ color: currentTheme.themeColorHex }}
              className="text-[22px] md:text-[26px] font-sans font-black tracking-tight uppercase leading-none truncate"
            >
              {pet.name || 'Lovely Foster'}
            </h1>
            <p className="text-[8.5px] font-semibold text-stone-500 mt-0.5 leading-none font-sans truncate">
              {pet.breed} &nbsp;·&nbsp; {pet.location || 'Local Area'} &nbsp;·&nbsp; {pet.age || 'Age N/A'}
            </p>
          </div>
          <div
            style={{ backgroundColor: currentTheme.themeColorHex }}
            className="w-9 h-9 rounded-full flex flex-col items-center justify-center text-center text-white tracking-widest text-[7px] uppercase font-black shadow-md border border-white pointer-events-none select-none shrink-0 ml-2"
          >
            <span className="leading-tight">Adopt</span>
            <span className="leading-tight font-extrabold text-[8px]">Me!</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center mt-0 z-10 font-sans shrink-0">
          
          {/* Urgent Badge */}
          {settings.templateId !== 'comic' && (
            <div className={`mb-1 inline-flex items-center text-center justify-center py-0.5 transition-all duration-300 ${getBadgeStyle()}`}>
              {settings.templateId === 'whimsical' && <Sparkles className="w-3 h-3 mr-1 text-orange-500" />}
              <span className="font-bold uppercase tracking-wider text-[9px] md:text-[11px] px-2 py-0.5">{settings.headingText || 'Adopt Me!'}</span>
            </div>
          )}

          {/* Pet Name & Deck Subtitle with controlled sizing */}
          {settings.templateId === 'comic' ? (
            <div className="flex flex-col items-center text-center -mt-1 mb-1.5 w-full relative select-none">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#db2777] font-playful relative leading-none mb-1 text-shadow-3xs">
                Meet {pet.name || 'Lovely Foster'}!
              </h1>
              
              {/* Hand-drawn style pink brush banner for tagline */}
              <div className="bg-[#db2777] text-white px-5 py-1 text-[10px] md:text-[11px] font-bold font-sans uppercase tracking-wider rounded-lg shadow-3xs border border-white/10 flex items-center justify-center gap-1.5 rotate-[-0.5deg] max-w-[90%] mt-0.5 leading-none">
                <span>💖 A sweet {pet.gender === 'girl' ? 'female' : pet.gender === 'boy' ? 'male' : 'companion'} looking for {pet.gender === 'girl' ? 'her' : 'his'} purr-ever home!</span>
              </div>
            </div>
          ) : settings.templateId === 'polaroid' ? (
            <div className="mb-0.5">
              <h1 className="text-2xl font-serif capitalize font-bold text-stone-800 leading-none">
                Meet {pet.name || 'Lovely Star'}!
              </h1>
              <div className="text-[9px] md:text-[10px] text-stone-500 flex items-center justify-center gap-1.5 mt-0.5 font-mono">
                <MapPin className="w-2.5 h-2.5 text-stone-400" />
                <span>{pet.location || 'Local Area'}</span>
                <span>•</span>
                <Heart className="w-2.5 h-2.5 text-rose-400" />
                <span>{pet.breed}</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ==================== 2a. CLEAN MODERN: FULL-WIDTH LANDSCAPE PHOTO LAYOUT ==================== */}
      {settings.templateId === 'minimalist' && (
        <div className="flex flex-col flex-1 min-h-0 gap-1.5 z-10 w-full">

          {/* Full-width landscape photo strip */}
          <div className="flex-[5] min-h-0 w-full overflow-hidden relative rounded-xl border border-slate-100 shadow-sm group">
            {primaryPhoto ? (
              <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-amber-50/50">
                <PetSvgIllustration species={pet.species} />
              </div>
            )}
            <div className={`absolute top-2 right-2 flex flex-col items-center justify-center text-center w-8 h-8 rounded-full border shadow-sm ${currentTheme.badgeBg} border-opacity-45 p-1 z-10`}>
              <Heart className="w-3 h-3 text-red-500 shrink-0" />
              <span className="text-[6px] font-black uppercase tracking-tighter leading-none mt-0.5 text-slate-800">Love</span>
            </div>
          </div>

          {/* Traits pill row */}
          {pet.traits.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-start shrink-0">
              {pet.traits.map((t, idx) => {
                const capTrait = t.charAt(0).toUpperCase() + t.slice(1);
                return (
                  <span key={idx} className={`inline-flex items-center whitespace-nowrap shrink-0 text-[10px] md:text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${currentTheme.badgeBg} border border-opacity-45 shadow-3xs`}>
                    <span className="mr-0.5 shrink-0">✨</span>
                    <span>{capTrait}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Bio + Stats row */}
          <div className="flex gap-2.5 flex-[5] min-h-0 items-stretch">

            {/* Bio — left ~60% */}
            <div className="flex-[3] flex flex-col min-h-0 overflow-hidden">
              <div className="bg-[#fcfbf9] border border-stone-200/70 p-2 rounded-xl shadow-3xs flex flex-col justify-start overflow-hidden h-full">
                <h4 className="text-[11.5px] md:text-[12.5px] font-extrabold uppercase tracking-widest text-[#4f46e5] mb-1 leading-none shrink-0">Meet {pet.name || 'Lovely Foster'}!</h4>
                <p
                  className="italic text-slate-700 font-medium select-text indent-2 pr-1"
                  style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!", 'minimalist', false)}
                >
                  {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
                </p>
              </div>
            </div>

            {/* Stats — right ~40% */}
            <div className="flex-[2] flex flex-col gap-1 justify-start">
              <div className="flex flex-wrap gap-1">
                {[
                  { label: pet.breed || 'Unknown' },
                  { label: pet.age || 'Age N/A' },
                  { label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown sex' },
                  { label: pet.weight || 'Medium' },
                  { label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                  ...(pet.location ? [{ label: pet.location }] : []),
                ].map((item, i) => (
                  <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[7.5px] font-bold shrink-0 ${currentTheme.bgClass} border ${currentTheme.borderClass} text-slate-700`}>
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {[
                  { label: 'Dogs', val: pet.goodWithDogs },
                  { label: 'Cats', val: pet.goodWithCats },
                  { label: 'Kids', val: pet.goodWithKids },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 rounded-xl py-1 text-center border ${
                    item.val === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    item.val === 'no' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    'bg-stone-50 border-stone-200 text-stone-500'
                  }`}>
                    <span className="text-[6px] uppercase font-black block leading-none">{item.label}</span>
                    <span className="text-[7.5px] font-black block mt-0.5 leading-none">
                      {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== 2b. PRIMARY 2-COLUMN SPLIT (all other templates) ==================== */}
      {settings.templateId !== 'minimalist' && (
      <div
        className={`grid ${settings.templateId === 'editorial' ? '' : 'grid-cols-12'} ${settings.templateId === 'whimsical' || settings.templateId === 'editorial' || settings.templateId === 'polaroid' || settings.templateId === 'comic' ? 'gap-2 md:gap-2' : 'gap-3 md:gap-3.5'} ${settings.templateId === 'polaroid' ? 'my-0.5' : 'my-1'} z-10 flex-1 h-full items-stretch w-full min-h-0`}
        style={
          settings.templateId === 'editorial'
            ? { gridTemplateColumns: '11fr 13fr' }
            : undefined
        }
      >
        
        {/* LEFT COLUMN: TRAITS, DETAILED STORY BIO */}
        <div className={`${settings.templateId === 'editorial' ? '' : settings.templateId === 'polaroid' ? 'col-span-5' : settings.templateId === 'comic' ? 'col-span-5' : 'col-span-6'} flex flex-col justify-stretch h-full select-text mt-0.5 space-y-2 px-0.5 font-sans min-h-0 overflow-hidden`}>
          
          {settings.templateId === 'comic' ? (
            /* SWEET ROMANCE STYLED TRAITS/STORY WITH CUSTOM HIGH-FIDELITY ICONS */
            <div className="flex-1 flex flex-col justify-start space-y-1.5 font-sans min-h-0 overflow-hidden">
              
              {/* Feature cards — compact but fully readable */}
              <div className="flex flex-col gap-1 shrink-0">
                <div className="flex items-start gap-1.5 bg-rose-50/60 rounded-xl px-2 py-1.5 select-text">
                  <div className="bg-[#ec4899] text-white rounded-md shrink-0 flex items-center justify-center w-6 h-6 text-[11px] mt-0.5">❤️</div>
                  <div className="min-w-0">
                    <h4 className="text-[9.5px] font-extrabold uppercase tracking-wide text-rose-700 leading-none mb-0.5">Blooming Sweetheart</h4>
                    <p className="text-[8px] font-semibold text-stone-700 leading-tight">
                      {pet.name || 'This pet'} is full of warmth, affection, and ready to become your loyal companion.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 bg-emerald-50/50 rounded-xl px-2 py-1.5 select-text">
                  <div className="bg-emerald-600 text-white rounded-md shrink-0 flex items-center justify-center w-6 h-6 text-[11px] mt-0.5">🐾</div>
                  <div className="min-w-0">
                    <h4 className="text-[9.5px] font-extrabold uppercase tracking-wide text-emerald-800 leading-none mb-0.5">Social Compatibility</h4>
                    <p className="text-[8px] font-semibold text-stone-700 leading-tight">
                      {pet.goodWithCats === 'yes' ? 'Cats ✓' : pet.goodWithCats === 'no' ? 'No cats ✗' : 'Cats ?'} &nbsp;·&nbsp; {pet.goodWithDogs === 'yes' ? 'Dogs ✓' : pet.goodWithDogs === 'no' ? 'No dogs ✗' : 'Dogs ?'} &nbsp;·&nbsp; {pet.goodWithKids === 'yes' ? 'Kids ✓' : pet.goodWithKids === 'no' ? 'No kids ✗' : 'Kids ?'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio story — bare text on a soft wash, no border box */}
              <div className="flex-1 relative flex flex-col justify-start overflow-hidden select-text py-1">
                <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-rose-200" />
                <p
                  className="italic text-stone-800 font-semibold select-text pl-3 pr-1 leading-snug"
                  style={getDynamicBioStyle(pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles.", "comic", false)}
                >
                  {pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles."}
                </p>
              </div>

            </div>
          ) : (
            /* Standard trait badges & narrative bio */
            <>
              {/* TRAIT BADGES (Brings high informational density to the vertical flyer version!) */}
              {pet.traits.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1 justify-start shrink-0">
                  {pet.traits.map((t, idx) => {
                    const capTrait = t.charAt(0).toUpperCase() + t.slice(1);
                    if (settings.templateId === 'whimsical') {
                      const rotations = ['rotate-[1deg]', 'rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]'];
                      const rotation = rotations[idx % rotations.length];
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center whitespace-nowrap shrink-0 text-[10px] font-bold font-handwritten px-2 py-0.5 text-emerald-955 bg-[#fcf9e8] border border-[#2d5a27]/30 shadow-3xs rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs ${rotation} print:transform-none`}
                        >
                          <span className="font-sans mr-0.5 text-[10px] text-amber-500 shrink-0">🌸</span>
                          <span>{capTrait}</span>
                        </span>
                      );
                    }
                    return (
                      <span 
                        key={idx} 
                        className={`inline-flex items-center whitespace-nowrap shrink-0 text-[10px] md:text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${currentTheme.badgeBg} border border-opacity-45 shadow-3xs`}
                      >
                        <span className="mr-0.5 shrink-0">✨</span>
                        <span>{capTrait}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* LARGE ADOPTION STORY BOX (Spacious, beautifully bordered, rich text with more vertical size) */}
              <div className="flex-1 flex flex-col justify-start min-h-0">
                {settings.templateId === 'whimsical' ? (
                  <div className="bg-[#fefcf5] border-2 border-dashed border-[#2d5a27]/25 p-2 md:p-2.5 rounded-[24px_16px_36px_20px] shadow-3xs relative flex flex-col justify-start h-full overflow-hidden font-playful">
                    <h4 className="text-[13px] md:text-[14px] font-extrabold font-handwritten text-[#0f5c3a] mb-1 leading-none flex items-center gap-1">🌸 Meet {pet.name || 'Lovely Foster'}!</h4>
                    <p 
                      className="italic text-stone-800 font-bold select-text pr-1"
                      style={getDynamicBioStyle(pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles.", "whimsical", false)}
                    >
                      {pet.estimatedBio || "This sweet foster is looking for a warm snuggly space to call home. Fully vetted, housetrained, and ready to share infinite laughs and cuddles."}
                    </p>
                  </div>
                ) : settings.templateId === 'comic' ? (
                  <div className="relative flex flex-col justify-start overflow-hidden h-full select-text pl-3 pr-0.5 py-0.5">
                    <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-rose-200" />
                    <p
                      className="italic text-stone-800 font-semibold select-text leading-snug"
                      style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!", "comic", false)}
                    >
                      {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#fcfbf9] border border-stone-200/70 p-2 rounded-xl relative shadow-3xs flex flex-col justify-start overflow-hidden h-full">

                    <h4 className="text-[11.5px] md:text-[12.5px] font-extrabold uppercase tracking-widest text-[#4f46e5] mb-1 leading-none">Meet {pet.name || 'Lovely Foster'}!</h4>

                    <p
                      className="italic text-slate-700 font-medium select-text indent-2 pr-1"
                      style={getDynamicBioStyle(pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!", settings.templateId, false)}
                    >
                      {pet.estimatedBio || "Please fill in some basic animal information and tap 'Generate Bio with AI' to automatically generate a charming adoption story, or type a custom bio directly!"}
                    </p>

                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: HERO PHOTO, THUMBNAILS, PRINCESS-STYLE STAT SHEET */}
        <div className={`${settings.templateId === 'editorial' ? '' : settings.templateId === 'polaroid' ? 'col-span-7' : settings.templateId === 'comic' ? 'col-span-7' : 'col-span-6'} flex flex-col justify-between h-full space-y-1 pb-0.5 mt-0.5 ${settings.templateId === 'whimsical' ? '' : settings.templateId === 'editorial' ? 'border-l border-stone-350 pl-2' : settings.templateId === 'polaroid' ? 'border-l border-stone-200/50 pl-1.5' : settings.templateId === 'comic' ? 'pl-1' : 'border-l border-slate-100 pl-2.5'} min-h-0 overflow-hidden`}>
          
          {/* STYLED PHOTO BOX - SCALED OUT TO FILL FULL WIDEST SPAN */}
          <div className={`w-full relative flex-1 ${settings.templateId === 'whimsical' ? 'max-h-[72%]' : settings.templateId === 'polaroid' ? 'max-h-[82%]' : settings.templateId === 'comic' ? 'max-h-[74%]' : settings.templateId === 'editorial' ? 'max-h-[72%]' : 'max-h-[70%]'} min-h-[115px] flex flex-col justify-center items-center ${settings.templateId === 'comic' ? 'p-1' : ''}`}>
            {settings.templateId === 'polaroid' ? (
              <div className="bg-white p-2 pb-5 border border-stone-250 shadow-md rotate-[1deg] w-full max-w-[280px] aspect-[1/1.12] flex flex-col group mx-auto">
                <div className="w-full aspect-square bg-stone-100 relative rounded-sm overflow-hidden border border-stone-200/50">
                  {primaryPhoto ? (
                    <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-2 bg-amber-50">
                      <PetSvgIllustration species={pet.species} />
                    </div>
                  )}
                </div>
                <div className="text-center pt-1.5 flex-1 flex items-center justify-center leading-none shrink-0">
                  <span className="font-serif italic text-stone-650 font-bold text-[9.5px] leading-none">{pet.name || 'Sweet foster'} 📷</span>
                </div>
              </div>
            ) : settings.templateId === 'comic' ? (
              <div className="relative w-full flex-1 min-h-[180px] max-w-full select-none group flex items-stretch" style={{padding: '4px 4px 18px 0'}}>
                {/* Soft pink bloom behind the photo */}
                <div className="absolute inset-0 bg-rose-200/20 blur-2xl" style={{borderRadius: '55% 45% 48% 52% / 48% 52% 48% 52%'}} />
                {/* Organic blob photo — no border, just a warm shadow */}
                <div
                  className="relative w-full h-full overflow-hidden shadow-[0_8px_28px_rgba(219,39,119,0.22),0_2px_8px_rgba(219,39,119,0.10)]"
                  style={{borderRadius: '52% 48% 56% 44% / 44% 52% 48% 56%'}}
                >
                  {primaryPhoto ? (
                    <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-6 bg-rose-50/60">
                      <PetSvgIllustration species={pet.species} />
                    </div>
                  )}
                </div>
                {/* Floating pill — overlaps the bottom edge of the photo */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#db2777] text-white px-3.5 py-1.5 rounded-full text-[9px] md:text-[10px] font-extrabold shadow-lg border border-white/30 rotate-[-1deg] flex items-center gap-1.5 z-20 whitespace-nowrap">
                  <Heart className="w-3 h-3 fill-white shrink-0" />
                  <span>Give {pet.name || 'me'} a forever home!</span>
                </div>
              </div>
            ) : settings.templateId === 'whimsical' ? (
              <div className="bg-[#fffefe] p-1 md:p-1.5 pb-1 md:pb-1 w-full max-w-full aspect-[0.68] flex flex-col rounded-[12px_44px_16px_36px] relative shrink-0 group shadow-xs rotate-[-1deg] border border-[#b3cca8]/30">
                {/* Tape markers */}
                <div className="absolute -top-1.5 left-8 w-11 h-4 bg-yellow-105/50 border-x border-stone-500/10 rotate-[10deg] shadow-3xs z-30 font-sans"></div>
                <div className="absolute -bottom-1 -right-0.5 w-12 h-4 bg-[#4f46e5]/10 border-y border-stone-500/10 rotate-[-15deg] shadow-3xs z-30 font-sans"></div>
                
                <div className="flex-1 h-0 w-full bg-[#fcf9e8]/10 relative rounded-[4px_32px_8px_20px] overflow-hidden border border-[#b3cca8]/10">
                  {primaryPhoto ? (
                    <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#fdfbf6]">
                      <PetSvgIllustration species={pet.species} />
                    </div>
                  )}
                </div>
              </div>
            ) : settings.templateId === 'editorial' ? (
              <div className="w-full h-full overflow-hidden relative border-[2px] border-stone-900 flex-1 group">
                {primaryPhoto ? (
                  <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 bg-stone-50">
                    <PetSvgIllustration species={pet.species} />
                  </div>
                )}
              </div>
            ) : (
              /* minimalist — fills available height, no fixed aspect */
              <div className={`w-full h-full overflow-hidden relative rounded-xl border ${currentTheme.borderClass} shadow-sm group flex-1`}>
                {primaryPhoto ? (
                  <RepositionableImage src={primaryPhoto} alt={pet.name} pet={pet} setPet={setPet} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 bg-amber-50/50">
                    <PetSvgIllustration species={pet.species} />
                  </div>
                )}
                <div className={`absolute top-2 right-2 flex flex-col items-center justify-center text-center w-8 h-8 rounded-full border shadow-sm ${currentTheme.badgeBg} border-opacity-45 p-1 z-10`}>
                  <Heart className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="text-[6px] font-black uppercase tracking-tighter leading-none mt-0.5 text-slate-800">Love</span>
                </div>
              </div>
            )}
          </div>

          {/* GALLERY AUXILIARY IMAGES STRIP — only for multi-photo-capable templates */}
          {secondaryPhotos.length > 0 && !['editorial', 'comic', 'polaroid', 'whimsical', 'minimalist'].includes(settings.templateId) && (
            <div className="flex gap-2 justify-center w-full my-1.5 shrink-0 select-none">
              {secondaryPhotos.map((p, idx) => (
                <div key={idx} className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200/60 shadow-3xs hover:border-pink-500 transition-all shrink-0">
                  <img src={p} alt="Gallery mini" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* PRINCESS STYLE COMPREHENSIVE SPREADSHEET INDEX (DETAILED PET PROFILE) */}
          {settings.templateId === 'whimsical' ? (
            <div className="p-2.5 rounded-[22px_10px_18px_26px] border-2 border-dotted border-amber-300/80 bg-[#fffdf5]/80 flex flex-col gap-1.5 shadow-2xs text-[11px] md:text-[11.5px] font-bold text-[#0f5c3a] font-playful relative overflow-hidden shrink-0">
              <div className="text-center border-b border-dashed border-amber-200 pb-1.5 font-playful">
                <span className="text-stone-850 font-extrabold text-[13.5px] md:text-[14.5px] leading-snug w-full break-words block font-playful">{pet.breed || 'Unknown'}</span>
              </div>
              <div className="flex flex-col gap-y-1 py-1 border-b border-dashed border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="text-[#a27b3e] text-[9.5px] md:text-[10px] uppercase font-bold font-handwritten leading-none">Age:</span>
                  <span className="text-stone-850 font-extrabold text-[11px] md:text-[11.5px] leading-none font-playful">{pet.age || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a27b3e] text-[9.5px] md:text-[10px] uppercase font-bold font-handwritten leading-none">Weight:</span>
                  <span className="text-stone-850 font-extrabold text-[11px] md:text-[11.5px] leading-none font-playful">{pet.weight || 'Medium'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a27b3e] text-[9.5px] md:text-[10px] uppercase font-bold font-handwritten leading-none">Housetrained?</span>
                  <span className="text-stone-850 font-extrabold text-[10.5px] md:text-[11px] leading-none font-playful">
                    {pet.houseTrained === 'yes' ? '✓ Yup!' : pet.houseTrained === 'working-on-it' ? 'Learning!' : '✗ Nope'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-0.5 text-center text-[8.5px] md:text-[9px] font-bold font-sans w-full">
                <div className="bg-white/90 border border-amber-200/60 px-0.5 py-0.5 rounded leading-none">
                  <span className="text-[#a27b3e] text-[6.5px] md:text-[7px] block font-bold leading-none uppercase">DOGS</span>
                  <span className="text-stone-850 font-black leading-none block mt-0.5 text-[8.5px] md:text-[9px] font-sans">{pet.goodWithDogs === 'yes' ? '✓ OK' : pet.goodWithDogs === 'no' ? '✗ No' : pet.goodWithDogs === 'selective' ? 'Maybe' : '—'}</span>
                </div>
                <div className="bg-white/90 border border-amber-200/60 px-0.5 py-0.5 rounded leading-none">
                  <span className="text-[#a27b3e] text-[6.5px] md:text-[7px] block font-bold leading-none uppercase">CATS</span>
                  <span className="text-stone-850 font-black leading-none block mt-0.5 text-[8.5px] md:text-[9px] font-sans">{pet.goodWithCats === 'yes' ? '✓ OK' : pet.goodWithCats === 'no' ? '✗ No' : pet.goodWithCats === 'selective' ? 'Maybe' : '—'}</span>
                </div>
                <div className="bg-white/90 border border-[#b3cca8]/60 px-0.5 py-0.5 rounded leading-none">
                  <span className="text-[#a27b3e] text-[6.5px] md:text-[7px] block font-bold leading-none uppercase">KIDS</span>
                  <span className="text-stone-850 font-black leading-none block mt-0.5 text-[8.5px] md:text-[9px] font-sans">{pet.goodWithKids === 'yes' ? '✓ OK' : pet.goodWithKids === 'no' ? '✗ No' : pet.goodWithKids === 'selective' ? 'Maybe' : '—'}</span>
                </div>
              </div>
            </div>
          ) : settings.templateId === 'comic' ? (
            <div className="flex flex-col gap-1.5 shrink-0 pt-1">
              {/* Pill ribbon — key stats as floating tags, no border card */}
              <div className="flex flex-wrap gap-1">
                {[
                  { icon: '📍', label: pet.location || 'Local' },
                  { icon: '🎂', label: pet.age || 'Age N/A' },
                  { icon: '✦', label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown' },
                  { icon: '⚖️', label: pet.weight || 'Medium' },
                  { icon: '🏠', label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white/80 border border-rose-100 px-2 py-0.5 rounded-full text-[8.5px] font-bold text-stone-700 shadow-sm shrink-0">
                    <span className="text-[9px] leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
              {/* Color-coded compatibility strip */}
              <div className="flex gap-1">
                {[
                  { label: 'Dogs', val: pet.goodWithDogs },
                  { label: 'Cats', val: pet.goodWithCats },
                  { label: 'Kids', val: pet.goodWithKids },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 rounded-xl py-1 text-center ${
                    item.val === 'yes' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                    item.val === 'no' ? 'bg-rose-50 border border-rose-200 text-rose-700' :
                    'bg-stone-50 border border-stone-200 text-stone-500'
                  }`}>
                    <span className="text-[6.5px] uppercase font-black block leading-none">{item.label}</span>
                    <span className="text-[8px] font-black block mt-0.5 leading-none">
                      {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* minimalist / editorial / polaroid — pill ribbon + compat strip */
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex flex-wrap gap-1">
                {[
                  { label: pet.breed || 'Unknown' },
                  { label: pet.age || 'Age N/A' },
                  { label: pet.gender === 'boy' ? 'Male' : pet.gender === 'girl' ? 'Female' : 'Unknown sex' },
                  { label: pet.weight || 'Medium' },
                  { label: pet.houseTrained === 'yes' ? 'Housetrained ✓' : pet.houseTrained === 'working-on-it' ? 'Learning' : 'Untrained' },
                  ...(pet.location ? [{ label: pet.location }] : []),
                ].map((item, i) => (
                  <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[7.5px] font-bold shrink-0 ${
                    settings.templateId === 'editorial'
                      ? 'bg-stone-900 text-white'
                      : settings.templateId === 'polaroid'
                      ? 'bg-stone-100 text-stone-700 border border-stone-300'
                      : `${currentTheme.bgClass} border ${currentTheme.borderClass} text-slate-700`
                  }`}>
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {[
                  { label: 'Dogs', val: pet.goodWithDogs },
                  { label: 'Cats', val: pet.goodWithCats },
                  { label: 'Kids', val: pet.goodWithKids },
                ].map((item, i) => (
                  <div key={i} className={`flex-1 rounded-xl py-1 text-center border ${
                    item.val === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    item.val === 'no' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    'bg-stone-50 border-stone-200 text-stone-500'
                  }`}>
                    <span className="text-[6px] uppercase font-black block leading-none">{item.label}</span>
                    <span className="text-[7.5px] font-black block mt-0.5 leading-none">
                      {item.val === 'yes' ? '✓ Yes' : item.val === 'no' ? '✗ No' : '— ?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
      )}

      {/* ==================== 3. RETRO LOWER QR & CONTACT PANEL ==================== */}
      <div className="mt-1 pt-1 border-t border-stone-200 grid grid-cols-12 gap-3 items-center z-10 w-full shrink-0">
        
        {/* Organization metadata on the left (col-span-8) */}
        <div className="col-span-8 flex flex-col text-left">
          <h4 className="text-[12.5px] md:text-[13.5px] font-extrabold text-stone-900 truncate">
            {pet.rescueOrg || 'Independent Rescuer'}
          </h4>
          
          <div className="mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-x-2.5 text-[9.5px] md:text-[10px] text-stone-600 font-medium">
            {pet.fosterEmail && (
              <div className="flex items-center gap-1">
                <Mail className="w-2.5 h-2.5 text-stone-400 inline-block shrink-0" />
                <span className="truncate">{pet.fosterEmail}</span>
              </div>
            )}
            {pet.fosterPhone && (
              <div className="flex items-center gap-1 mt-0.5 sm:mt-0">
                <Phone className="w-2.5 h-2.5 text-stone-400 inline-block shrink-0" />
                <span>{pet.fosterPhone}</span>
              </div>
            )}
          </div>
          {pet.rescueWebsite && (
            <div className="flex items-center gap-1 text-[9.5px] md:text-[10px] text-rose-700 font-bold mt-0.5 select-all">
              <Globe className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span className="truncate hover:underline">{pet.rescueWebsite.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>

        {/* Scan code and QR panel on the right (col-span-4) */}
        <div className="col-span-4 flex items-center justify-end gap-2.5">
          <div className="text-right hidden sm:block">
            <span className="text-[7px] uppercase font-black text-rose-500 block leading-none">Find out more</span>
            <span className="text-[8.5px] font-black text-slate-800 uppercase block mt-0.5 leading-none">Apply to Adopt!</span>
          </div>
          
          <div className="bg-stone-50 border border-stone-200 p-0.5 rounded-lg w-14 h-14 relative flex items-center justify-center shadow-3xs shrink-0">
            {pet.rescueWebsite ? (
              <QRCodeImage 
                url={pet.rescueWebsite} 
                className="w-full h-full object-contain" 
                darkColor="#1c1917" 
                lightColor="#ffffff00"
              />
            ) : (
              <Heart className="w-7 h-7 text-rose-300" />
            )}
          </div>
        </div>

      </div>

      {/* Styled Brushstroke Bottom Tagline */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-[#4f46e5] to-red-400 opacity-90"></div>

    </div>
  );
};
