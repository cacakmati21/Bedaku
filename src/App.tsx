import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayerId,
  GameMode,
  BoardState,
  GameSettings,
  GameLogEntry,
  TournamentMatch,
  TournamentParticipant,
  GamePhase,
} from './types/badaku';
import {
  createInitialBoard,
  simulateFullTurn,
  getBestAIMove,
  calculateHolePreview,
  HolePreview,
  isRoundFinished,
  hasValidMoves,
  setupLopRound,
  getNextHoleId,
  getOppositeHoleId,
  getHoleById,
} from './utils/badakuEngine';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameLog } from './components/GameLog';
import { HandbookModal } from './components/HandbookModal';
import { SettingsModal } from './components/SettingsModal';
import { TournamentModal } from './components/TournamentModal';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { SimultaneousAduView } from './components/SimultaneousAduView';
import {
  Trophy,
  RotateCcw,
  Bot,
  User,
  Users,
  Swords,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const INITIAL_TOURNAMENT_PARTICIPANTS: TournamentParticipant[] = [
  { id: 'user', name: 'Anda (Pemain A)', title: 'Kandidat Juara', avatarSeed: 'A', isUser: true, bio: 'Pemain utama bertekad menguasai strategi Badaku.' },
  { id: 'asep', name: 'Kang Asep', title: 'Jawara Priangan', avatarSeed: 'AS', isUser: false, difficulty: 'pemula', bio: 'Spesialis permainan cepat dan tembakan agresif.' },
  { id: 'saras', name: 'Mbak Saras', title: 'Ratu Induk Yogyakarta', avatarSeed: 'SR', isUser: false, difficulty: 'strategis', bio: 'Cermat menabung biji ke rumah induk sejak awal babak.' },
  { id: 'arya', name: 'Raden Arya', title: 'Master Congklak Solo', avatarSeed: 'RA', isUser: false, difficulty: 'juara', bio: 'Pakar kalkulasi matematis dengan penguasaan ritme putaran.' },
];

export default function App() {
  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    seedsPerHole: 7, // Official technical handbook standard
    animationSpeed: 'normal',
    soundEnabled: true,
    aiDifficulty: 'strategis',
    rotationDirection: 'clockwise',
    enableAduPertama: true,
  });

  // Game Mode
  const [gameMode, setGameMode] = useState<GameMode>('vs-ai');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [phase, setPhase] = useState<GamePhase>('idle');

  // Players
  const [playerAName, setPlayerAName] = useState<string>('Pemain A');
  const [playerBName, setPlayerBName] = useState<string>('Komputer (AI)');
  const [playerBIsAI, setPlayerBIsAI] = useState<boolean>(true);

  // Board & Turns
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard(7));
  const [activePlayer, setActivePlayer] = useState<PlayerId>('A');
  const [isSowing, setIsSowing] = useState<boolean>(false);
  const [currentSowingHoleId, setCurrentSowingHoleId] = useState<string | null>(null);
  const [seedsInHand, setSeedsInHand] = useState<number>(0);
  const [preview, setPreview] = useState<HolePreview | null>(null);

  // Nembak Visual Event
  const [nembakEvent, setNembakEvent] = useState<{
    shooterId: string;
    targetId: string;
    capturedCount: number;
  } | null>(null);

  // Simultaneous Adu Pertama State
  const [aduSelectionA, setAduSelectionA] = useState<string | null>(null);
  const [aduSelectionB, setAduSelectionB] = useState<string | null>(null);
  const [aduCountdown, setAduCountdown] = useState<number | null>(null);
  const [isAduRacing, setIsAduRacing] = useState<boolean>(false);

  // Logs
  const [gameLogs, setGameLogs] = useState<GameLogEntry[]>([]);

  // Modals
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTournamentOpen, setIsTournamentOpen] = useState<boolean>(false);
  const [isRoundSummaryOpen, setIsRoundSummaryOpen] = useState<boolean>(false);

  // Tournament
  const [currentTournamentMatchIdx, setCurrentTournamentMatchIdx] = useState<number>(0);
  const [tournamentMatches, setTournamentMatches] = useState<TournamentMatch[]>([
    {
      id: 'm1',
      roundName: 'Semifinal A',
      player1: INITIAL_TOURNAMENT_PARTICIPANTS[0],
      player2: INITIAL_TOURNAMENT_PARTICIPANTS[1],
      isCurrent: true,
    },
    {
      id: 'm2',
      roundName: 'Semifinal B',
      player1: INITIAL_TOURNAMENT_PARTICIPANTS[2],
      player2: INITIAL_TOURNAMENT_PARTICIPANTS[3],
      isCurrent: false,
    },
    {
      id: 'm3',
      roundName: 'Grand Final Kejuaraan Nasional',
      player1: INITIAL_TOURNAMENT_PARTICIPANTS[0],
      player2: INITIAL_TOURNAMENT_PARTICIPANTS[2],
      isCurrent: false,
    },
  ]);
  const [isChampion, setIsChampion] = useState<boolean>(false);

  const abortSowingRef = useRef<boolean>(false);

  // Helper to add game log
  const addLog = useCallback((
    player: PlayerId,
    holeId: string,
    type: GameLogEntry['type'],
    message: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setGameLogs(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp,
        player,
        holeId,
        type,
        message,
      },
    ]);
  }, []);

  // Delay helper based on animation speed
  const getDelayMs = useCallback(() => {
    switch (settings.animationSpeed) {
      case 'santai': return 500;
      case 'cepat': return 120;
      case 'instan': return 0;
      case 'normal':
      default:
        return 280;
    }
  }, [settings.animationSpeed]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Initialize a new board/game
  const startNewGame = useCallback((seeds: number = settings.seedsPerHole, mode: GameMode = gameMode) => {
    abortSowingRef.current = true;
    setIsSowing(false);
    setCurrentSowingHoleId(null);
    setSeedsInHand(0);
    setPreview(null);
    setNembakEvent(null);
    setRoundNumber(1);

    const freshBoard = createInitialBoard(seeds);
    setBoard(freshBoard);
    setActivePlayer('A');
    setGameLogs([]);

    if (mode === 'vs-ai' || mode === 'tournament') {
      setPlayerAName('Anda (Pemain A)');
      setPlayerBName(mode === 'tournament' ? tournamentMatches[currentTournamentMatchIdx].player2.name : 'Komputer (AI)');
      setPlayerBIsAI(true);
    } else {
      setPlayerAName('Pemain A');
      setPlayerBName('Pemain B');
      setPlayerBIsAI(false);
    }

    addLog('A', 'A1', 'info', `Pertandingan dimulai dengan ${seeds} biji per lubang (Standar Panduan Teknis).`);

    if (settings.enableAduPertama) {
      setPhase('adu_pertama_selection');
      setAduSelectionA(null);
      setAduSelectionB(null);
      setAduCountdown(null);
      setIsAduRacing(false);
      addLog('A', 'A1', 'info', 'Fase Awal "Adu Pertama": Silakan pilih lubang awal untuk mulai serentak.');
    } else {
      setPhase('idle');
    }
  }, [settings.seedsPerHole, settings.enableAduPertama, gameMode, tournamentMatches, currentTournamentMatchIdx, addLog]);

  // Execute full animated sowing turn
  const executeSowMove = useCallback(async (startHoleId: string, player: PlayerId) => {
    if (isSowing) return;

    const startHole = getHoleById(board, startHoleId);
    if (!startHole || startHole.player !== player || startHole.seeds === 0 || startHole.isLop) {
      return;
    }

    setIsSowing(true);
    setPreview(null);
    abortSowingRef.current = false;

    // Simulate full move sequence
    const sim = simulateFullTurn(board, startHoleId, player, settings.rotationDirection);
    if (sim.steps.length === 0) {
      setIsSowing(false);
      return;
    }

    addLog(player, startHoleId, 'start', `${player === 'A' ? playerAName : playerBName} mengambil seluruh ${startHole.seeds} biji dari ${startHoleId}.`);
    soundManager.playScoop();

    // Copy working board
    let currentBoard = {
      holesA: board.holesA.map(h => ({ ...h })),
      holesB: board.holesB.map(h => ({ ...h })),
      indukA: { ...board.indukA },
      indukB: { ...board.indukB },
    };

    // Scoop up initial hole
    const initialHole = getHoleById(currentBoard, startHoleId)!;
    initialHole.seeds = 0;
    setBoard({ ...currentBoard });

    const delay = getDelayMs();

    // Step-by-step animation
    let lastHoleId = startHoleId;
    let stepCount = 0;

    for (let i = 0; i < sim.steps.length; i++) {
      if (abortSowingRef.current) break;

      const step = sim.steps[i];
      lastHoleId = step.targetHoleId;
      setCurrentSowingHoleId(step.targetHoleId);
      setSeedsInHand(step.seedsInHand);

      if (step.eventType === 'sow') {
        const target = getHoleById(currentBoard, step.targetHoleId)!;
        target.seeds += 1;
        setBoard({ ...currentBoard });

        if (step.isOwnInduk) {
          soundManager.playInduk();
        } else {
          soundManager.playDrop(stepCount++);
        }
      } else if (step.eventType === 'scoop') {
        // Relay scoop
        const target = getHoleById(currentBoard, step.targetHoleId)!;
        target.seeds = 0;
        setBoard({ ...currentBoard });
        soundManager.playScoop();
        addLog(player, step.targetHoleId, 'sow', `Biji terakhir jatuh di ${step.targetHoleId} yang berisi biji. Mengambil seluruh ${step.seedsInHand} biji dan lanjut menabur.`);
      }

      if (delay > 0) {
        await sleep(delay);
      }
    }

    // Resolve final event
    if (sim.finalEvent === 'jalan_lagi') {
      soundManager.playJalanLagi();
      addLog(player, lastHoleId, 'jalan_lagi', `Biji terakhir jatuh di Induk sendiri! ${player === 'A' ? playerAName : playerBName} mendapatkan kesempatan "Jalan Lagi".`);
      
      // Check if player still has valid holes on their side
      const stillHasMoves = hasValidMoves(sim.finalBoard, player);
      setBoard(sim.finalBoard);
      setIsSowing(false);
      setCurrentSowingHoleId(null);
      setSeedsInHand(0);

      if (!stillHasMoves) {
        // No more seeds on own side, must pass turn
        addLog(player, lastHoleId, 'info', `Tidak ada biji tersisa di sisi sendiri untuk Jalan Lagi. Giliran berpindah.`);
        const nextP: PlayerId = player === 'A' ? 'B' : 'A';
        setActivePlayer(nextP);
      } else {
        // Player gets another turn
        setActivePlayer(player);
      }
    } else if (sim.finalEvent === 'nembak') {
      // Nembak captured seeds!
      soundManager.playTembak();
      setNembakEvent({
        shooterId: lastHoleId,
        targetId: sim.capturedOppositeId || '',
        capturedCount: sim.capturedSeeds,
      });

      addLog(player, lastHoleId, 'nembak', `Nembak! (Tombok). Mengambil seluruh biji lawan dari ${sim.capturedOppositeId} + 1 biji sendiri dimasukkan ke Induk! Total +${sim.capturedSeeds} biji.`);
      
      setBoard(sim.finalBoard);
      setIsSowing(false);
      setCurrentSowingHoleId(null);
      setSeedsInHand(0);

      setTimeout(() => {
        setNembakEvent(null);
      }, 2500);

      // Turn ends after nembak
      const nextP: PlayerId = player === 'A' ? 'B' : 'A';
      setActivePlayer(nextP);
    } else if (sim.finalEvent === 'mati_kosong_sendiri') {
      soundManager.playMati();
      addLog(player, lastHoleId, 'mati', `Biji terakhir jatuh di lubang kosong sisi sendiri (${lastHoleId}), namun lubang lawan di hadapannya kosong. Tembakan tidak menghasilkan biji (Mati).`);
      setBoard(sim.finalBoard);
      setIsSowing(false);
      setCurrentSowingHoleId(null);
      setSeedsInHand(0);
      const nextP: PlayerId = player === 'A' ? 'B' : 'A';
      setActivePlayer(nextP);
    } else {
      // mati_lawan
      soundManager.playMati();
      addLog(player, lastHoleId, 'mati', `Biji terakhir jatuh di lubang kosong sisi lawan (${lastHoleId}). Pemain dinyatakan Mati, giliran berpindah.`);
      setBoard(sim.finalBoard);
      setIsSowing(false);
      setCurrentSowingHoleId(null);
      setSeedsInHand(0);
      const nextP: PlayerId = player === 'A' ? 'B' : 'A';
      setActivePlayer(nextP);
    }

    // Check if round finished
    if (isRoundFinished(sim.finalBoard)) {
      setTimeout(() => {
        setIsRoundSummaryOpen(true);
        soundManager.playVictory();
      }, 1000);
    }
  }, [board, isSowing, settings.rotationDirection, getDelayMs, addLog, playerAName, playerBName]);

  // Handle Player choosing a hole
  const handleSelectHole = useCallback((holeId: string) => {
    if (isSowing) return;

    if (phase === 'adu_pertama_selection') {
      // Adu pertama selection
      if (holeId.startsWith('A')) {
        setAduSelectionA(holeId);
        // If vs AI, AI automatically picks best starting hole
        if (playerBIsAI) {
          const aiChoice = getBestAIMove(board, 'B', settings.aiDifficulty, settings.rotationDirection);
          if (aiChoice) setAduSelectionB(aiChoice);
        }
      } else if (holeId.startsWith('B') && !playerBIsAI) {
        setAduSelectionB(holeId);
      }
      return;
    }

    // Normal turn
    executeSowMove(holeId, activePlayer);
  }, [isSowing, phase, playerBIsAI, board, settings.aiDifficulty, settings.rotationDirection, activePlayer, executeSowMove]);

  // Hover preview calculation
  const handleHoverHole = useCallback((holeId: string) => {
    if (isSowing || phase === 'adu_pertama_selection') return;
    const prev = calculateHolePreview(board, holeId, activePlayer, settings.rotationDirection);
    setPreview(prev);
  }, [isSowing, phase, board, activePlayer, settings.rotationDirection]);

  const handleLeaveHole = useCallback(() => {
    setPreview(null);
  }, []);

  // AI Turn triggering
  useEffect(() => {
    if (activePlayer === 'B' && playerBIsAI && !isSowing && phase === 'idle') {
      // Check if B has moves
      if (!hasValidMoves(board, 'B')) {
        if (hasValidMoves(board, 'A')) {
          addLog('B', 'B1', 'info', `${playerBName} tidak memiliki biji untuk digerakkan. Giliran kembali ke ${playerAName}.`);
          setActivePlayer('A');
        } else {
          // Both have no moves
          setIsRoundSummaryOpen(true);
        }
        return;
      }

      // AI calculates move with thoughtful pause
      const timer = setTimeout(() => {
        const bestMove = getBestAIMove(board, 'B', settings.aiDifficulty, settings.rotationDirection);
        if (bestMove) {
          executeSowMove(bestMove, 'B');
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [activePlayer, playerBIsAI, isSowing, phase, board, settings.aiDifficulty, settings.rotationDirection, playerBName, playerAName, addLog, executeSowMove]);

  // Simultaneous Adu Race Execution
  const handleStartAduRace = async () => {
    if (!aduSelectionA || !aduSelectionB) return;

    setIsAduRacing(true);
    // 3, 2, 1 Countdown
    for (let c = 3; c >= 1; c--) {
      setAduCountdown(c);
      soundManager.playDrop(c);
      await sleep(600);
    }
    setAduCountdown(0);
    soundManager.playInduk();
    await sleep(400);
    setAduCountdown(null);

    // Run simultaneous sowing race!
    // Both players sow their initial hand simultaneously
    addLog('A', aduSelectionA, 'start', `Fase Adu Pertama: Kedua pemain menabur serentak dari ${aduSelectionA} dan ${aduSelectionB}!`);

    let currentBoard = {
      holesA: board.holesA.map(h => ({ ...h })),
      holesB: board.holesB.map(h => ({ ...h })),
      indukA: { ...board.indukA },
      indukB: { ...board.indukB },
    };

    const holeA = getHoleById(currentBoard, aduSelectionA)!;
    const holeB = getHoleById(currentBoard, aduSelectionB)!;
    let handA = holeA.seeds;
    let handB = holeB.seeds;
    holeA.seeds = 0;
    holeB.seeds = 0;
    setBoard({ ...currentBoard });

    let curA = aduSelectionA;
    let curB = aduSelectionB;

    const delay = getDelayMs() || 250;

    while (handA > 0 || handB > 0) {
      if (handA > 0) {
        curA = getNextHoleId(curA, 'A', currentBoard, settings.rotationDirection);
        const targetA = getHoleById(currentBoard, curA)!;
        targetA.seeds += 1;
        handA -= 1;
      }
      if (handB > 0) {
        curB = getNextHoleId(curB, 'B', currentBoard, settings.rotationDirection);
        const targetB = getHoleById(currentBoard, curB)!;
        targetB.seeds += 1;
        handB -= 1;
      }

      setBoard({ ...currentBoard });
      soundManager.playDrop(handA + handB);
      await sleep(delay);
    }

    // Now resolve first player's continuation
    addLog('A', curA, 'info', `Adu Pertama selesai. Giliran normal dimulai dengan Pemain A.`);
    setPhase('idle');
    setIsAduRacing(false);
    setActivePlayer('A');
  };

  // Continue to Next Lop Round
  const handleContinueNextLopRound = () => {
    setIsRoundSummaryOpen(false);
    const lop = setupLopRound(board, settings.seedsPerHole);
    if (lop.isGameOver) {
      addLog('A', 'A1', 'info', `Pertandingan tuntas! Pemenang adalah ${lop.winner === 'A' ? playerAName : playerBName}.`);
      return;
    }

    setBoard(lop.newBoard);
    setRoundNumber(prev => prev + 1);
    setActivePlayer(roundNumber % 2 === 0 ? 'A' : 'B');

    const burnedMsgA = lop.playerABurnedHoles.length > 0 ? `Lubang LOP ${playerAName}: ${lop.playerABurnedHoles.join(', ')}.` : '';
    const burnedMsgB = lop.playerBBurnedHoles.length > 0 ? `Lubang LOP ${playerBName}: ${lop.playerBBurnedHoles.join(', ')}.` : '';
    addLog('A', 'A1', 'lop', `Babak ${roundNumber + 1} (Babak LOP) dimulai. ${burnedMsgA} ${burnedMsgB}`);
  };

  // Tournament advance
  const handleAdvanceTournamentMatch = () => {
    const currentMatch = tournamentMatches[currentTournamentMatchIdx];
    const isWinnerA = board.indukA.seeds > board.indukB.seeds;

    const updatedMatches = [...tournamentMatches];
    updatedMatches[currentTournamentMatchIdx] = {
      ...currentMatch,
      winner: isWinnerA ? currentMatch.player1 : currentMatch.player2,
      score1: board.indukA.seeds,
      score2: board.indukB.seeds,
      isCurrent: false,
    };

    if (isWinnerA) {
      if (currentTournamentMatchIdx + 1 < tournamentMatches.length) {
        const nextIdx = currentTournamentMatchIdx + 1;
        updatedMatches[nextIdx].isCurrent = true;
        setTournamentMatches(updatedMatches);
        setCurrentTournamentMatchIdx(nextIdx);
        setPlayerBName(updatedMatches[nextIdx].player2.name);
        setIsRoundSummaryOpen(false);
        setIsTournamentOpen(true);
      } else {
        // Champion!
        setIsChampion(true);
        setIsRoundSummaryOpen(false);
        setIsTournamentOpen(true);
        soundManager.playVictory();
      }
    } else {
      // User lost in tournament
      setTournamentMatches(updatedMatches);
      setIsRoundSummaryOpen(false);
      setIsTournamentOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#140802] text-amber-50 flex flex-col selection:bg-amber-700 selection:text-white">
      {/* Top Header Contract */}
      <Header
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenTournament={() => setIsTournamentOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={() => {
          const updated = !settings.soundEnabled;
          soundManager.enabled = updated;
          setSettings(s => ({ ...s, soundEnabled: updated }));
        }}
        soundEnabled={settings.soundEnabled}
        onStartNewGame={() => startNewGame()}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col justify-between">
        
        {/* Game Mode Selector & Round Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 p-2 bg-stone-950/60 border border-amber-900/40 rounded-2xl">
          {/* Segmented Control Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-900 rounded-xl border border-stone-800">
            <button
              onClick={() => {
                setGameMode('vs-ai');
                setPlayerBIsAI(true);
                startNewGame(settings.seedsPerHole, 'vs-ai');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                gameMode === 'vs-ai'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Lawan Komputer (AI)
            </button>
            <button
              onClick={() => {
                setGameMode('pass-and-play');
                setPlayerBIsAI(false);
                startNewGame(settings.seedsPerHole, 'pass-and-play');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                gameMode === 'pass-and-play'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              2 Pemain Lokal
            </button>
            <button
              onClick={() => {
                setGameMode('tournament');
                setIsTournamentOpen(true);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                gameMode === 'tournament'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Turnamen Sistem Gugur
            </button>
          </div>

          {/* Babak & Match Meta Indicators */}
          <div className="flex items-center gap-3 text-xs text-amber-300/80">
            <div className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-800/40">
              <span className="text-stone-400 mr-1">Babak:</span>
              <strong className="text-amber-200 font-mono">
                {roundNumber} {roundNumber > 1 ? '(Babak LOP)' : '(Awal)'}
              </strong>
            </div>

            <div className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-800/40">
              <span className="text-stone-400 mr-1">Biji/Lubang:</span>
              <strong className="text-amber-200 font-mono">
                {settings.seedsPerHole}
              </strong>
            </div>

            <button
              onClick={() => setIsHandbookOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Buku Panduan Teknis 2026
            </button>
          </div>
        </div>

        {/* Simultaneous Adu Pertama Banner if active */}
        {phase === 'adu_pertama_selection' && (
          <SimultaneousAduView
            playerASelectedHole={aduSelectionA}
            playerBSelectedHole={aduSelectionB}
            playerAName={playerAName}
            playerBName={playerBName}
            countdown={aduCountdown}
            isRacing={isAduRacing}
            onSelectAduHole={(p, id) => {
              if (p === 'A') setAduSelectionA(id);
              else setAduSelectionB(id);
            }}
            onStartAduRace={handleStartAduRace}
            onCancelAdu={() => setPhase('idle')}
          />
        )}

        {/* Congklak / Badaku Wooden Board */}
        <Board
          board={board}
          activePlayer={activePlayer}
          isSowing={isSowing}
          currentSowingHoleId={currentSowingHoleId}
          seedsInHand={seedsInHand}
          preview={preview}
          direction={settings.rotationDirection}
          playerAName={playerAName}
          playerBName={playerBName}
          playerBIsAI={playerBIsAI}
          nembakEvent={nembakEvent}
          onSelectHole={handleSelectHole}
          onHoverHole={handleHoverHole}
          onLeaveHole={handleLeaveHole}
        />

        {/* Live Commentary & Move Log */}
        <div className="mt-4">
          <GameLog entries={gameLogs} />
        </div>

      </main>

      {/* Footer Info */}
      <footer className="mt-4 py-3 border-t border-amber-950/60 bg-stone-950/90 text-center text-xs text-stone-500">
        Badaku · Sesuai Buku Panduan Teknis Permainan Tradisional Badaku Edisi 2026 · Komite Olahraga Tradisional
      </footer>

      {/* Modals */}
      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          // If seeds per hole changed, prompt or re-init board
          if (newSettings.seedsPerHole !== settings.seedsPerHole) {
            startNewGame(newSettings.seedsPerHole);
          }
        }}
        onClose={() => setIsSettingsOpen(false)}
      />

      <TournamentModal
        isOpen={isTournamentOpen}
        matches={tournamentMatches}
        currentMatchIndex={currentTournamentMatchIdx}
        userParticipant={INITIAL_TOURNAMENT_PARTICIPANTS[0]}
        isChampion={isChampion}
        onStartCurrentMatch={() => {
          setIsTournamentOpen(false);
          setGameMode('tournament');
          setPlayerBName(tournamentMatches[currentTournamentMatchIdx].player2.name);
          setPlayerBIsAI(true);
          startNewGame(settings.seedsPerHole, 'tournament');
        }}
        onResetTournament={() => {
          setIsChampion(false);
          setCurrentTournamentMatchIdx(0);
          setTournamentMatches([
            {
              id: 'm1',
              roundName: 'Semifinal A',
              player1: INITIAL_TOURNAMENT_PARTICIPANTS[0],
              player2: INITIAL_TOURNAMENT_PARTICIPANTS[1],
              isCurrent: true,
            },
            {
              id: 'm2',
              roundName: 'Semifinal B',
              player1: INITIAL_TOURNAMENT_PARTICIPANTS[2],
              player2: INITIAL_TOURNAMENT_PARTICIPANTS[3],
              isCurrent: false,
            },
            {
              id: 'm3',
              roundName: 'Grand Final Kejuaraan Nasional',
              player1: INITIAL_TOURNAMENT_PARTICIPANTS[0],
              player2: INITIAL_TOURNAMENT_PARTICIPANTS[2],
              isCurrent: false,
            },
          ]);
        }}
        onClose={() => setIsTournamentOpen(false)}
      />

      <RoundSummaryModal
        isOpen={isRoundSummaryOpen}
        roundNumber={roundNumber}
        board={board}
        playerAName={playerAName}
        playerBName={playerBName}
        seedsPerHole={settings.seedsPerHole}
        onContinueNextLopRound={gameMode === 'tournament' ? handleAdvanceTournamentMatch : handleContinueNextLopRound}
        onRestartMatch={() => {
          setIsRoundSummaryOpen(false);
          startNewGame();
        }}
      />
    </div>
  );
}
