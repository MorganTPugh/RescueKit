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
  AlertCircle,
  ShieldAlert,
  Monitor,
  FolderLock,
  Download
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
];

export interface RedFlagAuditItem {
  id: string;
  title: string;
  description: string;
  mitigation: string;
}

const RED_FLAG_AUDIT_ITEMS: RedFlagAuditItem[] = [
  {
    id: 'rf_operating_costs',
    title: 'Operating vs. Program Costs Verification',
    description: 'Did you check to verify whether this funder welcomes general operating cost requests or explicitly restricts funding to direct project/program costs?',
    mitigation: 'If restricted, purge any general office rent, staff salaries, or indirect utility line items from your request and direct 100% of the funds to animal medical care and direct rescue supplies.'
  },
  {
    id: 'rf_budget_congruence',
    title: 'Financial Math Symmetry',
    description: 'Do your itemized line item expenses sum up to the exact requested cash amount stated in the Cover Letter and Executive Summary?',
    mitigation: 'Double or triple check the columns! A discrepancy of even one single dollar triggers immediate donor suspicion about organizational competency.'
  },
  {
    id: 'rf_ein_letter',
    title: 'Official IRS Name Matching',
    description: 'Does your rescue name inputted on the portal match the exact spelled legal name on your IRS 501(c)(3) determination letter and state registry?',
    mitigation: 'If your public name is different, enter your registered corporate entity name followed by "DBA" (Doing Business As) to prevent automated EIN screening denials.'
  },
  {
    id: 'rf_geographic_jurisdiction',
    title: 'Stated County & Regional Priority Check',
    description: 'Does your rescue actively service, rescue, or place animals within the exact geography, county list, or zip codes designated by this funder\'s guidelines?',
    mitigation: 'Funders rarely make exceptions. If you operate in adjacent areas, explicitly highlight any transport programs or incoming transfer partnerships with their target county\'s public shelter.'
  },
  {
    id: 'rf_stakeholder_verification',
    title: 'Stakeholder Integration Check',
    description: 'Did you involve and listen to frontline shelter stakeholders, animal control staff, or partner vets to align your proposal with the actual local crisis?',
    mitigation: 'Incorporate real regional municipal stats rather than emotional generalizations. Make sure local shelter managers and lead volunteers verify that your workflow solves their real operational bottleneck.'
  },
  {
    id: 'rf_timeline_alignment',
    title: 'Timeline to Expense Parallelism',
    description: 'Does your Operations Timeline (Step 4) span the exact same billing duration as your Line-Item Budget (Step 6)?',
    mitigation: 'If your timeline describes a 12-month community TNR program but your clinical veterinary budget only details a 3-month supply batch, align them to reflect continuous funding allocation.'
  },
  {
    id: 'rf_omb_allowable',
    title: 'OMB Code & Allowable Cost Standards',
    description: 'Are your listed expenses strictly reasonable, prudent, and allowable, completely free from vague "slush funds" or flat "contingency buffers"?',
    mitigation: 'Label every single dollar clearly. Instead of adding "$1,000 for unforeseen issues," detail $1,000 for emergency post-operative care with an active average veterinarian tier pricing narrative.'
  },
  {
    id: 'rf_duplicate_profiles',
    title: 'Multiple Portal Accounts Prevention',
    description: 'If your organization applied to this grantmaker in previous years, are you using the exact same login credential rather than spawning a duplicate?',
    mitigation: 'Contact the program officer or use "Forgot Password" to retrieve the historical organization record. Creating duplicate accounts divides your submission history and confuses the trustee review panel.'
  }
];

