// src/components/GamePlayScreen.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { RoundHistory } from '../types';

interface GamePlayScreenProps {
    initialScore: number;
    onBack: () => void;
}

export const GamePlayScreen = ({ initialScore, onBack }: GamePlayScreenProps) => {
    // ゲームのロジックをコンポーネント内に閉じ込める
    const [remainingScore, setRemainingScore] = useState(initialScore);
    const [currentRound, setCurrentRound] = useState(1);
    const [currentDarts, setCurrentDarts] = useState<(number | string)[]>(['?', '?', '?']);
    const [dartIndex, setDartIndex] = useState(0);
    const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);

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

    const handleScoreInput = (score: number) => {
        if (dartIndex >= 3) return;
        const newDarts = [...currentDarts];
        newDarts[dartIndex] = score;
        setCurrentDarts(newDarts);
        setDartIndex(prev => prev + 1);
        setRemainingScore(prev => prev - score);
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
            <div className="w-96 bg-slate-800 border-r border-slate-700 p-6 overflow-auto shrink-0">
                <div className="mb-6">
                    <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> ゲーム選択に戻る
                    </button>
                    <h3 className="text-2xl font-bold text-white">01 - {initialScore}</h3>
                </div>
                {/* ... サイドパネルの残り ... */}
                <div className="space-y-4 mb-6">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-400 text-sm mb-1">残りスコア</p>
                        <p className="text-5xl font-bold text-white text-center">{remainingScore}</p>
                    </div>
                        {/* 履歴表示など */}
                        <div className="mt-4 space-y-2 overflow-y-auto max-h-[400px]">
                            {roundHistory.map((item, i) => (
                            <div key={i} className="bg-slate-750 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                                {/* ... 履歴の中身 ... */}
                                <span className="text-white font-bold">-{item.total}</span>
                            </div>
                            ))}
                    </div>
                </div>
            </div>

        <div className="flex-1 p-8 overflow-auto flex flex-col items-center">
            {/* ... メインエリア (ダーツ表示、キーパッドなど) ... */}
            {/* コード簡略化のため、ボタン部分などは省略していますが、元のJSXをここに配置します */}
            <div className="max-w-2xl w-full">
                {/* ... キーパッドなどのJSX ... */}
                <div className="grid grid-cols-5 gap-2">
                {['20', '19', '18', '17', '16'].map(num => (
                    <button key={num} onClick={() => handleScoreInput(parseInt(num))} className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-bold text-xl">{num}</button>
                ))}
                </div>
                {/* ... アクションボタン ... */}
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <button onClick={() => { resetRound(); setRemainingScore(prev => prev + (currentRoundTotal as number)); }} className="bg-slate-700 text-white py-4 rounded-lg">ラウンドやり直し</button>
                    <button onClick={handleNextRound} disabled={dartIndex < 3} className="bg-blue-600 text-white py-4 rounded-lg">次のラウンドへ</button>
                </div>
            </div>
        </div>
    </div>
    );
};