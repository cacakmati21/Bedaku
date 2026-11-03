import { BoardState, HoleState, PlayerId, MoveStep, GameSettings, AIDifficulty, RotationDirection } from '../types/badaku';

export const TOTAL_SMALL_HOLES_PER_SIDE = 7;

// Create initial board state
export function createInitialBoard(seedsPerHole: number = 7): BoardState {
  const holesA: HoleState[] = Array.from({ length: TOTAL_SMALL_HOLES_PER_SIDE }, (_, i) => ({
    id: `A${i + 1}`,
    player: 'A',
    index: i,
    isInduk: false,
    seeds: seedsPerHole,
    isLop: false,
  }));

  const holesB: HoleState[] = Array.from({ length: TOTAL_SMALL_HOLES_PER_SIDE }, (_, i) => ({
    id: `B${i + 1}`,
    player: 'B',
    index: i,
    isInduk: false,
    seeds: seedsPerHole,
    isLop: false,
  }));

  const indukA: HoleState = {
    id: 'indukA',
    player: 'A',
    index: -1,
    isInduk: true,
    seeds: 0,
    isLop: false,
  };

  const indukB: HoleState = {
    id: 'indukB',
    player: 'B',
    index: -1,
    isInduk: true,
    seeds: 0,
    isLop: false,
  };

  return { holesA, holesB, indukA, indukB };
}

// Deep clone board state
export function cloneBoard(board: BoardState): BoardState {
  return {
    holesA: board.holesA.map(h => ({ ...h })),
    holesB: board.holesB.map(h => ({ ...h })),
    indukA: { ...board.indukA },
    indukB: { ...board.indukB },
  };
}

// Get the ordered sequence of hole IDs for the circular path
// Searah Jarum Jam (Clockwise) path (Standard Buku Panduan Teknis):
// Top row (B): Left to Right (B1 -> B2 -> B3 -> B4 -> B5 -> B6 -> B7)
// Right: Induk A
// Bottom row (A): Right to Left (A7 -> A6 -> A5 -> A4 -> A3 -> A2 -> A1)
// Left: Induk B
export function getTrackSequence(direction: RotationDirection = 'clockwise'): string[] {
  if (direction === 'counter_clockwise') {
    return [
      'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
      'indukA',
      'B7', 'B6', 'B5', 'B4', 'B3', 'B2', 'B1',
      'indukB',
    ];
  }
  return [
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
    'indukA',
    'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1',
    'indukB',
  ];
}

// Helper to find hole by ID in the board
export function getHoleById(board: BoardState, id: string): HoleState | null {
  if (id === 'indukA') return board.indukA;
  if (id === 'indukB') return board.indukB;
  if (id.startsWith('A')) {
    const idx = parseInt(id.substring(1), 10) - 1;
    return board.holesA[idx] || null;
  }
  if (id.startsWith('B')) {
    const idx = parseInt(id.substring(1), 10) - 1;
    return board.holesB[idx] || null;
  }
  return null;
}

// Set seeds for a hole by ID
export function setHoleSeeds(board: BoardState, id: string, seeds: number) {
  const hole = getHoleById(board, id);
  if (hole) {
    hole.seeds = seeds;
  }
}

// Get the directly opposite hole ID
// A1 <-> B1, A2 <-> B2, A3 <-> B3, A4 <-> B4, A5 <-> B5, A6 <-> B6, A7 <-> B7
export function getOppositeHoleId(holeId: string): string | null {
  if (holeId.startsWith('A')) {
    const num = holeId.substring(1);
    return `B${num}`;
  }
  if (holeId.startsWith('B')) {
    const num = holeId.substring(1);
    return `A${num}`;
  }
  return null;
}

// Check if player has any valid moves
export function hasValidMoves(board: BoardState, player: PlayerId): boolean {
  const holes = player === 'A' ? board.holesA : board.holesB;
  return holes.some(h => !h.isLop && h.seeds > 0);
}

