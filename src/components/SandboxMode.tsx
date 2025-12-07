import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import heroSword from "@/assets/hero-sword.png";
import heroBow from "@/assets/hero-bow.png";
import heroStaff from "@/assets/hero-staff.png";
import heroAxe from "@/assets/hero-axe.png";
import heroGoku from "@/assets/hero-goku.png";
import heroSonic from "@/assets/hero-sonic.png";
import heroSukuna from "@/assets/hero-sukuna.png";
import heroLuffy from "@/assets/hero-luffy.png";
import heroLuffyGear2 from "@/assets/hero-luffy-gear2.png";
import heroLuffyGear3 from "@/assets/hero-luffy-gear3.png";
import heroLuffyGear4 from "@/assets/hero-luffy-gear4.png";
import heroLuffyGear5 from "@/assets/hero-luffy-gear5.png";
import heroYi from "@/assets/hero-yi.png";
import heroGojo from "@/assets/hero-gojo.png";
import heroMario from "@/assets/hero-mario.png";
import heroChronos from "@/assets/hero-chronos.png";
import heroGuest1337 from "@/assets/hero-guest1337.png";
import enemySkeleton from "@/assets/enemy-skeleton.png";
import enemyGoblin from "@/assets/enemy-goblin.png";
import enemyShadow from "@/assets/enemy-shadow.png";
import enemyBandit from "@/assets/enemy-bandit.png";
import enemyUraume from "@/assets/enemy-uraume.png";
import enemyFly from "@/assets/enemy-fly.png";
import enemyGuard from "@/assets/enemy-guard.png";
import enemySoul from "@/assets/enemy-soul.png";
import gokuKamehamehaSound from "/goku-kamehameha.mp3";
import {
  SukunaState,
  LuffyState,
  YiState,
  GojoState,
  MarioState,
  Guest1337State,
  ChronosState,
  calculateSukunaDamage,
  calculateGojoDamage,
  getLuffyGearBonus,
  getLuffyGearCost,
  LUFFY_SPRITES
} from "@/utils/specialCharacters";
import {
  playSukunaDesmantelar,
  playSukunaClevar,
  playSukunaFuga,
  playSukunaSantuario,
  playSukunaWorldSlash,
  playGojoAzul,
  playGojoVermelho,
  playGojoVazioRoxo,
  playGojoInfinito,
  playGojoVazioInfinito,
  playYiCounter,
  playYiInsert,
  playYiExplode,
  playMarioMushroom,
  playChronosRewind,
  playChronosTransform,
  playGuest1337Block,
  playGuest1337BlockFail,
  playSonicDodge,
  playLuffyGear,
  playNormalAttack,
  playGamblerCoinWin,
  playGamblerCoinLose
} from "@/utils/soundEffects";

import heroGambler from "@/assets/hero-gambler.png";
import { GamblerState } from "@/utils/specialCharacters";

const ENEMY_SPECIAL_TYPE_MAP: Record<string, SpecialType> = {
  'Esqueleto': 'normal',
  'Goblin': 'normal',
  'Sombra': 'normal',
  'Bandido': 'normal',
  'Uraume': 'normal',
  'Mosca': 'normal',
  'Guarda': 'normal',
  'Alma': 'normal',
  'Sukuna': 'sukuna',
  'Luffy': 'luffy',
  'Yi': 'yi',
  'Gojo': 'gojo',
  'Mario': 'mario',
  'Goku': 'goku',
  'Sonic': 'sonic',
  'Chronos': 'chronos',
  'Guest 1337': 'guest1337',
  'Gambler': 'gambler',
};

type SpecialType = 'normal' | 'sukuna' | 'luffy' | 'yi' | 'gojo' | 'mario' | 'guest1337' | 'chronos' | 'goku' | 'sonic' | 'gambler';

interface CharacterStats {
  nome: string;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  poderDeFogo: number;
  vida: number;
  arma: string;
  tipoDano: 'forca' | 'poderDeFogo';
  specialType: SpecialType;
}

interface EnemyStats {
  nome: string;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  poderDeFogo: number;
  vida: number;
  tipoDano: 'forca' | 'poderDeFogo';
  imagem: string;
  specialType: SpecialType;
}

interface Props {
  onExit: () => void;
}

type Phase = 'creation' | 'selection' | 'battle';

const ENEMY_SPRITES: Record<string, string> = {
  'Esqueleto': enemySkeleton,
  'Goblin': enemyGoblin,
  'Sombra': enemyShadow,
  'Bandido': enemyBandit,
  'Uraume': enemyUraume,
  'Mosca': enemyFly,
  'Guarda': enemyGuard,
  'Alma': enemySoul,
  'Sukuna': heroSukuna,
  'Luffy': heroLuffy,
  'Yi': heroYi,
  'Gojo': heroGojo,
  'Mario': heroMario,
  'Goku': heroGoku,
  'Sonic': heroSonic,
  'Chronos': heroChronos,
};

const WEAPON_SPRITES: Record<string, string> = {
  'Espada': heroSword,
  'Arco': heroBow,
  'Cajado': heroStaff,
  'Machado': heroAxe,
  'Goku': heroGoku,
  'Sonic': heroSonic,
  'Sukuna': heroSukuna,
  'Luffy': heroLuffy,
  'Yi': heroYi,
  'Gojo': heroGojo,
  'Mario': heroMario,
  'Guest 1337': heroGuest1337,
  'Chronos': heroChronos,
  'Gambler': heroGambler,
};

const CHARACTER_SPECIAL_TYPES: Record<string, SpecialType> = {
  'Espada': 'normal',
  'Arco': 'normal',
  'Cajado': 'normal',
  'Machado': 'normal',
  'Goku': 'goku',
  'Sonic': 'sonic',
  'Sukuna': 'sukuna',
  'Luffy': 'luffy',
  'Yi': 'yi',
  'Gojo': 'gojo',
  'Mario': 'mario',
  'Guest 1337': 'guest1337',
  'Chronos': 'chronos',
  'Gambler': 'gambler',
};

