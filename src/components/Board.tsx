import React from 'react';
import { BoardState, PlayerId, RotationDirection } from '../types/badaku';
import { HoleComponent } from './HoleComponent';
import { HolePreview } from '../utils/badakuEngine';
import { ArrowRight, ArrowLeft, Sparkles, User, Bot } from 'lucide-react';

interface BoardProps {
  board: BoardState;
  activePlayer: PlayerId;
  isSowing: boolean;
  currentSowingHoleId: string | null;
  seedsInHand: number;
  preview: HolePreview | null;
  direction: RotationDirection;
  playerAName: string;
  playerBName: string;
  playerBIsAI: boolean;
  nembakEvent: {
    shooterId: string;
    targetId: string;
    capturedCount: number;
  } | null;
  onSelectHole: (holeId: string) => void;
  onHoverHole: (holeId: string) => void;
  onLeaveHole: () => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  activePlayer,
  isSowing,
  currentSowingHoleId,
  seedsInHand,
  preview,
  direction,
  playerAName,
  playerBName,
  playerBIsAI,
  nembakEvent,
  onSelectHole,
  onHoverHole,
  onLeaveHole,
}) => {
  // Check which holes are clickable
  const isHoleClickable = (holeId: string, player: PlayerId, seeds: number, isLop: boolean) => {
    if (isSowing) return false;
    if (activePlayer !== player) return false;
    if (player === 'B' && playerBIsAI) return false;
    if (isLop || seeds === 0) return false;
    return true;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-2 select-none">
      {/* Floating Hand Sowing Overlay */}
      {isSowing && currentSowingHoleId && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/90 text-amber-100 border border-amber-400 shadow-xl backdrop-blur-xs animate-bounce">
          <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
            Tangan Membawa:
          </span>
          <span className="text-sm font-mono font-bold text-white tabular-nums">
            {seedsInHand} Biji
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
        </div>
      )}

      {/* Nembak (Tombok) Banner notification */}
      {nembakEvent && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-2xl border-2 border-yellow-300 flex items-center gap-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-yellow-200" />
          <div className="text-center">
            <h4 className="text-lg font-extrabold tracking-wide uppercase font-display">
              Nembak! (Tombok)
            </h4>
            <p className="text-xs text-yellow-100 font-medium">
              Mengambil {nembakEvent.capturedCount} biji dari lawan ke Induk!
            </p>
          </div>
        </div>
      )}

      {/* Main Wooden Congklak Board Container */}
      <div className="relative p-4 sm:p-6 md:p-8 rounded-[40px] md:rounded-[55px] wood-board-pattern border-4 border-[#2b1002] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-amber-500/20">
        {/* Subtle Carved Wood Board Trim & Grooves */}
        <div className="absolute inset-2 md:inset-3 rounded-[35px] md:rounded-[48px] border border-amber-600/20 pointer-events-none" />

        {/* Board Header Bar: Player B info & Direction indicator */}
        <div className="flex items-center justify-between mb-4 px-2 md:px-4 text-xs font-semibold text-amber-200/80">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${activePlayer === 'B' ? 'bg-amber-600 text-white shadow-md' : 'bg-amber-950/60 text-amber-400'}`}>
              {playerBIsAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold text-amber-200">{playerBName}</span>
              <span className="text-[11px] text-amber-400/60 block">Sisi B (B1 - B7)</span>
            </div>
            {activePlayer === 'B' && !isSowing && (
              <span className="text-[11px] font-bold text-amber-300 ml-2 animate-pulse">
                • Giliran Main
              </span>
            )}
          </div>

          {/* Directional Path Cue */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-[11px] text-amber-300">
            <span className="font-bold text-amber-200">Arah: Searah Jarum Jam</span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400/90 font-mono">
              (B1➔B7 ➔ Induk A ➔ A7➔A1 ➔ Induk B)
            </span>
          </div>
        </div>

        {/* The 14 Small Holes + 2 Induks Layout */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-5">
          {/* Left Storehouse: INDUK B (Player B) */}
          <div className="flex flex-col items-center">
            <HoleComponent
              hole={board.indukB}
              label="Induk B"
              isClickable={false}
              isActiveSowing={currentSowingHoleId === 'indukB'}
              isInPreview={preview?.finalHoleId === 'indukB'}
              previewType={preview?.finalHoleId === 'indukB' ? preview.expectedEvent : undefined}
            />
          </div>

          {/* Center Field: Two rows of 7 small holes */}
          <div className="flex-1 flex flex-col justify-between gap-6 md:gap-8 py-2">
            {/* Top Row Guide Indicator */}
            <div className="flex items-center justify-between px-2 text-[10px] text-amber-400/60 font-mono">
              <span>B1</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                Aliran Sisi B <ArrowRight className="w-3 h-3 text-amber-400 animate-pulse" />
              </span>
              <span>B7 ➔ Induk A</span>
            </div>

            {/* Top Row: Sisi Pemain B (B1 to B7) */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-3">
              {board.holesB.map((hole) => {
                const clickable = isHoleClickable(hole.id, 'B', hole.seeds, hole.isLop);
                const isCurrent = currentSowingHoleId === hole.id;
                const inPrev = preview?.pathHoles.includes(hole.id) ?? false;
                const isFinalInPrev = preview?.finalHoleId === hole.id;
                const isNembakTgt = nembakEvent?.targetId === hole.id || (preview?.potentialOppositeId === hole.id);

                return (
                  <HoleComponent
                    key={hole.id}
                    hole={hole}
                    label={hole.id}
                    isClickable={clickable}
                    isActiveSowing={isCurrent}
                    isInPreview={inPrev}
                    isNembakTarget={isNembakTgt}
                    previewType={isFinalInPrev ? preview?.expectedEvent : undefined}
                    onClick={() => clickable && onSelectHole(hole.id)}
                    onMouseEnter={() => clickable && onHoverHole(hole.id)}
                    onMouseLeave={() => clickable && onLeaveHole()}
                  />
                );
              })}
            </div>

            {/* Middle decorative track separator with directional arrows */}
            <div className="relative flex items-center justify-center my-[-8px]">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
              <div className="absolute flex items-center justify-between w-4/5 px-6 pointer-events-none text-amber-400/40">
                <ArrowLeft className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[10px] tracking-widest font-mono uppercase text-amber-300/80 font-bold bg-stone-950/80 px-3 py-0.5 rounded-full border border-amber-800/40">
                  PUTARAN SEARAH JARUM JAM
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Bottom Row Guide Indicator */}
            <div className="flex items-center justify-between px-2 text-[10px] text-amber-400/60 font-mono">
              <span>Induk B 🡄 A1</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <ArrowLeft className="w-3 h-3 text-amber-400 animate-pulse" /> Aliran Sisi A
              </span>
              <span>A7</span>
            </div>

            {/* Bottom Row: Sisi Pemain A (A1 to A7) */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-3">
              {board.holesA.map((hole) => {
                const clickable = isHoleClickable(hole.id, 'A', hole.seeds, hole.isLop);
                const isCurrent = currentSowingHoleId === hole.id;
                const inPrev = preview?.pathHoles.includes(hole.id) ?? false;
                const isFinalInPrev = preview?.finalHoleId === hole.id;
                const isNembakTgt = nembakEvent?.targetId === hole.id || (preview?.potentialOppositeId === hole.id);

                return (
                  <HoleComponent
                    key={hole.id}
                    hole={hole}
                    label={hole.id}
                    isClickable={clickable}
                    isActiveSowing={isCurrent}
                    isInPreview={inPrev}
                    isNembakTarget={isNembakTgt}
                    previewType={isFinalInPrev ? preview?.expectedEvent : undefined}
                    onClick={() => clickable && onSelectHole(hole.id)}
                    onMouseEnter={() => clickable && onHoverHole(hole.id)}
                    onMouseLeave={() => clickable && onLeaveHole()}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Storehouse: INDUK A (Player A) */}
          <div className="flex flex-col items-center">
            <HoleComponent
              hole={board.indukA}
              label="Induk A"
              isClickable={false}
              isActiveSowing={currentSowingHoleId === 'indukA'}
              isInPreview={preview?.finalHoleId === 'indukA'}
              previewType={preview?.finalHoleId === 'indukA' ? preview.expectedEvent : undefined}
            />
          </div>
        </div>

        {/* Board Footer Bar: Player A info & active status */}
        <div className="flex items-center justify-between mt-4 px-2 md:px-4 text-xs font-semibold text-amber-200/80">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${activePlayer === 'A' ? 'bg-amber-600 text-white shadow-md' : 'bg-amber-950/60 text-amber-400'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-200">{playerAName}</span>
              <span className="text-[11px] text-amber-400/60 block">Sisi A (A1 - A7)</span>
            </div>
            {activePlayer === 'A' && !isSowing && (
              <span className="text-[11px] font-bold text-amber-300 ml-2 animate-pulse">
                • Giliran Anda (Pilih Lubang)
              </span>
            )}
          </div>

          {/* Helper cue for user */}
          <div className="text-right text-[11px] text-amber-400/70">
            {isSowing ? (
              <span className="text-amber-300 font-medium">Biji sedang disebarkan...</span>
            ) : activePlayer === 'A' ? (
              <span>Klik salah satu lubang A1-A7 untuk menabur</span>
            ) : (
              <span>Menunggu giliran {playerBName}...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
