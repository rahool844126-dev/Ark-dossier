
import React, { useState, useEffect } from 'react';
import { TamedCreature } from '../types';
import { getTames, addTame, updateTame, removeTame } from '../services/tameStore';
import { CREATURES } from '../constants';
import CreatureCard from './CreatureCard';

const MyTamesTab: React.FC = () => {
    const [tames, setTames] = useState<TamedCreature[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTame, setEditingTame] = useState<TamedCreature | null>(null);

    useEffect(() => {
        setTames(getTames());
    }, []);

    const handleOpenModal = (tame: TamedCreature | null = null) => {
        setEditingTame(tame);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTame(null);
    };

    const handleSave = (tameToSave: TamedCreature) => {
        if (editingTame) {
            setTames(updateTame(tameToSave));
        } else {
            const newTame = addTame(tameToSave);
            setTames(prev => [...prev, newTame]);
        }
        handleCloseModal();
    };

    const handleDelete = (tameId: string) => {
        if(window.confirm("Are you sure you want to delete this tame?")) {
            setTames(removeTame(tameId));
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-orbitron font-bold text-text-primary uppercase">My Tames</h2>
                <button onClick={() => handleOpenModal()} className="bg-[var(--accent-ultimate)] text-bg-primary font-bold py-2 px-4 rounded-lg text-sm hover:opacity-80 transition-opacity">
                    Add Tame
                </button>
            </div>
            
            {tames.length === 0 ? (
                <div className="text-center text-text-secondary py-16">
                    <p>No tames added yet.</p>
                    <p>Click "Add Tame" to start your collection!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tames.map(tame => {
                        const creatureInfo = CREATURES.find(c => c.id === tame.creatureId);
                        if (!creatureInfo) return null;
                        return (
                            <div key={tame.id} className="bg-bg-secondary p-3 rounded-lg border border-border-color flex items-center gap-4">
                                <img src={creatureInfo.image} alt={creatureInfo.name} className="w-16 h-16 rounded-md object-cover"/>
                                <div className="flex-1">
                                    <p className="font-bold text-text-primary">{tame.nickname} <span className="text-xs text-text-secondary">({creatureInfo.name})</span></p>
                                    <p className="text-sm text-text-secondary">Lvl {tame.baseLevel} - {tame.gender}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <button onClick={() => handleOpenModal(tame)} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                                    <button onClick={() => handleDelete(tame.id)} className="p-2 text-text-secondary hover:text-[var(--accent-negative)] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            
            {isModalOpen && <TameFormModal tame={editingTame} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
};

const TameFormModal: React.FC<{tame: TamedCreature | null, onSave: (tame: TamedCreature) => void, onClose: () => void}> = ({tame, onSave, onClose}) => {
    const [formData, setFormData] = useState<any>(tame || { gender: 'Unknown', baseStats: {} });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev:any) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setFormData((prev:any) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-bg-secondary w-full max-w-md rounded-lg border border-border-color p-5 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="font-orbitron font-bold text-lg text-white">{tame ? 'Edit' : 'Add'} Tame</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <select name="creatureId" value={formData.creatureId || ''} onChange={handleChange} required className="w-full bg-bg-tertiary p-2 rounded-md border border-border-color text-sm">
                        <option value="" disabled>Select Creature</option>
                        {CREATURES.filter(c=>c.tameable).sort((a,b)=>a.name.localeCompare(b.name)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="text" name="nickname" value={formData.nickname || ''} onChange={handleChange} placeholder="Nickname" required className="w-full bg-bg-tertiary p-2 rounded-md border border-border-color text-sm"/>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" name="baseLevel" value={formData.baseLevel || ''} onChange={handleChange} placeholder="Base Level" required className="w-full bg-bg-tertiary p-2 rounded-md border border-border-color text-sm"/>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-bg-tertiary p-2 rounded-md border border-border-color text-sm">
                            <option>Unknown</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <h4 className="text-sm font-bold pt-2 text-text-secondary">Base Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {['health', 'stamina', 'oxygen', 'food', 'weight', 'melee'].map(stat => (
                            <input key={stat} type="number" name={`baseStats.${stat}`} value={formData.baseStats[stat] || ''} onChange={handleChange} placeholder={stat.charAt(0).toUpperCase() + stat.slice(1)} required className="w-full bg-bg-tertiary p-2 rounded-md border border-border-color text-sm"/>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-bg-tertiary text-text-primary px-4 py-2 rounded-lg text-sm">Cancel</button>
                        <button type="submit" className="bg-[var(--accent-ultimate)] text-bg-primary px-4 py-2 rounded-lg text-sm">Save</button>
                    </div>
                </form>
            </div>
         </div>
    );
}

export default MyTamesTab;