import React, { useState, useRef } from 'react';
import { FosterPetData, PosterDesignSettings, PosterTemplateId } from '../types';
import { SAMPLE_PETS, THEMES, PRESET_TRAITS, HEADING_PRESETS } from '../data';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  Check, 
  User, 
  Info, 
  Dna, 
  MessageSquareHeart, 
  Compass, 
  Hash, 
  PhoneCall, 
  FileImage,
  Layers,
  Palette,
  HeartHandshake,
  Workflow,
  Copy
} from 'lucide-react';

interface PosterFormProps {
  pet: FosterPetData;
  setPet: React.Dispatch<React.SetStateAction<FosterPetData>>;
  settings: PosterDesignSettings;
  setSettings: React.Dispatch<React.SetStateAction<PosterDesignSettings>>;
  onGenerateBio: (style: string) => void;
  isGeneratingBio: boolean;
  onLoadPreset: (presetKey: string) => void;
  onSwitchToPreview?: () => void;
  onStartFresh?: () => void;
}

export const PosterForm: React.FC<PosterFormProps> = ({
  pet,
  setPet,
  settings,
  setSettings,
  onGenerateBio,
  isGeneratingBio,
  onLoadPreset,
  onSwitchToPreview,
  onStartFresh
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [customTraitInput, setCustomTraitInput] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { title: 'Pet Details', icon: <Dna className="w-4 h-4" /> },
    { title: 'Personality & Bio', icon: <MessageSquareHeart className="w-4 h-4" /> },
    { title: 'Photos & Contact', icon: <FileImage className="w-4 h-4" /> },
    { title: 'Poster Styling', icon: <Palette className="w-4 h-4" /> }
  ];

  // Form handle helpers
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPet(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (trait: string) => {
    setPet(prev => {
      const isSelected = prev.traits.includes(trait);
      const newTraits = isSelected 
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait];
      return { ...prev, traits: newTraits };
    });
  };

  const handleAddCustomTrait = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTraitInput.trim() && !pet.traits.includes(customTraitInput.trim())) {
      setPet(prev => ({
        ...prev,
        traits: [...prev.traits, customTraitInput.trim()]
      }));
      setCustomTraitInput('');
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setPet(prev => ({
      ...prev,
      traits: prev.traits.filter(t => t !== trait)
    }));
  };

  // Drag and Drop & click file upload
  const processImageFiles = (files: FileList) => {
    const acceptedFiles = Array.from(files).slice(0, 2 - pet.photos.length);
    
    acceptedFiles.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPet(prev => ({
            ...prev,
            photos: [...prev.photos, e.target!.result as string].slice(0, 2)
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFiles(e.target.files);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPet(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPet(prev => ({ ...prev, photoZoom: val }));
  };

  const handleOffsetXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setPet(prev => ({ ...prev, photoOffsetX: val }));
  };

  const handleOffsetYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setPet(prev => ({ ...prev, photoOffsetY: val }));
  };

  const handleResetPosition = () => {
    setPet(prev => ({
      ...prev,
      photoZoom: 1,
      photoOffsetX: 0,
      photoOffsetY: 0
    }));
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="poster-editor-card" className="bg-white border border-sky-100 shadow-xl shadow-sky-100/60 rounded-3xl p-6 selection:bg-sky-50 flex flex-col justify-between">

      {/* Dynamic Preset Quick loader */}
      <div className="mb-4 bg-sky-50/50 border border-sky-100 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-black text-slate-800">Need a blank form or example?</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {onStartFresh && (
            <button
              id="start-fresh-btn"
              onClick={onStartFresh}
              className="text-[11px] font-black bg-orange-50 border border-orange-200 hover:bg-orange-100 hover:border-orange-400 text-orange-700 hover:text-orange-900 px-3 py-1 rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Trash2 className="w-3 h-3 text-orange-600 shrink-0" />
              <span>✧ Start Fresh / Clear All</span>
            </button>
          )}
          <button
            id="load-barnaby-btn"
            onClick={() => onLoadPreset('barnaby')}
            className="text-[11px] font-extrabold bg-sky-50 border border-sky-200 hover:bg-sky-100 hover:border-sky-400 text-sky-800 hover:text-sky-905 px-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            🐶 Barnaby (Dog)
          </button>
          <button
            id="load-luna-btn"
            onClick={() => onLoadPreset('luna')}
            className="text-[11px] font-extrabold bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-450 text-rose-800 hover:text-rose-905 px-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            🐱 Penelope (Cat)
          </button>
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="h-1 bg-sky-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* STEPPERS NAVIGATION BAR */}
      <div className="flex border-b border-sky-50 pb-3.5 mb-5 items-center gap-3 md:gap-4.5 justify-start overflow-x-auto scroll-hide">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center gap-1.5 sm:gap-2 pb-2.5 border-b-2 text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              activeStep === idx 
                ? 'border-sky-500 text-sky-600 font-bold' 
                : 'border-transparent text-sky-700/50 hover:text-sky-800'
            }`}
          >
            <div className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
              activeStep === idx ? 'bg-sky-50 text-sky-650 font-bold' : 'bg-sky-50/60 text-sky-700/60'
            }`}>
              {idx + 1}
            </div>
            <span className="whitespace-nowrap">{s.title}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* STEP 1: PET DETAILS */}
      {/* ========================================================= */}
      {activeStep === 0 && (
        <div className="space-y-4 animate-fade-in text-slate-800">
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1 font-display">About Your Foster</h3>
            <p className="text-xs text-slate-500">Provide your pet's basic information for the flyer.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Pet Name *</label>
              <input
                id="pet-name-input"
                type="text"
                name="name"
                value={pet.name}
                onChange={handleTextChange}
                placeholder="e.g. Luna"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Species</label>
              <select
                id="pet-species-select"
                name="species"
                value={pet.species}
                onChange={handleTextChange}
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2.5 rounded-xl outline-none"
              >
                <option value="dog">Dog / Puppy</option>
                <option value="cat">Cat / Kitten</option>
                <option value="other">Other / Bunny / Bird</option>
              </select>
            </div>
          </div>

          {pet.species === 'other' && (
            <div className="animate-slide-up">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Specify Species Name</label>
              <input
                id="pet-custom-species-input"
                type="text"
                name="customSpecies"
                value={pet.customSpecies || ''}
                onChange={handleTextChange}
                placeholder="e.g. Holland Lop Rabbit"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Breed / Mix *</label>
              <input
                id="pet-breed-input"
                type="text"
                name="breed"
                value={pet.breed}
                onChange={handleTextChange}
                placeholder="e.g. Retriever Mix"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Age *</label>
              <input
                id="pet-age-input"
                type="text"
                name="age"
                value={pet.age}
                onChange={handleTextChange}
                placeholder="e.g. 1.5 Years old"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Gender</label>
              <select
                id="pet-gender-select"
                name="gender"
                value={pet.gender}
                onChange={handleTextChange}
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2.5 rounded-xl outline-none"
              >
                <option value="boy">Male</option>
                <option value="girl">Female</option>
                <option value="not-specified">Decline to specify</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Size / Weight</label>
              <input
                id="pet-weight-input"
                type="text"
                name="weight"
                value={pet.weight}
                onChange={handleTextChange}
                placeholder="e.g. 45 lbs"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Location *</label>
              <input
                id="pet-location-input"
                type="text"
                name="location"
                value={pet.location}
                onChange={handleTextChange}
                placeholder="e.g. Seattle, WA"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>

          {/* Living Compatibility Checkboxes */}
          <div className="pt-2 border-t border-stone-50">
            <h4 className="text-xs font-black text-slate-800 mb-2">Social & Potty Compatibility</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Good with dogs?</label>
                <select
                  id="pet-compat-dogs"
                  name="goodWithDogs"
                  value={pet.goodWithDogs}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">Friendly (Yes)</option>
                  <option value="selective">Selective</option>
                  <option value="no">Needs single dog home (No)</option>
                  <option value="unknown">Not Tested</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Good with cats?</label>
                <select
                  id="pet-compat-cats"
                  name="goodWithCats"
                  value={pet.goodWithCats}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">Friendly (Yes)</option>
                  <option value="selective">Selective</option>
                  <option value="no">No cats please (No)</option>
                  <option value="unknown">Not Tested</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Good with kids? *</label>
                <select
                  id="pet-compat-kids"
                  name="goodWithKids"
                  value={pet.goodWithKids}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">Super sweet with kids (Yes)</option>
                  <option value="selective">Older kids preferred</option>
                  <option value="no">Adults-only home (No)</option>
                  <option value="unknown">Not Tested</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Potty Trained?</label>
                <select
                  id="pet-compat-potty"
                  name="houseTrained"
                  value={pet.houseTrained}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">100% trained (Yes)</option>
                  <option value="working-on-it">Working on it (Trainee)</option>
                  <option value="no">Needs supervision (No)</option>
                  <option value="not-applicable">Not Applicable</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: QUIRKS & Foster SURVEY (The Magic Ingredients) */}
      {/* ========================================================= */}
      {activeStep === 1 && (
        <div className="space-y-4 animate-fade-in text-slate-805">
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1 font-display">Personality Traits</h3>
            <p className="text-xs text-slate-500">Describe what makes them wonderfully quirky, or add custom tags!</p>
          </div>

          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">Select Core Traits (Up to 4)</label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_TRAITS.map((trait, idx) => {
                const isSelected = pet.traits.includes(trait);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCheckboxChange(trait)}
                    className={`text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-200' 
                        : 'bg-white text-slate-600 border-stone-200 hover:border-sky-405'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{trait}
                  </button>
                );
              })}
            </div>
            
            {/* Custom tags creator */}
            <form onSubmit={handleAddCustomTrait} className="flex gap-2 mt-3.5 border-t border-stone-50 pt-3">
              <input
                id="custom-trait-input"
                type="text"
                value={customTraitInput}
                onChange={e => setCustomTraitInput(e.target.value)}
                placeholder="Add customized trait... (e.g. Snorer Extraordinaire)"
                className="flex-1 text-xs font-semibold bg-white border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2 outline-none"
              />
              <button
                type="submit"
                id="add-trait-btn"
                className="bg-sky-600 border border-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-sky-700 active:scale-95 transition-all cursor-pointer"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Core Foster Survey Questionnaire Questions condensed into 1 larger description box */}
          <div className="space-y-3.5 pt-2 border-t border-stone-50">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1.5 leading-relaxed">
                Describe this pet (favorite activities, how they show love, etc.) *
              </label>
              <textarea
                name="estimatedBio"
                value={pet.estimatedBio}
                onChange={handleTextChange}
                placeholder="Share all the wonderful details! e.g., Barnaby is a sweet goofy mix who loves chasing tennis balls, snuggling on warm feet, and making funny outboard-motor snores. He is friendly, gets along with kids and dogs, and is a perfect couch cuddle bug..."
                rows={7}
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-3 outline-none placeholder:text-slate-400 leading-relaxed text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* STEP 3: PHOTOS & CONTACT DETAILS */}
      {/* ========================================================= */}
      {activeStep === 2 && (
        <div className="space-y-4 animate-fade-in text-slate-800">
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1 font-display">Upload Pet Photo/s</h3>
            <p className="text-xs text-slate-500">Drag & drop or browse.</p>
          </div>

          {/* Drag & Drop File Upload Frame */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleTriggerFileInput}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-sky-400 bg-sky-50/40 shadow-inner' 
                : 'border-stone-300 hover:border-sky-300 hover:bg-stone-50/40 bg-stone-50/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="p-3 bg-sky-50 text-sky-600 rounded-full mb-3 shadow-2xs">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-700">Drag & Drop Foster Photos Here</span>
            <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG (Select up to 2)</span>
          </div>

          {/* Quick thumbnails preview list */}
          {pet.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 border border-stone-200 p-2.5 rounded-xl bg-stone-50/50">
              {pet.photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group border border-stone-200">
                  <img src={url} alt="Uploaded preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(idx);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white hover:bg-red-700 p-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 text-center inset-x-0 bg-slate-800/80 text-[9px] py-0.5 text-white tracking-widest uppercase">
                    {idx === 0 ? 'Photo 1' : `Photo ${idx + 1}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photo framing hint */}
          {pet.photos.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-slate-800">
              <div>
                <h4 className="text-xs font-black text-slate-900">📸 Photo Framing</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed">
                  Drag photo in the preview section to reposition · Right-click for zoom options
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetPosition}
                className="shrink-0 px-2.5 py-1 text-[10px] font-bold text-sky-600 hover:text-sky-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}

          {/* Contact Details & Rescue Information */}
          <div className="space-y-3 pt-3 border-t border-stone-50">
            <h4 className="text-xs font-black text-slate-850 mb-0.5 flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-sky-550" /> Organization Contact Information</h4>
            <p className="text-[10px] font-semibold text-slate-600 mb-1.5">Only add details that should show on the flyer</p>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Rescue or Shelter Organization *</label>
                <input
                  type="text"
                  name="rescueOrg"
                  value={pet.rescueOrg}
                  onChange={handleTextChange}
                  placeholder="e.g. Grateful Paws Rescue"
                  className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="fosterEmail"
                  value={pet.fosterEmail}
                  onChange={handleTextChange}
                  placeholder="e.g. foster@rescue.org"
                  className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="fosterPhone"
                  value={pet.fosterPhone}
                  onChange={handleTextChange}
                  placeholder=""
                  className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Rescue Website URL (Auto-generates QR Code!)</label>
              <input
                type="text"
                name="rescueWebsite"
                value={pet.rescueWebsite}
                onChange={handleTextChange}
                placeholder="e.g. https://www.hopefulpaws.org"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: DESIGN & STYLING & AI BIO ENGINE */}
      {/* ========================================================= */}
      {activeStep === 3 && (
        <div className="space-y-4 animate-fade-in text-slate-800">
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1 font-display">Poster Canvas Aesthetics</h3>
            <p className="text-xs text-slate-500">Customize layout theme, header, and use Gemini to help with the final description.</p>
          </div>

          {/* Template Choice Selectors */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-2">Choose Poster Style / Layout</label>
              
              {/* Row 1: Single-Photo Classics */}
              <div className="mb-4">
                <span className="text-[9.5px] font-black text-sky-505 uppercase tracking-wider block mb-1.5 opacity-80">Single-Photo Layouts</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: 'editorial', name: '📰 Editorial Cover', desc: 'Bold classic serif headers' },
                    { id: 'minimalist', name: '◽ Clean Modern', desc: 'Best for vertical photo' },
                    { id: 'whimsical', name: '🐱 Cute Whimsical', desc: 'Soft pastel bubbles' },
                    { id: 'polaroid', name: '📸 Polaroid Classic', desc: 'Cozy diary snapshot' },
                    { id: 'comic', name: '💖 Sweet Romance', desc: 'Elegant pink & custom icons' }
                  ].map(t => (
                    <button
                      key={t.id}
                      id={`template-btn-${t.id}`}
                      onClick={() => setSettings(prev => ({ ...prev, templateId: t.id as PosterTemplateId }))}
                      className={`p-2 hover:scale-[1.01] text-left border rounded-xl flex flex-col justify-between h-20 transition-all cursor-pointer ${
                        settings.templateId === t.id
                          ? 'border-sky-400 bg-sky-50/45 shadow-md font-semibold -translate-y-0.5'
                          : 'border-stone-200 bg-white hover:border-sky-300 hover:bg-sky-50/30 hover:-translate-y-1 hover:shadow-md'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold text-slate-900 block leading-tight">{t.name}</span>
                      <span className="text-[8.5px] text-slate-500 block leading-tight mt-1">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Photo-Focused & Dual-Photo Layouts */}
              <div className="mb-4">
                <span className="text-[9.5px] font-black text-sky-505 uppercase tracking-wider block mb-1.5 opacity-80">Two-Photo Layouts</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'comic-2-photos', name: '💖 2 Photos- Sweet Romance', desc: 'Elegant pink layout with 2 photos' },
                    { id: 'two-photos', name: '🖼️ 2 Photos - Modern', desc: 'Twin large pictures, concise info' },
                    { id: 'extreme-duo', name: '📷 Photo-Focused', desc: 'Maximized pictures, limited info' },
                    { id: 'editorial-2-photos', name: '📰 Editorial Duo', desc: '2 stacked photos, editorial style' }
                  ].map(t => (
                    <button
                      key={t.id}
                      id={`template-btn-${t.id}`}
                      onClick={() => setSettings(prev => ({ ...prev, templateId: t.id as PosterTemplateId }))}
                      className={`p-2 hover:scale-[1.01] text-left border rounded-xl flex flex-col justify-between h-20 transition-all cursor-pointer ${
                        settings.templateId === t.id
                          ? 'border-sky-400 bg-sky-50/45 shadow-md font-semibold -translate-y-0.5'
                          : 'border-stone-200 bg-white hover:border-sky-300 hover:bg-sky-50/30 hover:-translate-y-1 hover:shadow-md'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold text-slate-900 block leading-tight">{t.name}</span>
                      <span className="text-[8.5px] text-slate-550 block leading-tight mt-1">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>


            </div>
          </div>

          {/* Preset Color Themes */}
          <div>
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-2">Choose Color Palette</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(theme => {
                const isSelected = settings.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    id={`theme-btn-${theme.id}`}
                    onClick={() => setSettings(prev => ({ ...prev, themeId: theme.id }))}
                    className={`p-2 text-left text-xs rounded-lg flex items-center gap-2 cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'font-bold shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50/50'
                    }`}
                    style={isSelected ? { borderColor: theme.themeColorHex, backgroundColor: theme.themeColorHex + '12' } : undefined}
                  >
                    <div className="w-7 h-7 rounded-full border border-white/60 shadow shrink-0 flex items-center justify-center" style={{ backgroundColor: theme.themeColorHex }}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[10px] truncate text-slate-705">{theme.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header Title Accent badge text */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-1">Poster Title Preset</label>
              <select
                value={settings.headingText}
                onChange={e => setSettings(prev => ({ ...prev, headingText: e.target.value }))}
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 p-2.5 rounded-xl outline-none"
              >
                {HEADING_PRESETS.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-1">Custom Header</label>
              <input
                type="text"
                value={settings.headingText}
                onChange={e => setSettings(prev => ({ ...prev, headingText: e.target.value }))}
                placeholder="e.g. MEET ME!"
                className="w-full text-xs font-semibold bg-stone-50/70 border-2 border-stone-200 focus:border-sky-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* GEMINI STORYTELLER CARD */}
          <div className="bg-yellow-50 rounded-3xl border border-yellow-100 p-4 mt-2">
            <div className="flex gap-2 items-start mb-2">
              <Sparkles className="w-5 h-5 text-yellow-600 animate-pulse shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-yellow-950">Gemini's AI Bio-writer</h4>
                <p className="text-[10px] text-yellow-750 font-bold leading-normal">Choose a voice — AI writes the bio, you make it perfect.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-3">
              <button
                type="button"
                id="generate-tinder-btn"
                disabled={isGeneratingBio}
                onClick={() => onGenerateBio('tinder')}
                className="cursor-pointer bg-[#451a03] text-white font-extrabold hover:bg-stone-850 leading-tight text-[10px] py-2 px-1.5 rounded-full transition-transform hover:scale-[1.02] text-center"
              >
                ⚡ Short & Sweet
              </button>
              <button
                type="button"
                id="generate-heartwarming-btn"
                disabled={isGeneratingBio}
                onClick={() => onGenerateBio('heartwarming')}
                className="cursor-pointer bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200 font-extrabold leading-tight text-[10px] py-2 px-1.5 rounded-full transition-transform hover:scale-[1.02] text-center"
              >
                💖 Sweet Diary
              </button>
              <button
                type="button"
                id="generate-social-btn"
                disabled={isGeneratingBio}
                onClick={() => onGenerateBio('social')}
                className="cursor-pointer bg-sky-600 text-white font-extrabold hover:bg-sky-700 leading-tight text-[10px] py-2 px-1.5 rounded-full transition-transform hover:scale-[1.02] text-center"
              >
                📸 Social post
              </button>
            </div>

            {isGeneratingBio && (
              <div id="ai-generating-loader" className="text-center font-bold text-[11px] text-yellow-800 py-1.5 animate-pulse flex items-center justify-center gap-1.5">
                <div className="w-3 h-3 border-2 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
                <span>Gemini is dreaming up the perfect pet profile... please wait...</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pet Description - Final Version (editable)</label>
                <button
                  type="button"
                  onClick={() => {
                    if (pet.estimatedBio) {
                      navigator.clipboard.writeText(pet.estimatedBio);
                    }
                  }}
                  disabled={!pet.estimatedBio}
                  title="Copy bio to clipboard"
                  className="flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-800 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <textarea
                name="estimatedBio"
                value={pet.estimatedBio}
                onChange={handleTextChange}
                placeholder="Story box is editable. Tap one of the buttons above to generate adoption details magically, or write what makes them special manually!"
                rows={5}
                className="w-full text-xs font-semibold border-2 border-stone-200 rounded-xl p-2.5 outline-none bg-white font-sans text-slate-800"
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">Tip: Check the poster preview to make sure your description fits — trim if needed.</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BUTTONS CONTROLS */}
      <div className="flex justify-between items-center border-t border-stone-200 pt-5 mt-6">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          className={`px-5 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
            activeStep === 0 
              ? 'text-slate-300 border-slate-100 cursor-not-allowed' 
              : 'text-slate-600 border-stone-200 hover:bg-stone-50 hover:text-slate-900 bg-white'
          }`}
        >
          ← Back
        </button>

        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Step {activeStep + 1} of {steps.length}
        </span>

        {activeStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setActiveStep(prev => prev + 1)}
            className="px-6 py-2 bg-sky-600 text-white rounded-full font-bold shadow-md shadow-sky-200 transition-all cursor-pointer text-xs"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={onSwitchToPreview}
            className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse cursor-pointer hover:text-emerald-700 hover:underline transition-colors"
          >
            <Check className="w-4 h-4" /> Ready to Print!
          </button>
        )}
      </div>

    </div>
  );
};
