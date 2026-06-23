import React, { useState, useRef, useEffect } from 'react';
import { QRCodeImage } from './QRCodeImage';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  Heart, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Smartphone, 
  Printer, 
  Check, 
  RefreshCw,
  Mail,
  Phone,
  Globe,
  PlusCircle,
  HelpCircle,
  Info,
  Calendar,
  Clock,
  MapPin,
  HeartHandshake,
  Layout,
  Gift,
  Users,
  Compass,
  ArrowRight,
  Maximize2,
  X
} from 'lucide-react';

// Use Cases Definitions
export type FlyerUseCase = 'donation' | 'ongoing_volunteers' | 'event_volunteers' | 'fosters';

export interface RescueFlyerData {
  useCase: FlyerUseCase;
  header: string;
  subtitle: string;
  intro: string;
  items: string[]; // for donation needs, roles, or schedules
  thankYouMessage: string;
  ctaLabel: string;
  ctaDetails: string;
  
  // Contact Info
  orgName: string;
  email: string;
  phone: string;
  website: string;
  showQRCode: boolean;
}

const PRESETS: Record<FlyerUseCase, RescueFlyerData> = {
  donation: {
    useCase: 'donation',
    header: 'URGENT DONATION NEEDS',
    subtitle: 'Every little bit makes a massive difference for our animals',
    intro: 'Our shelter and foster home supply reserves are running critically low. Help us restock essential food and medical supplies so we can continue rescuing local animals!',
    items: [
      'Puppy & Kitten Wet Food (Paté style preferred)',
      'High-Durability Plastic Pet Crates (Medium & Large)',
      'Clumping Clay Unscented Cat Litter',
      'Washable Fleece Blankets & Large Bath Towels',
      'Training Treats and Chew-Proof Dog Toys'
    ],
    thankYouMessage: 'A heartfelt thank you from our board, fosters, and most of all, the animals. You’re helping the mission!',
    ctaLabel: 'Where to Drop Off or Donate online:',
    ctaDetails: 'Drop off in our donation boxes at Grateful Vet Clinic, or donate securely via our website.',
    orgName: 'Grateful Paws Rescue',
    email: 'contact@gratefulpawsrescue.org',
    phone: '415-555-0192',
    website: 'https://www.gratefulpawsrescue.org',
    showQRCode: true
  },
  ongoing_volunteers: {
    useCase: 'ongoing_volunteers',
    header: 'VOLUNTEERS NEEDED',
    subtitle: 'Find your purpose & save lives with our team',
    intro: 'Volunteering is a highly rewarding way to make a direct impact. Help us support our foster families, coordinate adoptions, and manage rescue operations!',
    items: [
      'Foster Coordinator: Match animals with supportive temporary homes.',
      'Rescue Road Driver: Safely transport pets to vet appointments.',
      'Creative Writer: Tell inspiring stories for our adoptables\' online profiles.',
      'Event Handler: Introduce pets to potential adopters at community fairs.'
    ],
    thankYouMessage: 'Join local action. No prior experience is required—full coaching and rescue gear are proudly provided!',
    ctaLabel: 'How to Join Our Team:',
    ctaDetails: 'Apply on our website under /volunteer or attend our monthly orientation event.',
    orgName: 'Grateful Paws Rescue',
    email: 'contact@gratefulpawsrescue.org',
    phone: '415-555-0192',
    website: 'https://www.gratefulpawsrescue.org',
    showQRCode: true
  },
  event_volunteers: {
    useCase: 'event_volunteers',
    header: 'JOIN OUR EVENT TEAM!',
    subtitle: 'Annual Spring Shelter Clean-up & Adoption Fair',
    intro: 'We are hosting our biggest community event of the year, bringing together regional rescue partners, loving foster families, and adoptables searching for forever homes!',
    items: [
      'Shift-A (8:00 AM - 11:30 AM): Canopy setup, safety gating, and banner hanging.',
      'Shift-B (11:30 AM - 3:00 PM): Guide guests, handle adoption inquiries, and distribute water.',
      'Shift-C (3:00 PM - 5:30 PM): Event clean-up, material loading, and pet safety transport.'
    ],
    thankYouMessage: 'Your time makes real magic happen. Lunch, volunteer shirts, and cold refreshments will be provided!',
    ctaLabel: 'Event Details & Register:',
    ctaDetails: 'August 15, 10:00 AM - 3:00 PM at Town Square Park. Sign up on our website events page!',
    orgName: 'Grateful Paws Rescue',
    email: 'contact@gratefulpawsrescue.org',
    phone: '415-555-0192',
    website: 'https://www.gratefulpawsrescue.org',
    showQRCode: true
  },
  fosters: {
    useCase: 'fosters',
    header: 'FOSTERS NEEDED!',
    subtitle: 'Become a foster hero. Every foster represents a life saved.',
    intro: 'Help save lives. Fostering is one of the most rewarding parts of rescue. Every foster home represents a life saved and opens up a space in a high-kill shelter for another animal to have a critical first chance.',
    items: [
      'We Provide All Supplies: Food, veterinary care, medications, crates, toys, and blankets are fully covered.',
      'You Provide the Heart: Give a rescue pet a temporary cozy couch, positive socialization, and basic house manners.',
      'Flexible Duration: Help for a weekend sleepover, a few weeks, or until adoption.',
      'The Joy of Transformation: Watch a once-scared, shut-down animal blossom in your living room.'
    ],
    thankYouMessage: 'Fostering is entirely free, richly satisfying, and the absolute cornerstone of our safety net.',
    ctaLabel: 'Apply to Foster Today:',
    ctaDetails: 'Complete the short, zero-obligation foster questionnaire on our main website today!',
    orgName: 'Grateful Paws Rescue',
    email: 'contact@gratefulpawsrescue.org',
    phone: '415-555-0192',
    website: 'https://www.gratefulpawsrescue.org',
    showQRCode: true
  }
};

interface ThemeStyle {
  id: string;
  name: string;
  layoutName: string;
  bgGrad: string;
  cardBg: string;
  textHeader: string;
  textBody: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  accentBtn: string;
  bulletIconColor: string;
  fontFamily: string;
}

