import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { FosterPetData, PosterDesignSettings } from './types';
import { SAMPLE_PETS } from './data';
import { PosterForm } from './components/PosterForm';
import { PosterTemplates } from './components/PosterTemplates';
import { FosterGuide } from './components/FosterGuide';
import { RescueGrants } from './components/RescueGrants';
import { PosterPreviewWrapper } from './components/PosterPreviewWrapper';
import { 
  Heart, 
  Printer, 
  Download, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  FileCheck, 
  ArrowRight,
  PawPrint,
  CheckCircle,
  Share2,
  Info,
  X,
  Maximize2,
  Mail,
  MessageSquare
} from 'lucide-react';

export default function App() {
  // Feedback email form states
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    subject: 'RescueKit Suggestion/Feedback',
    message: ''
  });

  // Pre-load Barnaby dog preset so user has lovely populated state instantly
  const [pet, setPet] = useState<FosterPetData>({
    ...SAMPLE_PETS.barnaby,
    // Add default template-friendly photos or let standard vector fallback do its lovely work
    photos: [] 
  });

  const [settings, setSettings] = useState<PosterDesignSettings>({
    templateId: 'whimsical',
    themeId: 'vibrant',
    headingText: 'ADOPT ME!',
    aspectRatio: 'flyer'
  });

  const [isGeneratingBio, setIsGeneratingBio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showHowToPrintModal, setShowHowToPrintModal] = useState<boolean>(false);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'posters' | 'guide' | 'grants'>('posters');
  const [posterMobileTab, setPosterMobileTab] = useState<'edit' | 'preview'>('edit');

  // Overwrite state on preset load request
  const handleLoadPreset = (presetKey: string) => {
    if (SAMPLE_PETS[presetKey]) {
      setPet({ ...SAMPLE_PETS[presetKey] });
      setSuccessToast(`Successfully loaded ${SAMPLE_PETS[presetKey].name}'s details! Customize them below.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
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
        setSuccessToast("Gemini has successfully enhanced your foster pet's story! Look at the preview card on the right.");
        setTimeout(() => setSuccessToast(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with bio generator.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handlePrint = () => {
    // Standard high-quality browser printing call
    window.print();
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;

    setIsSendingFeedback(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm)
      });
      
      if (response.ok) {
        setFeedbackSuccess(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to submit feedback.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to send feedback. Please try again.');
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
        style: {
          transform: 'none',
          boxShadow: 'none',
          border: 'none',
        }
      });
      
      const link = document.createElement('a');
      const filename = `${pet.name ? pet.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'pet'}_${targetRatio}.png`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessToast(`Successfully saved ${pet.name || 'your pet'}'s ${targetRatio === 'flyer' ? 'Printable Poster' : 'Instagram Square'} as a high-resolution PNG image!`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to export image: ${err.message || 'Error occurred during graphic rendering.'}`);
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
    <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100">
      
      {/* 1. APP HEADER - HIDDEN IN PRINTING OUTPUT (.no-print) */}
      <header className="no-print bg-white px-4 py-3 md:px-8 md:py-4 sticky top-0 z-20 shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">Rescue<span className="text-indigo-600">Kit</span></span>
              <p className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Free Support Tools for Rescues & Fosters</p>
            </div>
          </div>

          {/* DYNAMIC NAVIGATION SECTION TABS */}
          <div className="flex flex-wrap items-center gap-1.5 bg-sky-50/75 p-1 rounded-2xl border border-sky-100 shrink-0">
            <button
              onClick={() => setActiveSection('posters')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'posters'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/50'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1">🎨 Flyers & Bios</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'posters' ? 'text-indigo-100' : 'text-slate-400'}`}>For fosters and rescues</span>
            </button>
            <button
              onClick={() => setActiveSection('guide')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'guide'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/50'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1">📖 Foster Guide</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'guide' ? 'text-indigo-100' : 'text-slate-400'}`}>Tips & Tricks</span>
            </button>
            <button
              onClick={() => setActiveSection('grants')}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all flex flex-col items-start gap-0.5 text-left ${
                activeSection === 'grants'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/50'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-black flex items-center gap-1">💰 Grant Hub</span>
              <span className={`hidden sm:block text-[9px] font-bold ${activeSection === 'grants' ? 'text-indigo-100' : 'text-slate-400'}`}>Grants & Prep</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE BODY CONTAINER */}
      {activeSection === 'posters' ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SECTION HEADER BANNER - EXPLICTLY HIGHLIGHTING INTENT AND VALUE */}
          <div className="no-print col-span-full bg-white border border-sky-100 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 font-fraunces">Create Adoption Flyers in Minutes</h1>
              <p className="text-sm text-slate-500 font-bold mt-1.5">Generate Digital & Printable flyers or copy-pasteable biographies with RescueKit AI</p>
            </div>
            <div className="hidden md:block text-right bg-sky-50/50 p-2.5 px-4 rounded-2xl border border-sky-100 shrink-0">
              <span className="text-[11px] md:text-[11.5px] font-black text-rose-500 block">Designed for rescues, fosters & volunteers</span>
              <span className="text-[9.5px] md:text-[10.5px] font-semibold text-slate-400 block mt-1">Adoptable Pet Poster Builder</span>
            </div>
          </div>
          
          {/* ZERO HURDLES CALLOUT - always visible above the tab toggle */}
          <div className="no-print col-span-full lg:hidden bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-950">Zero hurdles, totally free & private</h3>
              <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5 font-sans">
                Create adoption flyers and social media posts for your fosters — ready to print, post on Instagram, or share in a Facebook group. Free forever, and your photos never leave your device.
              </p>
            </div>
          </div>

          {/* MOBILE TOGGLE TABS FOR EDITOR VS PREVIEW (only visible on mobile) */}
          <div className="no-print col-span-full flex lg:hidden bg-sky-100/80 p-1 rounded-2xl border border-sky-200">
            <button
              type="button"
              onClick={() => setPosterMobileTab('edit')}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                posterMobileTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Edit Details
            </button>
            <button
              type="button"
              onClick={() => setPosterMobileTab('preview')}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                posterMobileTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👁️ View Poster Preview
            </button>
          </div>
          
          {/* LEFT COLUMN: SURVEY FORM CONTROLLER (no-print) */}
          <div className={`no-print lg:col-span-6 space-y-6 ${posterMobileTab === 'edit' ? 'block' : 'hidden lg:block'}`}>

            {/* Welcome Alert callout card — desktop only (mobile version is above the tab toggle) */}
            <div id="quick-alert-card" className="hidden lg:flex bg-emerald-50 border border-emerald-200 rounded-2xl p-4 gap-3.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-950">Zero hurdles, totally free & private</h3>
                <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5 font-sans">
                  Create appealing adoption flyers and social media posts for your fosters — ready to print, post on Instagram, or share in a Facebook group. Free forever, and your photos never leave your device.
                </p>
              </div>
            </div>

            {/* Error Feedbacks */}
            {errorMessage && (
              <div id="global-error-alert" className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-xl text-xs font-medium animate-slide-up flex flex-col gap-2">
                <span className="font-bold flex items-center gap-1.5 text-rose-700">⚠️ Status Notice:</span>
                <p className="text-[11px] text-rose-800">{errorMessage}</p>
                <p className="text-[10px] text-rose-600 border-t pt-1 border-rose-200/50">
                  Tip: You can still customize the bio manually by toggling to step 4 "Poster Styling" and editing the story text directly!
                </p>
              </div>
            )}

            {/* Success Notifications */}
            {successToast && (
              <div id="global-success-toast" className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-xl text-xs font-medium animate-slide-up flex gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-stone-750 font-semibold">{successToast}</p>
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
            />

          </div>

          {/* RIGHT COLUMN: HIGH-FIDELITY LIVE PREVIEW (Visible in print mode) */}
          <div className={`lg:col-span-6 flex flex-col items-center justify-start gap-4 h-full ${posterMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* FORMAT RATIO SELECTOR CONTROL BOX */}
            <div className="no-print w-full bg-white border border-sky-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-extrabold block">POSTER CONFIGURATION</span>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Choose your presentation medium</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  id="layout-flyer-btn"
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'flyer' }))}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    settings.aspectRatio === 'flyer'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'bg-sky-50/60 text-slate-600 border border-sky-100 hover:bg-sky-100/50'
                  }`}
                >
                  <span>📄 Printable Poster (8.5x11)</span>
                </button>
                <button
                  id="layout-square-btn"
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'square' }))}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    settings.aspectRatio === 'square'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'bg-sky-50/60 text-slate-600 border border-sky-100 hover:bg-sky-100/50'
                  }`}
                >
                  <span>📸 Instagram Square (1:1)</span>
                </button>
              </div>
            </div>

            {/* Current Canvas Status Flag */}
            <div className="no-print w-full flex justify-between items-center bg-stone-100 py-2 px-4 rounded-xl text-xs text-stone-500 font-semibold border border-stone-200">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                Live Canvas View: {settings.aspectRatio === 'square' ? 'Instagram (1:1)' : 'Printable Poster (8.5x11)'}
              </span>
              <button
                type="button"
                onClick={() => setShowFullPreview(true)}
                className="cursor-pointer flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 py-1.5 px-3 rounded-lg active:scale-95 transition-all text-[11px] font-bold shadow-xs hover:shadow-sm"
                title="Scale Poster to Screen View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Scale to screen</span>
              </button>
            </div>

            {/* The Poster canvas card frame */}
            <div className={`w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-stone-200/85 p-0 relative overflow-hidden ${
              settings.aspectRatio === 'square'
                ? 'max-w-[480px]'
                : 'max-w-[420px]'
            }`}>
              <PosterPreviewWrapper aspectRatio={settings.aspectRatio}>
                <PosterTemplates
                  pet={pet}
                  settings={settings}
                  setPet={setPet}
                  isPrintable={!showFullPreview}
                />
              </PosterPreviewWrapper>
            </div>

            {/* Sizable Action Buttons for Quick Image Export and Print Options */}
            <div className="no-print w-full flex flex-col gap-2.5 max-w-[480px] mt-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="save-poster-btn"
                  type="button"
                  onClick={() => handleDownloadImageSpecific('flyer')}
                  disabled={isDownloading}
                  className="cursor-pointer flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold text-[11px] sm:text-xs py-3 px-2 rounded-xl transition-all shadow-md shadow-emerald-100 hover:shadow-lg hover:scale-[1.01] active:scale-95 text-center leading-none"
                  title="Save high resolution vertical poster (8.5x11)"
                >
                  {isDownloading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Download className="w-4 h-4 shrink-0" />
                  )}
                  <span>Save Poster (8.5x11 PNG)</span>
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

              <button
                id="print-pdf-panel-btn"
                type="button"
                onClick={handlePrint}
                className="cursor-pointer w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:scale-[1.01] active:scale-95 text-center leading-none"
              >
                <Printer className="w-4 h-4" />
                <span>Print Poster (8.5x11 PDF)</span>
              </button>
            </div>

            <div className="no-print text-center max-w-sm mt-3">
              {settings.aspectRatio === 'square' ? (
                <p className="text-xs text-stone-400 font-medium animate-fade-in">
                  📸 <strong className="text-stone-600">Instagram Mode active:</strong> A perfect square layout designed for Instagram/Facebook posts. You can take a quick screenshot to share, or printed cards will register as high-resolution squares!
                </p>
              ) : (
                <p className="text-xs text-stone-400 font-medium animate-fade-in">
                  📄 <strong className="text-stone-600">Printable Poster active:</strong> Standard vertical poster sizes (8.5x11 in). Print as PDF and pin it around town—on coffee shop bulletin boards, local parks, and vets!
                </p>
              )}
            </div>

          </div>

        </main>
      ) : activeSection === 'guide' ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <FosterGuide />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <RescueGrants />
        </main>
      )}

      {/* FEEDBACK CALL-OUT BANNER */}
      <div className="no-print max-w-7xl mx-auto w-full px-4 mb-8 mt-4">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-sm border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-x-12 translate-y-12">
            <PawPrint className="w-64 h-64" />
          </div>
          <div className="relative z-10 text-left max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-1">Volunteers & Rescues Suggestions</span>
            <h3 className="text-xl font-black tracking-tight font-fraunces">Help Us Perfect RescueKit 🌟</h3>
            <p className="text-stone-300 text-xs md:text-sm font-medium mt-1.5 leading-relaxed font-sans">
              We are always looking to make RescueKit a helpful tool for rescues, fosters, and volunteers. For feedback or suggestions, please reach out! Let us know how we can make our free flyer systems or resource guides more impactful for adoptable animals.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => { setShowFeedbackModal(true); setFeedbackSuccess(false); }}
            className="cursor-pointer relative z-10 shrink-0 bg-white text-indigo-950 hover:bg-slate-50 active:scale-95 font-black px-6 py-3 rounded-2xl shadow-lg shadow-indigo-950/25 transition-all text-sm flex items-center justify-center gap-2 group border border-slate-100 font-sans"
          >
            <Mail className="w-4 h-4 text-indigo-650 group-hover:scale-110 transition-transform" />
            <span>Send Feedback</span>
          </button>
        </div>
      </div>

      {/* 3. COZY FOOTER */}
      <footer className="no-print bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-400 font-semibold">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 RescueKit Community. Open-source & free tools for rescue and foster volunteers worldwide.</p>
          <div className="flex gap-4">
            {activeSection === 'posters' && (
              <>
                <button onClick={() => setShowHowToPrintModal(true)} className="hover:text-indigo-650 cursor-pointer">Export Guide</button>
                <span>•</span>
              </>
            )}
            <span className="text-stone-500 font-bold">Adopt, Don&apos;t Shop 🏡❤️</span>
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
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
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
                onClick={() => {
                  window.print();
                }}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shadow-lg transition-all flex items-center gap-1"
                id="modal-print-btn"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Poster</span>
              </button>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                id="close-preview-modal"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

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

      {/* HOW-TO Modal/Educational popup section */}
      {showHowToPrintModal && (
        <div id="how-to-print-modal" className="no-print fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-sky-100 shadow-xl relative animate-pop-scale">
            <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <Printer className="w-5 h-5 text-indigo-600" /> Exporting & Sharing Guide
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Here is physical and digital distribution suggestions for volunteer fosters looking to make beautiful adoptions:
            </p>

            <ul className="space-y-3.5 text-xs text-stone-700 font-semibold">
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-sky-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</div>
                <div>
                  <h4 className="font-extrabold text-slate-905 leading-normal">High Quality Vector PDF</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Click "Print Poster", set Destination to "Save as PDF", and save. This produces an infinitely scaleable vector poster suitable for high DPI printing at Petco, grocery stores, or community notice boards.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-sky-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</div>
                <div>
                  <h4 className="font-extrabold text-slate-905 leading-normal">Sharing on Social Media (Instagram/FB)</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Simply take a quick screenshot/photo of pages or crop the saved PDF. Standard ratio makes it fit wonderfully on vertical Instagram/Facebook story blocks.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-sky-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">3</div>
                <div>
                  <h4 className="font-extrabold text-slate-905 leading-normal">Instant Actionable QR Codes</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Whenever you add your rescue organization website URL, the system dynamically renders a real-time, high-contrast QR code. Prospects can scan the printed poster with their phone camera to apply immediately!
                  </p>
                </div>
              </li>
            </ul>

            <button
              id="close-modal-btn"
              onClick={() => setShowHowToPrintModal(false)}
              className="mt-6 w-full cursor-pointer bg-indigo-600 hover:bg-indigo-750 active:scale-95 text-white font-extrabold text-xs py-2.5 rounded-full shadow-lg shadow-indigo-150 transition-all font-sans"
            >
              Let's craft posters!
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK & EMAIL CONTACT FORM MODAL */}
      {showFeedbackModal && (
        <div id="feedback-modal" className="no-print fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowFeedbackModal(false)}>
          <div 
            className="bg-white rounded-[32px] p-6 max-w-lg w-full border border-indigo-100 shadow-2xl relative animate-pop-scale max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className="cursor-pointer absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors"
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
                  We appreciate ideas of how to make RescueKit more helpful! Your insights are queued.
                </p>
                
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="mt-8 cursor-pointer bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-md shadow-indigo-150 transition-all font-sans"
                >
                  Return to App
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-650">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-slate-905 font-fraunces">
                    Send Message to RescueKit Team
                  </h3>
                </div>
                
                <p className="text-xs text-stone-500 leading-relaxed mb-5">
                  We are always looking to make RescueKit a helpful tool for rescues, fosters, and volunteers. For feedback or suggestions, please reach out! Your email message will be securely shared with the platform maintainers.
                </p>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 font-sans text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={feedbackForm.name}
                        onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})}
                        placeholder="Anonymous Foster"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-indigo-500 transition-colors bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-1">Your Email (optional)</label>
                      <input
                        type="email"
                        value={feedbackForm.email}
                        onChange={e => setFeedbackForm({...feedbackForm, email: e.target.value})}
                        placeholder="foster-parent@example.com"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-indigo-500 transition-colors bg-stone-50/50"
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
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-indigo-500 transition-colors bg-stone-50/50"
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
                      className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-stone-200 outline-none focus:border-indigo-500 transition-colors bg-stone-50/50 resize-none h-32"
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
                      className="cursor-pointer bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md shadow-indigo-150 transition-all font-sans flex items-center gap-1.5"
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
