import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  CheckSquare, 
  AlertTriangle, 
  Square,
  Thermometer, 
  HelpCircle, 
  ShieldAlert, 
  PhoneCall, 
  Activity, 
  Sparkles,
  BookOpen,
  Printer,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

// TOXIC FOODS LIST (Page 6)
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
  { name: 'Moldy or spoiled food', effect: 'Contains multiple toxins; causes vomiting, diarrhea, and organ damage.' }
];

// HAZARDS CHECKLIST (Pages 2 & 12)
interface ChecklistItem {
  id: string;
  category: 'Home Setup' | 'Household Safety' | 'Responsibilities';
  task: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'area_sep', category: 'Home Setup', task: 'Select dedicated area (bathroom, laundry room, or corner to pen off)' },
  { id: 'area_floor', category: 'Home Setup', task: 'Ensure flooring is easy to clean (protect carpets or hardwoods with a tarp)' },
  { id: 'crate_line', category: 'Home Setup', task: 'Line the crate with a soft towel or blanket for comfort and warmth' },
  { id: 'pup_bath', category: 'Home Setup', task: 'For puppies: Setup puppy pads or papers away from crate, food & water' },
  { id: 'clean_ready', category: 'Home Setup', task: 'Have pet-safe enzyme cleaner (like Nature’s Miracle) and gloves ready' },
  { id: 'cord_safety', category: 'Household Safety', task: 'Secure all electrical cords out of reach' },
  { id: 'chem_lock', category: 'Household Safety', task: 'Remove or lock up cleaning supplies, medications, and chemicals' },
  { id: 'small_obj', category: 'Household Safety', task: 'Remove small ingestible objects (rubber bands, coins, children’s toys)' },
  { id: 'plant_check', category: 'Household Safety', task: 'Verify all indoor and accessible plants are non-toxic to pets' },
  { id: 'window_sec', category: 'Household Safety', task: 'Ensure windows and screens are fully secured to prevent escapes' },
  { id: 'resp_sleep', category: 'Responsibilities', task: 'Agree with family that foster animal will not sleep in your bed' },
  { id: 'resp_park', category: 'Responsibilities', task: 'No trips to dog parks, pet stores, or public areas until fully vaccinated' },
  { id: 'resp_kids', category: 'Responsibilities', task: 'Commit to never leaving young children unsupervised with fosters' }
];

