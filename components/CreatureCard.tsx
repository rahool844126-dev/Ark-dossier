
import React, { useState, useEffect } from 'react';
import { Creature } from '../types';
import { getCustomCreatureImage } from '../services/imageStore';

interface CreatureCardProps {
  creature: Creature;
  onClick: () => void;
}

const CreatureCard: React.FC<CreatureCardProps> = ({ creature, onClick }) => {
  const [imageUrl, setImageUrl] = useState(creature.image);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      const customImage = await getCustomCreatureImage(creature.id);
      if (isMounted && customImage) {
        setImageUrl(customImage);
      }
    };
    fetchImage();
    return () => { isMounted = false; };
  }, [creature.id]);

  const temperamentStyles: { [key in Creature['temperament']]: { border: string; text: string; bg: string } } = {
    'Aggressive': { border: 'border-red-500/80', text: 'text-red-400', bg: 'bg-red-900/20' },
    'Neutral': { border: 'border-amber-500/80', text: 'text-amber-400', bg: 'bg-amber-900/20' },
    'Skittish': { border: 'border-blue-400/80', text: 'text-blue-300', bg: 'bg-blue-900/20' },
    'Passive': { border: 'border-green-500/80', text: 'text-green-400', bg: 'bg-green-900/20' },
    'Untamable': { border: 'border-zinc-500/80', text: 'text-zinc-400', bg: 'bg-zinc-900/20' },
  };

  const style = temperamentStyles[creature.temperament];

  return (
    <div
      onClick={onClick}
      className="group relative h-40 bg-cover bg-center flex flex-col justify-end text-white overflow-hidden cursor-pointer duration-300 ease-out image-fade-in rounded-lg"
      style={{ 
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all`}></div>
      <div className={`absolute inset-0 border-2 ${style.border} opacity-50 group-hover:opacity-100 transition-opacity rounded-lg`}></div>
      
      {creature.mobileExclusive && (
        <div className="absolute top-0 left-0 px-2.5 py-1 text-sm font-bold bg-[var(--accent-mobile)] text-bg-primary rounded-br-lg">M</div>
      )}
      
      <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${style.text} ${style.bg} rounded-bl-lg`}>{creature.temperament}</div>

      <div className="relative z-10 p-4">
        <h3 className="font-orbitron font-bold text-xl tracking-wide uppercase transition-colors">
          {creature.name}
        </h3>
        <p className="text-xs text-text-secondary font-semibold">{creature.diet}</p>
      </div>
    </div>
  );
};

export default CreatureCard;
