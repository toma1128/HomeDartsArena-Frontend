import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { RoundHistory } from '../types';

interface GamePlayScreenProps {
    initialScore: number;
    onBack: () => void;
}

export const ZeroOneGameScreen = ({ initialScore, onBack }: GamePlayScreenProps) => {
    // ※現在は01ゲーム専用のロジックになっています
    const [remainingScore, setRemainingScore] = useState(initialScore);
    const [currentRound, setCurrentRound] = useState(1);
    const [currentDarts, setCurrentDarts] = useState<(number | string)[]>(['?', '?', '?']);
    const [dartIndex, setDartIndex] = useState(0);
    const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);
    const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);

    // 初期化
    useEffect(() => {
        setRemainingScore(initialScore);
        setCurrentRound(1);
        setRoundHistory([]);
        setCurrentDarts(['?', '?', '?']);
        setDartIndex(0);
    }, [initialScore]);

    const resetRound = () => {
        setCurrentDarts(['?', '?', '?']);
        setDartIndex(0);
    };

    const handleScoreInput = (baseScore: number) => {
        if (dartIndex >= 3) return;
        const isBullorZero = baseScore === 0 || baseScore === 50;
        const finalScore = isBullorZero ? baseScore : baseScore * multiplier;
        const newDarts = [...currentDarts];
        newDarts[dartIndex] = finalScore;
        setCurrentDarts(newDarts);
        setDartIndex(prev => prev + 1);
        setRemainingScore(prev => prev - finalScore);
        setMultiplier(1);
    };

    const toggleMultiplier = (val: 2 | 3) => {
        setMultiplier(prev => prev === val ? 1 : val);
    };

    const handleDelete = () => {
        if (dartIndex <= 0) return;
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

        setRoundHistory(prev => [{ round: currentRound, scores: [...currentDarts], total: roundTotal }, ...prev]);
        setCurrentRound(prev => prev + 1);
        resetRound();
    };

    const currentRoundTotal = currentDarts.reduce((acc, val) => {
        return typeof val === 'number' ? (acc as number) + val : (acc as number);
    }, 0);

    return (
        <div className="flex h-full">
            {/* サイドバー */}
            <div className="w-96 bg-slate-800 border-r border-slate-700 p-6 overflow-auto shrink-0">
                <div className="mb-6">
                    <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> ゲーム選択に戻る
                    </button>
                    <h3 className="text-2xl font-bold text-white">01 - {initialScore}</h3>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-400 text-sm mb-1">残りスコア</p>
                        <p className="text-5xl font-bold text-white text-center">{remainingScore}</p>
                    </div>

                    {/* 履歴表示エリア */}
                    <div className="mt-4 space-y-2 overflow-y-auto max-h-[400px]">
                        {roundHistory.map((item, i) => (
                        <div key={i} className="bg-slate-750 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                            <div>
                                <span className="text-slate-400 text-xs block">Round {item.round}</span>
                                <div className="flex gap-1 mt-1">
                                    {item.scores.map((s, j) => (
                                        // 修正箇所: 0ならMISSと表示
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

            {/* メインエリア */}
            <div className="flex-1 p-8 overflow-auto flex flex-col items-center">
                <div className="max-w-2xl w-full">

                    <h3 className="text-2xl font-bold text-white mb-6">Round {currentRound} <span className="text-slate-500 text-lg ml-2">{dartIndex + 1}投目</span></h3>

                    {/* 3投の表示エリア */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                    {currentDarts.map((dart, i) => (
                        <div key={i} className={`${dart === '?' ? 'bg-slate-800 border-2 border-dashed border-slate-600' : 'bg-blue-900/30 border-2 border-blue-500'} rounded-xl p-6 text-center h-32 flex flex-col justify-center items-center transition-all duration-200`}>
                            <p className="text-slate-400 text-xs mb-2">{i + 1}</p>
                            {/* 修正箇所: 0ならMISSと表示 */}
                            <p className={`${dart === '?' ? 'text-slate-500' : (dart === 0 ? 'text-red-400' : 'text-white')} text-4xl font-bold`}>
                                {dart === 0 ? 'MISS' : dart}
                            </p>
                        </div>
                    ))}
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center mb-8 flex justify-between items-center px-8">
                        <span className="text-blue-300">このラウンドの合計</span>
                        <span className="text-4xl font-bold text-white">{currentRoundTotal}</span>
                    </div>

                    <div className="space-y-3 mb-6 select-none">
                        <div className="grid grid-cols-5 gap-2">
                            {['20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'].map(num => (
                                <button key={num} onClick={() => handleScoreInput(parseInt(num))} className={`text-white py-4 rounded-lg font-bold text-xl transition-all${multiplier === 3 ? 'bg-yellow-600 hover:bg-yellow-500 ring-2 ring-yellow-300' : multiplier === 2 ? 'bg-red-600 hover:bg-red-500 ring-2 ring-red-300' : 'bg-slate-700 hover:bg-slate-600 active:bg-blue-600'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {/* Triple Button */}
                            <button onClick={() => toggleMultiplier(3)} className={`text-white py-4 rounded-lg font-bold text-sm transition-colors${multiplier === 3 ? 'bg-yellow-500 text-black ring-2 ring-white' : 'bg-yellow-600 hover:bg-yellow-500'}`}>
                                Triple
                            </button>

                            {/* Double Button */}
                            <button onClick={() => toggleMultiplier(2)} className={`text-white py-4 rounded-lg font-bold text-sm transition-colors${multiplier === 2 ? 'bg-red-500 ring-2 ring-white' : 'bg-red-600 hover:bg-red-500'}`}>
                                Double
                            </button>

                            <button onClick={() => handleScoreInput(50)} className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-lg font-bold text-lg">Bull</button>
                            <button onClick={() => handleScoreInput(0)} className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-bold text-lg">0</button>
                            <button onClick={handleDelete} className="bg-slate-600 hover:bg-slate-500 text-white py-4 rounded-lg font-semibold">削除</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-6">
                        <button onClick={() => { resetRound(); setRemainingScore(prev => prev + (currentRoundTotal as number)); }} className="bg-slate-700 text-white py-4 rounded-lg">ラウンドやり直し</button>
                        <button onClick={handleNextRound} disabled={dartIndex < 3} className="bg-blue-600 text-white py-4 rounded-lg">次のラウンドへ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};