export default function SandboxMode({ onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('creation');
  const [createdCharacters, setCreatedCharacters] = useState<CharacterStats[]>([]);
  const [createdEnemies, setCreatedEnemies] = useState<EnemyStats[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterStats | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyStats | null>(null);
  
  const [characterForm, setCharacterForm] = useState<CharacterStats>({
    nome: "Herói Customizado",
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    poderDeFogo: 10,
    vida: 100,
    arma: 'Espada',
    tipoDano: 'forca',
    specialType: 'normal'
  });

  const [enemyForm, setEnemyForm] = useState<EnemyStats>({
    nome: "Inimigo Customizado",
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    poderDeFogo: 10,
    vida: 100,
    tipoDano: 'forca',
    imagem: 'Esqueleto',
    specialType: 'normal'
  });

  // Battle state
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [enemyMaxHp, setEnemyMaxHp] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [attackCooldown, setAttackCooldown] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  // Player Special character states
  const [sukunaState, setSukunaState] = useState<SukunaState>({
    desmantelarCooldown: 0, clevarCooldown: 0, fugaCooldown: 0, santuarioCooldown: 0, worldSlashCooldown: 0
  });
  const [luffyState, setLuffyState] = useState<LuffyState>({
    currentGear: 0, gearTurnsActive: 0, stunTurns: 0, gearMenuOpen: false, gear2Cooldown: 0, gear3Cooldown: 0, gear4Cooldown: 0, gear5Cooldown: 0
  });
  const [yiState, setYiState] = useState<YiState>({
    lives: 9, currentStep: 'counter', hasTalisman: false
  });
  const [gojoState, setGojoState] = useState<GojoState>({
    azulCooldown: 0, vermelhoCooldown: 0, vazioRoxoCooldown: 0, 
    infinitoCooldown: 0, infinitoTurnsActive: 0, vazioInfinitoUsed: false, enemyStunTurns: 0
  });
  const [marioState, setMarioState] = useState<MarioState>({
    mushroomCooldown: 0, mushroomTurnsActive: 0
  });
  const [guest1337State, setGuest1337State] = useState<Guest1337State>({
    nextAttackDouble: false
  });
  const [chronosState, setChronosState] = useState<ChronosState>({
    lastTurnState: null, canRewind: false, transformUsed: false
  });
  
  // Enemy Special character states (for when enemy has special type)
  const [enemySukunaState, setEnemySukunaState] = useState<SukunaState>({
    desmantelarCooldown: 0, clevarCooldown: 0, fugaCooldown: 0, santuarioCooldown: 0, worldSlashCooldown: 0
  });
  const [enemyLuffyState, setEnemyLuffyState] = useState<LuffyState>({
    currentGear: 0, gearTurnsActive: 0, stunTurns: 0, gearMenuOpen: false, gear2Cooldown: 0, gear3Cooldown: 0, gear4Cooldown: 0, gear5Cooldown: 0
  });
  const [enemyYiState, setEnemyYiState] = useState<YiState>({
    lives: 9, currentStep: 'counter', hasTalisman: false
  });
  const [enemyGojoState, setEnemyGojoState] = useState<GojoState>({
    azulCooldown: 0, vermelhoCooldown: 0, vazioRoxoCooldown: 0, 
    infinitoCooldown: 0, infinitoTurnsActive: 0, vazioInfinitoUsed: false, enemyStunTurns: 0
  });
  const [enemyMarioState, setEnemyMarioState] = useState<MarioState>({
    mushroomCooldown: 0, mushroomTurnsActive: 0
  });
  const [enemyGuest1337State, setEnemyGuest1337State] = useState<Guest1337State>({
    nextAttackDouble: false
  });
  const [enemyChronosState, setEnemyChronosState] = useState<ChronosState>({
    lastTurnState: null, canRewind: false, transformUsed: false
  });
  
  // Gambler state
  const [gamblerState, setGamblerState] = useState<GamblerState>({
    damageMultiplier: 1, coinFlipActive: false
  });
  const [enemyGamblerState, setEnemyGamblerState] = useState<GamblerState>({
    damageMultiplier: 1, coinFlipActive: false
  });
  // Goku state
  const [isKamehamehaActive, setIsKamehamehaActive] = useState(false);
  const [isEnemyKamehamehaActive, setIsEnemyKamehamehaActive] = useState(false);
  const kamehamehaAudioRef = useRef<HTMLAudioElement | null>(null);

  // Update weapon when arma changes
  useEffect(() => {
    const specialType = CHARACTER_SPECIAL_TYPES[characterForm.arma] || 'normal';
    setCharacterForm(prev => ({ ...prev, specialType }));
    
    // Yi has fixed 5 HP
    if (specialType === 'yi') {
      setCharacterForm(prev => ({ ...prev, vida: 5 }));
    }
  }, [characterForm.arma]);

  // Update enemy specialType when imagem changes
  useEffect(() => {
    const specialType = ENEMY_SPECIAL_TYPE_MAP[enemyForm.imagem] || 'normal';
    setEnemyForm(prev => ({ ...prev, specialType }));
    
    // Yi enemy has fixed 5 HP
    if (specialType === 'yi') {
      setEnemyForm(prev => ({ ...prev, vida: 5 }));
    }
  }, [enemyForm.imagem]);

  const handleCreateCharacter = () => {
    setCreatedCharacters([...createdCharacters, { ...characterForm }]);
    setCharacterForm({
      nome: "Herói Customizado",
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      poderDeFogo: 10,
      vida: 100,
      arma: 'Espada',
      tipoDano: 'forca',
      specialType: 'normal'
    });
  };

  const handleCreateEnemy = () => {
    setCreatedEnemies([...createdEnemies, { ...enemyForm }]);
    setEnemyForm({
      nome: "Inimigo Customizado",
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      poderDeFogo: 10,
      vida: 100,
      tipoDano: 'forca',
      imagem: 'Esqueleto',
      specialType: 'normal'
    });
  };

  const handleGoToSelection = () => {
    if (createdCharacters.length === 0 || createdEnemies.length === 0) {
      alert("Crie pelo menos 1 personagem e 1 inimigo!");
      return;
    }
    setPhase('selection');
  };

  const resetSpecialStates = () => {
    setSukunaState({ desmantelarCooldown: 0, clevarCooldown: 0, fugaCooldown: 0, santuarioCooldown: 0, worldSlashCooldown: 0 });
    setLuffyState({ currentGear: 0, gearTurnsActive: 0, stunTurns: 0, gearMenuOpen: false, gear2Cooldown: 0, gear3Cooldown: 0, gear4Cooldown: 0, gear5Cooldown: 0 });
    setYiState({ lives: 9, currentStep: 'counter', hasTalisman: false });
    setGojoState({ azulCooldown: 0, vermelhoCooldown: 0, vazioRoxoCooldown: 0, infinitoCooldown: 0, infinitoTurnsActive: 0, vazioInfinitoUsed: false, enemyStunTurns: 0 });
    setMarioState({ mushroomCooldown: 0, mushroomTurnsActive: 0 });
    setGuest1337State({ nextAttackDouble: false });
    setChronosState({ lastTurnState: null, canRewind: false, transformUsed: false });
    setGamblerState({ damageMultiplier: 1, coinFlipActive: false });
    // Reset enemy states
    setEnemySukunaState({ desmantelarCooldown: 0, clevarCooldown: 0, fugaCooldown: 0, santuarioCooldown: 0, worldSlashCooldown: 0 });
    setEnemyLuffyState({ currentGear: 0, gearTurnsActive: 0, stunTurns: 0, gearMenuOpen: false, gear2Cooldown: 0, gear3Cooldown: 0, gear4Cooldown: 0, gear5Cooldown: 0 });
    setEnemyYiState({ lives: 9, currentStep: 'counter', hasTalisman: false });
    setEnemyGojoState({ azulCooldown: 0, vermelhoCooldown: 0, vazioRoxoCooldown: 0, infinitoCooldown: 0, infinitoTurnsActive: 0, vazioInfinitoUsed: false, enemyStunTurns: 0 });
    setEnemyMarioState({ mushroomCooldown: 0, mushroomTurnsActive: 0 });
    setEnemyGuest1337State({ nextAttackDouble: false });
    setEnemyChronosState({ lastTurnState: null, canRewind: false, transformUsed: false });
    setEnemyGamblerState({ damageMultiplier: 1, coinFlipActive: false });
    setTurnCount(0);
  };

  const handleGoToBattle = () => {
    if (!selectedCharacter || !selectedEnemy) {
      alert("Selecione um personagem e um inimigo!");
      return;
    }
    setPlayerHp(selectedCharacter.vida);
    setPlayerMaxHp(selectedCharacter.vida);
    setEnemyHp(selectedEnemy.vida);
    setEnemyMaxHp(selectedEnemy.vida);
    setBattleLog([`⚔️ Batalha iniciada: ${selectedCharacter.nome} VS ${selectedEnemy.nome}`]);
    setIsPlayerTurn(true);
    setAttackCooldown(false);
    resetSpecialStates();
    setPhase('battle');
  };

  const getCharacterSprite = (arma: string, gear?: number) => {
    if (arma === 'Luffy' && gear && gear > 0) {
      return LUFFY_SPRITES[gear] || heroLuffy;
    }
    return WEAPON_SPRITES[arma] || heroSword;
  };

  const getEnemySprite = (imagem: string) => {
    return ENEMY_SPRITES[imagem] || enemySkeleton;
  };

  const advanceTurn = () => {
    setTurnCount(prev => prev + 1);
    
    // Reduce cooldowns
    setSukunaState(prev => ({
      desmantelarCooldown: Math.max(0, prev.desmantelarCooldown - 1),
      clevarCooldown: Math.max(0, prev.clevarCooldown - 1),
      fugaCooldown: Math.max(0, prev.fugaCooldown - 1),
      santuarioCooldown: Math.max(0, prev.santuarioCooldown - 1),
      worldSlashCooldown: Math.max(0, prev.worldSlashCooldown - 1),
    }));
    setGojoState(prev => ({
      ...prev,
      azulCooldown: Math.max(0, prev.azulCooldown - 1),
      vermelhoCooldown: Math.max(0, prev.vermelhoCooldown - 1),
      vazioRoxoCooldown: Math.max(0, prev.vazioRoxoCooldown - 1),
      infinitoCooldown: Math.max(0, prev.infinitoCooldown - 1),
      infinitoTurnsActive: Math.max(0, prev.infinitoTurnsActive - 1),
      enemyStunTurns: Math.max(0, prev.enemyStunTurns - 1),
    }));
    setMarioState(prev => ({
      mushroomCooldown: Math.max(0, prev.mushroomCooldown - 1),
      mushroomTurnsActive: Math.max(0, prev.mushroomTurnsActive - 1),
    }));
    setLuffyState(prev => ({
      ...prev,
      gear2Cooldown: Math.max(0, prev.gear2Cooldown - 1),
      gear3Cooldown: Math.max(0, prev.gear3Cooldown - 1),
      gear4Cooldown: Math.max(0, prev.gear4Cooldown - 1),
      gear5Cooldown: Math.max(0, prev.gear5Cooldown - 1),
    }));
    
    // Enemy cooldowns
    setEnemySukunaState(prev => ({
      desmantelarCooldown: Math.max(0, prev.desmantelarCooldown - 1),
      clevarCooldown: Math.max(0, prev.clevarCooldown - 1),
      fugaCooldown: Math.max(0, prev.fugaCooldown - 1),
      santuarioCooldown: Math.max(0, prev.santuarioCooldown - 1),
      worldSlashCooldown: Math.max(0, prev.worldSlashCooldown - 1),
    }));
    setEnemyGojoState(prev => ({
      ...prev,
      azulCooldown: Math.max(0, prev.azulCooldown - 1),
      vermelhoCooldown: Math.max(0, prev.vermelhoCooldown - 1),
      vazioRoxoCooldown: Math.max(0, prev.vazioRoxoCooldown - 1),
      infinitoCooldown: Math.max(0, prev.infinitoCooldown - 1),
      infinitoTurnsActive: Math.max(0, prev.infinitoTurnsActive - 1),
      enemyStunTurns: Math.max(0, prev.enemyStunTurns - 1),
    }));
    setEnemyMarioState(prev => ({
      mushroomCooldown: Math.max(0, prev.mushroomCooldown - 1),
      mushroomTurnsActive: Math.max(0, prev.mushroomTurnsActive - 1),
    }));
    setEnemyLuffyState(prev => ({
      ...prev,
      gear2Cooldown: Math.max(0, prev.gear2Cooldown - 1),
      gear3Cooldown: Math.max(0, prev.gear3Cooldown - 1),
      gear4Cooldown: Math.max(0, prev.gear4Cooldown - 1),
      gear5Cooldown: Math.max(0, prev.gear5Cooldown - 1),
    }));
  };

  const dealDamageToEnemy = (damage: number, message: string) => {
    setEnemyHp(prev => {
      const newHp = Math.max(0, prev - damage);
      setBattleLog(log => [...log, message]);
      if (newHp <= 0) {
        setBattleLog(log => [...log, `🎉 ${selectedCharacter?.nome} venceu a batalha! 🎉`]);
      }
      return newHp;
    });
  };

  const handlePlayerAttack = () => {
    if (!selectedCharacter || !selectedEnemy || !isPlayerTurn || attackCooldown || enemyHp <= 0 || playerHp <= 0) return;
    if (luffyState.stunTurns > 0) {
      setBattleLog(prev => [...prev, `😵 Você está atordoado! ${luffyState.stunTurns} turnos restantes.`]);
      setLuffyState(prev => ({ ...prev, stunTurns: prev.stunTurns - 1 }));
      advanceTurn();
      handleEnemyTurn();
      return;
    }
    
    setAttackCooldown(true);
    
    const attackStat = selectedCharacter.tipoDano === 'forca' 
      ? selectedCharacter.forca 
      : selectedCharacter.poderDeFogo;
    
    // Apply Luffy gear bonus
    let bonusForca = 0;
    if (selectedCharacter.specialType === 'luffy' && luffyState.currentGear > 0) {
      bonusForca = getLuffyGearBonus(luffyState.currentGear).forca;
    }
    
    // Apply Mario mushroom bonus
    let marioDamageBonus = 0;
    if (selectedCharacter.specialType === 'mario' && marioState.mushroomTurnsActive > 0) {
      marioDamageBonus = 15;
    }
    
    let baseDamage = Math.max(1, attackStat + bonusForca + selectedCharacter.inteligencia + Math.floor(Math.random() * 6) + 1 + marioDamageBonus);
    
    // Guest 1337 double damage
    if (selectedCharacter.specialType === 'guest1337' && guest1337State.nextAttackDouble) {
      baseDamage *= 2;
      setGuest1337State({ nextAttackDouble: false });
      setBattleLog(prev => [...prev, `💥 DANO DOBRADO!`]);
    }
    
    // Sonic always dodges - applied when enemy attacks
    // Sonic cannot be hit at all
    
    // Enemy dodge check
    let enemyDodged = false;
    if (selectedEnemy.destreza > selectedCharacter.destreza + (luffyState.currentGear > 0 ? getLuffyGearBonus(luffyState.currentGear).destreza : 0)) {
      enemyDodged = Math.random() < 0.3;
    }
    
    if (enemyDodged) {
      setBattleLog(prev => [...prev, `💨 ${selectedEnemy.nome} desviou do seu ataque!`]);
    } else {
      dealDamageToEnemy(baseDamage, `⚔️ ${selectedCharacter.nome} atacou causando ${baseDamage} de dano!`);
    }
    
    advanceTurn();
    
    setTimeout(() => {
      handleEnemyTurn();
    }, 1500);
  };

  const handleEnemyTurn = () => {
    if (!selectedCharacter || !selectedEnemy || enemyHp <= 0) {
      setAttackCooldown(false);
      setIsPlayerTurn(true);
      return;
    }
    
    // Gojo stun check
    if (gojoState.enemyStunTurns > 0) {
      setBattleLog(prev => [...prev, `😵 ${selectedEnemy.nome} está paralisado pelo Vazio Infinito!`]);
      setAttackCooldown(false);
      setIsPlayerTurn(true);
      return;
    }
    
    const attackStat = selectedEnemy.tipoDano === 'forca' 
      ? selectedEnemy.forca 
      : selectedEnemy.poderDeFogo;
    
    const enemyDamage = Math.max(1, attackStat + selectedEnemy.inteligencia + Math.floor(Math.random() * 6) + 1);
    
    // Sonic always dodges
    if (selectedCharacter.specialType === 'sonic') {
      setBattleLog(prev => [...prev, `💨 ${selectedCharacter.nome} desviou do ataque com velocidade extrema!`]);
      setAttackCooldown(false);
      setIsPlayerTurn(true);
      return;
    }
    
    // Gojo infinito check
    if (selectedCharacter.specialType === 'gojo' && gojoState.infinitoTurnsActive > 0) {
      setBattleLog(prev => [...prev, `♾️ ${selectedEnemy.nome} não consegue tocar em você! Infinito ativo!`]);
      setAttackCooldown(false);
      setIsPlayerTurn(true);
      return;
    }
    
    // Luffy Gear 5: alta chance de dodge, mas não 100%
    if (selectedCharacter.specialType === 'luffy' && luffyState.currentGear === 5) {
      if (Math.random() < 0.8) { // 80% chance de dodge
        setBattleLog(prev => [...prev, `💨 ${selectedCharacter.nome} desviou com Gear 5!`]);
        setAttackCooldown(false);
        setIsPlayerTurn(true);
        return;
      }
    }
    
    // Normal dodge check
    let playerDodged = false;
    const playerDestreza = selectedCharacter.destreza + (selectedCharacter.specialType === 'luffy' && luffyState.currentGear > 0 ? getLuffyGearBonus(luffyState.currentGear).destreza : 0);
    if (playerDestreza > selectedEnemy.destreza) {
      playerDodged = Math.random() < 0.5;
    }
    
    if (playerDodged) {
      setBattleLog(prev => [...prev, `💨 ${selectedCharacter.nome} desviou do ataque!`]);
    } else {
      // Salvar estado para Chronos poder voltar
      if (selectedCharacter.specialType === 'chronos') {
        setChronosState(prev => ({ 
          ...prev, 
          canRewind: true, 
          lastTurnState: { savedPlayerHp: playerHp, savedEnemyHp: enemyHp }
        }));
      }
      
      // Yi life system
      if (selectedCharacter.specialType === 'yi') {
        setYiState(prev => {
          const newLives = prev.lives - 1;
          setBattleLog(log => [...log, `💀 Yi perdeu uma vida! Vidas restantes: ${newLives}`]);
          if (newLives <= 0) {
            setPlayerHp(0);
            setBattleLog(log => [...log, `💀 ${selectedCharacter.nome} foi derrotado! 💀`]);
          }
          return { ...prev, lives: newLives };
        });
      } else {
        setPlayerHp(prev => {
          const newHp = Math.max(0, prev - enemyDamage);
          setBattleLog(log => [...log, `💥 ${selectedEnemy.nome} atacou causando ${enemyDamage} de dano!`]);
          if (newHp <= 0) {
            setBattleLog(log => [...log, `💀 ${selectedCharacter.nome} foi derrotado! 💀`]);
          }
          return newHp;
        });
      }
    }
    
    // Luffy gear costs
    if (selectedCharacter.specialType === 'luffy' && luffyState.currentGear > 0) {
      if (luffyState.currentGear === 2) {
        setPlayerHp(prev => Math.max(0, prev - 3));
        setBattleLog(prev => [...prev, `🔥 Gear 2 drenou 3 de vida!`]);
      } else if (luffyState.currentGear === 3) {
        setPlayerHp(prev => Math.max(0, prev - 5));
        setBattleLog(prev => [...prev, `🔥 Gear 3 drenou 5 de vida!`]);
      } else if (luffyState.currentGear === 4) {
        setLuffyState(prev => {
          const newTurns = prev.gearTurnsActive + 1;
          if (newTurns >= 3) {
            setBattleLog(log => [...log, `😵 Gear 4 acabou! 2 turnos sem ação!`]);
            return { ...prev, currentGear: 0, gearTurnsActive: 0, stunTurns: 2 };
          }
          return { ...prev, gearTurnsActive: newTurns };
        });
      } else if (luffyState.currentGear === 5) {
        setLuffyState(prev => {
          const newTurns = prev.gearTurnsActive + 1;
          if (newTurns >= 3 && enemyHp > 0) {
            setBattleLog(log => [...log, `😵 Gear 5 acabou sem derrotar o inimigo! 10 turnos sem ação!`]);
            return { ...prev, currentGear: 0, gearTurnsActive: 0, stunTurns: 10 };
          }
          return { ...prev, gearTurnsActive: newTurns };
        });
      }
    }
    
    setAttackCooldown(false);
    setIsPlayerTurn(true);
  };

  // Sukuna attacks
  const sukunaAttack = (attackType: 'desmantelar' | 'clevar' | 'fuga' | 'santuario') => {
    if (!selectedCharacter || !selectedEnemy || attackCooldown || enemyHp <= 0) return;
    
    const cooldowns = { desmantelar: 2, clevar: 4, fuga: 5, santuario: 10 };
    const stateKeys = { desmantelar: 'desmantelarCooldown', clevar: 'clevarCooldown', fuga: 'fugaCooldown', santuario: 'santuarioCooldown' } as const;
    
    if (sukunaState[stateKeys[attackType]] > 0) {
      setBattleLog(prev => [...prev, `⏰ Em cooldown: ${sukunaState[stateKeys[attackType]]} turnos`]);
      return;
    }
    
    setAttackCooldown(true);
    // Play sound effect
    if (attackType === 'desmantelar') playSukunaDesmantelar();
    else if (attackType === 'clevar') playSukunaClevar();
    else if (attackType === 'fuga') playSukunaFuga();
    else if (attackType === 'santuario') playSukunaSantuario();
    
    const damage = calculateSukunaDamage(attackType);
    const names = { desmantelar: 'DESMANTELAR', clevar: 'CLEVAR', fuga: 'FUGA', santuario: 'SANTUÁRIO MALEVOLENTE' };
    
    setSukunaState(prev => ({ ...prev, [stateKeys[attackType]]: cooldowns[attackType] }));
    dealDamageToEnemy(damage, `🔪 ${names[attackType]}! ${damage} de dano!`);
    advanceTurn();
    setIsPlayerTurn(false);
    setAttackCooldown(false);
  };

  // Gojo attacks
  const gojoAttack = (attackType: 'azul' | 'vermelho' | 'vazioRoxo' | 'infinito' | 'vazioInfinito') => {
    if (!selectedCharacter || !selectedEnemy || attackCooldown || enemyHp <= 0) return;
    
    if (attackType === 'vazioInfinito' && gojoState.vazioInfinitoUsed) {
      setBattleLog(prev => [...prev, `❌ Vazio Infinito só pode ser usado uma vez!`]);
      return;
    }
    
    const cooldowns = { azul: 5, vermelho: 5, vazioRoxo: 10, infinito: 5 };
    const stateKeys = { azul: 'azulCooldown', vermelho: 'vermelhoCooldown', vazioRoxo: 'vazioRoxoCooldown', infinito: 'infinitoCooldown' } as const;
    
    if (attackType !== 'vazioInfinito' && gojoState[stateKeys[attackType]] > 0) {
      setBattleLog(prev => [...prev, `⏰ Em cooldown: ${gojoState[stateKeys[attackType]]} turnos`]);
      return;
    }
    
    setAttackCooldown(true);
    // Play sound effect
    if (attackType === 'azul') playGojoAzul();
    else if (attackType === 'vermelho') playGojoVermelho();
    else if (attackType === 'vazioRoxo') playGojoVazioRoxo();
    else if (attackType === 'infinito') playGojoInfinito();
    else if (attackType === 'vazioInfinito') playGojoVazioInfinito();
    
    if (attackType === 'infinito') {
      setGojoState(prev => ({ ...prev, infinitoCooldown: 5, infinitoTurnsActive: 3 }));
      setBattleLog(prev => [...prev, `♾️ INFINITO ATIVADO! Invulnerável por 3 turnos!`]);
    } else if (attackType === 'vazioInfinito') {
      setGojoState(prev => ({ ...prev, vazioInfinitoUsed: true, enemyStunTurns: 2 }));
      setBattleLog(prev => [...prev, `🌀 VAZIO INFINITO! Inimigo paralisado por 2 turnos!`]);
    } else {
      const damage = calculateGojoDamage(attackType);
      const names = { azul: 'AZUL', vermelho: 'VERMELHO', vazioRoxo: 'VAZIO ROXO' };
      setGojoState(prev => ({ ...prev, [stateKeys[attackType]]: cooldowns[attackType] }));
      dealDamageToEnemy(damage, `🔵 ${names[attackType]}! ${damage} de dano!`);
    }
    
    advanceTurn();
    setIsPlayerTurn(false);
    setAttackCooldown(false);
  };

  // Yi attacks
  const yiCounter = () => {
    if (!selectedCharacter || attackCooldown) return;
    
    setAttackCooldown(true);
    playYiCounter();
    const success = Math.random() < 0.5;
    
    if (success) {
      setYiState(prev => ({ ...prev, currentStep: 'insert', hasTalisman: true }));
      setBattleLog(prev => [...prev, `🛡️ COUNTER SUCESSO! Você ganhou um talismã!`]);
      setAttackCooldown(false);
    } else {
      setBattleLog(prev => [...prev, `❌ Counter falhou! Turno perdido.`]);
      // Yi perde uma vida quando falha
      setYiState(prev => {
        const newLives = prev.lives - 1;
        setBattleLog(log => [...log, `💀 Yi perdeu uma vida! Vidas restantes: ${newLives}`]);
        if (newLives <= 0) {
          setPlayerHp(0);
          setBattleLog(log => [...log, `💀 ${selectedCharacter.nome} foi derrotado! 💀`]);
        }
        return { ...prev, lives: newLives };
      });
      advanceTurn();
      setIsPlayerTurn(false);
      setAttackCooldown(false);
    }
  };

  const yiInsert = () => {
    if (!selectedCharacter || attackCooldown || !yiState.hasTalisman) return;
    
    setAttackCooldown(true);
    playYiInsert();
    setYiState(prev => ({ ...prev, currentStep: 'explode' }));
    setBattleLog(prev => [...prev, `📜 TALISMÃ INSERIDO no inimigo!`]);
    
    advanceTurn();
    setIsPlayerTurn(false);
    setAttackCooldown(false);
  };

  const yiExplode = () => {
    if (!selectedCharacter || attackCooldown || yiState.currentStep !== 'explode') return;
    
    setAttackCooldown(true);
    playYiExplode();
    dealDamageToEnemy(500, `💥 EXPLODE! 500 de dano GARANTIDO!`);
    setYiState(prev => ({ ...prev, currentStep: 'counter', hasTalisman: false }));
    
    advanceTurn();
    setIsPlayerTurn(false);
    setAttackCooldown(false);
  };

  // Mario mushroom
  const marioMushroom = () => {
    if (marioState.mushroomCooldown > 0) {
      setBattleLog(prev => [...prev, `⏰ Cogumelo em cooldown: ${marioState.mushroomCooldown} turnos`]);
      return;
    }
    playMarioMushroom();
    setMarioState({ mushroomCooldown: 4, mushroomTurnsActive: 2 });
    setBattleLog(prev => [...prev, `🍄 COGUMELO! +15 de dano por 2 turnos!`]);
  };

  // Guest 1337 block
  const guest1337Block = () => {
    if (!selectedCharacter || attackCooldown) return;
    
    setAttackCooldown(true);
    const success = Math.random() < 0.5;
    
    if (success) {
      playGuest1337Block();
      setGuest1337State({ nextAttackDouble: true });
      setBattleLog(prev => [...prev, `🛡️ BLOQUEIO PERFEITO! Próximo ataque causará DANO DOBRADO!`]);
      setAttackCooldown(false);
    } else {
      playGuest1337BlockFail();
      setBattleLog(prev => [...prev, `❌ Bloqueio falhou! Turno perdido.`]);
      advanceTurn();
      setIsPlayerTurn(false);
      setAttackCooldown(false);
    }
  };

  // Luffy gears
  const activateGear = (gear: 2 | 3 | 4 | 5) => {
    playLuffyGear(gear);
    setLuffyState(prev => ({ ...prev, currentGear: gear, gearTurnsActive: 0, gearMenuOpen: false }));
    setBattleLog(prev => [...prev, `🔥 GEAR ${gear} ATIVADO! ${getLuffyGearCost(gear)}`]);
  };

  const deactivateGear = () => {
    const gear = luffyState.currentGear;
    const cooldowns = { 2: 3, 3: 4, 4: 5, 5: 8 };
    const cooldown = cooldowns[gear as 2|3|4|5] || 0;
    const cooldownKey = `gear${gear}Cooldown` as keyof LuffyState;
    
    setLuffyState(prev => ({ 
      ...prev, 
      currentGear: 0, 
      gearTurnsActive: 0, 
      gearMenuOpen: false,
      [cooldownKey]: cooldown
    }));
    setBattleLog(prev => [...prev, `Gear ${gear} desativado! Cooldown: ${cooldown} turnos.`]);
  };

  // Chronos abilities
  const chronosRewind = () => {
    if (!chronosState.canRewind || !chronosState.lastTurnState) {
      setBattleLog(prev => [...prev, `❌ Não é possível voltar no tempo agora!`]);
      return;
    }
    
    playChronosRewind();
    const { savedPlayerHp, savedEnemyHp } = chronosState.lastTurnState;
    setPlayerHp(savedPlayerHp);
    setEnemyHp(savedEnemyHp);
    setChronosState(prev => ({ ...prev, canRewind: false }));
    setBattleLog(prev => [...prev, `⏰ CHRONOS voltou no tempo! Dano anulado!`]);
  };
  
  const chronosTransform = () => {
    if (chronosState.transformUsed || !selectedEnemy || attackCooldown) return;
    
    setAttackCooldown(true);
    playChronosTransform();
    setChronosState(prev => ({ ...prev, transformUsed: true }));
    setEnemyHp(1);
    setEnemyMaxHp(1);
    setBattleLog(prev => [...prev, `👶 TRANSFORM! ${selectedEnemy.nome} virou um Bebê Indefeso com 1 de vida!`]);
    
    advanceTurn();
    setIsPlayerTurn(false);
    setAttackCooldown(false);
  };

  // Goku Kamehameha
  const gokuKamehameha = () => {
    if (!selectedCharacter || !selectedEnemy || attackCooldown || isKamehamehaActive) return;
    
    setAttackCooldown(true);
    setIsKamehamehaActive(true);
    
    kamehamehaAudioRef.current = new Audio(gokuKamehamehaSound);
    kamehamehaAudioRef.current.play();
    
    setBattleLog(prev => [...prev, `🔵 KAAAA-MEEEEE-HAAAA-MEEEEE-HAAAAA!`]);
    
    kamehamehaAudioRef.current.onended = () => {
      setTimeout(() => {
        setEnemyHp(0);
        setBattleLog(prev => [...prev, `💥 ${selectedEnemy.nome} foi ANIQUILADO pelo Kamehameha!`]);
        setBattleLog(prev => [...prev, `🎉 ${selectedCharacter.nome} venceu a batalha! 🎉`]);
        setIsKamehamehaActive(false);
        setAttackCooldown(false);
      }, 13000);
    };
  };

  // ============== ENEMY CONTROLLED ATTACKS ==============
  
  const dealDamageToPlayer = (damage: number, message: string) => {
    // Check player special defenses first
    if (selectedCharacter?.specialType === 'sonic') {
      playSonicDodge();
      setBattleLog(prev => [...prev, `💨 ${selectedCharacter.nome} desviou com velocidade extrema!`]);
      return;
    }
    
    if (selectedCharacter?.specialType === 'gojo' && gojoState.infinitoTurnsActive > 0) {
      setBattleLog(prev => [...prev, `♾️ Infinito bloqueou o ataque!`]);
      return;
    }
    
    if (selectedCharacter?.specialType === 'luffy' && luffyState.currentGear === 5 && Math.random() < 0.8) {
      setBattleLog(prev => [...prev, `💨 ${selectedCharacter.nome} desviou com Gear 5!`]);
      return;
    }
    
    // Yi life system
    if (selectedCharacter?.specialType === 'yi') {
      setYiState(prev => {
        const newLives = prev.lives - 1;
        setBattleLog(log => [...log, `💀 Yi perdeu uma vida! Vidas restantes: ${newLives}`]);
        if (newLives <= 0) {
          setPlayerHp(0);
          setBattleLog(log => [...log, `💀 ${selectedCharacter.nome} foi derrotado! 💀`]);
        }
        return { ...prev, lives: newLives };
      });
    } else {
      // Save state for chronos rewind
      if (selectedCharacter?.specialType === 'chronos') {
        setChronosState(prev => ({ 
          ...prev, 
          canRewind: true, 
          lastTurnState: { savedPlayerHp: playerHp, savedEnemyHp: enemyHp }
        }));
      }
      
      setPlayerHp(prev => {
        const newHp = Math.max(0, prev - damage);
        setBattleLog(log => [...log, message]);
        if (newHp <= 0) {
          setBattleLog(log => [...log, `💀 ${selectedCharacter?.nome} foi derrotado! 💀`]);
        }
        return newHp;
      });
    }
  };

  // Enemy basic attack (controlled by user)
  const enemyBasicAttack = () => {
    if (!selectedEnemy || !selectedCharacter || isPlayerTurn || attackCooldown || playerHp <= 0) return;
    
    setAttackCooldown(true);
    playNormalAttack();
    
    const attackStat = selectedEnemy.tipoDano === 'forca' 
      ? selectedEnemy.forca 
      : selectedEnemy.poderDeFogo;
    
    // Apply enemy Mario mushroom bonus
    let marioDamageBonus = 0;
    if (selectedEnemy.specialType === 'mario' && enemyMarioState.mushroomTurnsActive > 0) {
      marioDamageBonus = 15;
    }
    
    // Apply enemy Luffy gear bonus
    let bonusForca = 0;
    if (selectedEnemy.specialType === 'luffy' && enemyLuffyState.currentGear > 0) {
      bonusForca = getLuffyGearBonus(enemyLuffyState.currentGear).forca;
    }
    
    let damage = Math.max(1, attackStat + bonusForca + selectedEnemy.inteligencia + Math.floor(Math.random() * 6) + 1 + marioDamageBonus);
    
    // Enemy Guest 1337 double damage
    if (selectedEnemy.specialType === 'guest1337' && enemyGuest1337State.nextAttackDouble) {
      damage *= 2;
      setEnemyGuest1337State({ nextAttackDouble: false });
      setBattleLog(prev => [...prev, `💥 ${selectedEnemy.nome} DANO DOBRADO!`]);
    }
    
    dealDamageToPlayer(damage, `💥 ${selectedEnemy.nome} atacou causando ${damage} de dano!`);
    
    advanceTurn();
    setIsPlayerTurn(true);
    setAttackCooldown(false);
  };

  // Enemy Sukuna attacks
  const enemySukunaAttack = (attackType: 'desmantelar' | 'clevar' | 'fuga' | 'santuario') => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'sukuna' || isPlayerTurn || attackCooldown || playerHp <= 0) return;
    
    const cooldowns = { desmantelar: 2, clevar: 4, fuga: 5, santuario: 10 };
    const stateKeys = { desmantelar: 'desmantelarCooldown', clevar: 'clevarCooldown', fuga: 'fugaCooldown', santuario: 'santuarioCooldown' } as const;
    
    if (enemySukunaState[stateKeys[attackType]] > 0) {
      setBattleLog(prev => [...prev, `⏰ ${selectedEnemy.nome} em cooldown: ${enemySukunaState[stateKeys[attackType]]} turnos`]);
      return;
    }
    
    setAttackCooldown(true);
    if (attackType === 'desmantelar') playSukunaDesmantelar();
    else if (attackType === 'clevar') playSukunaClevar();
    else if (attackType === 'fuga') playSukunaFuga();
    else if (attackType === 'santuario') playSukunaSantuario();
    
    const damage = calculateSukunaDamage(attackType);
    const names = { desmantelar: 'DESMANTELAR', clevar: 'CLEVAR', fuga: 'FUGA', santuario: 'SANTUÁRIO MALEVOLENTE' };
    
    setEnemySukunaState(prev => ({ ...prev, [stateKeys[attackType]]: cooldowns[attackType] }));
    dealDamageToPlayer(damage, `🔪 ${selectedEnemy.nome} usou ${names[attackType]}! ${damage} de dano!`);
    
    advanceTurn();
    setIsPlayerTurn(true);
    setAttackCooldown(false);
  };

  // Enemy Gojo attacks
  const enemyGojoAttack = (attackType: 'azul' | 'vermelho' | 'vazioRoxo' | 'infinito' | 'vazioInfinito') => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'gojo' || isPlayerTurn || attackCooldown || playerHp <= 0) return;
    
    if (attackType === 'vazioInfinito' && enemyGojoState.vazioInfinitoUsed) {
      setBattleLog(prev => [...prev, `❌ ${selectedEnemy.nome} já usou Vazio Infinito!`]);
      return;
    }
    
    const cooldowns = { azul: 5, vermelho: 5, vazioRoxo: 10, infinito: 5 };
    const stateKeys = { azul: 'azulCooldown', vermelho: 'vermelhoCooldown', vazioRoxo: 'vazioRoxoCooldown', infinito: 'infinitoCooldown' } as const;
    
    if (attackType !== 'vazioInfinito' && enemyGojoState[stateKeys[attackType]] > 0) {
      setBattleLog(prev => [...prev, `⏰ ${selectedEnemy.nome} em cooldown: ${enemyGojoState[stateKeys[attackType]]} turnos`]);
      return;
    }
    
    setAttackCooldown(true);
    if (attackType === 'azul') playGojoAzul();
    else if (attackType === 'vermelho') playGojoVermelho();
    else if (attackType === 'vazioRoxo') playGojoVazioRoxo();
    else if (attackType === 'infinito') playGojoInfinito();
    else if (attackType === 'vazioInfinito') playGojoVazioInfinito();
    
    if (attackType === 'infinito') {
      setEnemyGojoState(prev => ({ ...prev, infinitoCooldown: 5, infinitoTurnsActive: 3 }));
      setBattleLog(prev => [...prev, `♾️ ${selectedEnemy.nome} ativou INFINITO! Invulnerável por 3 turnos!`]);
    } else if (attackType === 'vazioInfinito') {
      setEnemyGojoState(prev => ({ ...prev, vazioInfinitoUsed: true, enemyStunTurns: 2 }));
      setLuffyState(prev => ({ ...prev, stunTurns: 2 })); // Stuns the player
      setBattleLog(prev => [...prev, `🌀 ${selectedEnemy.nome} usou VAZIO INFINITO! Você está paralisado por 2 turnos!`]);
    } else {
      const damage = calculateGojoDamage(attackType);
      const names = { azul: 'AZUL', vermelho: 'VERMELHO', vazioRoxo: 'VAZIO ROXO' };
      setEnemyGojoState(prev => ({ ...prev, [stateKeys[attackType]]: cooldowns[attackType] }));
      dealDamageToPlayer(damage, `🔵 ${selectedEnemy.nome} usou ${names[attackType]}! ${damage} de dano!`);
    }
    
    advanceTurn();
    setIsPlayerTurn(true);
    setAttackCooldown(false);
  };

  // Enemy Mario mushroom
  const enemyMarioMushroom = () => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'mario' || isPlayerTurn) return;
    
    if (enemyMarioState.mushroomCooldown > 0) {
      setBattleLog(prev => [...prev, `⏰ ${selectedEnemy.nome} cogumelo em cooldown: ${enemyMarioState.mushroomCooldown} turnos`]);
      return;
    }
    playMarioMushroom();
    setEnemyMarioState({ mushroomCooldown: 4, mushroomTurnsActive: 2 });
    setBattleLog(prev => [...prev, `🍄 ${selectedEnemy.nome} comeu um COGUMELO! +15 de dano por 2 turnos!`]);
  };

  // Enemy Guest 1337 block
  const enemyGuest1337Block = () => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'guest1337' || isPlayerTurn || attackCooldown) return;
    
    setAttackCooldown(true);
    const success = Math.random() < 0.5;
    
    if (success) {
      playGuest1337Block();
      setEnemyGuest1337State({ nextAttackDouble: true });
      setBattleLog(prev => [...prev, `🛡️ ${selectedEnemy.nome} BLOQUEIO PERFEITO! Próximo ataque dobrado!`]);
      setAttackCooldown(false);
    } else {
      playGuest1337BlockFail();
      setBattleLog(prev => [...prev, `❌ ${selectedEnemy.nome} falhou no bloqueio! Turno perdido.`]);
      advanceTurn();
      setIsPlayerTurn(true);
      setAttackCooldown(false);
    }
  };

  // Enemy Luffy gears
  const enemyActivateGear = (gear: 2 | 3 | 4 | 5) => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'luffy' || isPlayerTurn) return;
    playLuffyGear(gear);
    setEnemyLuffyState(prev => ({ ...prev, currentGear: gear, gearTurnsActive: 0, gearMenuOpen: false }));
    setBattleLog(prev => [...prev, `🔥 ${selectedEnemy.nome} ativou GEAR ${gear}!`]);
  };

  const enemyDeactivateGear = () => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'luffy' || isPlayerTurn) return;
    setEnemyLuffyState(prev => ({ ...prev, currentGear: 0, gearTurnsActive: 0, gearMenuOpen: false }));
    setBattleLog(prev => [...prev, `${selectedEnemy.nome} desativou o Gear.`]);
  };

  // Enemy Goku Kamehameha
  const enemyGokuKamehameha = () => {
    if (!selectedEnemy || selectedEnemy.specialType !== 'goku' || !selectedCharacter || isPlayerTurn || attackCooldown || isEnemyKamehamehaActive) return;
    
    setAttackCooldown(true);
    setIsEnemyKamehamehaActive(true);
    
    const audio = new Audio(gokuKamehamehaSound);
    audio.play();
    
    setBattleLog(prev => [...prev, `🔵 ${selectedEnemy.nome}: KAAAA-MEEEEE-HAAAA-MEEEEE-HAAAAA!`]);
    
    audio.onended = () => {
      setTimeout(() => {
        setPlayerHp(0);
        setBattleLog(prev => [...prev, `💥 ${selectedCharacter.nome} foi ANIQUILADO pelo Kamehameha!`]);
        setBattleLog(prev => [...prev, `💀 ${selectedEnemy.nome} venceu a batalha! 💀`]);
        setIsEnemyKamehamehaActive(false);
        setAttackCooldown(false);
      }, 13000);
    };
  };

  const handleBack = () => {
    if (phase === 'creation') {
      onExit();
    } else if (phase === 'selection') {
      setPhase('creation');
    } else if (phase === 'battle') {
      setPhase('selection');
      setSelectedCharacter(null);
      setSelectedEnemy(null);
    }
  };

  const battleEnded = playerHp <= 0 || enemyHp <= 0 || (selectedCharacter?.specialType === 'yi' && yiState.lives <= 0);

  return (
    <div className="min-h-screen dungeon-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="parchment-bg border-4 border-primary rounded-sm p-6 mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-primary mb-2 text-center">🎮 MODO SANDBOX 🎮</h1>
          <p className="text-foreground text-center">
            {phase === 'creation' && 'Crie seus personagens e inimigos customizados!'}
            {phase === 'selection' && 'Selecione quem vai lutar!'}
            {phase === 'battle' && 'Batalha em progresso!'}
          </p>
        </div>

        {/* Phase 1: Creation */}
        {phase === 'creation' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Create Character */}
              <div className="parchment-bg border-4 border-blue-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">CRIAR SEU PERSONAGEM</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-foreground font-bold">Nome:</Label>
                    <Input value={characterForm.nome} onChange={(e) => setCharacterForm({ ...characterForm, nome: e.target.value })} className="bg-input border-2 border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Personagem/Aparência:</Label>
                    <Select value={characterForm.arma} onValueChange={(v) => setCharacterForm({ ...characterForm, arma: v })}>
                      <SelectTrigger className="bg-input border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Espada">Espada (Normal)</SelectItem>
                        <SelectItem value="Arco">Arco (Normal)</SelectItem>
                        <SelectItem value="Cajado">Cajado (Normal)</SelectItem>
                        <SelectItem value="Machado">Machado (Normal)</SelectItem>
                        <SelectItem value="Sukuna">Sukuna (4 ataques especiais)</SelectItem>
                        <SelectItem value="Luffy">Luffy (Sistema de Gears)</SelectItem>
                        <SelectItem value="Yi">Yi (9 vidas + Combo)</SelectItem>
                        <SelectItem value="Gojo">Gojo (Infinito + 5 ataques)</SelectItem>
                        <SelectItem value="Mario">Mario (Cogumelo +15 dano)</SelectItem>
                        <SelectItem value="Guest 1337">Guest 1337 (Bloquear + Dobrar dano)</SelectItem>
                        <SelectItem value="Chronos">Chronos (Transform)</SelectItem>
                        <SelectItem value="Goku">Goku (Kamehameha - 1 hit kill)</SelectItem>
                        <SelectItem value="Sonic">Sonic (Desvia de tudo)</SelectItem>
                        <SelectItem value="Gambler">Gambler (Moeda da sorte)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Tipo de Dano:</Label>
                    <Select value={characterForm.tipoDano} onValueChange={(v) => setCharacterForm({ ...characterForm, tipoDano: v as 'forca' | 'poderDeFogo' })}>
                      <SelectTrigger className="bg-input border-2 border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="poderDeFogo">Poder de Fogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Vida: {characterForm.specialType === 'yi' && '(Yi sempre tem 5 HP + 9 vidas)'}</Label>
                    <Input type="number" value={characterForm.vida} onChange={(e) => setCharacterForm({ ...characterForm, vida: parseInt(e.target.value) || 0 })} className="bg-input border-2 border-border" disabled={characterForm.specialType === 'yi'} />
                  </div>
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'poderDeFogo'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-foreground font-bold capitalize">
                        {stat === 'forca' ? 'Força' : stat === 'constituicao' ? 'Constituição' : stat === 'inteligencia' ? 'Inteligência' : stat === 'poderDeFogo' ? 'Poder de Fogo' : stat}:
                      </Label>
                      <Input type="number" value={characterForm[stat as keyof Omit<CharacterStats, 'nome' | 'tipoDano' | 'arma' | 'vida' | 'specialType'>]} onChange={(e) => setCharacterForm({ ...characterForm, [stat]: parseInt(e.target.value) || 0 })} className="bg-input border-2 border-border" />
                    </div>
                  ))}
                  <Button onClick={handleCreateCharacter} className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold">CRIAR PERSONAGEM</Button>
                </div>
              </div>

              {/* Create Enemy */}
              <div className="parchment-bg border-4 border-red-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-red-800 mb-4 text-center">CRIAR INIMIGO</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-foreground font-bold">Nome:</Label>
                    <Input value={enemyForm.nome} onChange={(e) => setEnemyForm({ ...enemyForm, nome: e.target.value })} className="bg-input border-2 border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Imagem/Aparência:</Label>
                    <Select value={enemyForm.imagem} onValueChange={(v) => setEnemyForm({ ...enemyForm, imagem: v })}>
                      <SelectTrigger className="bg-input border-2 border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Esqueleto">Esqueleto</SelectItem>
                        <SelectItem value="Goblin">Goblin</SelectItem>
                        <SelectItem value="Sombra">Sombra</SelectItem>
                        <SelectItem value="Bandido">Bandido</SelectItem>
                        <SelectItem value="Uraume">Uraume</SelectItem>
                        <SelectItem value="Mosca">Mosca</SelectItem>
                        <SelectItem value="Guarda">Guarda</SelectItem>
                        <SelectItem value="Alma">Alma</SelectItem>
                        <SelectItem value="Sukuna">Sukuna</SelectItem>
                        <SelectItem value="Luffy">Luffy</SelectItem>
                        <SelectItem value="Yi">Yi</SelectItem>
                        <SelectItem value="Gojo">Gojo</SelectItem>
                        <SelectItem value="Mario">Mario</SelectItem>
                        <SelectItem value="Goku">Goku</SelectItem>
                        <SelectItem value="Sonic">Sonic</SelectItem>
                        <SelectItem value="Chronos">Chronos</SelectItem>
                        <SelectItem value="Gambler">Gambler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Tipo de Dano:</Label>
                    <Select value={enemyForm.tipoDano} onValueChange={(v) => setEnemyForm({ ...enemyForm, tipoDano: v as 'forca' | 'poderDeFogo' })}>
                      <SelectTrigger className="bg-input border-2 border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="poderDeFogo">Poder de Fogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Vida:</Label>
                    <Input type="number" value={enemyForm.vida} onChange={(e) => setEnemyForm({ ...enemyForm, vida: parseInt(e.target.value) || 0 })} className="bg-input border-2 border-border" />
                  </div>
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'poderDeFogo'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-foreground font-bold capitalize">
                        {stat === 'forca' ? 'Força' : stat === 'constituicao' ? 'Constituição' : stat === 'inteligencia' ? 'Inteligência' : stat === 'poderDeFogo' ? 'Poder de Fogo' : stat}:
                      </Label>
                      <Input type="number" value={enemyForm[stat as keyof Omit<EnemyStats, 'nome' | 'tipoDano' | 'vida' | 'imagem' | 'specialType'>]} onChange={(e) => setEnemyForm({ ...enemyForm, [stat]: parseInt(e.target.value) || 0 })} className="bg-input border-2 border-border" />
                    </div>
                  ))}
                  <Button onClick={handleCreateEnemy} className="w-full bg-red-700 hover:bg-red-600 text-white font-bold">CRIAR INIMIGO</Button>
                </div>
              </div>
            </div>

            {/* Created lists */}
            {(createdCharacters.length > 0 || createdEnemies.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {createdCharacters.length > 0 && (
                  <div className="parchment-bg border-4 border-blue-700 rounded-sm p-4 shadow-xl">
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Personagens Criados:</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {createdCharacters.map((char, idx) => (
                        <div key={idx} className="bg-muted p-2 rounded-sm border border-border flex items-center gap-2">
                          <img src={getCharacterSprite(char.arma)} alt={char.nome} className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                          <span className="text-foreground text-sm">{char.nome} ({char.arma}) - Vida: {char.vida}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {createdEnemies.length > 0 && (
                  <div className="parchment-bg border-4 border-red-700 rounded-sm p-4 shadow-xl">
                    <h3 className="text-xl font-bold text-red-800 mb-2">Inimigos Criados:</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {createdEnemies.map((enemy, idx) => (
                        <div key={idx} className="bg-muted p-2 rounded-sm border border-border flex items-center gap-2">
                          <img src={getEnemySprite(enemy.imagem)} alt={enemy.nome} className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                          <span className="text-foreground text-sm">{enemy.nome} - Vida: {enemy.vida}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={handleBack} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold">⬅️ VOLTAR</Button>
              <Button onClick={handleGoToSelection} className="bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-4 font-bold">IR PARA A SELEÇÃO ➡️</Button>
            </div>
          </>
        )}

        {/* Phase 2: Selection */}
        {phase === 'selection' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="parchment-bg border-4 border-red-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-red-800 mb-4 text-center">Escolher inimigo</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {createdEnemies.map((enemy, idx) => (
                    <div key={idx} onClick={() => setSelectedEnemy(enemy)} className={`p-4 rounded-sm cursor-pointer transition-all border-2 flex items-center gap-4 ${selectedEnemy === enemy ? 'bg-red-200 border-red-600' : 'bg-muted hover:bg-muted/80 border-border'}`}>
                      <img src={getEnemySprite(enemy.imagem)} alt={enemy.nome} className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />
                      <div>
                        <p className="text-foreground font-bold">{enemy.nome}</p>
                        <p className="text-sm text-muted-foreground">Vida: {enemy.vida} | FOR: {enemy.forca} | DES: {enemy.destreza}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="parchment-bg border-4 border-blue-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">Escolher personagem</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {createdCharacters.map((char, idx) => (
                    <div key={idx} onClick={() => setSelectedCharacter(char)} className={`p-4 rounded-sm cursor-pointer transition-all border-2 flex items-center gap-4 ${selectedCharacter === char ? 'bg-blue-200 border-blue-600' : 'bg-muted hover:bg-muted/80 border-border'}`}>
                      <img src={getCharacterSprite(char.arma)} alt={char.nome} className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />
                      <div>
                        <p className="text-foreground font-bold">{char.nome} ({char.arma})</p>
                        <p className="text-sm text-muted-foreground">Vida: {char.vida} | FOR: {char.forca} | DES: {char.destreza}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={handleBack} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold">⬅️ VOLTAR</Button>
              <Button onClick={handleGoToBattle} className="bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-4 font-bold">IR PARA LUTA ⚔️</Button>
            </div>
          </>
        )}

        {/* Phase 3: Battle */}
        {phase === 'battle' && selectedCharacter && selectedEnemy && (
          <TooltipProvider>
            <div className="parchment-bg border-4 border-primary rounded-sm p-8 mb-8 shadow-xl">
              <h2 className="text-4xl font-bold text-foreground mb-6 text-center">{selectedEnemy.nome} VS {selectedCharacter.nome}</h2>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Enemy Side */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-red-800 mb-2">{selectedEnemy.nome}</h3>
                  <div className="flex justify-center mb-2">
                    <img src={getEnemySprite(selectedEnemy.imagem)} alt={selectedEnemy.nome} className="w-24 h-24 object-contain" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <div className="bg-red-100 border-2 border-red-300 rounded-sm p-4">
                    <p className="text-red-900 text-xl font-bold">HP: {enemyHp}/{enemyMaxHp}</p>
                    <div className="w-full bg-red-200 rounded-full h-4 mt-2">
                      <div className="bg-red-600 h-4 rounded-full transition-all" style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Player Side */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">{selectedCharacter.nome}</h3>
                  <div className="flex justify-center mb-2">
                    <img src={getCharacterSprite(selectedCharacter.arma, luffyState.currentGear)} alt={selectedCharacter.nome} className="w-24 h-24 object-contain" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-sm p-4">
                    {selectedCharacter.specialType === 'yi' ? (
                      <p className="text-blue-900 text-xl font-bold">Vidas: {yiState.lives} (HP: {playerHp})</p>
                    ) : (
                      <p className="text-blue-900 text-xl font-bold">HP: {playerHp}/{playerMaxHp}</p>
                    )}
                    <div className="w-full bg-blue-200 rounded-full h-4 mt-2">
                      <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${(playerHp / playerMaxHp) * 100}%` }} />
                    </div>
                    {selectedCharacter.specialType === 'luffy' && luffyState.currentGear > 0 && (
                      <p className="text-orange-600 font-bold mt-1">GEAR {luffyState.currentGear} ATIVO</p>
                    )}
                    {selectedCharacter.specialType === 'gojo' && gojoState.infinitoTurnsActive > 0 && (
                      <p className="text-purple-600 font-bold mt-1">♾️ INFINITO: {gojoState.infinitoTurnsActive} turnos</p>
                    )}
                    {selectedCharacter.specialType === 'mario' && marioState.mushroomTurnsActive > 0 && (
                      <p className="text-red-600 font-bold mt-1">🍄 +15 DANO: {marioState.mushroomTurnsActive} turnos</p>
                    )}
                    {selectedCharacter.specialType === 'guest1337' && guest1337State.nextAttackDouble && (
                      <p className="text-yellow-600 font-bold mt-1">⚡ PRÓXIMO ATAQUE: DANO DOBRADO!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Combat Buttons */}
              {!battleEnded && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {/* Normal Attack */}
                  <Button onClick={handlePlayerAttack} disabled={!isPlayerTurn || attackCooldown} className="bg-blue-700 hover:bg-blue-600 text-white font-bold">
                    ⚔️ ATACAR
                  </Button>

                  {/* Sukuna Attacks */}
                  {selectedCharacter.specialType === 'sukuna' && (
                    <>
                      <Button onClick={() => sukunaAttack('desmantelar')} disabled={!isPlayerTurn || attackCooldown || sukunaState.desmantelarCooldown > 0} className="bg-purple-700 hover:bg-purple-600 text-white font-bold">
                        DESMANTELAR {sukunaState.desmantelarCooldown > 0 && `(${sukunaState.desmantelarCooldown})`}
                      </Button>
                      <Button onClick={() => sukunaAttack('clevar')} disabled={!isPlayerTurn || attackCooldown || sukunaState.clevarCooldown > 0} className="bg-purple-700 hover:bg-purple-600 text-white font-bold">
                        CLEVAR {sukunaState.clevarCooldown > 0 && `(${sukunaState.clevarCooldown})`}
                      </Button>
                      <Button onClick={() => sukunaAttack('fuga')} disabled={!isPlayerTurn || attackCooldown || sukunaState.fugaCooldown > 0} className="bg-orange-700 hover:bg-orange-600 text-white font-bold">
                        FUGA {sukunaState.fugaCooldown > 0 && `(${sukunaState.fugaCooldown})`}
                      </Button>
                      <Button onClick={() => sukunaAttack('santuario')} disabled={!isPlayerTurn || attackCooldown || sukunaState.santuarioCooldown > 0} className="bg-red-900 hover:bg-red-800 text-white font-bold">
                        SANTUÁRIO {sukunaState.santuarioCooldown > 0 && `(${sukunaState.santuarioCooldown})`}
                      </Button>
                    </>
                  )}

                  {/* Yi Attacks */}
                  {selectedCharacter.specialType === 'yi' && (
                    <>
                      {yiState.currentStep === 'counter' && (
                        <Button onClick={yiCounter} disabled={!isPlayerTurn || attackCooldown} className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold">
                          🛡️ COUNTER
                        </Button>
                      )}
                      {yiState.currentStep === 'insert' && (
                        <Button onClick={yiInsert} disabled={!isPlayerTurn || attackCooldown} className="bg-green-700 hover:bg-green-600 text-white font-bold">
                          📜 INSERT
                        </Button>
                      )}
                      {yiState.currentStep === 'explode' && (
                        <Button onClick={yiExplode} disabled={!isPlayerTurn || attackCooldown} className="bg-red-700 hover:bg-red-600 text-white font-bold">
                          💥 EXPLODE!
                        </Button>
                      )}
                    </>
                  )}

                  {/* Gojo Attacks */}
                  {selectedCharacter.specialType === 'gojo' && (
                    <>
                      <Button onClick={() => gojoAttack('azul')} disabled={!isPlayerTurn || attackCooldown || gojoState.azulCooldown > 0} className="bg-blue-500 hover:bg-blue-400 text-white font-bold">
                        AZUL {gojoState.azulCooldown > 0 && `(${gojoState.azulCooldown})`}
                      </Button>
                      <Button onClick={() => gojoAttack('vermelho')} disabled={!isPlayerTurn || attackCooldown || gojoState.vermelhoCooldown > 0} className="bg-red-500 hover:bg-red-400 text-white font-bold">
                        VERMELHO {gojoState.vermelhoCooldown > 0 && `(${gojoState.vermelhoCooldown})`}
                      </Button>
                      <Button onClick={() => gojoAttack('vazioRoxo')} disabled={!isPlayerTurn || attackCooldown || gojoState.vazioRoxoCooldown > 0} className="bg-purple-500 hover:bg-purple-400 text-white font-bold">
                        VAZIO ROXO {gojoState.vazioRoxoCooldown > 0 && `(${gojoState.vazioRoxoCooldown})`}
                      </Button>
                      <Button onClick={() => gojoAttack('infinito')} disabled={!isPlayerTurn || attackCooldown || gojoState.infinitoCooldown > 0} className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold">
                        ♾️ INFINITO {gojoState.infinitoCooldown > 0 && `(${gojoState.infinitoCooldown})`}
                      </Button>
                      <Button onClick={() => gojoAttack('vazioInfinito')} disabled={!isPlayerTurn || attackCooldown || gojoState.vazioInfinitoUsed} className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold">
                        🌀 VAZIO INFINITO {gojoState.vazioInfinitoUsed && '(USADO)'}
                      </Button>
                    </>
                  )}

                  {/* Mario Mushroom */}
                  {selectedCharacter.specialType === 'mario' && (
                    <Button onClick={marioMushroom} disabled={marioState.mushroomCooldown > 0} className="bg-red-600 hover:bg-red-500 text-white font-bold">
                      🍄 COGUMELO {marioState.mushroomCooldown > 0 && `(${marioState.mushroomCooldown})`}
                    </Button>
                  )}

                  {/* Guest 1337 Block */}
                  {selectedCharacter.specialType === 'guest1337' && (
                    <Button onClick={guest1337Block} disabled={!isPlayerTurn || attackCooldown} className="bg-gray-700 hover:bg-gray-600 text-white font-bold">
                      🛡️ BLOQUEAR
                    </Button>
                  )}

                  {/* Luffy Gears */}
                  {selectedCharacter.specialType === 'luffy' && (
                    <>
                      {luffyState.currentGear === 0 ? (
                        <div className="relative">
                          <Button onClick={() => setLuffyState(prev => ({ ...prev, gearMenuOpen: !prev.gearMenuOpen }))} className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                            ⚙️ GEARS
                          </Button>
                          {luffyState.gearMenuOpen && (
                            <div className="absolute bottom-full mb-2 left-0 bg-background border-2 border-border rounded-sm p-2 space-y-1 z-50 min-w-[200px]">
                              <Tooltip><TooltipTrigger asChild>
                                <Button onClick={() => activateGear(2)} className="w-full bg-orange-500 text-white text-sm">Gear 2</Button>
                              </TooltipTrigger><TooltipContent>{getLuffyGearCost(2)}</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button onClick={() => activateGear(3)} className="w-full bg-orange-600 text-white text-sm">Gear 3</Button>
                              </TooltipTrigger><TooltipContent>{getLuffyGearCost(3)}</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button onClick={() => activateGear(4)} className="w-full bg-orange-700 text-white text-sm">Gear 4</Button>
                              </TooltipTrigger><TooltipContent>{getLuffyGearCost(4)}</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button onClick={() => activateGear(5)} className="w-full bg-red-600 text-white text-sm">Gear 5</Button>
                              </TooltipTrigger><TooltipContent>{getLuffyGearCost(5)}</TooltipContent></Tooltip>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button onClick={deactivateGear} className="bg-gray-600 hover:bg-gray-500 text-white font-bold">
                          DESATIVAR GEAR
                        </Button>
                      )}
                    </>
                  )}

                  {/* Chronos Abilities */}
                  {selectedCharacter.specialType === 'chronos' && (
                    <>
                      <Button onClick={chronosRewind} disabled={!isPlayerTurn || !chronosState.canRewind} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                        ⏪ VOLTAR TURNO {!chronosState.canRewind && '(N/A)'}
                      </Button>
                      <Button onClick={chronosTransform} disabled={!isPlayerTurn || attackCooldown || chronosState.transformUsed} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
                        👶 TRANSFORM {chronosState.transformUsed && '(USADO)'}
                      </Button>
                    </>
                  )}

                  {/* Goku Kamehameha */}
                  {selectedCharacter.specialType === 'goku' && (
                    <Button onClick={gokuKamehameha} disabled={!isPlayerTurn || attackCooldown || isKamehamehaActive} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                      🔵 KAMEHAMEHA
                    </Button>
                  )}
                </div>
              )}

              {/* Battle Log */}
              <div className="bg-muted border-2 border-border rounded-sm p-4 max-h-48 overflow-y-auto flex flex-col-reverse">
                <h4 className="text-primary font-bold mb-2">Log de Batalha:</h4>
                {battleLog.slice(-7).reverse().map((log, idx) => (
                  <p key={idx} className="text-foreground text-sm">{log}</p>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleBack} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold">⬅️ VOLTAR</Button>
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
