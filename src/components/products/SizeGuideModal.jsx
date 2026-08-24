import React, { useState } from 'react';
import { X, Ruler, Check, Sparkles } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

const SIZE_DATA = {
  inches: [
    { size: 'XS', chest: '40.0', length: '27.5', shoulder: '20.0', sleeve: '8.5', fit: 'Slightly Relaxed' },
    { size: 'S', chest: '42.0', length: '28.5', shoulder: '21.0', sleeve: '9.0', fit: 'Modern Boxy' },
    { size: 'M', chest: '44.0', length: '29.5', shoulder: '22.0', sleeve: '9.5', fit: 'Signature Oversized' },
    { size: 'L', chest: '46.0', length: '30.5', shoulder: '23.0', sleeve: '10.0', fit: 'Streetwear Drape' },
    { size: 'XL', chest: '48.5', length: '31.5', shoulder: '24.0', sleeve: '10.5', fit: 'Exaggerated Boxy' },
    { size: 'XXL', chest: '51.0', length: '32.5', shoulder: '25.0', sleeve: '11.0', fit: 'Maximum Street Drape' },
  ],
  cm: [
    { size: 'XS', chest: '101.5', length: '70.0', shoulder: '50.8', sleeve: '21.5', fit: 'Slightly Relaxed' },
    { size: 'S', chest: '106.5', length: '72.5', shoulder: '53.3', sleeve: '22.8', fit: 'Modern Boxy' },
    { size: 'M', chest: '111.8', length: '75.0', shoulder: '55.8', sleeve: '24.1', fit: 'Signature Oversized' },
    { size: 'L', chest: '116.8', length: '77.5', shoulder: '58.4', sleeve: '25.4', fit: 'Streetwear Drape' },
    { size: 'XL', chest: '123.2', length: '80.0', shoulder: '61.0', sleeve: '26.7', fit: 'Exaggerated Boxy' },
    { size: 'XXL', chest: '129.5', length: '82.5', shoulder: '63.5', sleeve: '28.0', fit: 'Maximum Street Drape' },
  ],
};

export default function SizeGuideModal({ isOpen, onClose }) {
  useScrollLock(isOpen);
  const [unit, setUnit] = useState('inches');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#10121A] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#C5A880]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                T-Shirt Sizing & Measurements
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Engineered with drop-shoulder boxy cuts and pre-shrunk combed cotton.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between my-6">
          <span className="text-xs font-mono text-slate-300 uppercase">Garment Specifications</span>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                unit === 'inches' ? 'bg-white text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                unit === 'cm' ? 'bg-white text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              CENTIMETERS
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090A0F] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest ({unit})</th>
                <th className="py-3 px-4">Length ({unit})</th>
                <th className="py-3 px-4">Shoulder ({unit})</th>
                <th className="py-3 px-4">Sleeve ({unit})</th>
                <th className="py-3 px-4">Silhouette</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {SIZE_DATA[unit].map((row) => (
                <tr key={row.size} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#C5A880]">{row.size}</td>
                  <td className="py-3 px-4">{row.chest}</td>
                  <td className="py-3 px-4">{row.length}</td>
                  <td className="py-3 px-4">{row.shoulder}</td>
                  <td className="py-3 px-4">{row.sleeve}</td>
                  <td className="py-3 px-4 text-slate-400">{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Recommendation Note */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            Fit Recommendation
          </div>
          <p className="text-slate-400 leading-relaxed font-light">
            Our t-shirts are intentionally designed with an <strong>oversized drop-shoulder streetwear cut</strong>. We recommend selecting your true standard size for the intended relaxed drape. If you prefer a regular/standard fitted profile, order one size down.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black font-mono text-xs font-bold uppercase rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