const FLYER_THEMES: ThemeStyle[] = [
  {
    id: 'terracotta',
    name: 'Warm Terracotta',
    layoutName: 'Classic Layout',
    bgGrad: 'from-amber-50 to-orange-100/65',
    cardBg: 'bg-white',
    textHeader: 'text-stone-900 font-outfit',
    textBody: 'text-stone-700 font-sans',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-700',
    accentBorder: 'border-orange-200/80',
    accentBtn: 'bg-orange-600 hover:bg-orange-700 text-white',
    bulletIconColor: 'text-orange-500',
    fontFamily: 'font-outfit'
  },
  {
    id: 'emerald',
    name: 'Emerald Wood',
    layoutName: 'Cover Banner Layout',
    bgGrad: 'from-emerald-50/50 via-emerald-100/20 to-emerald-200/10',
    cardBg: 'bg-stone-50/90',
    textHeader: 'text-emerald-950 font-serif',
    textBody: 'text-slate-800 font-serif',
    badgeBg: 'bg-emerald-600/10',
    badgeText: 'text-emerald-800',
    accentBorder: 'border-emerald-350',
    accentBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    bulletIconColor: 'text-emerald-700',
    fontFamily: 'font-serif'
  },
  {
    id: 'breezy',
    name: 'Serene Breezy',
    layoutName: 'Side-by-Side Split',
    bgGrad: 'from-sky-50 to-indigo-100/40',
    cardBg: 'bg-white',
    textHeader: 'text-indigo-950 font-display',
    textBody: 'text-slate-700 font-sans',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-700',
    accentBorder: 'border-sky-200',
    accentBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    bulletIconColor: 'text-sky-500',
    fontFamily: 'font-display'
  },
  {
    id: 'amber',
    name: 'Radiant Amber',
    layoutName: 'Bento Grid Layout',
    bgGrad: 'from-amber-50 to-yellow-100/50',
    cardBg: 'bg-white',
    textHeader: 'text-amber-950 font-outfit',
    textBody: 'text-stone-700 font-sans',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-850 font-extrabold',
    accentBorder: 'border-amber-300',
    accentBtn: 'bg-amber-500 hover:bg-amber-600 text-stone-950',
    bulletIconColor: 'text-amber-600',
    fontFamily: 'font-outfit'
  },
  {
    id: 'playful',
    name: 'Playful Peach',
    layoutName: 'Overlapping Offset',
    bgGrad: 'from-rose-50 to-rose-100/45',
    cardBg: 'bg-white',
    textHeader: 'text-rose-950 font-playful',
    textBody: 'text-slate-700 font-sans',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-700',
    accentBorder: 'border-rose-200',
    accentBtn: 'bg-rose-500 hover:bg-rose-600 text-white',
    bulletIconColor: 'text-rose-500',
    fontFamily: 'font-playful'
  }
];

interface RepositionableOutreachImageProps {
  id: number;
  src: string;
  alt: string;
  className?: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  updateZoom: (idx: number, val: number) => void;
  updateOffsetX: (idx: number, val: number) => void;
  updateOffsetY: (idx: number, val: number) => void;
}

const RepositionableOutreachImage: React.FC<RepositionableOutreachImageProps> = ({
  id,
  src,
  alt,
  className = "w-full h-full object-cover",
  zoom,
  offsetX,
  offsetY,
  updateZoom,
  updateOffsetX,
  updateOffsetY
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const startOffsetXRef = React.useRef(0);
  const startOffsetYRef = React.useRef(0);
  const pinchStartDistRef = React.useRef<number | null>(null);
  const pinchStartZoomRef = React.useRef<number>(1);
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setContextMenu(null);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startOffsetXRef.current = offsetX;
    startOffsetYRef.current = offsetY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Shift scaled by zoom zoom factor to match drag speed
    const pctX = Math.round(deltaX / zoom);
    const pctY = Math.round(deltaY / zoom);

    updateOffsetX(id, Math.min(250, Math.max(-250, startOffsetXRef.current + pctX)));
    updateOffsetY(id, Math.min(250, Math.max(-250, startOffsetYRef.current + pctY)));
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cw = containerRef.current?.clientWidth ?? 200;
    const ch = containerRef.current?.clientHeight ?? 200;
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    setContextMenu({
      x: Math.min(rawX, cw - 120),
      y: Math.min(rawY, ch - 65),
    });
  };

  const handleZoomIn = () => {
    updateZoom(id, Math.min(3, parseFloat((zoom + 0.25).toFixed(2))));
    setContextMenu(null);
  };

  const handleZoomOut = () => {
    updateZoom(id, Math.max(0.5, parseFloat((zoom - 0.25).toFixed(2))));
    setContextMenu(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      pinchStartDistRef.current = null;
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      startOffsetXRef.current = offsetX;
      startOffsetYRef.current = offsetY;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pctX = Math.round(deltaX / zoom);
      const pctY = Math.round(deltaY / zoom);
      updateOffsetX(id, Math.min(250, Math.max(-250, startOffsetXRef.current + pctX)));
      updateOffsetY(id, Math.min(250, Math.max(-250, startOffsetYRef.current + pctY)));
    } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / pinchStartDistRef.current;
      const newZoom = Math.min(3, Math.max(0.5, pinchStartZoomRef.current * scale));
      updateZoom(id, parseFloat(newZoom.toFixed(2)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStartDistRef.current = null;
    if (e.touches.length === 0) isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    const nextZoom = Math.min(3, Math.max(0.5, zoom + zoomDelta));
    updateZoom(id, parseFloat(nextZoom.toFixed(2)));
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none active:cursor-grabbing cursor-grab z-10 touch-none overflow-hidden"
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
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        draggable={false}
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out'
        }}
      />
      
      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden text-[9px] font-bold py-0.5"
          style={{ left: contextMenu.x, top: contextMenu.y, minWidth: '95px' }}
          onMouseDown={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex items-center gap-1 w-full px-2.5 py-1.5 text-left hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            🔍 Zoom In
          </button>
          <div className="border-t border-stone-100" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex items-center gap-1 w-full px-2.5 py-1.5 text-left hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            🔎 Zoom Out
          </button>
        </div>
      )}

      <div className="absolute bottom-1 right-1 bg-black/60 text-white rounded-md text-[6.5px] py-0.5 px-1 font-sans pointer-events-none select-none z-30 leading-none">
        Drag/Scroll to adjust
      </div>
    </div>
  );
};

