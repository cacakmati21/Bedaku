import React from 'react';
import { PlayerId } from '../types/badaku';
import { Sparkles, Swords, Play } from 'lucide-react';

interface SimultaneousAduViewProps {
  playerASelectedHole: string | null;
  playerBSelectedHole: string | null;
  playerAName: string;
  playerBName: string;
  countdown: number | null;
  isRacing: boolean;
  onSelectAduHole: (player: PlayerId, holeId: string) => void;
  onStartAduRace: () => void;
  onCancelAdu: () => void;
}

export const SimultaneousAduView: React.FC<SimultaneousAduViewProps> = ({
  playerASelectedHole,
  playerBSelectedHole,
  playerAName,
  playerBName,
  countdown,
  isRacing,
  onStartAduRace,
  onCancelAdu,
}) => {
  const readyToRace = !!playerASelectedHole && !!playerBSelectedHole;

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 p-4 rounded-2xl bg-stone-900/90 border border-amber-600/40 shadow-xl backdrop-blur-xs text-stone-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Title & Handbook rule reminder */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-600/30">
            <Swords className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-amber-200 text-sm md:text-base flex items-center gap-2 font-display">
              Fase Awal: "Adu Pertama" (Start Serentak)
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-700/50 uppercase">
                Buku Panduan Hal 2
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Kedua pemain memilih satu lubang awal di sisinya untuk mulai menabur biji secara bersamaan.
            </p>
          </div>
        </div>

        {/* Selection status */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">{playerAName}:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
              playerASelectedHole ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-500'
            }`}>
              {playerASelectedHole || 'Pilih Lubang'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">{playerBName}:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
              playerBSelectedHole ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-500'
            }`}>
              {playerBSelectedHole || 'Pilih Lubang'}
            </span>
          </div>

          {/* Action Button */}
          {countdown !== null ? (
            <div className="px-5 py-2 bg-amber-500 text-stone-950 font-black rounded-xl text-base animate-ping font-mono">
              {countdown > 0 ? countdown : 'MULAI!'}
            </div>
          ) : isRacing ? (
            <div className="px-4 py-2 bg-amber-950 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-2 border border-amber-600 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              Sedang Adu Menabur...
            </div>
          ) : readyToRace ? (
            <button
              onClick={onStartAduRace}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Mulai Adu Serentak
            </button>
          ) : (
            <button
              onClick={onCancelAdu}
              className="px-3 py-1.5 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
            >
              Lewati ke Giliran Klasik
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