// Check if entire round is finished (all small holes are empty or neither player can move)
export function isRoundFinished(board: BoardState): boolean {
  const totalSmallSeeds = 
    board.holesA.reduce((sum, h) => sum + h.seeds, 0) +
    board.holesB.reduce((sum, h) => sum + h.seeds, 0);
  return totalSmallSeeds === 0 || (!hasValidMoves(board, 'A') && !hasValidMoves(board, 'B'));
}

// Calculate the next step in the loop, skipping opponent's Induk and LOP holes
export function getNextHoleId(
  currentHoleId: string,
  player: PlayerId,
  board: BoardState,
  direction: RotationDirection = 'clockwise'
): string {
  const track = getTrackSequence(direction);
  const currentIdx = track.indexOf(currentHoleId);
  if (currentIdx === -1) return track[0];

  let nextIdx = (currentIdx + 1) % track.length;
  let nextId = track[nextIdx];

  // While nextId is invalid (opponent's induk OR burned lop hole), keep advancing
  while (
    (nextId === 'indukA' && player === 'B') ||
    (nextId === 'indukB' && player === 'A') ||
    (getHoleById(board, nextId)?.isLop)
  ) {
    nextIdx = (nextIdx + 1) % track.length;
    nextId = track[nextIdx];
  }

  return nextId;
}

export interface SimulationResult {
  steps: MoveStep[];
  finalBoard: BoardState;
  finalEvent: 'jalan_lagi' | 'nembak' | 'mati_lawan' | 'mati_kosong_sendiri' | 'no_moves';
  capturedSeeds: number;
  capturedOppositeId?: string;
  lastHoleId: string;
}

