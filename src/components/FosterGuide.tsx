import React, { useState, useEffect } from 'react';
import {
  Heart,
  Search,
  CheckSquare,
  AlertTriangle,
  Square,
  Thermometer,
  ShieldAlert,
  Printer,
  ChevronRight,
  Sparkles,
  Camera,
  BookOpen,
} from 'lucide-react';

// TOXIC FOODS LIST
interface ToxicFood {
  name: string;
  effect: string;
}

const TOXIC_FOODS: ToxicFood[] = [
  { name: 'Alcoholic beverages', effect: 'Can cause intoxication, coma, and death.' },
  { name: 'Chocolate, coffee, tea, caffeine', effect: 'Toxic to the heart and nervous system; can be fatal.' },
  { name: 'Grapes and raisins', effect: 'Can cause sudden kidney failure — even small amounts.' },
  { name: 'Onions and garlic (raw, cooked, or powder)', effect: 'Damages red blood cells and causes anemia. Cats are especially vulnerable.' },
  { name: 'Xylitol (artificial sweetener)', effect: 'Found in sugar-free gum, candy, peanut butter; causes liver failure and dangerously low blood sugar.' },
  { name: 'Macadamia nuts', effect: 'Causes weakness, tremors, vomiting, and fever.' },
  { name: 'Avocado', effect: 'Contains persin, which is toxic to dogs and cats.' },
  { name: 'Raw eggs', effect: 'Contain avidin which blocks biotin absorption; may carry Salmonella.' },
  { name: 'Raw fish', effect: 'Can cause thiamine deficiency; seizures in severe cases.' },
  { name: 'Mushrooms (wild)', effect: 'Many species cause multi-organ failure.' },
  { name: 'Cooked bones (fish, poultry)', effect: 'Can splinter and cause digestive obstruction or laceration.' },
  { name: 'Persimmons, peach/plum pits', effect: 'Seeds and pits cause intestinal blockage.' },
  { name: 'Milk and dairy in large amounts', effect: 'Many animals are lactose intolerant; causes diarrhea.' },
  { name: 'Salt in large amounts', effect: 'Causes electrolyte imbalances; can be fatal in excess.' },
  { name: 'Yeast dough', effect: 'Expands in the stomach; causes pain, gas, and possible rupture.' },
  { name: 'Marijuana / cannabis products', effect: 'Depresses the nervous system; can cause severe illness.' },
  { name: 'Tobacco / nicotine', effect: 'Highly toxic; causes collapse and death.' },
  { name: 'Moldy or spoiled food', effect: 'Contains multiple toxins; causes vomiting, diarrhea, and organ damage.' },
];

// PREPARATION CHECKLIST
interface ChecklistItem {
  id: string;
  category: 'Home Setup' | 'Household Safety' | 'Responsibilities';
  task: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'area_sep', category: 'Home Setup', task: 'Select a dedicated area (bathroom, laundry room, or penned corner)' },
  { id: 'area_floor', category: 'Home Setup', task: 'Ensure flooring is easy to clean — protect carpets with a tarp' },
  { id: 'crate_line', category: 'Home Setup', task: 'Line the crate with a soft towel or blanket; add a chew toy' },
  { id: 'pup_bath', category: 'Home Setup', task: 'Dogs: Set up newspaper/builder\'s paper bathroom zone away from crate' },
  { id: 'cat_litter', category: 'Home Setup', task: 'Cats: Set up litter box in quiet area, away from food & water' },
  { id: 'cat_hide', category: 'Home Setup', task: 'Cats: Provide at least one hiding spot (box, covered bed, or tower cubby)' },
  { id: 'clean_ready', category: 'Home Setup', task: 'Have enzyme cleaner (like Nature\'s Miracle) and rubber gloves ready' },
  { id: 'cord_safety', category: 'Household Safety', task: 'Secure all electrical cords and dangling wires out of reach' },
  { id: 'chem_lock', category: 'Household Safety', task: 'Lock away all medications, cleaners, and household chemicals' },
  { id: 'small_obj', category: 'Household Safety', task: 'Remove small ingestible objects (rubber bands, coins, children\'s toys)' },
  { id: 'plant_check', category: 'Household Safety', task: 'Verify all houseplants are non-toxic to pets' },
  { id: 'window_sec', category: 'Household Safety', task: 'Ensure windows and screens are secure to prevent escapes' },
  { id: 'dryer_warn', category: 'Household Safety', task: 'Always check inside dryer before running — cats climb in' },
  { id: 'resp_sleep', category: 'Responsibilities', task: 'Agree that foster animal will not sleep in your bed' },
  { id: 'resp_park', category: 'Responsibilities', task: 'No dog parks, pet stores, or public areas until fully vaccinated' },
  { id: 'resp_kids', category: 'Responsibilities', task: 'Commit to never leaving young children unsupervised with the foster' },
  { id: 'resp_intro', category: 'Responsibilities', task: 'Plan a slow, separated introduction for resident pets (gate first)' },
];

