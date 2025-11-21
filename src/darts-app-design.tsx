import React, { useState } from 'react';
import type { Screen } from './types';
import { Sidebar } from './components/sidebar';
import { GamePlayScreen } from './components/gamePlayScreen';
import { Home, Target, Clock, TrendingUp } from 'lucide-react'; // ホーム画面用のアイコン

// 他の画面（Home, GameSelect）も同様に components に分けるのが理想ですが、
// ここでは例として GamePlayScreen だけ分離した場合の書き方を示します。

const DartsAppDesign = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');
    const [gameStartScore, setGameStartScore] = useState(501);

    // ゲーム開始時のハンドラ
    const handleStartGame = (score: number) => {
        setGameStartScore(score);
        setCurrentScreen('game-play');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex font-sans text-slate-200">
            {/* サイドバー */}
            <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

            {/* メインコンテンツエリア */}
            <div className="flex-1 overflow-auto">

            {/* ホーム画面 */}
            {currentScreen === 'home' && (
                <div className="p-8">
                    {/* ... ホーム画面のJSX (これをさらに HomeScreen.tsx に移すと完璧です) ... */}
                    <h2 className="text-3xl font-bold text-white mb-8">ダッシュボード</h2>
                    <button onClick={() => handleStartGame(501)} className="bg-blue-600 px-6 py-3 rounded text-white">
                    クイックスタート (501)
                    </button>
                </div>
            )}

            {/* ゲーム選択画面 */}
            {currentScreen === 'game-select' && (
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-white mb-8">ゲームを選択</h2>
                    <button onClick={() => handleStartGame(501)} className="bg-slate-800 p-8 border border-slate-700 rounded hover:border-blue-600 text-left block w-full max-w-lg">
                        <h3 className="text-2xl font-bold text-white">01 Game</h3>
                        <p className="text-slate-400">501</p>`
                    </button>
                </div>
            )}

            {/* ゲームプレイ画面 (分離したコンポーネントを使用) */}
            {currentScreen === 'game-play' && (
                <GamePlayScreen 
                initialScore={gameStartScore} 
                onBack={() => setCurrentScreen('game-select')} 
                />
            )}
            </div>
        </div>
    );
};

export default DartsAppDesign;