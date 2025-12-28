
import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import RecipeList from './RecipeList';

const CookingPotIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 21v-5.25c0-1.428.9-2.679 2.188-3.121a23.903 23.903 0 019.124 0c1.288.442 2.188 1.693 2.188 3.121V21" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15.75h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 10.5c3.38-2.122 8.12-2.122 11.5 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l1.5 1.5M12 3v3m3.75 1.5l-1.5-1.5" />
    </svg>
);

const KibbleIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
    </svg>
);

const MortarAndPestleIcon = (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h11.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5c4.142 0 7.5-3.358 7.5-7.5S16.142 4.5 12 4.5 4.5 7.858 4.5 12s3.358 7.5 7.5 7.5z" />
     </svg>
);

interface RecipesTabProps {
    recipes: Recipe[];
}

const RecipesTab: React.FC<RecipesTabProps> = ({ recipes }) => {
    const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categoryCounts = useMemo(() => recipes.reduce((acc, recipe) => {
        acc[recipe.category] = (acc[recipe.category] || 0) + 1;
        return acc;
    }, {} as Record<Recipe['category'], number>), [recipes]);


    const recipeCategories: { category: Recipe['category']; title: string; description: string, icon: React.ReactElement }[] = [
        { 
            category: 'Legacy Kibble', 
            title: 'Legacy Kibble', 
            description: `${categoryCounts['Legacy Kibble'] || 0} recipes - The original, creature-specific system`,
            icon: KibbleIcon,
        },
        { 
            category: 'Revamped Kibble', 
            title: 'Revamped Kibble', 
            description: `${categoryCounts['Revamped Kibble'] || 0} recipes - The newer, category-based system`,
            icon: KibbleIcon,
        },
        { 
            category: 'Consumable', 
            title: 'Consumables', 
            description: `${categoryCounts['Consumable'] || 0} recipes - Brews, food, and other special recipes`,
            icon: CookingPotIcon,
        },
        { 
            category: 'Other', 
            title: 'Other Recipes', 
            description: `${categoryCounts['Other'] || 0} recipes - Narcotics, stimulants, paste & more`,
            icon: MortarAndPestleIcon,
        }
    ];

    const filteredRecipes = useMemo(() => {
        if (!selectedCategory) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();

        return recipes
            .filter(r => r.category === selectedCategory)
            .filter(r => {
                if (!lowerCaseQuery) return true;
                const nameMatch = r.name.toLowerCase().includes(lowerCaseQuery);
                const tamesMatch = r.tames ? r.tames.toLowerCase().includes(lowerCaseQuery) : false;
                return nameMatch || tamesMatch;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, selectedCategory, recipes]);
    
    if (!selectedCategory) {
        return (
            <div className="space-y-4">
                {recipeCategories.map(cat => (
                    <button
                        key={cat.category}
                        onClick={() => setSelectedCategory(cat.category)}
                        className="w-full text-left bg-bg-secondary rounded-lg p-5 flex items-center gap-5 transition-all duration-300 hover:bg-bg-tertiary border border-border-color"
                    >
                        <div className="text-[var(--accent-main)]">
                           {cat.icon}
                        </div>
                        <div>
                            <h2 className="font-orbitron font-bold text-lg text-text-primary uppercase">{cat.title}</h2>
                            <p className="text-sm text-text-secondary">{cat.description}</p>
                        </div>
                        <div className="ml-auto text-text-secondary">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    const currentCategoryInfo = recipeCategories.find(c => c.category === selectedCategory);
    const isKibbleCategory = selectedCategory === 'Legacy Kibble' || selectedCategory === 'Revamped Kibble';
    const placeholderText = isKibbleCategory 
        ? `Search by kibble or creature...` 
        : `Search ${currentCategoryInfo?.title.toLowerCase()}...`;

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                    className="p-2 -ml-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                    aria-label="Go back to recipe categories"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-xl font-orbitron font-bold text-text-primary uppercase">
                    {currentCategoryInfo?.title} 
                </h2>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              </div>
              <input
                type="text"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-secondary border-2 border-border-color rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 transition-all focus:ring-[var(--accent-main)]"
              />
            </div>
            
            <RecipeList recipes={filteredRecipes} />
        </div>
    );
};

export default RecipesTab;