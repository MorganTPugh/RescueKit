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
  Workflow
} from 'lucide-react';

interface PosterFormProps {
  pet: FosterPetData;
  setPet: React.Dispatch<React.SetStateAction<FosterPetData>>;
  settings: PosterDesignSettings;
  setSettings: React.Dispatch<React.SetStateAction<PosterDesignSettings>>;
  onGenerateBio: (style: string) => void;
  isGeneratingBio: boolean;
  onLoadPreset: (presetKey: string) => void;
}

export const PosterForm: React.FC<PosterFormProps> = ({
  pet,
  setPet,
  settings,
  setSettings,
  onGenerateBio,
  isGeneratingBio,
  onLoadPreset
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
    <div id="poster-editor-card" className="bg-white border border-sky-100 shadow-xl shadow-indigo-100/50 rounded-3xl p-6 selection:bg-indigo-50 flex flex-col justify-between">
      
      {/* Dynamic Preset Quick loader */}
      <div className="mb-4 bg-sky-50/60 border border-sky-100 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-slate-700">Want a head start? Load a rescue example:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            id="load-barnaby-btn"
            onClick={() => onLoadPreset('barnaby')}
            className="text-[11px] font-bold bg-white border border-sky-100 hover:bg-sky-100 hover:border-sky-300 text-slate-700 hover:text-indigo-750 px-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            🐶 Barnaby (Golden mix)
          </button>
          <button
            id="load-luna-btn"
            onClick={() => onLoadPreset('luna')}
            className="text-[11px] font-bold bg-white border border-sky-100 hover:bg-sky-100 hover:border-sky-300 text-slate-700 hover:text-indigo-750 px-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            🐱 Penelope (Cat)
          </button>
          <button
            id="load-waffles-btn"
            onClick={() => onLoadPreset('waffles')}
            className="text-[11px] font-bold bg-white border border-sky-100 hover:bg-sky-100 hover:border-sky-300 text-slate-700 hover:text-indigo-750 px-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            🐰 Waffles (Rabbit)
          </button>
        </div>
      </div>

      {/* STEPPERS NAVIGATION BAR */}
      <div className="flex border-b border-indigo-50 pb-3.5 mb-5 items-center gap-3 md:gap-4.5 justify-start overflow-x-auto scroll-hide">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center gap-1.5 sm:gap-2 pb-2.5 border-b-2 text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              activeStep === idx 
                ? 'border-indigo-500 text-indigo-600 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-750'
            }`}
          >
            <div className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
              activeStep === idx ? 'bg-indigo-50 text-indigo-650 font-bold' : 'bg-slate-100 text-slate-500'
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
            <h3 className="text-sm font-black text-slate-800 mb-1">About Your Foster</h3>
            <p className="text-xs text-slate-500">Provide the basic information to fill the headline card details.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pet Name *</label>
              <input
                id="pet-name-input"
                type="text"
                name="name"
                value={pet.name}
                onChange={handleTextChange}
                placeholder="e.g. Luna"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Species</label>
              <select
                id="pet-species-select"
                name="species"
                value={pet.species}
                onChange={handleTextChange}
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2.5 rounded-xl outline-none"
              >
                <option value="dog">Dog / Puppy</option>
                <option value="cat">Cat / Kitten</option>
                <option value="other">Other / Bunny / Bird</option>
              </select>
            </div>
          </div>

          {pet.species === 'other' && (
            <div className="animate-slide-up">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specify Species Name</label>
              <input
                id="pet-custom-species-input"
                type="text"
                name="customSpecies"
                value={pet.customSpecies || ''}
                onChange={handleTextChange}
                placeholder="e.g. Holland Lop Rabbit"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Breed / Mix *</label>
              <input
                id="pet-breed-input"
                type="text"
                name="breed"
                value={pet.breed}
                onChange={handleTextChange}
                placeholder="e.g. Retriever Mix"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Age *</label>
              <input
                id="pet-age-input"
                type="text"
                name="age"
                value={pet.age}
                onChange={handleTextChange}
                placeholder="e.g. 1.5 Years old"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gender</label>
              <select
                id="pet-gender-select"
                name="gender"
                value={pet.gender}
                onChange={handleTextChange}
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2.5 rounded-xl outline-none"
              >
                <option value="boy">Male</option>
                <option value="girl">Female</option>
                <option value="not-specified">Decline to specify</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Size / Weight</label>
              <input
                id="pet-weight-input"
                type="text"
                name="weight"
                value={pet.weight}
                onChange={handleTextChange}
                placeholder="e.g. 45 lbs"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Location *</label>
              <input
                id="pet-location-input"
                type="text"
                name="location"
                value={pet.location}
                onChange={handleTextChange}
                placeholder="e.g. Seattle, WA"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>

          {/* Living Compatibility Checkboxes */}
          <div className="pt-2 border-t border-sky-50">
            <h4 className="text-xs font-black text-slate-800 mb-2">Social & Potty Compatibility</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-black text-slate-405 uppercase tracking-widest block mb-1">Good with dogs?</label>
                <select
                  id="pet-compat-dogs"
                  name="goodWithDogs"
                  value={pet.goodWithDogs}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">Friendly (Yes)</option>
                  <option value="selective">Selective</option>
                  <option value="no">Needs single dog home (No)</option>
                  <option value="unknown">Not Tested</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-405 uppercase tracking-widest block mb-1">Good with cats?</label>
                <select
                  id="pet-compat-cats"
                  name="goodWithCats"
                  value={pet.goodWithCats}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">Friendly (Yes)</option>
                  <option value="selective">Selective</option>
                  <option value="no">No cats please (No)</option>
                  <option value="unknown">Not Tested</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-405 uppercase tracking-widest block mb-1">Good with kids? *</label>
                <select
                  id="pet-compat-kids"
                  name="goodWithKids"
                  value={pet.goodWithKids}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2 rounded-xl outline-none"
                >
                  <option value="yes">Super sweet with kids (Yes)</option>
                  <option value="selective">Older kids preferred</option>
                  <option value="no">Adults-only home (No)</option>
                  <option value="unknown">Not Tested</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-405 uppercase tracking-widest block mb-1">Potty Trained?</label>
                <select
                  id="pet-compat-potty"
                  name="houseTrained"
                  value={pet.houseTrained}
                  onChange={handleTextChange}
                  className="w-full text-[11px] font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2 rounded-xl outline-none"
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
            <h3 className="text-sm font-black text-slate-850 mb-1">Personality Traits & Humorous Habits</h3>
            <p className="text-xs text-slate-500">Pick what makes them wonderfully quirky, or add custom tags!</p>
          </div>

          <div className="border border-sky-100 rounded-2xl p-4 bg-sky-50/50">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Core Traits (Up to 4)</label>
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
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-150' 
                        : 'bg-white text-slate-600 border-sky-100 hover:border-indigo-405'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{trait}
                  </button>
                );
              })}
            </div>
            
            {/* Custom tags creator */}
            <form onSubmit={handleAddCustomTrait} className="flex gap-2 mt-3.5 border-t border-sky-50 pt-3">
              <input
                id="custom-trait-input"
                type="text"
                value={customTraitInput}
                onChange={e => setCustomTraitInput(e.target.value)}
                placeholder="Add customized trait... (e.g. Snorer Extraordinaire)"
                className="flex-1 text-xs font-semibold bg-white border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2 outline-none"
              />
              <button
                type="submit"
                id="add-trait-btn"
                className="bg-indigo-600 border border-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Core Foster Survey Questionnaire Questions condensed into 1 larger description box */}
          <div className="space-y-3.5 pt-2 border-t border-sky-50">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 leading-relaxed">
                Describe what people should know about this pet (favorite activities, how they show love, traits people should know, etc) *
              </label>
              <textarea
                name="estimatedBio"
                value={pet.estimatedBio}
                onChange={handleTextChange}
                placeholder="Share all the wonderful details! e.g., Barnaby is a sweet goofy mix who loves chasing tennis balls, snuggling on warm feet, and making funny outboard-motor snores. He is friendly, gets along with kids and dogs, and is a perfect couch cuddle bug..."
                rows={7}
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-3 outline-none placeholder:text-slate-400 leading-relaxed text-slate-800"
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
            <h3 className="text-sm font-black text-slate-800 mb-1">Upload Cute Foster Photos (Up to 3)</h3>
            <p className="text-xs text-slate-500">Provide direct visual proof of their charm. Drag & drop or browse.</p>
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
                ? 'border-indigo-400 bg-indigo-50/40 shadow-inner' 
                : 'border-sky-200 hover:border-indigo-300 hover:bg-sky-50/40 bg-sky-50/10'
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
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3 shadow-2xs">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-700">Drag & Drop Foster Photos Here</span>
            <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG (Select up to 2)</span>
          </div>

          {/* Quick thumbnails preview list */}
          {pet.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 border border-sky-100 p-2.5 rounded-xl bg-sky-50/50">
              {pet.photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group border border-sky-100">
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
                    {idx === 0 ? 'Primary' : `Slide ${idx + 1}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Photo Framing controls */}
          {pet.photos.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl space-y-3.5 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    📸 Primary Photo Framing & Zoom
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Fine-tune zoom and centering below. You can also drag the photo directly inside the Live Poster Preview to move it!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetPosition}
                  className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                  title="Reset alignment"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Zoom range slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wide text-slate-500 uppercase">
                    <span>Magnify / Zoom 🔍</span>
                    <span className="text-indigo-600 font-mono">{(pet.photoZoom ?? 1).toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={pet.photoZoom ?? 1}
                    onChange={handleZoomChange}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Horizontal Shift range slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wide text-slate-500 uppercase">
                    <span>Shift Left / Right ↔️</span>
                    <span className="text-indigo-600 font-mono">{pet.photoOffsetX ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="1"
                    value={pet.photoOffsetX ?? 0}
                    onChange={handleOffsetXChange}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Vertical Shift range slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wide text-slate-500 uppercase">
                    <span>Shift Up / Down ↕️</span>
                    <span className="text-indigo-600 font-mono">{pet.photoOffsetY ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="1"
                    value={pet.photoOffsetY ?? 0}
                    onChange={handleOffsetYChange}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Details & Rescue Information */}
          <div className="space-y-3 pt-3 border-t border-sky-50">
            <h4 className="text-xs font-black text-slate-850 mb-1 flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-indigo-550" /> Organization Contact Information (only input what should be on the poster)</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Rescue or Shelter Organization *</label>
                <input
                  type="text"
                  name="rescueOrg"
                  value={pet.rescueOrg}
                  onChange={handleTextChange}
                  placeholder="e.g. Hopeful Paws Rescue"
                  className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Contact Email <span className="normal-case font-medium text-slate-500"> (if applicable)</span>
                </label>
                <input
                  type="email"
                  name="fosterEmail"
                  value={pet.fosterEmail}
                  onChange={handleTextChange}
                  placeholder="e.g. foster@rescue.org"
                  className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Contact phone number <span className="normal-case font-medium text-slate-500"> (if applicable)</span>
                </label>
                <input
                  type="text"
                  name="fosterPhone"
                  value={pet.fosterPhone}
                  onChange={handleTextChange}
                  placeholder="e.g. 512-555-0100"
                  className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Rescue Website URL (Auto-generates QR Code!)</label>
              <input
                type="text"
                name="rescueWebsite"
                value={pet.rescueWebsite}
                onChange={handleTextChange}
                placeholder="e.g. https://www.hopefulpaws.org"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
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
            <h3 className="text-sm font-black text-slate-800 mb-1">Poster Canvas Aesthetics</h3>
            <p className="text-xs text-slate-500">Customize layout themes, headers, and click to automatically generate bios using Gemini API.</p>
          </div>

          {/* Template Choice Selectors */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">1. Choose Template Layout Archetype</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'whimsical', name: '🐱 Cute Whimsical', desc: 'Soft pastel bubbles' },
                { id: 'minimalist', name: '◽ Clean Modern', desc: 'Sleek asymmetric grid' },
                { id: 'editorial', name: '📰 Editorial Cover', desc: 'Bold classic serif headers' },
                { id: 'comic', name: '💖 Sweet Romance', desc: 'Elegant pink & custom icons' },
                { id: 'comic-2-photos', name: '💖 Sweet Romance - 2 photos', desc: 'Elegant pink layout with 2 photos' },
                { id: 'polaroid', name: '📸 Polaroid Classic', desc: 'Cozy diary snapshot' },
                { id: 'two-photos', name: '🖼️ 2 Photos', desc: 'Twin large pictures, concise info' },
                { id: 'bio-only', name: '📝 Biography Only', desc: 'Simple text for Adoption Bios' }
              ].map(t => (
                <button
                  key={t.id}
                  id={`template-btn-${t.id}`}
                  onClick={() => setSettings(prev => ({ ...prev, templateId: t.id as PosterTemplateId }))}
                  className={`p-2.5 text-left border rounded-xl flex flex-col justify-between h-20 transition-all cursor-pointer ${
                    settings.templateId === t.id 
                      ? 'border-indigo-400 bg-indigo-50/40 shadow-xs' 
                      : 'border-sky-100 bg-white hover:border-indigo-305 hover:bg-sky-50/20'
                  }`}
                >
                  <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">{t.name}</span>
                  <span className="text-[9px] text-slate-500 block leading-tight mt-1">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Color Themes */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">2. Visual Preset Palette</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  id={`theme-btn-${theme.id}`}
                  onClick={() => setSettings(prev => ({ ...prev, themeId: theme.id }))}
                  className={`p-2 text-left text-xs border rounded-lg flex items-center gap-2 cursor-pointer ${
                    settings.themeId === theme.id 
                      ? 'border-indigo-500 bg-indigo-50/30 font-bold shadow-2xs' 
                      : 'border-sky-100 bg-white hover:bg-sky-50/50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border shadow-2xs shrink-0" style={{ backgroundColor: theme.themeColorHex }}></div>
                  <span className="text-[10px] truncate text-slate-705">{theme.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header Title Accent badge text */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">3. Poster Title Header</label>
              <input
                type="text"
                value={settings.headingText}
                onChange={e => setSettings(prev => ({ ...prev, headingText: e.target.value }))}
                placeholder="e.g. MEET ME!"
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 rounded-xl p-2.5 outline-none placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pick Header Preset</label>
              <select
                value={settings.headingText}
                onChange={e => setSettings(prev => ({ ...prev, headingText: e.target.value }))}
                className="w-full text-xs font-semibold bg-sky-50/70 border-2 border-sky-100 focus:border-indigo-400 p-2.5 rounded-xl outline-none"
              >
                {HEADING_PRESETS.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
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
                🔥 Tinder Style
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
                className="cursor-pointer bg-indigo-600 text-white font-extrabold hover:bg-indigo-750 leading-tight text-[10px] py-2 px-1.5 rounded-full transition-transform hover:scale-[1.02] text-center"
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pet Description - Final Version (editable)</label>
              <textarea
                name="estimatedBio"
                value={pet.estimatedBio}
                onChange={handleTextChange}
                placeholder="Story box is editable. Tap one of the buttons above to generate adoption details magically, or write what makes them special manually!"
                rows={5}
                className="w-full text-xs font-semibold border-2 border-sky-100 rounded-xl p-2.5 outline-none bg-white font-sans text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BUTTONS CONTROLS */}
      <div className="flex justify-between items-center border-t border-sky-100 pt-5 mt-6">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          className={`px-5 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
            activeStep === 0 
              ? 'text-slate-300 border-slate-100 cursor-not-allowed' 
              : 'text-slate-600 border-sky-100 hover:bg-sky-50 hover:text-slate-900 bg-white'
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer text-xs"
          >
            Continue →
          </button>
        ) : (
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
            <Check className="w-4 h-4" /> Ready to Print!
          </div>
        )}
      </div>

    </div>
  );
};
