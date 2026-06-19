import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckSquare, 
  Square, 
  Search, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Filter, 
  Sparkles, 
  ClipboardCheck, 
  FileText, 
  Heart,
  AlertCircle
} from 'lucide-react';

// PREDECLARED GRANTS DIRECTORY (Curated for rescues)
interface Grant {
  id: string;
  provider: string;
  name: string;
  maxAmount: string;
  deadline: string;
  category: 'Spay/Neuter' | 'Veterinary & Seniors' | 'Disaster & Capital' | 'General Operations';
  difficulty: 'Easy' | 'Medium' | 'High';
  description: string;
  requirements: string[];
  applyUrl: string;
}

const CONST_GRANTS: Grant[] = [
  {
    id: 'g_petco_lifesaving',
    provider: 'Petco Love Lifesaving Grants',
    name: 'Lifesaving Operations and Spay/Neuter',
    maxAmount: '$50,000',
    deadline: 'July 15, 2026',
    category: 'Spay/Neuter',
    difficulty: 'Medium',
    description: 'Funding aimed at supporting operations that immediately increase canine and feline lifesaving rates, including community spay/neuter and TNR campaigns.',
    requirements: ['501(c)(3) determination letter', 'Shelter animals intake database statistics', 'Active pet adoption partnership'],
    applyUrl: 'https://petcolove.org/partner-portal/'
  },
  {
    id: 'g_gray_muzzle',
    provider: 'The Grey Muzzle Organization',
    name: 'Senior Dog Care & Quality of Life Grant',
    maxAmount: '$15,000',
    deadline: 'Rolling',
    category: 'Veterinary & Seniors',
    difficulty: 'Easy',
    description: 'Specifically focuses on building vet funds, medical supply resources, and nutritional diagnostics to improve life and adoption rates for older hospice and sanctuary dogs.',
    requirements: ['501(c)(3) determination status', 'Dedicated project budget plan', 'Targeted age parameter metrics'],
    applyUrl: 'https://www.greymuzzle.org/grant-opportunities'
  },
  {
    id: 'g_aspca_disaster',
    provider: 'ASPCA National Grants',
    name: 'Disaster Relief and Emergency Capital Support',
    maxAmount: '$25,000',
    deadline: 'Rolling',
    category: 'Disaster & Capital',
    difficulty: 'High',
    description: 'Quick-response funding specifically designated for physical shelter reconstruction, emergency hurricane/fire rescues, transport support, and animal medical boarding.',
    requirements: ['Detailed damage assessment or event logs', 'Tax ID certification', 'Emergency vet estimates'],
    applyUrl: 'https://www.aspcapro.org/grants'
  },
  {
    id: 'g_maddies_innov',
    provider: 'Maddie\'s Fund Grant Foundation',
    name: 'Foster Care Innovations & Support',
    maxAmount: '$10,000',
    deadline: 'September 1, 2026',
    category: 'General Operations',
    difficulty: 'Easy',
    description: 'Grants allocated to support foster-friendly programs, training courses, community foster portals, and home care decompressional setups.',
    requirements: ['Completed Shelter Animals Count baseline', 'Web portal proof or training plan'],
    applyUrl: 'https://www.maddiesfund.org/grant-opportunities.htm'
  },
  {
    id: 'g_bissell_wellness',
    provider: 'Bissell Pet Foundation Team',
    name: 'Wellness, Spay/Neuter & Microchipping Programs',
    maxAmount: '$20,000',
    deadline: 'October 10, 2026',
    category: 'Spay/Neuter',
    difficulty: 'Medium',
    description: 'Assisting shelters with free or highly subsidized baseline surgical options, puppy/kitten vaccines, and community microchipping drives to reduce stray intakes.',
    requirements: ['Surgical license agreements of partner vets', 'Onetime fee outline spreadsheet'],
    applyUrl: 'https://www.bissellpetfoundation.org/grants/'
  },
  {
    id: 'g_pedigree_breedbg',
    provider: 'Pedigree Foundation Granting',
    name: 'Breed-Agnostic Adoption Acceleration Support',
    maxAmount: '$25,000',
    deadline: 'June 30, 2026',
    category: 'General Operations',
    difficulty: 'Medium',
    description: 'Supports campaigns, digital tool setups (like flyers and web directories), and mobile adoption buses to quicken general intake-to-adoption velocities.',
    requirements: ['IRS Form 990 (recent)', 'Adoption promotion visual plan', 'List of board members'],
    applyUrl: 'https://www.pedigreefoundation.org/grant-programs/'
  },
  {
    id: 'g_bf_rachael_ray',
    provider: 'Best Friends & Rachael Ray Foundation',
    name: 'Rachael Ray Save Them All Grants',
    maxAmount: '$50,000',
    deadline: 'Rolling',
    category: 'General Operations',
    difficulty: 'Medium',
    description: 'Projects that increase linesaving of cats and dogs in U.S. shelters; open to public/private shelters, rescue groups, and other animal welfare organizations.',
    requirements: ['Best Friends Network Partner status', '501(c)(3) determination status', 'Completed animal care metrics upload'],
    applyUrl: 'https://network.bestfriends.org/about-us/grants'
  },
  {
    id: 'g_aspca_rescue_effect',
    provider: 'ASPCA Pro Grants',
    name: 'The Rescue Effect Adoption Support Grants',
    maxAmount: '$2,000,000 (Total Pool)',
    deadline: 'Rolling',
    category: 'General Operations',
    difficulty: 'Medium',
    description: 'Adoption support for shelters and rescues during the 2026 "The Rescue Effect" campaign to maximize adoption velocity and reduce rescue animal stay times.',
    requirements: ['Active ASPCA partner registration', 'Adoption statistics report', 'Promotional campaign overview'],
    applyUrl: 'https://www.aspcapro.org/grants'
  },
  {
    id: 'g_aspca_national_initiative',
    provider: 'ASPCA Pro Grants',
    name: 'National Shelter Grants Initiative',
    maxAmount: '$2,500,000 (Total Pool)',
    deadline: 'Rolling',
    category: 'Veterinary & Seniors',
    difficulty: 'High',
    description: 'Programs that support animal outcomes, animal psychological health, treatment, and community access to veterinary care.',
    requirements: ['ASPCA network affiliate listing', 'Veterinary clinical supervision details', 'Project evaluation metrics'],
    applyUrl: 'https://www.aspcapro.org/grants'
  },
  {
    id: 'g_aspca_disaster_prep',
    provider: 'ASPCA Pro Grants',
    name: 'ASPCA Disaster Preparedness Grants',
    maxAmount: '$500,000 (Total Pool)',
    deadline: 'Rolling',
    category: 'Disaster & Capital',
    difficulty: 'Medium',
    description: 'Disaster preparedness and resilience building for animals in coastal or high-risk areas (focusing on AL, MS, and LA communities).',
    requirements: ['Community disaster plan proof', '501(c)(3) tax letter', 'Geographical qualification criteria'],
    applyUrl: 'https://www.aspcapro.org/grants'
  },
  {
    id: 'g_denver_animals',
    provider: 'The Denver Foundation',
    name: 'Animals Welfare Funding',
    maxAmount: '$5,000',
    deadline: 'June 15, 2026',
    category: 'General Operations',
    difficulty: 'Easy',
    description: 'Animal-related grants supporting micro-operations, healthcare access, and animal placement in the U.S. with simple eligibility criteria.',
    requirements: ['U.S. Rescue non-profit certification', 'Short proposal letter of intent', 'Annual expense spreadsheet'],
    applyUrl: 'https://denverfoundation.org/grants/'
  }
];

