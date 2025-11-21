export type Screen = 'home' | 'game-select' | 'game-play' | 'match';

// ゲーム履歴の型
export interface GameHistory {
    game: string;
    score: number | string;
    date: string;
    avg: number | string;
    rounds: number;
}

// ラウンド履歴の型
export interface RoundHistory {
    round: number;
    scores: (number | string)[];
    total: number;
}