const BEST_PRACTICES_STEPS = [
  {
    number: 1,
    title: "1. Cover Letter & Profile",
    subtitle: "Introduction & Setup",
    short: "Signed introductory cover sheet, legal identity and tax status (EIN) verification.",
    bestPractice: "Your Cover Letter is the funder's critical first impression. It must concisely introduce your rescue, outline how your project directly intersects the funder's stated charitable goals, state the exact requested dollar amount, and be signed by an authorized representative like the Board President. Test browser and portal compatibility right away to avoid last-minute glitches.",
    proTip: "Address trust heads by name—never use generic greetings. Involve key stakeholders to address their needs early. Always use the same login and account profile if you have applied to this funder before to preserve your organization's historic records."
  },
  {
    number: 2,
    title: "2. Executive Summary",
    subtitle: "The Project Summary",
    short: "Construct a condensed, high-impact synthesis of the entire proposal.",
    bestPractice: "Reviewers utilize the Executive Summary or Abstract to rapidly filter bids. Professional grant writers advise drafting this section absolutely last after your plan is complete, keeping it highly skimmable and crystal clear. Don't feel pressured to use all the character space given—concise, complete responses are highly appreciated.",
    proTip: "Realize the high risk of session timeout and saving drafts in online forms—always draft offline in an external editor first, then copy-paste. Highlight in bold: 1) the local rescue problem, 2) exact program methods, 3) previous results, and 4) the requested cash amount."
  },
  {
    number: 3,
    title: "3. Statement of Need",
    subtitle: "The Localized Crisis",
    short: "Objective regional data and shelter statistics proving the core problem.",
    bestPractice: "The Statement of Need defines the regional problem with authoritative regional data rather than emotional hyperbole. Secure trust by maintaining a highly objective voice, citing local intakes, municipal euthanasia rates, and direct statistical trends. Ensure all elements—from cover letter to budget—tell the same story.",
    proTip: "Avoid weak qualifiers like 'we hope to resolve the sad crisis.' Use active verbs and establish a direct logical path: connect the local 34% puppy/kitten intake surge directly to the shortage of regional low-cost veterinary clinics, and actively listen to regional stakeholders."
  },
  {
    number: 4,
    title: "4. Plan of Work & Timeline",
    subtitle: "Operations & Timeline",
    short: "Tactical workflows, staff responsibilities, and monthly chronological milestones.",
    bestPractice: "Your Plan of Work outlines your specific methods, showing who coordinates each step, when milestones occur, and where custody shifts. Set a clear timeline for proposal development and submission, including tasks and assignments for other staff whose input and knowledge you will need.",
    proTip: "Review character restrictions of the online portal. Format with readable simple bullets, spacing, and blank lines. Limit abbreviations and don't skimp on proper punctuation to ensure tired reviewers can easily digest your timeline at a glance."
  },
  {
    number: 5,
    title: "5. Org Qualifications",
    subtitle: "Capability & Background",
    short: "Proof of organizational leadership, board oversight, and past performance.",
    bestPractice: "Qualifications demonstrate that your rescue is the absolute best candidate to execute this grant. Detail past performance achievements, strong board governance, active volunteer databases, and existing physical infrastructure. Develop modular 'boiler plate' narratives that can be easily modified to save time.",
    proTip: "Write in a confident, active tone (e.g., 'Grateful Paws operates 45 active foster locations'). Never self-edit: find a colleague or peer reviewer who can critically review your work and compare it directly to the grantmaker's guidelines."
  },
  {
    number: 6,
    title: "6. Budget & Narrative",
    subtitle: "Transparent Math",
    short: "Itemized program expenditures and explicit text justifications.",
    bestPractice: "Your budget arithmetic must be 100% consistent with the plan of work narrative. Funder boards look for a rigorous, itemized cost structure—ensuring every proposed program expense is explicitly justified. If a template is provided for any part of the application, such as the funder's budget format, always use it.",
    proTip: "Double or triple check your budget math! If your numbers do not add up, your application may not be considered. Explain your expenses clearly in a way that promotes basic cost principles under OMB guidelines: ensuring they are reasonable, prudent, and allowable."
  },
  {
    number: 7,
    title: "7. Performance KPIs",
    subtitle: "Measurable Outcomes",
    short: "Quantitative process metrics and qualitative community success markers.",
    bestPractice: "Performance evaluations must map directly back to your initial statement of need. Connect process metrics (animals sterilized) clearly with outcome-oriented results (longterm municipal shelter intake reduction). Confirm all elements of the application tell the exact same story.",
    proTip: "Specify the exact tracking instruments (e.g., Kennel Connection or Shelterluv database logs), reporting intervals, and final audit checkpoints. This demonstrates that you maintain complete programmatic accountability from day one."
  },
  {
    number: 8,
    title: "8. Project Sustainability",
    subtitle: "Future Continuity Plan",
    short: "Roadmap to maintain programmatic momentum once grant funding is spent.",
    bestPractice: "Funder trustees prioritize projects that maintain programmatic momentum after the initial grant funds are spent. Proactively clarify diversified financial pipelines to assure long-term project viability, maintaining continuous stakeholder involvement.",
    proTip: "Address sustainability head-on by detailing three specific future sources: monthly recurring micro-donor circles, nominal safety-net adoption fee write-backs, and municipal programmatic co-funding contract strategies. If you forget your funder account details, request a recovery instead of duplicates."
  }
];

const OUTLINE_SKELETON = `HIGH-CONVERSION PROPOSAL OUTLINE

Organization: [Legal Non-Profit Name]
Tax Status: 501(c)(3) Public Charity | Federal EIN: [Tax ID]
Project Title: [Title of Proposed Pet Rescue Program]
Total Requested Amount: $ [Total Cash Request]

I. COVER LETTER & PROFILE (CANDID-COMPLIANT SHEET)
Date: [Submittal Date]
To: [Trustee Name or Program Officer]
    [Foundation Name / Funder Address]

Dear [Trustee or Program Officer Name],

On behalf of [Legal Non-Profit Name], we are proud to offer this grant proposal aiming to launch [Proposed Project Title]. We seek your support in the amount of $[Total Cash Request] to satisfy our immediate animal community objectives. Our mission is [Core Rescue Mission text], which directly aligns with the mission of your esteemed foundation to prioritize animal safety and veterinary healthcare.

We thank you for your compassionate review of our grant request.

Sincerely,

[Signature of Authorized Board Representative]
[Official Role / Board Title]
[Contact Email] | [Contact Telephone]

---
OFFICIAL GRANTEE IDENTIFICATION LIST:
- Registered Legal Name: [Grantee Non-Profit Name]
- 501(c)(3) Federal EIN: [EIN Number]
- Facility Physical Address: [Rescue Facility Address]
- Serviced Areas / Jurisdiction: [Geographic Counties Serviced]

II. EXECUTIVE SUMMARY (THE PROJECT SUMMARY)
[State your organization's legal name, primary rescue mission, target geographic scope, founding year, the primary objective of your project, and how this requested funding provides a direct solution.]

III. STATEMENT OF NEED (THE LOCALIZED CRISIS)
[Describe the precise localized crisis your rescue is trying to fix. Back up this necessity mathematically with localized data and shelter stats. Do not just say 'animals are in need'—demonstrate regional trends such as high seasonal surrender spikes, breed-specific regional abandonments, or municipal veterinary backlogs.]

IV. PLAN OF WORK & TIMELINE (OPERATIONS TIMELINE)
[Detail your concrete operations plan. Who does what, when, where, and how? Break down work into tactical tasks: field trapping or humanely rescuing animals, initial intake procedures, dedicated partner veterinary surgeries, foster placements, and digital family matches with monthly milestones.]

V. ORGANIZATIONAL BACKGROUND & CAPABILITY (LEADERSHIP BACKGROUND)
[Provide concrete support of your team's background, track record, active volunteer foster household count, physical resources/vehicles, and previous programmatic metrics to show you have the infrastructure to execute this project.]

VI. LINE-ITEM BUDGET & NARRATIVE (THE MATH)
- [Budget Allocation 1 - Dedicated Veterinary Care / Surgery Costs]: $ [Amount] (~60% recommended)
- [Budget Allocation 2 - Vital Medical Supplies / Sanitization Gear]: $ [Amount] (~25% recommended)
- [Budget Allocation 3 - Localized Volunteer Travel / Printing]: $ [Amount] (~15% recommended)
- TOTAL DIRECT BUDGET NARRATIVE: [Add brief math summary explaining negotiated bulk veterinary surgeon agreements and supply expenses.]

VII. EVALUATION & MEASURABLE KPIs (KPI MARKERS)
- Process KPI Metric 1: e.g., Specifically trap/sterilize/treat exactly [Target Pets] community animals.
- Outcome KPI Metric 2: e.g., Coordinate a [Target %] percentage reduction in municipal intakes or feline drop-offs.
- Evaluation Log: e.g., [Specify shelter management software used, like Shelterluv, and reporting intervals.]

VIII. FUTURE FUNDING & SUSTAINABILITY (LONG-TERM PLAN)
[Construct a realistic sustainability plan outlining how this program preserves its operational momentum once these requested grant funds are spent. Mention recurring monthly donation systems, adoption fee reinvestments, local corporate sponsors, and municipal animal welfare budget pipelines.]

IX. BOARD CONCLUSION & AUTHORIZED CONTACT
- Signature Representative: 
- Professional Role: 
- Official Email: 
- Direct Telephone Line: 
- Secure Website: `;