// READINESS CHECKLIST ITEMS
interface GrantChecklistItem {
  id: string;
  category: 'Legal Documents' | 'Financial & Org Data' | 'Project Planning';
  doc: string;
  whyNeeded: string;
}

const CHECKLIST_ITEMS: GrantChecklistItem[] = [
  { id: 'gc_501c3', category: 'Legal Documents', doc: 'IRS 501(c)(3) Determination Letter', whyNeeded: '99% of grant donors require proof that your non-profit is federally tax-exempt.' },
  { id: 'gc_ein', category: 'Legal Documents', doc: 'Tax ID Number (EIN)', whyNeeded: 'Used immediately on the front page of every federal or private foundation application.' },
  { id: 'gc_bylaws', category: 'Legal Documents', doc: 'Approved Organization Bylaws', whyNeeded: 'Demonstrates proper internal governance guidelines to major funding bodies.' },
  { id: 'gc_form990', category: 'Financial & Org Data', doc: 'Recent IRS Form 990 filing', whyNeeded: 'Confirms financial transparency and displays your revenue-to-expense ratio.' },
  { id: 'gc_board_list', category: 'Financial & Org Data', doc: 'Active Board of Directors list', whyNeeded: 'Donors assess who pilots the funds—include current job titles and contact info.' },
  { id: 'gc_annual_budget', category: 'Financial & Org Data', doc: 'Current Fiscal Year Operating Budget', whyNeeded: 'Displays precisely how much funding you need versus existing fundraising channels.' },
  { id: 'gc_vets_agreement', category: 'Financial & Org Data', doc: 'Partner Veterinary Affiliation proof', whyNeeded: 'Critical for medical grants—validates that professional veterinary caretakers are lined up.' },
  { id: 'gc_metrics_log', category: 'Project Planning', doc: 'Current Shelter/Rescue Annual Metrics', whyNeeded: 'State clearly how many animals were intake-cleared, adopted, and euthanized (Shelter Animals Count format).' },
  { id: 'gc_narrative', category: 'Project Planning', doc: 'Generic Project Narrative Skeleton', whyNeeded: 'A pre-drafted story about your rescue\'s mission, geographic reach, and unique community values.' },
  { id: 'gc_quotes', category: 'Project Planning', doc: 'Supplier/Equipment Pricing Quotes', whyNeeded: 'Essential if you are applying to purchase surgical tools, cages, food pallets, or transport vehicles.' }
];

