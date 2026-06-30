import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FosterPetData, PosterDesignSettings } from './types';
import { SAMPLE_PETS } from './data';
import { PosterForm } from './components/PosterForm';
import { PosterTemplates } from './components/PosterTemplates';
import { FosterGuide } from './components/FosterGuide';
import { RescueGrants } from './components/RescueGrants';
import { PosterPreviewWrapper } from './components/PosterPreviewWrapper';
import { RescueNeedsFlyers } from './components/RescueNeedsFlyers';
import { RescueForms } from './components/RescueForms';
import {
  Heart,
  Printer,
  Download,
  PawPrint,
  CheckCircle,
  X,
  Maximize2,
  Mail,
  MessageSquare,
  Layers,
  BookOpen,
  Megaphone,
  Coins,
  PenLine,
  Eye,
  FileText
} from 'lucide-react';

const LS_PET_KEY = 'rescuekit_pet';
const LS_SETTINGS_KEY = 'rescuekit_settings';

const BLANK_PET: FosterPetData = {
  name: '',
  species: 'dog',
  breed: '',
  age: '',
  gender: 'not-specified',
  weight: '',
  location: '',
  traits: [],
  goodWithDogs: 'unknown',
  goodWithCats: 'unknown',
  goodWithKids: 'unknown',
  houseTrained: 'not-applicable',
  favoriteActivity: '',
  funnyHabit: '',
  perfectDay: '',
  loveLanguage: '',
  estimatedBio: '',
  fosterName: '',
  rescueOrg: '',
  fosterEmail: '',
  fosterPhone: '',
  rescueWebsite: '',
  photos: [],
  photoZoom: 1,
  photoOffsetX: 0,
  photoOffsetY: 0,
  photoZoom2: 1,
  photoOffsetX2: 0,
  photoOffsetY2: 0
};

const DEFAULT_SETTINGS: PosterDesignSettings = {
  templateId: 'whimsical',
  themeId: 'vibrant',
  headingText: 'ADOPT ME!',
  aspectRatio: 'flyer'
};