const SAMPLE_COMPLETED_PROPOSAL = `REAL-WORLD COMPLETED EXAMPLE (LIFESAVING COMMUNITY TNR CAMPAIGN)

Organization: Grateful Paws Rescue Initiative
Tax Status: 501(c)(3) Non-Profit | EIN: 12-3456XXX
Project Title: Lifesaving Community Spay & Neuter Campaign
Total Requested Amount: $15,000

I. COVER LETTER & PROFILE (CANDID-COMPLIANT SHEET)
Date: June 20, 2026
To: Evelyn Thorne, Program Officer
    The Thorne Charitable Foundation
    1200 Legacy Oaks Boulevard, Suite 400, Austin, TX 78701

Dear Ms. Thorne,

On behalf of Grateful Paws Rescue Initiative, we are pleased to submit this grant request of $15,000 to launch our targeted "Lifesaving Community Spay & Neuter Campaign." Our focus on high-density feral feline stabilization in high-kill zip codes aligns directly with the Thorne Charitable Foundation's deep commitment to regional animal safety and shelter euthanasia reduction.

Grateful Paws serves as a critical community safety net, and this requested funding provides an immediate, highly scalable path toward stabilizing municipal shelter intakes. We thank you for your compassionate evaluation of our grant proposal.

Sincerely,

Sarah Jenkins
Board President, Grateful Paws Rescue Initiative
sarah@gratefulpawsrescue.org | XXX-555-0192

---
OFFICIAL GRANTEE IDENTIFICATION LIST:
- Registered Legal Name: Grateful Paws Rescue Initiative
- 501(c)(3) Federal EIN: 12-3456XXX
- Facility Physical Address: 104 Willow Creek Lane, Austin, TX 78704
- Serviced Areas / Jurisdiction: Austin Metro Area / Greater Tri-County Region

II. EXECUTIVE SUMMARY (THE PROJECT SUMMARY)
Grateful Paws Rescue Initiative is a volunteer-led rescue organization servicing the Tri-County Region. Founded in 2021, we are dedicated to resolving high shelter surrender and euthanasia rates through proactive preventative medical care. We are seeking $15,000 to launch our targeted "Lifesaving Community Spay & Neuter Campaign." By offering free surgical interventions to high-density stray colonies, this program secures an immediate, highly scalable path toward stabilizing municipal shelter intakes.

III. STATEMENT OF NEED (THE LOCALIZED CRISIS)
Our micro-region is facing a critical feline population crisis. In the last twelve months, local municipal animal control facilities logged a 34% increase in feral kitten surrenders, resulting in high seasonal euthanasia of healthy litters. Local trap records show that over 800 feral cats live within three high-density suburban zip codes (78744, 78745, and 78724) where low-cost veterinary clinics are currently backlogged for over six months. Without targeted, preventative trapping and sterilization, the spring birth overflow will severely overwhelm existing volunteer foster capacities. This project directly targets these high-kill zip codes to solve the crisis at its source.

IV. PLAN OF WORK & TIMELINE (OPERATIONS TIMELINE)
Our program will deploy a highly organized, dual-stage Trap-Neuter-Return (TNR) action plan with clear milestone markers:
- Phase 1 (Months 1-3): Coordinate community outreach, train 10 trap-rescue volunteers, and set up field target zones.
- Phase 2 (Months 4-10): Conduct weekly humane trapping targeted in high-incident suburban zip codes. Riverside Veterinary Hospital will perform surgeries.
- Phase 3 (Months 11-12): Complete sterilizations, return ear-tipped animals, match socializable kittens with foster families, and log final stats.
Riverside Vet has secured dedicated weekly clinical blocks to spay/neuter, vaccinate, and microchip up to 150 community animals.

V. ORGANIZATIONAL BACKGROUND & CAPABILITY (LEADERSHIP BACKGROUND)
Grateful Paws maintains an integrated network of 45 active, gear-equipped foster homes and a 5-member board of directors with combined decades of rescue experience. Since 2021, we have successfully sterilized 420 community pets, placed over 650 shelter animals into permanent loving families, and maintained perfect financial records. Our partnership with Riverside Vet ensures we receive heavily discounted clinical rates, enabling us to maximize the mileage of every dollar awarded.

VI. LINE-ITEM BUDGET & NARRATIVE (THE MATH)
- Professional Veterinary Surgeon Fees & Clinicians Lab Work: $9,000 (60% of total)
- Core Medical Supplies, Vaccines, Microchips, and Humani-Traps: $3,750 (25% of total)
- Volunteer Outreach Print, Trapper Travel Refund, & Tech Log Support: $2,250 (15% of total)
- TOTAL DIRECT BUDGET NARRATIVE: Riverside Veterinary Hospital offers a subsidized, bulk rate of $60 per feline surgery. The $15,000 fund will fully cover veterinary labor and medical overhead to safely process exactly 150 animals over twelve months, preventing thousands of future stray births. Travel is calculated at standard non-profit mileage rates for rescue routes.

VII. EVALUATION & MEASURABLE KPIs (KPI MARKERS)
- Process KPI Metric 1: Trapping, sterilizing, and vaccinating exactly 150 feral/stray community cats over 12 months.
- Outcome KPI Metric 2: Achieving a 15% reduction in municipal kitten surrenders from the target zip codes within nine months.
- Evaluation Log: All field records will be inputted weekly into Shelterluv software, with progress indices submitted at the 6-month and 12-month marks.

VIII. FUTURE FUNDING & SUSTAINABILITY (LONG-TERM PLAN)
Following the initial year of grant funding, this preventative program will be financially sustained through our established "Paws-on-the-Ground" individual monthly giving donor pipeline, which grew by 24% in Q1. Program success statistics will also be leveraged to secure recurring municipal animal welfare co-funding starting in fiscal year 2027.

IX. BOARD CONCLUSION & AUTHORIZED CONTACT
- Signature Representative: Sarah Jenkins
- Professional Role: Founder & President of Board
- Official Email: contact@gratefulpawsrescue.org
- Direct Telephone Line: XXX-555-0192
- Secure Website: https://www.gratefulpawsrescue.org`;

