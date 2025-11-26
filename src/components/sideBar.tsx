import React from 'react';
import { Home, Target, Users } from 'lucide-react';
import type { Screen } from '../types.ts';

interface SidebarProps {
    currentScreen: Screen;
    setCurrentScreen: (screen: Screen) => void;
}

export const Sidebar = ({ currentScreen, setCurrentScreen }: SidebarProps) => {
    return (
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Target size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Home Darts Arena</h1>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-4">
                <button onClick={() => setCurrentScreen('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentScreen === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                <Home size={20} /> <span className="font-medium">ホーム</span>
                </button>
                <button onClick={() => setCurrentScreen('game-select')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentScreen.includes('game') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                    <Target size={20} /> <span className="font-medium">新規ゲーム</span>
                </button>
                <button onClick={() => setCurrentScreen('match')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentScreen === 'match' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                    <Users size={20} /> <span className="font-medium">対戦モード</span>
                </button>
            </nav>
        </div>
    );
};