import React, { useState } from 'react';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  HeadingLevel, 
  AlignmentType, 
  WidthType, 
  BorderStyle,
  HeightRule
} from 'docx';
import { 
  FileText, 
  Download, 
  Printer, 
  Check, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Sparkles, 
  Info,
  ChevronRight,
  Eye,
  Sliders
} from 'lucide-react';

// Define structures for our templates
interface FormField {
  label: string;
  type: 'text' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'email' | 'phone' | 'table';
  options?: string[];
  placeholder?: string;
  width?: 'full' | 'half' | 'third';
  tableHeaders?: string[];
  tableRows?: string[][];
}

interface FormSection {
  title: string;
  type: 'text' | 'fields';
  paragraphs?: string[];
  fields?: FormField[];
}

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  notice: string[];
  generalReqs?: string[];
  sections: FormSection[];
  legalClauses?: string[];
}

// Custom theme color maps
interface ThemePalette {
  name: string;
  primary: string; // Tailwind class
  primaryHex: string;
  bgLight: string;
  border: string;
  text: string;
  textLight: string;
}

const THEME_PALETTES: Record<string, ThemePalette> = {
  indigo: {
    name: 'Indigo',
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    primaryHex: '4F46E5',
    bgLight: 'bg-indigo-50/50',
    border: 'border-indigo-100',
    text: 'text-indigo-900',
    textLight: 'text-indigo-600'
  },
  emerald: {
    name: 'Emerald',
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    primaryHex: '059669',
    bgLight: 'bg-emerald-50/50',
    border: 'border-emerald-100',
    text: 'text-emerald-900',
    textLight: 'text-emerald-600'
  },
  rose: {
    name: 'Rose',
    primary: 'bg-rose-600 hover:bg-rose-700',
    primaryHex: 'E11D48',
    bgLight: 'bg-rose-50/50',
    border: 'border-rose-100',
    text: 'text-rose-900',
    textLight: 'text-rose-600'
  },
  amber: {
    name: 'Amber',
    primary: 'bg-amber-600 hover:bg-amber-700',
    primaryHex: 'D97706',
    bgLight: 'bg-amber-50/50',
    border: 'border-amber-100',
    text: 'text-amber-900',
    textLight: 'text-amber-600'
  },
  slate: {
    name: 'Slate',
    primary: 'bg-slate-700 hover:bg-slate-800',
    primaryHex: '475569',
    bgLight: 'bg-slate-50/50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textLight: 'text-slate-600'
  }
};

