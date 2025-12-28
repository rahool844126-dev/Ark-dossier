
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  const [expandedRecipes, setExpandedRecipes] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('expandedRecipeIds');
      if (savedState) {
        setExpandedRecipes(JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Failed to parse expanded recipes from localStorage", error);
      setExpandedRecipes([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expandedRecipeIds', JSON.stringify(expandedRecipes));
  }, [expandedRecipes]);

  const handleToggle = (recipeId: string) => {
    setExpandedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  if (recipes.length === 0) {
    return <div className="text-center text-text-secondary mt-12">No recipes found.</div>;
  }

  return (
    <div className="space-y-3">
      {recipes.map((recipe) => {
        const isExpanded = expandedRecipes.includes(recipe.id);
        return (
          <div key={recipe.id} className="bg-bg-secondary rounded-lg border border-border-color overflow-hidden">
            <button
              onClick={() => handleToggle(recipe.id)}
              className="w-full flex justify-between items-center text-left p-4 hover:bg-bg-tertiary transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`recipe-ingredients-${recipe.id}`}
            >
              <div className="flex items-center gap-3">
                {recipe.mobileExclusive && (
                    <span className="text-xs font-bold h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--accent-mobile)] text-bg-primary">M</span>
                )}
                <h4 className="font-bold text-text-primary text-base">
                  {recipe.name}
                </h4>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isExpanded && (
              <div 
                id={`recipe-ingredients-${recipe.id}`} 
                className="px-4 pb-4 pt-2 border-t border-border-color"
              >
                 {recipe.tames && (
                    <div className="mb-4 mt-2 p-3 bg-bg-tertiary rounded-md">
                        <p className="text-xs text-text-secondary leading-relaxed">
                            <span className="font-bold text-[var(--accent-main)] block mb-1">Primary Use</span> 
                            {recipe.tames}
                        </p>
                    </div>
                 )}
                 {recipe.effect && (
                    <div className="mb-4 mt-2 p-3 bg-bg-tertiary rounded-md">
                        <p className="text-xs text-text-secondary leading-relaxed">
                            <span className="font-bold text-[var(--accent-main)] block mb-1">Effect & Duration</span> 
                            {recipe.effect}
                        </p>
                    </div>
                 )}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-bg-tertiary px-3 py-2 rounded-md">
                      <span className="text-text-secondary font-medium">{ing.item}</span>
                      <span className="text-text-primary font-bold">x{ing.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;