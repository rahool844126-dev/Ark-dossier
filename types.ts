
// Defines the game edition, mobile or ultimate.
export enum ArkEdition {
  ULTIMATE = 'ultimate',
  MOBILE = 'mobile',
}

export interface Creature {
  id: string;
  name: string;
  image: string;
  diet: 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Piscivore';
  temperament: 'Aggressive' | 'Passive' | 'Neutral' | 'Skittish' | 'Untamable';
  tameable: boolean;
  tamingMethod: 'Knockout' | 'Passive' | 'Special' | 'Untamable';
  rideable: boolean;
  description: string;
  stats: {
    health: number;
    stamina: number;
    oxygen: number;
    food: number;
    weight: number;
    melee: number;
    speed: number;
    baseTorpor?: number;
    torporPerLevel?: number;
    wildLevelUp: {
      health: number;
      stamina: number;
      oxygen: number;
      food: number;
      weight: number;
      melee: number;
      speed: number;
    };
    levelUp: {
      health: number;
      stamina: number;
      weight: number;
      melee: number; // percentage
      speed: number; // percentage
    }
  };
  torporDrain?: 'Very Fast' | 'Fast' | 'Normal' | 'Slow' | 'Very Slow';
  preferredFood: string[];
  category?: 'Standard' | 'Special';
  eggSize?: 'Extra Small' | 'Small' | 'Medium' | 'Large' | 'Extra Large' | 'Special';
  tameLocations?: { location: string; lat: number; lon: number }[];
  gathering?: {
    resource: string;
    rating: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  }[];
  mobileExclusive?: boolean;
  breeding?: {
    gestationTime?: number; // seconds
    incubationTime?: number; // seconds
    maturationTime: number; // seconds
  };
}

export interface TamedCreature {
  id: string; // uuid
  creatureId: string; // from CREATURES constant
  nickname: string;
  gender: 'Male' | 'Female' | 'Unknown';
  baseLevel: number;
  baseStats: {
    health: number;
    stamina: number;
    oxygen: number;
    food: number;
    weight: number;
    melee: number;
  };
}


export interface Recipe {
  id: string;
  name: string;
  category: 'Legacy Kibble' | 'Revamped Kibble' | 'Consumable' | 'Other';
  ingredients: { item: string; amount: string }[];
  tames?: string;
  effect?: string;
  mobileExclusive?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