// Simulate full turn execution (with relay scooping until player stops / mati / jalan lagi)
export function simulateFullTurn(
  initialBoard: BoardState,
  startHoleId: string,
  player: PlayerId,
  direction: RotationDirection = 'clockwise'
): SimulationResult {
  const board = cloneBoard(initialBoard);
  const startHole = getHoleById(board, startHoleId);

  if (!startHole || startHole.player !== player || startHole.isInduk || startHole.isLop || startHole.seeds === 0) {
    return {
      steps: [],
      finalBoard: board,
      finalEvent: 'no_moves',
      capturedSeeds: 0,
      lastHoleId: startHoleId,
    };
  }

  const steps: MoveStep[] = [];
  let currentHand = startHole.seeds;
  startHole.seeds = 0;
  let currentHoleId = startHoleId;
  let capturedTotal = 0;
  let capturedOppositeId: string | undefined;
  let finalEvent: SimulationResult['finalEvent'] = 'mati_lawan';

  // Sowing loop
  while (true) {
    // Distribute current seeds in hand one by one
    while (currentHand > 0) {
      currentHoleId = getNextHoleId(currentHoleId, player, board, direction);
      const targetHole = getHoleById(board, currentHoleId)!;
      targetHole.seeds += 1;
      currentHand -= 1;

      const isOwnInduk = (player === 'A' && currentHoleId === 'indukA') || (player === 'B' && currentHoleId === 'indukB');
      const isOpponentInduk = (player === 'A' && currentHoleId === 'indukB') || (player === 'B' && currentHoleId === 'indukA');

      steps.push({
        targetHoleId: currentHoleId,
        seedsInHand: currentHand,
        isOwnInduk,
        isOpponentInduk,
        eventType: 'sow',
      });
    }

    // Now currentHand == 0. Check where the last seed landed:
    const landingHole = getHoleById(board, currentHoleId)!;
    const isOwnInduk = (player === 'A' && currentHoleId === 'indukA') || (player === 'B' && currentHoleId === 'indukB');

    // Case 1: Landed in OWN Induk -> Jalan Lagi!
    if (isOwnInduk) {
      finalEvent = 'jalan_lagi';
      steps[steps.length - 1].eventType = 'jalan_lagi';
      steps[steps.length - 1].details = 'Jatuh di Induk sendiri! Kesempatan Jalan Lagi.';
      break;
    }

    // Case 2: Landed in small hole that already had seeds (now has > 1 seed) -> Scoop & continue
    if (landingHole.seeds > 1) {
      currentHand = landingHole.seeds;
      landingHole.seeds = 0;
      steps.push({
        targetHoleId: currentHoleId,
        seedsInHand: currentHand,
        isOwnInduk: false,
        isOpponentInduk: false,
        eventType: 'scoop',
        details: `Mengambil seluruh ${currentHand} biji dan melanjutkan pengisian.`,
      });
      continue;
    }

    // Case 3: Landed in an EMPTY hole (now has exactly 1 seed)
    // Sub-case 3a: On OWN side -> Aturan Khusus "Nembak" (Tombok)
    if (landingHole.player === player) {
      const oppositeId = getOppositeHoleId(currentHoleId);
      const oppositeHole = oppositeId ? getHoleById(board, oppositeId) : null;

      if (oppositeHole && oppositeHole.seeds > 0 && !oppositeHole.isLop) {
        // Tembakan SAH!
        const capturedOpposite = oppositeHole.seeds;
        const totalCapture = capturedOpposite + 1; // 1 from landing hole + all from opposite
        landingHole.seeds = 0;
        oppositeHole.seeds = 0;

        const ownInduk = player === 'A' ? board.indukA : board.indukB;
        ownInduk.seeds += totalCapture;
        capturedTotal += totalCapture;
        capturedOppositeId = oppositeId || undefined;

        finalEvent = 'nembak';
        steps.push({
          targetHoleId: currentHoleId,
          seedsInHand: 0,
          isOwnInduk: false,
          isOpponentInduk: false,
          eventType: 'nembak',
          capturedSeeds: totalCapture,
          capturedOppositeId: oppositeId || undefined,
          details: `Nembak! Mengambil ${capturedOpposite} biji dari lawan (${oppositeId}) + 1 biji sendiri dimasukkan ke Induk.`,
        });
      } else {
        // Opponent's opposite hole is empty -> no capture, mati
        finalEvent = 'mati_kosong_sendiri';
        steps[steps.length - 1].eventType = 'mati_kosong_sendiri';
        steps[steps.length - 1].details = 'Biji terakhir jatuh di lubang kosong sisi sendiri, namun lubang lawan kosong. Tembakan tidak menghasilkan biji.';
      }
      break;
    }

    // Sub-case 3b: On OPPONENT'S side -> Mati
    if (landingHole.player !== player) {
      finalEvent = 'mati_lawan';
      steps[steps.length - 1].eventType = 'mati_lawan';
      steps[steps.length - 1].details = 'Biji terakhir jatuh di lubang kosong lawan. Pemain Mati, giliran berpindah.';
      break;
    }
  }

  return {
    steps,
    finalBoard: board,
    finalEvent,
    capturedSeeds: capturedTotal,
    capturedOppositeId,
    lastHoleId: currentHoleId,
  };
}

