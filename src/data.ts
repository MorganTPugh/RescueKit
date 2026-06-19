import { StyleTheme, FosterPetData } from './types';

export const THEMES: StyleTheme[] = [
  {
    id: 'vibrant',
    name: 'Vibrant Indigo (Modern & Playful)',
    bgClass: 'bg-[#f0f9ff]/50',
    accentClass: 'bg-indigo-600 text-white',
    borderClass: 'border-sky-250',
    textClass: 'text-slate-900',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    gradientBg: 'from-sky-50 to-indigo-100',
    themeColorHex: '#4f46e5'
  },
  {
    id: 'peach',
    name: 'Coral Peach (Warm & Whimsical)',
    bgClass: 'bg-amber-50/50',
    accentClass: 'bg-rose-500 text-white',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-950',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    gradientBg: 'from-rose-50 to-orange-100',
    themeColorHex: '#f43f5e'
  },
  {
    id: 'sage',
    name: 'Emerald Sage (Calm & Elegant)',
    bgClass: 'bg-emerald-50/50',
    accentClass: 'bg-emerald-700 text-white',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-950',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    gradientBg: 'from-emerald-50 to-teal-100',
    themeColorHex: '#047857'
  },
  {
    id: 'gold',
    name: 'Sunny Marigold (Happy & Bright)',
    bgClass: 'bg-amber-50/70',
    accentClass: 'bg-amber-500 text-amber-950',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-950',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    gradientBg: 'from-amber-50 to-yellow-100',
    themeColorHex: '#f59e0b'
  },
  {
    id: 'sky',
    name: 'Cool Sky (Fresh & Playful)',
    bgClass: 'bg-sky-50/50',
    accentClass: 'bg-sky-600 text-white',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-950',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    gradientBg: 'from-sky-50 to-indigo-100',
    themeColorHex: '#0284c7'
  },
  {
    id: 'berry',
    name: 'Plum Grapefruit (Bold & Modern)',
    bgClass: 'bg-fuchsia-50/50',
    accentClass: 'bg-fuchsia-700 text-white',
    borderClass: 'border-fuchsia-200',
    textClass: 'text-fuchsia-950',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
    gradientBg: 'from-fuchsia-50 to-rose-100',
    themeColorHex: '#a21caf'
  }
];

export const PRESET_TRAITS = [
  'friendly',
  'shy',
  'outgoing',
  'cuddly',
  'energetic',
  'calm',
  'playful',
  'independent',
  'gentle',
  'smart',
  'goofy',
  'vocal',
  'affectionate',
  'timid',
  'curious',
  'protective'
];

export const HEADING_PRESETS = [
  'ADOPT ME!',
  'Need a foster!',
  'MEET THIS LEGEND!',
  'COULD I BE YOURS?',
  'Be my Human!',
  'Looking for my forever home!',
  'Ready to Love',
  'Take me Home!'
];