export function FosterGuide() {
  const [activeTab, setActiveTab] = useState<'content' | 'checklist' | 'toxic' | 'health'>('content');
  const [currentChapter, setCurrentChapter] = useState<number>(0);

  // Checklist State (localStorage)
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_foster_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const toggleTask = (id: string) => {
    const next = { ...completedTasks, [id]: !completedTasks[id] };
    setCompletedTasks(next);
    localStorage.setItem('rescuekit_foster_checklist', JSON.stringify(next));
  };

  // Temperature Analyzer State
  const [tempSpecies, setTempSpecies] = useState<'puppy_new' | 'dog_adult' | 'cat_adult'>('dog_adult');
  const [tempValue, setTempValue] = useState<string>('101.5');
  const [tempResult, setTempResult] = useState<{ status: 'normal' | 'emergency' | 'warning'; text: string }>({ status: 'normal', text: 'Input values to analyze' });

  useEffect(() => {
    const val = parseFloat(tempValue);
    if (isNaN(val)) { setTempResult({ status: 'warning', text: 'Please enter a valid numeric temperature.' }); return; }
    if (val > 104 || val < 99) {
      setTempResult({ status: 'emergency', text: '🚨 EMERGENCY! Temperature above 104°F or below 99°F. Contact your rescue veterinarian immediately!' });
      return;
    }
    if (tempSpecies === 'puppy_new') {
      setTempResult(val >= 94 && val <= 97
        ? { status: 'normal', text: '✅ Normal. Newborn puppies maintain 94–97°F.' }
        : { status: 'warning', text: '⚠️ Warning. Normal newborns range 94–97°F. Monitor and contact your coordinator.' });
    } else if (tempSpecies === 'dog_adult') {
      setTempResult(val >= 100 && val <= 102.5
        ? { status: 'normal', text: '✅ Normal. Puppies (4+ weeks) and adult dogs: 100–102.5°F.' }
        : { status: 'warning', text: '⚠️ Warning. Normal range is 100–102.5°F. Monitor closely.' });
    } else {
      setTempResult(val >= 100.5 && val <= 102.5
        ? { status: 'normal', text: '✅ Normal. Adult cats: 100.5–102.5°F.' }
        : { status: 'warning', text: '⚠️ Warning. Normal range is 100.5–102.5°F. Check for lethargy.' });
    }
  }, [tempSpecies, tempValue]);

  // Toxic Food Search
  const [foodSearch, setFoodSearch] = useState<string>('');
  const filteredFoods = TOXIC_FOODS.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    f.effect.toLowerCase().includes(foodSearch.toLowerCase())
  );

  // Chapter Content
  const chapters = [
    {
      title: "1. Welcome to Fostering",
      subtitle: "The bridge between their past and their future",
      content: (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-stone-700">
            <h3 className="font-bold text-slate-900 text-[15px] mb-2">A Message of Heartfelt Thanks</h3>
            <p className="text-[13px] leading-relaxed mb-3">
              First of all — <strong>thank you.</strong> By opening your home to a foster animal, you are giving a vulnerable creature something no shelter can fully provide: a safe, loving environment where they can decompress, heal, and show their true personality to the world.
            </p>
            <p className="text-[13px] leading-relaxed">
              You may be asking yourself, <em>"What did I get myself into?"</em> You are not alone. Fostering can be challenging, surprising, and deeply rewarding all at once. This handbook is designed to give you everything you need to feel confident and prepared — from the first car ride home to the happy day your foster finds their forever family.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex gap-3">
            <Heart className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[13px] text-emerald-950 font-semibold leading-relaxed">
              <strong>Remember:</strong> A "yes" today is a life saved tomorrow. Every animal you foster creates space for another animal in need to be pulled from a shelter. Your home is the bridge between their past and their future.
            </p>
          </div>

          <div>
            <h4 className="font-black text-slate-800 text-[13px] border-b pb-1.5 mb-3">What Fostering Means</h4>
            <ul className="space-y-2.5 text-[13px] text-stone-600 font-medium">
              {[
                'Fostering means temporarily caring for an animal in your home until they are adopted. Your rescue organization handles the adoption process — your job is to provide love, safety, basic training, and honest observations about the animal\'s personality and needs.',
                'You provide the home; the rescue provides support, veterinary care, and supplies.',
                'Foster animals remain the property and responsibility of the rescue organization.',
                'You are not obligated to adopt your foster, but it happens — lovingly called a "foster fail."',
                'You can foster again and again — each animal you help makes a real difference.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="text-indigo-500 font-black mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ),
    },
    {
      title: "2. Your Responsibilities",
      subtitle: "What your rescue organization expects from you",
      content: (
        <div className="space-y-4">
          <p className="text-[13px] text-stone-500 font-semibold leading-relaxed">
            Being a foster is a commitment. The animal in your care is depending entirely on you. Below is a clear summary of what your rescue organization will generally expect.
          </p>

          <div className="bg-slate-50 border rounded-2xl p-4">
            <h4 className="font-extrabold text-indigo-700 text-[13px] mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-indigo-600 rounded-sm inline-block"></span>
              Core Responsibilities
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-700">
              {[
                ['🚑', 'Report any sign of illness to your rescue coordinator immediately — day or night.'],
                ['📍', 'Keep the foster animal in the approved location on file. Do not move them to another home without permission.'],
                ['🚫', 'Do not transfer your foster animal to anyone else — even temporarily — without prior approval.'],
                ['🛏️', 'Do not allow the foster animal to sleep in your bed. They may find a forever home that does not allow this, and you want them adaptable.'],
                ['⚡', 'No dog parks, pet stores, or public areas until fully vaccinated and cleared by your rescue.'],
                ['🏘️', 'Keep your foster away from unknown neighborhood dogs — you cannot know their vaccination status.'],
                ['🐱', 'Foster cats and kittens must be kept indoors at all times and secured in a carrier during transport — never loose in a vehicle.'],
                ['👶', 'Never leave young children unsupervised with foster animals at any time.'],
                ['📋', 'Complete all required forms and profile submissions by the deadlines your rescue sets.'],
                ['🛁', 'Bathe your foster animal regularly and keep their living area clean.'],
                ['📅', 'Attend required events (adoption events, vet appointments, etc.) as scheduled.'],
                ['⚠️', 'If your foster animal bites a person or another animal — regardless of whether the bite breaks skin — notify your rescue coordinator immediately.'],
              ].map(([icon, text], i) => (
                <li key={i} className="flex gap-2 p-2 border rounded-xl bg-white">
                  <span>{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-amber-200 p-4 rounded-xl bg-amber-50/40 space-y-2">
            <h5 className="font-bold text-[13px] text-amber-950">Medical Costs & Liability</h5>
            <p className="text-[13px] leading-relaxed text-stone-600 font-medium">
              In most rescue arrangements, your rescue organization covers the medical care and expenses of the foster animal. However, if an interaction between your resident pet and your foster animal results in injury to your resident pet, that cost is typically your own responsibility. Confirm the details with your specific rescue coordinator before your first foster placement.
            </p>
          </div>

          <div className="border border-indigo-100 p-4 rounded-xl bg-indigo-50/40 space-y-2">
            <h5 className="font-bold text-[13px] text-indigo-950">If You Want to Adopt Your Foster</h5>
            <p className="text-[13px] leading-relaxed text-stone-600 font-medium">
              If you fall in love and want to adopt, let your rescue coordinator know as soon as possible. You must still go through the official adoption process — your rescue cannot remove an animal from availability without following proper procedures, as other families may have already expressed interest.
            </p>
          </div>

          <div className="border border-rose-200 p-4 rounded-xl bg-rose-50/40 space-y-2">
            <h5 className="font-bold text-[13px] text-rose-950">Medications</h5>
            <p className="text-[13px] leading-relaxed text-stone-600 font-medium">
              Many foster animals arrive with protocol medications prescribed by partnered veterinarians. Always administer medications exactly as instructed. Ask any questions before you leave the intake appointment. <strong>Important: all medications must be given with food unless otherwise instructed by your rescue or a veterinarian.</strong> Medications given on an empty stomach can cause nausea and vomiting.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "3. Preparing Your Home",
      subtitle: "Setup, crating & supplies before they arrive",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-[13px] mb-2">Choosing a Foster Area</h4>
            <p className="text-[13px] text-slate-500 font-semibold mb-2">Select a dedicated area (bathroom, laundry room, kitchen, or a gated corner). Consider:</p>
            <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-stone-600">
              {[
                ['🚶', 'How much foot traffic — too busy can overwhelm a shy animal.'],
                ['🧹', 'Whether flooring is easy to clean. Vinyl or tile is ideal; protect carpet or hardwood with a tarp.'],
                ['⚡', 'Check for cleaning supplies, electrical cords, or small objects. Remove all hazards.'],
                ['🚧', 'Whether the area can be safely gated using a baby/pet gate or wire exercise pen.'],
              ].map(([icon, text], i) => (
                <div key={i} className="bg-sky-50 px-3 py-2 rounded-xl border border-sky-100 flex gap-2">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-semibold text-amber-900">
              <strong>⚠️ About Garages:</strong> Garages are generally not suitable foster spaces — too many dangerous chemicals, sharp tools, and unsafe items. If you store pet food in a garage, keep it in an airtight container away from chemicals.
            </div>
          </div>

          <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-2xl">
            <h4 className="font-extrabold text-amber-950 text-[13px] mb-2 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              The Crate Setup
            </h4>
            <p className="text-xs leading-relaxed text-stone-700 font-medium mb-2">
              A crate is one of the most important tools you have as a foster. It provides security, aids housebreaking, and gives the animal a safe "den." Think of it as their bedroom, not a prison.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 font-bold border-t border-amber-200/50 pt-2">
              <div>• Line with soft blankets for warmth</div>
              <div>• Position the crate near you when home</div>
              <div>• Remove collar before crating</div>
              <div>• Attach to exercise pen for a play zone</div>
              <div>• Never use as punishment</div>
              <div>• Keep a chew toy inside at all times</div>
            </div>
            <p className="text-[11px] font-bold mt-2 text-amber-800">
              ⚠️ <strong>Warm Weather Warning:</strong> Do not crate when temperatures are excessively high — especially short-muzzled breeds (Bulldogs, Pugs) or thick-coated breeds (Huskies, Malamutes). Always ensure fresh cool water is available.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-slate-800 mb-1">Setting Up a Bathroom Zone (Dogs)</h4>
            <p className="text-[13px] text-stone-600 font-medium leading-relaxed">
              Create a designated bathroom zone using newspaper or builder's paper (avoid puppy pads — young animals often shred them). Place the bathroom zone away from the crate, food, and water. Animals naturally avoid eliminating near where they sleep.
            </p>
          </div>

          <div className="border border-sky-200 bg-sky-50/50 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-[13px] text-sky-950">🐱 Litter Box Setup & Care (Cats)</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-stone-600">
              {[
                'Place the litter box in a quiet, low-traffic area accessible at all times.',
                'Keep the litter box away from the cat\'s food and water.',
                'Avoid litter boxes with a flap-style entrance — some cats refuse to use them.',
                'Scoop at least once daily. A second cat means scooping more frequently.',
                'Completely empty and clean the box once a week with mild dish soap and warm water.',
                'Provide one box per floor or area for free-roaming cats.',
                'If your foster cat stops using the litter box, contact your rescue coordinator promptly.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-sky-500 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs font-semibold text-rose-900">
              <strong>🩺 Medical Note:</strong> A cat avoiding the litter box can signal a medical issue — UTI, diarrhea, or pain. Blood in the stool, visible worms, or dark potent-smelling urine are reasons to contact your rescue coordinator right away.
            </div>
          </div>

          <div className="border border-purple-100 bg-purple-50/30 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-purple-950">🐱 Setting Up Hiding Spaces (Cats)</h4>
            <p className="text-xs font-semibold text-stone-600 leading-relaxed">
              Cats feel safest with places to retreat to. Good options: covered cat beds, cardboard boxes with a hole cut in the side, cat towers with enclosed compartments, folded blankets in corners. Place at least one hiding spot at floor level and one elevated. <strong>Do not pull a hiding cat out of their spot — let them emerge on their own terms.</strong>
            </p>
          </div>

          <div className="border border-emerald-200 bg-emerald-50/30 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-emerald-950">🐱 Recommended Supplies for Cat Fosters</h4>
            <ul className="grid grid-cols-1 gap-1.5 text-xs font-semibold text-stone-600">
              {[
                'Non-porous food/water bowls (stainless steel or ceramic) — plastic harbors bacteria.',
                'A sturdy, hard-sided carrier — cats feel more secure in enclosed hard carriers during transport.',
                'Scratching posts or cardboard scratchers — provide at least one before the cat arrives.',
                'Extra blankets — washable resting spots that can be laundered between fosters.',
                'A variety of toys — cats have individual preferences; try different types.',
                'Enzyme-based stain and odor remover for accidents.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-emerald-500 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-slate-800 mb-1">Cleaning Supplies to Have Ready</h4>
            <p className="text-[13px] text-stone-600 font-medium leading-relaxed">
              Keep a pet-safe enzyme-based cleaner (like Nature's Miracle) on hand. Avoid ammonia-based cleaners — they smell like urine and attract animals back to the same spot. Use rubber gloves when cleaning up waste. Launder all towels, blankets, and soft toys regularly. Allow the area to fully ventilate before returning the animal after cleaning.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "4. The First Few Days",
      subtitle: "The crucial 72-hour decompression window",
      content: (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-stone-600 font-semibold">
            The first 72 hours are the most important — and often the most challenging. Foster animals commonly arrive with kennel stress: a buildup of anxiety from shelter life. They do not understand what is happening to them or whether they are safe. Please be patient with them, and with yourself.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-stone-50 border rounded-xl">
              <h5 className="font-bold text-xs text-slate-900 mb-2">What to Expect — These Are Normal</h5>
              <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
                {[
                  'Loose stools or mild diarrhea from stress and change in food.',
                  'Frequent urination from drinking a large amount of water.',
                  'Fast-paced eating and resource guarding around food or toys.',
                  'Whining, crying, or anxiety in the crate.',
                  'Hiding, trembling, or refusing to engage.',
                  'High energy that seems impossible to tire out — kennel stress can make animals feel "wound up."',
                  'Resident pets and foster animals needing time to establish their dynamic.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <h5 className="font-bold text-xs text-emerald-950 flex items-center gap-1 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Key Tip: Do Not Force Interaction
              </h5>
              <p className="text-xs text-emerald-900 leading-relaxed font-semibold">
                Let the animal come to you on their own timeline. Sit near them, speak softly, and let them investigate you at their own pace. Trust is built slowly and lasts forever.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800">Bringing Your Foster Home</h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-medium leading-snug">
              {[
                'Carry the animal into your home inside their crate — do not let them out in an unsecured area.',
                'Place the crate on the floor and let resident animals investigate calmly from the outside.',
                'When family members meet the foster for the first time, have them sit down and let the animal approach.',
                'Keep a leash on them outdoors at all times — even in a fenced yard — if they seem scared.',
                'If they seem afraid of walks, hold off for the first few days.',
                'Give them a bath as soon as they are calm enough — shelter animals often carry odors and parasites.',
                'Keep meet-and-greets with new people minimal for the first 48 hours to one week.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-indigo-400 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-semibold text-amber-900">
              <strong>⚠️ If Your Foster Gets Loose:</strong> Contact your rescue coordinator immediately. Do not wait to see if the animal returns on its own. Time matters — your coordinator can help coordinate a search right away.
            </div>
          </div>

          <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800">Helping Your Foster Decompress</h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
              {[
                'Prepare mental enrichment before they arrive — a frozen Kong stuffed with kibble or peanut butter, a puzzle toy, or a chew.',
                'For dogs, start with a walk when settled: ~1 mile for low-energy, 2 miles for medium, 3–4+ miles for high-energy dogs.',
                'Play soft music — classical, reggae, and ambient electronic music have been shown to calm animals.',
                'For highly anxious animals, consider a pheromone diffuser — Adaptil for dogs, Feliway for cats.',
                'Stick to essential commands only during the first few days — sit, stay, come. Save manners training for when calmer.',
                'Avoid overstimulating activities — loud gatherings, chaotic play sessions with multiple dogs.',
                'For cats: confine them to a single room for the first 3–7 days. Shy cats may need longer.',
                'Do not force petting, hugging, or picking up a new cat. Allow them to initiate contact on their own terms.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-sky-500 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs font-semibold text-rose-900">
            <strong>🩺 Stress & URIs in Cats:</strong> Stressed cats can make themselves physically ill. Upper respiratory infections (URIs) are common in cats from shelters. Watch for discharge from the eyes or nose and sneezing. URIs are treatable but should be caught early.
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
            <h4 className="font-bold text-[13px] text-indigo-950 mb-2">Introducing Foster Dogs to Resident Dogs</h4>
            <ul className="space-y-1.5 text-xs text-indigo-900 font-semibold">
              {[
                'Keep your foster separated from resident dogs for at least the first 24 hours.',
                'Begin introductions through a door or gate — let them smell each other without contact.',
                'Progress to brief, supervised face-to-face meetings on leash in a neutral space.',
                'Reward calm behavior from all animals with treats and praise.',
                'Never leave them unsupervised together until fully confident they are safe.',
                'Give each animal their own space to retreat to.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
            <h4 className="font-bold text-[13px] text-purple-950 mb-2">Introducing Foster Cats to Resident Cats</h4>
            <p className="text-xs font-semibold text-stone-600 mb-2">Cats require more patience — they can remain irritable or fearful for weeks.</p>
            <ul className="space-y-1.5 text-xs text-purple-900 font-semibold">
              {[
                'Keep your foster cat in their own room for at least one week.',
                'After a week with no intense hissing under the door, progress to a baby gate.',
                'If there is no sustained aggression at the gate, allow supervised interaction.',
                'Grumbling and hissing is normal. Physical fighting is not — separate and restart.',
                'Never leave resident cats and foster cats unsupervised together until fully confident.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900">
            <strong>💚 Hang In There:</strong> The first 24 hours are often the hardest — for you and for them. It will get better. Most animals begin to visibly relax within a day or two once they realize they are safe.
          </div>
        </div>
      ),
    },
    {
      title: "5. Crate Training",
      subtitle: "Teaching your animal to love their safe space",
      content: (
        <div className="space-y-4">
          <p className="text-[13px] text-stone-500 font-semibold leading-relaxed">
            Crate training is one of the greatest gifts you can give a foster animal. Animals that are comfortable in a crate are easier to adopt, easier to travel with, and feel more secure in new environments.
          </p>

          <div className="p-4 border rounded-2xl bg-sky-50/40">
            <h4 className="font-bold text-[13px] text-slate-800 mb-2">Introducing the Crate</h4>
            <ul className="space-y-2 text-xs text-stone-700 font-medium">
              {[
                'Place a soft blanket, a few favorite toys, and small treats inside to make it inviting.',
                'Keep a good chew toy in the crate at all times — it gives the animal something to focus on.',
                'Leave the door open at first and let the animal explore freely — never push or force them inside.',
                'Drop small pieces of kibble inside throughout the day to create positive associations.',
                'Feed meals inside the crate (initially near the door, then progressively toward the back).',
                'Practice crating while you are home first — this prevents association with being left alone.',
                'Praise and reward calmly when the animal enters the crate on their own.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-sky-500 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-slate-800 mb-2">Crating Duration Guidelines (Dogs)</h4>
            <p className="text-xs font-semibold text-stone-500 mb-2">Never crate beyond the maximum time appropriate for the animal's age:</p>
            <div className="overflow-hidden rounded-xl border border-sky-100">
              <table className="w-full text-xs font-semibold">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="text-left px-3 py-2">Age</th>
                    <th className="text-left px-3 py-2">Maximum Crate Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {[
                    ['9–10 weeks', '30–60 minutes'],
                    ['11–14 weeks', '1–3 hours'],
                    ['15–16 weeks', '3–4 hours'],
                    ['17+ weeks', '4–6 hours (6 hours absolute maximum)'],
                  ].map(([age, time], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-sky-50/30'}>
                      <td className="px-3 py-2 text-stone-700">{age}</td>
                      <td className="px-3 py-2 text-stone-700">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-2 italic">Note: Very young puppies under 9 weeks should not be crated — they cannot yet control their bladder and must eliminate 8–12 times per day.</p>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-indigo-950">Special Crating Considerations</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-indigo-900">
              <li>• Dogs previously kept outdoors have never been required to hold their bladder. They need a very gradual introduction — start with very short intervals.</li>
              <li>• Older dogs and dogs with medical conditions may only be able to hold it for short periods. Watch for signs of discomfort.</li>
              <li>• Always give rigorous exercise before and after any long crating period — a tired animal settles more easily.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 border rounded-xl bg-rose-50/50">
              <h5 className="font-extrabold text-rose-950 text-[13px] mb-2">When NOT to Use a Crate</h5>
              <ul className="space-y-1 text-xs text-rose-900 font-semibold">
                {[
                  'The animal has diarrhea or is vomiting.',
                  'The animal is too young to have bladder control.',
                  'You need to leave them for longer than the guidelines above.',
                  'The temperature is excessively high.',
                  'The animal has not had an opportunity to eliminate shortly before crating.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>

            <div className="p-3 border rounded-xl bg-slate-50">
              <h5 className="font-bold text-slate-900 text-[13px] mb-2">Important Crate Rules</h5>
              <ul className="space-y-1 text-xs text-stone-600 font-semibold">
                {[
                  'Never use the crate as punishment — this destroys trust.',
                  'Always remove the collar before crating.',
                  'Do not allow children to play in or around the crate while the animal is inside. The crate is their sanctuary.',
                  'If crated at night, place the crate near your bedroom so the animal does not feel isolated.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "6. Behavior & Basic Training",
      subtitle: "Kind guidance & positive reinforcement",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <h4 className="font-bold text-[13px] text-emerald-950 mb-2 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              Positive Reinforcement
            </h4>
            <p className="text-[13px] text-emerald-900 leading-relaxed font-medium">
              Always reward the behavior you want to see. Ignore or calmly redirect behavior you do not want. Never yell, hit, or frighten an animal into compliance — this creates fear and can make behavioral issues significantly worse. Keep training sessions short (5–10 minutes) and end on a success.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-slate-800 mb-2">Housetraining</h4>
            <p className="text-xs text-stone-500 font-semibold mb-2">Even previously housetrained adult dogs may have accidents in a new home — they need time to learn the new routine.</p>
            <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
              {[
                'Choose a consistent elimination spot and always take them to the same place.',
                'Use a consistent verbal cue every single time, such as "go potty."',
                'Take dogs out first thing in the morning, after every meal, after every drink, after play, after naps, and last thing at night. Every 2 hours for adults, every 45 minutes for puppies.',
                'Stand with them for up to 5 minutes. If they go, reward immediately. If not, bring them back inside and try again every 15 minutes.',
                'If they start to squat or sniff indoors, calmly say "Oops," scoop them up, and bring them to the correct spot.',
                'If they have an accident while you weren\'t watching, do not correct them — they cannot connect the punishment to something that already happened. Clean it up and recommit to your schedule.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-indigo-400 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <div className="mt-2 bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs font-semibold text-rose-900">
              <strong>⚠️ Never Do This:</strong> Never rub a dog's face in their mess or raise your voice at them for an accident. They will only learn to fear you. Accidents are a training opportunity, not a reason to punish.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 border rounded-xl bg-slate-50">
              <h4 className="font-bold text-[13px] text-slate-800 mb-2">Other House Manners to Work On</h4>
              <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
                {[
                  'No biting or mouthing: Redirect to a chew toy immediately and calmly say "no."',
                  'No jumping: Turn away and ignore until all four paws are on the floor, then reward.',
                  'Leash manners: Practice short walks with calm corrections — no retractable leashes for fearful or reactive animals.',
                  'Basic commands: Sit, stay, come, and leave it are the most valuable skills for adoption.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>

            <div className="p-3 border rounded-xl bg-indigo-50/40">
              <h4 className="font-bold text-[13px] text-indigo-950 mb-2">Separation Anxiety</h4>
              <ul className="space-y-1.5 text-xs text-indigo-900 font-semibold">
                {[
                  'Practice leaving and returning calmly — no big hellos or goodbyes.',
                  'Leave a worn piece of your clothing in their crate for comfort.',
                  'Give a high-value treat (like a frozen Kong) only when they go in the crate.',
                  'Gradually extend the time you are away to build their confidence.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-sky-950">🐱 Cat Behavior: Scratching</h4>
            <p className="text-xs font-semibold text-stone-600 leading-relaxed">
              Scratching is completely natural — cats do it to release emotions, mark territory, shed nail layers, and stretch. The goal is to redirect, not stop it.
            </p>
            <ul className="space-y-1 text-xs text-stone-600 font-semibold">
              {[
                'Provide at least one scratching post or cardboard scratcher before the cat arrives.',
                'If they scratch furniture, calmly redirect them. Rub a little catnip on the scratcher to attract them.',
                'Place double-sided tape on furniture surfaces they are scratching.',
                'Never physically punish a cat for scratching — it creates fear and does not stop the behavior.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="text-sky-500 shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-purple-950">🐱 Cat Behavior: Counter Jumping</h4>
            <p className="text-xs font-semibold text-stone-600 leading-relaxed">
              Getting up high is instinctive for cats. However, keeping them off counters and cooking surfaces is important for safety.
            </p>
            <ul className="space-y-1 text-xs text-stone-600 font-semibold">
              {[
                'Never leave food unattended on counters — this is the strongest invitation for a curious cat.',
                'Provide a cat tree or wall-mounted shelf as an approved high space.',
                'Aluminum foil placed on counter edges works well as a deterrent.',
                'Cats also dislike citrus scents — wiping surfaces with a citrus cleaner can help.',
                'Never push or shoo a cat off a surface from above — this can startle them and cause a fall.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="text-purple-500 shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900">
            <strong>💚 Why This Matters:</strong> Scratching furniture and jumping on counters are among the most common reasons cats are surrendered to shelters. Addressing these behaviors gently during fostering makes the cat significantly more adoptable.
          </div>
        </div>
      ),
    },
    {
      title: "7. Feeding & Nutrition",
      subtitle: "Proper diets & critical food warnings",
      content: (
        <div className="space-y-4">
          <p className="text-[13px] text-stone-500 font-semibold">
            Animals coming from shelters are often underweight, dehydrated, and nutritionally depleted. Proper nutrition is essential to their health and recovery.
          </p>

          <div className="p-4 border rounded-2xl bg-sky-50/40">
            <h4 className="font-extrabold text-slate-900 text-xs mb-3">Feeding Guidelines</h4>
            <ul className="space-y-2 text-xs text-stone-600 font-bold leading-relaxed">
              {[
                'Feed only the food provided or approved by your rescue organization. Sudden food changes cause diarrhea and vomiting.',
                'If a food change is needed, transition gradually: mix 75% old food / 25% new for several days, then 50/50, then 25% old / 75% new.',
                'Feed on a consistent schedule — this also helps with housebreaking and anxiety.',
                'Ensure fresh water is always available.',
                'Do not give rawhides, cooked bones, or table scraps.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-sky-500 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <div className="mt-3 bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-950 font-bold">
              💡 <strong>Upset Stomach Relief:</strong> Adding a small amount of plain cooked rice or plain canned pumpkin (not pie filling!) can help soothe transition diarrhea.
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
            <h4 className="font-extrabold text-rose-950 text-[13px] mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              TOXIC Foods — Never Feed These
            </h4>
            <p className="text-xs text-rose-800 leading-normal font-semibold mb-3">
              Never feed any of the following to dogs or cats. Use the <strong>Toxic Lookup</strong> tab above for the full list with explanations.
            </p>
            <div className="grid grid-cols-3 gap-1 px-2 py-1 bg-white/70 rounded-lg text-[10px] text-stone-700 font-black">
              {['Chocolate', 'Grapes & Raisins', 'Onions & Garlic', 'Xylitol', 'Macadamia Nuts', 'Avocado', 'Cooked Bones', 'Raw Dough', 'Marijuana/Cannabis', 'Tobacco', 'Raw Fish', 'Moldy Food'].map((item, i) => (
                <div key={i}>• {item}</div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "8. Health Monitoring",
      subtitle: "Daily checks, warning signs & emergency alerts",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
            <h4 className="font-black text-amber-950 text-[13px] mb-2 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
              Temperature Reference
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs font-bold text-stone-700">
              <div className="p-2 bg-white rounded-lg">👶 Newborn Puppies: <strong className="text-amber-700">94–97°F</strong></div>
              <div className="p-2 bg-white rounded-lg">🐕 Puppies (4w+) & Adult Dogs: <strong className="text-amber-700">100–102.5°F</strong></div>
              <div className="p-2 bg-white rounded-lg">🐈 Adult Cats: <strong className="text-amber-700">100.5–102.5°F</strong></div>
            </div>
            <p className="text-xs font-black text-rose-700 mt-2">
              🚨 Emergency: Temperature above 104°F or below 99°F requires immediate veterinary attention.
            </p>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border">
            <h4 className="font-extrabold text-slate-900 text-[13px] mb-3">Daily Health Check — Signs of a Healthy Animal</h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-stone-600 font-semibold">
              {[
                ['👁️', 'Eyes', 'Clear, bright, and free of discharge. A small amount of clear "sleep" in the corner is normal.'],
                ['👃', 'Nose', 'Moist and cool. Small amounts of clear discharge are usually fine.'],
                ['👂', 'Ears', 'Clean and odor-free. No dark debris, waxy buildup, or sour smell.'],
                ['🦴', 'Coat', 'Smooth, clean, and shiny — not rough, dull, or patchy.'],
                ['🦷', 'Gums', 'Pink and moist. Press a fingertip against the gum — color should return within 2 seconds.'],
                ['🫃', 'Belly', 'Smooth, not bloated or distended. No lumps at the navel area.'],
                ['💩', 'Stools', 'Firm and brown. Mild loose stools in the first day or two are normal.'],
                ['💧', 'Urine', 'Clear to pale yellow. Straining or unusual color warrants attention.'],
                ['⚡', 'Energy', 'Alert and curious. Even shy animals should show some interest in surroundings.'],
                ['🍽️', 'Appetite', 'Eating consistently at each meal. Missing one meal occasionally is less concerning than refusing multiple.'],
              ].map(([icon, label, desc], i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="shrink-0 w-5 text-center">{icon}</span>
                  <div><strong>{label}:</strong> {desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-xl">
            <h4 className="font-extrabold text-rose-950 text-[13px] mb-2">Early Warning Signs — Contact Your Rescue</h4>
            <ul className="grid grid-cols-1 gap-1.5 text-xs text-rose-950 font-semibold leading-snug">
              {[
                'Lethargy, sluggishness, unusual tiredness, or inability to stand',
                'Refusal to eat for more than two consecutive meals, or noticeable weight loss',
                'Excessive thirst or abnormally high water consumption',
                'Vomiting — especially if repeated, contains blood, or occurs alongside other symptoms',
                'Diarrhea for 3 or more consecutive episodes, or diarrhea with blood or mucus',
                'No bowel movement for more than 48 hours',
                'Nasal or eye discharge that is yellow, green, or thick/crusty',
                'Persistent coughing, sneezing, gagging, or labored breathing',
                'Pale, white, blue, or yellow-tinged gums',
                'Bloated, distended, or painful-looking abdomen',
                'Difficulty urinating or inability to urinate',
                'Blood in the urine',
                'Seizures, convulsions, collapse, or unconsciousness',
                'Body feels cold to the touch — can indicate shock',
                'Sudden aggression not previously seen',
                'Rough, dull, or patchy coat — or sudden patches of hair loss',
                'Any trauma — hit by a car, dropped, stepped on, or bite wound — even if acting normally',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-rose-500 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <div className="mt-3 bg-white/80 border border-rose-200 p-3 rounded-xl text-xs font-semibold text-rose-900">
              <strong>📋 When You Call:</strong> Always have ready: the animal's name, their current temperature, a clear description of symptoms and when they started, and any changes in eating, drinking, or bathroom habits. Photos or short videos are incredibly helpful.
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-amber-950">Recognizing Dehydration</h4>
            <p className="text-xs text-stone-600 font-semibold">Dehydration can develop quickly — especially in young puppies/kittens or any animal that has been vomiting or has diarrhea.</p>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              <li><strong>Skin tent test:</strong> Gently pinch the skin on the back of the neck. In a well-hydrated animal, it snaps back immediately. If it returns slowly or stays tented, the animal may be dehydrated.</li>
              <li><strong>Gum check:</strong> Healthy gums are pink and moist. Dry, tacky, or sticky gums are a sign of dehydration.</li>
              <li><strong>Other signs:</strong> Weakness, sunken eyes, reduced or no urination, and general lethargy.</li>
            </ul>
            <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-xs font-semibold text-rose-900">
              <strong>⚠️ Puppies & Kittens:</strong> Dehydration can become life-threatening within hours. If you suspect a very young foster is dehydrated, contact your rescue coordinator immediately.
            </div>
          </div>

          <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800">Signs of Pain in Dogs & Cats</h4>
            <p className="text-xs text-stone-500 font-semibold">Animals cannot tell you they are in pain. Watch for these behavioral and physical signs:</p>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Repeatedly glancing at, licking, or biting a specific area of their body',
                'Standing hunched, or in "prayer position" (front end down, rear end up) — common sign of abdominal pain in dogs',
                'Reluctance to move, climb stairs, jump, or get in/out of the car',
                'Whining, crying, growling, or vocalizing without obvious cause',
                'Sudden change in temperament — a normally friendly animal becoming snippy, withdrawn, or aggressive',
                'Cats in pain often hide, stop grooming, or sit hunched in a loaf position with eyes partially closed',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <p className="text-[11px] font-semibold text-slate-500 italic">Note: Some breeds (particularly bully breeds) have a higher pain threshold and may not vocalize even when in significant discomfort.</p>
          </div>
        </div>
      ),
    },
    {
      title: "9. Parasites: Fleas, Ticks & Worms",
      subtitle: "Pest identification, treatment rules & hygiene",
      content: (
        <div className="space-y-4">
          <div className="p-4 border border-rose-200 bg-rose-50/40 rounded-2xl space-y-2">
            <h4 className="font-bold text-[13px] text-rose-950 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              Critical Warning: Over-the-Counter Flea Products
            </h4>
            <p className="text-[13px] font-medium leading-relaxed text-stone-700">
              <strong>Do NOT use over-the-counter flea shampoos or powders on foster animals.</strong> If your rescue has already treated the animal for fleas and ticks, adding additional flea products can cause overdose, serious medical complications, and even death. Always use only the products authorized by your rescue organization.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-white border rounded-xl text-xs font-semibold text-stone-600 space-y-2">
              <span className="text-xl">🐜</span>
              <h5 className="font-extrabold text-slate-800 text-[13px]">If Fleas Are Spotted</h5>
              <ul className="space-y-1.5">
                {[
                  'Contact your rescue coordinator immediately.',
                  'Wash all bedding in hot water.',
                  'Vacuum all carpets, furniture, and the foster area thoroughly.',
                  'Dispose of the vacuum bag or empty the canister outside immediately after vacuuming.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>

            <div className="p-4 bg-white border rounded-xl text-xs font-semibold text-stone-600 space-y-2">
              <span className="text-xl">🕷️</span>
              <h5 className="font-extrabold text-slate-800 text-[13px]">If a Tick Is Found</h5>
              <ul className="space-y-1.5">
                {[
                  'Use fine-tipped tweezers to grasp the tick as close to the skin as possible.',
                  'Pull upward with steady, even pressure — do not twist or jerk.',
                  'Do NOT crush the tick — this can release bacteria into the animal.',
                  'Place the tick in rubbing alcohol to kill it.',
                  'Clean the bite area with rubbing alcohol or soap and water.',
                  'Notify your rescue coordinator that a tick was found and removed.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>

            <div className="p-4 bg-white border rounded-xl text-xs font-semibold text-stone-600 space-y-2">
              <span className="text-xl">🪱</span>
              <h5 className="font-extrabold text-slate-800 text-[13px]">Intestinal Worms</h5>
              <p className="font-medium text-stone-500 mb-2">Many shelter animals have intestinal parasites. Your rescue will typically deworm animals as part of standard protocol.</p>
              <ul className="space-y-1.5">
                {[
                  'Roundworms may be visible in stool — they look like spaghetti strands.',
                  'Tapeworm segments look like small grains of rice around the tail or in the stool.',
                  'A bloated belly in young animals often indicates worms.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs font-semibold text-amber-900">
            <strong>🧼 Hygiene Reminder:</strong> Always wash your hands thoroughly after handling stool, cleaning the foster area, or handling foster animals. Keep children away from the stool area. Do not allow other animals to sniff or investigate foster animal waste.
          </div>
        </div>
      ),
    },
    {
      title: "10. Post Spay/Neuter Care",
      subtitle: "Recovery monitoring after surgery",
      content: (
        <div className="space-y-4">
          <p className="text-[13px] text-stone-500 font-semibold leading-relaxed">
            Spaying and neutering are very safe procedures, but they are major surgeries requiring general anesthesia. The animal needs extra care and monitoring during the recovery period.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
              <h5 className="text-indigo-950 font-black text-[13px]">The First 24 Hours</h5>
              <ul className="space-y-1.5 text-xs font-semibold text-stone-600">
                {[
                  'Keep confined to a small, quiet, comfortable space — a crate or small room.',
                  'They may seem groggy, unsteady, or disoriented as the anesthesia wears off. This is normal.',
                  'Recovery from general anesthesia typically takes 18–24 hours.',
                  'They may have poor balance — assist them with stairs and getting in/out of vehicles.',
                  'Offer a small amount of food and water once fully awake. If vomiting occurs, wait until the next day.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border space-y-2">
              <h5 className="text-slate-900 font-black text-[13px]">Incision Site Care</h5>
              <ul className="space-y-1.5 text-xs font-semibold text-stone-600">
                {[
                  'Check the incision site once daily for one week.',
                  'A small amount of redness or swelling on the day of surgery is normal and expected.',
                  'Do NOT clean or apply any ointment to the incision site unless specifically instructed.',
                  'No baths for at least one week after surgery.',
                ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
              <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-xs font-semibold text-rose-900">
                <strong>⚠️ Critical:</strong> Do NOT allow your foster to lick or bite the incision site. An E-collar (cone) should be worn for at least 5–7 days post-surgery. Licking can cause infection and wound reopening.
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <h5 className="text-amber-950 font-black text-[13px]">Activity Restrictions (7–10 Days)</h5>
              <ul className="space-y-1.5 text-xs font-semibold text-stone-600">
                {['No running, jumping, rough play, or strenuous activity.', 'Short, leashed bathroom walks only.', 'No swimming or bathing.', 'Keep the animal calm and rested as much as possible.'].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs font-bold text-rose-950 space-y-2">
            <h5 className="text-rose-700 font-black text-[13px]">When to Contact Your Rescue Immediately</h5>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
              {['Pale or white gums', 'Excessive vomiting (more than 4 times)', 'Discharge or bleeding from the incision', 'Difficulty urinating', 'Labored or rapid breathing', 'Lethargy lasting more than 24 hours', 'Significant swelling or opening at incision site', 'Loss of appetite lasting more than 24 hours'].map((item, i) => (
                <div key={i} className="flex gap-1"><span className="text-rose-500 shrink-0">•</span><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "11. Hygiene & Grooming",
      subtitle: "Bathing, ears, nails, teeth & disinfecting",
      content: (
        <div className="space-y-4 text-[13px] font-semibold text-stone-700">
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-xl shrink-0">🛁</span>
              <div>
                <strong className="text-slate-800">Bathing</strong>
                <ul className="mt-1 space-y-1 text-xs font-medium text-stone-600">
                  {[
                    'Bathe your foster shortly after they arrive home — shelter animals often carry odors and parasites.',
                    'Use only shampoo approved or provided by your rescue organization.',
                    'Do not get water directly in the animal\'s ears — use a damp washcloth on the face and ears.',
                    'Ensure the animal is fully dry before returning them to their area, especially in cool weather.',
                    'Bathe regularly throughout the foster period — weekly is ideal.',
                    'Do not bathe within one week of a spay/neuter surgery.',
                  ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
                </ul>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="text-xl shrink-0">👂</span>
              <div>
                <strong className="text-slate-800">Ears</strong>
                <p className="text-xs font-medium text-stone-600 mt-1">Check ears weekly. Healthy ears are clean, pink, and odor-free. Contact your rescue if you notice:</p>
                <ul className="mt-1 space-y-1 text-xs font-medium text-stone-600">
                  {['Dark brown or black debris (may indicate ear mites)', 'A sour or yeasty smell (may indicate ear infection)', 'Excessive scratching at the ears or head-shaking', 'Crusting, discharge, or swelling'].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
                </ul>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="text-xl shrink-0">💅</span>
              <div>
                <strong className="text-slate-800">Nails</strong>
                <p className="text-xs font-medium text-stone-600 mt-1">Regular nail trims are important — long nails can cause difficulty walking, posture problems, and pain. If nails are clicking on the floor, they are too long. Notify your rescue coordinator to arrange a trim.</p>
                <div className="mt-2 bg-amber-50 border border-amber-200 p-2 rounded-lg text-xs font-semibold text-amber-900">
                  <strong>⚠️ Dewclaw Warning:</strong> Pay special attention to dewclaws — the small claw on the inner leg that doesn't touch the ground. Because they cannot be filed down naturally through walking, they can curl and grow into the paw pad if left untrimmed. Check them regularly.
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="text-xl shrink-0">🦷</span>
              <div>
                <strong className="text-slate-800">Teeth</strong>
                <p className="text-xs font-medium text-stone-600 mt-1">If you notice very heavy tartar buildup, broken teeth, or the animal avoiding food on one side of their mouth, let your rescue know.</p>
              </div>
            </li>
          </ul>

          <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800">Disinfecting Your Foster Space</h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
              {[
                'Bleach is one of the most effective disinfectants: 1 part bleach to 30 parts water (approx. ¼ cup bleach per gallon). Allow at least 10 minutes contact time before rinsing. Do not use color-safe bleach.',
                'Many "natural" or "eco-friendly" cleaners are NOT disinfectants even if non-toxic. Always read the label.',
                'Clorox Wipes do not contain bleach and are not a disinfectant for animal care areas.',
                'Wash all animal bedding, towels, and soft toys in a separate load. Do not use fabric softener — it can irritate sensitive skin.',
                'Allow all surfaces to fully dry and ventilate before returning the animal to the area.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span>{item}</span></li>
              ))}
            </ul>
            <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-xs font-semibold text-rose-900">
              <strong>⚠️ Cat Safety — Pine Oil:</strong> Never use cleaners containing pine oil (such as Pine-Sol) around cats. Pine oil is toxic to felines and can cause serious illness even through skin contact or inhalation.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "12. Safety Guidelines",
      subtitle: "Children, resident animals & household hazards",
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <h4 className="font-bold text-[13px] text-amber-950 mb-2 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Around Children
            </h4>
            <p className="text-[13px] text-stone-600 font-medium leading-relaxed">
              <strong>Never leave young children unsupervised with a foster animal — no exceptions.</strong> Even the gentlest animal can react unexpectedly when startled, cornered, or in pain.
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Teach children to approach animals calmly and let the animal come to them.',
                'Teach children never to approach an animal while it is eating, sleeping, or in its crate.',
                'Do not allow children to play in or handle the animal while it is in its crate.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="p-4 border rounded-xl bg-slate-50 space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800">Around Other Animals</h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Do not allow your foster animal to interact with unknown neighborhood dogs.',
                'Do not take unvaccinated animals to dog parks, pet stores, or grassy public areas.',
                'Always use a secure leash and harness. Double-check gates and latches before letting the animal into any outdoor area.',
                'Puppies should never be left unsupervised outdoors — even in a securely fenced yard.',
                'Foster cats and kittens must remain indoors at all times.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[13px] text-slate-800">Household Hazards — Room by Room</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 border rounded-xl bg-white space-y-1.5 text-xs font-semibold text-stone-600">
                <h5 className="font-black text-slate-800 text-[13px]">Kitchen, Bathroom & Utility Areas</h5>
                {[
                  'Keep all medications, cleaners, chemicals, and laundry supplies locked or out of reach.',
                  'Keep trash cans covered or inside a latched cabinet.',
                  'Block small spaces behind appliances — animals can squeeze in and get trapped.',
                  'Keep toilet lids closed — small animals can fall in, and toilet cleaning chemicals are toxic.',
                  'Keep all food out of reach.',
                ].map((item, i) => <div key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></div>)}
                <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-xs font-semibold text-rose-900">
                  <strong>⚠️ Dryer Safety:</strong> Before running the dryer, always check inside for cats and kittens. They are attracted to warm, enclosed spaces and will climb in. This is a life-threatening hazard.
                </div>
              </div>

              <div className="p-3 border rounded-xl bg-white space-y-1.5 text-xs font-semibold text-stone-600">
                <h5 className="font-black text-slate-800 text-[13px]">Living Areas</h5>
                {[
                  'Secure all electrical cords and dangling wires out of reach.',
                  'Keep children\'s toys put away — animals cannot tell the difference between their toys and a child\'s.',
                  'Move houseplants out of reach — many common houseplants are toxic to dogs and cats.',
                  'Put away all sewing and craft supplies, especially thread, string, yarn, and ribbon — if swallowed, thread can cause life-threatening intestinal damage.',
                  'Ensure windows and screens are secure — curious animals can push through easily.',
                ].map((item, i) => <div key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></div>)}
              </div>

              <div className="p-3 border rounded-xl bg-white space-y-1.5 text-xs font-semibold text-stone-600">
                <h5 className="font-black text-slate-800 text-[13px]">Toy Safety</h5>
                {[
                  'Choose soft toys that are machine washable.',
                  'Do not leave puppies or dogs unsupervised with toys — they can shred and swallow pieces quickly.',
                  'Remove toys when dogs who are unfamiliar with each other are playing together — toys can trigger possession aggression.',
                ].map((item, i) => <div key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "13. Helping Your Foster Get Adopted",
      subtitle: "Photos, bios, social media & adoption events",
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
            <p className="text-[13px] text-emerald-950 font-semibold leading-relaxed">
              You know your foster better than anyone. You have watched them sleep, seen how they greet strangers, observed what makes them light up. That knowledge is the most powerful adoption tool available — and you are the one who has it.
            </p>
          </div>

          <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-sky-600" />
              Photography Tips
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Take both a headshot and a full-body photo for every animal.',
                'Get on their level — kneel or lie on the floor to shoot at eye level. Photos from above make animals look small and sad.',
                'Shoot in natural light near a window or outdoors in shade. Avoid flash.',
                'Try to get them looking directly at the camera. A treat held just above the lens works well for dogs.',
                'Capture their personality — a mid-play action shot, a goofy expression, a tender moment.',
                'Make sure the photo is sharp and in focus. Blurry photos get scrolled past.',
                'Avoid cluttered backgrounds — a plain wall or clean floor lets the animal be the star.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="text-sky-500 shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-slate-800">Video Tips</h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Always shoot video with your phone held horizontally (landscape mode).',
                'Keep videos to one minute or less. Shorter videos get watched; long ones get skipped.',
                'Show the animal in motion — walking, playing, interacting with you.',
                'A short video of them being calm and cuddly can be just as powerful as a playful one.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-indigo-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Write an Honest, Compelling Bio
            </h4>
            <ul className="space-y-1.5 text-xs text-indigo-900 font-semibold">
              {[
                'Lead with personality, not just facts. "Barnaby has never met a mud puddle he didn\'t love" tells you more than "energetic, 1.5 years old."',
                'Be specific about what makes this animal unique — their quirks, their favorite things, the funny things they do.',
                'Be honest about their needs. If they need a home without cats, say so clearly. The right match leads to a successful adoption.',
                'Include practical details: age, breed, weight, house-trained status, and how they do with dogs, cats, and children.',
                'Complete any profile or survey your rescue organization provides.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
            <div className="bg-white/80 border border-indigo-200 p-3 rounded-xl text-xs font-semibold text-indigo-900">
              <strong>💚 Pro Tip:</strong> Your rescue may have tools to help you create shareable adoption flyers, social media posts, and AI-assisted bios. Take advantage of these — a polished, well-written post travels much further than a quick snapshot with a caption.
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-rose-950">Share on Social Media</h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Post photos and updates on your personal Facebook, Instagram, and neighborhood or community groups.',
                'Post regularly — not just once. One post gets buried. A weekly update keeps the animal visible.',
                'Always direct interested people to contact the rescue directly to begin the adoption process.',
                'Tag your rescue organization in your posts so their followers can see and share too.',
                'Local Facebook groups — neighborhood pages, breed-specific groups — can be especially effective.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="text-rose-500 shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-[13px] text-amber-950">Attend Adoption Events</h4>
            <p className="text-xs font-semibold text-stone-600 leading-relaxed">
              Adoption events are one of the most effective ways to find a match. Meeting an animal in person creates an emotional connection that no photo can replicate.
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
              {[
                'Attend any adoption events your rescue organizes and bring your foster when appropriate.',
                'Present the animal at their best — freshly bathed, calm, on a well-fitted harness or in a clean carrier for cats.',
                'Be ready to talk about them enthusiastically and honestly. You are their spokesperson.',
                'If meeting potential adopters, let the animal set the pace for interaction — don\'t force greetings.',
              ].map((item, i) => <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{item}</span></li>)}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "14. Common Questions",
      subtitle: "Troubleshooting everyday foster situations",
      content: (
        <div className="space-y-4">
          {[
            {
              q: "How long will I have my foster animal?",
              a: "Every situation is different. Foster placements can range from a single day to several months, depending on the animal's needs and how quickly they find their forever home. Your rescue coordinator will keep you updated on the timeline.",
            },
            {
              q: "How much time does fostering actually require?",
              a: "It depends on the animal. Foster animals need everything an owned pet does — feeding, exercise, companionship, training, and monitoring. Before taking a placement, be honest with your rescue about your availability so they can match you with an animal that fits your schedule.",
            },
            {
              q: "My foster is crying in the crate all night. What do I do?",
              a: "This is very common in the first few nights. Try placing the crate near your bed. A worn t-shirt inside the crate provides comfort. Avoid responding to crying with attention or letting them out — this teaches them that crying works. Instead, wait for a moment of quiet and offer calm reassurance.",
            },
            {
              q: "My foster won't eat. Should I be worried?",
              a: "Skipping one or two meals in the first day or two is common due to stress. If the animal misses more than two consecutive meals or seems unwell, contact your rescue coordinator. Never add human food or table scraps to entice them — this can upset their digestive system further.",
            },
            {
              q: "My resident dog is growling at the foster. Is this normal?",
              a: "Growling is a warning signal — it means \"give me space.\" Do not punish growling, as this removes a valuable communication signal. Separate the animals, slow the introduction process, and give each animal their own safe zone. Consult your rescue coordinator if aggression escalates.",
            },
            {
              q: "The foster had an accident in the house. What do I do?",
              a: "Clean it up calmly without scolding the animal — they do not understand punishment after the fact. Use an enzyme-based cleaner (not ammonia-based) to eliminate the odor. Revisit your housebreaking schedule and supervise more closely.",
            },
            {
              q: "My foster seems scared of everything. Will they be okay?",
              a: "Many shelter animals arrive extremely fearful. With patience, routine, and gentle positive reinforcement, most animals blossom dramatically within 2–3 weeks. The \"3-3-3 rule\": 3 days to decompress, 3 weeks to learn the routine, 3 months to feel truly at home.",
            },
            {
              q: "Can I take my foster to meet friends and family?",
              a: "Check with your rescue before exposing your foster to new environments and new people. Unvaccinated animals should not be taken to unknown homes with other pets. For vaccinated animals, keep visits calm, brief, and positive. Never force interaction.",
            },
            {
              q: "What if I need to travel or can't care for the foster temporarily?",
              a: "Contact your rescue coordinator as soon as possible. Do not transfer the animal to another home without permission. The rescue will arrange appropriate temporary care.",
            },
          ].map(({ q, a }, i) => (
            <div key={i} className={`space-y-1 ${i > 0 ? 'border-t pt-4' : ''}`}>
              <h5 className="font-extrabold text-indigo-700 text-[13px]">Q: {q}</h5>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">{a}</p>
            </div>
          ))}

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs font-semibold text-emerald-900">
            <strong>💚 The 3-3-3 Rule:</strong> 3 days to decompress from the shelter environment, 3 weeks to learn your basic household routine, and 3 months to feel truly confident and at home. Most animals transform dramatically in this window.
          </div>
        </div>
      ),
    },
    {
      title: "15. Emergency Quick Reference",
      subtitle: "When to seek emergency veterinary care immediately",
      content: (
        <div className="space-y-4">
          <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-rose-950 text-[15px] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Always Seek Emergency Veterinary Care If:
            </h4>
            <ul className="space-y-2 text-xs text-rose-950 font-semibold">
              {[
                'Seizures, convulsions, or sudden collapse',
                'Difficulty breathing or choking',
                'Suspected poisoning or toxin ingestion',
                'Trauma (hit by a car, fall from height, bite wound from another animal)',
                'Temperature above 105°F or below 96°F',
                'Inability to urinate — especially in male cats, this is a life-threatening emergency',
                'Pale, blue, or white gums',
                'Bloated, hard, or distended abdomen with distress',
                'Suspected broken bones',
                'Uncontrolled bleeding',
              ].map((item, i) => (
                <li key={i} className="flex gap-2 p-2 bg-white/60 rounded-xl">
                  <span className="text-rose-500 shrink-0">🚨</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 border p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-slate-800 text-[15px]">Your Rescue Contact Information</h4>
            <p className="text-xs text-stone-500 font-semibold">Fill in this section with your rescue organization's specific contact information and post it somewhere visible in your home.</p>
            <div className="space-y-3 text-xs font-semibold text-stone-600">
              {[
                'Rescue Organization: ___________________________',
                'Foster Coordinator: _______________ Phone: _______________',
                'Medical/Emergency Contact: _______________ Phone: _______________',
                'General Email: ___________________________',
                'Partnered Veterinary Clinic: ___________________________',
                'Emergency Vet (after hours): ___________________________',
              ].map((item, i) => (
                <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-xl">{item}</div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-[13px] font-semibold text-emerald-950">
            <strong>💚 Always Remember:</strong> When in doubt, contact your rescue coordinator first — even in the middle of the night. They would always rather hear from you than have an animal deteriorate without care. You will never be judged for reaching out. That is what the team is there for.
          </div>

          <div className="text-center py-4 border-t border-sky-100">
            <p className="text-[15px] font-black text-slate-700">Thank you for fostering.</p>
            <p className="text-[13px] font-medium text-stone-500 mt-1">Every animal that passes through your home carries your kindness forward.<br/>The love you give them teaches them to trust again.</p>
            <p className="text-[11px] font-bold text-indigo-500 mt-2 uppercase tracking-wider">🐾 RescueKit — Free tools for the rescue community 🐾</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="foster-guide-dashboard" className="w-full bg-white border border-sky-100 rounded-2xl md:rounded-3xl p-6 shadow-sm font-sans">

      {/* GUIDE HEADER BANNER */}
      <div className="no-print bg-gradient-to-r from-sky-50/40 to-indigo-50/20 p-6 rounded-2xl border border-sky-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-[11px] font-black tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 inline-block mb-1.5">
            🎓 RescueKit Education Hub
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">RescueKit Foster Guide</h1>
          <p className="text-[13px] text-slate-500 font-bold mt-1">A complete handbook for foster families</p>
        </div>
        <div className="hidden md:block text-right bg-white/80 p-2.5 px-4 rounded-2xl border border-sky-100 shrink-0">
          <span className="text-[11px] font-black text-emerald-600 block">15 chapters · Prepare, learn & decompress 🏡❤️</span>
          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Offline-ready support resource</span>
        </div>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex flex-wrap gap-1.5 shrink-0 bg-sky-50/50 p-1 rounded-2xl border border-sky-100 mb-6">
        {([
          ['content', '📖 Full Guide'],
          ['checklist', '📋 Preparation Checklist'],
          ['toxic', '☠️ Toxic Lookup'],
          ['health', '🌡️ Temp Analyzer'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-3.5 py-1.5 text-[13px] font-extrabold rounded-xl transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* FULL GUIDE TAB */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapter Selector Sidebar (Desktop) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-3">
            <div className="space-y-1.5 border-r border-sky-50/80 pr-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-1">CHAPTER DIRECTORY</span>
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentChapter(idx)}
                  className={`cursor-pointer w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border ${
                    currentChapter === idx
                      ? 'bg-slate-900 border-slate-950 text-white shadow-sm font-bold'
                      : 'bg-white hover:bg-sky-50 border-sky-50/50 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="truncate">
                    <h4 className="text-[13px] truncate">{ch.title}</h4>
                    <p className={`text-[11px] truncate ${currentChapter === idx ? 'text-indigo-200' : 'text-slate-400'}`}>{ch.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${currentChapter === idx ? 'translate-x-1 text-indigo-300' : 'text-slate-350'}`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="cursor-pointer w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-600 text-indigo-950 hover:text-white shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 shrink-0 text-indigo-600 group-hover:text-white" />
                <div>
                  <h4 className="text-[13px] font-black truncate">Download / Print Guide (PDF)</h4>
                  <p className="text-[10px] font-semibold opacity-75 mt-0.5 leading-none">Get the whole handbook as a PDF</p>
                </div>
              </div>
              <span className="text-[13px]">💾</span>
            </button>
          </div>

          {/* Mobile Chapter Dropdown */}
          <div className="block lg:hidden w-full mb-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Select Guide Chapter</label>
            <select
              value={currentChapter}
              onChange={(e) => setCurrentChapter(Number(e.target.value))}
              className="w-full bg-white border border-sky-200 text-slate-700 font-semibold p-3.5 rounded-xl outline-none shadow-2xs cursor-pointer text-[13px]"
            >
              {chapters.map((ch, idx) => (
                <option key={idx} value={idx}>{ch.title}</option>
              ))}
            </select>
          </div>

          {/* Chapter Content Panel */}
          <div className="lg:col-span-8 bg-sky-50/20 border border-sky-100 rounded-2xl p-6 min-h-[460px] relative">
            <span className="text-[11px] font-black text-indigo-600 tracking-wider">CHAPTER {currentChapter + 1} OF {chapters.length}</span>
            <h2 className="text-lg font-black text-slate-900 border-b pb-2 mt-1">{chapters[currentChapter].title}</h2>
            <p className="text-[13px] font-semibold text-slate-400 mt-1 mb-5">{chapters[currentChapter].subtitle}</p>

            <div className="font-sans">
              {chapters[currentChapter].content}
            </div>

            <div className="flex justify-between items-center border-t border-sky-100 pt-4 mt-8">
              <button
                type="button"
                onClick={() => setCurrentChapter(prev => Math.max(0, prev - 1))}
                disabled={currentChapter === 0}
                className="cursor-pointer px-4 py-2 border rounded-full text-[13px] font-extrabold text-slate-600 hover:bg-sky-50 hover:text-slate-900 transition-colors disabled:opacity-40"
              >
                &lsaquo; Prev Chapter
              </button>
              <span className="text-[11px] font-semibold text-slate-400">{currentChapter + 1} / {chapters.length}</span>
              <button
                type="button"
                onClick={() => setCurrentChapter(prev => Math.min(chapters.length - 1, prev + 1))}
                disabled={currentChapter === chapters.length - 1}
                className="cursor-pointer px-4 py-2 bg-slate-900 text-white rounded-full text-[13px] font-extrabold hover:bg-slate-800 transition-colors disabled:opacity-40"
              >
                Next Chapter &rsaquo;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKLIST TAB */}
      {activeTab === 'checklist' && (
        <div className="space-y-4 font-sans text-stone-700">
          <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-emerald-950 text-[15px]">Interactive Foster Home Preparation Tracker</h3>
              <p className="text-[13px] text-emerald-800 font-medium leading-relaxed mt-1">
                Perform this safety sweep checklist before the car ride home. Checked items are saved locally.
              </p>
            </div>
            <div className="bg-white/90 border rounded-2xl px-5 py-3 text-center shrink-0">
              <span className="text-xl font-mono font-black text-indigo-700">
                {Object.values(completedTasks).filter(Boolean).length} / {CHECKLIST_ITEMS.length}
              </span>
              <span className="text-[10px] text-slate-400 block font-bold mt-0.5">COMPLETED TASKS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Home Setup', 'Household Safety', 'Responsibilities'] as const).map(cat => (
              <div key={cat} className="space-y-3">
                <h4 className="font-black text-slate-800 text-[13px] border-b pb-1.5 flex items-center justify-between">
                  <span>{cat}</span>
                  <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {CHECKLIST_ITEMS.filter(c => c.category === cat && completedTasks[c.id]).length} done
                  </span>
                </h4>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS.filter(c => c.category === cat).map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleTask(item.id)}
                      className={`cursor-pointer w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                        completedTasks[item.id]
                          ? 'bg-emerald-50/40 border-emerald-200 text-stone-500'
                          : 'bg-white border-sky-100 hover:border-slate-300 text-stone-800'
                      }`}
                    >
                      {completedTasks[item.id]
                        ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        : <Square className="w-4 h-4 text-slate-350 shrink-0 mt-0.5" />}
                      <span className={`text-[13px] font-semibold leading-relaxed ${completedTasks[item.id] ? 'line-through' : ''}`}>
                        {item.task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOXIC FOODS TAB */}
      {activeTab === 'toxic' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-extrabold text-rose-950 text-[15px] flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Dogs & Cats Toxic Food Library
              </h3>
              <p className="text-[13px] text-rose-800 font-medium leading-relaxed mt-1">
                Dozens of standard household foods trigger fatal organ damage. Check ingredients carefully.
              </p>
            </div>
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-rose-400" />
              <input
                type="text"
                placeholder="Type food (e.g., onions, raisins)..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full bg-white border border-rose-200 rounded-xl py-2 pl-9 pr-4 text-[13px] font-semibold placeholder:text-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map((f, i) => (
              <div key={i} className="p-3.5 border border-purple-100 bg-white rounded-xl shadow-2xs flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-[13px] shrink-0 font-extrabold">☠️</div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-[13px]">{f.name}</h4>
                  <p className="text-[11px] text-stone-500 font-bold mt-1 leading-normal">{f.effect}</p>
                </div>
              </div>
            ))}
            {filteredFoods.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 font-semibold text-[13px] space-y-1">
                <span>⚠️ No exact matches found.</span>
                <p className="text-xs text-stone-500">When in doubt, never feed table scraps or human food to a foster animal.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEMPERATURE ANALYZER TAB */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-stone-700">
          <div className="space-y-3.5">
            <h3 className="font-extrabold text-slate-900 text-[15px]">Vital Temperature Reference Analyzer</h3>
            <p className="text-[13px] leading-relaxed text-stone-500 font-semibold">
              A foster animal cannot voice pain — their core temperature is the best indicator of silent illnesses or life-threatening conditions.
            </p>
            <div className="space-y-2 border-l-2 border-indigo-200 pl-4 py-1">
              <p className="text-[11px] font-bold text-stone-600">🎯 <strong>Normal Newborn puppy temperature:</strong> 94–97°F</p>
              <p className="text-[11px] font-bold text-stone-600">🎯 <strong>Normal Puppies (4+ wks) & Adult dogs:</strong> 100–102.5°F</p>
              <p className="text-[11px] font-bold text-stone-600">🎯 <strong>Normal Adult cat temperature:</strong> 100.5–102.5°F</p>
            </div>
            <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
              <h4 className="font-bold text-[13px] text-slate-900 mb-1">How & When to Measure</h4>
              <p className="text-[11px] text-slate-600 leading-normal font-medium">
                Measure rectally using a pet thermometer and personal lubricant. If you measure under 99°F or above 104°F, this is a severe medical crisis requiring immediate veterinary attention.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border p-6 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-slate-900 text-[13px] text-center border-b pb-2 mb-2">Calculator Tool</h4>
            <div>
              <label className="text-[11px] font-black text-stone-500 block mb-1">1. SELECT PET CLASS</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['puppy_new', '👶 Newborn Pups'],
                  ['dog_adult', '🐕 Dogs / Older Pups'],
                  ['cat_adult', '🐈 Adult Cats'],
                ] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setTempSpecies(val)}
                    className={`cursor-pointer px-3 py-2 text-[11px] rounded-xl font-extrabold border transition-all ${tempSpecies === val ? 'bg-slate-900 text-white border-slate-950 shadow-xs' : 'bg-white text-stone-700 border-sky-100 hover:bg-sky-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-stone-500 block mb-1">2. INPUT MEASURED °F VALUE</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full bg-white border border-sky-100 rounded-xl py-2 px-3.5 text-[13px] font-mono font-bold text-center focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <span className="absolute right-3.5 top-2.5 text-[13px] font-bold text-stone-400">°F</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-center leading-normal ${
              tempResult.status === 'normal'
                ? 'bg-emerald-50 border border-emerald-255 text-emerald-950'
                : tempResult.status === 'emergency'
                ? 'bg-rose-50 border border-rose-300 text-rose-950 animate-pulse'
                : 'bg-amber-50 border border-amber-300 text-amber-950'
            }`}>
              <span className="text-[11px] font-black uppercase tracking-widest block text-stone-500 mb-1">REPORT SUMMARY</span>
              <p className="text-xs font-bold">{tempResult.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY SECTION */}
      <div className="hidden print:block bg-white text-slate-800 p-6 font-sans leading-relaxed text-[13px]">
        <div className="text-center border-b-2 border-slate-300 pb-5 mb-8">
          <h1 className="text-3xl font-black text-indigo-700 tracking-tight">RESCUEKIT FOSTER GUIDE</h1>
          <p className="text-[13px] font-bold text-slate-500 mt-2 uppercase">A Complete Handbook for Foster Families</p>
          <div className="mt-4 text-[11px] text-slate-400 font-bold">
            Provided as a free resource by RescueKit • rescuekit.org
          </div>
        </div>

        <div className="space-y-8">
          {chapters.map((ch, idx) => (
            <div key={idx} className="print:break-inside-avoid border-b border-stone-150 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
              <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest block">CHAPTER {idx + 1} OF {chapters.length}</span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1 mb-2">{ch.title}</h2>
              <p className="text-xs font-bold text-slate-400 mb-4">{ch.subtitle}</p>
              <div className="text-xs text-slate-700 space-y-3 text-left">
                {ch.content}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center border-t border-stone-200 pt-6 mt-10">
          <p className="text-xs font-bold text-stone-500">
            Thank you for fostering. Every animal that passes through your home carries your kindness forward.
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">🐾 RescueKit Community Hub</span>
        </div>
      </div>

      {/* PERSISTENT DISCLAIMER NOTE */}
      <div className="print:hidden mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-[11px] text-slate-500 font-medium leading-relaxed space-y-2">
        <p>
          <strong className="text-slate-600">For rescue coordinators:</strong> This guide is provided as a free resource by RescueKit and is designed to be a foundation, not a final rulebook. Feel free to adapt it — layer in your own policies, contact details, and organization-specific protocols to make it fully yours.
        </p>
        <p>
          <strong className="text-slate-600">For fosters:</strong> This guide covers general best practices, but every rescue operates a little differently. Always check with your coordinator for rules specific to your rescue — including adoption procedures, event attendance, transport policies, and anything else not outlined here.
        </p>
      </div>

      {/* FOOTER */}
      <div className="print:hidden border-t border-sky-50 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[13px] text-center md:text-left">
        <div className="flex items-center gap-2.5">
          <Heart className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="font-semibold text-stone-500">
            <strong>Thank you for fostering.</strong> Every animal that passes through your home carries your kindness forward.
          </p>
        </div>
        <div>
          <span className="font-bold text-[11px] text-indigo-500 uppercase tracking-wider">RescueKit Community Tools</span>
        </div>
      </div>

    </div>
  );
}