// AI Move Selector with 3 difficulty modes:
// 1. Pemula (Beginner): picks randomly or basic positive moves
// 2. Strategis (Intermediate): prioritizes Jalan Lagi (land in Induk) and high Nembak captures
// 3. Juara Daerah (Advanced/Champion): 2-step lookahead minimax heuristic evaluating net seeds gained & opponent denial
export function getBestAIMove(
  board: BoardState,
  player: PlayerId,
  difficulty: AIDifficulty,
  direction: RotationDirection = 'clockwise'
): string | null {
  const holes = player === 'A' ? board.holesA : board.holesB;
  const validHoles = holes.filter(h => !h.isLop && h.seeds > 0);
  if (validHoles.length === 0) return null;

  if (difficulty === 'pemula') {
    // 70% random, 30% first move that gets something
    if (Math.random() < 0.3) {
      return validHoles[Math.floor(Math.random() * validHoles.length)].id;
    }
  }

  const scoredMoves: { holeId: string; score: number }[] = [];

  for (const hole of validHoles) {
    const sim = simulateFullTurn(board, hole.id, player, direction);
    const ownIndukBefore = (player === 'A' ? board.indukA : board.indukB).seeds;
    const ownIndukAfter = (player === 'A' ? sim.finalBoard.indukA : sim.finalBoard.indukB).seeds;
    const netIndukGain = ownIndukAfter - ownIndukBefore;

    let score = netIndukGain * 10;

    // Bonus if grants Jalan Lagi (landed in Induk)
    if (sim.finalEvent === 'jalan_lagi') {
      score += 35;
    }

    // Bonus for high Nembak captures
    if (sim.finalEvent === 'nembak') {
      score += sim.capturedSeeds * 15 + 20;
    }

    // In 'juara' mode, evaluate defensive lookahead: what can opponent do on finalBoard?
    if (difficulty === 'juara') {
      const oppId: PlayerId = player === 'A' ? 'B' : 'A';
      const oppHoles = oppId === 'A' ? sim.finalBoard.holesA : sim.finalBoard.holesB;
      const oppValid = oppHoles.filter(h => !h.isLop && h.seeds > 0);

      let maxOppGain = 0;
      for (const opHole of oppValid) {
        const oppSim = simulateFullTurn(sim.finalBoard, opHole.id, oppId, direction);
        const oppGain = (oppId === 'A' ? oppSim.finalBoard.indukA : oppSim.finalBoard.indukB).seeds -
          (oppId === 'A' ? sim.finalBoard.indukA : sim.finalBoard.indukB).seeds;
        if (oppGain > maxOppGain) maxOppGain = oppGain;
      }

      score -= maxOppGain * 8;
    }

    scoredMoves.push({ holeId: hole.id, score });
  }

  // Sort descending by score
  scoredMoves.sort((a, b) => b.score - a.score);

  if (difficulty === 'pemula') {
    // Add small random noise to prevent perfection
    return scoredMoves[Math.floor(Math.random() * Math.min(2, scoredMoves.length))].holeId;
  }

  return scoredMoves[0]?.holeId || validHoles[0].id;
}

// Calculate preview trail for hovering a hole
export interface HolePreview {
  pathHoles: string[];
  finalHoleId: string;
  expectedEvent: 'jalan_lagi' | 'nembak' | 'mati_lawan' | 'mati_kosong_sendiri' | 'lanjut_jalan';
  potentialCapture?: number;
  potentialOppositeId?: string;
}

export function calculateHolePreview(
  board: BoardState,
  startHoleId: string,
  player: PlayerId,
  direction: RotationDirection = 'clockwise'
): HolePreview | null {
  const hole = getHoleById(board, startHoleId);
  if (!hole || hole.player !== player || hole.seeds === 0 || hole.isLop) return null;

  const sim = simulateFullTurn(board, startHoleId, player, direction);
  const pathHoles = Array.from(new Set(sim.steps.map(s => s.targetHoleId)));

  let expectedEvent: HolePreview['expectedEvent'] = 'lanjut_jalan';
  if (sim.finalEvent === 'jalan_lagi') expectedEvent = 'jalan_lagi';
  else if (sim.finalEvent === 'nembak') expectedEvent = 'nembak';
  else if (sim.finalEvent === 'mati_lawan') expectedEvent = 'mati_lawan';
  else if (sim.finalEvent === 'mati_kosong_sendiri') expectedEvent = 'mati_kosong_sendiri';

  return {
    pathHoles,
    finalHoleId: sim.lastHoleId,
    expectedEvent,
    potentialCapture: sim.capturedSeeds > 0 ? sim.capturedSeeds : undefined,
    potentialOppositeId: sim.capturedOppositeId,
  };
}

// Babak LOP (Burn) calculation for subsequent rounds:
// Each player uses seeds from their Induk to refill their 7 holes (seedsPerHole each).
// If seeds are insufficient, holes that cannot receive full quota become LOP (burned / closed).
// The remaining extra seeds stay in the Induk.
export interface LopSetupResult {
  newBoard: BoardState;
  playerABurnedHoles: string[];
  playerBBurnedHoles: string[];
  playerAExtraSeeds: number;
  playerBExtraSeeds: number;
  winner?: PlayerId;
  isGameOver: boolean;
}