export const SAMPLE_PETS: Record<string, FosterPetData> = {
  barnaby: {
    name: "Barnaby",
    species: "dog",
    breed: "Golden Retriever mix",
    age: "1.5 Years old",
    gender: "boy",
    weight: "52 lbs",
    location: "Austin, TX",
    traits: ["cuddly", "energetic", "friendly", "goofy"],
    goodWithDogs: "yes",
    goodWithCats: "selective",
    goodWithKids: "yes",
    houseTrained: "yes",
    favoriteActivity: "Sprinting in circles holding a standard tennis ball, but never releasing it.",
    funnyHabit: "Snores exactly like an old outboard motor and sleeps with all four feet pointing straight at the ceiling.",
    perfectDay: "Going to the park, falling awkwardly into a mud puddle, and then sleeping on your clean rug.",
    loveLanguage: "Placing his massive wet chin directly on your keyboard during work calls until you surrender a kiss.",
    estimatedBio: "Meet Barnaby! He’s a gorgeous Golden Retriever mix who has never met a mud puddle he didn't fit into. At just 1.5 years old, Barnaby represents the pinnacle of goofy, high-octane joy. His love language is full-body snuggles, and he will happily use your feet as his personal pillow. Barnaby is fully house trained and gets along wonderfully with kids and other dogs. If you have been looking for an elite velcro pet who will cheer you up 24/7, Barnaby is your boy!",
    fosterName: "Sarah M.",
    rescueOrg: "Hopeful Paws Rescue",
    fosterEmail: "sarah.fosters@example.org",
    fosterPhone: "512-555-0192",
    rescueWebsite: "https://www.hopefulpaws.org",
    photos: [] // Will be loaded dynamically with beautiful local illustrations or base64 samples
  },
  luna: {
    name: "Penelope",
    species: "cat",
    breed: "Domestic Shorthair (Tuxedo)",
    age: "4 Years old",
    gender: "girl",
    weight: "9.5 lbs",
    location: "Seattle, WA",
    traits: ["independent", "vocal", "curious", "shy"],
    goodWithDogs: "no",
    goodWithCats: "yes",
    goodWithKids: "selective",
    houseTrained: "yes",
    favoriteActivity: "Batting plastic milk jug rings under the refrigerator at 3:00 AM.",
    funnyHabit: "Staring intensely into completely empty corners to make sure you believe the house is haunted.",
    perfectDay: "Watching squirrels through the window in a hot sunbeam, followed by tuna pate served in a crystal saucer.",
    loveLanguage: "Singing the song of her people (meowing) loudly at 6 AM until you rise and spoon with her.",
    estimatedBio: "Meet Penelope! She is a sophisticated, 4-year-old Tuxedo lady who excels in the art of the dramatic sigh. Penelope is a quiet observer who loves hot sunbeams, batting toys under furniture, and giving sand-paper kisses. She gets along nicely with other cats and is looking for a peaceful home with plenty of warm window sills.",
    fosterName: "Marcus Vance",
    rescueOrg: "Whiskers & Co",
    fosterEmail: "marcus.v@example.org",
    fosterPhone: "206-555-0138",
    rescueWebsite: "https://www.whiskersseattle.com",
    photos: []
  },
  waffles: {
    name: "Waffles",
    species: "other",
    customSpecies: "Holland Lop Rabbit",
    breed: "Holland Lop Bunny",
    age: "8 Months",
    gender: "boy",
    weight: "3 lbs",
    location: "Denver, CO",
    traits: ["gentle", "independent", "calm"],
    goodWithDogs: "no",
    goodWithCats: "selective",
    goodWithKids: "yes",
    houseTrained: "working-on-it",
    favoriteActivity: "Chewing cardboard castles to pieces and doing acrobatic zoomie flips (binkies) on the couch.",
    funnyHabit: "Thumping aggressively if his cilantro bowl is empty for more than 5 seconds.",
    perfectDay: "Ears flapping in the breeze, exploring a safe bunny-proofed room, eating premium timothy hay, and munching on fresh banana chips.",
    loveLanguage: "Grooming your socks lovingly whilst making a quiet buzzing sound.",
    estimatedBio: "Say hello to Waffles, the 8-month-old Holland Lop boy seeking his safe indoor sanctuary! Waffles is a tiny bun with a massive personality. He is a treat motivator who is highly skilled in bunny parkour (expect spectacular mid-air binkies!). His favorite hobby is structural demolition of cardboard boxes. If you're looking for a quiet, clean, and endlessly entertaining little friend who communicates through cute ear twitches and soft sock grooms, Waffles is ready to hop into your heart!",
    fosterName: "Jenna Lin",
    rescueOrg: "Rocky Mountain Bunny Haven",
    fosterEmail: "jenna@cohaven.org",
    fosterPhone: "303-555-0177",
    rescueWebsite: "https://www.rmbunnyhaven.org",
    photos: []
  }
};
