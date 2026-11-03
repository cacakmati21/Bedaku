import React from 'react';
import { PlayerId, BoardState } from '../types/badaku';
import { Trophy, Flame, ChevronRight, RotateCcw } from 'lucide-react';
import { setupLopRound } from '../utils/badakuEngine';

interface RoundSummaryModalProps {
  isOpen: boolean;
  roundNumber: number;
  board: BoardState;
  playerAName: string;
  playerBName: string;
  seedsPerHole: number;
  onContinueNextLopRound: () => void;
  onRestartMatch: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  isOpen,
  roundNumber,
  board,
  playerAName,
  playerBName,
  seedsPerHole,
  onContinueNextLopRound,
  onRestartMatch,
}) => {
  if (!isOpen) return null;

  const scoreA = board.indukA.seeds;
  const scoreB = board.indukB.seeds;

  let roundWinner: PlayerId | 'draw' = 'draw';
  if (scoreA > scoreB) roundWinner = 'A';
  else if (scoreB > scoreA) roundWinner = 'B';

  const lopResult = setupLopRound(board, seedsPerHole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-amber-600/40 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-950 via-stone-950 to-amber-950 border-b border-stone-800 text-center">
          <Trophy className="w-10 h-10 mx-auto text-amber-400 mb-2" />
          <h2 className="text-xl font-extrabold text-amber-100 font-display uppercase tracking-wide">
            Babak {roundNumber} Selesai
          </h2>
          <p className="text-xs text-stone-400">
            Seluruh biji telah terkumpul di kedua Induk
          </p>
        </div>

        {/* Score comparison card */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Player A Score */}
            <div className={`p-4 rounded-2xl border text-center ${
              roundWinner === 'A'
                ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                : 'bg-stone-950/60 border-stone-800'
            }`}>
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block mb-1">
                {playerAName}
              </span>
              <span className="text-3xl font-extrabold text-amber-100 font-mono tabular-nums block">
                {scoreA}
              </span>
              <span className="text-[11px] text-stone-400">Biji di Induk A</span>
              {roundWinner === 'A' && (
                <div className="mt-2 text-xs font-bold text-emerald-400">
                  ★ Menang Babak {roundNumber}
                </div>
              )}
            </div>

            {/* Player B Score */}
            <div className={`p-4 rounded-2xl border text-center ${
              roundWinner === 'B'
                ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                : 'bg-stone-950/60 border-stone-800'
            }`}>
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block mb-1">
                {playerBName}
              </span>
              <span className="text-3xl font-extrabold text-amber-100 font-mono tabular-nums block">
                {scoreB}
              </span>
              <span className="text-[11px] text-stone-400">Biji di Induk B</span>
              {roundWinner === 'B' && (
                <div className="mt-2 text-xs font-bold text-emerald-400">
                  ★ Menang Babak {roundNumber}
                </div>
              )}
            </div>
          </div>

          {/* Babak LOP (Burn) Analysis */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
              <Flame className="w-4 h-4 text-amber-500" />
              Kalkulasi Regulasi Babak "LOP" (Tembak Rumah)
            </div>
            
            <p className="text-xs text-stone-300 leading-relaxed">
              Sesuai Bagian 4 Buku Panduan Teknis, biji dikeluarkan dari Induk untuk mengisi kembali lubang-lubang kecil (masing-masing {seedsPerHole} biji):
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
                <span className="text-stone-300">{playerAName}:</span>
                <span className="font-semibold text-amber-200">
                  {lopResult.playerABurnedHoles.length > 0 ? (
                    <span className="text-orange-400">
                      {lopResult.playerABurnedHoles.length} Lubang Terbakar (LOP: {lopResult.playerABurnedHoles.join(', ')})
                    </span>
                  ) : (
                    <span className="text-emerald-400">Semua 7 Lubang Terisi Penuh</span>
                  )}
                  {lopResult.playerAExtraSeeds > 0 && ` + ${lopResult.playerAExtraSeeds} Biji di Induk`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
                <span className="text-stone-300">{playerBName}:</span>
                <span className="font-semibold text-amber-200">
                  {lopResult.playerBBurnedHoles.length > 0 ? (
                    <span className="text-orange-400">
                      {lopResult.playerBBurnedHoles.length} Lubang Terbakar (LOP: {lopResult.playerBBurnedHoles.join(', ')})
                    </span>
                  ) : (
                    <span className="text-emerald-400">Semua 7 Lubang Terisi Penuh</span>
                  )}
                  {lopResult.playerBExtraSeeds > 0 && ` + ${lopResult.playerBExtraSeeds} Biji di Induk`}
                </span>
              </div>
            </div>

            {lopResult.isGameOver ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/50 text-xs text-emerald-300 font-bold text-center">
                Pertandingan Berakhir! {lopResult.winner === 'A' ? playerAName : playerBName} memenangkan pertandingan seutuhnya!
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 italic">
                Lubang yang terbakar (LOP) akan ditutup dan dilewati saat membagikan biji pada babak berikutnya.
              </p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800 bg-stone-950/70">
          <button
            onClick={onRestartMatch}
            className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Mulai Ulang Pertandingan
          </button>

          {!lopResult.isGameOver && (
            <button
              onClick={onContinueNextLopRound}
              className="px-5 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              Lanjut Babak {roundNumber + 1} (Babak LOP)
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
