import React, { useState, useEffect } from 'react';
import {
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
  ClipboardCheck,
  FileText,
  AlertCircle,
  ShieldAlert,
  Download,
  ChevronDown,
  BookOpen,
  LayoutList
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// PREDECLARED GRANTS DIRECTORY (Curated for rescues)
interface Grant {
  id: string;
  provider: string;
  name: string;
  maxAmount: string;
  deadline: string;
  category: 'Spay/Neuter' | 'Veterinary & Seniors' | 'Disaster & Capital' | 'General Operations';
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
    title: 'Operating vs. Program Costs',
    description: 'Did you check whether this funder welcomes general operating cost requests, or restricts funding to direct project/program costs?',
    mitigation: 'If restricted, remove any general office rent, staff salaries, or indirect utility line items. Direct 100% of funds to animal medical care and direct rescue supplies.'
  },
  {
    id: 'rf_budget_congruence',
    title: 'Financial Math Adds Up',
    description: 'Do your itemized line-item expenses sum to the exact dollar amount stated in the Cover Letter and Executive Summary?',
    mitigation: 'Double-check every column. A discrepancy of even one dollar triggers immediate suspicion about organizational competency.'
  },
  {
    id: 'rf_ein_letter',
    title: 'Legal Name Matches IRS Records',
    description: 'Does your rescue name on the portal match the exact legal name on your IRS 501(c)(3) letter and state registry?',
    mitigation: 'If your public name differs, enter your registered corporate name followed by "DBA" (Doing Business As) to prevent automated EIN screening denials.'
  },
  {
    id: 'rf_geographic_jurisdiction',
    title: 'Geography Matches Funder\'s Focus',
    description: 'Does your rescue actively service, rescue, or place animals within the exact geography or zip codes this funder designates?',
    mitigation: 'Funders rarely make exceptions. If you operate in adjacent areas, highlight any transport programs or partnerships with their target county\'s public shelter.'
  },
  {
    id: 'rf_stakeholder_verification',
    title: 'Backed by Real Local Data',
    description: 'Did you involve frontline shelter staff or partner vets to align your proposal with the actual local crisis?',
    mitigation: 'Incorporate regional municipal stats rather than emotional generalizations. Make sure local managers and lead volunteers verify your workflow solves their real bottleneck.'
  },
  {
    id: 'rf_timeline_alignment',
    title: 'Timeline Matches Budget Duration',
    description: 'Does your Operations Timeline (Step 4) span the exact same billing duration as your Line-Item Budget (Step 6)?',
    mitigation: 'If your timeline describes a 12-month TNR program but your budget only covers 3 months of supply, align them to reflect continuous funding allocation.'
  },
  {
    id: 'rf_omb_allowable',
    title: 'No Vague "Contingency" Lines',
    description: 'Are your listed expenses clearly labeled, reasonable, and free from vague "slush funds" or flat contingency buffers?',
    mitigation: 'Label every dollar. Instead of "$1,000 for unforeseen issues," write "$1,000 for emergency post-operative care" with a veterinary tier pricing reference.'
  },
  {
    id: 'rf_duplicate_profiles',
    title: 'Using Your Existing Account',
    description: 'If you applied to this grantmaker before, are you using the same login rather than creating a duplicate account?',
    mitigation: 'Use "Forgot Password" to retrieve your historical record. Duplicate accounts divide your submission history and confuse the trustee review panel.'
  },
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

// Human-friendly labels + one-liner for each step
const STEP_META = [
  { friendlyTitle: 'Cover Letter & First Impression', shortDesc: 'Introduce your org, confirm legal status, and state your exact funding ask' },
  { friendlyTitle: 'Executive Summary', shortDesc: 'A tight overview of the whole proposal — write this one last' },
  { friendlyTitle: 'Describe the Local Crisis', shortDesc: 'Use real local data and shelter statistics to prove the problem' },
  { friendlyTitle: 'Your Plan & Timeline', shortDesc: 'Who does what, when — concrete tasks with monthly milestones' },
  { friendlyTitle: "Your Team's Qualifications", shortDesc: 'Prove your rescue has the track record and infrastructure to deliver' },
  { friendlyTitle: 'Budget & Financial Plan', shortDesc: 'Itemize every cost — make the math match the narrative exactly' },
  { friendlyTitle: 'Measuring Your Impact', shortDesc: 'Define exactly how you\'ll track and prove the program worked' },
  { friendlyTitle: 'Long-Term Sustainability', shortDesc: 'Show funders the program continues after the grant money is spent' },
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

  `II. EXECUTIVE SUMMARY (THE PROJECT SUMMARY)
[State your organization's legal name, primary rescue mission, the targeted geographic scope, founding year, the primary objective of your project, and how this requested funding provides a direct solution.]`,

  `III. STATEMENT OF NEED (THE LOCALIZED CRISIS)
[Describe the precise localized crisis your rescue is trying to fix. Back up this necessity mathematically with localized data and shelter stats. Do not just say 'animals are in need'—demonstrate regional trends such as high seasonal surrender spikes, breed-specific regional abandonments, or municipal veterinary backlogs.]`,

  `IV. PLAN OF WORK & TIMELINE (OPERATIONS TIMELINE)
[Detail your concrete operations plan. Who does what, when, where, and how? Break down work into tactical tasks: field trapping or humanely rescuing animals, initial intake procedures, dedicated partner veterinary surgeries, foster placements, and digital family matches with monthly milestones.]`,

  `V. ORGANIZATIONAL BACKGROUND & CAPABILITY (LEADERSHIP BACKGROUND)
[Provide concrete support of your team's background, track record, active volunteer foster household count, physical resources/vehicles, and previous programmatic metrics to show you have the infrastructure to execute this project.]`,

  `VI. LINE-ITEM BUDGET & NARRATIVE (THE MATH)
- [Budget Allocation 1 - Dedicated Veterinary Care / Surgery Costs]: $ [Amount] (~60% recommended)
- [Budget Allocation 2 - Vital Medical Supplies / Sanitization Gear]: $ [Amount] (~25% recommended)
- [Budget Allocation 3 - Localized Volunteer Travel / Printing]: $ [Amount] (~15% recommended)
- TOTAL DIRECT BUDGET NARRATIVE: [Add brief math summary explaining negotiated bulk veterinary surgeon agreements and supply expenses.]`,

  `VII. EVALUATION & MEASURABLE KPIs (KPI MARKERS)
- Process KPI Metric 1: e.g., Specifically trap/sterilize/treat exactly [Target Pets] community animals.
- Outcome KPI Metric 2: e.g., Coordinate a [Target %] percentage reduction in municipal intakes or feline drop-offs.
- Evaluation Log: e.g., [Specify shelter management software used, like Shelterluv, and reporting intervals.]`,

  `VIII. FUTURE FUNDING & SUSTAINABILITY (LONG-TERM PLAN)
[Construct a realistic sustainability plan outlining how this program preserves its operational momentum once these requested grant funds are spent. Mention recurring monthly donation systems, adoption fee reinvestments, local corporate sponsors, and municipal animal welfare budget pipelines.]`
];

const SAMPLE_SECTIONS = [
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

  `II. EXECUTIVE SUMMARY (THE PROJECT SUMMARY)
Grateful Paws Rescue Initiative is a volunteer-led rescue organization servicing the Tri-County Region. Founded in 2021, we are dedicated to resolving high shelter surrender and euthanasia rates through proactive preventative medical care. We are seeking $15,000 to launch our targeted "Lifesaving Community Spay & Neuter Campaign." By offering free surgical interventions to high-density stray colonies, this program secures an immediate, highly scalable path toward stabilizing municipal shelter intakes.`,

  `III. STATEMENT OF NEED (THE LOCALIZED CRISIS)
Our micro-region is facing a critical feline population crisis. In the last twelve months, local municipal animal control facilities logged a 34% increase in feral kitten surrenders, resulting in high seasonal euthanasia of healthy litters. Local trap records show that over 800 feral cats live within three high-density suburban zip codes (78744, 78745, and 78724) where low-cost veterinary clinics are currently backlogged for over six months. Without targeted, preventative trapping and sterilization, the spring birth overflow will severely overwhelm existing volunteer foster capacities. This project directly targets these high-kill zip codes to solve the crisis at its source.`,

  `IV. PLAN OF WORK & TIMELINE (OPERATIONS TIMELINE)
Our program will deploy a highly organized, dual-stage Trap-Neuter-Return (TNR) action plan with clear milestone markers:
- Phase 1 (Months 1-3): Coordinate community outreach, train 10 trap-rescue volunteers, and set up field target zones.
- Phase 2 (Months 4-10): Conduct weekly humane trapping targeted in high-incident suburban zip codes. Riverside Veterinary Hospital will perform surgeries.
- Phase 3 (Months 11-12): Complete sterilizations, return ear-tipped animals, match socializable kittens with foster families, and log final stats.
Riverside Vet has secured dedicated weekly clinical blocks to spay/neuter, vaccinate, and microchip up to 150 community animals.`,

  `V. ORGANIZATIONAL BACKGROUND & CAPABILITY (LEADERSHIP BACKGROUND)
Grateful Paws maintains an integrated network of 45 active, gear-equipped foster homes and a 5-member board of directors with combined decades of rescue experience. Since 2021, we have successfully sterilized 420 community pets, placed over 650 shelter animals into permanent loving families, and maintained perfect financial records. Our partnership with Riverside Vet ensures we receive heavily discounted clinical rates, enabling us to maximize the mileage of every dollar awarded.`,

  `VI. LINE-ITEM BUDGET & NARRATIVE (THE MATH)
- Professional Veterinary Surgeon Fees & Clinicians Lab Work: $9,000 (60% of total)
- Core Medical Supplies, Vaccines, Microchips, and Humani-Traps: $3,750 (25% of total)
- Volunteer Outreach Print, Trapper Travel Refund, & Tech Log Support: $2,250 (15% of total)
- TOTAL DIRECT BUDGET NARRATIVE: Riverside Veterinary Hospital offers a subsidized, bulk rate of $60 per feline surgery. The $15,000 fund will fully cover veterinary labor and medical overhead to safely process exactly 150 animals over twelve months, preventing thousands of future stray births. Travel is calculated at standard non-profit mileage rates for rescue routes.`,

  `VII. EVALUATION & MEASURABLE KPIs (KPI MARKERS)
- Process KPI Metric 1: Trapping, sterilizing, and vaccinating exactly 150 feral/stray community cats over 12 months.
- Outcome KPI Metric 2: Achieving a 15% reduction in municipal kitten surrenders from the target zip codes within nine months.
- Evaluation Log: All field records will be inputted weekly into Shelterluv software, with progress indices submitted at the 6-month and 12-month marks.`,

  `VIII. FUTURE FUNDING & SUSTAINABILITY (LONG-TERM PLAN)
Following the initial year of grant funding, this preventative program will be financially sustained through our established "Paws-on-the-Ground" individual monthly giving donor pipeline, which grew by 24% in Q1. Program success statistics will also be leveraged to secure recurring municipal animal welfare co-funding starting in fiscal year 2027.`
];

const isDeadlinePassed = (deadline: string): boolean => {
  if (deadline === 'Rolling') return false;
  const d = new Date(deadline);
  return !isNaN(d.getTime()) && d < new Date();
};

export function RescueGrants() {
  const [activeTab, setActiveTab] = useState<'assistant' | 'board' | 'checklist' | 'myapps'>('assistant');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [trackToast, setTrackToast] = useState<string | null>(null);

  // Accordion open steps (multiple can be open)
  const [openSteps, setOpenSteps] = useState<number[]>([0]);

  // Global outline/example mode toggle for Writing Guide
  const [outlineMode, setOutlineMode] = useState<'outline' | 'example'>('outline');

  // SEARCH & FILTER
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // GRID CHECKLIST STATE
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_grant_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // RED FLAG AUDITOR STATE
  const [checkedAudits, setCheckedAudits] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_grant_audits');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // CLIPBOARD DETAILS
  const [orgDetails, setOrgDetails] = useState(() => {
    const empty = { legalName: '', ein: '', foundedYear: '', boardChair: '', partnerVeterinary: '', annualOperatingCost: '', geographicScope: '' };
    try {
      const saved = localStorage.getItem('rescuekit_cabinet_org_details');
      if (!saved) return empty;
      const parsed = JSON.parse(saved);
      // Migrate away from old demo placeholder values
      if (parsed.legalName === 'Cozy Paws Rescue Initiative') return empty;
      return parsed;
    } catch {
      return empty;
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
    } catch { return []; }
  });

  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackAmount, setNewTrackAmount] = useState('');
  const [newTrackDeadline, setNewTrackDeadline] = useState('');
  const [newTrackStatus, setNewTrackStatus] = useState<'Drafting' | 'Submitted' | 'Awarded' | 'Declined'>('Drafting');
  const [newTrackNotes, setNewTrackNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('rescuekit_grant_checklist', JSON.stringify(checkedDocs));
  }, [checkedDocs]);

  useEffect(() => {
    localStorage.setItem('rescuekit_grant_audits', JSON.stringify(checkedAudits));
  }, [checkedAudits]);

  useEffect(() => {
    localStorage.setItem('rescuekit_cabinet_org_details', JSON.stringify(orgDetails));
  }, [orgDetails]);

  useEffect(() => {
    localStorage.setItem('rescuekit_tracked_grants', JSON.stringify(trackedGrants));
  }, [trackedGrants]);

  const toggleDoc = (id: string) => setCheckedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleAudit = (id: string) => setCheckedAudits(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleStep = (idx: number) => {
    setOpenSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleDocxDownload = async (text: string, filename: string) => {
    setIsGeneratingDocx(true);
    try {
      const lines = text.split('\n');
      const children = lines.map(line =>
        new Paragraph({ children: [new TextRun({ text: line, size: 22, font: 'Calibri' })] })
      );
      const doc = new Document({ creator: 'RescueKit', sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      const el = document.createElement('a');
      el.href = URL.createObjectURL(blob);
      el.download = filename;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

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
    setNewTrackName(''); setNewTrackAmount(''); setNewTrackDeadline(''); setNewTrackNotes('');
  };

  const handleTrackAutomatic = (grant: Grant) => {
    if (trackedGrants.some(g => g.grantName.toLowerCase() === grant.name.toLowerCase() || g.grantName.includes(grant.provider))) {
      alert(`"${grant.name}" is already being tracked!`);
      return;
    }
    const item: TrackedGrant = {
      id: 'tr_' + Date.now(),
      grantName: `${grant.provider} — ${grant.name}`,
      fundingTarget: grant.maxAmount,
      deadline: grant.deadline,
      status: 'Drafting',
      notes: `Imported from Grants Board. Category: ${grant.category}`
    };
    setTrackedGrants([...trackedGrants, item]);
    setTrackToast(grant.name);
    setTimeout(() => setTrackToast(null), 3000);
    setActiveTab('myapps');
  };

  const handleRemoveTrack = (id: string) => setTrackedGrants(trackedGrants.filter(g => g.id !== id));

  const updateTrackStatus = (id: string, stat: 'Drafting' | 'Submitted' | 'Awarded' | 'Declined') => {
    setTrackedGrants(trackedGrants.map(g => g.id === id ? { ...g, status: stat } : g));
  };

  const filteredGrants = CONST_GRANTS.filter(g => {
    const matchesSearch = g.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || g.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const awardsTotal = trackedGrants
    .filter(g => g.status === 'Awarded')
    .reduce((acc, curr) => acc + (parseInt(curr.fundingTarget.replace(/[^0-9]/g, '')) || 0), 0);

  return (
    <div id="rescue-grants-component" className="w-full bg-white border border-sky-100 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm no-print font-sans">

      {/* TRACK IT TOAST */}
      {trackToast && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-600 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          Added to My Applications: {trackToast}
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50/50 to-sky-50/40 p-6 rounded-2xl md:rounded-3xl border border-sky-200/70 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight font-fraunces">Win Funding for Your Rescue</h1>
          <p className="text-sm text-sky-800/80 font-bold mt-1.5">Find grants, write stronger proposals, and track your applications</p>
        </div>
      </div>

      {/* TAB NAVIGATION — 3 tabs */}
      <div className="flex flex-row overflow-x-auto whitespace-nowrap scroll-hide flex-nowrap gap-1.5 bg-sky-50/70 p-1 rounded-2xl border border-sky-100 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'checklist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" /> Readiness Checklist
          <span className={`text-[9px] rounded-full px-1.5 py-0.5 font-mono leading-none ${activeTab === 'checklist' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {Object.values(checkedDocs).filter(Boolean).length}/{CHECKLIST_ITEMS.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assistant')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'assistant' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Writing Guide
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('board')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'board' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> Grants Board
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('myapps')}
          className={`cursor-pointer shrink-0 px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'myapps' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutList className="w-3.5 h-3.5" /> My Applications
          {trackedGrants.length > 0 && (
            <span className="text-[10px] bg-slate-900 text-white rounded-full px-1.5 py-0.5 font-mono leading-none">
              {trackedGrants.length}
            </span>
          )}
        </button>
      </div>


      {/* ── WRITING GUIDE TAB ── */}
      {activeTab === 'assistant' && (
        <div className="space-y-3">

          {/* Intro + outline/example toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h2 className="text-base font-black text-slate-900">8-Part Proposal Blueprint</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Open sections to read guidance on writing grant proposals. Download the free outline or the example proposal.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
              <button
                type="button"
                onClick={() => setOutlineMode('outline')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  outlineMode === 'outline' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Blank Template
              </button>
              <button
                type="button"
                onClick={() => setOutlineMode('example')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  outlineMode === 'example' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Real Example
              </button>
            </div>
          </div>

          {/* Accordion steps */}
          {BEST_PRACTICES_STEPS.map((step, idx) => {
            const meta = STEP_META[idx];
            const isOpen = openSteps.includes(idx);
            const sectionText = outlineMode === 'outline' ? OUTLINE_SECTIONS[idx] : SAMPLE_SECTIONS[idx];
            const copyKey = `step_${idx}`;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-indigo-200 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => toggleStep(idx)}
                  className={`w-full flex items-center gap-4 p-4 md:p-5 text-left cursor-pointer transition-colors ${
                    isOpen ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <span className={`text-3xl md:text-4xl font-black font-mono leading-none shrink-0 w-12 text-right select-none transition-colors ${
                    isOpen ? 'text-indigo-200' : 'text-slate-100'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-[15px] font-black leading-tight transition-colors ${isOpen ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {meta.friendlyTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">{meta.shortDesc}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-300'}`} />
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="border-t border-indigo-100 bg-white px-5 py-5 space-y-5">

                    {/* Core concept */}
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5" /> What to write here
                      </span>
                      <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                        {step.bestPractice}
                      </p>
                    </div>

                    {/* Pro tip */}
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                      <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 block mb-1.5">Pro tip</span>
                      <p className="text-[13px] text-sky-900 font-medium leading-relaxed">
                        {step.proTip}
                      </p>
                    </div>

                    {/* Template text */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          {outlineMode === 'outline' ? 'Template text for this section' : 'Real example for this section'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(sectionText, copyKey)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                              copiedField === copyKey
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-indigo-50 border hover:border-indigo-200 text-slate-600 hover:text-indigo-700'
                            }`}
                          >
                            {copiedField === copyKey ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                          </button>
                        </div>
                      </div>
                      <textarea
                        readOnly
                        value={sectionText}
                        className="w-full h-36 p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-[12px] font-mono text-slate-600 leading-relaxed resize-none focus:outline-none select-text"
                      />
                    </div>

                  </div>
                )}
              </div>
            );
          })}

          {/* Copy / download full proposal */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100 mt-2">
            <p className="text-xs text-slate-500 font-medium flex-1">
              Ready to write? Copy or download the complete 8-section {outlineMode === 'outline' ? 'blank template' : 'filled example'}.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(outlineMode === 'outline' ? OUTLINE_SKELETON : SAMPLE_COMPLETED_PROPOSAL, 'full_proposal')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  copiedField === 'full_proposal'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copiedField === 'full_proposal' ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Full Proposal</>}
              </button>
              <button
                type="button"
                disabled={isGeneratingDocx}
                onClick={() => handleDocxDownload(
                  outlineMode === 'outline' ? OUTLINE_SKELETON : SAMPLE_COMPLETED_PROPOSAL,
                  outlineMode === 'outline' ? 'proposal_blank_template.docx' : 'proposal_real_example.docx'
                )}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-white border border-slate-200 hover:border-indigo-200 text-indigo-700 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                <Download className="w-3.5 h-3.5" />
                {isGeneratingDocx ? 'Generating…' : 'Download .docx'}
              </button>
            </div>
          </div>

          {/* ── RED FLAG AUDITOR — Before You Submit ── */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-rose-100">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-black text-rose-950 text-base flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  Before You Submit — Red Flag Auditor
                </h3>
                <p className="text-sm text-rose-800 font-medium leading-relaxed mt-1">
                  Run your draft against these 8 common rejection triggers. Check each one off once you've confirmed your proposal is clean.
                </p>
              </div>
              <div className="bg-white border border-rose-100 rounded-2xl px-5 py-3 text-center shrink-0">
                <span className="text-2xl font-mono font-black text-rose-600">
                  {Object.values(checkedAudits).filter(Boolean).length}/{RED_FLAG_AUDIT_ITEMS.length}
                </span>
                <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">Red Flags Cleared</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  Object.values(checkedAudits).filter(Boolean).length === RED_FLAG_AUDIT_ITEMS.length ? 'bg-emerald-500' : 'bg-rose-400'
                }`}
                style={{ width: `${(Object.values(checkedAudits).filter(Boolean).length / RED_FLAG_AUDIT_ITEMS.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RED_FLAG_AUDIT_ITEMS.map((item) => {
                const isChecked = checkedAudits[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAudit(item.id)}
                    className={`cursor-pointer border rounded-2xl p-4 transition-all duration-150 select-none ${
                      isChecked
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-white hover:bg-rose-50/30 border-slate-100 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="shrink-0 mt-0.5">
                        {isChecked
                          ? <CheckSquare className="w-4.5 h-4.5 text-emerald-600" />
                          : <Square className="w-4.5 h-4.5 text-slate-300" />
                        }
                      </div>
                      <div>
                        <h4 className={`text-[13px] font-black leading-snug ${isChecked ? 'text-emerald-900 line-through decoration-emerald-200/60' : 'text-slate-800'}`}>
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className={`text-[12px] leading-relaxed rounded-xl p-3 border font-medium ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-100 text-amber-900'
                    }`}>
                      <span className="font-black text-[10px] uppercase tracking-wider block mb-1">
                        {isChecked ? '✓ Resolved' : 'How to fix it'}
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


      {/* ── GRANTS BOARD TAB ── */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed font-semibold">
              <span className="font-extrabold block text-slate-900 mb-0.5">Verify guidelines directly at funder portals before drafting</span>
              This directory was verified as of <span className="text-indigo-700 font-black">June 2026</span>. Deadlines, geographic jurisdictions, and allowable expenses can change unexpectedly. Always click <span className="text-emerald-800 font-bold">Apply Online</span> to confirm real-time criteria.
            </div>
          </div>

          <div className="bg-sky-50/50 p-4 border rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:max-w-md bg-white border border-sky-100 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search grants (e.g. Petco, Maddie's, ASPCA)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs font-medium focus:outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs font-bold border border-sky-100 bg-white rounded-xl py-1 px-3 focus:outline-none text-slate-700 cursor-pointer"
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
                      <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider">
                        ✓ Verified June 2026
                      </span>
                    </div>
                    <span className="text-emerald-600 font-black text-sm tracking-tight flex items-center gap-0.5 shrink-0">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                      Up to {grant.maxAmount}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{grant.provider}</h3>
                  <h4 className="font-bold text-indigo-600 text-xs mt-0.5">{grant.name}</h4>
                  <p className="text-[12px] text-stone-500 font-medium leading-relaxed mt-3 mb-4">{grant.description}</p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 mb-4">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1.5">RECOMMENDED ATTACHMENTS</span>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black flex items-center gap-1 shrink-0 ${isDeadlinePassed(grant.deadline) ? 'text-slate-400 line-through' : 'text-rose-500'}`}>
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        Deadline: {grant.deadline}
                      </span>
                      {isDeadlinePassed(grant.deadline) && (
                        <span className="inline-flex items-center gap-0.5 bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Deadline Passed
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-amber-700 font-bold block">
                      ⚠ Always click Apply Online to verify current deadline.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={grant.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline inline-flex items-center gap-1 cursor-pointer text-[11px] font-black bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white rounded-xl px-3 py-1.5 transition-all shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Apply Online
                    </a>
                    <button
                      type="button"
                      onClick={() => handleTrackAutomatic(grant)}
                      className="cursor-pointer text-[11px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl px-3 py-1.5 transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Track It
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredGrants.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12 border border-dashed rounded-3xl bg-slate-50 p-6">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-slate-700 text-sm font-bold">No grants found</h4>
                <p className="text-xs text-slate-400 mt-1">Try broadening your category filter or search term.</p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ── READINESS CHECKLIST TAB ── */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Legal Documents', 'Financial & Org Data', 'Project Planning'] as const).map(cat => (
              <div key={cat} className="space-y-2.5 p-4 bg-sky-50/20 border border-sky-100 rounded-2xl">
                <h4 className="font-extrabold text-xs text-indigo-700 border-b border-sky-100 pb-2 flex justify-between items-center">
                  <span>{cat}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {CHECKLIST_ITEMS.filter(c => c.category === cat && checkedDocs[c.id]).length}/{CHECKLIST_ITEMS.filter(c => c.category === cat).length}
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
                          isChecked ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white hover:bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isChecked
                            ? <CheckSquare className="w-4 h-4 text-emerald-600" />
                            : <Square className="w-4 h-4 text-slate-300" />
                          }
                        </div>
                        <div>
                          <h5 className={`text-[12px] font-extrabold leading-tight ${isChecked ? 'text-emerald-900 line-through decoration-emerald-200' : 'text-slate-800'}`}>
                            {item.doc}
                          </h5>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-400 mt-1">{item.whyNeeded}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-start gap-3">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-[12px] font-medium text-sky-900 leading-relaxed">
              <strong>Volunteer tip:</strong> Create a shared Google Drive folder titled <strong>"Grant Application Library"</strong> and drop all {CHECKLIST_ITEMS.length} files into it. Share the link with your board so everyone has instant access when a portal deadline arrives.
            </p>
          </div>
        </div>
      )}


      {/* ── MY APPLICATIONS TAB ── */}
      {activeTab === 'myapps' && (
        <div className="space-y-8">

          {/* Application Tracker */}
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-black text-slate-900">Application Tracker</h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Log and monitor every grant application your rescue is pursuing.</p>
              </div>
              {awardsTotal > 0 && (
                <div className="bg-slate-900 text-white rounded-2xl px-5 py-2.5 text-center shrink-0">
                  <span className="text-xl font-mono font-extrabold text-emerald-400">${awardsTotal.toLocaleString()}</span>
                  <span className="text-[9px] tracking-wider text-slate-400 block font-black uppercase mt-0.5">Total Awarded</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Add form */}
              <form onSubmit={handleAddTrack} className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                <h4 className="font-black text-xs text-slate-700 uppercase tracking-wider">Log new application</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Grant / Foundation Name</label>
                    <input type="text" required placeholder="e.g. ASPCA Emergency Relief" value={newTrackName} onChange={e => setNewTrackName(e.target.value)} className="w-full border p-2 rounded-lg font-semibold bg-white focus:outline-none focus:border-sky-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500">Requested Amount</label>
                      <input type="text" placeholder="$10,000" value={newTrackAmount} onChange={e => setNewTrackAmount(e.target.value)} className="w-full border p-2 rounded-lg font-mono font-bold bg-white focus:outline-none focus:border-sky-300" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500">Deadline</label>
                      <input type="text" placeholder="July 15" value={newTrackDeadline} onChange={e => setNewTrackDeadline(e.target.value)} className="w-full border p-2 rounded-lg font-bold bg-white focus:outline-none focus:border-sky-300" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Status</label>
                    <select value={newTrackStatus} onChange={e => setNewTrackStatus(e.target.value as any)} className="w-full border p-2 font-bold cursor-pointer rounded-lg bg-white focus:outline-none text-slate-700">
                      <option value="Drafting">📝 Drafting</option>
                      <option value="Submitted">🚀 Submitted</option>
                      <option value="Awarded">🏆 Awarded</option>
                      <option value="Declined">❌ Declined</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Notes</label>
                    <textarea rows={2} placeholder="e.g. Needs board approval before submitting." value={newTrackNotes} onChange={e => setNewTrackNotes(e.target.value)} className="w-full border p-2 font-medium bg-white rounded-lg focus:outline-none font-sans text-[11px]" />
                  </div>
                  <button type="submit" className="cursor-pointer w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add to Tracker
                  </button>
                </div>
              </form>

              {/* Tracker table */}
              <div className="lg:col-span-8 overflow-x-auto border border-slate-100 rounded-2xl bg-white">
                <table className="w-full text-left text-xs text-stone-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-400 font-extrabold border-b tracking-wider uppercase">
                      <th className="p-3 pl-4">Grant</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-[12px] text-stone-700">
                    {trackedGrants.map(tr => (
                      <tr key={tr.id} className="hover:bg-sky-50/20">
                        <td className="p-3 pl-4 max-w-[200px]">
                          <span className="font-extrabold text-slate-900 block truncate">{tr.grantName}</span>
                          <span className="text-[10px] text-slate-400 block truncate font-medium mt-0.5">{tr.notes || '—'}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-600 whitespace-nowrap">{tr.fundingTarget}</td>
                        <td className="p-3 font-medium text-slate-500 whitespace-nowrap">{tr.deadline}</td>
                        <td className="p-3 whitespace-nowrap">
                          <select
                            value={tr.status}
                            onChange={e => updateTrackStatus(tr.id, e.target.value as any)}
                            className={`cursor-pointer text-[11px] font-black border rounded-lg px-2 py-1 focus:outline-none ${
                              tr.status === 'Awarded' ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : tr.status === 'Submitted' ? 'bg-sky-50 border-sky-100 text-indigo-700'
                              : tr.status === 'Declined' ? 'bg-rose-50 border-rose-100 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            <option value="Drafting">📝 Drafting</option>
                            <option value="Submitted">🚀 Submitted</option>
                            <option value="Awarded">🏆 Awarded</option>
                            <option value="Declined">❌ Declined</option>
                          </select>
                        </td>
                        <td className="p-3 pr-4 text-right">
                          <button type="button" onClick={() => handleRemoveTrack(tr.id)} className="cursor-pointer text-slate-300 hover:text-rose-500 p-1 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {trackedGrants.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-slate-400 font-bold">
                          No applications logged yet. Add one above or use "Track It" on the Grants Board.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Organization Details Cabinet */}
          <div className="border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Organization Details Cabinet</h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Save your rescue's info once — click to copy any field when filling out grant portals.</p>
              </div>
              <span className="text-[10px] bg-sky-50 border border-sky-100 text-sky-700 font-bold px-3 py-1.5 rounded-xl shrink-0">
                🔒 Saved locally in your browser
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Edit form */}
              <div className="space-y-3 border border-slate-100 p-5 rounded-2xl bg-slate-50/40">
                <h4 className="font-black text-xs text-slate-500 uppercase tracking-wider">Edit your organization's details</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-slate-500">Legal Organization Name</label>
                    <input type="text" value={orgDetails.legalName} placeholder="e.g. Grateful Paws Rescue Initiative" onChange={e => setOrgDetails({ ...orgDetails, legalName: e.target.value })} className="w-full border p-2 text-xs font-semibold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Tax ID / EIN</label>
                    <input type="text" value={orgDetails.ein} placeholder="e.g. 12-3456789" onChange={e => setOrgDetails({ ...orgDetails, ein: e.target.value })} className="w-full border p-2 text-xs font-mono font-bold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Year Founded</label>
                    <input type="text" value={orgDetails.foundedYear} placeholder="e.g. 2021" onChange={e => setOrgDetails({ ...orgDetails, foundedYear: e.target.value })} className="w-full border p-2 text-xs font-semibold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Board Chair Name</label>
                    <input type="text" value={orgDetails.boardChair} placeholder="e.g. Sarah Jenkins" onChange={e => setOrgDetails({ ...orgDetails, boardChair: e.target.value })} className="w-full border p-2 text-xs font-semibold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Partner Vet Clinic</label>
                    <input type="text" value={orgDetails.partnerVeterinary} placeholder="e.g. Riverside Animal Hospital" onChange={e => setOrgDetails({ ...orgDetails, partnerVeterinary: e.target.value })} className="w-full border p-2 text-xs font-semibold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Annual Operating Budget</label>
                    <input type="text" value={orgDetails.annualOperatingCost} placeholder="e.g. $75,000" onChange={e => setOrgDetails({ ...orgDetails, annualOperatingCost: e.target.value })} className="w-full border p-2 text-xs font-semibold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-slate-500">Geographic Scope</label>
                    <input type="text" value={orgDetails.geographicScope} placeholder="e.g. Greater Metro Tri-County Area" onChange={e => setOrgDetails({ ...orgDetails, geographicScope: e.target.value })} className="w-full border p-2 text-xs font-semibold rounded-lg bg-white focus:outline-none focus:border-sky-300 placeholder:font-normal placeholder:text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Click-to-copy fields */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block pl-1">Click any field to copy</span>
                {[
                  { label: 'Legal Name', val: orgDetails.legalName, id: 'c_nm' },
                  { label: 'Tax ID / EIN', val: orgDetails.ein, id: 'c_ein', mono: true },
                  { label: 'Year Founded', val: orgDetails.foundedYear, id: 'c_yr' },
                  { label: 'Board Chair', val: orgDetails.boardChair, id: 'c_bc' },
                  { label: 'Partner Vet', val: orgDetails.partnerVeterinary, id: 'c_vet' },
                  { label: 'Annual Budget', val: orgDetails.annualOperatingCost, id: 'c_bud' },
                  { label: 'Geographic Scope', val: orgDetails.geographicScope, id: 'c_geo' },
                ].map(field => (
                  <button
                    key={field.id}
                    type="button"
                    disabled={!field.val}
                    onClick={() => field.val && handleCopy(field.val, field.id)}
                    className={`w-full border rounded-xl p-3 flex items-center justify-between gap-4 transition-all text-left ${
                      !field.val
                        ? 'bg-slate-50 border-slate-100 cursor-default opacity-60'
                        : copiedField === field.id
                          ? 'bg-emerald-50 border-emerald-200 cursor-pointer'
                          : 'bg-white hover:bg-sky-50/40 hover:border-sky-200 border-slate-100 cursor-pointer'
                    }`}
                  >
                    <div className="truncate">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">{field.label}</span>
                      {field.val
                        ? <span className={`text-[12px] font-semibold block truncate ${field.mono ? 'font-mono text-indigo-700' : 'text-slate-800'}`}>{field.val}</span>
                        : <span className="text-[12px] font-medium block truncate text-slate-300 italic">Not filled in yet</span>
                      }
                    </div>
                    {field.val && (
                      <div className={`shrink-0 flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
                        copiedField === field.id ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {copiedField === field.id ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