export function setupLopRound(
  prevBoard: BoardState,
  seedsPerHole: number = 7
): LopSetupResult {
  const totalSeedsA = prevBoard.indukA.seeds + prevBoard.holesA.reduce((sum, h) => sum + h.seeds, 0);
  const totalSeedsB = prevBoard.indukB.seeds + prevBoard.holesB.reduce((sum, h) => sum + h.seeds, 0);

  const fillableCountA = Math.floor(totalSeedsA / seedsPerHole);
  const fillableCountB = Math.floor(totalSeedsB / seedsPerHole);

  // If a player cannot even fill 1 hole, game over!
  if (fillableCountA === 0 && fillableCountB === 0) {
    return {
      newBoard: createInitialBoard(seedsPerHole),
      playerABurnedHoles: [],
      playerBBurnedHoles: [],
      playerAExtraSeeds: 0,
      playerBExtraSeeds: 0,
      isGameOver: true,
      winner: totalSeedsA > totalSeedsB ? 'A' : totalSeedsB > totalSeedsA ? 'B' : undefined,
    };
  }

  if (fillableCountA === 0) {
    return {
      newBoard: prevBoard,
      playerABurnedHoles: prevBoard.holesA.map(h => h.id),
      playerBBurnedHoles: [],
      playerAExtraSeeds: totalSeedsA,
      playerBExtraSeeds: totalSeedsB,
      isGameOver: true,
      winner: 'B',
    };
  }

  if (fillableCountB === 0) {
    return {
      newBoard: prevBoard,
      playerABurnedHoles: [],
      playerBBurnedHoles: prevBoard.holesB.map(h => h.id),
      playerAExtraSeeds: totalSeedsA,
      playerBExtraSeeds: totalSeedsB,
      isGameOver: true,
      winner: 'A',
    };
  }

  const activeA = Math.min(fillableCountA, TOTAL_SMALL_HOLES_PER_SIDE);
  const activeB = Math.min(fillableCountB, TOTAL_SMALL_HOLES_PER_SIDE);

  const remainingA = totalSeedsA - activeA * seedsPerHole;
  const remainingB = totalSeedsB - activeB * seedsPerHole;

  const playerABurnedHoles: string[] = [];
  const playerBBurnedHoles: string[] = [];

  // In traditional Badaku, holes closest to Induk are filled first,
  // or holes 1..activeA are filled, and higher numbered holes become LOP (burned)
  const holesA: HoleState[] = Array.from({ length: TOTAL_SMALL_HOLES_PER_SIDE }, (_, i) => {
    const isLop = i >= activeA;
    if (isLop) playerABurnedHoles.push(`A${i + 1}`);
    return {
      id: `A${i + 1}`,
      player: 'A',
      index: i,
      isInduk: false,
      seeds: isLop ? 0 : seedsPerHole,
      isLop,
    };
  });

  const holesB: HoleState[] = Array.from({ length: TOTAL_SMALL_HOLES_PER_SIDE }, (_, i) => {
    const isLop = i >= activeB;
    if (isLop) playerBBurnedHoles.push(`B${i + 1}`);
    return {
      id: `B${i + 1}`,
      player: 'B',
      index: i,
      isInduk: false,
      seeds: isLop ? 0 : seedsPerHole,
      isLop,
    };
  });

  const newBoard: BoardState = {
    holesA,
    holesB,
    indukA: {
      id: 'indukA',
      player: 'A',
      index: -1,
      isInduk: true,
      seeds: remainingA,
      isLop: false,
    },
    indukB: {
      id: 'indukB',
      player: 'B',
      index: -1,
      isInduk: true,
      seeds: remainingB,
      isLop: false,
    },
  };

  return {
    newBoard,
    playerABurnedHoles,
    playerBBurnedHoles,
    playerAExtraSeeds: remainingA,
    playerBExtraSeeds: remainingB,
    isGameOver: false,
  };
}