export function RescueGrants() {
  const [activeTab, setActiveTab] = useState<'board' | 'checklist' | 'copypaste' | 'assistant' | 'tracker'>('board');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // SEARCH & FILTER
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // GRID CHECKLIST STATE
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_grant_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // CLIPBOARD DETAILS FOR QUICK COPY
  const [orgDetails, setOrgDetails] = useState({
    legalName: 'Cozy Paws Rescue Initiative',
    ein: '12-3456789',
    foundedYear: '2021',
    boardChair: 'Sarah Jenkins',
    partnerVeterinary: 'Riverside Animal Clinic',
    annualOperatingCost: '$75,000',
    geographicScope: 'Greater Metro and Surrounding Tri-County Area'
  });

  // TRACKED GRANTS STATE
  interface TrackedGrant {
    id: string;
    grantName: string;
    fundingTarget: string;
    deadline: string;
    status: 'Drafting' | 'Submitted' | 'Awarded' | 'Declined';
    notes: string;
  }

  const [trackedGrants, setTrackedGrants] = useState<TrackedGrant[]>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_tracked_grants');
      return saved ? JSON.parse(saved) : [
        { id: 'tr_1', grantName: 'Petco Love Lifesaving Operations', fundingTarget: '$25,000', deadline: 'July 15, 2026', status: 'Drafting', notes: 'Working on getting veterinary surgical stats together.' }
      ];
    } catch {
      return [];
    }
  });

  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackAmount, setNewTrackAmount] = useState('');
  const [newTrackDeadline, setNewTrackDeadline] = useState('');
  const [newTrackStatus, setNewTrackStatus] = useState<'Drafting' | 'Submitted' | 'Awarded' | 'Declined'>('Drafting');
  const [newTrackNotes, setNewTrackNotes] = useState('');

  // SKELETON PROPOSAL PROMPT BUILDER STATE
  const [proposalFocus, setProposalFocus] = useState<'medical' | 'spay_neuter' | 'operations' | 'seniors'>('spay_neuter');
  const [targetCount, setTargetCount] = useState<string>('150');
  const [fundsRequested, setFundsRequested] = useState<string>('15,000');
  const [specificNeed, setSpecificNeed] = useState<string>('overwhelming feral cat population and long vet waitlists');
  const [generatedNarrative, setGeneratedNarrative] = useState<string>('');

  useEffect(() => {
    // Keep checklist synced in LocalStorage
    localStorage.setItem('rescuekit_grant_checklist', JSON.stringify(checkedDocs));
  }, [checkedDocs]);

  useEffect(() => {
    // Keep tracked grants synced
    localStorage.setItem('rescuekit_tracked_grants', JSON.stringify(trackedGrants));
  }, [trackedGrants]);

  // Handle document checkbox toggle
  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Quick field copy
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // Add customized grant to tracker
  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackName) return;
    const item: TrackedGrant = {
      id: 'tr_' + Date.now(),
      grantName: newTrackName,
      fundingTarget: newTrackAmount || '$0',
      deadline: newTrackDeadline || 'Rolling',
      status: newTrackStatus,
      notes: newTrackNotes
    };
    setTrackedGrants([...trackedGrants, item]);
    setNewTrackName('');
    setNewTrackAmount('');
    setNewTrackDeadline('');
    setNewTrackNotes('');
  };

  const handleTrackAutomatic = (grant: Grant) => {
    // Check if already tracking
    if (trackedGrants.some(g => g.grantName.toLowerCase() === grant.name.toLowerCase() || g.grantName.includes(grant.provider))) {
      alert(`"${grant.name}" is already being tracked in your tracker!`);
      return;
    }
    const item: TrackedGrant = {
      id: 'tr_' + Date.now(),
      grantName: `${grant.provider} - ${grant.name}`,
      fundingTarget: grant.maxAmount,
      deadline: grant.deadline,
      status: 'Drafting',
      notes: `Imported from active rescue grants list. Category: ${grant.category}`
    };
    setTrackedGrants([...trackedGrants, item]);
    setActiveTab('tracker');
  };

  const handleRemoveTrack = (id: string) => {
    setTrackedGrants(trackedGrants.filter(g => g.id !== id));
  };

  const updateTrackStatus = (id: string, stat: 'Drafting' | 'Submitted' | 'Awarded' | 'Declined') => {
    setTrackedGrants(trackedGrants.map(g => g.id === id ? { ...g, status: stat } : g));
  };

  // Generate customized proposal skeleton draft
  const triggerGenerateProposal = () => {
    let focusTitle = '';
    let objectiveText = '';
    let metricDescription = '';

    if (proposalFocus === 'spay_neuter') {
      focusTitle = 'Lifesaving Community Spay & Neuter Campaign';
      objectiveText = `Our key target is to establish a preventative surgical campaign focusing on sterilizing and microchipping and return programs for stray/feral cats. Our county currently experiences a steep surplus of spring litters. By administering targeted surgery to ${targetCount} animals, we will proactively stop downstream shelter intakes.`;
      metricDescription = `We plan to partner with registered veterinary surgeons to schedule regular clinical blocks, measuring success by comparing monthly neonate intakes at our local high-kill municipal facility over the course of the next twelve months.`;
    } else if (proposalFocus === 'medical') {
      focusTitle = 'Emergency Medical & Lifesaving Veterinary Fund';
      objectiveText = `We are establishing a designated medical emergency shelter fund to bypass the tragic euthanization of injured or treatable animals due to short-term lack of clinics. With standard veterinary intakes costing $400 - $1,100 per surgery, these requested funds will assist approximately ${targetCount} highly vulnerable, local rescue animals.`;
      metricDescription = `All diagnostic reports, radiographs, veterinary clinic bills, and post-operative digital foster adoption outcomes will be logged in our digital database to verify proper application of the funding.`;
    } else if (proposalFocus === 'operations') {
      focusTitle = 'Foster Volunteer Acceleration Program';
      objectiveText = `By providing premium physical supplies (collars, crates, towels, puppy kits, enzyme sanitizers, medicine) to our expanding network of foster parents, we aim to eliminate the barrier of out-of-pocket costs that discourage families from opening their doors. This grant will help provide comfortable supplies to stabilize ${targetCount} active foster animals.`;
      metricDescription = `We track foster lengths-of-stay, training success, digital promotional flyer downloads, and direct post-decompression adoption speeds.`;
    } else if (proposalFocus === 'seniors') {
      focusTitle = 'Hospice Care Strategy and Senior Sanctuary';
      objectiveText = `Older dogs represent a highly vulnerable shelter population due to chronic pain thresholds, dental decay, and higher initial inspection costs. This project will enable us to take in ${targetCount} older/hospice dogs, supplying them with high-cost prescription diets, specialized senior mobility drugs, and dental procedures.`;
      metricDescription = `We track canine health metrics, physical discomfort indicators, and adoption placements for elder sanctuary dogs.`;
    }

    const template = `PROJECT PROPOSAL SKELETON

ORGANIZATION: ${orgDetails.legalName}
TAX STATUS: 501(c)(3) Non-Profit | EIN: ${orgDetails.ein}
PROJECT TITLE: ${focusTitle}
TOTAL REQUESTED AMOUNT: \$${fundsRequested}

I. EXECUTIVE SUMMARY & MISSION STATEMENT
${orgDetails.legalName} operates as a compassionate, volunteer-led rescue organization servicing the ${orgDetails.geographicScope}. Founded in ${orgDetails.foundedYear}, we are dedicated to resolving high shelter shelter euthanization rates. We are seeking \$${fundsRequested} to launch our innovative project: "${focusTitle}". Today, the major hurdle confronting our community is ${specificNeed}, and this program provides a direct, measurable path toward sustainable rescue relief.

II. STRATEGIC OBJECTIVES & PLAN OF WORK
${objectiveText}

III. CRITICAL EXPENSE BREAKOUT EST. BUDGET
- Professional Veterinary/Clinic Labor (Surgeries, consults): Approximately 60% (\$${(parseFloat(fundsRequested.replace(/,/g, '')) * 0.6).toLocaleString()})
- Necessary Supplies & Medicine (Pain killers, vaccines, microchips, diapers): Approximately 25% (\$${(parseFloat(fundsRequested.replace(/,/g, '')) * 0.25).toLocaleString()})
- Community Education & Foster Flyers Outreach: Approximately 15% (\$${(parseFloat(fundsRequested.replace(/,/g, '')) * 0.15).toLocaleString()})

IV. MEASURABLE KEY PERFORMANCE INDICATORS (MEASURES OF SUCCESS)
${metricDescription}

V. CONCLUSION & CONTACT INFO
On behalf of the volunteers, directors, and the animals whose lives are made possible by your generosity, thank you for reviewing our funding request.
NAME: ${orgDetails.boardChair} (Board Chair Representative)
PRIMARY CLINIC: ${orgDetails.partnerVeterinary}`;

    setGeneratedNarrative(template);
  };

  // Pre-generate a skeleton narrative on mount/focus toggled
  useEffect(() => {
    triggerGenerateProposal();
  }, [proposalFocus, targetCount, fundsRequested, specificNeed, orgDetails]);

  // Handle live filtered list of available grants
  const filteredGrants = CONST_GRANTS.filter(g => {
    const matchesSearch = g.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || g.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="rescue-grants-component" className="w-full bg-white border border-sky-100 rounded-2xl md:rounded-3xl p-6 shadow-sm no-print font-sans">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50/20 p-6 rounded-2xl md:rounded-3xl border border-sky-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 inline-block mb-1.5">
            🔑 RescueKit Strategic Funding
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">RescueKit's Grant Hub</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Tips & Tricks for grant writing and animal rescue funding</p>
        </div>
        <div className="hidden md:block text-right bg-white p-2.5 px-4 rounded-xl border border-sky-100 shrink-0">
          <span className="text-[10px] font-black text-indigo-600 block">Current Operating Budget Details Safe locally</span>
          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Simplify Applications & Boost Success Rates</span>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-row overflow-x-auto whitespace-nowrap scroll-hide flex-nowrap lg:flex-wrap gap-1.5 bg-sky-50/70 p-1 rounded-2xl border border-sky-100 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('board')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all ${
            activeTab === 'board' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💰 Grants Board
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1 ${
            activeTab === 'checklist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 Readiness Checklist
          <span className="text-[9px] bg-indigo-100 text-indigo-800 rounded-full px-1.5 py-0.2 select-none group-hover:bg-indigo-200">
            {Object.values(checkedDocs).filter(Boolean).length} done
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('copypaste')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all ${
            activeTab === 'copypaste' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📎 Quick-Copy Card
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assistant')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all ${
            activeTab === 'assistant' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📝 Proposal Draft Generator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tracker')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'tracker' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📅 Applications Tracker
          <span className="text-[10px] bg-slate-900 text-white rounded-full px-1.5 py-0.2 font-mono">
            {trackedGrants.length}
          </span>
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT RENDERING BASED ON ACTIVE TAB */}

      {/* BOARD INDEX */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <div className="bg-sky-50/50 p-4 border rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:max-w-md bg-white border border-sky-100 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search active rescue opportunities (e.g. Petco, Maddie's)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs font-medium focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase">CATEGORY:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs font-bold border border-sky-100 bg-white rounded-xl py-1 px-3 focus:outline-none text-slate-700 select-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Spay/Neuter">Spay/Neuter</option>
                <option value="Veterinary & Seniors">Veterinary & Seniors</option>
                <option value="Disaster & Capital">Disaster / Emergency</option>
                <option value="General Operations">General Operations</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGrants.map(grant => (
              <div key={grant.id} className="border border-sky-100 hover:border-indigo-200 rounded-2xl p-5 bg-white transition-all shadow-xs hover:shadow-sm duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="inline-block bg-sky-50 text-indigo-700 border border-sky-100 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      {grant.category}
                    </span>
                    <span className="text-emerald-600 font-black text-sm tracking-tight flex items-center gap-0.5">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                      Up to {grant.maxAmount}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{grant.provider}</h3>
                  <h4 className="font-bold text-indigo-600 text-xs mt-0.5">{grant.name}</h4>
                  
                  <p className="text-[11px] text-stone-500 font-semibold leading-relaxed mt-3 mb-4">{grant.description}</p>
                  
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 mb-4">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1">RECOMMENDED ATTACHMENTS</span>
                    <div className="flex flex-wrap gap-1">
                      {grant.requirements.map((req, i) => (
                        <span key={i} className="text-[9px] font-bold bg-white border text-stone-600 px-2 py-0.5 rounded-lg">
                          📎 {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 mt-1.5">
                  <span className="text-[10px] font-black text-rose-500 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    Deadline: {grant.deadline}
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={grant.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline inline-flex items-center gap-1 cursor-pointer text-[10px] font-black bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white rounded-xl px-3 py-1.5 transition-all shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Apply Online</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleTrackAutomatic(grant)}
                      className="cursor-pointer text-[10px] font-black bg-indigo-50 border border-indigo-150 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl px-3 py-1.5 transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Track Status</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredGrants.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12 border border-dashed rounded-3xl bg-slate-50 p-6">
                <AlertCircle className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                <h4 className="text-slate-700 text-sm font-bold">No active grants found matching search params</h4>
                <p className="text-xs text-slate-400 mt-1">Try broadening your category filter or adjusting your search term.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* READINESS CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                Animal Rescue Grant Readiness Checklist
              </h3>
              <p className="text-xs text-emerald-800 font-medium leading-relaxed mt-1">
                Before writing any foundation application, safeguard and verify these common requirements to avoid last-minute portal stress.
              </p>
            </div>
            <div className="bg-white/95 border rounded-2xl px-5 py-2.5 text-center shrink-0">
              <span className="text-xl font-mono font-black text-emerald-700">
                {Object.values(checkedDocs).filter(Boolean).length} / {CHECKLIST_ITEMS.length}
              </span>
              <span className="text-[9px] text-slate-400 block font-bold mt-0.5">REQUIRED DOCS READY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Legal Documents', 'Financial & Org Data', 'Project Planning'] as const).map(cat => (
              <div key={cat} className="space-y-3 p-4 bg-sky-50/20 border border-sky-100 rounded-2xl">
                <h4 className="font-extrabold text-slate-800 text-xs border-b pb-1.5 flex justify-between items-center text-indigo-700">
                  <span>{cat}</span>
                  <span className="text-[10px] bg-slate-250 px-2 py-0.5 rounded-full font-mono font-bold text-stone-600">
                    {CHECKLIST_ITEMS.filter(c => c.category === cat && checkedDocs[c.id]).length} / {CHECKLIST_ITEMS.filter(c => c.category === cat).length}
                  </span>
                </h4>
                <div className="space-y-2.5">
                  {CHECKLIST_ITEMS.filter(c => c.category === cat).map(item => {
                    const isChecked = checkedDocs[item.id] || false;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => toggleDoc(item.id)}
                        className={`cursor-pointer border p-3 rounded-xl transition-all flex items-start gap-2.5 text-left font-sans select-none ${
                          isChecked 
                            ? 'bg-emerald-50/50 border-emerald-250' 
                            : 'bg-white hover:bg-slate-50 border-slate-150'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5 text-slate-500">
                          {isChecked ? (
                            <CheckSquare className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4.5 h-4.5 shrink-0" />
                          )}
                        </div>
                        <div>
                          <h5 className={`text-[11px] font-extrabold font-sans leading-tight ${isChecked ? 'text-emerald-950 line-through decoration-emerald-200' : 'text-slate-800'}`}>
                            {item.doc}
                          </h5>
                          <p className="text-[9px] font-medium leading-relaxed text-slate-400 mt-1">
                            {item.whyNeeded}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-sky-50 border rounded-xl flex items-start gap-3 mt-4">
            <span className="text-xl">💡</span>
            <div className="text-[11px] font-semibold text-sky-950/80 leading-relaxed font-sans">
              <strong>Volunteer Secret:</strong> Create a secret, shared Google Drive folder titled <strong>"Grant Application Library"</strong>. Drop high-resolution versions of all 10 checked files above into that root, and generate a shared link. Whenever a foundation grants portal presents itself, you will have every single resource right at your fingertips!
            </div>
          </div>
        </div>
      )}

      {/* QUICK COPY CARD */}
      {activeTab === 'copypaste' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Rescue legal details Clipboard Cabinet</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Save your rescue's specific metadata below. When filling online grant systems, simply click to copy any field instantly! Saves your volunteer's time.
              </p>
            </div>
            <div className="text-[10px] bg-slate-100 p-2 rounded-xl text-stone-500 font-bold shrink-0">
              🔒 Form values persist locally in your browser
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Editing settings form */}
            <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/40">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                ⚙️ Setup Rescue Metadata Values
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-500">Rescue Entity Full Legal Name</label>
                  <input
                    type="text"
                    value={orgDetails.legalName}
                    onChange={e => setOrgDetails({ ...orgDetails, legalName: e.target.value })}
                    className="w-full border p-2 text-xs font-semibold rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Tax ID / EIN Number</label>
                  <input
                    type="text"
                    value={orgDetails.ein}
                    onChange={e => setOrgDetails({ ...orgDetails, ein: e.target.value })}
                    className="w-full border p-2 text-xs font-mono font-bold rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Year Founded</label>
                  <input
                    type="text"
                    value={orgDetails.foundedYear}
                    onChange={e => setOrgDetails({ ...orgDetails, foundedYear: e.target.value })}
                    className="w-full border p-2 text-xs font-semibold rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Board Chair Rep Name</label>
                  <input
                    type="text"
                    value={orgDetails.boardChair}
                    onChange={e => setOrgDetails({ ...orgDetails, boardChair: e.target.value })}
                    className="w-full border p-2 text-xs font-semibold rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Partner Vet Clinic</label>
                  <input
                    type="text"
                    value={orgDetails.partnerVeterinary}
                    onChange={e => setOrgDetails({ ...orgDetails, partnerVeterinary: e.target.value })}
                    className="w-full border p-2 text-xs font-semibold rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Est. Operating Budget</label>
                  <input
                    type="text"
                    value={orgDetails.annualOperatingCost}
                    onChange={e => setOrgDetails({ ...orgDetails, annualOperatingCost: e.target.value })}
                    className="w-full border p-2 text-xs font-semibold rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Geographic Scope Area</label>
                  <input
                    type="text"
                    value={orgDetails.geographicScope}
                    onChange={e => setOrgDetails({ ...orgDetails, geographicScope: e.target.value })}
                    className="w-full border p-2 text-xs font-semibold rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Cabinet Display with Click-to-copy handlers */}
            <div className="space-y-2 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider pl-1">LAUNCHER SHELTER CABINET ITEMS</span>
              
              <div className="space-y-2">
                {[
                  { label: 'Legal Non-Profit Name', val: orgDetails.legalName, id: 'l_nm' },
                  { label: 'Tax Identification (EIN)', val: orgDetails.ein, id: 'l_ein', mono: true },
                  { label: 'Founded Baseline Year', val: orgDetails.foundedYear, id: 'l_fnd' },
                  { label: 'Board Chair Representative', val: orgDetails.boardChair, id: 'l_sar' },
                  { label: 'Partnered Veterinary Base', val: orgDetails.partnerVeterinary, id: 'l_riv' },
                  { label: 'Est. Annual Working Budget', val: orgDetails.annualOperatingCost, id: 'l_ann' },
                  { label: 'Rescue Target Jurisdiction', val: orgDetails.geographicScope, id: 'l_geo' }
                ].map(field => (
                  <div key={field.id} className="border rounded-xl p-3 bg-white flex items-center justify-between gap-4 h-14 hover:bg-sky-50/20 transition-colors">
                    <div className="truncate">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">{field.label}</span>
                      <span className={`text-[11px] font-semibold text-slate-800 block truncate ${field.mono ? 'font-mono text-indigo-700' : ''}`}>{field.val}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(field.val, field.id)}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-black shrink-0 transition-all flex items-center gap-1 ${
                        copiedField === field.id 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 hover:bg-indigo-50 border hover:border-indigo-150 text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      {copiedField === field.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL GENERATOR ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50/40 to-sky-50/40 border border-sky-100 p-5 rounded-2xl flex items-start gap-3.5">
            <div className="p-2.5 bg-indigo-600 text-white h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Dynamic Grant Proposal Skeleton Builder</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-semibold mt-1">
                Having writer\'s block? Standardize your narrative. Select your focus category, specify metrics, and our system will craft a professionally aligned cover letter draft.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Control Panel inputs */}
            <div className="md:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border">
              <h4 className="font-extrabold text-xs text-indigo-950 flex items-center gap-1 tracking-wider uppercase">
                📝 Customize Project Scope Metrics
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Project Focus Theme</label>
                  <select
                    value={proposalFocus}
                    onChange={e => setProposalFocus(e.target.value as any)}
                    className="w-full border p-2 font-bold rounded-lg bg-white select-none cursor-pointer text-slate-700"
                  >
                    <option value="spay_neuter">🐈 Stray Trap-Neuter-Return & Spay Fund</option>
                    <option value="medical">🚑 Emergency Critical Veterinary Fund</option>
                    <option value="operations">🏡 Foster Parent Essential Care Packs</option>
                    <option value="seniors">🐕 Senior Dog & Comfort Care Campaign</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Requested Sum ($)</label>
                    <input
                      type="text"
                      placeholder="e.g. 15,000"
                      value={fundsRequested}
                      onChange={e => setFundsRequested(e.target.value)}
                      className="w-full border p-2 font-bold font-mono rounded-lg default-placeholder focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Impact Volume (Pets)</label>
                    <input
                      type="text"
                      placeholder="e.g. 150"
                      value={targetCount}
                      onChange={e => setTargetCount(e.target.value)}
                      className="w-full border p-2 font-bold font-mono rounded-lg default-placeholder focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Major Challenge being Combated</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. high shelter surrender rates during kitten season and long vet waiting queues"
                    value={specificNeed}
                    onChange={e => setSpecificNeed(e.target.value)}
                    className="w-full border p-2 font-semibold bg-white rounded-lg focus:outline-none default-placeholder font-sans"
                  />
                </div>

                <div className="p-3 bg-white border rounded-xl font-mono text-[9px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-500">Automatic Variables Utilized:</span>
                  <p>• Board Chair: {orgDetails.boardChair}</p>
                  <p>• Partner Vet: {orgDetails.partnerVeterinary}</p>
                </div>
              </div>
            </div>

            {/* Narrative output */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex justify-between items-center bg-slate-100 px-4 py-2 rounded-xl text-stone-500 font-bold text-xs border">
                <span className="flex items-center gap-1.5 font-black text-slate-700">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  Your Draft Proposal Skeleton
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(generatedNarrative, 'proposal_draft')}
                  className={`cursor-pointer px-3 py-1.5 text-[10px] rounded-lg font-black transition-all flex items-center gap-1 ${
                    copiedField === 'proposal_draft' 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-white hover:bg-slate-50 border text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  {copiedField === 'proposal_draft' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Draft!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Skeleton</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={generatedNarrative}
                readOnly
                rows={14}
                className="w-full p-4 border border-indigo-100 rounded-xl bg-indigo-50/10 text-[10.5px] leading-relaxed font-mono focus:outline-none select-text shadow-inner block text-slate-700"
              />
              <p className="text-[10px] text-slate-400 font-bold font-sans italic pl-1 leading-snug">
                🚨 Disclaimer: This outline represents standard project objectives, budgets, and criteria. Review, modify and align metrics with your exact veterinary agreements prior to formal submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TRACKER TAB */}
      {activeTab === 'tracker' && (
        <div className="space-y-4 font-sans">
          
          <div className="bg-sky-50/50 border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="text-left font-sans">
              <h3 className="font-extrabold text-slate-900 text-sm">RescueKit Grant Application Tracker</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Maintain internal logs on pending deadlines, drafts status, and aggregate wins to maintain accountability.</p>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-3 px-5 text-center shrink-0 min-w-[150px] border border-slate-950">
              <span className="text-xl font-mono font-extrabold text-emerald-400">
                ${trackedGrants
                  .filter(g => g.status === 'Awarded')
                  .reduce((acc, curr) => {
                    const cleanAmount = parseInt(curr.fundingTarget.replace(/[^0-9]/g, '')) || 0;
                    return acc + cleanAmount;
                  }, 0)
                  .toLocaleString()}
              </span>
              <span className="text-[9px] tracking-wider text-slate-400 block font-black uppercase mt-0.5">AGGREGATE WON FUNDS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Applications Logger Form */}
            <form onSubmit={handleAddTrack} className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border space-y-3.5">
              <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider">
                📌 Log New Application Process
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Grant Foundation Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ASPCA Emergency Relief"
                    value={newTrackName}
                    onChange={e => setNewTrackName(e.target.value)}
                    className="w-full border p-2 rounded-lg font-semibold bg-white focus:outline-none default-placeholder"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Requested Amount</label>
                    <input
                      type="text"
                      placeholder="e.g. $10,000"
                      value={newTrackAmount}
                      onChange={e => setNewTrackAmount(e.target.value)}
                      className="w-full border p-2 rounded-lg font-bold font-mono bg-white focus:outline-none default-placeholder"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Submission Date</label>
                    <input
                      type="text"
                      placeholder="e.g. July 15"
                      value={newTrackDeadline}
                      onChange={e => setNewTrackDeadline(e.target.value)}
                      className="w-full border p-2 rounded-lg font-bold bg-white focus:outline-none default-placeholder"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Stage Status</label>
                  <select
                    value={newTrackStatus}
                    onChange={e => setNewTrackStatus(e.target.value as any)}
                    className="w-full border p-2 font-bold cursor-pointer rounded-lg bg-white select-none text-slate-700"
                  >
                    <option value="Drafting">📝 Drafting Proposal</option>
                    <option value="Submitted">🚀 Submitted (Pending)</option>
                    <option value="Awarded">🏆 Awarded (Won 🎉)</option>
                    <option value="Declined">❌ Declined (Better luck next turn)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Internal Task Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Needs board approval of dentist quotation draft."
                    value={newTrackNotes}
                    onChange={e => setNewTrackNotes(e.target.value)}
                    className="w-full border p-2 font-semibold bg-white rounded-lg focus:outline-none default-placeholder font-sans text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log to Interactive Tracker</span>
                </button>
              </div>
            </form>

            {/* Submissions tracker table display */}
            <div className="lg:col-span-8 overflow-x-auto border border-sky-50 rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left text-xs text-stone-600 border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-extrabold border-b tracking-wider uppercase">
                    <th className="p-3">Application details</th>
                    <th className="p-3">Requested / Target Goal</th>
                    <th className="p-3">Due / Deadline</th>
                    <th className="p-3">Process Status</th>
                    <th className="p-3 text-right">Task Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[11px] text-stone-700">
                  {trackedGrants.map(tr => (
                    <tr key={tr.id} className="hover:bg-sky-50/10">
                      <td className="p-3 max-w-[200px]">
                        <span className="font-extrabold text-slate-900 block truncate">{tr.grantName}</span>
                        <span className="text-[10px] text-slate-400 block truncate font-medium mt-0.5">{tr.notes || 'No notes loaded'}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600">
                        {tr.fundingTarget}
                      </td>
                      <td className="p-3 font-medium text-slate-500 whitespace-nowrap">
                        {tr.deadline}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <select
                          value={tr.status}
                          onChange={e => updateTrackStatus(tr.id, e.target.value as any)}
                          className={`cursor-pointer max-w-[140px] text-[10px] font-black border rounded-lg px-2 py-1 select-none focus:outline-none ${
                            tr.status === 'Awarded' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : tr.status === 'Submitted'
                              ? 'bg-sky-50 border-sky-100 text-indigo-700' 
                              : tr.status === 'Declined'
                              ? 'bg-rose-50 border-rose-100 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}
                        >
                          <option value="Drafting">📝 Drafting</option>
                          <option value="Submitted">🚀 Submitted</option>
                          <option value="Awarded">🏆 Awarded</option>
                          <option value="Declined">❌ Declined</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(tr.id)}
                          className="cursor-pointer text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors inline-block"
                          title="Delete application entry"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {trackedGrants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 font-bold">
                        No active submissions logged in your tracker. Log or import options above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
