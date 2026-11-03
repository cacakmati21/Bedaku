import React from 'react';
import { GameSettings, AIDifficulty, RotationDirection } from '../types/badaku';
import { Settings, X, Volume2, VolumeX, Gauge, Compass, Bot } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSoundToggle = () => {
    const updated = !settings.soundEnabled;
    soundManager.enabled = updated;
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-700/40 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-600/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-display">
                Pengaturan Pertandingan
              </h2>
              <p className="text-xs text-stone-400">
                Konfigurasi Regulasi Panitia & Preferensi Audio
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

        {/* Content Form */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Seeds per hole (Terserah Panitia) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
                Biji per Lubang Kecil (Regulasi Panitia)
              </label>
              <span className="text-xs text-amber-400 font-medium">
                {settings.seedsPerHole === 7 ? 'Standar Resmi (7 Biji)' : `${settings.seedsPerHole} Biji`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 7, 9].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, seedsPerHole: count })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    settings.seedsPerHole === count
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-700/50'
                  }`}
                >
                  {count} Biji {count === 7 ? '(Resmi)' : ''}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">
              Sesuai Buku Panduan Teknis: "Jumlah Biji per Lubang Kecil: Terserah Panitia" (Standar kompetisi 7 biji).
            </p>
          </div>

          {/* Animation Speed */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              <label className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
                Kecepatan Distribusi Biji
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['santai', 'normal', 'cepat', 'instan'] as const).map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, animationSpeed: speed })}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                    settings.animationSpeed === speed
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-700/50'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <label className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
                Kecerdasan Lawan AI
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'pemula', label: 'Pemula', desc: 'Acak & santai' },
                  { id: 'strategis', label: 'Strategis', desc: 'Fokus Nembak & Induk' },
                  { id: 'juara', label: 'Juara Daerah', desc: 'Kalkulasi 2-Langkah' },
                ] as { id: AIDifficulty; label: string; desc: string }[]
              ).map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, aiDifficulty: diff.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.aiDifficulty === diff.id
                      ? 'bg-amber-600/20 text-amber-200 border-amber-500 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-700/50'
                  }`}
                >
                  <div className="font-bold text-xs">{diff.label}</div>
                  <div className="text-[10px] text-stone-400">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Circular Rotation Track Mode */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <label className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
                Arah Aliran Putaran
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'clockwise', label: 'Searah Jarum Jam', sub: 'B1→B7 → Induk A → A7→A1 → Induk B (Panduan)' },
                  { id: 'counter_clockwise', label: 'Berlawanan Jarum Jam', sub: 'A1→A7 → Induk A → B7→B1' },
                ] as { id: RotationDirection; label: string; sub: string }[]
              ).map((dir) => (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, rotationDirection: dir.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.rotationDirection === dir.id
                      ? 'bg-amber-600/20 text-amber-200 border-amber-500'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-700/50'
                  }`}
                >
                  <div className="font-bold text-xs">{dir.label}</div>
                  <div className="text-[10px] text-stone-400">{dir.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Audio Effects */}
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-stone-500" />
              )}
              <div>
                <span className="font-semibold text-xs block text-stone-200">
                  Efek Suara Kayu & Biji (Web Audio API)
                </span>
                <span className="text-[11px] text-stone-400">
                  Bunyi ketukan kayu, jatuhan biji, dan tombok
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSoundToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              {settings.soundEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-stone-800 bg-stone-950/70">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Simpan & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
