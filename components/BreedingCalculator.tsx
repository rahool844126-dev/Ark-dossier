
import React, { useState } from 'react';
import { Creature } from '../types';
import { useSettings } from '../SettingsContext';

interface BreedingCalculatorProps {
  creature: Creature;
}

type ParentStats = {
  health: string;
  stamina: string;
  oxygen: string;
  food: string;
  weight: string;
  melee: string;
};

const initialStats: ParentStats = { health: '', stamina: '', oxygen: '', food: '', weight: '', melee: '' };

const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0s';
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    
    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
}

const BreedingCalculator: React.FC<BreedingCalculatorProps> = ({ creature }) => {
  const [maleStats, setMaleStats] = useState<ParentStats>(initialStats);
  const [femaleStats, setFemaleStats] = useState<ParentStats>(initialStats);
  const { settings } = useSettings();
  const { maturation, incubation } = settings.serverRates;

  const handleMaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaleStats({ ...maleStats, [e.target.name]: e.target.value });
  };

  const handleFemaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFemaleStats({ ...femaleStats, [e.target.name]: e.target.value });
  };
  
  const statFields: (keyof ParentStats)[] = ['health', 'stamina', 'oxygen', 'food', 'weight', 'melee'];

  const babyStats = statFields.reduce((acc, stat) => {
    const maleVal = parseFloat(maleStats[stat]);
    const femaleVal = parseFloat(femaleStats[stat]);
    
    if (!isNaN(maleVal) && !isNaN(femaleVal)) {
        acc[stat] = {
            best: Math.max(maleVal, femaleVal),
            worst: Math.min(maleVal, femaleVal),
        };
    } else {
        acc[stat] = { best: '?', worst: '?' };
    }
    return acc;
  }, {} as Record<keyof ParentStats, { best: number | string, worst: number | string }>);


  return (
    <div className="bg-bg-secondary p-4 rounded-lg border border-border-color space-y-4">
      <h4 className="font-orbitron font-bold text-lg text-[var(--accent-main)]">Breeding Calculator</h4>
      <p className="text-xs text-text-secondary -mt-3">Enter the base (post-tame, pre-leveling) stats of the parents.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Male Inputs */}
        <div className="space-y-2">
            <h5 className="font-bold text-text-primary">Male Stats</h5>
            {statFields.map(stat => (
                <input
                    key={`male-${stat}`}
                    type="number"
                    name={stat}
                    value={maleStats[stat]}
                    onChange={handleMaleChange}
                    placeholder={stat.charAt(0).toUpperCase() + stat.slice(1)}
                    className="w-full bg-bg-tertiary border-2 border-border-color rounded-lg py-2 px-3 text-sm"
                />
            ))}
        </div>

        {/* Female Inputs */}
        <div className="space-y-2">
            <h5 className="font-bold text-text-primary">Female Stats</h5>
            {statFields.map(stat => (
                <input
                    key={`female-${stat}`}
                    type="number"
                    name={stat}
                    value={femaleStats[stat]}
                    onChange={handleFemaleChange}
                    placeholder={stat.charAt(0).toUpperCase() + stat.slice(1)}
                    className="w-full bg-bg-tertiary border-2 border-border-color rounded-lg py-2 px-3 text-sm"
                />
            ))}
        </div>
      </div>
      
      {/* Results */}
      <div className="pt-4 border-t border-border-color space-y-2">
        <h4 className="font-orbitron font-bold text-lg text-[var(--accent-main)]">Potential Offspring Stats</h4>
        <p className="text-xs text-text-secondary -mt-3">There is a 55% chance for the baby to inherit the higher stat.</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2">
          {statFields.map(stat => (
            <div key={`result-${stat}`} className="flex justify-between items-center">
                <span className="text-text-secondary capitalize">{stat}</span>
                <div className="font-mono text-right">
                    <span className="text-[var(--accent-positive)] font-bold">{babyStats[stat].best}</span>
                    <span className="text-text-secondary mx-1">/</span>
                    <span className="text-[var(--accent-negative)]">{babyStats[stat].worst}</span>
                </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Breeding Timers */}
      {creature.breeding && (
        <div className="pt-4 border-t border-border-color space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-orbitron font-bold text-lg text-[var(--accent-main)]">Breeding Timers</h4>
                <div className="text-xs font-mono text-text-secondary">
                    <span>Inc: <span className="text-text-primary">x{incubation}</span></span>
                    <span className="mx-1">/</span>
                    <span>Mat: <span className="text-text-primary">x{maturation}</span></span>
                </div>
            </div>
            <div className="space-y-1 text-sm">
                {creature.breeding.incubationTime && (
                    <div className="flex justify-between"><span className="text-text-secondary">Incubation:</span><span className="font-mono text-text-primary">{formatTime(creature.breeding.incubationTime / incubation)}</span></div>
                )}
                {creature.breeding.gestationTime && (
                    <div className="flex justify-between"><span className="text-text-secondary">Gestation:</span><span className="font-mono text-text-primary">{formatTime(creature.breeding.gestationTime / incubation)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-text-secondary">Total Maturation:</span><span className="font-mono text-text-primary">{formatTime(creature.breeding.maturationTime / maturation)}</span></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BreedingCalculator;
