import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, X, Slash } from 'lucide-react';
import type { RoundHistory } from '../types';

interface CricketGameScreenProps {
    maxRounds?: number;
    onBack: () => void;
}

// クリケットのターゲットナンバー
const TARGET_NUMBERS = [20, 19, 18, 17, 16, 15, 25] as const; // 25はBull

type Marks = {
    [key: number]: number; // key: ナンバー, value: マーク数 (0-3以上)
};

// 1投ごとの履歴データ（Undo用）
type DartState = {
    marks: Marks;
    totalScore: number;
    roundScore: number;
    darts: (number | string)[];
    multiplier: 1 | 2 | 3;
};

export const CricketGameScreen = ({ maxRounds = 15, onBack }: CricketGameScreenProps) => {
    const [totalScore, setTotalScore] = useState(0);
    const [marks, setMarks] = useState<Marks>({ 20:0, 19:0, 18:0, 17:0, 16:0, 15:0, 25:0 });
    
    const [currentRound, setCurrentRound] = useState(1);
    const [currentDarts, setCurrentDarts] = useState<(number | string)[]>(['?', '?', '?']);
    const [dartIndex, setDartIndex] = useState(0);
    const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);
    
    const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
    const [gameState, setGameState] = useState<'playing' | 'finished' | 'gameover'>('playing');
    const [roundScore, setRoundScore] = useState(0);

    // Undo用の履歴スタック
    const [historyStack, setHistoryStack] = useState<DartState[]>([]);

    // ラウンド開始時のバックアップ（ラウンドやり直し用）
    const [roundStartMarks, setRoundStartMarks] = useState<Marks>({ ...marks });
    const [roundStartScore, setRoundStartScore] = useState(0);

    useEffect(() => {
        // 初期化
        const initialMarks = { 20:0, 19:0, 18:0, 17:0, 16:0, 15:0, 25:0 };
        setTotalScore(0);
        setMarks(initialMarks);
        setRoundStartMarks(initialMarks);
        setRoundStartScore(0);
        setCurrentRound(1);
        setRoundHistory([]);
        resetRound();
        setGameState('playing');
    }, []);

    const resetRound = () => {
        setCurrentDarts(['?', '?', '?']);
        setDartIndex(0);
        setRoundScore(0);
        setMultiplier(1);
        setHistoryStack([]);
    };

    // スコア入力処理
    const handleScoreInput = (targetNum: number) => {
        if (dartIndex >= 3 || gameState !== 'playing') return;

        // 現在の状態をスタックに保存（Undo用）
        setHistoryStack(prev => [...prev, {
            marks: { ...marks },
            totalScore,
            roundScore,
            darts: [...currentDarts],
            multiplier
        }]);

        const num = targetNum === 50 ? 25 : targetNum;
        const isTarget = TARGET_NUMBERS.includes(num as any);
        const hitMultiplier = (num === 25 && multiplier === 3) ? 1 : multiplier;
        
        let earnedScore = 0;
        let markLabel = "MISS";

        if (isTarget) {
            const currentMarks = marks[num] || 0;
            const newMarks = currentMarks + hitMultiplier;
            
            if (currentMarks >= 3) {
                earnedScore = num * hitMultiplier;
            } else if (newMarks > 3) {
                const overflow = newMarks - 3;
                earnedScore = num * overflow;
            }

            const nextMarks = { ...marks, [num]: Math.min(99, newMarks) };
            setMarks(nextMarks);

            if (num === 25) {
                markLabel = hitMultiplier === 2 ? "D-BULL" : "S-BULL";
            } else {
                markLabel = hitMultiplier === 3 ? `T-${num}` : hitMultiplier === 2 ? `D-${num}` : `S-${num}`;
            }
        } else if (targetNum === 0) {
            markLabel = "MISS";
        } else {
            markLabel = `${num}`;
        }

        setTotalScore(prev => prev + earnedScore);
        setRoundScore(prev => prev + earnedScore);

        const newDarts = [...currentDarts];
        newDarts[dartIndex] = markLabel;
        setCurrentDarts(newDarts);

        setDartIndex(prev => prev + 1);
        setMultiplier(1);

        // 終了判定
        const allClosed = TARGET_NUMBERS.every(n => {
            const m = marks[n] || 0;
            const add = (n === num) ? hitMultiplier : 0;
            return (m + add) >= 3;
        });
        if (allClosed) {
            setGameState('finished');
        }
    };

    const toggleMultiplier = (val: 2 | 3) => {
        setMultiplier(prev => prev === val ? 1 : val);
    };

    // 削除（Undo）機能
    const handleDelete = () => {
        if (historyStack.length === 0 || dartIndex <= 0) return;

        const prevState = historyStack[historyStack.length - 1];
        setMarks(prevState.marks);
        setTotalScore(prevState.totalScore);
        setRoundScore(prevState.roundScore);
        setCurrentDarts(prevState.darts);
        setMultiplier(1);
        setDartIndex(prev => prev - 1);
        
        setHistoryStack(prev => prev.slice(0, -1));
        
        if (gameState === 'finished') {
            setGameState('playing');
        }
    };

    const handleNextRound = () => {
        setRoundHistory(prev => [{ 
            round: currentRound, 
            scores: [...currentDarts], 
            total: roundScore 
        }, ...prev]);

        if (currentRound >= maxRounds && gameState !== 'finished') {
            setGameState('gameover');
            return;
        }

        setRoundStartMarks({ ...marks });
        setRoundStartScore(totalScore);

        setCurrentRound(prev => prev + 1);
        resetRound();
    };

    // ラウンドやり直し
    const handleRetryRound = () => {
        setMarks({ ...roundStartMarks });
        setTotalScore(roundStartScore);
        resetRound();
        setGameState('playing');
    };

    const MarkIcon = ({ count }: { count: number }) => {
        if (count >= 3) return <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold rounded shadow-inner shadow-black/20"><X size={24} strokeWidth={4} /></div>;
        if (count === 2) return <div className="w-full h-full flex items-center justify-center text-blue-400"><X size={24} /></div>;
        if (count === 1) return <div className="w-full h-full flex items-center justify-center text-blue-400"><Slash size={24} /></div>;
        return <div className="w-full h-full bg-slate-900/50 rounded"></div>;
    };

    // 数字ボタンのスタイル判定（01と統一 + ターゲット判定）
    const getNumButtonStyle = (num: number) => {
        const isTarget = TARGET_NUMBERS.includes(num === 50 ? 25 : num as any);
        
        // ベーススタイル: 立体的で押しやすいデザイン
        let style = "h-12 lg:h-14 rounded-lg font-bold text-xl lg:text-2xl transition-all shadow-md active:scale-95 active:border-b-0 active:translate-y-1 border-b-4 ";
        
        if (isTarget) {
            // ターゲット: 01と同じスレート色
            style += "bg-slate-700 hover:bg-slate-600 text-white border-slate-900 ";
        } else {
            // 無効な数字: 暗く沈んだ色
            style += "bg-slate-800 text-slate-600 border-slate-950 ";
        }
        
        // 倍率選択時の強調（枠線のみ）
        if (isTarget) {
            if (multiplier === 3) {
                style += "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900";
            } else if (multiplier === 2) {
                style += "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900";
            }
        }
        
        return style;
    };

    return (
        <div className="flex h-screen w-full relative overflow-hidden bg-slate-900 text-slate-200">
            {/* 結果モーダル */}
            {(gameState === 'finished' || gameState === 'gameover') && (
                <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 p-4">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center max-w-md w-full">
                        <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-white mb-2 tracking-wide">{gameState === 'finished' ? 'ALL CLOSED!' : 'GAME OVER'}</h2>
                        <div className="bg-slate-900/50 rounded-xl p-6 mb-8 mt-4 border border-slate-700/50">
                            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Final Score</p>
                            <p className="text-5xl font-bold text-white font-mono">{totalScore}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">メニューへ</button>
                            <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 active:scale-95">もう一度</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 左サイドバー: ターゲットボード */}
            <div className="w-80 lg:w-96 bg-slate-800 border-r border-slate-700 p-4 flex flex-col h-full overflow-hidden shrink-0">
                <div className="mb-4 shrink-0 flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> 戻る
                    </button>
                    <div className="text-right">
                        <p className="text-xs text-slate-500">Score</p>
                        <p className="text-3xl font-bold text-white">{totalScore}</p>
                    </div>
                </div>

                {/* クリケットボード表示 */}
                <div className="flex-1 bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col justify-between overflow-y-auto">
                    {TARGET_NUMBERS.map(num => (
                        <div key={num} className="flex items-center justify-between h-full min-h-[3rem] border-b border-slate-800 last:border-0">
                            <span className={`text-2xl font-bold w-12 text-center ${num === 25 ? 'text-red-500' : 'text-white'}`}>
                                {num === 25 ? 'B' : num}
                            </span>
                            <div className="flex-1 flex gap-2 h-8 mx-4">
                                <div className="flex-1 rounded bg-slate-800 relative overflow-hidden flex items-center justify-center">
                                    <MarkIcon count={marks[num] || 0} />
                                </div>
                            </div>
                            <span className="text-lg font-mono text-slate-400 w-12 text-right">
                                {marks[num] > 3 ? `+${(marks[num] - 3) * (num===25?25:num)}` : '-'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* メインエリア */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col bg-slate-900">
                <div className="max-w-full w-full h-full flex flex-col justify-between">
                    
                    {/* 上部: ラウンド情報 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl lg:text-2xl font-bold text-white flex justify-between items-end">
                            <span>Round {currentRound} <span className="text-slate-500 text-base lg:text-lg">/ {maxRounds}</span></span>
                            <span className="text-slate-400 text-sm lg:text-base bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                {dartIndex < 3 ? `${dartIndex + 1}投目` : '完了'}
                            </span>
                        </h3>

                        {/* 3投の表示 */}
                        <div className="grid grid-cols-3 gap-4 lg:gap-6">
                            {currentDarts.map((dart, i) => (
                                <div key={i} className={`${dart === '?' ? 'bg-slate-800/50 border-2 border-dashed border-slate-600' : 'bg-blue-900/20 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'} rounded-xl p-2 text-center h-24 lg:h-32 flex flex-col justify-center items-center transition-all duration-200`}>
                                    <p className="text-slate-400 text-xs mb-1">{i + 1}</p>
                                    <p className={`${dart === '?' ? 'text-slate-500' : 'text-white'} text-2xl lg:text-4xl font-bold tracking-wider uppercase`}>
                                        {dart}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 下部: キーパッドエリア */}
                    <div className={`flex flex-col justify-end gap-3 mt-4 select-none transition-opacity ${gameState !== 'playing' ? 'opacity-50 pointer-events-none' : ''}`}>
                        
                        <div className="grid grid-cols-5 gap-3 lg:gap-4">
                            {/* 数字ボタン（ターゲット判定あり） */}
                            {[20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                                <button 
                                    key={num} 
                                    onClick={() => handleScoreInput(num)} 
                                    className={getNumButtonStyle(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-5 gap-3 lg:gap-4">
                            {/* Triple: 選択時のみ枠線光る */}
                            <button 
                                onClick={() => toggleMultiplier(3)} 
                                className={`
                                    h-12 lg:h-14 rounded-lg font-bold text-sm lg:text-base transition-all shadow-md active:scale-95 active:border-b-0 active:translate-y-1
                                    ${multiplier === 3 
                                        ? 'bg-yellow-500 text-black border-b-4 border-yellow-700 transform translate-y-1 border-b-0 shadow-inner' // Active
                                        : 'bg-slate-700 text-yellow-500 hover:bg-slate-600 border-b-4 border-slate-900'} // Default
                                `}
                            >
                                Triple
                            </button>
                            
                            {/* Double: 選択時のみ枠線光る */}
                            <button 
                                onClick={() => toggleMultiplier(2)} 
                                className={`
                                    h-12 lg:h-14 rounded-lg font-bold text-sm lg:text-base transition-all shadow-md active:scale-95 active:border-b-0 active:translate-y-1
                                    ${multiplier === 2 
                                        ? 'bg-red-500 text-white border-b-4 border-red-700 transform translate-y-1 border-b-0 shadow-inner' // Active
                                        : 'bg-slate-700 text-red-500 hover:bg-slate-600 border-b-4 border-slate-900'} // Default
                                `}
                            >
                                Double
                            </button>
                            
                            {/* Bull: 緑色で区別 */}
                            <button onClick={() => handleScoreInput(50)} className="h-12 lg:h-14 bg-slate-700 hover:bg-slate-600 text-green-500 rounded-lg font-bold text-lg lg:text-xl border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 shadow-md">Bull</button>
                            <button onClick={() => handleScoreInput(0)} className="h-12 lg:h-14 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-lg lg:text-xl border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 shadow-md">0</button>
                            
                            {/* 削除: 濃い色で見やすく */}
                            <button onClick={handleDelete} className="h-12 lg:h-14 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 shadow-md">削除</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:gap-8 mt-2">
                            <button onClick={handleRetryRound} className="bg-slate-600 hover:bg-slate-500 text-white h-12 lg:h-14 rounded-lg font-semibold text-base transition-colors shadow-lg border-b-4 border-slate-800 active:border-b-0 active:translate-y-1">
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