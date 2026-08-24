import React, { useState, useEffect } from 'react';
import { Clock, Send, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function DropCountdown() {
  const { addToast } = useToast();
  const { playSuccessChime, playClick } = useSoundFX();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubscribed(true);
    playSuccessChime();

    // Trigger celebratory stardust confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#c5a880', '#e2e8f0', '#ffffff'],
    });

    addToast('VIP Early Access Confirmed! Use code "VIP10" for 10% off your order.', 'success');
  };

  return (
    <section id="drop-countdown" className="py-20 bg-[#07080B] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#10121A] border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>NEXT LIMITED T-SHIRT DROP</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-display mb-3">
                PHASE 05: <span className="shimmer-text">CYBER SUPERMOON</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-6 font-light">
                Strictly limited to 150 serialized 340 GSM graphic tees. Hand-finished with holographic foil transfers and numbered atelier badges. Sign up for 15-minute priority access before the public release.
              </p>

              {/* VIP Subscription Form */}
              {isSubscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div className="text-xs sm:text-sm font-medium">
                    You are on the VIP priority list. Your unlock code is{' '}
                    <span className="font-mono font-bold text-white bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      VIP10
                    </span>
                    .
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email for VIP drop alert..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-white text-white placeholder-slate-500 px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg"
                  >
                    <span>Get Notified</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Right Countdown Boxes */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
                <div className="bg-[#090A0F] border border-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-lg">
                  <span className="block text-2xl sm:text-4xl font-extrabold font-display text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
                    DAYS
                  </span>
                </div>
                <div className="bg-[#090A0F] border border-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-lg">
                  <span className="block text-2xl sm:text-4xl font-extrabold font-display text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
                    HOURS
                  </span>
                </div>
                <div className="bg-[#090A0F] border border-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-lg">
                  <span className="block text-2xl sm:text-4xl font-extrabold font-display text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
                    MINS
                  </span>
                </div>
                <div className="bg-[#090A0F] border border-[#C5A880]/40 p-4 sm:p-5 rounded-2xl text-center shadow-lg">
                  <span className="block text-2xl sm:text-4xl font-extrabold font-display text-[#C5A880]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
                    SECS
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>GLOBAL DROP TIME: 00:00 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
