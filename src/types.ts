export interface FosterPetData {
  name: string;
  species: 'dog' | 'cat' | 'other';
  customSpecies?: string;
  breed: string;
  age: string;
  gender: 'boy' | 'girl' | 'not-specified';
  weight: string;
  location: string;
  
  // Traits & Character
  traits: string[]; // e.g. ["Couch Potato", "Derpy", "Snuggle Bug", "Treat Motivator"]
  goodWithDogs: 'yes' | 'no' | 'selective' | 'unknown';
  goodWithCats: 'yes' | 'no' | 'selective' | 'unknown';
  goodWithKids: 'yes' | 'no' | 'selective' | 'unknown';
  houseTrained: 'yes' | 'no' | 'working-on-it' | 'not-applicable';

  // Foster Questionnaire Responses (The story creators)
  favoriteActivity: string; // "Chasing speculative dust motes..."
  funnyHabit: string; // "Snores like a freight train..."
  perfectDay: string; // "Breakfast in bed, followed by 12 hours of sleep..."
  loveLanguage: string; // "Aggressively placing their wet nose against your forearm..."
  estimatedBio: string; // Foster's own raw notes/draft, typed by hand — never overwritten by AI generation
  posterBio: string; // Final bio shown on the poster — starts blank, filled by AI generation or the foster editing directly

  // Contact & Rescue Details
  fosterName: string;
  rescueOrg: string;
  fosterEmail: string;
  fosterPhone: string;
  rescueWebsite: string;
  qrCodeUrl?: string; // Optional QR code value
  
  // High-quality user uploaded base64 photos (Up to 3)
  photos: string[]; 

  // Position, zoom & crop controls for primary photo
  photoZoom?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;

  // Position, zoom & crop controls for secondary photo
  photoZoom2?: number;
  photoOffsetX2?: number;
  photoOffsetY2?: number;
}

export type PosterTemplateId = 'whimsical' | 'minimalist' | 'editorial' | 'comic' | 'polaroid' | 'bio-only' | 'two-photos' | 'comic-2-photos' | 'extreme-duo' | 'editorial-2-photos';

export type FontStyleId = 'playful' | 'elegant' | 'modern' | 'mono';

export interface StyleTheme {
  id: string;
  name: string;
  bgClass: string;
  accentClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
  gradientBg: string;
  themeColorHex: string; // Real hex code for custom drawing
}

export interface PosterDesignSettings {
  templateId: PosterTemplateId;
  themeId: string;
  headingText: string; // e.g., "ADOPT ME!", "LOOKING FOR A HERO"
  aspectRatio: 'square' | 'flyer';
  customColors?: {
    primary: string;
    secondary: string;
  };
}
