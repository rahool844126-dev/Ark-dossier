
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useSettings } from '../SettingsContext';
import { clearAllCustomImages } from '../services/imageStore';
import { clearAllTames } from '../services/tameStore';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; description: string; }> = ({ checked, onChange, label, description }) => {
    return (
        <div className="flex items-center justify-between bg-bg-secondary p-4 rounded-lg border border-border-color">
            <div>
                <p className="font-semibold text-text-primary">{label}</p>
                <p className="text-sm text-text-secondary">{description}</p>
            </div>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-secondary focus:ring-[var(--accent-main)] ${
                    checked ? 'bg-[var(--accent-main)]' : 'bg-bg-tertiary'
                }`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
};


const SettingsTab: React.FC = () => {
    const { settings, setAllowImageEditing, setServerRates } = useSettings();
    const { allowImageEditing, serverRates } = settings;

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setServerRates({ [name]: numValue });
        } else if (value === '') {
            setServerRates({ [name]: 1 }); // Default to 1 if empty
        }
    };
    
    const handleClearImages = async () => {
        const confirmationText = "CLEAR";
        const userInput = window.prompt(`This will remove all custom images you've uploaded for creatures. This action cannot be undone. Please type "${confirmationText}" to confirm.`);

        if (userInput === confirmationText) {
            try {
                await clearAllCustomImages();
                alert("Custom images have been cleared. Default images will be shown on your next visit to a creature page.");
            } catch (error) {
                alert("Failed to clear images. See console for details.");
                console.error(error);
            }
        } else if (userInput !== null) {
            alert("Incorrect confirmation text. Action cancelled.");
        }
    };
    
    const handleResetTames = async () => {
        const confirmationText = "RESET ALL";
        const userInput = window.prompt(`This will permanently delete ALL of your saved tames. This action cannot be undone. Please type "${confirmationText}" to confirm.`);
        
        if (userInput === confirmationText) {
             try {
                await clearAllTames();
                alert("All saved tames have been deleted. The 'My Tames' tab will be empty on your next visit.");
            } catch (error) {
                alert("Failed to delete tames. See console for details.");
                console.error(error);
            }
        } else if (userInput !== null) {
            alert("Incorrect confirmation text. Action cancelled.");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-orbitron font-bold text-text-primary uppercase">Settings</h2>

            {/* General Section */}
            <div className="space-y-3">
                <h3 className="font-orbitron text-sm font-bold text-text-secondary tracking-wider uppercase">General</h3>
                 <div className="flex items-center justify-between bg-bg-secondary p-4 rounded-lg border border-border-color">
                    <div>
                        <p className="font-semibold text-text-primary">Theme</p>
                        <p className="text-sm text-text-secondary">Switch between light and dark mode</p>
                    </div>
                    <ThemeToggle />
                </div>
                <ToggleSwitch
                    label="Creature Image Editing"
                    description="Allow changing creature dossier images"
                    checked={allowImageEditing}
                    onChange={setAllowImageEditing}
                />
            </div>
            
            {/* Breeding Rates Section */}
            <div className="space-y-3">
                 <h3 className="font-orbitron text-sm font-bold text-text-secondary tracking-wider uppercase">Breeding Rates</h3>
                 <p className="text-xs text-text-secondary -mt-2">Set your server's custom breeding multipliers.</p>
                 <div className="bg-bg-secondary p-4 rounded-lg border border-border-color space-y-3">
                     {Object.entries(serverRates).map(([rate, value]) => (
                        <div key={rate} className="flex items-center justify-between">
                            <label htmlFor={rate} className="text-sm font-semibold text-text-primary capitalize">{rate} Rate</label>
                            <input
                                id={rate}
                                name={rate}
                                type="number"
                                value={value}
                                onChange={handleRateChange}
                                placeholder="1"
                                min="0.1"
                                step="0.1"
                                className="w-24 bg-bg-tertiary border-2 border-border-color rounded-lg py-1 px-2 text-sm text-right"
                            />
                        </div>
                     ))}
                 </div>
            </div>
            
             {/* Data Management Section */}
            <div className="space-y-3">
                <h3 className="font-orbitron text-sm font-bold text-text-secondary tracking-wider uppercase">Data Management</h3>
                <button onClick={handleClearImages} className="w-full text-left bg-bg-secondary rounded-lg p-4 transition-all duration-300 hover:bg-bg-tertiary border border-border-color">
                    <p className="font-semibold text-text-primary">Clear Custom Images</p>
                    <p className="text-sm text-text-secondary">Remove all uploaded creature images.</p>
                </button>
                <button onClick={handleResetTames} className="w-full text-left bg-bg-secondary rounded-lg p-4 transition-all duration-300 hover:bg-bg-tertiary border border-border-color">
                    <p className="font-semibold text-[var(--accent-negative)]">Reset All Tames</p>
                    <p className="text-sm text-text-secondary">Permanently delete all saved creatures in 'My Tames'.</p>
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
