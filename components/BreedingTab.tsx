
import React, { useState, useMemo } from 'react';
import { CREATURES } from '../constants';
import { Creature } from '../types';
import BreedingCalculator from './BreedingCalculator';

const CreatureSelectItem: React.FC<{ creature: Creature; onClick: () => void }> = ({ creature, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-3 bg-bg-secondary rounded-lg border border-border-color transition-all duration-300 hover:bg-bg-tertiary"
  >
    <img src={creature.image} alt={creature.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
    <div className="text-left">
      <p className="font-bold text-text-primary">{creature.name}</p>
      <p className="text-xs text-text-secondary">{creature.diet}</p>
    </div>
  </button>
);


const BreedingTab: React.FC = () => {
    const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const breedableCreatures = useMemo(() => 
        CREATURES
            .filter(c => c.breeding)
            .sort((a, b) => a.name.localeCompare(b.name)), 
        []
    );
    
    const filteredCreatures = useMemo(() => 
        breedableCreatures.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [searchQuery, breedableCreatures]
    );

    if (selectedCreature) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedCreature(null)}
                        className="p-2 -ml-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                        aria-label="Back to creature selection"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-orbitron font-bold text-text-primary uppercase">
                        Breeding: {selectedCreature.name}
                    </h2>
                </div>
                <div className="content-enter">
                    <BreedingCalculator creature={selectedCreature} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-text-primary uppercase">Select Creature</h2>
            
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search for a breedable creature..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-bg-secondary border-2 border-border-color rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 transition-all focus:ring-[var(--accent-main)]"
                />
            </div>

            {filteredCreatures.length > 0 ? (
                 <div className="grid grid-cols-1 gap-3">
                    {filteredCreatures.map(creature => (
                        <CreatureSelectItem 
                            key={creature.id} 
                            creature={creature}
                            onClick={() => setSelectedCreature(creature)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-text-secondary py-16">
                    <p>No breedable creatures found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default BreedingTab;