const OUTLINE_SECTIONS = [
  // Step 1: Cover Letter & Profile
  `I. COVER LETTER & PROFILE (CANDID-COMPLIANT SHEET)
Date: [Submittal Date]
To: [Trustee Name or Program Officer]
    [Foundation Name / Funder Address]

Dear [Trustee Name],
On behalf of [Legal Non-Profit Name], we are proud to offer this grant proposal aiming to launch [Proposed Project Title]. We seek your support in the amount of $[Total Cash Request] to satisfy our immediate animal community objectives. Our mission is [Core Rescue Mission text], which directly aligns with the mission of your esteemed foundation to prioritize animal safety and veterinary healthcare.

Sincerely,
[Signature of Authorized Board Representative]
[Official Role / Board Title]
[Contact Email] | [Contact Telephone]

---
OFFICIAL GRANTEE IDENTIFICATION LIST:
- Registered Legal Name: [Grantee Non-Profit Name]
- 501(c)(3) Federal EIN: [EIN Number]
- Facility Physical Address: [Rescue Facility Address]
- Serviced Areas / Jurisdiction: [Geographic Counties Serviced]`,

  // Step 2: Executive Summary
  `II. EXECUTIVE SUMMARY (THE PROJECT SUMMARY)
[State your organization's legal name, primary rescue mission, the targeted geographic scope, founding year, the primary objective of your project, and how this requested funding provides a direct solution.]`,

  // Step 3: Statement of Need
  `III. STATEMENT OF NEED (THE LOCALIZED CRISIS)
[Describe the precise localized crisis your rescue is trying to fix. Back up this necessity mathematically with localized data and shelter stats. Do not just say 'animals are in need'—demonstrate regional trends such as high seasonal surrender spikes, breed-specific regional abandonments, or municipal veterinary backlogs.]`,

  // Step 4: Plan of Work
  `IV. PLAN OF WORK & TIMELINE (OPERATIONS TIMELINE)
[Detail your concrete operations plan. Who does what, when, where, and how? Break down work into tactical tasks: field trapping or humanely rescuing animals, initial intake procedures, dedicated partner veterinary surgeries, foster placements, and digital family matches with monthly milestones.]`,

  // Step 5: Org Background
  `V. ORGANIZATIONAL BACKGROUND & CAPABILITY (LEADERSHIP BACKGROUND)
[Provide concrete support of your team's background, track record, active volunteer foster household count, physical resources/vehicles, and previous programmatic metrics to show you have the infrastructure to execute this project.]`,

  // Step 6: Line-Item Budget
  `VI. LINE-ITEM BUDGET & NARRATIVE (THE MATH)
- [Budget Allocation 1 - Dedicated Veterinary Care / Surgery Costs]: $ [Amount] (~60% recommended)
- [Budget Allocation 2 - Vital Medical Supplies / Sanitization Gear]: $ [Amount] (~25% recommended)
- [Budget Allocation 3 - Localized Volunteer Travel / Printing]: $ [Amount] (~15% recommended)
- TOTAL DIRECT BUDGET NARRATIVE: [Add brief math summary explaining negotiated bulk veterinary surgeon agreements and supply expenses.]`,

  // Step 7: Performance KPIs
  `VII. EVALUATION & MEASURABLE KPIs (KPI MARKERS)
- Process KPI Metric 1: e.g., Specifically trap/sterilize/treat exactly [Target Pets] community animals.
- Outcome KPI Metric 2: e.g., Coordinate a [Target %] percentage reduction in municipal intakes or feline drop-offs.
- Evaluation Log: e.g., [Specify shelter management software used, like Shelterluv, and reporting intervals.]`,

  // Step 8: Future Funding
  `VIII. FUTURE FUNDING & SUSTAINABILITY (LONG-TERM PLAN)
[Construct a realistic sustainability plan outlining how this program preserves its operational momentum once these requested grant funds are spent. Mention recurring monthly donation systems, adoption fee reinvestments, local corporate sponsors, and municipal animal welfare budget pipelines.]`
];

