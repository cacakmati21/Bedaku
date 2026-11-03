import React, { useRef, useEffect } from 'react';
import { GameLogEntry } from '../types/badaku';
import { ScrollText, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface GameLogProps {
  entries: GameLogEntry[];
}

export const GameLog: React.FC<GameLogProps> = ({ entries }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="w-full bg-stone-900/90 border border-amber-900/30 rounded-2xl p-4 shadow-lg backdrop-blur-xs flex flex-col">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300 uppercase tracking-wider">
          <ScrollText className="w-4 h-4 text-amber-400" />
          Catatan Wasit & Komentator Pertandingan
        </div>
        <span className="text-stone-500 font-mono text-[11px] tabular-nums">
          {entries.length} Catatan
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs"
      >
        {entries.length === 0 ? (
          <div className="py-6 text-center text-stone-500 italic">
            Permainan belum dimulai. Pilih lubang untuk memulai babak.
          </div>
        ) : (
          entries.map((entry) => {
            const isNembak = entry.type === 'nembak';
            const isJalanLagi = entry.type === 'jalan_lagi';
            const isLop = entry.type === 'lop';

            return (
              <div
                key={entry.id}
                className={`p-2 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isNembak
                    ? 'bg-red-950/40 border-red-700/60 text-red-200'
                    : isJalanLagi
                    ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
                    : isLop
                    ? 'bg-stone-950 border-orange-800/60 text-orange-300'
                    : 'bg-stone-950/50 border-stone-800/80 text-stone-300'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isNembak ? (
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  ) : isJalanLagi ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-stone-500" />
                  )}
                </div>
                <div className="flex-1 leading-snug">
                  <span className="text-[10px] text-stone-500 font-mono mr-2">
                    {entry.timestamp}
                  </span>
                  <span className="font-medium">{entry.message}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
