import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import type { RoundHistory } from '../types';

interface ZeroOneGameScreenProps {
    initialScore: number;
    maxRounds?: number;
    onBack: () => void;
}

export const ZeroOneGameScreen = ({ initialScore, maxRounds = 15, onBack }: ZeroOneGameScreenProps) => {
    const [remainingScore, setRemainingScore] = useState(initialScore);
    const [startOfRoundScore, setStartOfRoundScore] = useState(initialScore);
    const [currentRound, setCurrentRound] = useState(1);
    const [currentDarts, setCurrentDarts] = useState<(number | string)[]>(['?', '?', '?']);
    const [dartIndex, setDartIndex] = useState(0);
    const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);
    const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
    const [gameState, setGameState] = useState<'playing' | 'bust' | 'finished' | 'gameover'>('playing');

    useEffect(() => {
        setRemainingScore(initialScore);
        setStartOfRoundScore(initialScore);
        setCurrentRound(1);
        setRoundHistory([]);
        setCurrentDarts(['?', '?', '?']);
        setDartIndex(0);
        setMultiplier(1);
        setGameState('playing');
    }, [initialScore]);

    const resetRound = () => {
        setCurrentDarts(['?', '?', '?']);
        setDartIndex(0);
        setMultiplier(1);
    };

    const handleScoreInput = (baseScore: number) => {
        if (dartIndex >= 3 || gameState !== 'playing') return;

        const isBullOrZero = baseScore === 50 || baseScore === 0;
        const finalScore = isBullOrZero ? baseScore : baseScore * multiplier;
        const newRemaining = remainingScore - finalScore;

        const newDarts = [...currentDarts];
        newDarts[dartIndex] = finalScore;
        setCurrentDarts(newDarts);
        setMultiplier(1);

        if (newRemaining < 0) {
            setRemainingScore(startOfRoundScore); 
            setGameState('bust');
            setDartIndex(3); 
        } else if (newRemaining === 0) {
            setRemainingScore(0);
            setGameState('finished');
            setDartIndex(prev => prev + 1);
        } else {
            setRemainingScore(newRemaining);
            setDartIndex(prev => prev + 1);
        }
    };

    const toggleMultiplier = (val: 2 | 3) => {
        setMultiplier(prev => prev === val ? 1 : val);
    };

    const handleDelete = () => {
        if (dartIndex <= 0 || gameState === 'finished') return;
        
        if (gameState === 'bust') {
            setGameState('playing');
            setRemainingScore(startOfRoundScore);
            resetRound();
            return;
        }

        const lastScore = currentDarts[dartIndex - 1];
        if (typeof lastScore === 'number') {
            setRemainingScore(prev => prev + lastScore);
        }
        const newDarts = [...currentDarts];
        newDarts[dartIndex - 1] = '?';
        setCurrentDarts(newDarts);
        setDartIndex(prev => prev - 1);
        setMultiplier(1);
    };

    const handleNextRound = () => {
        const roundTotal = currentDarts.reduce((acc, val) => {
            return typeof val === 'number' ? (acc as number) + val : (acc as number);
        }, 0) as number;

        setRoundHistory(prev => [{ 
            round: currentRound, 
            scores: [...currentDarts], 
            total: gameState === 'bust' ? 0 : roundTotal 
        }, ...prev]);

        if (currentRound >= maxRounds && gameState !== 'finished') {
            setGameState('gameover');
            return;
        }

        if (gameState === 'bust') {
            setGameState('playing');
        } else {
            setStartOfRoundScore(remainingScore);
        }

        setCurrentRound(prev => prev + 1);
        resetRound();
    };

    const currentRoundTotal = currentDarts.reduce((acc, val) => {
        return typeof val === 'number' ? (acc as number) + val : (acc as number);
    }, 0);

    return (
        // ★修正: ここに w-full を追加しました
        <div className="flex h-full w-full relative">
            {/* 結果モーダル */}
            {(gameState === 'finished' || gameState === 'gameover') && (
                <div className="absolute inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center max-w-md w-full mx-4">
                        {gameState === 'finished' ? (
                            <>
                                <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
                                <h2 className="text-4xl font-bold text-white mb-2">GAME CLEAR!</h2>
                                <p className="text-slate-400 mb-6">Total Rounds: <span className="text-white font-bold text-xl">{currentRound}</span></p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-bold text-slate-400 mb-2">GAME OVER</h2>
                                <p className="text-slate-500 mb-6">ラウンド制限に達しました</p>
                            </>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold">
                                メニューへ
                            </button>
                            <button onClick={() => {
                                setRemainingScore(initialScore);
                                setStartOfRoundScore(initialScore);
                                setCurrentRound(1);
                                setRoundHistory([]);
                                resetRound();
                                setGameState('playing');
                            }} className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                                <RotateCcw size={18} /> もう一度
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 左サイドバー */}
            <div className="w-72 lg:w-96 bg-slate-800 border-r border-slate-700 p-6 overflow-auto shrink-0 flex flex-col">
                <div className="mb-6">
                    <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> ゲーム選択に戻る
                    </button>
                    <h3 className="text-2xl font-bold text-white">01 - {initialScore}</h3>
                    <p className="text-slate-500 text-sm">Limit: {maxRounds} Rounds</p>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div className={`p-4 rounded-lg border transition-colors ${gameState === 'bust' ? 'bg-red-900/20 border-red-500' : 'bg-slate-900 border-slate-700'}`}>
                        <p className="text-slate-400 text-sm mb-1">残りスコア</p>
                        <p className={`text-5xl font-bold text-center ${gameState === 'bust' ? 'text-red-500' : 'text-white'}`}>
                            {gameState === 'bust' ? 'BUST' : remainingScore}
                        </p>
                    </div>
                    
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <h4 className="text-white font-semibold mb-2 text-sm">履歴</h4>
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {roundHistory.map((item, i) => (
                            <div key={i} className="bg-slate-750 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                                <div>
                                    <span className="text-slate-400 text-xs block">R{item.round}</span>
                                    <div className="flex gap-1 mt-1">
                                        {item.scores.map((s, j) => (
                                            <span key={j} className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-xs min-w-[24px] text-center inline-block">
                                                {s === 0 ? 'MISS' : s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-white font-bold">-{item.total}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* メインエリア */}
            <div className="flex-1 p-6 lg:p-10 overflow-auto flex flex-col bg-slate-900">
                <div className="max-w-full w-full h-full flex flex-col">
                    
                    <h3 className="text-2xl font-bold text-white mb-6 flex justify-between items-end">
                        <span>Round {currentRound} <span className="text-slate-500 text-lg">/ {maxRounds}</span></span>
                        <span className="text-slate-400 text-base lg:text-lg bg-slate-800 px-4 py-1 rounded-full border border-slate-700">
                            {dartIndex < 3 ? `${dartIndex + 1}投目` : 'ラウンド終了'}
                        </span>
                    </h3>

                    {/* 3投の表示 */}
                    <div className="grid grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-10">
                        {currentDarts.map((dart, i) => (
                            <div key={i} className={`${dart === '?' ? 'bg-slate-800/50 border-2 border-dashed border-slate-600' : 'bg-blue-900/20 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'} rounded-2xl p-4 text-center h-28 lg:h-40 flex flex-col justify-center items-center transition-all duration-200`}>
                                <p className="text-slate-400 text-xs lg:text-sm mb-2">{i + 1}</p>
                                <p className={`${dart === '?' ? 'text-slate-500' : (dart === 0 ? 'text-red-400' : 'text-white')} text-4xl lg:text-6xl font-bold tracking-wider`}>
                                    {dart === 0 ? 'MISS' : dart}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 lg:p-5 text-center mb-6 lg:mb-10 flex justify-between items-center px-8 shadow-lg">
                        <span className="text-blue-300 font-medium text-lg">Current Round Total</span>
                        <span className="text-4xl lg:text-5xl font-bold text-white">
                            {gameState === 'bust' ? 'BUST' : currentRoundTotal}
                        </span>
                    </div>

                    {/* キーパッド */}
                    <div className={`flex-1 flex flex-col justify-end space-y-3 lg:space-y-4 select-none transition-opacity ${gameState !== 'playing' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="grid grid-cols-5 gap-3 lg:gap-4">
                            {['20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'].map(num => (
                                <button 
                                    key={num} 
                                    onClick={() => handleScoreInput(parseInt(num))} 
                                    className={`
                                        text-white h-14 lg:h-20 rounded-xl font-bold text-xl lg:text-3xl transition-all shadow-md active:scale-95
                                        ${multiplier === 3 ? 'bg-yellow-600 hover:bg-yellow-500 ring-4 ring-yellow-500/30 z-10 scale-105' : 
                                          multiplier === 2 ? 'bg-red-600 hover:bg-red-500 ring-4 ring-red-500/30 z-10 scale-105' : 
                                          'bg-slate-700 hover:bg-slate-600 active:bg-blue-600 border-b-4 border-slate-800 active:border-b-0 active:translate-y-1'}
                                    `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-5 gap-3 lg:gap-4">
                            <button onClick={() => toggleMultiplier(3)} className={`h-14 lg:h-20 text-white rounded-xl font-bold text-sm lg:text-lg transition-colors shadow-md ${multiplier === 3 ? 'bg-yellow-500 text-black ring-2 ring-white scale-95' : 'bg-yellow-700 hover:bg-yellow-600 border-b-4 border-yellow-900 active:border-b-0 active:translate-y-1'}`}>Triple</button>
                            <button onClick={() => toggleMultiplier(2)} className={`h-14 lg:h-20 text-white rounded-xl font-bold text-sm lg:text-lg transition-colors shadow-md ${multiplier === 2 ? 'bg-red-500 ring-2 ring-white scale-95' : 'bg-red-700 hover:bg-red-600 border-b-4 border-red-900 active:border-b-0 active:translate-y-1'}`}>Double</button>
                            <button onClick={() => handleScoreInput(50)} className="h-14 lg:h-20 bg-green-700 hover:bg-green-600 text-white rounded-xl font-bold text-lg lg:text-xl border-b-4 border-green-900 active:border-b-0 active:translate-y-1 shadow-md">Bull</button>
                            <button onClick={() => handleScoreInput(0)} className="h-14 lg:h-20 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-lg lg:text-xl border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 shadow-md">0</button>
                            <button onClick={handleDelete} className="h-14 lg:h-20 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-semibold border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 shadow-md">削除</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:gap-8 w-full mt-6">
                        <button onClick={() => { resetRound(); setRemainingScore(startOfRoundScore); setGameState('playing'); }} className="bg-slate-700 hover:bg-slate-600 text-white h-14 lg:h-16 rounded-xl font-semibold text-lg transition-colors">
                            ラウンドやり直し
                        </button>
                        <button onClick={handleNextRound} disabled={dartIndex < 3 && gameState === 'playing'} className="bg-blue-600 hover:bg-blue-500 text-white h-14 lg:h-16 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            {gameState === 'finished' ? '結果を見る' : '次のラウンドへ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};