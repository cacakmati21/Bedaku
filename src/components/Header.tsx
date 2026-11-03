import React from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  onOpenHandbook: () => void;
  onOpenTournament: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onStartNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHandbook,
  onOpenTournament,
  onOpenSettings,
  onToggleSound,
  soundEnabled,
  onStartNewGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/85 backdrop-blur-md border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold tracking-tight text-amber-200 font-display whitespace-nowrap shrink-0">
            Badaku 2026
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={onStartNewGame}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Papan Permainan
          </button>
          <button
            onClick={onOpenHandbook}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-amber-400"
          >
            Buku Panduan Teknis
          </button>
          <button
            onClick={onOpenTournament}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Turnamen Gugur
          </button>
          <button
            onClick={onOpenSettings}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Regulasi Panitia
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-700/50 transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            title={soundEnabled ? 'Suara Aktif' : 'Suara Mati'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-700/50 transition-colors cursor-pointer"
            aria-label="Pengaturan"
            title="Pengaturan Permainan"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onStartNewGame}
            className="px-4 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
          >
            Mulai Babak Baru
          </button>
        </div>

      </div>
    </header>
  );
};
