
import { TamedCreature } from '../types';

const TAMES_STORAGE_KEY = 'my_tamed_creatures';

// A simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getTames = (): TamedCreature[] => {
  try {
    const tamesJson = localStorage.getItem(TAMES_STORAGE_KEY);
    return tamesJson ? JSON.parse(tamesJson) : [];
  } catch (error) {
    console.error("Failed to retrieve tames from localStorage", error);
    return [];
  }
};

export const saveTames = (tames: TamedCreature[]) => {
  try {
    localStorage.setItem(TAMES_STORAGE_KEY, JSON.stringify(tames));
  } catch (error) {
    console.error("Failed to save tames to localStorage", error);
  }
};

export const addTame = (newTame: Omit<TamedCreature, 'id'>): TamedCreature => {
  const tames = getTames();
  const tameWithId = { ...newTame, id: generateUUID() };
  saveTames([...tames, tameWithId]);
  return tameWithId;
};

export const updateTame = (updatedTame: TamedCreature): TamedCreature[] => {
  const tames = getTames();
  const updatedTames = tames.map(tame => tame.id === updatedTame.id ? updatedTame : tame);
  saveTames(updatedTames);
  return updatedTames;
};

export const removeTame = (tameId: string): TamedCreature[] => {
  const tames = getTames();
  const filteredTames = tames.filter(tame => tame.id !== tameId);
  saveTames(filteredTames);
  return filteredTames;
};
