import React from 'react';
import { TournamentMatch, TournamentParticipant } from '../types/badaku';
import { Trophy, Swords, X, Check, Award, ChevronRight } from 'lucide-react';

interface TournamentModalProps {
  isOpen: boolean;
  matches: TournamentMatch[];
  currentMatchIndex: number;
  userParticipant: TournamentParticipant;
  isChampion: boolean;
  onStartCurrentMatch: () => void;
  onResetTournament: () => void;
  onClose: () => void;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({
  isOpen,
  matches,
  currentMatchIndex,
  isChampion,
  onStartCurrentMatch,
  onResetTournament,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentMatch = matches[currentMatchIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-stone-900 border border-amber-600/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-display">
                Turnamen Badaku Nasional 2026
              </h2>
              <p className="text-xs text-stone-400">
                Sistem Gugur (Knockout) · Komite Olahraga Tradisional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Champion Banner if won */}
          {isChampion && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-stone-950 shadow-xl text-center space-y-2 border-2 border-yellow-200">
              <Award className="w-12 h-12 mx-auto text-stone-950 animate-bounce" />
              <h3 className="text-2xl font-extrabold uppercase font-display tracking-wide">
                Selamat! Anda Juara Nasional Badaku 2026!
              </h3>
              <p className="text-sm font-medium text-stone-900 max-w-lg mx-auto">
                Anda berhasil mengalahkan seluruh jawara daerah dengan strategi matematis dan penguasaan teknik "Nembak" yang sempurna.
              </p>
              <button
                onClick={onResetTournament}
                className="mt-3 px-6 py-2 bg-stone-950 text-amber-300 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-stone-900 transition-all cursor-pointer shadow-md"
              >
                Mulai Turnamen Baru
              </button>
            </div>
          )}

          {/* Current Active Match Card */}
          {currentMatch && !isChampion && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-stone-950 border-2 border-amber-500/50 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {currentMatch.roundName}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Pertandingan Penentu
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Player 1 (User) */}
                <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/30 border border-amber-500 flex items-center justify-center font-bold text-amber-300 text-sm">
                    {currentMatch.player1.avatarSeed}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 text-sm">
                      {currentMatch.player1.name}
                    </h4>
                    <p className="text-[11px] text-amber-400/80">
                      {currentMatch.player1.title}
                    </p>
                  </div>
                </div>

                {/* VS Center */}
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <Swords className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-xs font-mono font-bold text-stone-400">
                    ADU STRATEGI
                  </span>
                </div>

                {/* Player 2 (Opponent) */}
                <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-900/40 border border-rose-500 flex items-center justify-center font-bold text-rose-300 text-sm">
                    {currentMatch.player2.avatarSeed}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 text-sm">
                      {currentMatch.player2.name}
                    </h4>
                    <p className="text-[11px] text-rose-400/80">
                      {currentMatch.player2.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Opponent bio */}
              <div className="mt-4 p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs text-stone-400 flex items-center justify-between">
                <div>
                  <span className="text-stone-300 font-medium">Karakter Lawan: </span>
                  {currentMatch.player2.bio}
                </div>
                <button
                  onClick={onStartCurrentMatch}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shrink-0 ml-4 cursor-pointer"
                >
                  Masuk Meja Pertandingan
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tournament Bracket Stages */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Bagan Pertandingan Sistem Gugur
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {matches.map((m, idx) => {
                const isPast = !!m.winner;
                const isCurrent = idx === currentMatchIndex;
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                        : isPast
                        ? 'bg-stone-950/60 border-stone-800 opacity-90'
                        : 'bg-stone-950/30 border-stone-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                      <span className="text-amber-400/90 font-bold">{m.roundName}</span>
                      {isPast ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Selesai
                        </span>
                      ) : isCurrent ? (
                        <span className="text-amber-300 font-bold animate-pulse">
                          Sedang Berjalan
                        </span>
                      ) : (
                        <span className="text-stone-500">Menunggu</span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {/* P1 */}
                      <div className={`p-1.5 rounded flex items-center justify-between ${
                        m.winner?.id === m.player1.id ? 'bg-amber-950/60 font-bold text-amber-200 border border-amber-700/40' : 'text-stone-300'
                      }`}>
                        <span>{m.player1.name}</span>
                        {m.score1 !== undefined && (
                          <span className="font-mono text-stone-400">{m.score1} biji</span>
                        )}
                      </div>

                      {/* P2 */}
                      <div className={`p-1.5 rounded flex items-center justify-between ${
                        m.winner?.id === m.player2.id ? 'bg-amber-950/60 font-bold text-amber-200 border border-amber-700/40' : 'text-stone-300'
                      }`}>
                        <span>{m.player2.name}</span>
                        {m.score2 !== undefined && (
                          <span className="font-mono text-stone-400">{m.score2} biji</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950/70 text-xs">
          <span className="text-stone-500">
            Sistem gugur: pemenang babak lanjut ke babak selanjutnya.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