export const RescueNeedsFlyers: React.FC = () => {
  const [data, setData] = useState<RescueFlyerData>({ ...PRESETS.donation });
  const [activeTheme, setActiveTheme] = useState<ThemeStyle>(FLYER_THEMES[0]);
  const [aspectRatio, setAspectRatio] = useState<'flyer' | 'square'>('flyer');
  
  // Custom uploaded photos state
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoZooms, setPhotoZooms] = useState<number[]>([1, 1, 1]);
  const [photoOffsetsX, setPhotoOffsetsX] = useState<number[]>([0, 0, 0]);
  const [photoOffsetsY, setPhotoOffsetsY] = useState<number[]>([0, 0, 0]);
  const [noPhoto, setNoPhoto] = useState<boolean>(false);
  
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [newItemInput, setNewItemInput] = useState<string>('');
  
  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUseCaseChange = (uc: FlyerUseCase) => {
    const preset = PRESETS[uc];
    // Keep custom contacts if they filled them out
    setData({
      ...preset,
      orgName: data.orgName || preset.orgName,
      email: data.email || preset.email,
      phone: data.phone || preset.phone,
      website: data.website || preset.website,
      showQRCode: data.showQRCode
    });
    setSuccessToast(`Switched design context to "${uc.replace('_', ' ').toUpperCase()}"! Adjust fields below.`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBulletItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemInput.trim()) {
      setData(prev => ({
        ...prev,
        items: [...prev.items, newItemInput.trim()]
      }));
      setNewItemInput('');
    }
  };

  const handleRemoveBulletItem = (idx: number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3 - photos.length);
      filesArray.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotos(prev => [...prev, event.target!.result as string].slice(0, 3));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    // Reset positions
    setPhotoZooms(prev => prev.map((z, i) => i === idx ? 1 : z));
    setPhotoOffsetsX(prev => prev.map((x, i) => i === idx ? 0 : x));
    setPhotoOffsetsY(prev => prev.map((y, i) => i === idx ? 0 : y));
  };

  const updatePhotoZoom = (idx: number, val: number) => {
    setPhotoZooms(prev => prev.map((z, i) => i === idx ? val : z));
  };

  const updatePhotoOffsetX = (idx: number, val: number) => {
    setPhotoOffsetsX(prev => prev.map((x, i) => i === idx ? val : x));
  };

  const updatePhotoOffsetY = (idx: number, val: number) => {
    setPhotoOffsetsY(prev => prev.map((y, i) => i === idx ? val : y));
  };

  const triggerDownload = async (targetRatio: 'flyer' | 'square') => {
    // Rescue Organization is a required field! Validate here before any download.
    if (!data.orgName.trim()) {
      setSuccessToast(`⚠️ Warning: "Rescue Organization" is a required field! Please enter the organization name in Step 4.`);
      setTimeout(() => setSuccessToast(null), 5000);
      return;
    }

    setIsDownloading(true);
    const previousRatio = aspectRatio;
    try {
      if (previousRatio !== targetRatio) {
        setAspectRatio(targetRatio);
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      const el = document.getElementById('rescue-flyer-render-container');
      if (!el) {
        throw new Error('Flyer render container was not found in active workspace.');
      }

      const dataUrl = await toPng(el, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          boxShadow: 'none',
          border: 'none',
        }
      });

      if (targetRatio === 'flyer') {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: [8.5, 11]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');
        const fname = `${data.orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${data.useCase}_flyer.pdf`;
        pdf.save(fname);
        setSuccessToast(`Successfully downloaded your 8.5" x 11" printable flyer PDF!`);
      } else {
        const link = document.createElement('a');
        const fname = `${data.orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${data.useCase}_square.png`;
        link.download = fname;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccessToast(`Successfully saved your high-res social media square PNG image!`);
      }
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      console.error(err);
      alert(`Export failed: ${err.message || 'Error occurred during graphic rendering.'}`);
    } finally {
      if (previousRatio !== targetRatio) {
        setAspectRatio(previousRatio);
      }
      setIsDownloading(false);
    }
  };

  // Renders the specific photos grid
  const renderPhotoGrid = (heightClassOne: string, heightClassTwo: string, heightClassThree: string) => {
    if (photos.length === 0) {
      return (
        <div className="border border-dashed border-indigo-200 bg-sky-50/15 rounded-xl p-2.5 py-3 text-center space-y-1 max-h-[110px] shrink-0">
          <Heart className="w-4 h-4 text-indigo-400 mx-auto animate-pulse" />
          <p className="text-[9px] font-black tracking-widest text-indigo-950 uppercase">INSPIRATIONAL IMAGES</p>
          <p className="text-[8.5px] text-indigo-700/80 font-bold px-4 leading-normal">
            Upload outreach photos of volunteers, foster pets, or donations on the left side to activate layout frames!
          </p>
        </div>
      );
    }

    return (
      <div className={`grid gap-2.5 select-none py-1.5 shrink-0 ${
        photos.length === 1 ? 'grid-cols-1' : 
        photos.length === 2 ? 'grid-cols-2' : 
        'grid-cols-3'
      }`}>
        {photos.map((src, index) => {
          // Playful theme has custom staggered rotation
          const rotationClass = activeTheme.id === 'playful' 
            ? (index % 2 === 0 ? 'rotate-2 hover:rotate-0' : '-rotate-2 hover:rotate-0') 
            : '';

          return (
            <div 
              key={index} 
              className={`relative rounded-2xl overflow-hidden border-2 shadow-md bg-stone-100 transition-transform duration-200 ${
                activeTheme.accentBorder
              } ${rotationClass} ${
                photos.length === 1 ? heightClassOne : 
                photos.length === 2 ? heightClassTwo : 
                heightClassThree
              }`}
            >
              <div className="absolute top-1 left-1.5 bg-white/95 backdrop-blur-xs text-[7px] font-black px-2 py-0.5 rounded shadow-2xs uppercase tracking-widest z-10 text-stone-800">
                ★ OUTREACH
              </div>
              <RepositionableOutreachImage
                id={index}
                src={src}
                alt={`Render block ${index}`}
                zoom={photoZooms[index] || 1}
                offsetX={photoOffsetsX[index] || 0}
                offsetY={photoOffsetsY[index] || 0}
                updateZoom={updatePhotoZoom}
                updateOffsetX={updatePhotoOffsetX}
                updateOffsetY={updatePhotoOffsetY}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Renders the materials/shifts bullets
  const renderBullets = () => {
    return (
      <div className="space-y-2">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">
          {data.useCase === 'donation' ? '📌 REQUIRED MATERIALS:' : data.useCase === 'fosters' ? '📌 WHY FOSTER WITH US:' : '📌 HOW YOU CAN ASSIST:'}
        </span>
        
        <div className="grid grid-cols-1 gap-1.5">
          {data.items.slice(0, 5).map((bullet, index) => {
            const colonIndex = bullet.indexOf(':');
            const hasColon = colonIndex > -1;
            const headline = hasColon ? bullet.substring(0, colonIndex) : bullet;
            const detail = hasColon ? bullet.substring(colonIndex + 1) : '';

            // Playful theme custom bullet marker
            const BulletIcon = activeTheme.id === 'playful' ? Sparkles : HeartHandshake;

            return (
              <div key={index} className="flex items-start gap-1.5 text-stone-800 text-[9px] md:text-[9.5px] w-full">
                <div className={`p-[2px] mt-0.5 bg-indigo-50/50 rounded-full shrink-0 ${activeTheme.bulletIconColor}`}>
                  <BulletIcon className="w-3 h-3 shrink-0" />
                </div>
                <div className="leading-tight flex-1 text-left">
                  {hasColon ? (
                    <p className="font-semibold text-slate-800">
                      <strong className="text-slate-900 font-extrabold">{headline}:</strong> {detail}
                    </p>
                  ) : (
                    <p className="font-bold text-slate-705">{bullet}</p>
                  )}
                </div>
              </div>
            );
          })}
          {data.items.length === 0 && (
            <p className="text-[10px] text-slate-400 italic">No checklist items specified yet. Add highlights in Step 3!</p>
          )}
        </div>
      </div>
    );
  };

  // Core component contents depending on the theme preset
  const renderFlyerContent = () => {
    const isSquare = aspectRatio === 'square';
    
    // Theme 2: emerald - Editorial / Magazine Banner Layout
    if (activeTheme.id === 'emerald') {
      return (
        <div className="flex-grow flex flex-col justify-between h-full space-y-2.5">
          {/* Cover image banner across the top */}
          {!noPhoto && (
            <div className="-mx-3.5 -mt-3.5 md:-mx-4.5 md:-mt-4.5 mb-1">
              {photos.length > 0 ? (
                <div className="relative h-22 md:h-28 overflow-hidden border-b-4 border-emerald-800 bg-stone-200">
                  <div className="absolute top-1.5 left-3.5 bg-emerald-900 text-white text-[7px] font-black px-2 py-0.5 rounded z-15 tracking-widest uppercase pointer-events-none">
                    OFFICIAL BANNER
                  </div>
                  <RepositionableOutreachImage
                    id={0}
                    src={photos[0]}
                    alt="Banner lead"
                    zoom={photoZooms[0] || 1}
                    offsetX={photoOffsetsX[0] || 0}
                    offsetY={photoOffsetsY[0] || 0}
                    updateZoom={updatePhotoZoom}
                    updateOffsetX={updatePhotoOffsetX}
                    updateOffsetY={updatePhotoOffsetY}
                  />
                  {photos.length > 1 && (
                    <div className="absolute top-1.5 right-1.5 flex gap-1 z-20">
                      {photos.slice(1).map((src, i) => (
                        <div key={i} className="w-8 h-8 rounded border border-white overflow-hidden shadow-sm">
                          <img src={src} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-16 md:h-18 bg-emerald-950/90 text-emerald-100 flex flex-col items-center justify-center p-2 text-center border-b-2 border-emerald-700">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse mb-0.5" />
                  <span className="text-[9px] font-black tracking-widest uppercase">EMERALD OUTREACH JOURNAL</span>
                </div>
              )}
            </div>
          )}

          <div className="text-center space-y-0.5 relative z-10">
            <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-950 font-black text-[8px] uppercase tracking-wider rounded">
              {data.orgName ? data.orgName : 'REQUIRED RESCUE NAME'}
            </div>
            <h1 className="text-lg md:text-xl font-black text-emerald-950 leading-tight uppercase tracking-tight">
              {data.header || 'COMMUNITY NEED'}
            </h1>
            <p className="text-[10px] font-bold text-emerald-800 leading-none tracking-wide italic">
              {data.subtitle || 'Your support helps local animals'}
            </p>
            <div className="w-20 h-0.5 bg-emerald-800/30 mx-auto mt-1" />
          </div>

          <div className="bg-emerald-50/50 p-2 py-1.5 rounded-lg border border-emerald-200/40">
            <p className={`${noPhoto ? 'text-[11px] p-2 py-1' : 'text-[9.5px]'} italic leading-relaxed text-slate-755 text-center font-semibold`}>
              " {data.intro || 'Fostering and volunteering details directly rescue regional animals and prevent shelter intakes. Get involved today!' } "
            </p>
          </div>

          {/* Bullets layout inside editorial frame */}
          <div className="p-0.5">
            {renderBullets()}
          </div>

          <div className="text-center pt-0.5 border-t border-emerald-200/30">
            <span className="text-[9px] font-bold text-emerald-900 bg-white px-2.5 py-0.5 rounded-full border border-emerald-100">
              💝 {data.thankYouMessage || 'We appreciate it! You are help saving local pet lives.'}
            </span>
          </div>

          {/* CTA Footer with Emerald style */}
          <div className="border-t border-emerald-800/20 pt-1.5 flex items-center justify-between gap-3">
            <div className="flex-1 space-y-1.5 text-left">
              <div>
                <span className="text-[8px] font-black uppercase text-emerald-800 block tracking-wider leading-none">
                  {data.ctaLabel}
                </span>
                <p className="text-[9.5px] font-extrabold text-emerald-950 leading-tight">
                  {data.ctaDetails}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {data.orgName && (
                  <span className="bg-emerald-900/10 px-1.5 py-0.5 rounded text-[7.5px] font-black text-emerald-900">
                    {data.orgName}
                  </span>
                )}
                {data.website && (
                  <span className="bg-emerald-900/10 px-1.5 py-0.5 rounded text-[7.5px] font-bold text-emerald-950">
                    {data.website.replace('https://', '').replace('www.', '')}
                  </span>
                )}
              </div>
            </div>

            {data.showQRCode && data.website && (
              <div className="bg-white p-0.5 rounded border border-emerald-200 shrink-0 flex flex-col items-center gap-0.5 shadow-3xs">
                <QRCodeImage url={data.website} className="w-7 h-7" />
                <span className="text-[6px] font-bold text-emerald-850">SCAN LINK</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Theme 3: breezy - Serene Breezy Split Layout (Left Column text, Right Column visuals)
    if (activeTheme.id === 'breezy') {
      return (
        <div className="flex-grow flex flex-col justify-between h-full space-y-2">
          <div className="text-center space-y-0.5">
            <span className="text-[8px] tracking-widest font-extrabold uppercase bg-sky-200/50 text-indigo-950 px-2.5 py-0.5 rounded-full inline-block">
              ✦ {data.orgName || 'ORGANIZATION'} TEAM
            </span>
            <h1 className="text-xl md:text-2xl font-black text-sky-950 tracking-tighter leading-tight uppercase">
              {data.header || 'COMMUNITY NEED'}
            </h1>
            <p className="text-[10px] font-black text-indigo-600 tracking-wider uppercase italic">
              {data.subtitle || 'Every hand saves a paw'}
            </p>
          </div>

          {/* Side-by-Side Dual Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-0.5 flex-grow">
            {/* Left side text column */}
            <div className={`${noPhoto ? 'sm:col-span-12' : 'sm:col-span-8'} flex flex-col justify-center space-y-2 text-left`}>
              <div className="bg-sky-50/60 p-2 py-1.5 rounded-xl border border-sky-100 font-sans">
                <p className={`${noPhoto ? 'text-xs' : 'text-[9px]'} leading-relaxed text-slate-800 font-medium italic`}>
                  " {data.intro || 'Fostering and volunteering details directly rescue regional animals and prevent shelter intakes. Get involved today!' } "
                </p>
              </div>
              
              {renderBullets()}
            </div>

            {/* Right side visual gallery column */}
            {!noPhoto && (
              <div className="sm:col-span-4 flex flex-col justify-center space-y-1.5">
                {photos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    {photos.slice(0, 2).map((src, i) => (
                      <div key={i} className="h-13 md:h-16 rounded-lg overflow-hidden border border-sky-200 relative shadow-sm">
                        <RepositionableOutreachImage
                          id={i}
                          src={src}
                          alt={`Breezy gallery item ${i}`}
                          zoom={photoZooms[i] || 1}
                          offsetX={photoOffsetsX[i] || 0}
                          offsetY={photoOffsetsY[i] || 0}
                          updateZoom={updatePhotoZoom}
                          updateOffsetX={updatePhotoOffsetX}
                          updateOffsetY={updatePhotoOffsetY}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full border border-dashed border-sky-200 bg-sky-100/20 rounded-xl flex flex-col items-center justify-center p-2 text-center mini-gallery">
                    <Compass className="w-5 h-5 text-sky-400 mb-0.5" />
                    <span className="text-[7.5px] font-bold text-sky-850">Visual Frame</span>
                  </div>
                )}

                {data.showQRCode && data.website && (
                  <div className="bg-white p-1.5 rounded-lg border border-sky-150 flex items-center justify-between gap-1 shadow-3xs">
                    <span className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Register here:</span>
                    <QRCodeImage url={data.website} className="w-6.5 h-6.5" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center pt-0.5 border-t border-sky-100 font-extrabold text-[9px] text-indigo-700">
            💝 {data.thankYouMessage || 'We appreciate it! You are help saving local pet lives.'}
          </div>

          {/* Minimal Breezy footer */}
          <div className="border-t border-sky-200/50 pt-1.5 flex justify-between items-center bg-indigo-50/45 p-1.5 px-2.5 rounded-xl">
            <div className="text-left">
              <span className="text-[7.5px] font-black text-indigo-650 block uppercase">{data.ctaLabel}</span>
              <p className="text-[9.5px] font-black text-slate-800 leading-none">{data.ctaDetails}</p>
            </div>
            {data.website && (
              <span className="text-[7.5px] bg-white border border-sky-100 font-extrabold text-indigo-600 px-1.5 py-0.5 rounded shadow-3xs">
                {data.website.replace('https://', '').replace('www.', '')}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Theme 4: amber - Bento Box Modular Grid Layout
    if (activeTheme.id === 'amber') {
      return (
        <div className="flex-grow flex flex-col justify-between h-full space-y-1.5">
          {/* Top Plate Card */}
          <div className="bg-amber-50 p-2 rounded-xl border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] text-center space-y-0.5">
            <div className="text-[7.5px] font-black tracking-widest text-amber-950 uppercase">
              // {data.orgName ? data.orgName.toUpperCase() : 'REQUIRED ORG'}
            </div>
            <h1 className="text-lg md:text-xl font-black text-stone-950 leading-none tracking-tight">
              {data.header || 'COMMUNITY NEED'}
            </h1>
            <p className="text-[9.5px] font-bold text-amber-900 uppercase">
              {data.subtitle || 'Act Local • Save Lives'}
            </p>
          </div>

          {/* Bento row 1: Stacked visual box and the checklist box */}
          <div className={`grid grid-cols-1 ${noPhoto ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-2.5 py-0.5 flex-grow`}>
            {/* Bento block: Checklist */}
            <div className="bg-white p-2.5 rounded-xl border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between col-span-full">
              {renderBullets()}
            </div>

            {/* Bento block: Image gallery / placeholder list */}
            {!noPhoto && (
              <div className="bg-white p-2 rounded-xl border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
                {photos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    <div className="h-16 rounded-lg overflow-hidden border border-stone-900 relative">
                      <RepositionableOutreachImage
                        id={0}
                        src={photos[0]}
                        alt="Bento box lead image"
                        zoom={photoZooms[0] || 1}
                        offsetX={photoOffsetsX[0] || 0}
                        offsetY={photoOffsetsY[0] || 0}
                        updateZoom={updatePhotoZoom}
                        updateOffsetX={updatePhotoOffsetX}
                        updateOffsetY={updatePhotoOffsetY}
                      />
                    </div>
                    {photos.length > 1 && (
                      <div className="grid grid-cols-2 gap-1 text-center text-[7.5px] font-black">
                        <div className="bg-amber-100 p-0.5 rounded border border-stone-900">
                          📁 {photos.length} Photos
                        </div>
                        <div className="bg-stone-100 p-0.5 rounded border border-stone-900">
                          🐾 Active pet
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full bg-amber-50/40 p-2.5 rounded-lg border border-dashed border-amber-400 flex flex-col items-center justify-center text-center space-y-0.5 min-h-[70px]">
                    <Gift className="w-4 h-4 text-amber-500 animate-bounce" />
                    <span className="text-[7.5px] font-black uppercase text-amber-950">Supply visual gallery active</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bento Row 3: Narrative highlight & thank you message */}
          <div className="bg-stone-50 p-2 rounded-lg border border-stone-350 text-center">
            <p className="text-[9px] leading-tight text-slate-700 font-semibold italic">
              " {data.intro || 'Fostering and volunteering details directly rescue regional animals and prevent shelter intakes. Get involved today!' } "
            </p>
            <p className="text-[9px] font-black text-rose-700 mt-0.5">
              💝 {data.thankYouMessage || 'We appreciate it! You are help saving local pet lives.'}
            </p>
          </div>

          {/* Bento CTA panel */}
          <div className="bg-amber-500 p-2 py-1.5 rounded-lg border-2 border-stone-900 flex justify-between items-center text-stone-950">
            <div className="text-left space-y-0.5">
              <span className="text-[7.5px] font-black tracking-wider uppercase block">{data.ctaLabel}</span>
              <p className="text-[9.5px] font-black leading-tight">{data.ctaDetails}</p>
            </div>
            {data.showQRCode && data.website && (
              <div className="bg-white p-0.5 rounded border-2 border-stone-900 shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <QRCodeImage url={data.website} className="w-6.5 h-6.5" />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Theme 5: playful - Playful Peach Whimsical Layout
    if (activeTheme.id === 'playful') {
      return (
        <div className="flex-grow flex flex-col justify-between h-full space-y-2">
          {/* Whimsical Tilted Title Plate */}
          <div className="text-center space-y-0.5 relative z-10">
            <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[8px] font-black text-rose-600 rotate-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-rose-500 animate-spin" />
              <span>{data.orgName ? data.orgName : 'Playful Friends'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-rose-950 mt-0.5 leading-none font-playful relative tracking-tight">
              {/* Highlight highlighter look in peach theme */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-2.5 bg-rose-200/50 -z-10 rounded-full" />
              {data.header || 'COMMUNITY NEED'}
            </h1>
            <p className="text-xs font-black text-rose-600 tracking-wider">
              📣 {data.subtitle || 'Helping friendly souls find homes'}
            </p>
          </div>

          {/* Staggered overlapping visual grid box */}
          {!noPhoto && renderPhotoGrid('h-36 md:h-44', 'h-24 md:h-28', 'h-16 md:h-20')}

          {/* Whimsical Speech bubble narrative card */}
          <div className="bg-rose-50/80 p-3.5 rounded-3xl border-2 border-rose-100 relative shadow-sm text-center">
            {/* Speach bubble visual notch */}
            <div className="absolute -top-2 left-6 w-4 h-4 bg-rose-50 border-t border-l border-rose-100 rotate-45" />
            <p className={`${noPhoto ? 'text-xs' : 'text-[10px]'} leading-relaxed text-rose-955 font-bold italic`}>
              " {data.intro || 'Fostering and volunteering details directly rescue regional animals and prevent shelter intakes. Get involved today!' } "
            </p>
          </div>

          <div className="p-1">
            {renderBullets()}
          </div>

          {/* Whimsical closure & CTA details */}
          <div className="border-t-2 border-dashed border-rose-300 pt-3 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2 text-left">
              <div>
                <span className="text-[8.5px] font-black uppercase text-rose-600 block tracking-wider leading-none">
                  🌻 {data.ctaLabel}
                </span>
                <p className={`${noPhoto ? 'text-[11px]' : 'text-[10px]'} font-extrabold text-rose-950 leading-snug mt-1`}>
                  {data.ctaDetails}
                </p>
              </div>

              {/* Contacts info labels */}
              <div className="flex flex-wrap gap-1">
                {data.email && (
                  <span className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[8px] font-black text-rose-700">
                    {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="bg-rose-50 border border-slate-100 px-2 py-0.5 rounded text-[8px] font-extrabold text-slate-600">
                    {data.phone}
                  </span>
                )}
              </div>
            </div>

            {data.showQRCode && data.website && (
              <div className="bg-white p-1 rounded-xl border-2 border-rose-200 shrink-0 flex flex-col items-center gap-0.5 shadow-2xs rotate-2">
                <QRCodeImage url={data.website} className="w-8 h-8" />
                <span className="text-[6px] font-black text-rose-500">SCAN ME</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Theme 1: terracotta (default classic layout)
    return (
      <div className="flex-grow flex flex-col justify-between h-full space-y-2 mt-0 pt-0">
        {/* HEADER BADGE & LABELS */}
        <div className="text-center space-y-1 relative z-10 pt-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8.5px] tracking-widest font-black uppercase shadow-2xs bg-white text-indigo-950 border border-slate-100 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>{data.orgName.toUpperCase()} OUTREACH</span>
          </div>
          
          <h1 className={`text-xl md:text-2xl font-black tracking-tight leading-tight uppercase ${activeTheme.textHeader}`}>
            {data.header || 'COMMUNITY NEED'}
          </h1>
          
          <p className="text-[10px] font-black text-indigo-600 leading-none uppercase tracking-wider italic px-4">
            {data.subtitle || 'Make high value difference'}
          </p>
          
          <div className="w-14 h-0.5 bg-indigo-600/40 mx-auto rounded-full mt-1.5" />
        </div>

        {/* Dynamic photos gallery */}
        {!noPhoto && renderPhotoGrid('h-28 md:h-34', 'h-20 md:h-24', 'h-14 md:h-18')}

        {/* MAIN NARRATIVE HOOK TEXT */}
        <div className="bg-white/90 backdrop-blur-xs p-2.5 py-2 px-3.5 rounded-xl border border-slate-150/70 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-600/45" />
          <p className={`${noPhoto ? 'text-[11px] font-bold' : 'text-[9.5px] font-semibold'} leading-normal text-slate-700 italic text-center`}>
            " {data.intro || 'Fostering and volunteering details directly rescue regional animals and prevent shelter intakes. Get involved today!' } "
          </p>
        </div>

        {/* Highlights bullets checklist list */}
        {renderBullets()}

        {/* CLOSING / GRATITUDE STATEMENT */}
        <div className="text-center border-t border-slate-100 pt-1.5 space-y-0.5">
          <p className={`${noPhoto ? 'text-[11px]' : 'text-[9.5px]'} leading-relaxed font-black text-rose-600`}>
            💝 {data.thankYouMessage || 'We appreciate it! You are help saving local pet lives.'}
          </p>
        </div>

        {/* CALL TO ACTION & FOOTER */}
        <div className="border-t-2 border-indigo-600/25 pt-2.5 md:pt-3 flex items-center justify-between gap-3">
          <div className="flex-1 space-y-2 text-left">
            <div className="space-y-1 md:space-y-1.5">
              <span className="text-[9px] font-black uppercase text-indigo-600 block tracking-wider leading-none">
                {data.ctaLabel}
              </span>
              <p className="text-[10.5px] md:text-[11.5px] font-black text-indigo-950 leading-snug">
                {data.ctaDetails}
              </p>
            </div>

            {/* CONTACT INFO PILLS CONTAINER */}
            <div className="flex flex-wrap gap-1">
              {data.orgName && (
                <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-1.5 py-0.5 rounded text-[8px] font-black text-stone-600">
                  {data.orgName}
                </span>
              )}
              {data.website && (
                <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-indigo-600">
                  <Globe className="w-2.5 h-2.5" />
                  <span>{data.website.replace('https://', '').replace('www.', '')}</span>
                </span>
              )}
              {data.email && (
                <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-stone-500">
                  <Mail className="w-2.5 h-2.5" />
                  <span>{data.email}</span>
                </span>
              )}
              {data.phone && (
                <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-stone-500">
                  <Phone className="w-2.5 h-2.5" />
                  <span>{data.phone}</span>
                </span>
              )}
            </div>
          </div>

          {/* Website Link QR Code */}
          {data.showQRCode && data.website && (
            <div className="bg-white p-0.5 rounded-lg border border-slate-250 shadow-sm shrink-0 flex flex-col items-center gap-0.5">
              <QRCodeImage url={data.website} className="w-7 h-7" />
              <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none">SCAN LINK</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main high-res clone container rendered for actual canvas saving or scaled full-screen popup
  const renderFlyerMainContainerHTML = (isScaled: boolean = false) => {
    return (
      <div 
        id={isScaled ? "rescue-flyer-render-container" : "rescue-flyer-render-container"}
        className={`w-full bg-white relative select-none scroll-hide border border-slate-200/60 overflow-hidden flex flex-col justify-between ${
          activeTheme.fontFamily
        } ${
          aspectRatio === 'square' ? 'aspect-square pt-2 px-2.5 pb-2 md:pt-2.5 md:px-3 md:pb-3' : 'poster-proportions pt-2.5 px-3 pb-3 md:pt-3 md:px-3.5 md:pb-3.5'
        }`}
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.01) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
          height: aspectRatio === 'square' ? '100%' : undefined
        }}
      >
        {/* AMBIENT CORNER MOTIFS */}
        <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 rounded-tl-xl ${activeTheme.accentBorder} opacity-60`} />
        <div className={`absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 rounded-tr-xl ${activeTheme.accentBorder} opacity-60`} />
        <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 rounded-bl-xl ${activeTheme.accentBorder} opacity-60`} />
        <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 rounded-br-xl ${activeTheme.accentBorder} opacity-60`} />

        {/* OVERLAY BG GRADIENT */}
        <div className={`absolute inset-3 rounded-2xl bg-gradient-to-br ${activeTheme.bgGrad} opacity-35 -z-10`} />

        {renderFlyerContent()}

        <div className="absolute bottom-1 right-3 text-[7px] text-slate-400 font-mono italic">
          Powered by RescueKit • Share & Save Lives
        </div>
      </div>
    );
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* HEADER BAR */}
      <div className="col-span-full bg-white border border-sky-100 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 font-fraunces">
            Create Rescue Outreach Flyers in Minutes
          </h2>
          <p className="text-sm text-slate-500 font-bold mt-1.5">
            Easily design and print outreach material for rescue item donations, foster signups, and volunteer roles.
          </p>
        </div>
        <div className="hidden md:block text-right bg-sky-50/50 p-2.5 px-4 rounded-2xl border border-sky-100 shrink-0">
          <span className="text-[11px] md:text-[11.5px] font-black text-rose-500 block">Designed for rescues, fosters & volunteers</span>
          <span className="text-[9.5px] md:text-[10.5px] font-semibold text-slate-400 block mt-1">Resource & Support Flyer Builder</span>
        </div>
      </div>

      {/* MOBILE TAB CONTROLLER */}
      <div className="col-span-full lg:hidden bg-sky-100/80 p-1 rounded-2xl border border-sky-200 flex">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
            mobileTab === 'edit' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          📝 Customize Contents
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
            mobileTab === 'preview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          👁️ Live Flyer Preview
        </button>
      </div>

      {/* SUCCESS TOAST FIELD */}
      {successToast && (
        <div className="col-span-full bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl flex gap-2 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-black text-slate-800">{successToast}</span>
        </div>
      )}

      {/* LEFT COLUMN: EDITABLE FORMS & THEME CHANGER */}
      <div className={`col-span-full lg:col-span-6 space-y-6 ${mobileTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
        
        {/* COMBINED FLYER PURPOSE & THEME/LAYOUT SELECTOR */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 md:p-6 shadow-xs space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Choose Flyer Purpose</h3>
                <p className="text-[11px] text-slate-400 font-bold">This shifts the form fields and advice to help you quickly fill details</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'donation', label: 'Donation Needs', icon: <Gift className="w-4 h-4 text-emerald-500" />, desc: 'Food, toys, blankets' },
                { id: 'fosters', label: 'Foster Hero Recruitment', icon: <Heart className="w-4 h-4 text-rose-500" />, desc: 'Help save lives' },
                { id: 'ongoing_volunteers', label: 'Volunteer Recruitment', icon: <Users className="w-4 h-4 text-indigo-500" />, desc: 'Drivers, staff roles' },
                { id: 'event_volunteers', label: 'Specific Event Support', icon: <Calendar className="w-4 h-4 text-amber-500" />, desc: 'Clean-ups, adoption days' }
              ].map(uc => (
                <button
                  key={uc.id}
                  onClick={() => handleUseCaseChange(uc.id as FlyerUseCase)}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    data.useCase === uc.id
                      ? 'border-indigo-600 bg-indigo-50/45 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-slate-800 mb-1">
                    {uc.icon}
                    <span>{uc.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">{uc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* FLYER THEME SELECTOR - COMBINED BELOW */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-sm">
                🎨
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Select Flyer Theme & Layout</h3>
                <p className="text-[11px] text-slate-400 font-bold">This changes typography, borders, AND structural layout style!</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FLYER_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme);
                  }}
                  className={`flex flex-col items-start justify-between p-3 rounded-2xl border text-left cursor-pointer transition-all min-h-[92px] h-auto ${
                    activeTheme.id === theme.id
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-black text-slate-850">
                    {theme.name}
                  </div>
                  <div className="flex flex-col gap-1 w-full mt-1">
                    <div className="text-[8px] font-bold text-indigo-600 uppercase tracking-tight bg-white px-1.5 py-0.5 rounded border border-slate-100 inline-block w-fit">
                      {theme.layoutName}
                    </div>
                    {theme.id === 'terracotta' && (
                      <span className="text-[7.5px] font-black text-emerald-600 uppercase tracking-tight leading-none mt-0.5">
                        👍 Best for longest text
                      </span>
                    )}
                    {theme.id === 'playful' && (
                      <span className="text-[7.5px] font-black text-rose-600 uppercase tracking-tight leading-none mt-0.5">
                        ✨ Best for photos
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 2: DETAILS FORM */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Main Message</h3>
              <p className="text-[11px] text-slate-400 font-bold">Modify headline, subtitle, and description</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Headline</label>
              <input
                type="text"
                name="header"
                value={data.header}
                onChange={handleInputChange}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 select-all outline-none font-bold animate-fade-in"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Action Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={data.subtitle}
                onChange={handleInputChange}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">1-2 sentences about the rescue's needs</label>
              <textarea
                name="intro"
                value={data.intro}
                rows={3}
                onChange={handleInputChange}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: ITEMS LIST BUILDER */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">
                {data.useCase === 'donation' ? 'Requested Items' : data.useCase === 'fosters' ? 'Key Highlights' : 'Volunteer Positions/Shifts'}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">List specific materials or schedules clearly to make the flyer readable</p>
            </div>
          </div>

          <form onSubmit={handleAddBulletItem} className="flex gap-2">
            <input
              type="text"
              placeholder={data.useCase === 'donation' ? 'e.g. Grain-free Puppy Dry Food' : 'e.g. Transport Drivers (We provide cage gears)'}
              value={newItemInput}
              onChange={e => setNewItemInput(e.target.value)}
              className="flex-1 bg-slate-50/75 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none font-semibold"
            />
            <button
              type="submit"
              className="p-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-1.5 divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {data.items.length === 0 ? (
              <p className="text-[11px] text-slate-400 font-bold py-2">No bullets added yet. Add items above to build your flyer layout.</p>
            ) : (
              data.items.map((bullet, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 text-xs font-medium text-slate-700">
                  <span className="flex-1 pr-4 leading-relaxed font-semibold">{bullet}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBulletItem(idx)}
                    className="p-1 px-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* STEP 4: ORGANIZATIONAL BASELINE INFO */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Call to Action & Contact Information</h3>
              <p className="text-[11px] text-slate-400 font-bold">Add a closing statement and relevant contact information. Only add what should be on the flyer, most fields are not required</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">A "thank you" statement or mission statement</label>
              <textarea
                name="thankYouMessage"
                value={data.thankYouMessage}
                rows={2}
                onChange={handleInputChange}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none font-medium leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Rescue Organization <span className="text-rose-500 font-black">*</span>
                </label>
                <input
                  type="text"
                  name="orgName"
                  required
                  value={data.orgName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-605 outline-none transition-colors ${
                    !data.orgName.trim() ? 'border-amber-400 bg-amber-50/20 focus:border-amber-500' : 'border-slate-200'
                  }`}
                  placeholder="Required Field"
                />
                {!data.orgName.trim() && (
                  <span className="text-[9px] font-extrabold text-amber-600 block mt-1">Required to download/print!</span>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Website URL</label>
                <input
                  type="text"
                  name="website"
                  value={data.website}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Contact Email</label>
                <input
                  type="text"
                  name="email"
                  value={data.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200/60 font-semibold text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>Show website scan QR Code?</span>
              </span>
              <input
                type="checkbox"
                checked={data.showQRCode}
                onChange={e => setData(prev => ({ ...prev, showQRCode: e.target.checked }))}
                className="w-4.5 h-4.5 rounded text-indigo-600 border-slate-200 focus:ring-indigo-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Call to Action Heading</label>
                <input
                  type="text"
                  name="ctaLabel"
                  value={data.ctaLabel}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Call to Action Details</label>
                <input
                  type="text"
                  name="ctaDetails"
                  value={data.ctaDetails}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STEP 5: VISUALLY APPEALING OUTFLOW OF PHOTOS */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Upload Photo/s (Up to 3)</h3>
              <p className="text-[11px] text-slate-400 font-bold">Upload highly active pictures. Drag or scroll directly on the flyer preview to perfectly zoom, pan, and center your photos!</p>
            </div>
          </div>

          {/* "No Photo" Toggle Checkbox */}
          <div className="flex items-center gap-3 bg-rose-50/50 p-3 rounded-2xl border border-rose-100/60">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-black text-slate-700 w-full">
              <input
                type="checkbox"
                checked={noPhoto}
                onChange={e => setNoPhoto(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <div className="flex flex-col">
                <span>Disable Photos / Hide Image Area completely</span>
                <span className="text-[10px] text-slate-400 font-bold leading-normal">
                  Removes image frames and lets text layout fill the flyer space seamlessly!
                </span>
              </div>
            </label>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImgUpload}
            className="hidden"
          />

          {!noPhoto ? (
            <>
              {photos.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-sky-200/70 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all cursor-pointer bg-sky-50/20 hover:bg-sky-50/40"
                >
                  <ImageIcon className="w-8 h-8 text-sky-400" />
                  <span className="text-xs font-black">Upload Outreach Photos ({photos.length}/3)</span>
                  <p className="text-[9.5px] text-slate-400 font-medium">Select JPEG or PNG files. They stay local to your browser.</p>
                </button>
              )}

              {photos.length > 0 && (
                <div className="space-y-4 pt-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Configure Crop & Scale for each image:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photos.map((url, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-slate-700">Photo #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="text-[10px] font-black text-rose-500 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" /> Remove
                          </button>
                        </div>

                    <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-stone-150 relative mb-3 mx-auto max-w-[160px]">
                      <img
                        src={url}
                        alt={`Preview crop config ${index}`}
                        className="absolute object-cover transition-transform"
                        referrerPolicy="no-referrer"
                        style={{
                          transform: `scale(${photoZooms[index] || 1}) translate(${photoOffsetsX[index] || 0}px, ${photoOffsetsY[index] || 0}px)`,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div>
                        <div className="flex justify-between font-bold text-slate-500">
                          <span>Scale Size:</span>
                          <span>{(photoZooms[index] || 1).toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.05"
                          value={photoZooms[index] || 1}
                          onChange={e => updatePhotoZoom(index, parseFloat(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between font-bold text-slate-500">
                            <span>Move x:</span>
                            <span>{photoOffsetsX[index] || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={photoOffsetsX[index] || 0}
                            onChange={e => updatePhotoOffsetX(index, parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-bold text-slate-500">
                            <span>Move y:</span>
                            <span>{photoOffsetsY[index] || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={photoOffsetsY[index] || 0}
                            onChange={e => updatePhotoOffsetY(index, parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 py-6 border border-dashed border-sky-100 bg-indigo-50/15 rounded-2xl text-center space-y-1">
          <span className="text-xl">🎴</span>
          <p className="text-xs font-black text-slate-700">Photos Disabled</p>
          <p className="text-[10px] text-slate-400 font-bold px-6 leading-normal">
            To upload images or adjust crop sizes, uncheck the "Disable Photos" box above.
          </p>
        </div>
      )}

    </div>

      </div>

      {/* RIGHT COLUMN: REASSURING LIVE PREVIEW WITH TWO RATIO SELECTS & SCALING OPTION */}
      <div className={`col-span-full lg:col-span-6 flex flex-col items-center justify-start gap-4 ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
        
        {/* MEDIUM CONFIG SELECTOR */}
        <div className="w-full bg-white border border-sky-100 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-extrabold block">PRESENTATION MEDIUM</span>
            <p className="text-[10.5px] text-slate-400 font-bold">Select presentation medium</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAspectRatio('flyer')}
              className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                aspectRatio === 'flyer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'bg-slate-50 text-slate-600 border border-slate-205 hover:bg-slate-100'
              }`}
            >
              <span>📄 Printable Poster (8.5x11)</span>
            </button>
            <button
              onClick={() => setAspectRatio('square')}
              className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                aspectRatio === 'square'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'bg-slate-50 text-slate-600 border border-slate-205 hover:bg-slate-100'
              }`}
            >
              <span>📸 Instagram square (1:1)</span>
            </button>
          </div>
        </div>

        {/* STATUS AND SCALE-TO-SCREEN COMMAND BAR */}
        <div className="no-print w-full flex justify-between items-center bg-stone-100 py-2.5 px-4 rounded-2xl text-xs text-stone-600 font-extrabold border border-stone-250">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            <span>Live Layout: {aspectRatio === 'square' ? 'Instagram Square (1:1)' : 'Printable Flyer (8.5" x 11")'}</span>
          </span>
          <button
            type="button"
            onClick={() => setShowFullPreview(true)}
            className="cursor-pointer flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-lg active:scale-95 transition-all text-[11px] font-extrabold shadow-sm"
            title="Scale flyer to entire viewport"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Scale to screen</span>
          </button>
        </div>

        {/* EXCELENTLY DESIGNED POSTER PREVIEW */}
        <div 
          className={`w-full bg-slate-50 border border-slate-200/85 rounded-3xl shadow-lg relative flex items-center justify-center p-4 overflow-hidden ${
            aspectRatio === 'square' ? 'max-w-md' : 'max-w-[420px]'
          }`}
        >
          {renderFlyerMainContainerHTML(false)}
        </div>

        {/* SAVE OUTFLOW TRIGGERS */}
        <div className="w-full flex flex-col gap-2.5 max-w-[420px] mt-1">
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => triggerDownload('flyer')}
              disabled={isDownloading}
              className={`cursor-pointer flex items-center justify-center gap-2 text-white font-extrabold text-xs py-3.5 px-2 rounded-2xl transition-all shadow-md active:scale-95 leading-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400`}
              title="Save vertical printable flyer as vector PDF"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Download className="w-4.5 h-4.5" />
              )}
              <span>Save Flyer (PDF)</span>
            </button>
            <button
              onClick={() => triggerDownload('square')}
              disabled={isDownloading}
              className={`cursor-pointer flex items-center justify-center gap-2 text-white font-extrabold text-xs py-3.5 px-2 rounded-2xl transition-all shadow-md active:scale-95 leading-none bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400`}
              title="Save square social media flyer as PNG"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Smartphone className="w-4.5 h-4.5" />
              )}
              <span>Save Square (PNG)</span>
            </button>
          </div>
        </div>

      </div>

      {/* FULL SCALE PREVIEW MODAL */}
      {showFullPreview && (
        <div 
          className="no-print fixed inset-0 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 min-[480px]:p-8 z-50 animate-fade-in overflow-y-auto"
          onClick={() => setShowFullPreview(false)}
        >
          <div className="w-full max-w-[480px] flex justify-between items-center mb-4 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-xs font-black tracking-wide uppercase font-sans">Full-Scale Outreach Preview</h3>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setShowFullPreview(false);
                  triggerDownload('flyer');
                }}
                disabled={isDownloading}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shadow-lg transition-all flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>
              <button
                onClick={() => {
                  setShowFullPreview(false);
                  triggerDownload('square');
                }}
                disabled={isDownloading}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shadow-lg transition-all flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          {/* Floating close button */}
          <button
            onClick={() => setShowFullPreview(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 bg-stone-900/95 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 rounded-full transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 z-55 cursor-pointer"
            title="Close Preview"
          >
            <span className="text-sm font-extrabold px-1">✕ Close</span>
          </button>

          {/* Scaled Preview Frame */}
          <div 
            className="w-full max-w-full flex items-center justify-center cursor-default"
            onClick={e => e.stopPropagation()}
          >
            <div 
              className={`transition-transform duration-300 origin-center max-w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-white ${
                aspectRatio === 'square'
                  ? 'w-[480px] h-[480px] scale-[0.65] min-[420px]:scale-[0.8] sm:scale-[1.0] md:scale-[1.2]'
                  : 'w-[420px] h-[543.5px] scale-[0.65] min-[420px]:scale-[0.8] sm:scale-[1.0] md:scale-[1.2]'
              }`}
            >
              {renderFlyerMainContainerHTML(true)}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
