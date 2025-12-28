
import React from 'react';
import { useEdition } from '../EditionContext';
import { ArkEdition } from '../types';

const VersionToggle: React.FC = () => {
  const { edition, toggleEdition } = useEdition();
  const isUltimate = edition === ArkEdition.ULTIMATE;

  return (
    <div 
      onClick={toggleEdition}
      className="relative flex items-center w-32 h-8 rounded-full p-1 cursor-pointer select-none bg-bg-secondary border border-border-color"
      role="switch"
      aria-checked={isUltimate}
      aria-label={`Switch to ${isUltimate ? 'Mobile' : 'Ultimate'} Edition`}
    >
      <div
        className={`absolute top-1 left-1 h-6 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-in-out bg-[var(--accent-main)] glow ${
          isUltimate 
            ? 'translate-x-full' 
            : 'translate-x-0'
        }`}
      ></div>
      <div className="relative w-1/2 text-center z-10">
        <span className={`transition-colors duration-300 text-xs font-bold ${!isUltimate ? 'text-bg-primary' : 'text-text-primary'}`}>
          MOBILE
        </span>
      </div>
      <div className="relative w-1/2 text-center z-10">
        <span className={`transition-colors duration-300 text-xs font-bold ${isUltimate ? 'text-bg-primary' : 'text-text-primary'}`}>
          ULTIMATE
        </span>
      </div>
    </div>
  );
};

export default VersionToggle;