const SAMPLE_SECTIONS = [
  // Step 1: Cover Letter & Profile
  `I. COVER LETTER & PROFILE (CANDID-COMPLIANT SHEET)
Date: June 20, 2026
To: Evelyn Thorne, Program Officer
    The Thorne Charitable Foundation
    1200 Legacy Oaks Boulevard, Suite 400, Austin, TX 78701

Dear Ms. Thorne,
On behalf of Grateful Paws Rescue Initiative, we are pleased to submit this grant request of $15,000 to launch our targeted "Lifesaving Community Spay & Neuter Campaign." Our focus on high-density feral feline stabilization in high-kill zip codes aligns directly with the Thorne Charitable Foundation's deep commitment to regional animal safety and shelter euthanasia reduction.

Sincerely,
Sarah Jenkins
Board President, Grateful Paws Rescue Initiative
sarah@gratefulpawsrescue.org | XXX-555-0192

---
OFFICIAL GRANTEE IDENTIFICATION LIST:
- Registered Legal Name: Grateful Paws Rescue Initiative
- 501(c)(3) Federal EIN: 12-3456XXX
- Facility Physical Address: 104 Willow Creek Lane, Austin, TX 78704
- Serviced Areas / Jurisdiction: Austin Metro Area / Greater Tri-County Region`,

  // Step 2: Executive Summary
  `II. EXECUTIVE SUMMARY (THE PROJECT SUMMARY)
Grateful Paws Rescue Initiative is a volunteer-led rescue organization servicing the Tri-County Region. Founded in 2021, we are dedicated to resolving high shelter surrender and euthanasia rates through proactive preventative medical care. We are seeking $15,000 to launch our targeted "Lifesaving Community Spay & Neuter Campaign." By offering free surgical interventions to high-density stray colonies, this program secures an immediate, highly scalable path toward stabilizing municipal shelter intakes.`,

  // Step 3: Statement of Need
  `III. STATEMENT OF NEED (THE LOCALIZED CRISIS)
Our micro-region is facing a critical feline population crisis. In the last twelve months, local municipal animal control facilities logged a 34% increase in feral kitten surrenders, resulting in high seasonal euthanasia of healthy litters. Local trap records show that over 800 feral cats live within three high-density suburban zip codes (78744, 78745, and 78724) where low-cost veterinary clinics are currently backlogged for over six months. Without targeted, preventative trapping and sterilization, the spring birth overflow will severely overwhelm existing volunteer foster capacities. This project directly targets these high-kill zip codes to solve the crisis at its source.`,

  // Step 4: Project Description
  `IV. PLAN OF WORK & TIMELINE (OPERATIONS TIMELINE)
Our program will deploy a highly organized, dual-stage Trap-Neuter-Return (TNR) action plan with clear milestone markers:
- Phase 1 (Months 1-3): Coordinate community outreach, train 10 trap-rescue volunteers, and set up field target zones.
- Phase 2 (Months 4-10): Conduct weekly humane trapping targeted in high-incident suburban zip codes. Riverside Veterinary Hospital will perform surgeries.
- Phase 3 (Months 11-12): Complete sterilizations, return ear-tipped animals, match socializable kittens with foster families, and log final stats.
Riverside Vet has secured dedicated weekly clinical blocks to spay/neuter, vaccinate, and microchip up to 150 community animals.`,

  // Step 5: Org Background
  `V. ORGANIZATIONAL BACKGROUND & CAPABILITY (LEADERSHIP BACKGROUND)
Grateful Paws maintains an integrated network of 45 active, gear-equipped foster homes and a 5-member board of directors with combined decades of rescue experience. Since 2021, we have successfully sterilized 420 community pets, placed over 650 shelter animals into permanent loving families, and maintained perfect financial records. Our partnership with Riverside Vet ensures we receive heavily discounted clinical rates, enabling us to maximize the mileage of every dollar awarded.`,

  // Step 6: Line-Item Budget
  `VI. LINE-ITEM BUDGET & NARRATIVE (THE MATH)
- Professional Veterinary Surgeon Fees & Clinicians Lab Work: $9,000 (60% of total)
- Core Medical Supplies, Vaccines, Microchips, and Humani-Traps: $3,750 (25% of total)
- Volunteer Outreach Print, Trapper Travel Refund, & Tech Log Support: $2,250 (15% of total)
- TOTAL DIRECT BUDGET NARRATIVE: Riverside Veterinary Hospital offers a subsidized, bulk rate of $60 per feline surgery. The $15,000 fund will fully cover veterinary labor and medical overhead to safely process exactly 150 animals over twelve months, preventing thousands of future stray births. Travel is calculated at standard non-profit mileage rates for rescue routes.`,

  // Step 7: Performance KPIs
  `VII. EVALUATION & MEASURABLE KPIs (KPI MARKERS)
- Process KPI Metric 1: Trapping, sterilizing, and vaccinating exactly 150 feral/stray community cats over 12 months.
- Outcome KPI Metric 2: Achieving a 15% reduction in municipal kitten surrenders from the target zip codes within nine months.
- Evaluation Log: All field records will be inputted weekly into Shelterluv software, with progress indices submitted at the 6-month and 12-month marks.`,

  // Step 8: Future Funding
  `VIII. FUTURE FUNDING & SUSTAINABILITY (LONG-TERM PLAN)
Following the initial year of grant funding, this preventative program will be financially sustained through our established "Paws-on-the-Ground" individual monthly giving donor pipeline, which grew by 24% in Q1. Program success statistics will also be leveraged to secure recurring municipal animal welfare co-funding starting in fiscal year 2027.`
];

