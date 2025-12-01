import React, { useState, useEffect, useMemo } from 'react';
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

    // スタッツ (PPR: Points Per Round) の計算
    const pointsPerRound = useMemo(() => {
        let totalDarts = roundHistory.reduce((count, round) => {
            return count + round.scores.filter(s => s !== '?').length;
        }, 0);

        const isCurrentRoundInHistory = roundHistory.some(r => r.round === currentRound);
        if (!isCurrentRoundInHistory) {
            totalDarts += dartIndex;
        }

        if (totalDarts === 0) return "0.00";

        const totalScore = initialScore - remainingScore;
        // PPR = (総得点 / 総ダーツ数) * 3
        return ((totalScore / totalDarts) * 3).toFixed(2);
    }, [remainingScore, roundHistory, dartIndex, initialScore, currentRound]);

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

    const getNumButtonStyle = () => {
        const baseStyle = "text-white h-14 lg:h-16 rounded-lg font-bold text-xl lg:text-2xl transition-all shadow-md active:scale-95 active:border-b-0 active:translate-y-1 bg-slate-700 hover:bg-slate-600 active:bg-blue-600 border-b-4 border-slate-800";
        
        if (multiplier === 3) {
            return `${baseStyle} ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 bg-slate-700`;
        }
        if (multiplier === 2) {
            return `${baseStyle} ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900 bg-slate-700`;
        }
        return baseStyle;
    };

    return (
        <div className="flex h-screen w-full relative overflow-hidden">
            {/* 結果モーダル */}
            {(gameState === 'finished' || gameState === 'gameover') && (
                <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 p-4">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center max-w-md w-full">
                        {gameState === 'finished' ? (
                            <>
                                <div className="mb-6 inline-block bg-yellow-500/20 p-4 rounded-full">
                                    <Trophy size={64} className="text-yellow-400" />
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-2 tracking-wide">GAME CLEAR!</h2>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-bold text-slate-400 mb-2 tracking-wide">GAME OVER</h2>
                                <p className="text-slate-500 mb-6">ラウンド制限に達しました</p>
                            </>
                        )}

                        {/* リザルト表示エリア */}
                        <div className="bg-slate-900/50 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4 border border-slate-700/50">
                            <div className="flex flex-col items-center justify-center border-r border-slate-700/50">
                                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">残りスコア</p>
                                <p className="text-4xl font-bold text-white font-mono">{remainingScore}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">スタッツ (PPR)</p>
                                <p className="text-4xl font-bold text-white font-mono">{pointsPerRound}</p>
                            </div>
                            <div className="col-span-2 border-t border-slate-700/50 pt-4 mt-2">
                                <p className="text-slate-500 text-xs uppercase mb-1">Total Rounds</p>
                                <p className="text-xl font-bold text-slate-300">
                                    {currentRound} <span className="text-sm font-normal text-slate-600">/ {maxRounds}</span>
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                                メニューへ
                            </button>
                            <button onClick={() => {
                                setRemainingScore(initialScore);
                                setStartOfRoundScore(initialScore);
                                setCurrentRound(1);
                                setRoundHistory([]);
                                resetRound();
                                setGameState('playing');
                            }} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/30 active:scale-95">
                                <RotateCcw size={20} /> もう一度
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 左サイドバー */}
            <div className="w-72 lg:w-80 bg-slate-800 border-r border-slate-700 p-4 lg:p-6 flex flex-col h-full overflow-hidden shrink-0">
                <div className="mb-4 lg:mb-6 shrink-0">
                    <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> ゲーム選択に戻る
                    </button>
                    <h3 className="text-2xl font-bold text-white">01 - {initialScore}</h3>
                    <p className="text-slate-500 text-sm">Limit: {maxRounds} Rounds</p>
                </div>
                
                <div className={`p-4 rounded-lg border mb-6 shrink-0 transition-colors ${gameState === 'bust' ? 'bg-red-900/20 border-red-500' : 'bg-slate-900 border-slate-700'}`}>
                    <p className="text-slate-400 text-sm mb-1">残りスコア</p>
                    <p className={`text-5xl font-bold text-center ${gameState === 'bust' ? 'text-red-500' : 'text-white'}`}>
                        {gameState === 'bust' ? 'BUST' : remainingScore}
                    </p>
                    {gameState === 'bust' && <p className="text-red-400 text-center text-sm mt-1">BUST!</p>}
                </div>
                
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <h4 className="text-white font-semibold mb-2 text-sm shrink-0">履歴</h4>
                    <div className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {roundHistory.map((item, i) => (
                        <div key={i} className="bg-slate-700/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center shrink-0">
                            <div>
                                <span className="text-slate-400 text-xs block">R{item.round}</span>
                                <div className="flex gap-1 mt-1">
                                    {item.scores.map((s, j) => (
                                        <span key={j} className="bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded text-xs min-w-[24px] text-center inline-block">
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

            {/* メインエリア */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col bg-slate-900">
                <div className="max-w-full w-full h-full flex flex-col justify-between">
                    
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl lg:text-2xl font-bold text-white flex justify-between items-end">
                            <span>Round {currentRound} <span className="text-slate-500 text-base lg:text-lg">/ {maxRounds}</span></span>
                            <span className="text-slate-400 text-sm lg:text-base bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                {dartIndex < 3 ? `${dartIndex + 1}投目` : '完了'}
                            </span>
                        </h3>

                        <div className="grid grid-cols-3 gap-4 lg:gap-6">
                            {currentDarts.map((dart, i) => (
                                <div key={i} className={`${dart === '?' ? 'bg-slate-800/50 border-2 border-dashed border-slate-600' : 'bg-blue-900/20 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'} rounded-xl p-2 text-center h-24 lg:h-32 flex flex-col justify-center items-center transition-all duration-200`}>
                                    <p className="text-slate-400 text-xs mb-1">{i + 1}</p>
                                    <p className={`${dart === '?' ? 'text-slate-500' : (dart === 0 ? 'text-red-400' : 'text-white')} text-3xl lg:text-5xl font-bold tracking-wider`}>
                                        {dart === 0 ? 'MISS' : dart}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 lg:p-4 text-center flex justify-between items-center px-6 shadow-lg">
                            <span className="text-blue-300 font-medium">Total</span>
                            <span className="text-3xl lg:text-4xl font-bold text-white">
                                {gameState === 'bust' ? 'BUST' : currentRoundTotal}
                            </span>
                        </div>
                    </div>

                    <div className={`flex flex-col justify-end gap-3 mt-4 select-none transition-opacity ${gameState !== 'playing' && gameState !== 'bust' ? 'opacity-50 pointer-events-none' : ''}`}>
                        
                        <div className="grid grid-cols-5 gap-3 lg:gap-4">
                            {['20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'].map(num => (
                                <button 
                                    key={num} 
                                    onClick={() => handleScoreInput(parseInt(num))} 
                                    disabled={gameState === 'bust'}
                                    className={`${getNumButtonStyle()} ${gameState === 'bust' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-5 gap-3 lg:gap-4">
                            <button onClick={() => toggleMultiplier(3)} disabled={gameState === 'bust'} className={`h-12 lg:h-14 text-white rounded-lg font-bold text-sm lg:text-base transition-all shadow-md active:scale-95 active:border-b-0 active:translate-y-1 ${multiplier === 3 ? 'bg-yellow-500 text-black border-b-4 border-yellow-700 transform translate-y-1 border-b-0 shadow-inner' : 'bg-yellow-600 hover:bg-yellow-500 border-b-4 border-yellow-800'} ${gameState === 'bust' ? 'opacity-50 cursor-not-allowed' : ''}`}>Triple</button>
                            <button onClick={() => toggleMultiplier(2)} disabled={gameState === 'bust'} className={`h-12 lg:h-14 text-white rounded-lg font-bold text-sm lg:text-base transition-all shadow-md active:scale-95 active:border-b-0 active:translate-y-1 ${multiplier === 2 ? 'bg-red-500 border-b-4 border-red-700 transform translate-y-1 border-b-0 shadow-inner' : 'bg-red-600 hover:bg-red-500 border-b-4 border-red-800'} ${gameState === 'bust' ? 'opacity-50 cursor-not-allowed' : ''}`}>Double</button>
                            <button onClick={() => handleScoreInput(50)} disabled={gameState === 'bust'} className={`h-12 lg:h-14 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-lg lg:text-xl border-b-4 border-green-800 active:border-b-0 active:translate-y-1 shadow-md ${gameState === 'bust' ? 'opacity-50 cursor-not-allowed' : ''}`}>Bull</button>
                            <button onClick={() => handleScoreInput(0)} disabled={gameState === 'bust'} className={`h-12 lg:h-14 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-lg lg:text-xl border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 shadow-md ${gameState === 'bust' ? 'opacity-50 cursor-not-allowed' : ''}`}>0</button>
                            <button onClick={handleDelete} className="h-12 lg:h-14 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 shadow-md">削除</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:gap-8 mt-2">
                            <button onClick={() => { resetRound(); setRemainingScore(startOfRoundScore); setGameState('playing'); }} className="bg-slate-700 hover:bg-slate-600 text-white h-12 lg:h-14 rounded-lg font-semibold text-base transition-colors shadow-lg border-b-4 border-slate-800 active:border-b-0 active:translate-y-1">
                                ラウンドやり直し
                            </button>
                            <button onClick={handleNextRound} disabled={dartIndex < 3 && gameState === 'playing'} className="bg-blue-600 hover:bg-blue-500 text-white h-12 lg:h-14 rounded-lg font-bold text-base shadow-lg shadow-blue-900/50 transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                                {gameState === 'finished' ? '結果を見る' : '次のラウンドへ'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};