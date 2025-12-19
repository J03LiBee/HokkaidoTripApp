/**
 * Login Screen Component
 * Allows users to choose between Google Sign-in or Anonymous access
 */

import React, { useState } from 'react';
import { Snowflake, User, Chrome } from 'lucide-react';

const LoginScreen = ({ onGoogleSignIn, onAnonymousSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onGoogleSignIn();
    } catch (err) {
      setError('Google 登入失敗，請重試');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onAnonymousSignIn();
    } catch (err) {
      setError('登入失敗，請重試');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200"></div>
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-purple-100/30 to-transparent mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Snowfall background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-50 animate-fall shadow-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Hero Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mb-4">
              <Snowflake size={40} className="text-slate-700" />
            </div>
            <h1 className="text-3xl font-serif text-slate-800 mb-2">
              北海道冬之旅 ❄️
            </h1>
            <p className="text-slate-500 text-sm">
              計劃你的完美北海道冬季之旅
            </p>
          </div>

          {/* Sign-in Options */}
          <div className="space-y-4">
            {/* Google Sign-in */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome size={20} />
              使用 Google 帳號登入
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">或</span>
              </div>
            </div>

            {/* Anonymous Sign-in */}
            <button
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-xl shadow-md border border-slate-200 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User size={20} />
              快速體驗（訪客模式）
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              使用 Google 帳號可在多個裝置同步資料
            </p>
            <p className="text-xs text-slate-500 mt-1">
              訪客模式僅儲存於本機瀏覽器
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

