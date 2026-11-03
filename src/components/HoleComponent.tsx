import React from 'react';
import { HoleState } from '../types/badaku';
import { Flame } from 'lucide-react';

interface HoleComponentProps {
  hole: HoleState;
  label: string; // e.g. "A1", "B4", "Induk A"
  isClickable: boolean;
  isActiveSowing: boolean;
  isInPreview: boolean;
  isNembakTarget?: boolean;
  previewType?: 'jalan_lagi' | 'nembak' | 'mati_lawan' | 'mati_kosong_sendiri' | 'lanjut_jalan';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const HoleComponent: React.FC<HoleComponentProps> = ({
  hole,
  label,
  isClickable,
  isActiveSowing,
  isInPreview,
  isNembakTarget,
  previewType,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { seeds, isInduk, isLop } = hole;

  // Generate visual marbles based on seed count (render max 15 individual marbles for aesthetics)
  const renderedMarbles = Math.min(seeds, 14);

  // Stable seed marble color variations
  const marbleColors = [
    'from-amber-100 to-amber-300 border-amber-400',
    'from-stone-100 to-stone-300 border-stone-400',
    'from-orange-100 to-orange-300 border-orange-400',
    'from-yellow-100 to-amber-200 border-amber-300',
    'from-emerald-100 to-teal-300 border-teal-400',
    'from-cyan-100 to-blue-200 border-cyan-400',
  ];

  if (isInduk) {
    // Big Induk cup (Storehouse)
    return (
      <div
        className={`relative flex flex-col items-center justify-between w-28 md:w-32 h-64 md:h-72 p-3 rounded-full transition-all duration-300 ${
          isActiveSowing
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-950 scale-105'
            : 'hover:border-amber-700/60'
        } ${
          isInPreview
            ? 'ring-2 ring-emerald-400 bg-emerald-950/20'
            : 'bg-gradient-to-b from-[#2b1104] via-[#1d0b02] to-[#120701]'
        } wood-induk-shadow border-2 border-amber-900/40 select-none`}
      >
        {/* Label Header */}
        <div className="text-center pt-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300/80">
            {label}
          </span>
          <p className="text-[10px] text-amber-200/50">Rumah Induk</p>
        </div>

        {/* Induk sunken hollow with marbles */}
        <div className="relative flex-1 w-full rounded-full flex flex-wrap items-center justify-center p-2.5 overflow-hidden content-center gap-1">
          {Array.from({ length: Math.min(seeds, 24) }).map((_, idx) => {
            const colorClass = marbleColors[idx % marbleColors.length];
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br ${colorClass} border shadow-sm transition-transform duration-200`}
                style={{
                  transform: `translate(${(idx % 3 - 1) * 3}px, ${(Math.floor(idx / 3) % 4 - 1.5) * 2}px) rotate(${idx * 45}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Count Badge */}
        <div className="pb-2">
          <div className="px-3.5 py-1 rounded-full bg-amber-950/90 border border-amber-700/50 shadow-inner flex items-center gap-1.5">
            <span className="text-xs text-amber-300/70 font-medium">Biji:</span>
            <span className="text-base md:text-lg font-bold text-amber-100 font-mono tabular-nums">
              {seeds}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Small hole (7 on each side)
  return (
    <div className="flex flex-col items-center">
      {/* Hole ID Label */}
      <span
        className={`text-[11px] font-bold tracking-wide mb-1 transition-colors ${
          isNembakTarget
            ? 'text-red-400 animate-pulse font-extrabold'
            : isInPreview
            ? 'text-amber-300 font-bold'
            : 'text-amber-300/70'
        }`}
      >
        {label}
      </span>

      {/* Sunken Cup Button */}
      <button
        type="button"
        disabled={!isClickable || isLop}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-200 wood-cup-shadow border ${
          isLop
            ? 'bg-stone-900 border-stone-800 opacity-60 cursor-not-allowed'
            : isNembakTarget
            ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-amber-950 bg-red-950/40 border-red-500 scale-105'
            : isActiveSowing
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-950 bg-amber-900/60 border-amber-400 scale-105'
            : isInPreview
            ? 'ring-2 ring-emerald-400 bg-amber-950/40 border-emerald-400'
            : isClickable
            ? 'bg-gradient-to-b from-[#2a1104] to-[#120701] border-amber-800/60 hover:border-amber-400 hover:scale-105 hover:shadow-lg hover:shadow-amber-900/40 cursor-pointer active:scale-95'
            : 'bg-gradient-to-b from-[#240e03] to-[#0f0501] border-amber-950/80 cursor-default'
        }`}
        aria-label={`${label}, ${isLop ? 'Terbakar (Lop)' : `${seeds} biji`}`}
      >
        {/* Burned / Lop Overlay */}
        {isLop && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/75 z-10 text-stone-400">
            <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-amber-500 uppercase mt-0.5">
              LOP
            </span>
          </div>
        )}

        {/* Marbles Cluster */}
        {!isLop && seeds > 0 && (
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex flex-wrap items-center justify-center content-center gap-0.5 p-1 pointer-events-none">
            {Array.from({ length: renderedMarbles }).map((_, idx) => {
              const colorClass = marbleColors[idx % marbleColors.length];
              return (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-br ${colorClass} border border-amber-950/30 shadow-xs`}
                  style={{
                    transform: `translate(${(idx % 3 - 1) * 2}px, ${(Math.floor(idx / 3) - 1) * 2}px)`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Empty Hole Indicator */}
        {!isLop && seeds === 0 && (
          <span className="text-xs text-amber-800/50 font-mono font-medium">0</span>
        )}

        {/* Seed Count Badge */}
        {!isLop && (
          <div
            className={`absolute -bottom-2 px-2 py-0.5 rounded-full text-xs font-bold font-mono tabular-nums shadow-md transition-all ${
              seeds > 0
                ? 'bg-amber-900 text-amber-100 border border-amber-600'
                : 'bg-stone-800 text-stone-400 border border-stone-700'
            }`}
          >
            {seeds}
          </div>
        )}

        {/* Preview Badge Indicator */}
        {previewType && isInPreview && (
          <div className="absolute -top-3 z-20 px-1.5 py-0.5 text-[9px] font-bold rounded shadow-md whitespace-nowrap bg-emerald-600 text-white uppercase tracking-wider">
            {previewType === 'jalan_lagi'
              ? 'Induk'
              : previewType === 'nembak'
              ? 'Tombok!'
              : previewType === 'mati_lawan'
              ? 'Mati'
              : 'Akhir'}
          </div>
        )}
      </button>
    </div>
  );
};
