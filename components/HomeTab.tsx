
import React, { useMemo, useState, useEffect } from 'react';
import { CREATURES } from '../constants';
import { Creature } from '../types';
import { getCustomCreatureImage } from '../services/imageStore';

interface HomeTabProps {
  onNavigate: (tab: 'creatures' | 'recipes' | 'breeding' | 'myTames') => void;
  onSelectCreature: (creature: Creature) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onNavigate, onSelectCreature }) => {
    
    const creatureOfTheDay: Creature = useMemo(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return CREATURES[dayOfYear % CREATURES.length];
    }, []);

    const [imageUrl, setImageUrl] = useState(creatureOfTheDay.image);

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            const customImage = await getCustomCreatureImage(creatureOfTheDay.id);
            if (isMounted) {
                setImageUrl(customImage || creatureOfTheDay.image);
            }
        };
        fetchImage();
        return () => { isMounted = false; };
    }, [creatureOfTheDay.id, creatureOfTheDay.image]);
    
    const navItems = [
        {
            title: 'Creature Dossiers',
            description: `Browse all creatures`,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
            tab: 'creatures' as const
        },
        {
            title: 'Crafting Recipes',
            description: `Kibble, consumables & more`,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>,
            tab: 'recipes' as const
        },
        {
            title: 'Breeding Calculator',
            description: 'Plan your perfect bloodline',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>,
            tab: 'breeding' as const
        },
        {
            title: 'My Tames',
            description: 'Manage your creature collection',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.559 1.832a4.002 4.002 0 00-2.882 0C2.969 8.523 2 9.873 2 11.5V13a1 1 0 001 1h8a1 1 0 001-1v-1.5c0-1.627-.969-2.977-2.559-3.668zM18 6a3 3 0 11-6 0 3 3 0 016 0zM12.441 7.832a4.002 4.002 0 012.882 0C17.03 8.523 18 9.873 18 11.5V13a1 1 0 001 1h.5a1 1 0 001-1v-1.5c0-1.627-.969-2.977-2.559-3.668z" /></svg>,
            tab: 'myTames' as const
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-orbitron font-bold text-[var(--accent-main)] mb-2 uppercase tracking-wide">Creature of the Day</h2>
                <div 
                    className="group relative h-40 bg-cover bg-center flex flex-col justify-end text-white overflow-hidden cursor-pointer duration-300 ease-out rounded-lg image-fade-in"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                    onClick={() => onSelectCreature(creatureOfTheDay)}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all"></div>
                    <div className="relative z-10 p-4">
                        <h3 className="font-orbitron font-bold text-xl tracking-wide uppercase transition-colors">
                            {creatureOfTheDay.name}
                        </h3>
                        <p className="text-xs text-text-secondary font-semibold">{creatureOfTheDay.diet}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {navItems.map(item => (
                    <button
                        key={item.tab}
                        onClick={() => onNavigate(item.tab)}
                        className="w-full text-left bg-bg-secondary rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:bg-bg-tertiary border border-border-color"
                    >
                        <div className="text-[var(--accent-main)]">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-text-primary">{item.title}</h3>
                            <p className="text-sm text-text-secondary">{item.description}</p>
                        </div>
                        <div className="ml-auto text-text-secondary">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomeTab;