export function RescueGrants() {
  const [activeTab, setActiveTab] = useState<'board' | 'checklist' | 'copypaste' | 'assistant' | 'tracker'>('assistant');
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

  // RED FLAG AUDITOR STATE
  const [checkedAudits, setCheckedAudits] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_grant_audits');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // CLIPBOARD DETAILS FOR QUICK COPY
  const [orgDetails, setOrgDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('rescuekit_cabinet_org_details');
      return saved ? JSON.parse(saved) : {
        legalName: 'Cozy Paws Rescue Initiative',
        ein: '12-3456789',
        foundedYear: '2021',
        boardChair: 'Sarah Jenkins',
        partnerVeterinary: 'Riverside Animal Clinic',
        annualOperatingCost: '$75,000',
        geographicScope: 'Greater Metro and Surrounding Tri-County Area'
      };
    } catch {
      return {
        legalName: 'Cozy Paws Rescue Initiative',
        ein: '12-3456789',
        foundedYear: '2021',
        boardChair: 'Sarah Jenkins',
        partnerVeterinary: 'Riverside Animal Clinic',
        annualOperatingCost: '$75,000',
        geographicScope: 'Greater Metro and Surrounding Tri-County Area'
      };
    }
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

  // GRANT-WRITING BEST PRACTICES VIEW STATE
  const [guideStep, setGuideStep] = useState<number>(0);
  const [outlineTab, setOutlineTab] = useState<'outline' | 'example'>('outline');
  const [viewMode, setViewMode] = useState<'section' | 'full'>('section');

  useEffect(() => {
    // Keep checklist synced in LocalStorage
    localStorage.setItem('rescuekit_grant_checklist', JSON.stringify(checkedDocs));
  }, [checkedDocs]);

  useEffect(() => {
    // Keep audits synced in LocalStorage
    localStorage.setItem('rescuekit_grant_audits', JSON.stringify(checkedAudits));
  }, [checkedAudits]);

  useEffect(() => {
    // Keep cabinet org details synced in LocalStorage
    localStorage.setItem('rescuekit_cabinet_org_details', JSON.stringify(orgDetails));
  }, [orgDetails]);

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

  // Handle audit red flag toggle
  const toggleAudit = (id: string) => {
    setCheckedAudits(prev => ({
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
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">RescueKit's Grant Hub</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Tips and Tools for writing grant proposals</p>
        </div>

      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-row overflow-x-auto whitespace-nowrap scroll-hide flex-nowrap lg:flex-wrap gap-1.5 bg-sky-50/70 p-1 rounded-2xl border border-sky-100 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('assistant')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all ${
            activeTab === 'assistant' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📚 Grant-Writing Best Practices
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
          onClick={() => setActiveTab('board')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all ${
            activeTab === 'board' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💰 Grants Board
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
          {/* Freshness Disclaimer Alert */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed font-semibold">
              <span className="font-extrabold block text-slate-900 mb-0.5">⚠️ Validate Guidelines Directly At Funder Portals</span>
              This directory compiles third-party grant opportunities verified as of <span className="text-indigo-700 font-black">June 2026</span>. Deadlines, geographic jurisdictions, and allowable expenses parameters can adapt or close unexpectedly. Users are strongly advised to select <span className="text-emerald-800 font-bold">Apply Online</span> to verify real-time criteria on the official funder portal before drafting.
            </div>
          </div>

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
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="inline-block bg-sky-50 text-indigo-700 border border-sky-100 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                        {grant.category}
                      </span>
                      <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider" title="Verification sync status checked June 2026">
                        ✓ Sync June 2026
                      </span>
                    </div>
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
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-rose-500 flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      Deadline: {grant.deadline}
                    </span>
                    <span className="text-[8px] text-amber-700 font-bold block">
                      ⚠ Deadlines can shift. Always click Apply Online to verify.
                    </span>
                  </div>

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

          {/* RED FLAG AUDITOR PANEL */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="bg-rose-50 border border-rose-150 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-rose-950 text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-700 shrink-0 select-none animate-pulse" />
                  Proposal Red Flag Auditor (Funder Rejection Checklist)
                </h3>
                <p className="text-xs text-rose-800 font-medium leading-relaxed mt-1">
                  Run your compiled draft of the proposal against these 8 critical pitfalls that automatically trigger reviews and automatic rejections from board trustees.
                </p>
              </div>
              <div className="bg-white border border-rose-150 rounded-2xl px-5 py-2.5 text-center shrink-0 shadow-3xs">
                <span className="text-xl font-mono font-black text-rose-700">
                  {Object.values(checkedAudits).filter(Boolean).length} / {RED_FLAG_AUDIT_ITEMS.length}
                </span>
                <span className="text-[9px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">Red Flags Resolved</span>
              </div>
            </div>

            {/* Progress bar info status */}
            <div className="mt-3.5 px-1 flex items-center justify-between text-[11px] font-black">
              <span className={Object.values(checkedAudits).filter(Boolean).length === RED_FLAG_AUDIT_ITEMS.length ? "text-emerald-700 flex items-center gap-1" : "text-rose-700 font-bold"}>
                {Object.values(checkedAudits).filter(Boolean).length === RED_FLAG_AUDIT_ITEMS.length 
                  ? "✓ Status: Grade A Proposal Secured (100% Defended!)" 
                  : "⚠ Status: Audit In Progress (Secure all red flags before submitting)"
                }
              </span>
              <span className="text-slate-400 font-mono">
                {Math.round((Object.values(checkedAudits).filter(Boolean).length / RED_FLAG_AUDIT_ITEMS.length) * 100)}% Complete
              </span>
            </div>
            
            {/* Real Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden border border-slate-200/50">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  Object.values(checkedAudits).filter(Boolean).length === RED_FLAG_AUDIT_ITEMS.length 
                    ? 'bg-emerald-500' 
                    : 'bg-rose-500'
                }`}
                style={{ width: `${(Object.values(checkedAudits).filter(Boolean).length / RED_FLAG_AUDIT_ITEMS.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {RED_FLAG_AUDIT_ITEMS.map((item) => {
                const isChecked = checkedAudits[item.id] || false;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleAudit(item.id)}
                    className={`cursor-pointer border p-4.5 rounded-2xl transition-all duration-200 flex flex-col justify-between text-left font-sans select-none shadow-3xs ${
                      isChecked 
                        ? 'bg-emerald-50/40 border-emerald-250 hover:bg-emerald-50/60' 
                        : 'bg-white hover:bg-slate-50 border-slate-150'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-2.5">
                        <div className="shrink-0 mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-350 shrink-0" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-[12px] font-black leading-snug ${isChecked ? 'text-emerald-950 line-through decoration-emerald-200/60' : 'text-slate-800'}`}>
                            {item.title}
                          </h4>
                          <p className="text-[10.5px] leading-relaxed text-slate-500 font-semibold mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-3 pt-3 border-t text-[10px] leading-relaxed rounded-xl p-3 border-dashed ${
                      isChecked 
                        ? 'bg-emerald-50 border-emerald-150 text-emerald-900 font-bold' 
                        : 'bg-amber-50/40 border-amber-150 text-amber-900 font-medium'
                    }`}>
                      <span className="font-extrabold uppercase tracking-widest text-[9px] block mb-1">
                        {isChecked ? '✓ Defense Deployed (Mitigated)' : '🔧 Proper Mitigation Advice'}
                      </span>
                      {item.mitigation}
                    </div>
                  </div>
                );
              })}
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

      {/* GRANT-WRITING BEST PRACTICES ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50/40 to-sky-50/40 border border-sky-100 p-5 rounded-2xl flex items-start gap-3.5">
            <div className="p-2.5 bg-indigo-600 text-white h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">📚 Grant-Writing Best Practices & Blueprint</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-semibold mt-1">
                Craft a winning grant proposal. Click any section on the left for specific guidance. When you're ready, export a formatted outline or sample proposal to get started.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Column 1 & 2 Combined Group Box: Interactive Guide Panel */}
            <div className="lg:col-span-7 flex flex-col bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 shadow-3xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch h-full">
                
                {/* Left Side: Assembly Chapters Navigator */}
                <div className="md:col-span-5 flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-3xs">
                  <h4 className="font-extrabold text-xs text-indigo-950 flex items-center gap-1.5 tracking-wider uppercase mb-3 select-none">
                    📋 Proposal Blueprint
                  </h4>
                  <div className="space-y-1.5 flex-1">
                    {BEST_PRACTICES_STEPS.map((step, idx) => (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() => setGuideStep(idx)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer block relative ${
                          guideStep === idx 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                            : 'bg-slate-50/75 hover:bg-slate-100 border-slate-150 text-slate-800'
                        }`}
                      >
                        <h5 className="text-[12px] font-black leading-snug">
                          {step.title}
                        </h5>
                        <div className="flex justify-between items-center select-none mt-1">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest ${guideStep === idx ? 'text-indigo-200' : 'text-indigo-600'}`}>
                            {step.subtitle}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
 
                {/* Right Side: Expert Advice Chapter Deep-Dive */}
                <div className="md:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-3xs h-full">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-1.5 select-none">
                      <span className="text-slate-400 font-extrabold text-[9.5px] uppercase tracking-wider">
                        Chapter {guideStep + 1} of 8
                      </span>
                    </div>
 
                    <div className="pb-1">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block">
                        {BEST_PRACTICES_STEPS[guideStep].subtitle}
                      </span>
                      <h4 className="text-base font-black text-slate-900 leading-tight">
                        {BEST_PRACTICES_STEPS[guideStep].title}
                      </h4>
                    </div>
 
                    <div className="p-3.5 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-3.5">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-950 flex items-center gap-1.5 select-none">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          Core Concept
                        </span>
                        <p className="text-[11.5px] text-slate-600 font-semibold leading-relaxed">
                          {BEST_PRACTICES_STEPS[guideStep].bestPractice}
                        </p>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3 space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block select-none">
                          💡 Pro-Tips
                        </span>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                          {BEST_PRACTICES_STEPS[guideStep].proTip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Column 3: Live Template Workspace (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-white p-4.5 rounded-2xl border flex flex-col h-full justify-between space-y-3">
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Outline VS Example Tabs */}
                    <div className="flex bg-slate-100 p-0.5 rounded-xl border shrink-0">
                      <button
                        key="tab_outline"
                        type="button"
                        onClick={() => setOutlineTab('outline')}
                        className={`cursor-pointer px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                          outlineTab === 'outline' 
                            ? 'bg-white text-slate-800 shadow-3xs' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        📋 Proposal Outline
                      </button>
                      <button
                        key="tab_example"
                        type="button"
                        onClick={() => setOutlineTab('example')}
                        className={`cursor-pointer px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                          outlineTab === 'example' 
                            ? 'bg-white text-slate-800 shadow-3xs' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        💡 Real Example
                      </button>
                    </div>

                    {/* Copy & Export Buttons Group */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const targetText = viewMode === 'full'
                            ? (outlineTab === 'outline' ? OUTLINE_SKELETON : SAMPLE_COMPLETED_PROPOSAL)
                            : (outlineTab === 'outline' ? OUTLINE_SECTIONS[guideStep] : SAMPLE_SECTIONS[guideStep]);
                          const label = viewMode === 'full' 
                            ? (outlineTab === 'outline' ? 'outline_full' : 'example_full')
                            : (outlineTab === 'outline' ? `outline_src_${guideStep}` : `sample_src_${guideStep}`);
                          handleCopy(targetText, label);
                        }}
                        className={`cursor-pointer px-2.5 py-1.5 text-[10px] rounded-lg font-black transition-all flex items-center justify-center gap-1 ${
                          copiedField?.startsWith('outline_') || copiedField?.startsWith('sample_') || copiedField?.startsWith('example_')
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-slate-100 hover:bg-slate-50 border hover:border-indigo-150 text-slate-600 hover:text-indigo-600'
                        }`}
                      >
                        {copiedField?.startsWith('outline_') || copiedField?.startsWith('sample_') || copiedField?.startsWith('example_') ? (
                          <>
                            <Check className="w-3" h-3="true" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const targetText = viewMode === 'full'
                            ? (outlineTab === 'outline' ? OUTLINE_SKELETON : SAMPLE_COMPLETED_PROPOSAL)
                            : (outlineTab === 'outline' ? OUTLINE_SECTIONS[guideStep] : SAMPLE_SECTIONS[guideStep]);
                          const filename = viewMode === 'full'
                            ? (outlineTab === 'outline' ? 'proposal_blueprint_outline.txt' : 'proposal_completed_sample.txt')
                            : (outlineTab === 'outline' ? `proposal_outline_chapter_${guideStep + 1}.txt` : `proposal_sample_chapter_${guideStep + 1}.txt`);
                          
                          const element = document.createElement("a");
                          const file = new Blob([targetText], {type: 'text/plain;charset=utf-8'});
                          element.href = URL.createObjectURL(file);
                          element.download = filename;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="cursor-pointer px-2.5 py-1.5 text-[10px] rounded-lg font-black transition-all flex items-center justify-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 shadow-3xs"
                        title="Download as .txt text file"
                      >
                        <Download className="w-3 h-3 text-indigo-600" />
                        <span>Export .txt</span>
                      </button>
                    </div>
                  </div>

                  {/* ViewMode switch: Selected Section vs Full Proposal */}
                  <div className="flex bg-indigo-50/50 p-1 rounded-xl border border-indigo-100/30 w-full">
                    <button
                      type="button"
                      onClick={() => setViewMode('section')}
                      className={`flex-1 text-center py-1 font-black text-[10px] rounded-lg transition-all cursor-pointer ${
                        viewMode === 'section'
                          ? 'bg-indigo-600 text-white shadow-3xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      🔍 Just Section {guideStep + 1} Snippet
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('full')}
                      className={`flex-1 text-center py-1 font-black text-[10px] rounded-lg transition-all cursor-pointer ${
                        viewMode === 'full'
                          ? 'bg-indigo-600 text-white shadow-3xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      🌐 Entire 8-Part Document
                    </button>
                  </div>
                </div>

                {/* Workspace Viewer */}
                <div className="flex-1 min-h-[290px] flex flex-col relative mt-1">
                  <textarea
                    value={
                      viewMode === 'full'
                        ? (outlineTab === 'outline' ? OUTLINE_SKELETON : SAMPLE_COMPLETED_PROPOSAL)
                        : (outlineTab === 'outline' ? OUTLINE_SECTIONS[guideStep] : SAMPLE_SECTIONS[guideStep])
                    }
                    readOnly
                    rows={12}
                    className="w-full flex-1 p-3.5 border border-indigo-100 rounded-xl bg-slate-50/70 text-[11px] leading-relaxed font-sans font-semibold text-slate-700 focus:outline-none select-text shadow-inner block"
                  />
                </div>

                {/* Info Callout */}
                <div className="p-2.5 bg-indigo-50/30 border border-indigo-100/50 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-[9.5px] text-slate-500 font-bold leading-normal">
                    {viewMode === 'section'
                      ? "📝 Pro-Tip: You are viewing Section-level focus. Copy this short slice to assemble your proposal bit by bit."
                      : "🌐 Pro-Tip: You are viewing the complete master template. Paste this directly to craft your integrated award request."
                    }
                  </p>
                </div>
              </div>
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