// Raw template data
const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'adoption-app',
    title: 'Pet Adoption Application',
    description: 'Adoption application for potential adopters to complete before taking an animal home.',
    notice: [
      'This application remains the property of the rescue organization.',
      'The organization reserves the right to refuse adoption to anyone and bases all decisions solely on the animal’s best interest.'
    ],
    generalReqs: [
      'All current pets in the household must be spayed/neutered before bringing a new pet home.',
      "Must verify that pets (including any breed/size restrictions) are permitted at your residence. If renting, you may be required to provide physical proof of landlord approval prior to adoption.",
      'The organization reserves the right to check veterinarian and personal references, and may conduct follow-ups.'
    ],
    sections: [
      {
        title: 'Part 1: Applicant & Contact Profile',
        type: 'fields',
        fields: [
          { label: 'First Name, MI, Last Name', type: 'text', width: 'full' },
          { label: 'Date of Birth', type: 'date', width: 'half' },
          { label: 'Email Address', type: 'email', width: 'half' },
          { label: 'Primary / Cell Phone', type: 'phone', width: 'half' },
          { label: 'Does this phone accept text messages / SMS?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Alternate / Home Phone', type: 'phone', width: 'half' },
          { label: 'Physical Street Address', type: 'text', width: 'full' },
          { label: 'City, State, Zip', type: 'text', width: 'half' },
          { label: 'Township / County', type: 'text', width: 'half' },
          { label: 'I am interested in adopting a', type: 'checkbox', options: ['Dog', 'Cat', 'Other'], width: 'half' },
          { label: 'Name of specific animal or desired breed', type: 'text', width: 'half' },
          { label: 'What is the main reason you want this pet?', type: 'text', width: 'full' },
          { 
            label: 'Source of Income', 
            type: 'checkbox', 
            options: ['Job', 'Social Security', 'Pension', 'Unemployment', 'Disability', 'Retired', 'Self-Employment', 'No Income', 'Other'], 
            width: 'full' 
          }
        ]
      },
      {
        title: 'Part 2: Household & Property Logistics',
        type: 'fields',
        fields: [
          { 
            label: 'Do you own or rent this residence?', 
            type: 'radio', 
            options: ['Own My Home', "Rent (I confirm that I have verified the property owner's pet policy and can provide proof of approval)"], 
            width: 'full' 
          },
          { label: 'Property Type', type: 'radio', options: ['House', 'Apartment', 'Condo', 'Townhome'], width: 'full' },
          { label: 'How long have you lived at this address?', type: 'text', width: 'full' },
          { label: 'Landlord or Complex Name (If renting)', type: 'text', width: 'half' },
          { label: 'Landlord/Complex Phone Number', type: 'phone', width: 'half' },
          { label: 'Homeowners Association (HOA) Name & Phone (if applicable)', type: 'text', width: 'full' },
          { label: 'Do you have a fenced-in yard or dedicated outdoor kennel area?', type: 'radio', options: ['No', 'Yes'], width: 'full' },
          { label: 'If yes, please indicate the type and height of the fence/containment', type: 'text', width: 'full' },
          { label: 'Do you have a separate outdoor kennel run?', type: 'radio', options: ['No', 'Yes'], width: 'full' },
          { label: 'Number of adults living in the home', type: 'text', width: 'third' },
          { label: 'Number of children living in the home', type: 'text', width: 'third' },
          { label: 'Ages of all children in the household', type: 'text', width: 'third' },
          { label: 'Please list the complete legal names, birth dates, and relationships of all other adults in the home', type: 'textarea', width: 'full' },
          { 
            label: 'How would you describe the activity level of your household?', 
            type: 'radio', 
            options: [
              'Very quiet - serene environment, not too many guests.',
              'Average - not too quiet, but not wild and crazy either.',
              'Very busy - high energy, lots of people coming and going!'
            ], 
            width: 'full' 
          },
          { 
            label: 'Background Check: Has anyone in your household ever been charged with or cited for animal cruelty, neglect, or any animal-related violations?', 
            type: 'radio', 
            options: ['No', 'Yes (If yes, please explain below)'], 
            width: 'full' 
          },
          { label: 'Explain background details if applicable', type: 'textarea', width: 'full' },
          { label: 'Does anyone in the household suffer from animal-related allergies or asthma?', type: 'radio', options: ['No', 'Yes'], width: 'half' },
          { label: 'If yes, are they medically controlled?', type: 'radio', options: ['Yes', 'No'], width: 'half' }
        ]
      },
      {
        title: 'Part 3: Animal History & Veterinary Reference',
        type: 'fields',
        fields: [
          { 
            label: 'Check all animal categories currently on your property', 
            type: 'checkbox', 
            options: ['No current animals', 'One dog', 'More than one dog', 'One cat', 'More than one cat', 'Livestock (Horses, goats, etc.)', 'Other Animals'], 
            width: 'full' 
          },
          { label: 'Please describe your current resident pets and/or livestock (Include names, ages, breeds, and genders)', type: 'textarea', width: 'full' },
          { label: 'Are your current pets spayed/neutered?', type: 'radio', options: ['Yes', 'No (If no, please explain below)'], width: 'full' },
          { label: 'Explain if current pets are not altered', type: 'text', width: 'full' },
          { label: 'Please list the names, breeds, or types of any pets you have owned in the last 5-10 years but no longer own', type: 'textarea', width: 'full' },
          { label: 'For any past pets listed above, please explain why you no longer have them (passed away, rehomed, surrendered)', type: 'textarea', width: 'full' },
          { label: 'Have any of your past or current animals NOT lived out a normal, healthy lifespan expected for their breed?', type: 'radio', options: ['No', 'Yes (If yes, explain below)'], width: 'full' },
          { label: 'Circumstances of shortened lifespan if applicable', type: 'textarea', width: 'full' },
          { label: 'Name of Current/Previous Veterinarian or Clinic', type: 'text', width: 'full' },
          { label: 'Clinic Phone Number', type: 'phone', width: 'half' },
          { label: 'Clinic Address', type: 'text', width: 'half' }
        ]
      },
      {
        title: 'Part 4: Everyday Care, Lifestyle & Environment',
        type: 'fields',
        fields: [
          { label: 'Describe how often and for how long this pet will be left alone?', type: 'textarea', width: 'full' },
          { label: 'When the pet is left alone, where will s/he stay?', type: 'radio', options: ['In the house', 'In the yard', 'In a crate / indoor kennel', 'Other'], width: 'full' },
          { label: 'Explain other location if applicable', type: 'text', width: 'full' },
          { 
            label: 'How do you plan to keep and manage this pet?', 
            type: 'radio', 
            options: [
              'Indoors only, unless supervised or on a leash with me.',
              'Outdoors only. (Animals are not allowed inside the house).',
              'Both inside and outside, depending on the weather, schedule, and daily activities.'
            ], 
            width: 'full' 
          },
          { label: 'If you move in the future, what are your plans for the pet?', type: 'textarea', width: 'full' },
          { label: 'Under what circumstances or behavioral issues would this animal no longer be welcome in your home?', type: 'textarea', width: 'full' },
          { label: 'Are you prepared and able to pay for annual animal care expenses that can comfortably exceed $1,500 per year?', type: 'radio', options: ['Yes', 'No'], width: 'full' },
          { label: 'Do you agree to provide prompt medical treatment through a licensed veterinarian if this animal becomes ill or injured?', type: 'radio', options: ['Yes', 'No'], width: 'half' }
        ]
      },
      {
        title: 'Part 5: Species-Specific Requirements',
        type: 'fields',
        fields: [
          { label: '[DOG ONLY] What method(s) do you plan to use to train your dog?', type: 'textarea', width: 'full' },
          { label: '[CAT ONLY] No-Declaw Agreement: Do you agree that you will not declaw the cat you are applying for?', type: 'radio', options: ['Yes', 'No'], width: 'full' }
        ]
      },
      {
        title: 'Part 6: Placement Acknowledgments',
        type: 'fields',
        fields: [
          { label: 'Are you ready and fully prepared to welcome this animal into your home immediately?', type: 'radio', options: ['Yes', 'No'], width: 'full' },
          { label: 'Is this animal intended to be a gift for someone outside your immediate household?', type: 'radio', options: ['No', 'Yes'], width: 'half' },
          { label: 'If yes, explain circumstances', type: 'text', width: 'half' },
          { label: 'Please share any other information, background details, or context you would like the adoption team to consider', type: 'textarea', width: 'full' }
        ]
      }
    ],
    legalClauses: [
      'I, the undersigned, certify that I am at least 18 years of age and that all information provided in this form is completely true, accurate, and correct.',
      'Veterinary Records Release: I hereby authorize my veterinarian/clinic to release any and all medical and historical compliance records of any animals I have owned or currently own to the rescue organization upon request.',
      'I understand that a digital or physical home check may be required prior to approval or following placement.',
      'I understand that I may not be approved to adopt the pet I have chosen if the animal is determined not to be a safe or ideal match for my lifestyle, housing constraints, or experience level.',
      'Falsification & Recovery Clause: If upon an application review, reference check, or home visit, the organization discovers any information contained in this application to be false or intentionally misleading, the organization retains the absolute right to deny the adoption, void any pending agreements, or remove the animal from your premises immediately without a refund of any fees paid.'
    ]
  },
  {
    id: 'foster-app',
    title: 'Foster Care Volunteer Application',
    description: 'Foster care application to collect volunteer details, household logistics, references, and animal preferences.',
    notice: [
      'This application remains the property of the rescue organization.',
      'The organization reserves the right to deny any volunteer application based on the safety and capacity of the rescue and its animals.',
      'Fostering is a voluntary position, and all foster caregivers must agree to abide by the specific rules, training protocols, and medical regulations established by the organization.'
    ],
    generalReqs: [
      'Must meet the organization\'s minimum age requirement and possess a valid form of identification.',
      'If renting or living in a managed community, you must have verified approval from your landlord or property owner to bring foster animals onto the premises.',
      'Resident Pet Health Requirement: To protect your own animals and the rescue\'s population, all resident pets in your home must be fully up to date on core vaccinations (specifically including Rabies).',
      'Must be willing and able to safely transport your foster animal to routine or emergency veterinary appointments and scheduled adoption events.'
    ],
    sections: [
      {
        title: 'Part 1: Foster Profile & Contact Information',
        type: 'fields',
        fields: [
          { label: 'First Name, MI, Last Name', type: 'text', width: 'full' },
          { label: 'Date of Birth', type: 'date', width: 'half' },
          { label: 'Email Address', type: 'email', width: 'half' },
          { label: 'Primary Phone Number', type: 'phone', width: 'half' },
          { label: 'Alternate / Work Phone Number', type: 'phone', width: 'half' },
          { label: 'Physical Street Address', type: 'text', width: 'full' },
          { label: 'City, State, Zip', type: 'text', width: 'half' },
          { label: 'Current Employer', type: 'text', width: 'half' },
          { label: 'What type of animal are you primarily willing to foster?', type: 'checkbox', options: ['Dogs / Puppies', 'Cats / Kittens', 'Other'], width: 'full' },
          { label: 'Why are you interested in becoming a foster volunteer for our organization?', type: 'textarea', width: 'full' },
          { label: 'Do you have any specific concerns, constraints, or questions about fostering an animal in your home?', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Part 2: Household & Living Environment',
        type: 'fields',
        fields: [
          { label: 'Which best describes your housing?', type: 'radio', options: ['House', 'Apartment', 'Condo', 'Townhome'], width: 'half' },
          { label: 'Do you own or rent this residence?', type: 'radio', options: ['Own My Home', 'Rent'], width: 'half' },
          { label: 'If renting or under an HOA, do you have official approval to bring a foster pet into your home?', type: 'radio', options: ['Yes', 'No', 'N/A'], width: 'full' },
          { label: 'Does your residence or community have any strict animal restrictions (breed, weight, or count limits)?', type: 'radio', options: ['No', 'Yes (If yes, please list below)'], width: 'full' },
          { label: 'List community animal restrictions if applicable', type: 'text', width: 'full' },
          { label: 'Describe exactly where you plan to keep your foster animals, including how you will separate them completely from resident pets when necessary (quarantine, feeding, illness)', type: 'textarea', width: 'full' },
          { label: 'Approximately how long, on an average day, will the foster animals be left completely alone in the home without human monitoring?', type: 'text', width: 'full' }
        ]
      },
      {
        title: 'Part 3: Human & Animal Household Members',
        type: 'fields',
        fields: [
          { 
            label: 'Human Household Inventory (List all adults in the home, their ages, relationships, and involvement)', 
            type: 'table', 
            tableHeaders: ['Full Legal Name', 'Age', 'Relationship', 'Involved in Daily Care? (Yes/No)'],
            tableRows: [
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', '']
            ],
            width: 'full' 
          },
          { label: 'Are there any children under the age of 18 living in the home?', type: 'radio', options: ['No', 'Yes (If yes, list ages below)'], width: 'half' },
          { label: 'Ages of children in the household', type: 'text', width: 'half' },
          { label: 'Do all adults in the household fully approve of, and agree to, the decision to take in foster rescue animals?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Who will be designated as the primary caretaker for the foster pet?', type: 'text', width: 'half' },
          { 
            label: 'Animal Household Inventory (List all current resident pets)', 
            type: 'table', 
            tableHeaders: ['Animal Name', 'Breed / Type', 'Age', 'Sex (M/F)', 'Spayed/Neutered? (Y/N)', 'Last Rabies Vaccine Date'],
            tableRows: [
              ['', '', '', '', '', ''],
              ['', '', '', '', '', ''],
              ['', '', '', '', '', '']
            ],
            width: 'full' 
          },
          { label: 'Name of Current Veterinarian / Clinic', type: 'text', width: 'half' },
          { label: 'Clinic Phone Number', type: 'phone', width: 'half' }
        ]
      },
      {
        title: 'Part 4: Experience, Preferences & Capabilities',
        type: 'fields',
        fields: [
          { label: 'Please describe your previous personal or professional experience handling, caring for, or training animals', type: 'textarea', width: 'full' },
          { 
            label: 'What experiences have you had working with animal shelters or rescues in the past? (Check all that apply)', 
            type: 'checkbox', 
            options: ['I am a brand new volunteer to animal rescue work', 'I have volunteered at a shelter/rescue facility before', 'I have fostered animals for another organization before'], 
            width: 'full' 
          },
          { label: 'If you have fostered for other organizations, please list their name(s)', type: 'text', width: 'full' },
          { 
            label: 'Feline Foster Preferences (Check all you are willing and comfortable hosting)', 
            type: 'checkbox', 
            options: ['Neonatal Kittens (0-4 weeks old)', 'Older Kittens (4-10 weeks old)', 'Pregnant Queen (Mother cat)', 'Nursing Mother Cat & Litter', 'Adult Cat', 'Senior Cat'],
            width: 'full' 
          },
          { 
            label: 'Canine Foster Preferences (Check all you are willing and comfortable hosting)', 
            type: 'checkbox', 
            options: ['Neonatal Puppies (0-4 weeks old)', 'Older Puppies (4-10 weeks old)', 'Pregnant Dam (Mother dog)', 'Nursing Mother Dog & Litter', 'Adult Dog', 'Senior Dog'],
            width: 'full' 
          },
          { 
            label: 'Specialized Medical/Behavioral Capabilities (Check all you can host)', 
            type: 'checkbox', 
            options: [
              'Animals recovering from major surgery or injuries',
              'Animals undergoing treatment for minor illnesses (e.g. URI, shelter colds)',
              'Animals undergoing treatment for highly contagious conditions (e.g. Ringworm)',
              'Animals requiring intensive behavioral modification (reactivity, extreme fear, severe lack of socialization)'
            ],
            width: 'full' 
          },
          { label: 'Are there any specific behaviors, medical conditions, or traits that you are strictly unwilling/unable to handle?', type: 'textarea', width: 'full' },
          { label: 'Please share any additional information, special skills (subcutaneous fluids, bottle feeding, vet background), or context', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Part 5: Character & Personal References',
        type: 'fields',
        fields: [
          { label: '[REF 1] Full Name & Relationship to You', type: 'text', width: 'half' },
          { label: '[REF 1] Phone Number & Email Address', type: 'text', width: 'half' },
          { label: '[REF 2] Full Name & Relationship to You', type: 'text', width: 'half' },
          { label: '[REF 2] Phone Number & Email Address', type: 'text', width: 'half' }
        ]
      }
    ],
    legalClauses: [
      'Information Accuracy: I affirm and certify that all information and answers provided in this application are completely true, correct, and complete to the best of my knowledge.',
      'Behavioral Behavior Disclaimer: I understand that the organization cannot make any definitive promises or representations regarding a foster animal\'s temperament or behavior. I recognize that new, unpredicted behaviors may manifest once the animal transitions into a home environment.',
      'Operational Compliance: I agree to strictly abide by the rules, policies, and veterinary regulations established by the organization for every single foster animal I take in. This includes following isolation, feeding, medication, and leash-only protocols.',
      'Falsification Clause: I understand that providing false or misleading statements will result in immediate disqualification from the volunteer program and the immediate removal of any foster animals from my home.'
    ]
  },
  {
    id: 'foster-agreement',
    title: 'Foster Caregiver Agreement',
    description: 'A contract defining the legal terms, care requirements, and liability boundaries between the foster caregiver and the rescue.',
    notice: [
      'This agreement is a legally binding contract between the Rescue Organization and the Volunteer Foster Caregiver.',
      'All foster animals placed in your home remain the sole legal property of the organization. Fostering is a voluntary arrangement, and the organization may request the return of any animal at any time.'
    ],
    sections: [
      {
        title: 'Section 1: Legal Ownership & Right to Reclaim',
        type: 'text',
        paragraphs: [
          '1.1 Legal Ownership: The foster caregiver agrees that all animals placed in their custody are the sole and exclusive property of the rescue organization. The caregiver acquires no ownership rights, title, or interest in any foster animal.',
          '1.2 Return of Animal: The foster caregiver agrees to return the foster animal immediately upon the request of the organization\'s director or foster coordinator. The organization reserves the absolute right to remove any foster animal from the caregiver\'s home at any time, with or without cause.'
        ]
      },
      {
        title: 'Section 2: Care Standards & Daily Management',
        type: 'text',
        paragraphs: [
          '2.1 Standard of Care: The foster caregiver agrees to provide the animal with adequate food, fresh water, safe and clean indoor shelter, regular exercise, and affectionate care. The animal must sleep indoors at all times.',
          '2.2 Leash & Containment: Foster animals must be kept under complete control at all times. Dogs must be kept on a leash when outdoors in unsecured areas. They are strictly prohibited from off-leash dog parks. Cats must be kept strictly indoors unless being transported inside a secure carrier.',
          '2.3 Compliance with Local Laws: The caregiver agrees to comply with all local ordinances, animal control laws, licensing, and vaccination requirements.'
        ]
      },
      {
        title: 'Section 3: Medical Treatment Protocols',
        type: 'text',
        paragraphs: [
          '3.1 Prior Authorization Required: The organization is responsible for the veterinary expenses of foster animals, provided that ALL medical visits and treatments are pre-authorized by the organization\'s medical director or foster coordinator.',
          '3.2 Unauthorized Veterinary Care: If the foster caregiver takes the animal to a veterinarian or administers medications without prior approval, the caregiver agrees to assume 100% of the financial responsibility for those medical bills.',
          '3.3 Medical Emergency Protocol: In the event of a life-threatening medical emergency, the caregiver must immediately contact the emergency coordinator at the phone number provided and proceed to an approved emergency veterinary partner.'
        ]
      },
      {
        title: 'Section 4: Adoption & Public Relations',
        type: 'text',
        paragraphs: [
          '4.1 Promotion and Events: The foster caregiver agrees to assist in promoting the foster pet for adoption, which includes taking high-quality photos, writing biography updates, and transporting the animal to scheduled adoption events.',
          '4.2 No Self-Adoption Without Approval: The caregiver agrees that they cannot personally adopt or transfer custody of the foster animal to another person without completing the standard adoption application, passing the screening process, and paying the designated adoption fee.'
        ]
      },
      {
        title: 'Section 5: Liability Waiver & Release',
        type: 'text',
        paragraphs: [
          '5.1 Assumption of Risk: The caregiver acknowledges that animals can behave unpredictably and that the organization makes no claims or guarantees regarding the behavior, health, or temperament of any foster animal.',
          '5.2 Release & Indemnification: The caregiver hereby releases, waives, and holds harmless the rescue organization, its board of directors, officers, agents, and volunteers from any and all liability, claims, or demands for personal injury, sickness, or death, as well as property damage and expenses, of any nature, occurring during the course of the fostering arrangement.',
          '5.3 Resident Animal Safety: The caregiver understands that there is an inherent risk of disease transmission between foster animals and resident pets. The caregiver agrees to hold the organization harmless if a resident pet contracts an illness from a foster animal.'
        ]
      }
    ],
    legalClauses: [
      'I have read this agreement in its entirety, understand all of its terms, and sign it voluntarily.',
      'I agree to strictly abide by all terms of this agreement and any guidelines provided by the organization.',
      'Volunteer Foster Caregiver\'s Digital Signature: [Text]',
      'Rescue Representative\'s Digital Signature: [Text]',
      'Date: [Date]'
    ]
  },
  {
    id: 'foster-checklist',
    title: 'Foster Home Safety Checklist',
    description: 'A pre-placement inspection checklist to ensure a foster home is properly prepared, secured, and safe for a rescue animal.',
    notice: [
      'This checklist is designed to help foster volunteers inspect and secure their home before welcoming a foster pet.',
      'Fosters should review each section, check off items that are completed, and resolve any safety concerns prior to the arrival of the animal.'
    ],
    sections: [
      {
        title: '1. Food, Bowls & Gear Preparation',
        type: 'fields',
        fields: [
          { label: 'Clean food and water bowls placed in a low-traffic area', type: 'checkbox', options: ['Ready'], width: 'full' },
          { label: 'Species and age-appropriate food purchased and stored in airtight containers', type: 'checkbox', options: ['Ready'], width: 'full' },
          { label: 'Appropriately-sized crate or gated playpen set up and ready', type: 'checkbox', options: ['Ready'], width: 'full' },
          { label: 'Comfortable bedding (washable towels or dog bed) placed in crate/playpen', type: 'checkbox', options: ['Ready'], width: 'full' },
          { label: 'Secure collar, martingale collar, or harness ready for use', type: 'checkbox', options: ['Ready'], width: 'full' },
          { label: 'Standard 4-to-6 foot leash (non-retractable) ready for walks', type: 'checkbox', options: ['Ready'], width: 'full' }
        ]
      },
      {
        title: '2. Indoor Safety & Pet-Proofing',
        type: 'fields',
        fields: [
          { label: 'Household cleaning chemicals, detergents, and bleach locked in high cabinets', type: 'checkbox', options: ['Secured'], width: 'full' },
          { label: 'Human medications, vitamins, and first aid supplies stored safely out of reach', type: 'checkbox', options: ['Secured'], width: 'full' },
          { label: 'Electrical cords tucked behind furniture or covered with cord protectors', type: 'checkbox', options: ['Secured'], width: 'full' },
          { label: 'Trash bins equipped with secure, locking lids or stored inside cabinets', type: 'checkbox', options: ['Secured'], width: 'full' },
          { label: 'Small items (hair ties, rubber bands, kids toys, coins) picked up off the floors', type: 'checkbox', options: ['Secured'], width: 'full' },
          { label: 'Window screens inspected and confirmed to be tight-fitting and tear-free', type: 'checkbox', options: ['Secured'], width: 'full' }
        ]
      },
      {
        title: '3. Toxic Foods & Plants Check',
        type: 'fields',
        fields: [
          { label: 'No toxic indoor plants (e.g. Lilies, Sago Palms, Pothos, Aloe Vera) accessible to pets', type: 'checkbox', options: ['Verified'], width: 'full' },
          { label: 'Toxic foods (e.g. Chocolate, Grapes, Onions, Garlic, Xylitol/artificial sweetener) stored in high pantries', type: 'checkbox', options: ['Verified'], width: 'full' },
          { label: 'Lawn care chemicals, pesticides, and automotive antifreeze stored in a sealed garage or shed', type: 'checkbox', options: ['Verified'], width: 'full' }
        ]
      },
      {
        title: '4. Yard & Outdoor Safety (If Applicable)',
        type: 'fields',
        fields: [
          { label: 'Fence boards inspected for rot, damage, or loose panels', type: 'checkbox', options: ['Checked'], width: 'full' },
          { label: 'Checked perimeter along the bottom of the fence line for holes, gaps, or digging spots', type: 'checkbox', options: ['Checked'], width: 'full' },
          { label: 'Gates equipped with secure self-latching locks or paddocks', type: 'checkbox', options: ['Checked'], width: 'full' },
          { label: 'Removed any hazardous debris, scrap metal, tools, or sharp objects from the yard area', type: 'checkbox', options: ['Checked'], width: 'full' }
        ]
      },
      {
        title: '5. Resident Pets & Isolation Planning',
        type: 'fields',
        fields: [
          { label: 'Separate quarantine room (e.g. spare bathroom, laundry room) prepared for the first 7-14 days', type: 'checkbox', options: ['Plan Set'], width: 'full' },
          { label: 'All resident household pets are fully up to date on Rabies and core vaccinations', type: 'checkbox', options: ['Plan Set'], width: 'full' },
          { label: 'Litter box for foster cat/kittens placed completely out of reach of resident dogs', type: 'checkbox', options: ['Plan Set'], width: 'full' }
        ]
      }
    ],
    legalClauses: [
      'Foster Volunteer Signature: _____________________________________',
      'Date: ________________________'
    ]
  },
  {
    id: 'medical-log',
    title: 'Foster Pet Medical & Vaccine Log',
    description: 'A medical tracker log to record a foster animal\'s vaccines, microchip, spay/neuter details, and treatments in one place.',
    notice: [
      'This document should remain with the foster pet\'s file and be updated immediately following any veterinary visits, vaccine administration, or parasite treatments.',
      'A copy of this log must be returned to the rescue coordinator upon the animal\'s adoption.'
    ],
    sections: [
      {
        title: 'Animal Profile Information',
        type: 'fields',
        fields: [
          { label: 'Foster Animal Name', type: 'text', width: 'half' },
          { label: 'Species (Dog, Cat, etc.)', type: 'text', width: 'half' },
          { label: 'Breed / Primary Mix', type: 'text', width: 'half' },
          { label: 'Estimated Age or DOB', type: 'text', width: 'half' },
          { label: 'Sex (Male / Female)', type: 'radio', options: ['Male', 'Female'], width: 'half' },
          { label: 'Spayed / Neutered Status', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Microchip ID Number', type: 'text', width: 'half' },
          { label: 'Rescue Intake Date', type: 'date', width: 'half' },
          { label: 'Primary Foster Parent Name', type: 'text', width: 'full' }
        ]
      },
      {
        title: '1. Vaccination Administration Log',
        type: 'fields',
        fields: [
          {
            label: 'Vaccine Administration Record',
            type: 'table',
            tableHeaders: ['Vaccine Name (DHPP, FVRCP, Rabies, etc.)', 'Date Administered', 'Expiration / Next Due Date', 'Administered By (Vet/Clinic Name)'],
            tableRows: [
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', '']
            ],
            width: 'full'
          }
        ]
      },
      {
        title: '2. Dewormer & Parasite Preventatives Log',
        type: 'fields',
        fields: [
          {
            label: 'Parasite Treatment Record',
            type: 'table',
            tableHeaders: ['Treatment Date', 'Medication Name (Strongid, Heartgard, Nexgard, etc.)', 'Dosage Given', 'Administered By (Name)'],
            tableRows: [
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', '']
            ],
            width: 'full'
          }
        ]
      },
      {
        title: '3. Veterinary Visits & Special Treatments Log',
        type: 'fields',
        fields: [
          {
            label: 'Veterinary Visits Record',
            type: 'table',
            tableHeaders: ['Visit Date', 'Clinic / Vet Name', 'Reason for Visit (Sickness, Spay/Neuter, Checkup)', 'Treatments, Diagnostics & Medications Prescribed'],
            tableRows: [
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', '']
            ],
            width: 'full'
          }
        ]
      }
    ],
    legalClauses: [
      'Rescue Medical Coordinator Signature: _____________________________________',
      'Date of Final Log Audit: ________________________'
    ]
  },
  {
    id: 'cat-surrender',
    title: 'Cat Surrender Profile & Agreement',
    description: 'Cat intake survey for owners surrendering a cat to gather history, behaviors, medical notes, and sign ownership release.',
    notice: [
      'Surrenders are accepted by appointment only. Please contact the shelter prior to arrival.',
      'Undesirable behaviors and medical issues do not necessarily prevent placement; however, failure to disclose them does. Complete and honest answers are required for the safety of the animal and handlers.'
    ],
    sections: [
      {
        title: 'Part 1: Owner Contact Profile',
        type: 'fields',
        fields: [
          { label: 'Date of Surrender', type: 'date', width: 'half' },
          { label: 'Owner Full Name', type: 'text', width: 'half' },
          { label: 'Primary Phone Number', type: 'phone', width: 'half' },
          { label: 'Alternate Phone Number', type: 'phone', width: 'half' },
          { label: 'Physical Street Address', type: 'text', width: 'full' },
          { label: 'City, State, Zip', type: 'text', width: 'half' },
          { label: 'Mailing Address (if different)', type: 'text', width: 'full' },
          { label: 'Email Address', type: 'email', width: 'full' },
          { label: 'Has this cat bitten any human or other animal in the last 10 days?', type: 'radio', options: ['No', 'Yes (If yes, please explain below)'], width: 'full' },
          { label: 'Has this cat ever bitten any human or other animal and broken skin?', type: 'radio', options: ['No', 'Yes'], width: 'full' }
        ]
      },
      {
        title: 'Part 2: Cat Profile Information',
        type: 'fields',
        fields: [
          { label: 'Cat Name', type: 'text', width: 'half' },
          { label: 'Breed / Description', type: 'text', width: 'half' },
          { label: 'Age', type: 'text', width: 'third' },
          { label: 'Color / Markings', type: 'text', width: 'third' },
          { label: 'Sex', type: 'radio', options: ['Male', 'Female'], width: 'third' },
          { label: 'Spayed / Neutered Status', type: 'radio', options: ['Yes', 'No', 'Unknown'], width: 'half' },
          { label: 'Where did you acquire this cat?', type: 'radio', options: ['Breeder', 'Rescue/Shelter', 'Family/Friend', 'Born in Home', 'This Shelter'], width: 'half' },
          { label: 'Name & Location of other rescue/shelter (if applicable)', type: 'text', width: 'full' },
          { label: 'Is the cat microchipped?', type: 'radio', options: ['Yes', 'No', 'Unknown'], width: 'half' },
          { label: 'How long have you owned this cat?', type: 'text', width: 'half' },
          { label: 'Is this cat declawed?', type: 'radio', options: ['No', 'Yes - Front claws only', 'Yes - All four paws'], width: 'full' }
        ]
      },
      {
        title: 'Part 3: Social & Living History',
        type: 'fields',
        fields: [
          { label: 'Lived with (check all that apply)', type: 'checkbox', options: ['Men', 'Women', 'Children', 'Dogs', 'Other cats', 'Other pets'], width: 'full' },
          { label: 'If lived with children, please specify ages', type: 'text', width: 'half' },
          { label: 'If lived with dogs, specify quantity and breeds', type: 'text', width: 'half' },
          { label: 'If lived with other cats, specify quantity and ages', type: 'text', width: 'half' },
          { label: 'If lived with other animals, explain interactions', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Part 4: Environment, Behaviors & Litter Box Habits',
        type: 'fields',
        fields: [
          { label: 'Where does the cat spend most of the day?', type: 'text', width: 'half' },
          { label: 'Does this cat spend time outdoors?', type: 'radio', options: ['No', 'Yes - Supervised', 'Yes - Free roaming'], width: 'half' },
          { label: 'How long is the cat left alone on an average day?', type: 'text', width: 'full' },
          { label: 'Does this cat exhibit any behavioral issues?', type: 'radio', options: ['No', 'Yes'], width: 'full' },
          { 
            label: 'Behavioral Checklist (check all that apply)', 
            type: 'checkbox', 
            options: ['Scratch Furniture', 'Chew Plants', 'Chew Electrical Cords', 'Chew Other Items', 'Jumps on Counters', 'Spraying', 'Escapes Outside', 'Climbs Curtains'], 
            width: 'full' 
          },
          { label: 'Aggression notes (if applicable)', type: 'textarea', width: 'full' },
          { 
            label: 'Cat Personality Traits (check all that apply)', 
            type: 'checkbox', 
            options: ['Very Active', 'Likes to talk', 'Likes being held', 'Outgoing', 'Curious', 'Independent', 'Playful', 'Affectionate', 'Quiet', 'Lazy', 'Shy', 'Friendly to visitors', 'Great Mouser', 'Lap Cat', 'Gentle'], 
            width: 'full' 
          },
          { label: 'How does the cat react to strangers?', type: 'text', width: 'full' },
          { label: 'Does this cat consistently use a litter box?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], width: 'half' },
          { label: 'If "Sometimes" or "No", specify frequency of accidents', type: 'text', width: 'half' },
          { label: 'How many litter boxes does the cat have access to?', type: 'text', width: 'third' },
          { label: 'Have you recently changed the brand/type of litter?', type: 'radio', options: ['No', 'Yes'], width: 'third' },
          { label: 'Details of litter changed (previous vs current)', type: 'text', width: 'third' }
        ]
      },
      {
        title: 'Part 5: Veterinary History & Care',
        type: 'fields',
        fields: [
          { label: 'Did the cat receive routine veterinary care (at least once a year)?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Veterinarian / Clinic Name', type: 'text', width: 'half' },
          { label: 'Does the cat have any current or historical health conditions?', type: 'textarea', width: 'full' },
          { label: 'Has the cat had any serious injuries or surgeries?', type: 'textarea', width: 'full' },
          { 
            label: 'Current Medications', 
            type: 'table', 
            tableHeaders: ['Medication Name', 'Dosage / Amount', 'Frequency'], 
            tableRows: [['', '', ''], ['', '', ''], ['', '', '']], 
            width: 'full' 
          },
          { label: 'Allows nail clipping?', type: 'radio', options: ['Yes', 'No'], width: 'third' },
          { label: 'Likes to be bathed?', type: 'radio', options: ['Yes', 'No'], width: 'third' },
          { label: 'Likes to be brushed?', type: 'radio', options: ['Yes', 'No'], width: 'third' },
          { label: 'Prefers a specific brand/type of food?', type: 'text', width: 'full' }
        ]
      }
    ],
    legalClauses: [
      'Surrender Fee: A standard surrender fee of $25.00 applies per pet.',
      'Reason for Surrender: Please explain in detail why you wish to surrender your cat: ___________________________________________________________________________________________________',
      'Ownership Transfer Clause: You agree that you, your spouse, and/or any co-owner of the cat described on this form are irrevocably transferring and relinquishing legal ownership of said cat on the date of surrender/acceptance. This gives the rescue organization complete authority to take whatever actions in our sole judgment are necessary and in the best interest of the cat.',
      'Signature of Owner: [Text]',
      'Co-Owner Signature (if applicable): [Text]',
      'Date: [Date]'
    ]
  },
  {
    id: 'dog-surrender',
    title: 'Dog Surrender Profile & Agreement',
    description: 'Dog intake survey for owners surrendering a dog to gather history, behaviors, resource guarding, and sign ownership release.',
    notice: [
      'Surrenders are accepted by appointment only. Please contact the shelter prior to arrival.',
      'Undesirable behaviors and medical issues do not necessarily prevent placement; however, failure to disclose them does. Complete and honest answers are required for the safety of the animal and handlers.'
    ],
    sections: [
      {
        title: 'Part 1: Owner Contact Profile',
        type: 'fields',
        fields: [
          { label: 'Date of Surrender', type: 'date', width: 'half' },
          { label: 'Owner Full Name', type: 'text', width: 'half' },
          { label: 'Primary Phone Number', type: 'phone', width: 'half' },
          { label: 'Alternate Phone Number', type: 'phone', width: 'half' },
          { label: 'Physical Street Address', type: 'text', width: 'full' },
          { label: 'City, State, Zip', type: 'text', width: 'half' },
          { label: 'Mailing Address (if different)', type: 'text', width: 'full' },
          { label: 'Email Address', type: 'email', width: 'full' },
          { label: 'Has this dog bitten any human or other animal in the last 10 days?', type: 'radio', options: ['No', 'Yes (If yes, please explain below)'], width: 'full' },
          { label: 'Has this dog ever bitten any human or other animal and broken skin?', type: 'radio', options: ['No', 'Yes'], width: 'full' }
        ]
      },
      {
        title: 'Part 2: Dog Profile Information',
        type: 'fields',
        fields: [
          { label: 'Dog Name', type: 'text', width: 'half' },
          { label: 'Breed / Description', type: 'text', width: 'half' },
          { label: 'Age', type: 'text', width: 'third' },
          { label: 'Color / Markings', type: 'text', width: 'third' },
          { label: 'Sex', type: 'radio', options: ['Male', 'Female'], width: 'third' },
          { label: 'Spayed / Neutered Status', type: 'radio', options: ['Yes', 'No', 'Unknown'], width: 'half' },
          { label: 'Where did you acquire this dog?', type: 'radio', options: ['Breeder', 'Rescue/Shelter', 'Family/Friend', 'Born in Home', 'This Shelter'], width: 'half' },
          { label: 'Name & Location of other rescue/shelter (if applicable)', type: 'text', width: 'full' },
          { label: 'Is the dog microchipped?', type: 'radio', options: ['Yes', 'No', 'Unknown'], width: 'half' },
          { label: 'How long have you owned this dog?', type: 'text', width: 'half' },
          { label: 'Including yours, how many homes has this dog had?', type: 'text', width: 'full' }
        ]
      },
      {
        title: 'Part 3: Behavior, Training & Play Style',
        type: 'fields',
        fields: [
          { label: 'Is this dog housebroken?', type: 'radio', options: ['Yes', 'No', 'In Training'], width: 'half' },
          { label: 'If no: Urinates in Home?', type: 'radio', options: ['Daily', 'Occasionally', 'Never'], width: 'half' },
          { label: 'If no: Defecates in Home?', type: 'radio', options: ['Daily', 'Occasionally', 'Never'], width: 'half' },
          { label: 'Is this dog crate trained?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'If yes, how many hours in crate each day?', type: 'text', width: 'half' },
          { label: 'Is this dog destructive when left alone?', type: 'radio', options: ['No', 'Yes (If yes, check below)'], width: 'full' },
          { label: 'Destructive behaviors (check all that apply)', type: 'checkbox', options: ['Chews Furniture', 'Chews Woodwork/Doors', 'Chews Clothing/Shoes', 'Gets into Trash', 'Chews Toys/Stuffed Animals'], width: 'full' },
          { label: 'Is this dog protective or possessive (resource guards)? Check all:', type: 'checkbox', options: ['Food Bowl', 'Treats/Bones', 'Toys', 'Bed/Couch', 'Owner/People'], width: 'full' },
          { label: 'General behavior indicators (check all that apply)', type: 'checkbox', options: ['Attended Daycare', 'Goes to the Dog Park', 'Walks on a Leash', 'Rides well in the Car', 'Has Formal Training', 'Has Separation Anxiety', 'Has been in a Dog Fight', 'Enjoys Swimming'], width: 'full' },
          { label: 'Shows fear or aggression towards strangers/new things? (details)', type: 'text', width: 'full' },
          { label: 'Prone to eating foreign objects? (details)', type: 'text', width: 'full' },
          { label: 'Prone to digging? (details)', type: 'text', width: 'full' },
          { label: 'Tries to escape? (details)', type: 'text', width: 'full' },
          { label: 'Describe play style with other dogs (check all that apply)', type: 'checkbox', options: ['Likes to chase', 'Needs to be in charge', 'Shares toys/plays quietly', 'Barks Constantly'], width: 'full' },
          { label: 'Other behavior notes', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Part 4: Compatibility & Environment',
        type: 'fields',
        fields: [
          { label: 'Did this dog live with children in your home?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'If yes, what ages?', type: 'text', width: 'half' },
          { label: 'Would you recommend this dog to live with children or have them visit?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Why or why not?', type: 'text', width: 'half' },
          { label: 'List other household pets in the home', type: 'textarea', width: 'full' },
          { label: 'Would you recommend placing this dog with other dogs?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Explain dog compatibility', type: 'text', width: 'half' },
          { label: 'Would you recommend placing this dog with cats?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Explain cat compatibility', type: 'text', width: 'half' },
          { label: 'How was the dog confined to your property outside?', type: 'checkbox', options: ['Fenced Yard', 'Electronic Containment', 'Kennel / Enclosure', 'Dog House', 'Tether / Chain', 'Never unsupervised'], width: 'full' },
          { label: 'If fenced, fence height', type: 'text', width: 'half' },
          { label: 'Has this dog ever escaped its confinement?', type: 'radio', options: ['No', 'Yes (If yes, explain below)'], width: 'half' },
          { label: 'Explain escape methods if applicable', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Part 5: Veterinary History & Care',
        type: 'fields',
        fields: [
          { label: 'Did the dog receive routine veterinary care (at least once a year)?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Veterinarian / Clinic Name', type: 'text', width: 'half' },
          { 
            label: 'Health History Checklist (check all that apply)', 
            type: 'checkbox', 
            options: ['Ear Infections', 'Food Allergies', 'Skin Allergies', 'Parasites', 'Eye Infections', 'Bloat/Stomach Issues', 'Kennel Cough', 'Thyroid Disease', 'Arthritis', 'Hip Dysplasia', 'Chronic Infections', 'Tumors', 'Cancer', 'Cataracts', 'Seizures'], 
            width: 'full' 
          },
          { label: 'Explain any health issues checked above', type: 'textarea', width: 'full' },
          { label: 'Has the dog had any serious injuries or surgeries?', type: 'textarea', width: 'full' },
          { 
            label: 'Current Medications', 
            type: 'table', 
            tableHeaders: ['Medication Name', 'Dosage / Amount', 'Frequency'], 
            tableRows: [['', '', ''], ['', '', ''], ['', '', '']], 
            width: 'full' 
          },
          { label: 'Allows nail clipping?', type: 'radio', options: ['Yes', 'No'], width: 'third' },
          { label: 'Likes to be bathed?', type: 'radio', options: ['Yes', 'No'], width: 'third' },
          { label: 'Likes to be brushed?', type: 'radio', options: ['Yes', 'No'], width: 'third' },
          { label: 'Prefers a specific brand/type of food?', type: 'text', width: 'full' },
          { label: 'Is this dog fed any table scraps/human food?', type: 'radio', options: ['No', 'Yes (details below)'], width: 'half' },
          { label: 'Has this dog ever showed food aggression?', type: 'radio', options: ['No', 'Yes'], width: 'half' }
        ]
      }
    ],
    legalClauses: [
      'Surrender Fee: A standard surrender fee of $25.00 applies per pet.',
      'Reason for Surrender: Please explain in detail why you wish to surrender your dog: ___________________________________________________________________________________________________',
      'Ownership Transfer Clause: You agree that you, your spouse, and/or any co-owner of the dog described on this form are irrevocably transferring and relinquishing legal ownership of said dog on the date of surrender/acceptance. This gives the rescue organization complete authority to take whatever actions in our sole judgment are necessary and in the best interest of the dog.',
      'Signature of Owner: [Text]',
      'Co-Owner Signature (if applicable): [Text]',
      'Date: [Date]'
    ]
  },
  {
    id: 'cat-intake',
    title: 'Feline Intake Physical Exam Form',
    description: 'Intake and physical evaluation records for newly arriving cats and kittens.',
    notice: [
      'This form must be completed by an authorized evaluator immediately upon intake.',
      'Circle or check relevant symptoms and record precise weights and vaccine dates.'
    ],
    sections: [
      {
        title: 'Intake Metadata',
        type: 'fields',
        fields: [
          { label: 'Intake Date', type: 'date', width: 'half' },
          { label: 'Intake Evaluator Name', type: 'text', width: 'half' },
          { label: 'Animal ID Number', type: 'text', width: 'half' },
          { label: 'Location / Kennel Assignment', type: 'text', width: 'half' },
          { label: 'Overall Appearance', type: 'radio', options: ['BAR (Bright, Alert, Responsive)', 'QAR (Quiet, Alert, Responsive)', 'Fearful', 'Aggressive', 'Other'], width: 'full' },
          { label: 'Body Condition Score (BCS)', type: 'radio', options: ['1-3/9 (Underweight)', '4-5/9 (Ideal)', '6-9/9 (Overweight)'], width: 'full' }
        ]
      },
      {
        title: 'Animal Profile',
        type: 'fields',
        fields: [
          { label: 'Breed(s)', type: 'text', width: 'half' },
          { label: 'Color(s)', type: 'text', width: 'half' },
          { label: 'Approximate Age', type: 'text', width: 'third' },
          { label: 'Weight', type: 'text', width: 'third' },
          { label: 'Sex', type: 'radio', options: ['Male Intact', 'Male Neutered', 'Female Intact', 'Female Spayed', 'Unknown'], width: 'third' },
          { label: 'Altered Status Confirmed By', type: 'checkbox', options: ['Lack of Testicles', 'Surgical Scar', 'Surgical Tattoo'], width: 'full' },
          { label: 'Identifiers / Collars', type: 'text', width: 'full' },
          { label: 'Microchip Number', type: 'text', width: 'half' },
          { label: 'Implantation Date', type: 'date', width: 'half' }
        ]
      },
      {
        title: 'Physical Examination Details',
        type: 'fields',
        fields: [
          { label: 'Hydration Status', type: 'radio', options: ['No sign of dehydration', 'Signs of dehydration (explain below)'], width: 'full' },
          { label: 'Musculoskeletal System', type: 'radio', options: ['Normal', 'Lameness', 'Asymmetry', 'Worn Nails', 'Ingrown Nails', 'Declawed (Front/Back/Both)'], width: 'full' },
          { label: 'Skin & Coat Condition', type: 'checkbox', options: ['Normal', 'Fleas', 'Ticks', 'Hair Loss', 'Itching', 'Masses', 'Sores'], width: 'full' },
          { label: 'Ear Canal Condition', type: 'radio', options: ['Clean', 'Signs of Infection', 'Signs of Mites'], width: 'full' },
          { label: 'Eye Examination', type: 'checkbox', options: ['Clear', 'Discharge', 'Redness', 'Swelling'], width: 'full' },
          { label: 'Nose & Respiration', type: 'checkbox', options: ['Clean', 'Discharge', 'Sneezing', 'Coughing'], width: 'full' },
          { label: 'Oral & Dental Health', type: 'checkbox', options: ['Clean/Normal Gums', 'Moderate Dental Disease', 'Severe Dental Disease', 'Broken/Missing Teeth', 'Abnormal Gums', 'Oral Pain', 'Ulcers', 'Masses'], width: 'full' },
          { label: 'Other Significant Physical Exam Findings', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Vaccinations & Diagnostics Log',
        type: 'fields',
        fields: [
          { label: 'Rabies Vaccine Date', type: 'date', width: 'half' },
          { label: 'Rabies Batch / Manufacturer', type: 'text', width: 'half' },
          { label: 'FVRCP Vaccine Date', type: 'date', width: 'half' },
          { label: 'FVRCP Batch / Manufacturer', type: 'text', width: 'half' },
          { label: 'FeLV/FIV Test Date', type: 'date', width: 'half' },
          { label: 'FeLV/FIV Test Results', type: 'radio', options: ['Negative', 'Positive'], width: 'half' },
          { label: 'Dewormer Administration Date', type: 'date', width: 'half' },
          { label: 'Dewormer Medication Type/Brand', type: 'text', width: 'half' }
        ]
      }
    ],
    legalClauses: [
      'Evaluator Signature: _____________________________________',
      'Date completed: ________________________'
    ]
  },
  {
    id: 'dog-intake',
    title: 'Canine Intake Physical Exam Form',
    description: 'Intake and physical evaluation records for newly arriving dogs and puppies.',
    notice: [
      'This form must be completed by an authorized evaluator immediately upon intake.',
      'Circle or check relevant symptoms and record precise weights and vaccine dates.'
    ],
    sections: [
      {
        title: 'Intake Metadata',
        type: 'fields',
        fields: [
          { label: 'Intake Date', type: 'date', width: 'half' },
          { label: 'Intake Evaluator Name', type: 'text', width: 'half' },
          { label: 'Animal ID Number', type: 'text', width: 'half' },
          { label: 'Location / Kennel Assignment', type: 'text', width: 'half' },
          { label: 'Overall Appearance', type: 'radio', options: ['BAR (Bright, Alert, Responsive)', 'QAR (Quiet, Alert, Responsive)', 'Fearful', 'Aggressive', 'Other'], width: 'full' },
          { label: 'Body Condition Score (BCS)', type: 'radio', options: ['1-3/9 (Underweight)', '4-5/9 (Ideal)', '6-9/9 (Overweight)'], width: 'full' }
        ]
      },
      {
        title: 'Animal Profile',
        type: 'fields',
        fields: [
          { label: 'Breed(s)', type: 'text', width: 'half' },
          { label: 'Color(s)', type: 'text', width: 'half' },
          { label: 'Approximate Age', type: 'text', width: 'third' },
          { label: 'Weight', type: 'text', width: 'third' },
          { label: 'Sex', type: 'radio', options: ['Male Intact', 'Male Neutered', 'Female Intact', 'Female Spayed', 'Unknown'], width: 'third' },
          { label: 'Altered Status Confirmed By', type: 'checkbox', options: ['Lack of Testicles', 'Surgical Scar', 'Surgical Tattoo'], width: 'full' },
          { label: 'Identifiers / Collars', type: 'text', width: 'full' },
          { label: 'Microchip Number', type: 'text', width: 'half' },
          { label: 'Implantation Date', type: 'date', width: 'half' }
        ]
      },
      {
        title: 'Physical Examination Details',
        type: 'fields',
        fields: [
          { label: 'Hydration Status', type: 'radio', options: ['No sign of dehydration', 'Signs of dehydration (explain below)'], width: 'full' },
          { label: 'Musculoskeletal System', type: 'radio', options: ['Normal', 'Lameness', 'Asymmetry', 'Worn Nails', 'Ingrown Nails'], width: 'full' },
          { label: 'Skin & Coat Condition', type: 'checkbox', options: ['Normal', 'Fleas', 'Ticks', 'Hair Loss', 'Itching', 'Masses', 'Sores'], width: 'full' },
          { label: 'Ear Canal Condition', type: 'radio', options: ['Clean', 'Signs of Infection', 'Signs of Mites'], width: 'full' },
          { label: 'Eye Examination', type: 'checkbox', options: ['Clear', 'Discharge', 'Redness', 'Swelling'], width: 'full' },
          { label: 'Nose & Respiration', type: 'checkbox', options: ['Clean', 'Discharge', 'Sneezing', 'Coughing'], width: 'full' },
          { label: 'Oral & Dental Health', type: 'checkbox', options: ['Clean/Normal Gums', 'Moderate Dental Disease', 'Severe Dental Disease', 'Broken/Missing Teeth', 'Abnormal Gums', 'Oral Pain', 'Ulcers', 'Masses'], width: 'full' },
          { label: 'Other Significant Physical Exam / Behavior Findings', type: 'textarea', width: 'full' }
        ]
      },
      {
        title: 'Vaccinations & Diagnostics Log',
        type: 'fields',
        fields: [
          { label: 'Rabies Vaccine Date', type: 'date', width: 'half' },
          { label: 'Rabies Batch / Manufacturer', type: 'text', width: 'half' },
          { label: 'DA2PP Vaccine Date', type: 'date', width: 'half' },
          { label: 'DA2PP Batch / Manufacturer', type: 'text', width: 'half' },
          { label: 'Bordetella Vaccine Date', type: 'date', width: 'half' },
          { label: 'Bordetella Batch / Manufacturer', type: 'text', width: 'half' },
          { label: 'Heartworm Test Date', type: 'date', width: 'half' },
          { label: 'Heartworm Test Results', type: 'radio', options: ['Negative', 'Positive'], width: 'half' },
          { label: 'Dewormer Administration Date', type: 'date', width: 'half' },
          { label: 'Dewormer Medication Type/Brand', type: 'text', width: 'half' }
        ]
      }
    ],
    legalClauses: [
      'Evaluator Signature: _____________________________________',
      'Date completed: ________________________'
    ]
  },

  // ── ADOPTION CONTRACT ──────────────────────────────────────────────────────
  {
    id: 'adoption-contract',
    title: 'Adoption Contract & Agreement',
    description: 'The binding legal contract signed at the time of adoption — covers care requirements, return policy, no-transfer clause, and liability.',
    notice: [
      'This is a legally binding contract between the Rescue Organization and the Adopter. Please read every section carefully before signing.',
      'The organization reserves the right to reclaim any animal if the terms of this agreement are violated.'
    ],
    generalReqs: [
      'Adopter must be at least 18 years of age and present a valid government-issued photo ID at time of signing.',
      'All members of the household must be aware of and agree to the terms of this contract.',
      'This contract supersedes any verbal representations made prior to signing.'
    ],
    sections: [
      {
        title: 'Part 1: Animal & Adoption Information',
        type: 'fields',
        fields: [
          { label: 'Animal Name', type: 'text', width: 'half' },
          { label: 'Species', type: 'radio', options: ['Dog', 'Cat', 'Other'], width: 'half' },
          { label: 'Breed / Mix', type: 'text', width: 'half' },
          { label: 'Approximate Age', type: 'text', width: 'half' },
          { label: 'Sex', type: 'radio', options: ['Male', 'Female'], width: 'half' },
          { label: 'Altered (Spayed / Neutered)?', type: 'radio', options: ['Yes — already altered', 'No — spay/neuter required per contract'], width: 'half' },
          { label: 'Microchip Number (if already chipped)', type: 'text', width: 'half' },
          { label: 'Adoption Date', type: 'date', width: 'half' },
          { label: 'Adoption Fee Paid ($)', type: 'text', width: 'half' },
          { label: 'Payment Method', type: 'radio', options: ['Cash', 'Check', 'Card', 'Venmo / PayPal', 'Waived'], width: 'half' },
        ]
      },
      {
        title: 'Part 2: Adopter Information',
        type: 'fields',
        fields: [
          { label: 'Adopter Full Legal Name', type: 'text', width: 'full' },
          { label: 'Co-Adopter Full Name (if applicable)', type: 'text', width: 'full' },
          { label: 'Home Address', type: 'text', width: 'full' },
          { label: 'City, State, ZIP', type: 'text', width: 'half' },
          { label: 'Primary Phone', type: 'phone', width: 'half' },
          { label: 'Email Address', type: 'email', width: 'half' },
          { label: 'Driver\'s License / ID Number', type: 'text', width: 'half' },
          { label: 'Renting or Owning residence?', type: 'radio', options: ['Own', 'Rent', 'Other'], width: 'half' },
          { label: 'If renting: Does landlord permit this pet? (attach written approval if required)', type: 'radio', options: ['Yes', 'No', 'Not Applicable'], width: 'half' },
        ]
      },
      {
        title: 'Section 1: Care & Responsibility Standards',
        type: 'text',
        paragraphs: [
          'The Adopter agrees to provide the animal with adequate food, fresh water, shelter, exercise, veterinary care, and affection for the duration of the animal\'s life.',
          'The animal will be kept as a house pet and companion animal, not as a yard dog, guard dog, or outdoor-only animal.',
          'The Adopter agrees to keep the animal secured (leashed in public, fenced yard or leash at all times outdoors) and to never allow the animal to roam freely without supervision.',
          'The animal will not be left chained, tethered, or otherwise restrained in an inhumane manner.',
          'The Adopter agrees to maintain all required vaccinations and provide annual wellness veterinary care for the duration of the animal\'s life.',
        ]
      },
      {
        title: 'Section 2: Spay / Neuter Requirement',
        type: 'text',
        paragraphs: [
          'If the animal has NOT been spayed or neutered at the time of adoption, the Adopter agrees to have the procedure performed by a licensed veterinarian within 60 days of the adoption date, unless otherwise noted in writing by the organization.',
          'The Adopter agrees to provide written veterinary confirmation of the completed procedure to the organization upon request.',
          'Failure to comply with this requirement is grounds for immediate reclaim of the animal at the organization\'s sole discretion without refund of adoption fees.',
        ]
      },
      {
        title: 'Section 3: No-Transfer & No-Resell Clause',
        type: 'text',
        paragraphs: [
          'The Adopter agrees NOT to sell, give away, transfer, rehome, or otherwise relinquish the animal to any other individual, rescue, shelter, or organization without first notifying and obtaining written approval from the rescue organization.',
          'If the Adopter is unable to keep the animal for any reason at any point during the animal\'s life, the Adopter must contact the organization FIRST. The organization retains the right of first refusal to take the animal back.',
          'Transferring the animal to any third party without the organization\'s prior written consent is a direct violation of this contract and may result in legal action.',
        ]
      },
      {
        title: 'Section 4: Return Policy',
        type: 'text',
        paragraphs: [
          'The Adopter may return the animal to the organization at any time if they are unable to provide adequate care, subject to the no-transfer clause above.',
          'Adoption fees are non-refundable.',
          'The organization reserves the right to request the animal\'s return if the terms of this agreement are believed to have been violated. The Adopter agrees to surrender the animal promptly upon such request.',
          'The organization is not responsible for any costs incurred by the Adopter (veterinary, boarding, transport) prior to or during the return process.',
        ]
      },
      {
        title: 'Section 5: Liability Waiver & Indemnification',
        type: 'text',
        paragraphs: [
          'The Adopter assumes full legal and financial responsibility for the animal from the moment of adoption, including any property damage, personal injury, or veterinary costs incurred.',
          'The Rescue Organization shall not be held liable for any injury to persons, animals, or property caused by the adopted animal after the date of adoption.',
          'The Adopter agrees to indemnify, defend, and hold harmless the Rescue Organization and its officers, directors, volunteers, and agents from any and all claims, damages, or expenses arising from the animal\'s behavior or care after adoption.',
        ]
      },
      {
        title: 'Part 3: Acknowledgment & Signatures',
        type: 'fields',
        fields: [
          { label: 'I have read, understood, and agree to all terms of this Adoption Contract', type: 'radio', options: ['Yes, I agree'], width: 'full' },
          { label: 'Adopter Printed Name', type: 'text', width: 'half' },
          { label: 'Date', type: 'date', width: 'half' },
          { label: 'Adopter Signature', type: 'text', placeholder: 'Sign above or print name and date', width: 'half' },
          { label: 'Co-Adopter Signature (if applicable)', type: 'text', placeholder: 'Sign above or print name and date', width: 'half' },
          { label: 'Organization Representative Name', type: 'text', width: 'half' },
          { label: 'Representative Signature', type: 'text', width: 'half' },
        ]
      }
    ],
    legalClauses: [
      'By signing below, the Adopter acknowledges they have read, understand, and voluntarily agree to all terms and conditions stated in this Adoption Contract.',
      'This contract is effective as of the adoption date listed above and remains binding for the lifetime of the animal.',
      'Adopter Signature: _____________________________________   Date: __________________',
      'Co-Adopter Signature: _____________________________________   Date: __________________',
      'Organization Representative: _____________________________________   Date: __________________',
    ]
  },

  // ── VOLUNTEER APPLICATION ──────────────────────────────────────────────────
  {
    id: 'volunteer-app',
    title: 'Rescue Volunteer Application',
    description: 'Application for general rescue volunteers — event helpers, transport drivers, admin support, social media, fostering coordinators, and more.',
    notice: [
      'Completion of this application does not guarantee a volunteer position. All applicants are subject to review.',
      'Volunteers under 18 must have a parent or legal guardian co-sign this application.',
      'A background check authorization may be required for roles involving direct animal handling, home visits, or access to sensitive records.'
    ],
    generalReqs: [
      'Volunteers must be at least 16 years of age (18+ for unsupervised animal handling or transport roles).',
      'All volunteers must attend an orientation or onboarding session before beginning their first shift.',
      'Volunteers are expected to adhere to the organization\'s Code of Conduct, confidentiality policy, and social media guidelines.'
    ],
    sections: [
      {
        title: 'Part 1: Personal & Contact Information',
        type: 'fields',
        fields: [
          { label: 'First Name, MI, Last Name', type: 'text', width: 'full' },
          { label: 'Date of Birth', type: 'date', width: 'half' },
          { label: 'Pronouns (optional)', type: 'text', width: 'half' },
          { label: 'Email Address', type: 'email', width: 'half' },
          { label: 'Cell / Primary Phone', type: 'phone', width: 'half' },
          { label: 'Does your phone accept text messages?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Home Address', type: 'text', width: 'full' },
          { label: 'City, State, ZIP', type: 'text', width: 'half' },
          { label: 'How did you hear about us?', type: 'radio', options: ['Social Media', 'Friend / Family Referral', 'Website', 'Adoption Event', 'Other'], width: 'half' },
        ]
      },
      {
        title: 'Part 2: Emergency Contact',
        type: 'fields',
        fields: [
          { label: 'Emergency Contact Name', type: 'text', width: 'half' },
          { label: 'Relationship to Volunteer', type: 'text', width: 'half' },
          { label: 'Emergency Contact Phone', type: 'phone', width: 'half' },
          { label: 'Emergency Contact Email', type: 'email', width: 'half' },
          { label: 'Medical allergies or conditions we should be aware of in an emergency', type: 'textarea', width: 'full' },
        ]
      },
      {
        title: 'Part 3: Availability & Commitment',
        type: 'fields',
        fields: [
          { label: 'Available days (check all that apply)', type: 'checkbox', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], width: 'full' },
          { label: 'Preferred time of day', type: 'checkbox', options: ['Early Morning (before 9am)', 'Morning (9am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (after 5pm)', 'Flexible / Any'], width: 'full' },
          { label: 'How many hours per week can you commit?', type: 'radio', options: ['1–3 hours', '4–6 hours', '7–10 hours', '10+ hours', 'Event-only / as needed'], width: 'half' },
          { label: 'Do you have reliable transportation?', type: 'radio', options: ['Yes — own vehicle', 'Yes — public transit', 'No'], width: 'half' },
          { label: 'Are you willing to transport animals?', type: 'radio', options: ['Yes', 'No', 'Open to it with training'], width: 'half' },
          { label: 'Do you have a valid driver\'s license?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'Can you commit to at least 3 months of regular volunteering?', type: 'radio', options: ['Yes', 'No — I\'m interested in one-time or event opportunities only'], width: 'full' },
        ]
      },
      {
        title: 'Part 4: Volunteer Role Interests',
        type: 'fields',
        fields: [
          { label: 'Which volunteer roles interest you? (check all that apply)', type: 'checkbox', options: [
            'Adoption Event Setup & Staffing',
            'Animal Transport (vet runs, transfer drives)',
            'Foster Coordination & Support',
            'Photography / Content Creation',
            'Social Media & Marketing',
            'Fundraising & Grant Writing',
            'Administrative / Data Entry',
            'Home Visit Evaluations',
            'Foster (caring for an animal in my home)',
            'Community Outreach & Tabling',
            'Board / Committee Participation',
            'Other'
          ], width: 'full' },
          { label: 'If "Other," please describe the role or skills you can offer', type: 'textarea', width: 'full' },
        ]
      },
      {
        title: 'Part 5: Animal Experience & Household',
        type: 'fields',
        fields: [
          { label: 'Do you currently own pets?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'If yes, list species and number', type: 'text', placeholder: 'e.g. 2 dogs, 1 cat', width: 'half' },
          { label: 'Rate your comfort level handling dogs', type: 'radio', options: ['Very comfortable', 'Comfortable', 'Some experience', 'Little experience', 'None'], width: 'half' },
          { label: 'Rate your comfort level handling cats', type: 'radio', options: ['Very comfortable', 'Comfortable', 'Some experience', 'Little experience', 'None'], width: 'half' },
          { label: 'Have you ever worked with fearful, shy, or reactive animals?', type: 'radio', options: ['Yes — frequently', 'Yes — occasionally', 'No, but willing to learn'], width: 'half' },
          { label: 'Do you have any animal care, veterinary, or training background?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'If yes, briefly describe your background', type: 'textarea', width: 'full' },
          { label: 'Are you allergic to any animals?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
          { label: 'If yes, please specify', type: 'text', width: 'half' },
          { label: 'Anyone in your household with animal allergies?', type: 'radio', options: ['Yes', 'No'], width: 'half' },
        ]
      },
      {
        title: 'Part 6: References',
        type: 'fields',
        fields: [
          { label: 'Reference 1 — Full Name', type: 'text', width: 'half' },
          { label: 'Reference 1 — Relationship', type: 'text', width: 'half' },
          { label: 'Reference 1 — Phone', type: 'phone', width: 'half' },
          { label: 'Reference 1 — Email', type: 'email', width: 'half' },
          { label: 'Reference 2 — Full Name', type: 'text', width: 'half' },
          { label: 'Reference 2 — Relationship', type: 'text', width: 'half' },
          { label: 'Reference 2 — Phone', type: 'phone', width: 'half' },
          { label: 'Reference 2 — Email', type: 'email', width: 'half' },
        ]
      },
      {
        title: 'Part 7: Background Check & Acknowledgments',
        type: 'fields',
        fields: [
          { label: 'I authorize the organization to conduct a background check if required for my selected volunteer role(s)', type: 'radio', options: ['Yes, I authorize this', 'No, I do not authorize this (note: may limit role eligibility)'], width: 'full' },
          { label: 'I agree to maintain confidentiality regarding adopter, foster, and donor information I may access', type: 'radio', options: ['Yes, I agree'], width: 'full' },
          { label: 'I agree to follow all organization policies, codes of conduct, and safety procedures', type: 'radio', options: ['Yes, I agree'], width: 'full' },
          { label: 'I understand that volunteering is unpaid and I am not an employee of the organization', type: 'radio', options: ['Yes, I understand'], width: 'full' },
          { label: 'Volunteer Printed Name', type: 'text', width: 'half' },
          { label: 'Date', type: 'date', width: 'half' },
          { label: 'If under 18 — Parent/Guardian Printed Name', type: 'text', width: 'half' },
          { label: 'Parent/Guardian Phone', type: 'phone', width: 'half' },
          { label: 'Additional comments, questions, or information you\'d like us to know', type: 'textarea', width: 'full' },
        ]
      }
    ],
    legalClauses: [
      'I certify that all information provided in this application is true and accurate to the best of my knowledge.',
      'I understand that any misrepresentation may result in immediate removal from the volunteer program.',
      'I agree to release, indemnify, and hold harmless the rescue organization and its staff from any injury, loss, or damage incurred during volunteer activities.',
      'Volunteer Signature: _____________________________________   Date: __________________',
      'Parent/Guardian Signature (if under 18): _____________________________________   Date: __________________',
      'Organization Representative: _____________________________________   Date: __________________',
    ]
  },

  // ── EMERGENCY VETERINARY AUTHORIZATION ─────────────────────────────────────
  {
    id: 'vet-authorization',
    title: 'Emergency Veterinary Authorization',
    description: 'Kept on file by the foster or the vet clinic — authorizes emergency medical treatment and spending when the rescue cannot be immediately reached.',
    notice: [
      'This form should be completed for every foster animal and kept both with the foster caregiver and on file at the designated veterinary clinic.',
      'This document authorizes emergency medical care only. Non-emergency procedures require separate approval from the rescue organization.',
      'A copy should accompany the animal any time it is transported to a veterinary appointment.'
    ],
    generalReqs: [
      'The rescue organization must designate at least one authorized emergency contact who can approve expenses beyond the stated limit.',
      'Foster caregivers must notify the organization within 2 hours of any emergency veterinary visit.',
      'This authorization expires and must be renewed each time the animal changes foster placements.'
    ],
    sections: [
      {
        title: 'Part 1: Animal Information',
        type: 'fields',
        fields: [
          { label: 'Animal Name', type: 'text', width: 'half' },
          { label: 'Species', type: 'radio', options: ['Dog', 'Cat', 'Other'], width: 'half' },
          { label: 'Breed / Mix', type: 'text', width: 'half' },
          { label: 'Approximate Age', type: 'text', width: 'half' },
          { label: 'Sex', type: 'radio', options: ['Male (intact)', 'Male (neutered)', 'Female (intact)', 'Female (spayed)'], width: 'half' },
          { label: 'Primary Color / Markings (for identification)', type: 'text', width: 'half' },
          { label: 'Microchip Number', type: 'text', width: 'half' },
          { label: 'Rescue Animal ID / Foster Number', type: 'text', width: 'half' },
          { label: 'Date Animal Entered Foster Care', type: 'date', width: 'half' },
          { label: 'Estimated Weight (lbs)', type: 'text', width: 'half' },
        ]
      },
      {
        title: 'Part 2: Foster Caregiver Information',
        type: 'fields',
        fields: [
          { label: 'Foster Caregiver Full Name', type: 'text', width: 'full' },
          { label: 'Foster Address', type: 'text', width: 'full' },
          { label: 'Foster Cell Phone', type: 'phone', width: 'half' },
          { label: 'Foster Email', type: 'email', width: 'half' },
          { label: 'Alternate / Household Member Phone', type: 'phone', width: 'half' },
          { label: 'Alternate Contact Name', type: 'text', width: 'half' },
        ]
      },
      {
        title: 'Part 3: Rescue Organization Contacts',
        type: 'fields',
        fields: [
          { label: 'Rescue Organization Name', type: 'text', width: 'full' },
          { label: 'Primary Rescue Contact Name', type: 'text', width: 'half' },
          { label: 'Primary Rescue Contact Phone', type: 'phone', width: 'half' },
          { label: 'Secondary Emergency Contact Name', type: 'text', width: 'half' },
          { label: 'Secondary Emergency Contact Phone', type: 'phone', width: 'half' },
          { label: 'Rescue Organization Email', type: 'email', width: 'half' },
          { label: 'Rescue Organization EIN / Tax ID (for billing purposes)', type: 'text', width: 'half' },
        ]
      },
      {
        title: 'Part 4: Designated Veterinary Clinics',
        type: 'fields',
        fields: [
          { label: 'Primary Veterinary Clinic Name', type: 'text', width: 'half' },
          { label: 'Primary Vet Phone', type: 'phone', width: 'half' },
          { label: 'Primary Vet Address', type: 'text', width: 'full' },
          { label: 'Approved for routine visits?', type: 'radio', options: ['Yes', 'No — Emergency Only'], width: 'half' },
          { label: 'Account / Patient Number at this clinic (if established)', type: 'text', width: 'half' },
          { label: 'Emergency / After-Hours Clinic Name', type: 'text', width: 'half' },
          { label: 'Emergency Clinic Phone', type: 'phone', width: 'half' },
          { label: 'Emergency Clinic Address', type: 'text', width: 'full' },
        ]
      },
      {
        title: 'Part 5: Known Medical History & Conditions',
        type: 'fields',
        fields: [
          { label: 'Current medications (name, dose, frequency)', type: 'textarea', placeholder: 'e.g. Clavamox 62.5mg twice daily', width: 'full' },
          { label: 'Known allergies (medications, foods, environmental)', type: 'textarea', width: 'full' },
          { label: 'Current diagnoses or active medical conditions', type: 'textarea', width: 'full' },
          { label: 'Recent surgeries or procedures (within 90 days)', type: 'textarea', width: 'full' },
          { label: 'Behavioral notes relevant to veterinary handling (e.g. fear aggressive, muzzle required, bite history)', type: 'textarea', width: 'full' },
          { label: 'Vaccination status', type: 'radio', options: ['Up to date', 'Partially vaccinated', 'Unknown / Unvaccinated', 'Due for booster at this visit'], width: 'full' },
          { label: 'Heartworm / flea / tick prevention current?', type: 'radio', options: ['Yes', 'No', 'Unknown'], width: 'half' },
          { label: 'If yes, product name and last dose date', type: 'text', width: 'half' },
        ]
      },
      {
        title: 'Section 1: Emergency Treatment Authorization',
        type: 'text',
        paragraphs: [
          'The undersigned Rescue Organization hereby authorizes the designated veterinary clinic(s) listed above to provide emergency medical evaluation, diagnostics, and treatment for the animal described on this form when the situation poses an immediate risk to life or significant suffering.',
          'This authorization is granted to avoid delay in life-saving care when organization representatives cannot be reached in time.',
          'Emergency treatment means: conditions that, without immediate intervention, would likely result in death, permanent injury, or severe and unrelenting pain. This does NOT authorize elective procedures, scheduled surgeries, dental cleanings, or non-urgent diagnostics.',
        ]
      },
      {
        title: 'Part 6: Spending Authorization Limits',
        type: 'fields',
        fields: [
          { label: 'Pre-authorized emergency spending limit (proceed without calling)', type: 'radio', options: ['Up to $200', 'Up to $300', 'Up to $500', 'Up to $750', 'Up to $1,000', 'Other (specify below)'], width: 'full' },
          { label: 'If "Other," specify custom pre-authorized limit ($)', type: 'text', width: 'half' },
          { label: 'For expenses ABOVE the pre-authorized limit, contact (in order)', type: 'radio', options: ['Primary Rescue Contact first, then Secondary', 'Either contact simultaneously', 'Do not proceed without approval — attempt contact for up to 30 minutes'], width: 'full' },
          { label: 'If no contact can be reached after 30 minutes and the animal is in critical condition', type: 'radio', options: ['Authorized to proceed with life-saving care at the vet\'s discretion', 'Authorized to proceed up to an additional $500 above the pre-authorized limit', 'Do not proceed — continue attempting contact'], width: 'full' },
          { label: 'Payment method on file at clinic?', type: 'radio', options: ['Yes — rescue account established', 'No — invoice rescue organization directly', 'Foster caregiver to pay and submit for reimbursement'], width: 'full' },
        ]
      },
      {
        title: 'Section 2: Procedures Requiring Prior Approval',
        type: 'text',
        paragraphs: [
          'The following procedures ALWAYS require explicit verbal or written approval from an authorized rescue representative before proceeding, regardless of cost:',
          '• Euthanasia — must have explicit rescue authorization except in cases of catastrophic, unrecoverable suffering at the attending veterinarian\'s professional judgment.',
          '• Any surgical procedure not directly required to stabilize an acute emergency.',
          '• Referral to a specialist or specialty hospital.',
          '• Blood transfusions or plasma products.',
          '• Extended hospitalization beyond 48 hours.',
        ]
      },
      {
        title: 'Part 7: Euthanasia Authorization (Complete Carefully)',
        type: 'fields',
        fields: [
          { label: 'In a catastrophic, unrecoverable emergency where the animal is suffering and no authorized person can be reached after 30+ minutes of attempts, I authorize the attending DVM to humanely euthanize', type: 'radio', options: ['YES — I authorize this as a last resort to end suffering', 'NO — Continue attempting to reach an authorized contact; do not proceed without approval'], width: 'full' },
          { label: 'Additional instructions or conditions regarding end-of-life decisions', type: 'textarea', width: 'full' },
        ]
      },
      {
        title: 'Part 8: Signatures & Authorization',
        type: 'fields',
        fields: [
          { label: 'Authorized Organization Representative Name', type: 'text', width: 'half' },
          { label: 'Title / Role', type: 'text', width: 'half' },
          { label: 'Signature Date', type: 'date', width: 'half' },
          { label: 'Authorization Expiration Date (recommend 6 months or change of foster)', type: 'date', width: 'half' },
          { label: 'Foster Caregiver Acknowledgment: I have read this authorization, understand its terms, and agree to follow the protocols outlined above', type: 'radio', options: ['Yes, I acknowledge and agree'], width: 'full' },
          { label: 'Foster Caregiver Printed Name', type: 'text', width: 'half' },
          { label: 'Foster Signature Date', type: 'date', width: 'half' },
        ]
      }
    ],
    legalClauses: [
      'This Emergency Veterinary Authorization is valid for the animal named above, for the foster placement period specified, and at the veterinary clinics designated on this form only.',
      'The rescue organization agrees to reimburse authorized emergency expenses within 30 days of receiving itemized invoices, subject to the spending limits stated above.',
      'This authorization does not constitute a guarantee of payment by the rescue organization for expenses exceeding the pre-authorized limit without explicit approval.',
      'Organization Representative Signature: _____________________________________   Date: __________________',
      'Foster Caregiver Signature: _____________________________________   Date: __________________',
      'Veterinary Clinic Acknowledgment (if establishing on file): _____________________________________   Date: __________________',
    ]
  }
];

export function RescueForms() {
  const [activeTab, setActiveTab] = useState<string>('adoption-app');
  const [adoptionDropdownOpen, setAdoptionDropdownOpen] = useState(false);
  const [fosterDropdownOpen, setFosterDropdownOpen] = useState(false);
  const [medicalDropdownOpen, setMedicalDropdownOpen] = useState(false);
  const [surrenderDropdownOpen, setSurrenderDropdownOpen] = useState(false);
  const [intakeDropdownOpen, setIntakeDropdownOpen] = useState(false);

  const isAdoptionActive = activeTab === 'adoption-app' || activeTab === 'adoption-contract';
  const isFosterActive = activeTab === 'foster-app' || activeTab === 'foster-agreement' || activeTab === 'foster-checklist';
  const isMedicalActive = activeTab === 'medical-log' || activeTab === 'vet-authorization';
  const isSurrenderActive = activeTab === 'cat-surrender' || activeTab === 'dog-surrender';
  const isIntakeActive = activeTab === 'cat-intake' || activeTab === 'dog-intake';

  // Rescue details state
  const [rescueName, setRescueName] = useState<string>('');
  const [rescueWebsite, setRescueWebsite] = useState<string>('');
  const [rescuePhone, setRescuePhone] = useState<string>('');
  const [rescueEmail, setRescueEmail] = useState<string>('');
  const [rescueLocation, setRescueLocation] = useState<string>('');
  
  // Customization styling state
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🐾');
  const [selectedColor, setSelectedColor] = useState<string>('indigo');

  // Mobile layout state: 'edit' or 'preview'
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');

  const activeTemplate = FORM_TEMPLATES.find(t => t.id === activeTab) || FORM_TEMPLATES[0];
  const activeTheme = THEME_PALETTES[selectedColor] || THEME_PALETTES.indigo;

  // Custom metadata formatting
  const displayRescueName = rescueName.trim() || 'Independent Rescue Partners';
  const displayWebsite = rescueWebsite.trim() || 'www.independentrescue.org';
  const displayPhone = rescuePhone.trim() || '(555) 123-4567';
  const displayEmail = rescueEmail.trim() || 'info@independentrescue.org';
  const displayLocation = rescueLocation.trim() || 'Rescue City, USA';

  // Handle native browser print
  const handlePrint = () => {
    window.print();
  };

  // Generate and Download DOCX programmatically
  const handleDownloadDocx = async () => {
    const doc = new Document({
      creator: 'RescueKit Starter Forms',
      title: `${displayRescueName} - ${activeTemplate.title}`,
      description: `Starter ${activeTemplate.title} customized for ${displayRescueName}`,
      sections: [{
        properties: {},
        children: [
          // Header Badge / Logo and Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: `${selectedEmoji}  `,
                size: 32,
              }),
              new TextRun({
                text: displayRescueName.toUpperCase(),
                bold: true,
                size: 28,
                color: activeTheme.primaryHex,
                font: 'Helvetica',
              }),
            ],
          }),

          // Contact Details Subheader
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${displayLocation}  |  ${displayPhone}  |  ${displayEmail}  |  ${displayWebsite}`,
                size: 18,
                italics: true,
                color: '555555',
                font: 'Helvetica',
              }),
            ],
          }),

          // Horizontal divider line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: 'CCCCCC',
                size: 18,
              }),
            ],
          }),

          // Document Title
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: activeTemplate.title,
                bold: true,
                size: 36,
                color: '111111',
                font: 'Helvetica',
              }),
            ],
          }),

          // Organization Notice / Disclaimer box
          ...activeTemplate.notice.map(note => (
            new Paragraph({
              spacing: { before: 100, after: 100 },
              children: [
                new TextRun({
                  text: `* ${note}`,
                  size: 19,
                  italics: true,
                  color: '666666',
                  font: 'Helvetica',
                }),
              ],
            })
          )),

          // Spacer
          new Paragraph({ spacing: { after: 200 } }),

          // General Requirements (if any)
          ...(activeTemplate.generalReqs ? [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 150 },
              children: [
                new TextRun({
                  text: 'General Requirements',
                  bold: true,
                  size: 24,
                  color: activeTheme.primaryHex,
                  font: 'Helvetica',
                }),
              ],
            }),
            ...activeTemplate.generalReqs.map(req => (
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: req,
                    size: 20,
                    font: 'Helvetica',
                  }),
                ],
              })
            ))
          ] : []),

          // Sections
          ...activeTemplate.sections.flatMap(section => {
            const sectionParagraphs = [];

            // Section Heading
            sectionParagraphs.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 },
                children: [
                  new TextRun({
                    text: section.title,
                    bold: true,
                    size: 24,
                    color: activeTheme.primaryHex,
                    font: 'Helvetica',
                  }),
                ],
              })
            );

            if (section.type === 'text' && section.paragraphs) {
              section.paragraphs.forEach(pText => {
                sectionParagraphs.push(
                  new Paragraph({
                    spacing: { after: 120 },
                    children: [
                      new TextRun({
                        text: pText,
                        size: 20,
                        font: 'Helvetica',
                      }),
                    ],
                  })
                );
              });
            } else if (section.type === 'fields' && section.fields) {
              section.fields.forEach(field => {
                if (field.type === 'table') {
                  // Render a real Table in Word
                  const tableHeaderCells = (field.tableHeaders || []).map(headerText => (
                    new TableCell({
                      width: { size: 100 / (field.tableHeaders?.length || 1), type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: headerText,
                              bold: true,
                              size: 18,
                              color: 'FFFFFF',
                              font: 'Helvetica',
                            }),
                          ],
                        }),
                      ],
                      shading: { fill: activeTheme.primaryHex },
                    })
                  ));

                  const tableRows = [
                    new TableRow({ children: tableHeaderCells }),
                    ...(field.tableRows || []).map(row => (
                      new TableRow({
                        height: { value: 360, rule: HeightRule.EXACT }, // tall enough to write in
                        children: row.map(() => (
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: ' ',
                                    size: 20,
                                  }),
                                ],
                              }),
                            ],
                          })
                        )),
                      })
                    )),
                  ];

                  sectionParagraphs.push(
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      rows: tableRows,
                    })
                  );

                  // Space after table
                  sectionParagraphs.push(new Paragraph({ spacing: { after: 150 } }));
                } else if (field.type === 'checkbox' || field.type === 'radio') {
                  const optionsStr = (field.options || []).map(opt => `[   ] ${opt}`).join('     ');
                  sectionParagraphs.push(
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: `* ${field.label}:  `,
                          bold: true,
                          size: 20,
                          font: 'Helvetica',
                        }),
                        new TextRun({
                          text: optionsStr,
                          size: 20,
                          font: 'Helvetica',
                        }),
                      ],
                    })
                  );
                } else if (field.type === 'textarea') {
                  sectionParagraphs.push(
                    new Paragraph({
                      spacing: { after: 120 },
                      children: [
                        new TextRun({
                          text: `* ${field.label}:`,
                          bold: true,
                          size: 20,
                          font: 'Helvetica',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 150 },
                      children: [
                        new TextRun({
                          text: '\n_________________________________________________________________________________\n\n_________________________________________________________________________________\n',
                          color: 'BBBBBB',
                          size: 18,
                        }),
                      ],
                    })
                  );
                } else {
                  // regular text input fields
                  sectionParagraphs.push(
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: `* ${field.label}: `,
                          bold: true,
                          size: 20,
                          font: 'Helvetica',
                        }),
                        new TextRun({
                          text: '________________________________________________________',
                          color: 'BBBBBB',
                          size: 18,
                        }),
                      ],
                    })
                  );
                }
              });
            }

            return sectionParagraphs;
          }),

          // Legal Agreement Terms & Signatures
          ...(activeTemplate.legalClauses ? [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 },
              children: [
                new TextRun({
                  text: 'Legal Acknowledgement & Signatures',
                  bold: true,
                  size: 24,
                  color: activeTheme.primaryHex,
                  font: 'Helvetica',
                }),
              ],
            }),
            ...activeTemplate.legalClauses.map((clause, idx) => {
              const isSignatureField = clause.includes('[Text]') || clause.includes('[Date]') || clause.includes('Signature:');
              if (isSignatureField) {
                const cleanText = clause
                  .replace('[Text]', '_____________________________')
                  .replace('[Date]', '__________________');
                return new Paragraph({
                  spacing: { before: 150, after: 100 },
                  children: [
                    new TextRun({
                      text: cleanText,
                      bold: true,
                      size: 20,
                      font: 'Helvetica',
                    }),
                  ],
                });
              } else {
                return new Paragraph({
                  spacing: { after: 100 },
                  children: [
                    new TextRun({
                      text: `${idx + 1}. ${clause}`,
                      size: 19,
                      font: 'Helvetica',
                    }),
                  ],
                });
              }
            })
          ] : []),
        ],
      }],
    });

    // Save File
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTemplate.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_starter.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      
      {/* HEADER BANNER */}
      <div className="no-print col-span-full bg-gradient-to-r from-sky-50 via-blue-50/50 to-sky-50/40 border border-sky-200/70 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_theme(colors.sky.100/50),_transparent_60%)] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-[22.8px] md:text-[34.2px] font-black text-slate-900 tracking-tight font-fraunces flex items-center gap-2">
            Rescue Starter Forms & Contracts
          </h1>
          <p className="text-sm text-sky-800 font-bold mt-1.5">
            Download editable Word documents or customized PDFs to coordinate adoptions, fosters, agreements, and medical records.
          </p>
        </div>
      </div>

      {/* MOBILE SWITCHER BUTTONS (Edit Branding vs. Preview Form) */}
      <div className="no-print col-span-full flex lg:hidden bg-sky-50/70 p-1 rounded-2xl border border-sky-100 mb-2">
        <button
          type="button"
          onClick={() => setMobileMode('edit')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 ${
            mobileMode === 'edit'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-800 hover:bg-sky-100/50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>1. Customize Branding</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileMode('preview')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 ${
            mobileMode === 'preview'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-800 hover:bg-sky-100/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>2. Preview & Export</span>
        </button>
      </div>

      {/* LEFT SIDEBAR: CUSTOMIZER */}
      <div className={`col-span-full lg:col-span-4 space-y-6 no-print ${mobileMode === 'edit' ? 'block' : 'hidden lg:block'}`}>
        
        {/* BRANDING FORM CARD */}
        <div className="bg-white border border-sky-100/80 p-6 rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-sky-50">
            <span className="text-xl">🎨</span>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Rescue Branding</h3>
              <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">Customize fields to brand your documents</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Rescue Organization Name</label>
              <input
                type="text"
                value={rescueName}
                onChange={(e) => setRescueName(e.target.value)}
                placeholder="e.g. Hopeful Tails Animal Rescue"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Website Address</label>
              <input
                type="text"
                value={rescueWebsite}
                onChange={(e) => setRescueWebsite(e.target.value)}
                placeholder="e.g. www.hopefultails.org"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={rescuePhone}
                  onChange={(e) => setRescuePhone(e.target.value)}
                  placeholder="e.g. (555) 123-4567"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Contact Email</label>
                <input
                  type="email"
                  value={rescueEmail}
                  onChange={(e) => setRescueEmail(e.target.value)}
                  placeholder="e.g. info@hopefultails.org"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Rescue Location (City, State)</label>
              <input
                type="text"
                value={rescueLocation}
                onChange={(e) => setRescueLocation(e.target.value)}
                placeholder="e.g. Los Angeles, CA"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* EMOJI SELECTOR */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Badge Icon / Logo</label>
              <div className="flex gap-2">
                {['🐾', '🐶', '🐱', '🏠', '❤️', '🩺'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-lg p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      selectedEmoji === emoji 
                        ? `bg-sky-50 border-sky-300 font-bold scale-110 shadow-3xs` 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR PALETTE */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Theme Palette Color</label>
              <div className="flex gap-3 mt-1">
                {Object.entries(THEME_PALETTES).map(([key, pal]) => {
                  const isSelected = selectedColor === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedColor(key)}
                      title={pal.name}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                        key === 'indigo' ? 'bg-indigo-600' :
                        key === 'emerald' ? 'bg-emerald-600' :
                        key === 'rose' ? 'bg-rose-600' :
                        key === 'amber' ? 'bg-amber-600' :
                        'bg-slate-600'
                      } ${isSelected ? 'scale-120 border-slate-800' : 'border-transparent hover:scale-110'}`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* TIPS CARD */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50/60 border border-sky-200/50 p-6 rounded-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-700 shrink-0" />
            <h4 className="text-xs font-black text-sky-800 uppercase tracking-wider">How editing works</h4>
          </div>
          <p className="text-[11.5px] leading-relaxed text-sky-900/80 font-semibold">
            Rescues typically need to add customized clauses or terms of service. 
            We recommend **downloading as a DOCX (Word Document)** first so you can open it in Word or Google Docs and tailor any specific legal text.
          </p>
        </div>
      </div>

      {/* RIGHT PREVIEW & TEMPLATE TABS */}
      <div className={`col-span-full lg:col-span-8 space-y-6 ${mobileMode === 'preview' ? 'block' : 'hidden lg:block'}`}>
        
        {/* TEMPLATE TAB SELECTOR */}
        <div className="no-print flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 relative">

          {/* Adoption Docs Dropdown */}
          <div
            className="relative group shrink-0"
            onMouseEnter={() => setAdoptionDropdownOpen(true)}
            onMouseLeave={() => setAdoptionDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setAdoptionDropdownOpen(!adoptionDropdownOpen)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAdoptionActive
                  ? `bg-white text-slate-900 shadow-sm border border-slate-200/40`
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              <span>Adoption Docs</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            <div className={`absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-md py-1.5 z-50 transition-all ${adoptionDropdownOpen ? 'block' : 'hidden group-hover:block'}`}>
              <button type="button" onClick={() => { setActiveTab('adoption-app'); setAdoptionDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${activeTab === 'adoption-app' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'}`}>
                Adoption Application
              </button>
              <button type="button" onClick={() => { setActiveTab('adoption-contract'); setAdoptionDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${activeTab === 'adoption-contract' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'}`}>
                Adoption Contract
              </button>
            </div>
          </div>

          {/* Foster Docs Dropdown */}
          <div 
            className="relative group shrink-0"
            onMouseEnter={() => setFosterDropdownOpen(true)}
            onMouseLeave={() => setFosterDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setFosterDropdownOpen(!fosterDropdownOpen)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isFosterActive 
                  ? `bg-white text-slate-900 shadow-sm border border-slate-200/40` 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              <span>Foster Docs</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            <div 
              className={`absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-md py-1.5 z-50 transition-all ${
                fosterDropdownOpen ? 'block' : 'hidden group-hover:block'
              }`}
            >
              <button
                type="button"
                onClick={() => { setActiveTab('foster-app'); setFosterDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'foster-app' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Foster App
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('foster-agreement'); setFosterDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'foster-agreement' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Foster Agreement
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('foster-checklist'); setFosterDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'foster-checklist' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Foster Home Checklist
              </button>
            </div>
          </div>

          {/* Medical Docs Dropdown */}
          <div
            className="relative group shrink-0"
            onMouseEnter={() => setMedicalDropdownOpen(true)}
            onMouseLeave={() => setMedicalDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMedicalDropdownOpen(!medicalDropdownOpen)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isMedicalActive
                  ? `bg-white text-slate-900 shadow-sm border border-slate-200/40`
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              <span>Medical Docs</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            <div className={`absolute left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-md py-1.5 z-50 transition-all ${medicalDropdownOpen ? 'block' : 'hidden group-hover:block'}`}>
              <button type="button" onClick={() => { setActiveTab('medical-log'); setMedicalDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${activeTab === 'medical-log' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'}`}>
                Foster Medical Log
              </button>
              <button type="button" onClick={() => { setActiveTab('vet-authorization'); setMedicalDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${activeTab === 'vet-authorization' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'}`}>
                Emergency Vet Authorization
              </button>
            </div>
          </div>

          {/* Volunteer App */}
          <button
            type="button"
            onClick={() => setActiveTab('volunteer-app')}
            className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'volunteer-app'
                ? `bg-white text-slate-900 shadow-sm border border-slate-200/40`
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            Volunteer App
          </button>

          {/* Surrender Forms Dropdown */}
          <div 
            className="relative group shrink-0"
            onMouseEnter={() => setSurrenderDropdownOpen(true)}
            onMouseLeave={() => setSurrenderDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setSurrenderDropdownOpen(!surrenderDropdownOpen)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSurrenderActive 
                  ? `bg-white text-slate-900 shadow-sm border border-slate-200/40` 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              <span>Surrender Forms</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            <div 
              className={`absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-md py-1.5 z-50 transition-all ${
                surrenderDropdownOpen ? 'block' : 'hidden group-hover:block'
              }`}
            >
              <button
                type="button"
                onClick={() => { setActiveTab('cat-surrender'); setSurrenderDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'cat-surrender' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Cat Surrender Form
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('dog-surrender'); setSurrenderDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'dog-surrender' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Dog Surrender Form
              </button>
            </div>
          </div>

          {/* Intake Exam Forms Dropdown */}
          <div 
            className="relative group shrink-0"
            onMouseEnter={() => setIntakeDropdownOpen(true)}
            onMouseLeave={() => setIntakeDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIntakeDropdownOpen(!intakeDropdownOpen)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isIntakeActive 
                  ? `bg-white text-slate-900 shadow-sm border border-slate-200/40` 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              <span>Intake Exam Forms</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            <div 
              className={`absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-md py-1.5 z-50 transition-all ${
                intakeDropdownOpen ? 'block' : 'hidden group-hover:block'
              }`}
            >
              <button
                type="button"
                onClick={() => { setActiveTab('cat-intake'); setIntakeDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'cat-intake' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Cat Intake Exam Form
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('dog-intake'); setIntakeDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-all ${
                  activeTab === 'dog-intake' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'
                }`}
              >
                Dog Intake Exam Form
              </button>
            </div>
          </div>
        </div>

        {/* ACTIONS PANEL */}
        <div className="no-print bg-white border border-slate-200/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTheme.bgLight} ${activeTheme.textLight} border ${activeTheme.border}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">{activeTemplate.title}</h4>
              <p className="text-[10px] text-slate-400 font-semibold">{activeTemplate.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-sans transition-all active:scale-95 border border-slate-200/40"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadDocx}
              className={`cursor-pointer text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-sans transition-all active:scale-95 ${activeTheme.primary}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .docx</span>
            </button>
          </div>
        </div>

        {/* PAPER LIVE PREVIEW CANVAS */}
        <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-6 sm:p-12 md:p-16 relative overflow-hidden font-sans forms-print-container">
          
          {/* HEADER LETTERHEAD */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-slate-200">
            {/* Logo Badge */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl font-normal shrink-0 ${activeTheme.bgLight} border-2 ${activeTheme.border}`}>
              {selectedEmoji}
            </div>
            
            {/* Rescue Details */}
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">
                {displayRescueName}
              </h2>
              
              {/* Badges/Metadata */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{displayLocation}</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{displayPhone}</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{displayEmail}</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>{displayWebsite}</span>
                </span>
              </div>
            </div>
          </div>

          {/* DOCUMENT BODY */}
          <div className="mt-8 space-y-8 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
            
            {/* Document Title Header */}
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeTemplate.title}
              </h1>
              <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full" />
            </div>

            {/* NOTICE BOX */}
            <div className={`p-4 rounded-2xl border ${activeTheme.border} ${activeTheme.bgLight} space-y-2`}>
              <h4 className={`text-[11px] font-black uppercase tracking-wider ${activeTheme.text}`}>Important Notice</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11.5px] font-medium">
                {activeTemplate.notice.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            {/* GENERAL REQUIREMENTS */}
            {activeTemplate.generalReqs && (
              <div className="space-y-3">
                <h3 className={`text-sm font-black tracking-tight border-b-2 pb-1 ${activeTheme.text} ${activeTheme.border}`}>
                  General Requirements
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  {activeTemplate.generalReqs.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SECTIONS */}
            {activeTemplate.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4">
                
                {/* Section Title */}
                <h3 className={`text-sm font-black tracking-tight border-b-2 pb-1 mt-6 ${activeTheme.text} ${activeTheme.border}`}>
                  {section.title}
                </h3>

                {/* TEXT TYPE */}
                {section.type === 'text' && section.paragraphs && (
                  <div className="space-y-3 text-slate-600">
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                )}

                {/* FIELDS TYPE */}
                {section.type === 'fields' && section.fields && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-3.5">
                    {section.fields.map((field, fIdx) => {
                      const widthClass = 
                        field.width === 'full' ? 'col-span-full' :
                        field.width === 'half' ? 'col-span-full md:col-span-3' :
                        'col-span-full md:col-span-2';

                      if (field.type === 'table') {
                        return (
                          <div key={fIdx} className="col-span-full mt-2 overflow-x-auto">
                            <label className="block text-[10.5px] font-black text-slate-800 uppercase tracking-wider mb-2">
                              {field.label}
                            </label>
                            <table className="w-full border-collapse border border-slate-200 min-w-[500px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                  {field.tableHeaders?.map((header, hIdx) => (
                                    <th key={hIdx} className="border border-slate-200 px-3 py-2 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {field.tableRows?.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/40">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="border border-slate-200 px-3 py-3.5 text-xs">
                                        <div className="h-4 w-full bg-slate-50/50 rounded-xs" />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      if (field.type === 'checkbox' || field.type === 'radio') {
                        return (
                          <div key={fIdx} className={widthClass}>
                            <label className="block text-[10.5px] font-black text-slate-800 uppercase tracking-wider mb-2">
                              {field.label}
                            </label>
                            <div className="flex flex-wrap gap-4 mt-1">
                              {field.options?.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <div className={`w-4 h-4 border border-slate-300 rounded flex items-center justify-center shrink-0 ${field.type === 'radio' ? 'rounded-full' : ''}`}>
                                    <div className="w-1.5 h-1.5 bg-transparent rounded-xs" />
                                  </div>
                                  <span className="text-slate-600 font-semibold text-xs">{opt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (field.type === 'textarea') {
                        return (
                          <div key={fIdx} className="col-span-full">
                            <label className="block text-[10.5px] font-black text-slate-800 uppercase tracking-wider mb-1.5">
                              {field.label}
                            </label>
                            <div className="w-full h-16 border border-slate-200 bg-slate-50/30 rounded-xl" />
                          </div>
                        );
                      }

                      return (
                        <div key={fIdx} className={widthClass}>
                          <label className="block text-[10.5px] font-black text-slate-800 uppercase tracking-wider mb-1">
                            {field.label}
                          </label>
                          <div className="w-full h-8.5 border-b border-slate-300 flex items-end pb-1 text-slate-400 italic text-[11px] font-medium">
                            {field.placeholder || ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}

            {/* LEGAL SIGNATURE CLAUSES */}
            {activeTemplate.legalClauses && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className={`text-sm font-black tracking-tight border-b-2 pb-1 ${activeTheme.text} ${activeTheme.border}`}>
                  Legal Agreement & Signatures
                </h3>
                
                <div className="space-y-3 text-[11.5px] text-slate-600 leading-relaxed">
                  {activeTemplate.legalClauses.map((clause, idx) => {
                    const isSignatureField = clause.includes('[Text]') || clause.includes('[Date]') || clause.includes('Signature:');
                    
                    if (isSignatureField) {
                      // Formatting signature field layouts nicely
                      const parts = clause.split(':');
                      const label = parts[0] + ':';
                      return (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                          <div className="border-b border-slate-300 pb-1 flex items-end">
                            <span className="font-bold text-slate-800 mr-2">{label}</span>
                            <span className="text-[10px] text-slate-400 italic">Sign here</span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <p key={idx}>
                          <span className="font-bold text-slate-800">{idx + 1}. </span>
                          {clause}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
            )}

          </div>

          {/* PAGE WATERMARK / FOOTER */}
          <div className="mt-16 pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Powered by RescueKit.org Starter Forms</span>
            <span>Document Reference: {activeTemplate.id.toUpperCase()}-STARTER-2026</span>
          </div>

        </div>

      </div>

    </div>
  );
}
