export type PlayerId = 'A' | 'B';

export type GameMode = 'vs-ai' | 'pass-and-play' | 'tournament' | 'adu-pertama';

export type AIDifficulty = 'pemula' | 'strategis' | 'juara';

export type GamePhase = 
  | 'idle' 
  | 'adu_pertama_selection' 
  | 'sowing' 
  | 'turn_end' 
  | 'round_over' 
  | 'match_over';

export type RotationDirection = 'clockwise' | 'counter_clockwise';

export interface HoleState {
  id: string; // 'A1'..'A7', 'B1'..'B7', 'indukA', 'indukB'
  player: PlayerId;
  index: number; // 0..6 for small holes, -1 for induk
  isInduk: boolean;
  seeds: number;
  isLop: boolean; // burned in Lop round
}

export interface BoardState {
  holesA: HoleState[]; // 7 holes
  holesB: HoleState[]; // 7 holes
  indukA: HoleState;   // Player A's Induk (Right)
  indukB: HoleState;   // Player B's Induk (Left)
}

export interface MoveStep {
  targetHoleId: string;
  seedsInHand: number;
  isOwnInduk: boolean;
  isOpponentInduk: boolean;
  eventType?: 'sow' | 'scoop' | 'nembak' | 'jalan_lagi' | 'mati_lawan' | 'mati_kosong_sendiri';
  details?: string;
  capturedSeeds?: number;
  capturedOppositeId?: string;
}

export interface GameSettings {
  seedsPerHole: number; // Default 7 (official), options: 5, 7, 9
  animationSpeed: 'santai' | 'normal' | 'cepat' | 'instan';
  soundEnabled: boolean;
  aiDifficulty: AIDifficulty;
  rotationDirection: RotationDirection; // standard (A1->A7->Induk A) or clockwise geometric
  enableAduPertama: boolean;
}

export interface GameLogEntry {
  id: string;
  timestamp: string;
  player: PlayerId;
  holeId: string;
  type: 'start' | 'sow' | 'nembak' | 'jalan_lagi' | 'mati' | 'lop' | 'info';
  message: string;
  highlightHoles?: string[];
}

export interface TournamentMatch {
  id: string;
  roundName: string;
  player1: TournamentParticipant;
  player2: TournamentParticipant;
  winner?: TournamentParticipant;
  score1?: number;
  score2?: number;
  isCurrent: boolean;
}

export interface TournamentParticipant {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  isUser: boolean;
  difficulty?: AIDifficulty;
  bio: string;
}
