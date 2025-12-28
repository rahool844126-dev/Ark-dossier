
import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from 'react';
import { Creature, ChatMessage, Recipe } from './types';
import { CREATURES, RECIPES } from './constants';
import CreatureCard from './components/CreatureCard';
import { getSurvivalTips } from './services/geminiService';
import CreatureDetailPage from './components/CreatureDetailPage';
import RecipesTab from './components/RecipesTab';
import BreedingTab from './components/BreedingTab';
import MyTamesTab from './components/MyTamesTab';
import HomeTab from './components/HomeTab';
import SettingsTab from './components/SettingsTab';
import VersionToggle from './components/VersionToggle';
import { useSettings } from './SettingsContext';

type Tab = 'home' | 'creatures' | 'recipes' | 'breeding' | 'myTames' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { settings } = useSettings();
  const { allowImageEditing } = settings;

  const scrollPosition = useRef(0);

  useEffect(() => {
    const requestPersistence = async () => {
        if (navigator.storage && navigator.storage.persist) {
            const isPersisted = await navigator.storage.persisted();
            if (!isPersisted) {
                const result = await navigator.storage.persist();
                console.log(`Storage persistence request result: ${result}`);
            } else {
                console.log("Storage is already persisted.");
            }
        }
    };
    requestPersistence();
  }, []);

  const allCreatures = useMemo(() => {
    return CREATURES.sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  
  const searchedCreatures = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) return allCreatures;
    return allCreatures
      .filter(c => {
        const nameMatch = c.name.toLowerCase().includes(lowerCaseQuery);
        const eggMatch = c.eggSize ? `${c.eggSize.toLowerCase()} egg`.includes(lowerCaseQuery) : false;
        return nameMatch || eggMatch;
      });
  }, [searchQuery, allCreatures]);

  const allRecipes = useMemo(() => {
    return RECIPES.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await getSurvivalTips(userMsg);
    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };
  
  const navigateToTab = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };
  
  const handleSelectCreature = (creature: Creature) => {
    scrollPosition.current = window.scrollY;
    setSelectedCreature(creature);
  };

  const handleBackFromDetail = () => {
    setSelectedCreature(null);
  };

  useLayoutEffect(() => {
    if (!selectedCreature) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [selectedCreature]);


  const renderContent = () => {
    switch (activeTab) {
        case 'home':
            return <HomeTab onNavigate={navigateToTab} onSelectCreature={handleSelectCreature} />;
        case 'creatures':
            return (
                 <>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search creatures or egg size..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-secondary border-2 border-border-color rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 transition-all focus:ring-[var(--accent-main)]"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        {searchedCreatures.map(creature => (
                            <CreatureCard 
                                key={creature.id} 
                                creature={creature} 
                                onClick={() => handleSelectCreature(creature)}
                            />
                        ))}
                    </div>
                </>
            );
        case 'recipes':
            return <RecipesTab recipes={allRecipes} />;
        case 'breeding':
            return <BreedingTab />;
        case 'myTames':
            return <MyTamesTab />;
        case 'settings':
             return <SettingsTab />;
    }
  }

  if (selectedCreature) {
    return <CreatureDetailPage creature={selectedCreature} onBack={handleBackFromDetail} allowImageEditing={allowImageEditing} />;
  }

  const navItems: { tab: Tab; label: string; icon: React.ReactElement }[] = [
    {tab: 'home', label: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    {tab: 'creatures', label: 'Dossiers', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
    {tab: 'recipes', label: 'Recipes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg> },
    {tab: 'breeding', label: 'Breeding', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg> },
    {tab: 'myTames', label: 'My Tames', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.559 1.832a4.002 4.002 0 00-2.882 0C2.969 8.523 2 9.873 2 11.5V13a1 1 0 001 1h8a1 1 0 001-1v-1.5c0-1.627-.969-2.977-2.559-3.668zM18 6a3 3 0 11-6 0 3 3 0 016 0zM12.441 7.832a4.002 4.002 0 012.882 0C17.03 8.523 18 9.873 18 11.5V13a1 1 0 001 1h.5a1 1 0 001-1v-1.5c0-1.627-.969-2.977-2.559-3.668z" /></svg> },
    {tab: 'settings', label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen pb-28 max-w-md mx-auto relative flex flex-col bg-transparent">
      <header className="p-4 bg-bg-primary border-b border-border-color">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-orbitron font-black text-text-primary">
                ARK<span className="text-[var(--accent-main)]">DOSSIER</span>
            </h1>
            <VersionToggle />
        </div>
      </header>
      
      <main className="p-4 flex-1 content-enter" key={activeTab}>
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto h-24 bg-gradient-to-t from-bg-primary via-bg-primary/90 to-bg-primary/0">
        <div className="absolute bottom-4 left-4 right-4 h-16 bg-bg-secondary/50 backdrop-blur-xl border border-border-color rounded-2xl flex justify-around items-center px-1">
            {navItems.map(({tab, icon, label}) => (
                 <button 
                    key={tab}
                    onClick={() => navigateToTab(tab as Tab)}
                    className={`relative flex flex-col items-center justify-center h-full flex-1 rounded-lg transition-all duration-300 text-xs font-medium ${activeTab === tab ? 'text-[var(--accent-main)]' : 'text-text-secondary hover:text-text-primary'}`}
                    aria-label={label}
                >
                    {icon}
                    <span className="mt-1">{label}</span>
                    {activeTab === tab && <div className="absolute bottom-1 w-5 h-1 rounded-full bg-[var(--accent-main)]"></div>}
                </button>
            ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
