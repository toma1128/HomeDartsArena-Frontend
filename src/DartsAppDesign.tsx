import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ZeroOneGameScreen } from './components/ZeroOneGameScreen';
import { CricketGameScreen } from './components/CricketGameScreen';
import { TrendingUp, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import type { Screen, GameHistory } from './types';

const DartsAppDesign = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');

    // ゲームプレイ時の設定
    const [gameSettings, setGameSettings] = useState({
        type: '01', // '01' | 'cricket'
        startScore: 501,
        maxRounds: 15,
    });

    // null = ゲーム選択トップ画面
    // '01' = 01の設定画面
    // 'cricket' = クリケットの設定画面
    // 'countup' = カウントアップの設定画面
    const [selectingGameMode, setSelectingGameMode] = useState<'01' | 'cricket' | 'countup' | null>(null);

    const gameHistory: GameHistory[] = [
        { game: '01 - 501', score: 3456, date: '2024/11/13 20:45', avg: 65.4, rounds: 9 },
        { game: 'カウントアップ', score: 756, date: '2024/11/13 19:30', avg: 63.0, rounds: 8 },
    ];

    // 01ゲーム開始
    const handleStartZeroOne = (score: number) => {
        setGameSettings({ type: '01', startScore: score, maxRounds: 15 });
        setCurrentScreen('game-play');
        setSelectingGameMode(null); // 選択モードリセット
    };

    //クリケット
    const handleStartCricket = () => {
        setGameSettings({ type: 'cricket', startScore: 0, maxRounds: 15 });
        setCurrentScreen('game-play');
        setSelectingGameMode(null);
    };

  // コンテンツのレンダリング関数
    const renderGameSelectionContent = () => {
        // 1. ゲーム選択トップ画面
        if (selectingGameMode === null) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-200">
            {/* 01 Game */}
            <button 
                onClick={() => setSelectingGameMode('01')} 
                className="bg-slate-800 hover:bg-slate-750 p-8 rounded-xl border-2 border-slate-700 hover:border-blue-600 transition-all text-left group"
            >
                <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">01 Game</h3><p className="text-slate-400 mb-4">持ち点を0にする定番ゲーム</p></div>
                <span className="text-5xl">🎯</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">301</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">501</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">...</span>
                <ChevronRight size={16} className="text-slate-500 ml-auto" />
                </div>
            </button>

            {/* Cricket: 有効化 */}
            <button 
                onClick={() => setSelectingGameMode('cricket')} 
                className="bg-slate-800 hover:bg-slate-750 p-8 rounded-xl border-2 border-slate-700 hover:border-blue-600 transition-all text-left group"
            >
                <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">Cricket</h3><p className="text-slate-400 mb-4">陣取り合戦 (実装済み)</p></div>
                <span className="text-5xl">🦗</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">Standard</span>
                    <ChevronRight size={16} className="text-slate-500 ml-auto" />
                </div>
            </button>

            {/* Count Up */}
            <button 
                onClick={() => setSelectingGameMode('countup')} 
                className="bg-slate-800 hover:bg-slate-750 p-8 rounded-xl border-2 border-slate-700 hover:border-blue-600 transition-all text-left group opacity-60 cursor-not-allowed"
            >
                <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-2xl font-bold text-white mb-2">Count Up</h3><p className="text-slate-400 mb-4">高得点を目指す (実装中)</p></div>
                <span className="text-5xl">📈</span>
                </div>
            </button>
            </div>
        );
        }

        // 2. 「01」の設定画面
        if (selectingGameMode === '01') {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-200">
            <button 
                onClick={() => setSelectingGameMode(null)}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> ゲーム一覧に戻る
            </button>

            <h3 className="text-xl font-bold text-white mb-4">スタートスコアを選択</h3>
            <div className="grid grid-cols-3 gap-6">
                {[301, 501, 701, 901, 1101, 1501].map((score) => (
                <button 
                    key={score}
                    onClick={() => handleStartZeroOne(score)}
                    className="bg-slate-800 hover:bg-blue-900/30 border-2 border-slate-700 hover:border-blue-500 p-8 rounded-xl text-center transition-all group"
                >
                    <p className="text-3xl font-bold text-white group-hover:text-blue-400 mb-2">{score}</p>
                    <p className="text-slate-500 text-sm">15 Rounds</p>
                </button>
                ))}
            </div>
            </div>
        );
        }

        // 3. 「クリケット」の設定画面 (有効化)
        if (selectingGameMode === 'cricket') {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-200">
            <button onClick={() => setSelectingGameMode(null)} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"><ArrowLeft size={20} className="mr-2" /> ゲーム一覧に戻る</button>
            <h3 className="text-xl font-bold text-white mb-4">モードを選択</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={handleStartCricket} className="bg-slate-800 hover:bg-blue-900/30 border-2 border-slate-700 hover:border-blue-500 p-8 rounded-xl text-left transition-all group">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 mb-2">Standard Cricket</h3>
                    <p className="text-slate-400 text-sm">通常のクリケット。エリアをオープンして得点を稼ごう。</p>
                    <div className="mt-4"><span className="text-slate-500 text-xs bg-slate-900 px-2 py-1 rounded">15 Rounds</span></div>
                </button>
                <button className="bg-slate-800 border-2 border-slate-700 p-8 rounded-xl text-left opacity-50 cursor-not-allowed">
                    <h3 className="text-2xl font-bold text-white mb-2">Hidden Cricket</h3>
                    <p className="text-slate-400 text-sm">ターゲットが隠されたクリケット (準備中)</p>
                </button>
            </div>
            </div>
        );
        }

        // 4. 「カウントアップ」の設定画面
        if (selectingGameMode === 'countup') {
        return (
            <div>
            <button onClick={() => setSelectingGameMode(null)} className="flex items-center text-slate-400 mb-4"><ArrowLeft size={20} className="mr-2" />戻る</button>
            <p className="text-white">カウントアップの設定画面（準備中）</p>
            </div>
        );
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 flex font-sans text-slate-200">
        <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

        <div className="flex-1 flex overflow-hidden">

            {/* ホーム画面 */}
            {currentScreen === 'home' && (
            <div className="p-8 flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">ダッシュボード</h2>
                {/* 統計カードなど (省略なし) */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
                    <p className="text-blue-100 text-sm mb-2">現在のレート</p>
                    <p className="text-5xl font-bold text-white mb-2">0</p>
                    <div className="flex items-center text-green-300"><TrendingUp size={16} className="mr-1" /><span className="text-sm">+0.3 本日</span></div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">総ゲーム数</p>
                    <p className="text-4xl font-bold text-white mb-2">156</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">平均スコア (01)</p>
                    <p className="text-4xl font-bold text-white mb-2">65.4</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">ハイスコア</p>
                    <p className="text-4xl font-bold text-yellow-400 mb-2">180</p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">クイックスタート</h3>
                    <button onClick={() => handleStartZeroOne(501)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 rounded-lg transition-all transform hover:scale-[1.01] text-left">
                    <p className="text-white font-semibold mb-1">01 - 501</p>
                    <p className="text-blue-100 text-sm">ソロプレイ</p>
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* ゲーム選択画面 */}
            {currentScreen === 'game-select' && (
            <div className="p-8 flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">ゲームを選択</h2>
                {renderGameSelectionContent()}
                </div>
            </div>
            )}

            {/* ゲームプレイ画面: 01 と クリケット を出し分け */}
            {currentScreen === 'game-play' && (
                gameSettings.type === '01' ? (
                    <ZeroOneGameScreen
                        initialScore={gameSettings.startScore}
                        maxRounds={gameSettings.maxRounds}
                        onBack={() => {
                            setCurrentScreen('game-select');
                            setSelectingGameMode('01');
                        }}
                    />
                ) : (
                    <CricketGameScreen 
                        maxRounds={gameSettings.maxRounds}
                        onBack={() => {
                            setCurrentScreen('game-select');
                            setSelectingGameMode('cricket');
                        }}
                    />
                )
            )}

            {/* 対戦モード */}
            {currentScreen === 'match' && (
            <div className="p-8 flex-1 flex items-center justify-center text-slate-500">
                対戦モードは準備中です
            </div>
            )}
        </div>
        </div>
    );
};

export default DartsAppDesign;