function ZeroHurdlesCard() {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3.5">
      <div className="p-2 bg-emerald-100 text-emerald-700 h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
        <Heart className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-xs font-bold text-emerald-950">Zero hurdles, totally free & private</h3>
        <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5 font-sans">
          Built for every volunteer — no design skills needed. No sign-up, no software, no learning curve. Just fill in your pet's details and get printable and digital flyers in minutes — whether you've been rescuing for 20 years or just fostered your first pet this week.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // Feedback email form states
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    subject: 'Rescue-Kit Suggestion/Feedback',
    message: ''
  });

  // Restore from localStorage on first mount, fall back to blank defaults
  const [pet, setPet] = useState<FosterPetData>(() => {
    try {
      const saved = localStorage.getItem(LS_PET_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return BLANK_PET;
  });

  const [settings, setSettings] = useState<PosterDesignSettings>(() => {
    try {
      const saved = localStorage.getItem(LS_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [isGeneratingBio, setIsGeneratingBio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showHowToPrintModal, setShowHowToPrintModal] = useState<boolean>(false);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'posters' | 'guide' | 'rescue-flyers' | 'grants' | 'forms'>('posters');
  const [posterMobileTab, setPosterMobileTab] = useState<'edit' | 'preview'>('edit');
  const [scrolled, setScrolled] = useState(false);

  // Autosave pet + settings to localStorage (debounced 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LS_PET_KEY, JSON.stringify(pet));
        localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // Quota exceeded (photos too large) — save text data without photos
        try {
          localStorage.setItem(LS_PET_KEY, JSON.stringify({ ...pet, photos: [] }));
          localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
        } catch {}
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pet, settings]);

  // Scroll to top whenever the active section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeSection]);

  // Track scroll for header shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape key closes any open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showFullPreview) { setShowFullPreview(false); return; }
      if (showHowToPrintModal) { setShowHowToPrintModal(false); return; }
      if (showFeedbackModal) { setShowFeedbackModal(false); return; }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFullPreview, showHowToPrintModal, showFeedbackModal]);

  // Overwrite state on preset load request
  const handleLoadPreset = (presetKey: string) => {
    if (SAMPLE_PETS[presetKey]) {
      setPet({ ...SAMPLE_PETS[presetKey] });
      setSuccessToast(`Successfully loaded ${SAMPLE_PETS[presetKey].name}'s details! Customize them below.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleStartFresh = () => {
    const hasMeaningfulData = pet.name || pet.breed || pet.estimatedBio || pet.photos.length > 0;
    if (hasMeaningfulData && !window.confirm("Start fresh? This will clear all your current pet's details and photos.")) return;
    setPet(BLANK_PET);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(LS_PET_KEY);
      localStorage.removeItem(LS_SETTINGS_KEY);
    } catch {}
    setSuccessToast("Blank slate ready! Start entering your foster pet's details.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Safe handler to fetch generated bios from server API endpoint
  const handleGenerateBio = async (style: string) => {
    setIsGeneratingBio(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, style, templateId: settings.templateId })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error generating the story.');
      }

      if (data.bio) {
        setPet(prev => ({ ...prev, estimatedBio: data.bio }));
        setSuccessToast("Bio generated! Check the preview on the right — or switch to the Preview tab on mobile.");
        setTimeout(() => setSuccessToast(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with bio generator.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;

    setIsSendingFeedback(true);
    setFeedbackError(null);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm)
      });

      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedbackForm({
          name: '',
          email: '',
          subject: 'Rescue-Kit Suggestion/Feedback',
          message: ''
        });
      } else {
        const data = await response.json();
        setFeedbackError(data.error || 'Failed to submit feedback.');
      }
    } catch (err: any) {
      console.error(err);
      setFeedbackError('Failed to send feedback. Please try again.');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleDownloadImageSpecific = async (targetRatio: 'flyer' | 'square') => {
    setIsDownloading(true);
    setErrorMessage(null);
    const previousRatio = settings.aspectRatio;
    try {
      if (previousRatio !== targetRatio) {
        setSettings(prev => ({ ...prev, aspectRatio: targetRatio }));
        // Wait for React to re-render the DOM
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const el = document.getElementById('print-poster-card');
      if (!el) {
        throw new Error('Poster canvas element could not be found.');
      }

      const dataUrl = await toPng(el, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: settings.templateId === 'whimsical' ? '#fdfbf6' : settings.templateId === 'comic' ? '#fefaf2' : '#ffffff',
        filter: (node) => {
          if (node instanceof Element && node.classList.contains('poster-drag-hint')) return false;
          return true;
        },
        style: {
          transform: 'none',
          boxShadow: 'none',
          border: 'none',
        }
      });

      if (targetRatio === 'flyer') {
        // PDF Export - Create a standard letter-sized portrait page (8.5 x 11 inches)
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: [8.5, 11]
        });

        // Add the high-resolution rendered image spanning the full page width and height
        pdf.addImage(dataUrl, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');

        const filename = `${pet.name ? pet.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'pet'}_poster.pdf`;
        pdf.save(filename);

        setSuccessToast(`Successfully saved ${pet.name || 'your pet'}'s Printable Poster as a high-resolution 8.5x11 PDF!`);
      } else {
        // PNG export for Instagram square
        const link = document.createElement('a');
        const filename = `${pet.name ? pet.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'pet'}_${targetRatio}.png`;
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSuccessToast(`Successfully saved ${pet.name || 'your pet'}'s Instagram Square as a high-resolution PNG image!`);
      }

      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to export: ${err.message || 'Error occurred during graphic rendering.'}`);
    } finally {
      if (previousRatio !== targetRatio) {
        setSettings(prev => ({ ...prev, aspectRatio: previousRatio }));
      }
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    await handleDownloadImageSpecific(settings.aspectRatio);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/60 via-stone-50 to-teal-50/30 text-slate-800 flex flex-col justify-between">

      {/* 1. APP HEADER - HIDDEN IN PRINTING OUTPUT (.no-print) */}
      <header className={`no-print bg-sky-50/90 backdrop-blur-sm px-4 sticky top-0 z-20 border-b-2 border-sky-200 transition-all duration-300 ${scrolled ? 'py-1.5 md:px-8 shadow-md' : 'py-3 md:px-8 md:py-4 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className={`relative shrink-0 transition-all duration-300 ${scrolled ? 'w-10 h-10 md:w-11 md:h-11' : 'w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]'}`}>
              <img src="/logo-paw.png" className="w-full h-full" alt="Rescue-Kit paw logo" />
              {/* White heart overlay, centered on the navy main pad (50% across, 74% down) */}
              <svg className="absolute pointer-events-none" style={{left:'50%', top:'74%', width:'36%', height:'auto', transform:'translate(-50%,-50%)'}} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 82 C50 82 8 54 8 28 C8 14 18 5 32 9 C39 11 45 18 50 25 C55 18 61 11 68 9 C82 5 92 14 92 28 C92 54 50 82 50 82 Z" fill="white"/>
              </svg>
            </div>
            <div>
              <span className={`font-black tracking-tight font-display transition-all duration-300 ${scrolled ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}`} style={{background:'linear-gradient(90deg,#082f49 0%,#082f49 40%,#0284c7 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Rescue-Kit</span>
              <p className={`hidden sm:block text-[11px] font-semibold text-sky-700 leading-none mt-0.5 transition-all duration-300 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>Free tools for animal rescues, fosters, and volunteers</p>
            </div>
          </div>

          {/* DYNAMIC NAVIGATION SECTION TABS */}
          <div className="flex flex-wrap items-center gap-1 bg-sky-50/70 p-1 rounded-2xl border border-sky-100 shrink-0">
            <button
              onClick={() => setActiveSection('posters')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'posters'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'text-sky-950 hover:bg-white/80'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Flyers & Bios</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'posters' ? 'text-white/70' : 'text-sky-900/80'}`}>For Adoptable Animals</span>
            </button>
            <button
              onClick={() => setActiveSection('rescue-flyers')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'rescue-flyers'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'text-sky-950 hover:bg-white/80'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5" /> Outreach Flyers</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'rescue-flyers' ? 'text-white/70' : 'text-sky-900/80'}`}>For Rescue Needs</span>
            </button>
            <button
              onClick={() => setActiveSection('guide')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'guide'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'text-sky-950 hover:bg-white/80'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Foster Guide</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'guide' ? 'text-white/70' : 'text-sky-900/80'}`}>Tips & Tricks</span>
            </button>
            <button
              onClick={() => setActiveSection('grants')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'grants'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'text-sky-950 hover:bg-white/80'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Grants Hub</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'grants' ? 'text-white/70' : 'text-sky-900/80'}`}>Grants & Prep</span>
            </button>
            <button
              onClick={() => setActiveSection('forms')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'forms'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'text-sky-950 hover:bg-white/80'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Rescue Forms</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'forms' ? 'text-white/70' : 'text-sky-900/80'}`}>Starter Documents</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE BODY CONTAINER */}
      {activeSection === 'posters' ? (
        <main key="posters" className="section-enter flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SECTION HEADER BANNER */}
          <div className="no-print col-span-full bg-gradient-to-r from-sky-50 via-blue-50/50 to-sky-50/40 border border-sky-200/70 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_theme(colors.sky.100/50),_transparent_60%)] pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-[22.8px] md:text-[34.2px] font-black text-slate-900 tracking-tight flex items-center gap-2 font-fraunces">Create Adoption Flyers in Minutes</h1>
              <p className="text-sm text-sky-800 font-bold mt-1.5">Generate printable flyers or AI-written adoption bios — free, private, no sign-up needed.</p>
            </div>
          </div>

          {/* ZERO HURDLES CALLOUT — mobile only (above tab toggle) */}
          <div className="no-print col-span-full lg:hidden">
            <ZeroHurdlesCard />
          </div>

          {/* MOBILE TOGGLE TABS FOR EDITOR VS PREVIEW (only visible on mobile) */}
          <div className="no-print col-span-full flex lg:hidden bg-sky-50/70 p-1 rounded-2xl border border-sky-100">
            <button
              type="button"
              onClick={() => setPosterMobileTab('edit')}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 ${
                posterMobileTab === 'edit'
                  ? 'bg-sky-600 text-white shadow-sm cta-breathe'
                  : 'text-sky-900/80 hover:text-sky-950'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" /> Edit Details
            </button>
            <button
              type="button"
              onClick={() => setPosterMobileTab('preview')}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 ${
                posterMobileTab === 'preview'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-900/80 hover:text-sky-950'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> View & Save Flyer
            </button>
          </div>

          {/* LEFT COLUMN: SURVEY FORM CONTROLLER (no-print) */}
          <div className={`no-print lg:col-span-5 space-y-6 ${posterMobileTab === 'edit' ? 'block' : 'hidden lg:block'}`}>

            {/* ZERO HURDLES CALLOUT — desktop only (inside left column) */}
            <div id="quick-alert-card" className="hidden lg:block">
              <ZeroHurdlesCard />
            </div>

            {/* Error Feedbacks */}
            {errorMessage && (
              <div id="global-error-alert" className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-xl text-xs font-medium animate-slide-up flex flex-col gap-2">
                <span className="font-bold flex items-center gap-1.5 text-rose-700">⚠️ Something went wrong:</span>
                <p className="text-[11px] text-rose-800">{errorMessage}</p>
                <p className="text-[10px] text-rose-600 border-t pt-1 border-rose-200/50">
                  Tip: You can still customize the bio manually by toggling to step 4 "Poster Styling" and editing the story text directly!
                </p>
              </div>
            )}

            {/* Success Notifications */}
            {successToast && (
              <div id="global-success-toast" className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-xs font-medium animate-slide-up flex gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 font-semibold">{successToast}</p>
              </div>
            )}

            {/* Master Form Card component */}
            <PosterForm
              pet={pet}
              setPet={setPet}
              settings={settings}
              setSettings={setSettings}
              onGenerateBio={handleGenerateBio}
              isGeneratingBio={isGeneratingBio}
              onLoadPreset={handleLoadPreset}
              onStartFresh={handleStartFresh}
              onSwitchToPreview={() => setPosterMobileTab('preview')}
            />

          </div>

          {/* RIGHT COLUMN: HIGH-FIDELITY LIVE PREVIEW (Visible in print mode) */}
          <div className={`lg:col-span-7 flex flex-col items-center justify-start gap-4 h-full ${posterMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>

            {/* FORMAT RATIO SELECTOR CONTROL BOX */}
            <div className="no-print w-full bg-white border border-sky-100 rounded-2xl p-4 shadow-sm shadow-sky-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-xs font-bold text-slate-700">Choose Format</p>
                <p className="text-[10px] text-sky-700/60 font-semibold mt-0.5">Save as a printable flyer, social post, or both!</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  id="layout-flyer-btn"
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'flyer' }))}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    settings.aspectRatio === 'flyer'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-100'
                      : 'bg-stone-50 text-slate-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>📄 Flyer (Print & Share)</span>
                </button>
                <button
                  id="layout-square-btn"
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'square' }))}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    settings.aspectRatio === 'square'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-100'
                      : 'bg-stone-50 text-slate-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>📸 Instagram Square (1:1)</span>
                </button>
              </div>
            </div>

            {/* Live preview staging area */}
            <div className="no-print w-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700 border border-slate-600/50 rounded-3xl p-5 flex items-start justify-center relative shadow-lg shadow-slate-900/20">
              <div className="absolute top-3.5 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 shadow-sm pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-white/80">Live Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFullPreview(true)}
                className="absolute top-3 right-3.5 cursor-pointer flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 py-1.5 px-3 rounded-xl text-[11px] font-extrabold shadow-sm transition-all active:scale-95"
                title="Full Preview"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Preview</span>
              </button>
              <div className={`w-full mt-2 mx-auto ${settings.aspectRatio === 'square' ? 'max-w-[420px]' : 'max-w-[380px]'}`}>
                <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-white/10">
                  <PosterPreviewWrapper aspectRatio={settings.aspectRatio}>
                    <PosterTemplates
                      pet={pet}
                      settings={settings}
                      setPet={setPet}
                      isPrintable={!showFullPreview}
                    />
                  </PosterPreviewWrapper>
                </div>
              </div>
            </div>

            {/* Action Buttons for Export */}
            <div className="no-print w-full flex flex-col gap-2.5 max-w-[480px] mt-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="save-poster-btn"
                  type="button"
                  onClick={() => handleDownloadImageSpecific('flyer')}
                  disabled={isDownloading}
                  className="cursor-pointer flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold text-[11px] sm:text-xs py-3 px-2 rounded-xl transition-all shadow-md shadow-emerald-100 hover:shadow-lg hover:scale-[1.01] active:scale-95 text-center leading-none"
                  title="Save high resolution vertical poster as PDF (8.5x11)"
                >
                  {isDownloading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Download className="w-4 h-4 shrink-0" />
                  )}
                  <span>Save Poster (8.5x11 PDF)</span>
                </button>

                <button
                  id="save-square-btn"
                  type="button"
                  onClick={() => handleDownloadImageSpecific('square')}
                  disabled={isDownloading}
                  className="cursor-pointer flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-extrabold text-[11px] sm:text-xs py-3 px-2 rounded-xl transition-all shadow-md shadow-teal-100 hover:shadow-lg hover:scale-[1.01] active:scale-95 text-center leading-none"
                  title="Save high resolution square image for Instagram"
                >
                  {isDownloading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Download className="w-4 h-4 shrink-0" />
                  )}
                  <span>Save Instagram Square (PNG)</span>
                </button>
              </div>
            </div>

            <div className="no-print flex justify-center mt-1">
              <button
                type="button"
                onClick={() => setShowHowToPrintModal(true)}
                className="text-[11px] text-sky-700/50 hover:text-sky-600 font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>?</span>
                <span>How to export & share</span>
              </button>
            </div>

            <div className="no-print text-center max-w-sm mt-2">
              {settings.aspectRatio === 'square' ? (
                <p className="text-xs text-sky-700/50 font-medium animate-fade-in">
                  📸 <strong className="text-sky-800/70">Instagram Mode active:</strong> A perfect square layout designed for Instagram/Facebook posts. You can take a quick screenshot to share, or printed cards will register as high-resolution squares!
                </p>
              ) : (
                <p className="text-xs text-sky-700/50 font-medium animate-fade-in">
                  📄 <strong className="text-sky-800/70">Printable Poster:</strong> Save/Print as PDF and pin it around town—on coffee shop bulletin boards, local parks, and vets!
                </p>
              )}
            </div>

          </div>

        </main>
      ) : activeSection === 'guide' ? (
        <main key="guide" className="section-enter flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <FosterGuide />
        </main>
      ) : activeSection === 'rescue-flyers' ? (
        <main key="rescue-flyers" className="section-enter flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8">
          <RescueNeedsFlyers />
        </main>
      ) : activeSection === 'grants' ? (
        <main key="grants" className="section-enter flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <RescueGrants />
        </main>
      ) : (
        <main key="forms" className="section-enter flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8">
          <RescueForms />
        </main>
      )}

      {/* FEEDBACK BANNER — quiet, secondary */}
      <div className="no-print max-w-7xl mx-auto w-full px-4 mb-8 mt-4">
        <div className="bg-gradient-to-r from-sky-50 to-blue-50/60 border border-sky-200/60 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-sky-900/70 font-medium">
            Have a suggestion or spotted something to improve?{' '}
            <span className="text-sky-900 font-semibold">We'd love to hear from the rescue community.</span>
          </p>
          <button
            type="button"
            onClick={() => { setShowFeedbackModal(true); setFeedbackSuccess(false); setFeedbackError(null); }}
            className="cursor-pointer shrink-0 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1.5 font-sans"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Feedback</span>
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="no-print bg-sky-50/40 border-t border-sky-100/80 py-6 text-center text-xs text-sky-800/50 font-semibold">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Rescue-Kit Community. Open-source & free tools for rescue and foster volunteers worldwide.</p>
          <div className="flex gap-4">
            {activeSection === 'posters' && (
              <>
                <button onClick={() => setShowHowToPrintModal(true)} className="hover:text-sky-600 cursor-pointer">Export Guide</button>
                <span>•</span>
              </>
            )}
            <span className="text-sky-700/70 font-bold">Adopt, Don&apos;t Shop 🏡❤️</span>
          </div>
        </div>
      </footer>

      {/* FULL SCALE PREVIEW MODAL */}
      {showFullPreview && (
        <div
          id="full-scale-preview-modal"
          className="no-print fixed inset-0 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 z-50 animate-fade-in overflow-y-auto"
          onClick={() => setShowFullPreview(false)}
        >
          <div className="w-full max-w-[580px] flex justify-between items-center mb-4 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <h3 className="text-xs font-black tracking-wide uppercase font-display">Full-Scale Poster Preview</h3>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-95 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shadow-lg transition-all flex items-center gap-1"
                id="modal-download-btn"
              >
                {isDownloading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Image</span>
                  </>
                )}
              </button>
              <button
                onClick={() => { window.print(); }}
                className="cursor-pointer bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shadow-lg transition-all flex items-center gap-1"
                id="modal-print-btn"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Poster</span>
              </button>
            </div>
          </div>

          {/* Close button — floating, top-right */}
          <button
            onClick={() => setShowFullPreview(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 bg-stone-900/95 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-full transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 z-[55] cursor-pointer group"
            id="close-preview-modal"
            aria-label="Close Preview"
            title="Close Preview (Esc)"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* High-fidelity vector layout scaled to screen visually */}
          <div className="overflow-visible flex items-center justify-center py-6 px-4 w-full h-full min-h-[580px]" onClick={e => e.stopPropagation()}>
            <div
              id="modal-poster-card-wrapper"
              className={`bg-white rounded-2xl shadow-2xl p-0 relative overflow-hidden transition-transform duration-300 origin-center shrink-0 ${
                settings.aspectRatio === 'square'
                  ? 'w-[480px] h-[480px] scale-[0.75] min-[420px]:scale-[0.88] sm:scale-[1.1] md:scale-[1.2]'
                  : 'w-[420px] h-[543.5px] scale-[0.75] min-[420px]:scale-[0.88] sm:scale-[1.1] md:scale-[1.3]'
              }`}
            >
              <PosterTemplates
                pet={pet}
                settings={settings}
                setPet={setPet}
                isPrintable={true}
              />
            </div>
          </div>

          <div className="mt-4 text-center max-w-md" onClick={e => e.stopPropagation()}>
            <p className="text-xs text-stone-300 font-medium font-sans">
              📄 Showing high-fidelity vector proportions. Perfect for reviewing layout before printing or saving to PDF.
            </p>
          </div>
        </div>
      )}

      {/* HOW-TO PRINT MODAL */}
      {showHowToPrintModal && (
        <div id="how-to-print-modal" className="no-print fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowHowToPrintModal(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-xl relative animate-pop-scale" onClick={e => e.stopPropagation()}>
            {/* Standard close button */}
            <button
              type="button"
              onClick={() => setShowHowToPrintModal(false)}
              className="cursor-pointer absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5 pr-8 font-display">
              <Printer className="w-5 h-5 text-sky-600" /> Exporting & Sharing Guide
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Physical and digital distribution options for volunteer fosters:
            </p>

            <ul className="space-y-3.5 text-xs text-stone-700 font-semibold">
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</div>
                <div>
                  <h4 className="font-extrabold text-slate-800 leading-normal">High Quality Vector PDF</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Click "Print Poster", set Destination to "Save as PDF", and save. This produces an infinitely scaleable vector poster suitable for high DPI printing at Petco, grocery stores, or community notice boards.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</div>
                <div>
                  <h4 className="font-extrabold text-slate-800 leading-normal">Sharing on Social Media (Instagram/FB)</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Simply take a quick screenshot/photo of pages or crop the saved PDF. Standard ratio makes it fit wonderfully on vertical Instagram/Facebook story blocks.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">3</div>
                <div>
                  <h4 className="font-extrabold text-slate-800 leading-normal">Instant Actionable QR Codes</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Whenever you add your rescue organization website URL, the system dynamically renders a real-time, high-contrast QR code. Prospects can scan the printed poster with their phone camera to apply immediately!
                  </p>
                </div>
              </li>
            </ul>

            <button
              id="close-modal-btn"
              onClick={() => setShowHowToPrintModal(false)}
              className="mt-6 w-full cursor-pointer bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-xs py-2.5 rounded-full shadow-lg shadow-sky-200 transition-all font-sans"
            >
              Got it — let's make a poster!
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK & EMAIL CONTACT FORM MODAL */}
      {showFeedbackModal && (
        <div id="feedback-modal" className="no-print fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowFeedbackModal(false)}>
          <div
            className="bg-white rounded-[32px] p-6 max-w-lg w-full border border-sky-100 shadow-2xl relative animate-pop-scale max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className="cursor-pointer absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {feedbackSuccess ? (
              <div className="text-center py-8 px-4 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-5 border border-emerald-100 shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-fraunces">Thank you for your feedback!</h3>
                <p className="text-sm font-semibold text-stone-500 mt-2 leading-relaxed max-w-sm">
                  We appreciate ideas of how to make Rescue-Kit more helpful! Your insights are queued.
                </p>

                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="mt-8 cursor-pointer bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-md shadow-sky-200 transition-all font-sans"
                >
                  Return to App
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-sky-50 border border-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    Send Message to Rescue-Kit Team
                  </h3>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed mb-5">
                  We are always looking to make Rescue-Kit a helpful tool for rescues, fosters, and volunteers. For feedback or suggestions, please reach out! Your email message will be securely shared with the platform maintainers.
                </p>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 font-sans text-left">
                  {feedbackError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-2xl text-xs font-semibold animate-fade-in">
                      ⚠️ {feedbackError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={feedbackForm.name}
                        onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})}
                        placeholder="Anonymous Foster"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-sky-500 transition-colors bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-1">Your Email (optional)</label>
                      <input
                        type="email"
                        value={feedbackForm.email}
                        onChange={e => setFeedbackForm({...feedbackForm, email: e.target.value})}
                        placeholder="foster-parent@example.com"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-sky-500 transition-colors bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={feedbackForm.subject}
                      onChange={e => setFeedbackForm({...feedbackForm, subject: e.target.value})}
                      placeholder="e.g., Feature Request or Idea"
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-sky-500 transition-colors bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-1">Message Content</label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackForm.message}
                      onChange={e => setFeedbackForm({...feedbackForm, message: e.target.value})}
                      placeholder="Type your suggestions, comments, or recommendations here..."
                      className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-stone-200 outline-none focus:border-sky-500 transition-colors bg-stone-50/50 resize-none h-32"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs px-5 py-2.5 rounded-full transition-all font-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingFeedback || !feedbackForm.message.trim()}
                      className="cursor-pointer bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md shadow-sky-200 transition-all font-sans flex items-center gap-1.5"
                    >
                      {isSendingFeedback ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Delivering...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