export function FosterGuide() {
  const [activeTab, setActiveTab] = useState<'content' | 'checklist' | 'toxic' | 'health'>('content');
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Interactive Checklist State
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rescuekit_foster_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save checklist state
  const toggleTask = (id: string) => {
    const next = { ...completedTasks, [id]: !completedTasks[id] };
    setCompletedTasks(next);
    localStorage.setItem('rescuekit_foster_checklist', JSON.stringify(next));
  };

  // Temperature Quiz State
  const [tempSpecies, setTempSpecies] = useState<'puppy_new' | 'dog_adult' | 'cat_adult'>('dog_adult');
  const [tempValue, setTempValue] = useState<string>('101.5');
  const [tempResult, setTempResult] = useState<{ status: 'normal' | 'emergency' | 'warning', text: string }>({ status: 'normal', text: 'Input values to analyze' });

  useEffect(() => {
    const val = parseFloat(tempValue);
    if (isNaN(val)) {
      setTempResult({ status: 'warning', text: 'Please enter a valid numeric temperature.' });
      return;
    }
    
    if (val > 104 || val < 99) {
      setTempResult({ status: 'emergency', text: '🚨 EMERGENCY! Temperature is extremely unsafe (above 104°F or below 99°F). Contact your rescue veterinarian immediately!' });
      return;
    }

    if (tempSpecies === 'puppy_new') {
      if (val >= 94 && val <= 97) {
        setTempResult({ status: 'normal', text: '✅ Normal. Newborn puppies maintain a lower core temperature (94–97°F).' });
      } else {
        setTempResult({ status: 'warning', text: '⚠️ Warning. Normal newborns range 94–97°F. Monitor closely and speak to your coordinator.' });
      }
    } else if (tempSpecies === 'dog_adult') {
      if (val >= 100 && val <= 102.5) {
        setTempResult({ status: 'normal', text: '✅ Normal. Puppies (4+ weeks) and adult dogs operate optimally between 100–102.5°F.' });
      } else {
        setTempResult({ status: 'warning', text: '⚠️ Warning. Normal range is 100–102.5°F. Keep a close watch on behavior.' });
      }
    } else if (tempSpecies === 'cat_adult') {
      if (val >= 100.5 && val <= 102.5) {
        setTempResult({ status: 'normal', text: '✅ Normal. Adult cats hover perfectly between 100.5–102.5°F.' });
      } else {
        setTempResult({ status: 'warning', text: '⚠️ Warning. Normal range is 100.5–102.5°F. Check for lethargy or hot ears.' });
      }
    }
  }, [tempSpecies, tempValue]);

  // Toxic Food Search filter
  const [foodSearch, setFoodSearch] = useState<string>('');
  const filteredFoods = TOXIC_FOODS.filter(f => 
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    f.effect.toLowerCase().includes(foodSearch.toLowerCase())
  );

  // Raw Chapters content
  const chapters = [
    {
      title: "Welcome & Overview",
      subtitle: "The Bridge Between Past and Future",
      content: (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 text-stone-700">
            <h3 className="font-bold text-slate-900 text-lg mb-2">A Message of Heartfelt Thanks</h3>
            <p className="text-sm leading-relaxed mb-3">
              First of all — <strong>THANK YOU!</strong> By opening your home to a foster animal, you are saving a life! You are also giving a vulnerable creature something no shelter can fully provide: a safe, loving environment where they can decompress, heal, and show their true personality to the world.
            </p>
            <p className="text-sm leading-relaxed">
              You may be asking yourself, <em>"What did I get myself into?"</em> You are not alone. Fostering can be challenging, surprising, and deeply rewarding all at once. This guide is designed to give you everything you need to feel confident and prepared — from the first car ride home to the happy day your foster finds their forever family.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-250 p-5 rounded-2xl flex gap-3">
            <Heart className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
              <strong>Remember:</strong> A "yes" today is a life saved tomorrow. Every animal you foster creates space for another animal in need to be pulled from a shelter. Your home is the bridge between their past and their future.
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-black text-slate-800 text-sm border-b pb-1.5 mb-3">What Fostering Truly Means</h4>
            <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
              <li className="flex gap-2.5 items-start">
                <span className="text-indigo-500 font-black mt-0.5">•</span>
                <span>Fostering means temporarily caring for an animal in your home until they are adopted. Your rescue handles the adoption process — your job is to provide love, safety, basic training, and honest observations.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-indigo-500 font-black mt-0.5">•</span>
                <span><strong>Core Partnership:</strong> You provide the home; the rescue provides guidance, veterinary care, and essential supplies.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-indigo-500 font-black mt-0.5">•</span>
                <span><strong>Legal:</strong> Foster animals remain the property and legal responsibility of the rescue organization.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-indigo-500 font-black mt-0.5">•</span>
                <span><strong>Foster Fail:</strong> You are not obligated to adopt your foster animal, but if you do fall in love and apply, it is lovingly called a "foster fail".</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "1. Foster Responsibilities",
      subtitle: "The commitment & what to expect",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-stone-500 font-semibold">
            Being a foster is a serious commitment. The animal in your care is depending entirely on you. Below is a clear summary of what your rescue organization will generally expect.
          </p>
          
          <div className="bg-slate-50 border rounded-2xl p-4">
            <h4 className="font-extrabold text-slate-900 text-xs mb-3 flex items-center gap-1.5 text-indigo-700">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-xs inline-block"></span>
              Core Responsibilities Checklist
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-semibold text-stone-700">
              <li className="p-2 border rounded-xl bg-white flex gap-1.5">
                <span className="text-rose-500">🚑</span>
                <span>Report any sign of illness to your coordinator immediately (day or night).</span>
              </li>
              <li className="p-2 border rounded-xl bg-white flex gap-1.5">
                <span className="text-indigo-500">📍</span>
                <span>Keep the foster animal in the approved location on file. No secret moves.</span>
              </li>
              <li className="p-2 border rounded-xl bg-white flex gap-1.5">
                <span className="text-rose-500">🚫</span>
                <span>Do not transfer the foster to anyone else — even temporarily — without approval.</span>
              </li>
              <li className="p-2 border rounded-xl bg-white flex gap-1.5">
                <span className="text-indigo-500">🛏️</span>
                <span>Do not allow the foster on your bed (keeps them versatile for adopters).</span>
              </li>
              <li className="p-2 border rounded-xl bg-white flex gap-1.5">
                <span className="text-rose-500">⚡</span>
                <span>No dog parks or public pet stores until vaccines are fully cleared.</span>
              </li>
              <li className="p-2 border rounded-xl bg-white flex gap-1.5">
                <span className="text-indigo-500">👶</span>
                <span>Never leave children unsupervised with any foster animal at any time.</span>
              </li>
            </ul>
          </div>

          <div className="border border-indigo-100 p-4 rounded-xl bg-indigo-50/40 space-y-2">
            <h5 className="font-bold text-xs text-indigo-950">If You Want to Adopt Your Foster</h5>
            <p className="text-xs leading-relaxed text-stone-600 font-medium">
              If you fall in love and want to adopt, notify your coordinator as soon as possible. You must still proceed through the official adoption channel. Since other applications may have already been lodged, the rescue cannot simply withdraw animals without proper procedure.
            </p>
          </div>

          <div className="border border-amber-200 p-4 rounded-xl bg-amber-50/40 space-y-2">
            <h5 className="font-bold text-xs text-amber-950">Medication Rules</h5>
            <p className="text-xs leading-relaxed text-stone-600 font-medium font-sans">
              Always administer medications strictly as ordered by the rescue vet. Most medications MUST be given with food to prevent nausea. If you feel uncertain, confirm with your coordinator immediately.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. Preparing Your Home",
      subtitle: "Setup, crating & supplies",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Choosing a Foster Area</h4>
            <p className="text-xs text-slate-500 font-semibold mb-2">
              Select a dedicated room (bathroom, kitchen, laundry room) that can be gated off easily.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-semibold text-stone-600">
              <li className="bg-sky-50 px-3 py-2 rounded-xl border border-sky-100">🚫 Too much foot traffic can overwhelm a newly rescued, shy animal.</li>
              <li className="bg-sky-50 px-3 py-2 rounded-xl border border-sky-100">🧼 Flooring must be easy to sanitize (vinyl/tile with tarp overrides is ideal).</li>
              <li className="bg-sky-50 px-3 py-2 rounded-xl border border-sky-100">📦 Sweeping for cleaning supplies, electrical wires, and hazards is essential.</li>
              <li className="bg-sky-50 px-3 py-2 rounded-xl border border-sky-100">🚧 Secure gates or exercise pens before arrival.</li>
            </ul>
          </div>

          <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-2xl">
            <h4 className="font-extrabold text-amber-950 text-xs mb-1.5 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              The Crate Setup Policy
            </h4>
            <p className="text-[11px] leading-relaxed text-stone-700 font-medium mb-2">
              The crate is their bedroom and safe "den" where they can unwind. It is never a tool of punishment.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-600 font-bold border-t border-amber-200/50 pt-2">
              <div>• Line with soft blankets</div>
              <div>• Place crate near you</div>
              <div>• Remove collar before crating</div>
              <div>• Attach to exercise playpen</div>
            </div>
            <p className="text-[10px] font-bold mt-2 text-amber-800">
              ⚠️ <strong>Warm Weather Warning:</strong> Do not use a crate if temperatures are excessively high — especially with short-muzzled dogs (Pugs, Bulldogs) or thick-furred dogs (Huskies). Ensure water is constant.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-1">Supplies & Bathroom Zones</h4>
            <p className="text-xs text-stone-600 font-medium leading-relaxed font-sans">
              Keep a pet-safe disinfecting cleaner on hand (enzyme-based like Nature’s Miracle). Use gloves, and avoid ammonia which smells like urine to pets. For puppies, position their paper pads far away from their sleeping and eating zone, since animals naturally avoid eliminating where they sleep.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "3. The First Few Days",
      subtitle: "The crucial 72-hour decompression span",
      content: (
        <div className="space-y-4">
          <p className="text-xs leading-relaxed text-stone-600 font-semibold">
            The first 72 hours are the most critical and challenging. Your foster pet has been through trauma and does not know that they are safe yet. Be incredibly patient.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 border rounded-xl">
              <h5 className="font-bold text-[11px] text-slate-900 mb-1.5">What is Normal to Expect</h5>
              <ul className="space-y-1.5 text-[10px] text-stone-600 font-medium">
                <li>• Loose stools or diarrhea from transition stress</li>
                <li>• Frequent urination from massive water drinking</li>
                <li>• Quick, guarded eating around toys/food</li>
                <li>• Crying, whimpering or anxiety in the crate</li>
                <li>• Trembling, hiding, and refusing to engage</li>
              </ul>
            </div>

            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
              <h5 className="font-bold text-[11px] text-indigo-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Key Tip: Decompress Slowly
              </h5>
              <p className="text-[10px] text-indigo-900 leading-relaxed font-semibold">
                Do not push interactions. Sit quietly on the floor. Let the animal investigate the surroundings at their own comfort level. Trust takes time to bloom!
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-800">Bringing Your Foster Home Safely</h4>
            <ul className="space-y-1.5 text-[11px] text-stone-600 font-medium leading-snug">
              <li>• Always transport inside a secure crate; do not open in an unfenced or unsecured area.</li>
              <li>• Keep a leash on them at all times outdoors — even inside a fenced yard — during the first few days.</li>
              <li>• Postpone walks; give them a quiet bath once they decompress, since shelter dogs harbor parasites.</li>
            </ul>
          </div>

          <div className="border p-3 rounded-xl bg-orange-50/30">
            <h4 className="font-bold text-xs text-orange-950 mb-1">Slow Introductions to Resident Animals</h4>
            <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
              Never hasten matching animals. Keep them separated by gates or doors first to exchange scents. Progress to brief, on-leash meetings in neutral territory. Always feed them separately and grant each pet their own secure retreat zone.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "5. Crate Training Procedures",
      subtitle: "Teaching your animal to love their safe space",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-stone-500 font-semibold leading-relaxed">
            Crate training is a wonderful gift. Crate-comfortable animals are easier to adopt, travel far more securely, and cope with new settings with minimal stress.
          </p>

          <div className="p-4 border rounded-2xl bg-sky-50/40">
            <h4 className="font-bold text-xs text-slate-800 mb-2">How to Introduce the Crate</h4>
            <ul className="space-y-2 text-[11px] text-stone-700 font-medium">
              <li>1. <strong>Invitation:</strong> Place a soft blanket and dynamic high-value treats inside. Clear the door pathway.</li>
              <li>2. <strong>Positive Associations:</strong> Drop small kibble inside throughout the day. Feed meals nearby, then inside.</li>
              <li>3. <strong>Practice Sessions:</strong> Practice crating for small increments while you are in the room. This prevents separation panic.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded-xl bg-rose-50/50">
              <h5 className="font-extrabold text-rose-950 text-xs mb-1">When NOT to use a crate</h5>
              <ul className="space-y-1 text-[10px] text-rose-900 font-semibold font-sans">
                <li>• Suffering from vomiting or diarrhea</li>
                <li>• Too young to have bladder capacity</li>
                <li>• Temperatues are dangerously hot</li>
                <li>• Before they represent a chance to relieve</li>
              </ul>
            </div>

            <div className="p-3 border rounded-xl bg-slate-50">
              <h5 className="font-bold text-slate-900 text-xs mb-1">Important Rules</h5>
              <ul className="space-y-1 text-[10px] text-stone-600 font-semibold leading-snug">
                <li>• Never use as a punishment tool</li>
                <li>• Always remove dog collar first</li>
                <li>• Keep kids away from their safe sanctuary</li>
                <li>• Keep near bedroom at night</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "6. Behavior & Training",
      subtitle: "Kind guidance & positive reinforcement",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <h4 className="font-bold text-xs text-emerald-950 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              Positive Reinforcement Model
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              Always reward desired traits. Ignore or silently redirect bad behavior. Never hit, yell at, or terrify your foster. This causes regression, extreme trust breaks, and amplifies fear responses. Keep training sessions brief (5 to 10 minutes) and highly rewarding!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-xs text-slate-800 mb-1.5">Manners to Target</h4>
              <ul className="space-y-2 text-[10px] text-stone-600 font-semibold">
                <li>• <strong>Housebreaking:</strong> Take them to the toilet immediately after sleep, naps, meals, and before bed.</li>
                <li>• <strong>No Biting:</strong> Redirect to chew toys instantly and calmly say "no".</li>
                <li>• <strong>No Jumping:</strong> Fold your hands, turn away, ignore until all four paws touch the deck, then praise.</li>
                <li>• <strong>Basic Commands:</strong> Master <em>Sit, Stay, Come, Leave it</em> for higher adoption rates.</li>
              </ul>
            </div>

            <div className="p-3 border rounded-xl bg-indigo-50/40">
              <h4 className="font-bold text-xs text-indigo-950 mb-1">Coping with Separation Anxiety</h4>
              <p className="text-[10px] text-indigo-900 leading-relaxed font-semibold">
                Leave and return without big greetings. Put a piece of worn clothing in their crate. Provide a frozen peanut butter Kong only during exits to associate departures with tasty rewards.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "7. Feeding & Nutrition",
      subtitle: "Proper diets & life-saving warnings",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-stone-500 font-semibold">
            Foster animals from shelters are often underweight and nutritionally depleted. Proper meal care is essential to avoid stomach upsets.
          </p>

          <div className="p-4 border rounded-2xl bg-sky-50/40 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-[11px] mb-1">Feeding Guidelines</h4>
              <ul className="space-y-1.5 text-[10px] text-stone-600 font-bold leading-relaxed">
                <li>• Feed only rescue-approved food brands</li>
                <li>• Transition gradually: 75/25, then 50/50, then 25/75</li>
                <li>• Stick to a consistent daily morning/evening schedule</li>
                <li>• No rawhides, cooked bones, or oily table scraps</li>
              </ul>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-150 text-[10px] text-emerald-950 font-bold">
              💡 <strong>Upset Stomach Relief:</strong> Adding a small amount of plain boiled public rice or plain canned pumpkin (not pie filling!) can help soothe standard transition diarrhea.
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
            <h4 className="font-extrabold text-rose-950 text-xs mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Critical: TOXIC Foods Warning
            </h4>
            <p className="text-[10px] text-rose-800 leading-normal font-semibold mb-3">
              Never feed any of the following to dogs or cats. Scroll or search in the <strong>Toxic Foods</strong> tab on top for explanations, but memorize chocolate, onions, grapes, raisins, and garlic!
            </p>
            <div className="grid grid-cols-3 gap-1 px-2 py-1 bg-white/70 rounded-lg text-[9px] text-stone-600 font-black">
              <div>• Chocolate</div>
              <div>• Grapes & Raisins</div>
              <div>• Onions & Garlic</div>
              <div>• Xylitol sweetener</div>
              <div>• Macadamia Nuts</div>
              <div>• Avocado</div>
              <div>• Cooked Bones</div>
              <div>• Raw Dough</div>
              <div>• Milk & Dairy</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "8. Health & Illness Monitoring",
      subtitle: "How to identify healthy status & key warning signs",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/60 border border-amber-250 rounded-2xl">
            <h4 className="font-black text-amber-950 text-xs mb-1 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
              Body Temperature Benchmarks
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-bold text-stone-700 mt-2">
              <div className="p-2 bg-white rounded-lg">👶 Newborn Pups: <strong className="text-amber-700 block text-xs">94–97°F</strong></div>
              <div className="p-2 bg-white rounded-lg">🐕 Dogs (4w+): <strong className="text-amber-700 block text-xs font-mono">100–102.5°F</strong></div>
              <div className="p-2 bg-white rounded-lg">🐈 Cats (Adult): <strong className="text-amber-700 block text-xs font-mono">100.5–102.5°F</strong></div>
            </div>
            <p className="text-[10px] font-black text-rose-700 mt-2">
              🚨 Emergency Condition: Anything above 104°F or below 99°F represents an immediate veterinary threat!
            </p>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border">
            <h4 className="font-extrabold text-slate-900 text-xs mb-2">Checklist: What Normal & Healthy Looks Like</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[10px] text-stone-600 font-bold">
              <div>👁️ <strong>Eyes:</strong> Clear, bright, no yellow discharge</div>
              <div>👃 <strong>Nose:</strong> Moist and cool parameters</div>
              <div>👂 <strong>Ears:</strong> Odor-free, pink, no dark debris</div>
              <div>🦷 <strong>Gums:</strong> Pink (capillary color returns &lt; 2s)</div>
              <div>🐕 <strong>Coat:</strong> Smooth and shiny, no dry bald spots</div>
              <div>💩 <strong>Stool:</strong> Firm, brown, and logs-like</div>
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-250 p-4 rounded-xl">
            <h4 className="font-extrabold text-rose-950 text-xs mb-1.5">Early Warning Signs — Rescue Calling Required</h4>
            <p className="text-[10px] text-rose-800 font-medium mb-3">
              Alert your rescue coordinator promptly if you notice:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-rose-950 font-semibold leading-none">
              <li>• Lethargy, sluggishness, unusual tiredness</li>
              <li>• Refusal to eat for &gt; 2 consecutive meals</li>
              <li>• Repeated vomiting or blood present</li>
              <li>• Yellow/green discharges in eyes or nose</li>
              <li>• Coughing, sneezing, heavy difficulties breathing</li>
              <li>• Blood in stool or urine</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "9. Parasites: Fleas, Ticks & Worms",
      subtitle: "Pest monitoring instructions",
      content: (
        <div className="space-y-4">
          <div className="p-4 border border-rose-200 bg-rose-50/40 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-rose-950 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              Critical: Over-the-counter Flea warning
            </h4>
            <p className="text-xs font-medium leading-relaxed text-stone-700">
              Never use OTC store-bought flea shampoos or drops. If the shelter has already administered chemical treatments, adding store products can cause toxic overdose and organ failure. Only use drugs prescribed by your rescue coordinator!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white border rounded-xl text-[10px] font-bold text-stone-600 space-y-1.5">
              <span className="text-lg">🐜</span>
              <h5 className="font-extrabold text-slate-800 text-[11px]">If Fleas are spotted:</h5>
              <p className="font-medium text-stone-500">Wash bedding in hot water. Vacuum surrounding carpet thoroughly and empty canister outside immediately.</p>
            </div>
            
            <div className="p-3 bg-white border rounded-xl text-[10px] font-bold text-stone-600 space-y-1.5">
              <span className="text-lg">🕷️</span>
              <h5 className="font-extrabold text-slate-800 text-[11px]">If a Tick is discovered:</h5>
              <p className="font-medium text-stone-500">Extract upward using tweezers. Avoid twisting. Kill in rubbing alcohol and clean the bite area.</p>
            </div>

            <div className="p-3 bg-white border rounded-xl text-[10px] font-bold text-stone-600 space-y-1.5">
              <span className="text-lg">🪱</span>
              <h5 className="font-extrabold text-slate-800 text-[11px]">Intestinal Parasites</h5>
              <p className="font-medium text-stone-500">Roundworms look like spaghetti in stool. Tapeworms look like rice grains. Rescue deworms on schedule.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "10. Post Spay/Neuter Care",
      subtitle: "Post-surgery recovery & monitoring",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-stone-500 font-semibold leading-relaxed">
            Spaying and neutering are major abdominal surgeries requiring general anesthesia. They require careful rest during the 7 to 10-day healing phase.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-bold text-stone-600">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-150">
              <h5 className="text-indigo-950 font-black mb-1">First 24 Hours</h5>
              <p className="font-medium text-stone-500">Keep confined to a quiet box crate. They are groggy, unsteady, and cold. Offer tiny portions of food.</p>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border">
              <h5 className="text-slate-900 font-black mb-1">Incision Care</h5>
              <p className="font-medium text-stone-500">Inspect incision daily. Redness on Day 1 is okay. Keep clean and dry. Absolutely NO baths for 7 days.</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <h5 className="text-amber-950 font-black mb-1">Cone & Collar (E-Collar)</h5>
              <p className="font-medium text-stone-500">Ensure they wear their cone for 5–7 days. Licking is the #1 cause of stitch failure and infection!</p>
            </div>
          </div>

          <div className="bg-rose-50 border p-4 rounded-xl text-[10px] font-bold text-rose-950 space-y-1">
            <h5 className="text-rose-700 font-black text-xs">When to contact rescue veterinary immediately:</h5>
            <p className="text-rose-800 leading-normal font-medium">
              If you see bleeding or open separation at the incision site, continuous vomiting, white gums, labored breathing, or extreme distress lasting past 24 hours.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "11. Hygiene & Grooming",
      subtitle: "Bathing, ears, nails, and teeth care",
      content: (
        <div className="space-y-4 text-xs font-semibold text-stone-700">
          <p className="text-stone-500">Keep your foster animal smelling clean and healthy to optimize their chances of finding their forever family.</p>
          
          <ul className="space-y-3 font-semibold text-xs">
            <li className="flex gap-2">
              <span className="text-indigo-500">🧼</span>
              <div>
                <strong>Bathing:</strong> Bathe shortly after arrival to eradicate shelter germs or odors. Use ONLY rescue-approved shampoo. Avoid ears and eyes. Never bathe within 1 week of surgery.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">👂</span>
              <div>
                <strong>Ears Check:</strong> Inspect weekly. Wipe clean. If you smell a sour yeast odor or see dark coffee-ground debris (signs of ear mites/infection), call your rescue.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">💅</span>
              <div>
                <strong>Nails:</strong> If clicking on wooden floors, tell your coordinator to organize a professional trim.
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "12. Safety & Hazards Check",
      subtitle: "Children, resident animals & household sweep",
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border text-stone-700">
            <h4 className="font-bold text-xs text-amber-950 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Guidelines Around Children
            </h4>
            <p className="text-xs text-stone-600 font-medium leading-relaxed font-sans">
              <strong>Never leave foster animals and young children unsupervised.</strong> Even the gentlest dog can react if startled or handled in ways that induce physical pain! Ensure children approach calmly, never disturb a sleeping or eating animal, and keep away from their crate.
            </p>
          </div>

          <div className="space-y-2 text-[11px] text-stone-600 font-bold leading-relaxed">
            <h4 className="font-bold text-xs text-slate-930">Safety Sweep Measures</h4>
            <p>Ensure your dedicated foster zone has cleared these parameters:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 border rounded-lg bg-slate-50">⚡ Hide and bundle loose electrical cords.</div>
              <div className="p-2 border rounded-lg bg-slate-50">🔒 Store household chemicals, pills out of jump heights.</div>
              <div>❌ Rid flooring of rubber bands, needles or loose toys.</div>
              <div>🚪 Fasten window screens securely.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "13. FAQ & Common Concerns",
      subtitle: "Troubleshooting regular foster situations",
      content: (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <h5 className="font-extrabold text-indigo-700 text-xs font-sans">Q: My foster animal is crying in their crate all night. What do I do?</h5>
            <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
              This is extremely common during his first 2-3 nights. Try moving the crate temporary near your bedside so they smell your proximity. Put a worn t-shirt inside for scent comfort. Avoid letting them out when they whine, as this trains them that crying works.
            </p>
          </div>

          <div className="space-y-1 border-t pt-2">
            <h5 className="font-extrabold text-indigo-700 text-xs font-sans">Q: They refuse to eat. Should I worry?</h5>
            <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
              Skipping meals for up to 36 hours from stress transitions is normal. Do not offer human table scraps as this worsens diarrhea. Contact your coordinator if they miss more than two consecutive scheduled meals.
            </p>
          </div>

          <div className="space-y-1 border-t pt-2">
            <h5 className="font-extrabold text-indigo-700 text-xs font-sans">Q: My resident dog is growling at the foster. Is this normal?</h5>
            <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
              Growling is typical canine communication meaning <em>"give me space"</em>. Do not punish them for growling, or they will bite without warning. Keep them separate and slow the introductory phases.
            </p>
          </div>

          <div className="bg-rose-50 border p-4 rounded-xl text-[10px] text-rose-950 font-bold">
            💡 <strong>The 3-3-3 Rule:</strong> 3 days to decompress from shelter environment, 3 weeks to grasp your basic household routine, and 3 months to truly feel confident in their new home!
          </div>
        </div>
      )
    }
  ];

  const handlePrintFullManual = () => {
    window.print();
  };

  return (
    <div id="foster-guide-dashboard" className="w-full bg-white border border-sky-100 rounded-2xl md:rounded-3xl p-6 shadow-sm no-print-layout font-sans">
      
      {/* GUIDE HEADER BANNER */}
      <div className="no-print bg-gradient-to-r from-sky-50/40 to-indigo-50/20 p-6 rounded-2xl md:rounded-3xl border border-sky-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 inline-block mb-1.5">
            🎓 RescueKit Education Hub
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">RescueKit's Foster Guide</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Tips & Tricks for foster families</p>
        </div>
        <div className="hidden md:block text-right bg-white/80 p-2.5 px-4 rounded-2xl border border-sky-100 shrink-0">
          <span className="text-[10px] font-black text-emerald-600 block">Prepare, learn, and decompress smoothly 🏡❤️</span>
          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Offline-Ready Support Database</span>
        </div>
      </div>
      
      {/* SUB NAVIGATION TAB HEADER */}
        <div className="flex flex-wrap gap-1.5 shrink-0 bg-sky-50/50 p-1 rounded-2xl border border-sky-100">
          <button 
            type="button" 
            onClick={() => setActiveTab('content')} 
            className={`cursor-pointer px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'content' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            📖 Full Guide
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('checklist')} 
            className={`cursor-pointer px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'checklist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            📋 Preparation Checklist
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('toxic')} 
            className={`cursor-pointer px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'toxic' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ☠️ Toxic Lookup
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('health')} 
            className={`cursor-pointer px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'health' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🌡️ Temp Analyzer
          </button>
        </div>

      {/* RENDER DYNAMIC COMPONENT VALUE */}
      
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapter Selector Column */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="space-y-2 border-r border-sky-50/80 pr-2 max-h-[460px] overflow-y-auto">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-1">CHAPTER DIRECTORY</span>
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
                    <h4 className="text-xs truncate">{ch.title}</h4>
                    <p className={`text-[10px] truncate ${currentChapter === idx ? 'text-indigo-200' : 'text-slate-400'}`}>{ch.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${currentChapter === idx ? 'translate-x-1 text-indigo-300' : 'text-slate-350'}`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrintFullManual}
              className="cursor-pointer w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-600 text-indigo-950 hover:text-white shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 shrink-0 text-indigo-600 group-hover:text-white" />
                <div>
                  <h4 className="text-xs font-black truncate">Download / Print Guide (PDF)</h4>
                  <p className="text-[9px] font-semibold opacity-75 mt-0.5 leading-none">Get the whole handbook formatted as a PDF</p>
                </div>
              </div>
              <span className="text-xs">💾</span>
            </button>
          </div>

          {/* Active Chapter Display Page */}
          <div className="lg:col-span-8 bg-sky-50/20 border border-sky-100 rounded-2xl p-6 min-h-[460px] relative">
            <span className="text-[10px] font-black text-indigo-600 tracking-wider">CHAPTER {currentChapter + 1} OF {chapters.length}</span>
            <h2 className="text-lg font-black font-display text-slate-900 border-b pb-2 mt-1">{chapters[currentChapter].title}</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1 mb-5">{chapters[currentChapter].subtitle}</p>
            
            <div className="animate-fade-in font-sans">
              {chapters[currentChapter].content}
            </div>
            
            <div className="flex justify-between items-center border-t border-sky-100 pt-4 mt-8">
              <button
                type="button"
                onClick={() => setCurrentChapter(prev => Math.max(0, prev - 1))}
                disabled={currentChapter === 0}
                className="cursor-pointer px-4 py-2 border rounded-full text-xs font-extrabold text-slate-600 hover:bg-sky-50 hover:text-slate-900 transition-colors disabled:opacity-40"
              >
                &lsaquo; Prev Chapter
              </button>
              <button
                type="button"
                onClick={() => setCurrentChapter(prev => Math.min(chapters.length - 1, prev + 1))}
                disabled={currentChapter === chapters.length - 1}
                className="cursor-pointer px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-extrabold hover:bg-slate-800 transition-colors disabled:opacity-40"
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
              <h3 className="font-extrabold text-emerald-950 text-sm">Interactive Foster Home Preparation Tracker</h3>
              <p className="text-xs text-emerald-800 font-medium leading-relaxed mt-1">
                Perform this safety sweep checklist before the car ride home. Checked items save locally.
              </p>
            </div>
            <div className="bg-white/90 border rounded-2xl px-5 py-3 text-center shrink-0">
              <span className="text-xl font-mono font-black text-indigo-700">
                {Object.values(completedTasks).filter(Boolean).length} / {CHECKLIST_ITEMS.length}
              </span>
              <span className="text-[9px] text-slate-400 block font-bold mt-0.5">COMPLETED TASKS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Home Setup', 'Household Safety', 'Responsibilities'] as const).map(cat => (
              <div key={cat} className="space-y-3.5">
                <h4 className="font-black text-slate-800 text-xs border-b pb-1.5 flex items-center justify-between">
                  <span>{cat} Checks</span>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
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
                      {completedTasks[item.id] ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-350 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs font-semibold leading-relaxed ${completedTasks[item.id] ? 'line-through' : ''}`}>
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

      {/* TOXIC SECTOR TAB */}
      {activeTab === 'toxic' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-extrabold text-rose-950 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Dogs & Cats Toxic Food Library
              </h3>
              <p className="text-xs text-rose-800 font-medium leading-relaxed mt-1">
                Dozens of standard household foods trigger fatal organ damage. Check ingredients carefully.
              </p>
            </div>
            {/* Quick Search inside list */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-rose-400" />
              <input 
                type="text" 
                placeholder="Type food (e.g., onions, raisins)..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full bg-white border border-rose-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder:text-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map((f, i) => (
              <div key={i} className="p-3.5 border border-purple-100 bg-white rounded-xl shadow-2xs flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs shrink-0 font-extrabold">☠️</div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs font-sans">{f.name}</h4>
                  <p className="text-[10px] text-stone-500 font-bold mt-1 leading-normal">{f.effect}</p>
                </div>
              </div>
            ))}
            {filteredFoods.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 font-semibold text-xs text-stone-400 space-y-1">
                <span>⚠️ No exact matches found in the toxic ledger.</span>
                <p className="text-[11px] text-stone-500">When in doubt, NEVER feed table scraps or human scraps to a foster animal.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEMPERATURE ANALYZER TAB */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-stone-700">
          <div className="space-y-3.5">
            <h3 className="font-extrabold text-slate-900 text-sm">Vital Temperature Reference Analyzer</h3>
            <p className="text-xs leading-relaxed text-stone-500 font-semibold">
              Because a foster animal cannot voice pain, their core internal temperature is the absolute best indicator of silent illnesses or life-threatening infections.
            </p>
            <div className="space-y-2 border-l-2 border-indigo-200 pl-4 py-1">
              <p className="text-[10px] font-bold text-stone-600">🎯 <strong>Normal Newborn puppy temperature:</strong> 94–97°F</p>
              <p className="text-[10px] font-bold text-stone-600">🎯 <strong>Normal Puppies (4+ wks) & Adult dogs:</strong> 100–102.5°F</p>
              <p className="text-[10px] font-bold text-stone-600">🎯 <strong>Normal Adult cat temperature:</strong> 100.5–102.5°F</p>
            </div>
            
            <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">How & When to Measure</h4>
               <p className="text-[10px] text-slate-600 leading-normal font-medium">
                Measure rectally using a pet thermometer and personal lube. If you measure under 99°F or above 104°F, this represents a severe medical crisis!
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border p-6 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-slate-900 text-xs text-center border-b pb-2 mb-2">Calculator Tool</h4>
            <div>
              <label className="text-[10.5px] font-black text-stone-500 block mb-1">1. SELECT PET CLASS</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTempSpecies('puppy_new')}
                  className={`cursor-pointer px-3 py-2 text-[10px] rounded-xl font-extrabold border transition-all ${tempSpecies === 'puppy_new' ? 'bg-slate-900 text-white border-slate-950 shadow-xs' : 'bg-white text-stone-700 border-sky-100 hover:bg-sky-50'}`}
                >
                  👶 Newborn Pups
                </button>
                <button
                  onClick={() => setTempSpecies('dog_adult')}
                  className={`cursor-pointer px-3 py-2 text-[10px] rounded-xl font-extrabold border transition-all ${tempSpecies === 'dog_adult' ? 'bg-slate-900 text-white border-slate-950 shadow-xs' : 'bg-white text-stone-700 border-sky-100 hover:bg-sky-50'}`}
                >
                  🐕 Dogs / Older Pups
                </button>
                <button
                  onClick={() => setTempSpecies('cat_adult')}
                  className={`cursor-pointer px-3 py-2 text-[10px] rounded-xl font-extrabold border transition-all ${tempSpecies === 'cat_adult' ? 'bg-slate-900 text-white border-slate-950 shadow-xs' : 'bg-white text-stone-700 border-sky-100 hover:bg-sky-50'}`}
                >
                  🐈 Adult Cats
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10.5px] font-black text-stone-500 block mb-1">2. INPUT MEASURED °F VALUE</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full bg-white border border-sky-100 rounded-xl py-2 px-3.5 text-xs font-mono font-bold text-center focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-stone-400">°F</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-center leading-normal ${
              tempResult.status === 'normal' 
                ? 'bg-emerald-50 border border-emerald-255 text-emerald-950' 
                : tempResult.status === 'emergency'
                ? 'bg-rose-50 border border-rose-300 text-rose-950 animate-pulse'
                : 'bg-amber-50 border border-amber-300 text-amber-950'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-widest block text-stone-500 mb-1">REPORT SUMMARY</span>
              <p className="text-[11px] font-bold">{tempResult.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY ALL CONTENTS (Visible only when window.print() is active) */}
      <div className="hidden print:block bg-white text-slate-800 p-6 font-sans leading-relaxed text-xs">
        <div className="text-center border-b-2 border-slate-300 pb-5 mb-8">
          <h1 className="text-3xl font-black text-indigo-700 tracking-tight">RESCUEKIT ANIMAL CARE & FOSTER GUIDE</h1>
          <p className="text-xs font-bold text-slate-500 mt-2 uppercase">A complete training and decompression workbook for rescue foster families</p>
          <div className="mt-4 text-[10px] text-slate-400 font-bold">
            Provided by your local Rescue Organization via RescueKit Tools • rescuekit.org/foster
          </div>
        </div>

        <div className="space-y-8">
          {chapters.map((ch, idx) => (
            <div key={idx} className="print:break-inside-avoid border-b border-stone-150 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">CHAPTER {idx + 1} OF {chapters.length}</span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1 mb-2">{ch.title}</h2>
              <p className="text-[11px] font-bold text-slate-400 mb-4">{ch.subtitle}</p>
              
              <div className="text-[11px] text-slate-705 space-y-3 print-chapter-body select-text text-left">
                {ch.content}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center border-t border-stone-200 pt-6 mt-10">
          <p className="text-[11px] font-bold text-stone-500">
            Thank you for being the bridge to a foster's forever home. You are saving lives!
          </p>
          <span className="text-[9px] text-stone-400 block mt-1">Compiled through RescueKit Community Hub</span>
        </div>
      </div>

      {/* LOWER FOOTER NOTE (Page 14) */}
      <div className="print:hidden border-t border-sky-50 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs text-center md:text-left">
        <div className="flex items-center gap-2.5">
          <Heart className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="font-semibold text-stone-500">
            <strong>Thank you for fostering.</strong> Every animal that passes through your home carries your kindness forward.
          </p>
        </div>
        <div>
          <span className="font-bold text-[10px] text-indigo-500 uppercase tracking-wider">RescueKit Community Tools</span>
        </div>
      </div>

    </div>
  );
}
