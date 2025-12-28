
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Creature, Recipe } from '../types';
import { RECIPES } from '../constants';
import { getCustomCreatureImage, saveCustomCreatureImage, removeCustomCreatureImage } from '../services/imageStore';
import BreedingCalculator from './BreedingCalculator';

interface CreatureDetailPageProps {
  creature: Creature;
  onBack: () => void;
  allowImageEditing: boolean;
}

const StatPanel: React.FC<{ stat: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ stat, value, icon, color }) => (
    <div className={`flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-border-color ${color}`}>
        {icon}
        <div>
            <span className="text-text-secondary text-xs font-semibold">{stat}</span>
            <span className="text-text-primary font-bold text-lg">{value}</span>
        </div>
    </div>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < rating ? 'text-[var(--accent-main)]' : 'text-zinc-600'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

type StatInput = { level: string, health: string, stamina: string, oxygen: string, food: string, weight: string, melee: string, speed: string };
type AnalyzedPoints = { health: number, stamina: number, oxygen: number, food: number, weight: number, melee: number, speed: number };
type DetailTab = 'dossier' | 'stats' | 'taming' | 'gathering' | 'breeding';

const TamingCalculator: React.FC<{ creature: Creature }> = ({ creature }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [level, setLevel] = useState('1');
  const [levelNum, setLevelNum] = useState(1);

  React.useEffect(() => {
    const num = parseInt(level, 10);
    if (!isNaN(num) && num > 0) {
      setLevelNum(num);
    } else if (level === '') {
        setLevelNum(1); // Default to 1 if empty
    }
  }, [level]);

  const totalTorpor = (creature.stats.baseTorpor ?? 0) + (levelNum - 1) * (creature.stats.torporPerLevel ?? 0);

  const knockoutMethods = [
    { name: 'Slingshot (Stone)', torpor: 17 },
    { name: 'Bow (Tranq Arrow)', torpor: 90 },
    { name: 'Crossbow (Tranq Arrow)', torpor: 157.5 },
    { name: 'Longneck (Tranq Dart)', torpor: 221 },
  ];

  const drainRates: { [key: string]: string } = {
    'Very Fast': 'text-red-500',
    'Fast': 'text-red-400',
    'Normal': 'text-yellow-400',
    'Slow': 'text-green-400',
    'Very Slow': 'text-green-300',
  };

  return (
    <div className="bg-bg-secondary rounded-lg border border-border-color overflow-hidden">
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full flex justify-between items-center text-left p-4 hover:bg-bg-tertiary transition-colors"
        aria-expanded={isExpanded}
        aria-controls="knockout-calculator-content"
      >
        <h4 className="font-orbitron font-bold text-lg text-[var(--accent-main)]">Knockout Calculator</h4>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 text-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isExpanded && (
        <div 
          id="knockout-calculator-content"
          className="p-4 pt-2 border-t border-border-color space-y-4"
        >
          <div>
            <label htmlFor="creatureLevel" className="block text-sm font-medium text-text-secondary mb-1">Creature Level</label>
            <input
              id="creatureLevel"
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="e.g., 150"
              className="w-full bg-bg-tertiary border-2 border-border-color rounded-lg py-2 px-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 transition focus:ring-[var(--accent-main)]"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">Torpor Drain:</span>
            <span className={`font-bold ${drainRates[creature.torporDrain!] || 'text-text-primary'}`}>{creature.torporDrain || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">Total Torpor:</span>
            <span className={`font-bold font-mono text-text-primary`}>{totalTorpor.toFixed(1)}</span>
          </div>

          <div className="space-y-2 pt-3 border-t border-border-color">
            <h5 className="text-sm font-bold text-text-secondary mb-1">Shots to KO:</h5>
            {knockoutMethods.map(method => (
              <div key={method.name} className="flex justify-between items-center text-sm bg-bg-tertiary px-3 py-2 rounded-md">
                <span>{method.name}</span>
                <span className="font-mono font-bold text-text-primary">
                  {Math.ceil(totalTorpor / method.torpor)}
                </span>
              </div>
            ))}
            <p className="text-xs text-text-secondary text-center pt-2">
                For arrows/darts, wait 5 seconds between shots for maximum torpor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


const CreatureDetailPage: React.FC<CreatureDetailPageProps> = ({ creature, onBack, allowImageEditing }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [displayedImage, setDisplayedImage] = useState(creature.image);
  const [analyzerInput, setAnalyzerInput] = useState<StatInput>({ level: '', health: '', stamina: '', oxygen: '', food: '', weight: '', melee: '', speed: '' });
  const [analyzedPoints, setAnalyzedPoints] = useState<AnalyzedPoints | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('dossier');
  const [copiedCoords, setCopiedCoords] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recipeNames = useMemo(() => new Set(RECIPES.map(r => r.name)), []);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      const customImage = await getCustomCreatureImage(creature.id);
      if (isMounted && customImage) {
        setDisplayedImage(customImage);
      }
    };
    fetchImage();
    return () => { isMounted = false; };
  }, [creature.id]);
  
  const handleCopyCoords = (lat: number, lon: number) => {
    const coordsString = `${lat.toFixed(1)}, ${lon.toFixed(1)}`;
    navigator.clipboard.writeText(coordsString);
    setCopiedCoords(coordsString);
    setTimeout(() => {
        setCopiedCoords(null);
    }, 2000);
  };

  const handleAnalyzerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAnalyzerInput(prev => ({...prev, [name]: value}));
  };

  const handleCalculate = () => {
      const statsToCalc: (keyof AnalyzedPoints)[] = ['health', 'stamina', 'oxygen', 'food', 'weight', 'melee', 'speed'];
      const points: AnalyzedPoints = { health: 0, stamina: 0, oxygen: 0, food: 0, weight: 0, melee: 0, speed: 0 };
      
      statsToCalc.forEach(stat => {
          const V = parseFloat(analyzerInput[stat]);
          const B = creature.stats[stat as keyof Creature['stats']];
          const Iw = creature.stats.wildLevelUp[stat as keyof Creature['stats']['wildLevelUp']];
          
          if (typeof B === 'number' && typeof Iw === 'number' && !isNaN(V) && B > 0 && Iw > 0) {
              let calculated = 0;
              if (stat === 'melee' || stat === 'speed') {
                   // Melee and Speed are percentages
                   if (V < B) return; // Cannot be less than base
                   calculated = Math.round(((V / 100) - 1) / Iw);
              } else {
                   if (V < B) return; // Cannot be less than base
                   calculated = Math.round(((V / B) - 1) / Iw);
              }
              points[stat] = Math.max(0, calculated);
          }
      });
      setAnalyzedPoints(points);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      if (base64Image) {
        await saveCustomCreatureImage(creature.id, base64Image);
        setDisplayedImage(base64Image);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = async () => {
    const confirmationText = "REMOVE";
    const userInput = window.prompt(`To confirm removal, please type "${confirmationText}" below.`);

    if (userInput === confirmationText) {
      await removeCustomCreatureImage(creature.id);
      setDisplayedImage(creature.image);
    } else if (userInput !== null) { // User typed something, but it was incorrect
      alert("Incorrect confirmation text. Image was not removed.");
    }
    // If userInput is null, the user clicked "Cancel", so we do nothing.
  };
  
  const handleFoodClick = (foodName: string) => {
    const recipe = RECIPES.find(r => r.name === foodName);
    if (recipe) {
      setSelectedRecipe(current => (current?.id === recipe.id ? null : recipe));
    }
  };

  const temperamentTagStyles: { [key in Creature['temperament']]: string } = {
    'Aggressive': 'border-red-500/50 text-red-400 bg-red-500/10',
    'Neutral': 'border-amber-500/50 text-amber-400 bg-amber-500/10',
    'Skittish': 'border-blue-500/50 text-blue-400 bg-blue-500/10',
    'Passive': 'border-green-500/50 text-green-400 bg-green-500/10',
    'Untamable': 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10',
  };

  const tamingMethodDetails = {
    Knockout: 'This creature must be rendered unconscious before feeding.',
    Passive: 'Approach and feed this creature without aggression.',
    Special: 'This creature requires a unique taming method.',
    Untamable: 'This creature cannot be tamed by normal means.'
  };

  const totalAnalyzedPoints = analyzedPoints ? Object.values(analyzedPoints).reduce((sum: number, pts: number) => sum + pts, 0) : 0;
  const expectedPoints = analyzerInput.level ? parseInt(analyzerInput.level, 10) - 1 : 0;
  
  const tabItems: { id: DetailTab; label: string }[] = [
      { id: 'dossier', label: 'Dossier' },
      { id: 'stats', label: 'Stats' },
  ];
  if (creature.tameable) tabItems.push({ id: 'taming', label: 'Taming' });
  if (creature.breeding) tabItems.push({ id: 'breeding', label: 'Breeding' });
  if (creature.gathering && creature.gathering.length > 0) tabItems.push({ id: 'gathering', label: 'Gathering' });

  return (
    <div 
        className="fixed inset-0 max-w-md mx-auto flex flex-col bg-bg-primary page-enter relative overflow-hidden"
    >
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <div
          className="h-64 bg-cover bg-center relative group image-fade-in"
          style={{ backgroundImage: `url(${displayedImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/90 to-transparent"></div>
          <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-text-primary hover:bg-black/70 backdrop-blur-sm transition-colors" aria-label="Go back">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          {allowImageEditing && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full bg-black/40 text-text-primary hover:bg-black/70 backdrop-blur-sm" aria-label="Change image">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                </button>
                {(displayedImage !== creature.image) && (
                  <button onClick={handleResetImage} className="p-2 rounded-full bg-black/40 text-text-primary hover:bg-black/70 backdrop-blur-sm" aria-label="Reset image">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                )}
            </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        <div className="relative bg-bg-primary -mt-12 rounded-t-3xl p-4">
            <div className="mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-orbitron font-black text-white tracking-wider uppercase">{creature.name}</h2>
                    {creature.mobileExclusive && (
                        <span className="text-sm font-bold px-2 py-0.5 rounded-md bg-[var(--accent-mobile)] text-bg-primary">MOBILE</span>
                    )}
                </div>
            </div>

            <div className="border-b border-border-color flex space-x-4 mb-4 overflow-x-auto no-scrollbar">
                {tabItems.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-[var(--accent-main)] border-b-2 border-[var(--accent-main)]' : 'text-text-secondary hover:text-text-primary'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {activeTab === 'dossier' && (
                    <div className="space-y-4 content-enter">
                         <div className="flex flex-wrap gap-2">
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-bg-tertiary text-text-primary border border-border-color">{creature.diet}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${temperamentTagStyles[creature.temperament]}`}>{creature.temperament}</span>
                            {creature.eggSize && (<span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md border border-cyan-500/50 text-cyan-400 bg-cyan-500/10">{creature.eggSize} Egg</span>)}
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{creature.description}</p>
                        {creature.tameLocations && creature.tameLocations.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="text-[var(--accent-main)] flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg></div>
                                    <h4 className="font-orbitron font-bold text-[var(--accent-main)] text-sm tracking-wider uppercase">Spawn Areas</h4>
                                </div>
                                <div className="space-y-2">
                                    {creature.tameLocations.map((loc, index) => {
                                        const coordsKey = `${loc.lat.toFixed(1)}, ${loc.lon.toFixed(1)}`;
                                        return (
                                            <button 
                                                key={index} 
                                                onClick={() => handleCopyCoords(loc.lat, loc.lon)}
                                                className="w-full text-left bg-bg-secondary p-3 rounded-md transition-colors hover:bg-bg-tertiary border border-border-color"
                                                aria-label={`Copy coordinates for ${loc.location}`}
                                            >
                                                <p className="text-text-primary font-semibold">{loc.location}</p>
                                                <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
                                                    <span>LAT: {loc.lat.toFixed(1)}, LON: {loc.lon.toFixed(1)}</span>
                                                    {copiedCoords === coordsKey ? (
                                                        <span className="text-[var(--accent-positive)] font-bold text-xs">Copied!</span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                                            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="space-y-6 content-enter">
                        <div className="grid grid-cols-2 gap-3">
                            <StatPanel stat="Health" value={creature.stats.health} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>} color="text-red-400" />
                            <StatPanel stat="Stamina" value={creature.stats.stamina} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>} color="text-yellow-400" />
                            <StatPanel stat="Oxygen" value={creature.stats.oxygen} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" /></svg>} color="text-cyan-400" />
                            <StatPanel stat="Food" value={creature.stats.food} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.9 2.1a1 1 0 00-1.4 0L3.8 9.8a4.5 4.5 0 000 6.4 4.5 4.5 0 006.4 0l7.7-7.7a1 1 0 000-1.4L12.9 2.1zM8.5 14.9a2.5 2.5 0 01-3.5 0 2.5 2.5 0 010-3.5l1.8-1.8 3.5 3.5-1.8 1.8z" /></svg>} color="text-amber-400" />
                            <StatPanel stat="Weight" value={creature.stats.weight} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4,15.5 C4,16.3284271 4.67157288,17 5.5,17 L14.5,17 C15.3284271,17 16,16.3284271 16,15.5 L16,14 L4,14 L4,15.5 Z" /><path d="M5,9 L15,9 L15,13 L5,13 L5,9 Z" /><path d="M2,6 L18,6 C18,6 18,8 15,8 L5,8 C2,8 2,6 2,6 Z" /></svg>} color="text-sky-400" />
                            <StatPanel stat="Melee" value={creature.stats.melee} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18.3,1.7a1,1,0,0,0-1.4,0L13,5.6V3a1 1 0 0,0-2,0V6.4L3.8,13.6A1,1,0,0,0,3,15v2a1,1,0,0,0,1,1H6a1,1,0,0,0,.7-.3L13.6,10.4H17a1 1 0 0,0,0-2H14.4l2.9-2.9a1,1,0,0,0,0-1.4Z"/></svg>} color="text-orange-400" />
                            <StatPanel stat="Speed" value={`${creature.stats.speed}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.172V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.828L4.555 5.168z" /></svg>} color="text-lime-400" />
                        </div>
                        {creature.tameable && creature.stats.wildLevelUp.health > 0 && (
                            <div className="mt-6 space-y-3">
                                <h4 className="font-orbitron font-bold text-lg text-[var(--accent-main)]">Wild Stat Analyzer</h4>
                                <p className="text-xs text-text-secondary -mt-2">Enter a wild creature's stats to see its level point distribution.</p>
                                <input type="number" name="level" value={analyzerInput.level} onChange={handleAnalyzerInputChange} placeholder="Wild Creature Level" className="w-full bg-bg-tertiary border-2 border-border-color rounded-lg py-2 px-3 text-sm" />
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(analyzerInput).filter(k => k !== 'level').map(statKey => (
                                        <input key={statKey} type="number" name={statKey} value={analyzerInput[statKey as keyof StatInput]} onChange={handleAnalyzerInputChange} placeholder={`${statKey.charAt(0).toUpperCase() + statKey.slice(1)}${statKey === 'melee' || statKey === 'speed' ? ' %' : ''}`} className="w-full bg-bg-tertiary border-2 border-border-color rounded-lg py-2 px-3 text-sm" />
                                    ))}
                                </div>
                                <button onClick={handleCalculate} className="w-full bg-[var(--accent-main)] hover:opacity-80 text-bg-primary font-bold py-2 px-4 rounded-lg transition-colors">Analyze Points</button>
                                {analyzedPoints && (
                                    <div className="pt-3 border-t border-border-color space-y-1">
                                        <div className="grid grid-cols-2 gap-x-4 text-sm">
                                            {Object.entries(analyzedPoints).map(([stat, points]) => ( <div key={stat} className="flex justify-between"><span className="text-text-secondary capitalize">{stat}</span><span className="font-mono font-bold text-text-primary">{points}</span></div> ))}
                                        </div>
                                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-border-color mt-2 !space-y-0">
                                            <span className="text-text-primary">Total Points:</span>
                                            <span className={`font-mono ${totalAnalyzedPoints === expectedPoints ? 'text-[var(--accent-positive)]' : 'text-[var(--accent-negative)]'}`}>{totalAnalyzedPoints} / {expectedPoints > 0 ? expectedPoints : '?'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'taming' && creature.tameable && (
                    <div className="space-y-6 content-enter">
                        <div>
                            <h4 className="font-bold text-[var(--accent-main)]">{creature.tamingMethod} Tame</h4>
                            <p className="text-sm text-text-secondary mt-1">{tamingMethodDetails[creature.tamingMethod]}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-text-secondary mb-2">Preferred Foods</h4>
                            <div className="flex flex-wrap gap-2">
                                {creature.preferredFood.length > 0 ? creature.preferredFood.map((foodName, i) => {
                                    const isRecipe = recipeNames.has(foodName);
                                    const isSelected = selectedRecipe?.name === foodName;
                                    const buttonClasses = `px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${ isRecipe ? (isSelected ? 'bg-bg-tertiary border-border-color text-text-primary' : 'bg-bg-secondary text-text-primary border-border-color hover:bg-bg-tertiary cursor-pointer') : 'bg-bg-secondary text-text-secondary border-border-color cursor-default'}`;
                                    return <button key={i} onClick={isRecipe ? () => handleFoodClick(foodName) : undefined} className={buttonClasses}>{foodName}</button>
                                }) : <p className="text-sm text-text-secondary">No specific preferred foods listed for this creature.</p>}
                            </div>
                        </div>
                        {selectedRecipe && (
                            <div className="mt-4 content-enter">
                               <h5 className="font-bold text-text-primary mb-2">{selectedRecipe.name} Ingredients</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selectedRecipe.ingredients.map((ing, idx) => ( <div key={idx} className="flex justify-between text-xs bg-bg-secondary px-3 py-2 rounded-md"><span className="text-text-secondary font-medium">{ing.item}</span><span className="text-text-primary font-bold">x{ing.amount}</span></div> ))}
                                </div>
                            </div>
                        )}
                        {creature.tamingMethod === 'Knockout' && (
                            <TamingCalculator creature={creature} />
                        )}
                    </div>
                )}

                {activeTab === 'breeding' && creature.breeding && (
                    <div className="content-enter">
                        <BreedingCalculator creature={creature} />
                    </div>
                )}

                {activeTab === 'gathering' && creature.gathering && creature.gathering.length > 0 && (
                    <div className="content-enter">
                        {creature.gathering.map((item, index) => (
                            <div key={index} className="py-3 border-b border-border-color flex justify-between items-center last:border-b-0">
                                <div>
                                    <p className="font-semibold text-text-primary">{item.resource}</p>
                                    {item.notes && <p className="text-xs text-text-secondary">{item.notes}</p>}
                                </div>
                                <StarRating rating={item.rating} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default CreatureDetailPage;
