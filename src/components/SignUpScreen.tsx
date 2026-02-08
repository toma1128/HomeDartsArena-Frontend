import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Calendar, Smile, CheckCircle } from 'lucide-react';

// Googleロゴ
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
        </g>
    </svg>
);

interface SignUpScreenProps {
    onBack: () => void;
    onSignUp: () => void;
}

export const SignUpScreen = ({ onBack, onSignUp }: SignUpScreenProps) => {
    // ステップ管理: 'auth' (認証選択) -> 'details' (詳細入力)
    const [step, setStep] = useState<'auth' | 'details'>('auth');
    
    // 登録方法: 'google' | 'manual'
    const [authMethod, setAuthMethod] = useState<'google' | 'manual' | null>(null);

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
        gender: '0',
        birthday: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Googleログイン選択時の処理
    const handleGoogleAuth = () => {
        // 1. Google認証処理 (Firebase等)
        console.log("Google Auth Success (Simulated)");
        
        // 2. DBチェック (未登録と仮定)
        const isUserRegistered = false; 

        if (isUserRegistered) {
            onSignUp(); // 登録済みならそのままログイン
        } else {
            // 3. 未登録なら詳細入力へ進む
            setAuthMethod('google');
            setStep('details');
        }
    };

    // 通常登録選択時の処理
    const handleManualAuth = () => {
        setAuthMethod('manual');
        setStep('details');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full max-w-2xl bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                
                {/* ヘッダー */}
                <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex items-center justify-between">
                    <button 
                        onClick={step === 'details' ? () => setStep('auth') : onBack}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> 
                        {step === 'details' ? '戻る' : '戻る'}
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {step === 'auth' ? 'アカウント登録' : '基本情報の入力'}
                    </h2>
                    <div className="w-20" /> 
                </div>

                <div className="p-8">
                    
                    {/* === Step 1: 認証方法の選択 === */}
                    {step === 'auth' && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="text-center mb-8">
                                <p className="text-slate-300 mb-2">ダーツの戦績を記録・分析しよう</p>
                                <p className="text-slate-500 text-sm">アカウントを作成して、あなたのデータをクラウドに保存</p>
                            </div>

                            <button 
                                onClick={handleGoogleAuth}
                                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.01] shadow-lg mb-8"
                            >
                                <GoogleIcon />
                                <span className="text-lg">Googleで登録 / ログイン</span>
                            </button>

                            <div className="relative flex items-center justify-center mb-8">
                                <div className="border-t border-slate-600 w-full absolute"></div>
                                <span className="bg-slate-800 px-4 text-slate-400 text-sm relative z-10">または</span>
                            </div>

                            <button 
                                onClick={handleManualAuth}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all border border-slate-600"
                            >
                                IDとパスワードで登録
                            </button>
                        </div>
                    )}

                    {/* === Step 2: 詳細情報の入力 === */}
                    {step === 'details' && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            
                            {/* Google経由の場合のメッセージ */}
                            {authMethod === 'google' && (
                                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 flex items-start">
                                    <CheckCircle className="text-blue-400 mr-3 mt-1" size={20} />
                                    <div>
                                        <p className="text-blue-100 font-semibold text-sm">Google認証が完了しました</p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            初回ログインのため、ゲーム内で使用するプロフィール情報を設定してください。
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="border border-slate-700 rounded-lg overflow-hidden mb-6">
                                
                                {/* ユーザー名 */}
                                <div className="flex flex-col md:flex-row border-b border-slate-700 last:border-b-0">
                                    <div className="bg-slate-900/60 w-full md:w-48 p-3 flex items-center text-slate-300 font-semibold border-b md:border-b-0 md:border-r border-slate-700 text-sm">
                                        <User size={16} className="mr-2 text-blue-400" />
                                        ユーザー名
                                    </div>
                                    <div className="flex-1 p-2 bg-slate-800/50">
                                        <input 
                                            type="text" 
                                            name="userName"
                                            placeholder="半角英数字 (日本語不可)"
                                            maxLength={20}
                                            className="w-full bg-transparent border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.userName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* 性別 */}
                                <div className="flex flex-col md:flex-row border-b border-slate-700 last:border-b-0">
                                    <div className="bg-slate-900/60 w-full md:w-48 p-3 flex items-center text-slate-300 font-semibold border-b md:border-b-0 md:border-r border-slate-700 text-sm">
                                        <Smile size={16} className="mr-2 text-green-400" />
                                        性別
                                    </div>
                                    <div className="flex-1 p-2 bg-slate-800/50">
                                        <select
                                            name="gender"
                                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="0">未選択 / その他</option>
                                            <option value="1">男性</option>
                                            <option value="2">女性</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 誕生日 */}
                                <div className="flex flex-col md:flex-row border-b border-slate-700 last:border-b-0">
                                    <div className="bg-slate-900/60 w-full md:w-48 p-3 flex items-center text-slate-300 font-semibold border-b md:border-b-0 md:border-r border-slate-700 text-sm">
                                        <Calendar size={16} className="mr-2 text-purple-400" />
                                        誕生日
                                    </div>
                                    <div className="flex-1 p-2 bg-slate-800/50">
                                        <input 
                                            type="date" 
                                            name="birthday"
                                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* パスワード (Manual登録の時のみ表示) */}
                                {authMethod === 'manual' && (
                                    <div className="flex flex-col md:flex-row border-b border-slate-700 last:border-b-0">
                                        <div className="bg-slate-900/60 w-full md:w-48 p-3 flex items-center text-slate-300 font-semibold border-b md:border-b-0 md:border-r border-slate-700 text-sm">
                                            <Lock size={16} className="mr-2 text-yellow-400" />
                                            パスワード
                                        </div>
                                        <div className="flex-1 p-2 bg-slate-800/50">
                                            <input 
                                                type="password" 
                                                name="password"
                                                placeholder="パスワード"
                                                className="w-full bg-transparent border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={onSignUp}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/30 transition-all hover:scale-105"
                                >
                                    登録完了して開始
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'auth' && (
                        <p className="text-center text-slate-500 text-sm mt-8">
                            アカウントをお持ちの方は <button onClick={onBack} className="text-blue-400 hover:underline">ログイン画面</button> へ
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};