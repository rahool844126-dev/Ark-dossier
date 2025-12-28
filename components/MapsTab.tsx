
import React, { useState } from 'react';
import { THE_ISLAND_RESOURCES, THE_ISLAND_SPAWNS } from '../mapData';
import { CREATURES } from '../constants';

type MapOverlay = 'resources' | 'spawns';
type ResourceType = keyof typeof THE_ISLAND_RESOURCES;

const MAP_IMAGE_URL = 'https://placehold.co/800x800/2a2f38/e0e1e6.png?text=The+Island';

const resourceColors: Record<ResourceType, string> = {
    "Metal": "bg-orange-500",
    "Crystal": "bg-cyan-300",
    "Obsidian": "bg-purple-500",
    "Silica Pearls": "bg-white",
};

const spawnColors: { [key: string]: string } = {
    "default": "border-red-500/50 bg-red-500/20",
    "giganotosaurus": "border-yellow-400/50 bg-yellow-400/20",
};

const MapsTab: React.FC = () => {
    const [overlay, setOverlay] = useState<MapOverlay>('resources');
    const [selectedResource, setSelectedResource] = useState<ResourceType>('Metal');

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-orbitron font-bold text-text-primary uppercase mb-2">The Island</h2>
                <div className="flex bg-bg-secondary p-1 rounded-lg border border-border-color">
                    <button onClick={() => setOverlay('resources')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${overlay === 'resources' ? 'bg-[var(--accent-ultimate)] text-bg-primary' : 'text-text-secondary'}`}>Resources</button>
                    <button onClick={() => setOverlay('spawns')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${overlay === 'spawns' ? 'bg-[var(--accent-ultimate)] text-bg-primary' : 'text-text-secondary'}`}>Spawns</button>
                </div>
            </div>

            {overlay === 'resources' && (
                <div className="flex flex-wrap gap-2">
                    {Object.keys(THE_ISLAND_RESOURCES).map(resource => (
                        <button 
                            key={resource}
                            onClick={() => setSelectedResource(resource as ResourceType)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${selectedResource === resource ? 'border-[var(--accent-ultimate)] bg-bg-tertiary text-text-primary' : 'border-border-color bg-bg-secondary text-text-secondary'}`}
                        >
                            {resource}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative w-full aspect-square bg-bg-secondary rounded-lg border border-border-color overflow-hidden">
                <img src={MAP_IMAGE_URL} alt="Map of The Island" className="w-full h-full object-cover"/>

                {overlay === 'resources' && THE_ISLAND_RESOURCES[selectedResource].map((res, i) => (
                    <div key={i} className="absolute group" style={{ left: `${res.x}%`, top: `${res.y}%` }}>
                        <div className={`w-3 h-3 rounded-full ${resourceColors[selectedResource]} ring-2 ring-bg-primary transform -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-bg-tertiary text-text-primary text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {res.notes}
                        </div>
                    </div>
                ))}
                
                {overlay === 'spawns' && Object.entries(THE_ISLAND_SPAWNS).map(([creatureId, spawns]) => 
                    spawns.map((spawn, i) => {
                        const creature = CREATURES.find(c => c.id === creatureId);
                        return (
                            <div 
                                key={`${creatureId}-${i}`}
                                className={`absolute group border-2 ${spawnColors[creatureId] || spawnColors.default}`} 
                                style={{ 
                                    left: `${spawn.x}%`, 
                                    top: `${spawn.y}%`, 
                                    width: `${spawn.width}%`, 
                                    height: `${spawn.height}%` 
                                }}
                            >
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-bg-tertiary text-text-primary text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <span className="font-bold">{creature?.name}</span>: {spawn.notes}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

export default MapsTab;
