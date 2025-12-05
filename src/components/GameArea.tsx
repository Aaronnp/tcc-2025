import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addVictory } from "@/utils/gameProgress";
import { 
  getCharacterSprite, 
  LUFFY_SPRITES,
  calculateSukunaDamage,
  getLuffyGearBonus,
  getLuffyGearCost,
  calculateGojoDamage,
  SukunaState,
  LuffyState,
  YiState,
  GojoState,
  MarioState,
  Guest1337State,
  ChronosState
} from "@/utils/specialCharacters";
import {
  playSukunaDesmantelar,
  playSukunaClevar,
  playSukunaFuga,
  playSukunaSantuario,
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
  playNormalAttack
} from "@/utils/soundEffects";
import heroSword from "@/assets/hero-sword.png";
import heroBow from "@/assets/hero-bow.png";
import heroStaff from "@/assets/hero-staff.png";
import heroAxe from "@/assets/hero-axe.png";
import heroGoku from "@/assets/hero-goku.png";
import heroSonic from "@/assets/hero-sonic.png";
import bossAeternus from "@/assets/boss-aeternus.png";
import bossInfernus from "@/assets/boss-infernus.png";
import bossShadow from "@/assets/boss-shadow.png";
import bossArkanus from "@/assets/boss-arkanus.png";
import enemyUraume from "@/assets/enemy-uraume.png";
import enemySkeleton from "@/assets/enemy-skeleton.png";
import enemyGoblin from "@/assets/enemy-goblin.png";
import enemyShadow from "@/assets/enemy-shadow.png";
import enemyBandit from "@/assets/enemy-bandit.png";
import enemyFly from "@/assets/enemy-fly.png";
import enemyGuard from "@/assets/enemy-guard.png";
import enemySoul from "@/assets/enemy-soul.png";
import slashEffect from "@/assets/slash-effect.png";
import bossBackground from "@/assets/boss-background.png";
import bossArkanusBackground from "@/assets/boss-arkanus-bg.png";
import bossShadowBackground from "@/assets/boss-shadow-bg.png";
import bossInfernusBackground from "@/assets/boss-infernus-bg.png";
import bossAeternusBackground from "@/assets/boss-aeternus-bg.png";

interface Character {
  nome: string;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  poderDeFogo: number;
  vida: number;
  armadura: number;
  arma: string;
  level: number;
  xp: number;
  pointsToSpend: number;
  hardcore?: boolean;
  specialType?: string;
}

interface Enemy {
  nome: string;
  foto: string;
  forca: number;
  des: number;
  cons: number;
  pdf: number;
  int: number;
  vida: number;
  magia: number;
  isBaby?: boolean; // Para Chronos TRANSFORM
}

interface Props {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
  onReturnToSheet: (currentRoom: number, resetCharacter?: boolean) => void;
  initialRoom?: number;
  isAftermatch?: boolean;
}

interface Item {
  nome: string;
  tipo: 'arma' | 'armadura' | 'pocao' | 'especial';
  bonus?: {
    forca?: number;
    destreza?: number;
    constituicao?: number;
    inteligencia?: number;
    poderDeFogo?: number;
    armadura?: number;
    dano?: number;
  };
  cura?: number;
  especial?: string;
}

const enemies: Enemy[] = [
  { nome: 'Adalnir', foto: enemySkeleton, forca: 6, des: 3, cons: 4, pdf: 2, int: 0, vida: 20, magia: 1 },
  { nome: 'Alma Perdida', foto: enemySoul, forca: 2, des: 1, cons: 1, pdf: 0, int: 0, vida: 5, magia: 10 },
  { nome: 'Esqueleto Armado (e com vida)', foto: enemySkeleton, forca: 0, des: 2, cons: 2, pdf: 5, int: 0, vida: 10, magia: 10 },
  { nome: 'Esqueleto 💀', foto: enemySkeleton, forca: 0, des: 0, cons: 0, pdf: 0, int: 0, vida: 1, magia: 1 },
  { nome: 'Bandido Perdido', foto: enemyBandit, forca: 5, des: 2, cons: 4, pdf: 0, int: 0, vida: 20, magia: 20 },
  { nome: 'Mosca Titânica', foto: enemyFly, forca: 8, des: 5, cons: 7, pdf: 0, int: 0, vida: 35, magia: 100 },
  { nome: 'Guarda Sombrio', foto: enemyGuard, forca: 5, des: 1, cons: 6, pdf: 5, int: 0, vida: 30, magia: 50 },
  { nome: 'Goblin', foto: enemyGoblin, forca: 2, des: 2, cons: 2, pdf: 2, int: 0, vida: 10, magia: 100 },
  { nome: 'Supreme Adalnir', foto: enemySkeleton, forca: 12, des: 6, cons: 8, pdf: 4, int: 0, vida: 50, magia: 100 },
  { nome: 'Uraume', foto: enemyUraume, forca: 6, des: 2, cons: 2, pdf: 0, int: 0, vida: 10, magia: 25 },
  { nome: 'Sombra', foto: enemyShadow, forca: 1, des: 6, cons: 1, pdf: 0, int: 0, vida: 5, magia: 45 },
  { nome: 'Atenas', foto: enemySkeleton, forca: 1, des: 2, cons: 5, pdf: 6, int: 0, vida: 25, magia: 50 },
];

const bosses: Enemy[] = [
  { nome: 'Arkanus, O Guerreiro Perdido', foto: bossArkanus, forca: 8, des: 2, cons: 20, pdf: 3, int: 5, vida: 75, magia: 300 },
  { nome: 'A Sombra Primordial', foto: bossShadow, forca: 6, des: 9999, cons: 0, pdf: 0, int: 10, vida: 50, magia: 500 },
  { nome: 'Infernus Veylor, O Assasino de Vultos', foto: bossInfernus, forca: 10, des: 10, cons: 43, pdf: 15, int: 15, vida: 215, magia: 350 },
  { nome: 'Aeternus, o Deus das Sombras', foto: bossAeternus, forca: 30, des: 30, cons: 100, pdf: 20, int: 30, vida: 750, magia: 2000 },
];

const getBossBackground = (bossName: string) => {
  if (bossName.includes('Arkanus')) return bossArkanusBackground;
  if (bossName.includes('Sombra Primordial')) return bossShadowBackground;
  if (bossName.includes('Infernus')) return bossInfernusBackground;
  if (bossName.includes('Aeternus')) return bossAeternusBackground;
  return bossBackground;
};

export default function GameArea({ character: initialCharacter, onCharacterUpdate, onReturnToSheet, initialRoom = 0, isAftermatch = false }: Props) {
  const [character, setCharacter] = useState(initialCharacter);
  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  
  useEffect(() => {
    setCurrentRoom(initialRoom);
  }, [initialRoom]);
  
  const [maxRooms] = useState(100);
  const [damageAnimation, setDamageAnimation] = useState<{show: boolean, damage: number, x: number, y: number}>({ show: false, damage: 0, x: 0, y: 0 });
  const [showInventoryInBattle, setShowInventoryInBattle] = useState(false);
  const [mantraActive, setMantraActive] = useState(false);
  const [mantraPenalty, setMantraPenalty] = useState({ armadura: 0, ataque: 0 });
  const [gameWon, setGameWon] = useState(false);
  const getLastCheckpoint = (room: number) => Math.floor(room / 10) * 10;
  const [rooms, setRooms] = useState<Array<{ enemy: Enemy | null; cleared: boolean; isBoss: boolean; chest: Item | null }>>([]);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [inBattle, setInBattle] = useState(false);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [equippedWeapon, setEquippedWeapon] = useState<Item | null>(null);
  const [equippedArmor, setEquippedArmor] = useState<Item | null>(null);
  const [story, setStory] = useState("Bem-vindo à Dungeon das Sombras. Sua jornada começa aqui...");
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);
  const [kamehamehaAnimation, setKamehamehaAnimation] = useState(false);
  const [weaponAnimation, setWeaponAnimation] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  const [specialAttackEffect, setSpecialAttackEffect] = useState<string | null>(null);
  
  // Special character states
  const [sukunaState, setSukunaState] = useState<SukunaState>({ desmantelarCooldown: 0, clevarCooldown: 0, fugaCooldown: 0, santuarioCooldown: 0 });
  const [luffyState, setLuffyState] = useState<LuffyState>({ currentGear: 0, gearTurnsActive: 0, stunTurns: 0, gearMenuOpen: false });
  const [yiState, setYiState] = useState<YiState>({ lives: 9, currentStep: 'counter', hasTalisman: false });
  const [gojoState, setGojoState] = useState<GojoState>({ azulCooldown: 0, vermelhoCooldown: 0, vazioRoxoCooldown: 0, infinitoCooldown: 0, infinitoTurnsActive: 0, vazioInfinitoUsed: false, enemyStunTurns: 0 });
  const [marioState, setMarioState] = useState<MarioState>({ mushroomCooldown: 0, mushroomTurnsActive: 0 });
  const [guest1337State, setGuest1337State] = useState<Guest1337State>({ nextAttackDouble: false });
  const [chronosState, setChronosState] = useState<ChronosState>({ lastTurnState: null, canRewind: false, transformUsed: false });
  const [chronosTargetRoom, setChronosTargetRoom] = useState<string>('');
  
  const specialType = character.specialType || 'normal';
  const isGokuMode = specialType === 'goku' || character.arma === 'Goku';
  const isSonicMode = specialType === 'sonic' || character.nome.toLowerCase().includes('sonic');
  const isDevilWeapon = character.arma === 'Diabo';
  const isInfernoMode = character.hardcore || false;
  
  const modifiedEnemies = isAftermatch 
    ? enemies.map(e => ({ ...e, vida: e.vida * 3, forca: e.forca * 2, des: e.des * 2 }))
    : enemies;
  
  const modifiedBosses = isAftermatch
    ? bosses.map(b => ({ ...b, vida: b.vida * 3, forca: b.forca * 2, des: b.des * 2, cons: b.cons * 2 }))
    : bosses;

  useEffect(() => {
    generateRooms();
  }, [maxRooms]);

  const generateRooms = () => {
    const newRooms = Array.from({ length: maxRooms }, (_, index) => {
      const roomNumber = index + 1;
      const isBossRoom = roomNumber % 25 === 0;
      
      if (isBossRoom) {
        const bossIndex = Math.min(Math.floor(roomNumber / 25) - 1, modifiedBosses.length - 1);
        return { enemy: { ...modifiedBosses[bossIndex] }, cleared: false, isBoss: true, chest: null };
      }
      
      if (roomNumber === 45) {
        return { enemy: null, cleared: false, isBoss: false, chest: { nome: 'Mantra das Sombras', tipo: 'especial' as const, especial: 'mantra_sombras' } };
      }
      
      if (roomNumber === 70) {
        return { enemy: null, cleared: false, isBoss: false, chest: { nome: 'Armadura das Sombras', tipo: 'armadura' as const, bonus: { armadura: 10 } } };
      }
      
      if (roomNumber === 98) {
        return { enemy: null, cleared: false, isBoss: false, chest: { nome: 'Armadura de Luz', tipo: 'armadura' as const, bonus: { armadura: 25 } } };
      }
      
      const hasEnemy = Math.random() < 0.3;
      const hasChest = !hasEnemy && Math.random() < 0.15;
      
      return {
        enemy: hasEnemy ? { ...modifiedEnemies[Math.floor(Math.random() * modifiedEnemies.length)] } : null,
        cleared: false,
        isBoss: false,
        chest: hasChest ? generateRandomItem() : null,
      };
    });
    setRooms(newRooms);
    setCurrentRoom(0);
  };

  const generateRandomItem = (): Item => {
    const itemTypes = ['arma', 'armadura'] as const;
    const tipo = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    
    if (tipo === 'arma') {
      return { nome: `Arma Mágica +${Math.floor(Math.random() * 5) + 1}`, tipo: 'arma', bonus: { forca: Math.floor(Math.random() * 3) + 1, poderDeFogo: Math.floor(Math.random() * 3) + 1 } };
    } else {
      return { nome: `Armadura +${Math.floor(Math.random() * 5) + 1}`, tipo: 'armadura', bonus: { armadura: Math.floor(Math.random() * 10) + 5, constituicao: Math.floor(Math.random() * 2) + 1 } };
    }
  };

  const playDoorSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 200;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Advance turn and handle special character effects
  const advanceTurn = () => {
    setTurnCount(prev => prev + 1);
    
    // Sukuna cooldowns
    if (specialType === 'sukuna') {
      setSukunaState(prev => ({
        desmantelarCooldown: Math.max(0, prev.desmantelarCooldown - 1),
        clevarCooldown: Math.max(0, prev.clevarCooldown - 1),
        fugaCooldown: Math.max(0, prev.fugaCooldown - 1),
        santuarioCooldown: Math.max(0, prev.santuarioCooldown - 1),
      }));
    }
    
    // Luffy gear effects
    if (specialType === 'luffy' && luffyState.currentGear > 0) {
      let newHp = character.vida;
      const gear = luffyState.currentGear;
      
      if (gear === 2) newHp -= 3;
      if (gear === 3) newHp -= 5;
      
      setLuffyState(prev => {
        const newTurns = prev.gearTurnsActive + 1;
        
        // Gear 4: 3 turnos depois stun 2
        if (gear === 4 && newTurns >= 3) {
          setBattleLog(p => [...p, '💨 Gear 4 desativou! Você está exausto por 2 turnos!']);
          return { ...prev, currentGear: 0, gearTurnsActive: 0, stunTurns: 2 };
        }
        
        // Gear 5: 3 turnos depois stun 10
        if (gear === 5 && newTurns >= 3) {
          setBattleLog(p => [...p, '💨 Gear 5 desativou! Você está completamente exausto por 10 turnos!']);
          return { ...prev, currentGear: 0, gearTurnsActive: 0, stunTurns: 10 };
        }
        
        return { ...prev, gearTurnsActive: newTurns };
      });
      
      if (newHp !== character.vida) {
        const updatedChar = { ...character, vida: Math.max(0, newHp) };
        setCharacter(updatedChar);
        onCharacterUpdate(updatedChar);
        setBattleLog(p => [...p, `💔 Gear ${gear} drenou ${gear === 2 ? 3 : 5} de vida!`]);
      }
    }
    
    // Luffy stun turns
    if (specialType === 'luffy' && luffyState.stunTurns > 0) {
      setLuffyState(prev => ({ ...prev, stunTurns: prev.stunTurns - 1 }));
    }
    
    // Gojo cooldowns and effects
    if (specialType === 'gojo') {
      setGojoState(prev => ({
        ...prev,
        azulCooldown: Math.max(0, prev.azulCooldown - 1),
        vermelhoCooldown: Math.max(0, prev.vermelhoCooldown - 1),
        vazioRoxoCooldown: Math.max(0, prev.vazioRoxoCooldown - 1),
        infinitoCooldown: Math.max(0, prev.infinitoCooldown - 1),
        infinitoTurnsActive: Math.max(0, prev.infinitoTurnsActive - 1),
        enemyStunTurns: Math.max(0, prev.enemyStunTurns - 1),
      }));
    }
    
    // Mario mushroom effects
    if (specialType === 'mario') {
      setMarioState(prev => ({
        mushroomCooldown: Math.max(0, prev.mushroomCooldown - 1),
        mushroomTurnsActive: Math.max(0, prev.mushroomTurnsActive - 1),
      }));
    }
  };

  const advanceRoom = () => {
    if (currentRoom >= maxRooms - 1) {
      setGameWon(true);
      addVictory(character.hardcore || false, isAftermatch);
      return;
    }
    
    if (isInfernoMode && (currentRoom + 2) % 3 === 0) {
      const demoMessages = [
        "Você ainda acredita que pode escapar?", "A escuridão cresce a cada passo...",
        "Suas forças estão se esgotando...", "O inferno não tem piedade...",
        "Você não deveria estar aqui...", "Desistir seria mais fácil...",
        "A morte é inevitável...", "Você está sozinho nesta jornada...",
        "Ninguém virá te salvar...", "Cada passo te aproxima da morte...",
        "Sua alma está condenada...", "O fim está próximo..."
      ];
      setBattleLog(prev => [...prev, `🔥 ${demoMessages[Math.floor(Math.random() * demoMessages.length)]}`]);
    }

    playDoorSound();
    const nextRoom = currentRoom + 1;
    const room = rooms[nextRoom];

    if (room.enemy && !room.cleared) {
      setCurrentEnemy({ ...room.enemy });
      setInBattle(true);
      setTurnCount(0);
      if (room.isBoss) {
        setBattleLog([`🔥 BOSS APARECEU: ${room.enemy.nome}!`]);
        setStory(`Um chefe poderoso bloqueia seu caminho: ${room.enemy.nome}!`);
      } else {
        setBattleLog([`⚔️ Um ${room.enemy.nome} apareceu!`]);
      }
    } else if (room.chest) {
      const potion: Item = { nome: 'Poção de Vida', tipo: 'pocao', cura: 20 + Math.floor(Math.random() * 30) };
      
      if (nextRoom + 1 === 70) {
        const shadowWeapon: Item = { nome: 'Arma das Sombras', tipo: 'arma', bonus: { dano: 15 } };
        setBattleLog([`✅ Sala ${nextRoom + 1}: Você encontrou ${room.chest.nome}, Arma das Sombras e uma Poção!`]);
        setInventory(prev => [...prev, room.chest!, shadowWeapon, potion]);
      } else if (nextRoom + 1 === 98) {
        const lightWeapon: Item = { nome: 'Arma de Luz', tipo: 'arma', bonus: { dano: 30 } };
        setBattleLog([`✅ Sala ${nextRoom + 1}: Você encontrou ${room.chest.nome}, Arma de Luz e uma Poção!`]);
        setInventory(prev => [...prev, room.chest!, lightWeapon, potion]);
      } else {
        setBattleLog([`✅ Sala ${nextRoom + 1}: Você encontrou ${room.chest.nome} e uma Poção!`]);
        setInventory(prev => [...prev, room.chest!, potion]);
      }
      
      setCurrentRoom(nextRoom);
    } else {
      setBattleLog([`✅ Sala ${nextRoom + 1} está vazia e segura.`]);
      setCurrentRoom(nextRoom);
    }
  };

  // Chronos: teleport to room
  const chronosTeleport = () => {
    const targetRoom = parseInt(chronosTargetRoom) - 1;
    if (isNaN(targetRoom) || targetRoom < 0 || targetRoom >= maxRooms) {
      setBattleLog(prev => [...prev, '❌ Sala inválida!']);
      return;
    }
    setCurrentRoom(targetRoom);
    setBattleLog([`⏰ CHRONOS teleportou para a sala ${targetRoom + 1}!`]);
    setChronosTargetRoom('');
  };

  const getTotalStats = () => {
    const weaponBonus = equippedWeapon?.bonus || {};
    const armorBonus = equippedArmor?.bonus || {};
    const devilBonus = isDevilWeapon ? 30 : 0;
    
    // Luffy gear bonus
    let gearBonus = { forca: 0, destreza: 0 };
    if (specialType === 'luffy' && Number(luffyState.currentGear) > 0) {
      gearBonus = getLuffyGearBonus(luffyState.currentGear);
    }
    
    // Mario mushroom bonus
    let marioBonus = 0;
    if (specialType === 'mario' && marioState.mushroomTurnsActive > 0) {
      marioBonus = 15;
    }
    
    return {
      forca: character.forca + (weaponBonus.forca || 0) + (armorBonus.forca || 0) - mantraPenalty.ataque + gearBonus.forca,
      poderDeFogo: character.poderDeFogo + (weaponBonus.poderDeFogo || 0) + (armorBonus.poderDeFogo || 0),
      armadura: character.armadura + (armorBonus.armadura || 0) - mantraPenalty.armadura,
      danoExtra: (equippedWeapon?.bonus?.dano || 0) + devilBonus + marioBonus,
      destreza: character.destreza + gearBonus.destreza,
    };
  };

  const handleEnemyDeath = () => {
    const xpGained = 100;
    const newXP = character.xp + xpGained;
    const xpNeeded = character.level * 100;
    let newLevel = character.level;
    let newPointsToSpend = character.pointsToSpend;
    
    if (newXP >= xpNeeded) {
      newLevel++;
      newPointsToSpend++;
      setBattleLog(prev => [...prev, `🎯 Você derrotou ${currentEnemy!.nome}! +${xpGained} XP`, `🎊 LEVEL UP! Nível ${newLevel}!`]);
    } else {
      setBattleLog(prev => [...prev, `🎯 Você derrotou ${currentEnemy!.nome}! +${xpGained} XP`]);
    }
    
    const updatedChar = { 
      ...character, 
      xp: newXP >= xpNeeded ? newXP - xpNeeded : newXP,
      level: newLevel,
      pointsToSpend: newPointsToSpend
    };
    setCharacter(updatedChar);
    onCharacterUpdate(updatedChar);
    
    const updatedRooms = [...rooms];
    updatedRooms[currentRoom + 1].cleared = true;
    setRooms(updatedRooms);
    setCurrentEnemy(null);
    setInBattle(false);
    setCurrentRoom(currentRoom + 1);
    
    // Remove mantra after boss
    if (mantraActive) {
      setInventory(prev => prev.filter(item => item.especial !== 'mantra_sombras'));
      setMantraActive(false);
    }
  };

  const handlePlayerDeath = () => {
    // Yi has 9 lives
    if (specialType === 'yi' && yiState.lives > 1) {
      setYiState(prev => ({ ...prev, lives: prev.lives - 1 }));
      const updatedChar = { ...character, vida: 5 };
      setCharacter(updatedChar);
      onCharacterUpdate(updatedChar);
      setBattleLog(prev => [...prev, `💀 Yi morreu mas renasceu! Vidas restantes: ${yiState.lives - 1}`]);
      return false;
    }
    
    setBattleLog(prev => [...prev, `💀 Você foi derrotado! Game Over.`]);
    const updatedChar = { ...character, vida: 0 };
    setCharacter(updatedChar);
    onCharacterUpdate(updatedChar);
    setInBattle(false);
    return true;
  };

  const dealDamageToEnemy = (damage: number, message: string) => {
    if (!currentEnemy) return;
    
    // Chronos TRANSFORM: enemy is baby
    if (currentEnemy.isBaby) {
      damage = 999999;
    }
    
    const newEnemyHp = currentEnemy.vida - damage;
    setBattleLog(prev => [...prev, message]);
    
    if (newEnemyHp <= 0) {
      handleEnemyDeath();
    } else {
      setCurrentEnemy({ ...currentEnemy, vida: newEnemyHp });
    }
  };

  const attack = () => {
    if (!currentEnemy || !inBattle || attackCooldown) return;
    
    // Luffy stun check
    if (specialType === 'luffy' && luffyState.stunTurns > 0) {
      setBattleLog(prev => [...prev, `😵 Você está exausto! ${luffyState.stunTurns} turnos restantes.`]);
      advanceTurn();
      return;
    }
    
    // Gojo enemy stun check
    if (specialType === 'gojo' && gojoState.enemyStunTurns > 0) {
      setBattleLog(prev => [...prev, `🔮 O inimigo está paralisado no Vazio Infinito!`]);
    }

    // Goku Mode
    if (isGokuMode) {
      if (kamehamehaAnimation) return;
      
      setKamehamehaAnimation(true);
      setWeaponAnimation('Goku');
      setAttackCooldown(true);
      
      const gokuAudio = new Audio('/goku-kamehameha.mp3');
      gokuAudio.volume = 0.5;
      gokuAudio.play().catch(() => {});
      
      setTimeout(() => {
        setKamehamehaAnimation(false);
        handleEnemyDeath();
        setAttackCooldown(false);
      }, 17000);
      
      return;
    }

    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), 3000);

    setAttackAnimation(true);
    setWeaponAnimation(character.arma);
    setTimeout(() => { setAttackAnimation(false); setWeaponAnimation(null); }, 1000);

    const stats = getTotalStats();
    
    // Sombra Primordial check
    const hasMantra = inventory.some(item => item.especial === 'mantra_sombras');
    if (currentEnemy.nome === 'A Sombra Primordial' && !mantraActive) {
      setBattleLog(prev => [
        ...prev,
        `💨 A Sombra Primordial desviou do seu ataque!`,
        hasMantra ? `💡 Use a Mantra das Sombras!` : `⚠️ Encontre a Mantra (Sala 45)!`,
      ]);
      
      // Enemy attacks back
      if (!(specialType === 'gojo' && gojoState.infinitoTurnsActive > 0)) {
        const enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(stats.armadura / 5));
        const newPlayerHp = character.vida - enemyDamage;
        setBattleLog(prev => [...prev, `💥 A Sombra causou ${enemyDamage} de dano!`]);
        
        if (newPlayerHp <= 0) {
          handlePlayerDeath();
        } else {
          const updatedChar = { ...character, vida: newPlayerHp };
          setCharacter(updatedChar);
          onCharacterUpdate(updatedChar);
        }
      }
      advanceTurn();
      return;
    }
    
    const attackStat = character.arma === 'Arco' ? stats.poderDeFogo : stats.forca;
    const weaponDamageBonus = stats.danoExtra;
    
    // Guest1337 double damage
    let damageMultiplier = 1;
    if (specialType === 'guest1337' && guest1337State.nextAttackDouble) {
      damageMultiplier = 2;
      setGuest1337State({ nextAttackDouble: false });
      setBattleLog(prev => [...prev, `⚡ DANO DOBRADO!`]);
    }
    
    let playerDamage = Math.max(1, (attackStat + stats.poderDeFogo + character.inteligencia + weaponDamageBonus + Math.floor(Math.random() * 6)) * damageMultiplier);
    
    // Enemy dodge
    let enemyDodged = false;
    if (currentEnemy.des > stats.destreza && !currentEnemy.isBaby) {
      enemyDodged = Math.random() < 0.3;
    }
    
    // Player dodge (Sonic always dodges, Gojo with Infinito always dodges)
    let playerDodged = false;
    if (isSonicMode) {
      playerDodged = true;
    } else if (specialType === 'gojo' && gojoState.infinitoTurnsActive > 0) {
      playerDodged = true;
      setBattleLog(prev => [...prev, `♾️ Infinito bloqueou o ataque!`]);
    } else if (stats.destreza > currentEnemy.des) {
      playerDodged = Math.random() < 0.5;
    }
    
    let enemyDamage = 0;
    if (!playerDodged && gojoState.enemyStunTurns === 0 && !currentEnemy.isBaby) {
      enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(stats.armadura / 5));
    }
    
    // Salvar estado para Chronos poder voltar turno
    if (specialType === 'chronos' && enemyDamage > 0) {
      setChronosState(prev => ({ 
        ...prev, 
        canRewind: true, 
        lastTurnState: { enemyHp: currentEnemy.vida, playerHp: character.vida }
      }));
    }

    if (enemyDodged) {
      setBattleLog(prev => [...prev, `💨 ${currentEnemy.nome} desviou!`]);
      
      if (!playerDodged && enemyDamage > 0) {
        const newPlayerHp = character.vida - enemyDamage;
        setBattleLog(prev => [...prev, `💥 Inimigo causou ${enemyDamage}!`]);
        
        if (newPlayerHp <= 0) {
          handlePlayerDeath();
        } else {
          const updatedChar = { ...character, vida: newPlayerHp };
          setCharacter(updatedChar);
          onCharacterUpdate(updatedChar);
        }
      } else if (playerDodged) {
        setBattleLog(prev => [...prev, `💨 Você desviou!`]);
      }
      advanceTurn();
      return;
    }

    const newEnemyHp = currentEnemy.vida - playerDamage;
    const newPlayerHp = character.vida - enemyDamage;

    if (playerDodged || enemyDamage === 0) {
      setBattleLog(prev => [...prev, `⚔️ Você causou ${playerDamage}!`, enemyDamage === 0 ? '' : `💨 Você desviou!`].filter(Boolean));
    } else {
      setBattleLog(prev => [...prev, `⚔️ Você causou ${playerDamage}!`, `💥 Inimigo causou ${enemyDamage}!`]);
    }

    if (newEnemyHp <= 0) {
      handleEnemyDeath();
    } else if (newPlayerHp <= 0) {
      handlePlayerDeath();
    } else {
      setCurrentEnemy({ ...currentEnemy, vida: newEnemyHp });
      const updatedChar = { ...character, vida: newPlayerHp };
      setCharacter(updatedChar);
      onCharacterUpdate(updatedChar);
    }
    
    advanceTurn();
  };

  // Sukuna attacks
  const sukunaAttack = (attackType: 'desmantelar' | 'clevar' | 'fuga' | 'santuario') => {
    if (!currentEnemy || attackCooldown) return;
    
    const cooldowns = { desmantelar: 2, clevar: 4, fuga: 5, santuario: 10 };
    const stateKey = `${attackType}Cooldown` as keyof SukunaState;
    
    if (sukunaState[stateKey] > 0) {
      setBattleLog(prev => [...prev, `⏰ ${attackType} em cooldown: ${sukunaState[stateKey]} turnos`]);
      return;
    }
    
    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), 3000);
    
    // Play sound effect
    if (attackType === 'desmantelar') playSukunaDesmantelar();
    else if (attackType === 'clevar') playSukunaClevar();
    else if (attackType === 'fuga') playSukunaFuga();
    else if (attackType === 'santuario') playSukunaSantuario();
    
    // Trigger animation
    const animations = { desmantelar: 'sukuna-dismantle', clevar: 'sukuna-cleave', fuga: 'sukuna-flame', santuario: 'sukuna-domain' };
    setSpecialAttackEffect(animations[attackType]);
    setTimeout(() => setSpecialAttackEffect(null), 1500);
    
    const damage = calculateSukunaDamage(attackType);
    const names = { desmantelar: 'DESMANTELAR', clevar: 'CLEVAR', fuga: 'FUGA', santuario: 'SANTUÁRIO MALEVOLENTE' };
    
    setSukunaState(prev => ({ ...prev, [stateKey]: cooldowns[attackType] }));
    dealDamageToEnemy(damage, `🔥 ${names[attackType]}! ${damage} de dano!`);
    advanceTurn();
  };

  // Yi attacks
  const yiCounter = () => {
    if (!currentEnemy || attackCooldown || yiState.currentStep !== 'counter') return;
    
    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), 3000);
    
    playYiCounter();
    setSpecialAttackEffect('yi-counter');
    setTimeout(() => setSpecialAttackEffect(null), 500);
    
    if (Math.random() < 0.5) {
      setBattleLog(prev => [...prev, `🛡️ COUNTER! Yi bloqueou o ataque e ganhou um talismã!`]);
      setYiState(prev => ({ ...prev, currentStep: 'insert', hasTalisman: true }));
    } else {
      setBattleLog(prev => [...prev, `❌ Counter falhou! Turno perdido.`]);
      // Yi perdeu uma vida quando falha no counter
      setYiState(prev => {
        const newLives = prev.lives - 1;
        setBattleLog(log => [...log, `💀 Yi perdeu uma vida! Vidas restantes: ${newLives}`]);
        if (newLives <= 0) {
          handlePlayerDeath();
        }
        return { ...prev, lives: newLives };
      });
    }
    advanceTurn();
  };

  const yiInsert = () => {
    if (!currentEnemy || yiState.currentStep !== 'insert') return;
    playYiInsert();
    setSpecialAttackEffect('yi-talisman');
    setTimeout(() => setSpecialAttackEffect(null), 800);
    setBattleLog(prev => [...prev, `📍 Yi inseriu o talismã no inimigo!`]);
    setYiState(prev => ({ ...prev, currentStep: 'explode' }));
  };

  const yiExplode = () => {
    if (!currentEnemy || yiState.currentStep !== 'explode') return;
    playYiExplode();
    setSpecialAttackEffect('yi-explode');
    setTimeout(() => setSpecialAttackEffect(null), 1000);
    setBattleLog(prev => [...prev, `💥 EXPLOSÃO! 500 de dano garantido!`]);
    dealDamageToEnemy(500, '');
    setYiState(prev => ({ ...prev, currentStep: 'counter', hasTalisman: false }));
    advanceTurn();
  };

  // Gojo attacks
  const gojoAttack = (attackType: 'azul' | 'vermelho' | 'vazioRoxo' | 'infinito' | 'vazioInfinito') => {
    if (!currentEnemy || attackCooldown) return;
    
    if (attackType === 'vazioInfinito' && gojoState.vazioInfinitoUsed) {
      setBattleLog(prev => [...prev, `❌ Vazio Infinito só pode ser usado uma vez!`]);
      return;
    }
    
    const cooldowns: Record<string, 'azulCooldown' | 'vermelhoCooldown' | 'vazioRoxoCooldown' | 'infinitoCooldown'> = { 
      azul: 'azulCooldown', vermelho: 'vermelhoCooldown', 
      vazioRoxo: 'vazioRoxoCooldown', infinito: 'infinitoCooldown' 
    };
    
    const cooldownKey = cooldowns[attackType];
    if (attackType !== 'vazioInfinito' && cooldownKey && gojoState[cooldownKey] > 0) {
      setBattleLog(prev => [...prev, `⏰ Em cooldown: ${gojoState[cooldownKey]} turnos`]);
      return;
    }
    
    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), 3000);
    
    // Play sound effect
    if (attackType === 'azul') playGojoAzul();
    else if (attackType === 'vermelho') playGojoVermelho();
    else if (attackType === 'vazioRoxo') playGojoVazioRoxo();
    else if (attackType === 'infinito') playGojoInfinito();
    else if (attackType === 'vazioInfinito') playGojoVazioInfinito();
    
    // Trigger animation
    const animations: Record<string, string> = { azul: 'gojo-blue', vermelho: 'gojo-red', vazioRoxo: 'gojo-purple', infinito: 'gojo-infinity', vazioInfinito: 'gojo-domain' };
    setSpecialAttackEffect(animations[attackType]);
    setTimeout(() => setSpecialAttackEffect(null), attackType === 'vazioInfinito' ? 2000 : 1200);
    
    if (attackType === 'infinito') {
      setGojoState(prev => ({ ...prev, infinitoCooldown: 5, infinitoTurnsActive: 3 }));
      setBattleLog(prev => [...prev, `♾️ INFINITO ATIVADO! Invulnerável por 3 turnos!`]);
    } else if (attackType === 'vazioInfinito') {
      setGojoState(prev => ({ ...prev, vazioInfinitoUsed: true, enemyStunTurns: 2 }));
      setBattleLog(prev => [...prev, `🌀 VAZIO INFINITO! Inimigo paralisado por 2 turnos!`]);
    } else {
      const damage = calculateGojoDamage(attackType);
      const names = { azul: 'AZUL', vermelho: 'VERMELHO', vazioRoxo: 'VAZIO ROXO' };
      const cooldownValues = { azul: 5, vermelho: 5, vazioRoxo: 10 };
      
      setGojoState(prev => ({ ...prev, [cooldowns[attackType]]: cooldownValues[attackType] }));
      dealDamageToEnemy(damage, `🔵 ${names[attackType]}! ${damage} de dano!`);
    }
    advanceTurn();
  };

  // Mario mushroom
  const marioMushroom = () => {
    if (marioState.mushroomCooldown > 0) {
      setBattleLog(prev => [...prev, `⏰ Cogumelo em cooldown: ${marioState.mushroomCooldown} turnos`]);
      return;
    }
    playMarioMushroom();
    setSpecialAttackEffect('mario-mushroom');
    setTimeout(() => setSpecialAttackEffect(null), 600);
    setMarioState({ mushroomCooldown: 4, mushroomTurnsActive: 2 });
    setBattleLog(prev => [...prev, `🍄 Mario comeu um cogumelo! +15 de dano por 2 turnos!`]);
  };

  // Guest1337 block
  const guest1337Block = () => {
    if (!currentEnemy || attackCooldown) return;
    
    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), 3000);
    
    if (Math.random() < 0.5) {
      playGuest1337Block();
      setSpecialAttackEffect('block-success');
      setTimeout(() => setSpecialAttackEffect(null), 500);
      setBattleLog(prev => [...prev, `🛡️ BLOQUEIO PERFEITO! Próximo ataque causará dano dobrado!`]);
      setGuest1337State({ nextAttackDouble: true });
    } else {
      playGuest1337BlockFail();
      setBattleLog(prev => [...prev, `❌ Bloqueio falhou! Turno perdido.`]);
      // Pula turno - inimigo ataca
      const stats = getTotalStats();
      const enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(stats.armadura / 5));
      const newPlayerHp = character.vida - enemyDamage;
      setBattleLog(prev => [...prev, `💥 Inimigo atacou e causou ${enemyDamage} de dano!`]);
      
      if (newPlayerHp <= 0) {
        handlePlayerDeath();
      } else {
        const updatedChar = { ...character, vida: newPlayerHp };
        setCharacter(updatedChar);
        onCharacterUpdate(updatedChar);
      }
    }
    advanceTurn();
  };

  // Chronos rewind
  const chronosRewind = () => {
    if (!chronosState.canRewind || !chronosState.lastTurnState) {
      setBattleLog(prev => [...prev, `❌ Não é possível voltar no tempo agora!`]);
      return;
    }
    
    playChronosRewind();
    setSpecialAttackEffect('chronos-rewind');
    setTimeout(() => setSpecialAttackEffect(null), 1000);
    
    const { enemyHp, playerHp } = chronosState.lastTurnState;
    if (currentEnemy) setCurrentEnemy({ ...currentEnemy, vida: enemyHp });
    const updatedChar = { ...character, vida: playerHp };
    setCharacter(updatedChar);
    onCharacterUpdate(updatedChar);
    setChronosState(prev => ({ ...prev, canRewind: false }));
    setBattleLog(prev => [...prev, `⏰ CHRONOS voltou no tempo! Dano anulado!`]);
  };

  // Chronos transform
  const chronosTransform = () => {
    if (!currentEnemy || chronosState.transformUsed) return;
    
    playChronosTransform();
    setSpecialAttackEffect('chronos-transform');
    setTimeout(() => setSpecialAttackEffect(null), 1500);
    
    setChronosState(prev => ({ ...prev, transformUsed: true }));
    setCurrentEnemy({ ...currentEnemy, nome: 'Bebê Indefeso', vida: 1, forca: 0, des: 0, isBaby: true });
    setBattleLog(prev => [...prev, `⏰ TRANSFORM! O inimigo virou um bebê indefeso!`]);
  };

  const flee = () => {
    // Guest1337 can't flee
    if (specialType === 'guest1337') {
      setBattleLog(prev => [...prev, `❌ Guest 1337 não pode fugir! Use Bloquear!`]);
      return;
    }
    
    if (Math.random() < 0.5) {
      setBattleLog(prev => [...prev, `🏃 Você fugiu!`]);
      setCurrentEnemy(null);
      setInBattle(false);
      setCurrentRoom(currentRoom + 1);
    } else {
      const stats = getTotalStats();
      const enemyDamage = Math.max(1, (currentEnemy?.forca || 0) + Math.floor(Math.random() * 4));
      const newPlayerHp = character.vida - enemyDamage;
      setBattleLog(prev => [...prev, `❌ Falha ao fugir! -${enemyDamage} HP`]);
      
      if (newPlayerHp <= 0) {
        handlePlayerDeath();
      } else {
        const updatedChar = { ...character, vida: newPlayerHp };
        setCharacter(updatedChar);
        onCharacterUpdate(updatedChar);
      }
    }
  };

  const equipItem = (item: Item) => {
    if (item.tipo === 'arma') {
      setEquippedWeapon(item);
      setBattleLog(prev => [...prev, `⚔️ Equipou: ${item.nome}`]);
    } else if (item.tipo === 'armadura') {
      setEquippedArmor(item);
      setBattleLog(prev => [...prev, `🛡️ Equipou: ${item.nome}`]);
    } else if (item.tipo === 'especial') {
      setBattleLog(prev => [...prev, `✨ ${item.nome} obtida!`]);
    }
  };

  const usePotion = (item: Item, index: number) => {
    if (item.tipo === 'pocao' && item.cura) {
      const maxHp = character.hardcore ? 10 + character.constituicao : 10 + character.constituicao * 2;
      const newHp = Math.min(character.vida + item.cura, maxHp);
      const updatedChar = { ...character, vida: newHp };
      setCharacter(updatedChar);
      onCharacterUpdate(updatedChar);
      setBattleLog(prev => [...prev, `💚 +${item.cura} HP!`]);
      setInventory(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const useMantra = (index: number) => {
    setMantraActive(true);
    setMantraPenalty({ armadura: 1, ataque: 1 });
    setBattleLog(prev => [...prev, `✨ Mantra ativada! (-1 Armadura, -1 Ataque)`]);
  };

  const stats = getTotalStats();
  
  const getHeroSprite = () => {
    if (specialType !== 'normal') {
      return getCharacterSprite(specialType, luffyState.currentGear);
    }
    switch(character.arma) {
      case 'Espada': return heroSword;
      case 'Arco': return heroBow;
      case 'Cajado': return heroStaff;
      case 'Machado': return heroAxe;
      case 'Goku': return heroGoku;
      default: return heroSword;
    }
  };

  const getVisibleRooms = () => {
    const startRoom = Math.floor(currentRoom / 5) * 5;
    const endRoom = Math.min(maxRooms, startRoom + 5);
    return rooms.slice(startRoom, endRoom).map((room, index) => ({ ...room, actualIndex: startRoom + index }));
  };

  const visibleRooms = getVisibleRooms();
  const isBossBattle = rooms[currentRoom + 1]?.isBoss;

  // Victory Screen
  if (gameWon) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bossAeternusBackground})`, backgroundSize: 'cover' }}>
        <div className="bg-black/90 border-8 border-yellow-500 p-12 rounded-sm max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-yellow-500 mb-6 animate-pulse" style={{ fontFamily: 'monospace' }}>
            {character.hardcore ? '💀 VOCÊ ESCAPOU! 💀' : '🏆 VITÓRIA! 🏆'}
          </h1>
          <p className="text-white text-2xl mb-4" style={{ fontFamily: 'monospace' }}>{character.nome} - Level {character.level}</p>
          <Button onClick={() => onReturnToSheet(0, true)} className="bg-yellow-500 hover:bg-yellow-400 text-black text-xl px-8 py-4 font-bold">
            🔙 VOLTAR
          </Button>
        </div>
      </div>
    );
  }
  
  // Game Over Screen
  if (character.vida <= 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-8 animate-pulse" style={{ fontFamily: 'monospace' }}>💀 VOCÊ MORREU 💀</h1>
          <Button onClick={() => onReturnToSheet(0, true)} className="bg-red-600 hover:bg-red-700 text-white text-xl px-8 py-4 font-bold">
            VOLTAR PARA CRIAÇÃO
          </Button>
        </div>
      </div>
    );
  }

  // Luffy Gear Menu
  const renderLuffyGearMenu = () => {
    if (specialType !== 'luffy' || !luffyState.gearMenuOpen) return null;
    
    return (
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black border-4 border-red-500 p-4 z-50">
        <h3 className="text-white text-lg font-bold mb-2">GEARS</h3>
        {[2, 3, 4, 5].map(gear => (
          <button
            key={gear}
            onClick={() => {
              setLuffyState(prev => ({ ...prev, currentGear: gear as 0|2|3|4|5, gearTurnsActive: 0, gearMenuOpen: false }));
              setBattleLog(prev => [...prev, `⚡ GEAR ${gear} ATIVADO!`]);
            }}
            disabled={luffyState.currentGear === gear}
            className="block w-full text-left text-white border-2 border-white px-4 py-2 mb-2 hover:bg-white hover:text-black"
            title={getLuffyGearCost(gear)}
          >
            Gear {gear} <span className="text-xs text-red-300">({getLuffyGearCost(gear)})</span>
          </button>
        ))}
      </div>
    );
  };

  // Special Attack Buttons
  const renderSpecialAttacks = () => {
    if (specialType === 'sukuna') {
      return (
        <>
          <Button onClick={() => sukunaAttack('desmantelar')} disabled={attackCooldown || sukunaState.desmantelarCooldown > 0} className="bg-purple-600 hover:bg-purple-500">
            Desmantelar {sukunaState.desmantelarCooldown > 0 ? `(${sukunaState.desmantelarCooldown})` : ''}
          </Button>
          <Button onClick={() => sukunaAttack('clevar')} disabled={attackCooldown || sukunaState.clevarCooldown > 0} className="bg-purple-700 hover:bg-purple-600">
            Clevar {sukunaState.clevarCooldown > 0 ? `(${sukunaState.clevarCooldown})` : ''}
          </Button>
          <Button onClick={() => sukunaAttack('fuga')} disabled={attackCooldown || sukunaState.fugaCooldown > 0} className="bg-orange-600 hover:bg-orange-500">
            Fuga {sukunaState.fugaCooldown > 0 ? `(${sukunaState.fugaCooldown})` : ''}
          </Button>
          <Button onClick={() => sukunaAttack('santuario')} disabled={attackCooldown || sukunaState.santuarioCooldown > 0} className="bg-red-800 hover:bg-red-700">
            Santuário {sukunaState.santuarioCooldown > 0 ? `(${sukunaState.santuarioCooldown})` : ''}
          </Button>
        </>
      );
    }
    
    if (specialType === 'yi') {
      return (
        <>
          {yiState.currentStep === 'counter' && (
            <Button onClick={yiCounter} disabled={attackCooldown} className="bg-yellow-600 hover:bg-yellow-500">Counter</Button>
          )}
          {yiState.currentStep === 'insert' && (
            <Button onClick={yiInsert} className="bg-green-600 hover:bg-green-500">Insert</Button>
          )}
          {yiState.currentStep === 'explode' && (
            <Button onClick={yiExplode} className="bg-red-600 hover:bg-red-500">EXPLODE!</Button>
          )}
        </>
      );
    }
    
    if (specialType === 'gojo') {
      return (
        <>
          <Button onClick={() => gojoAttack('azul')} disabled={attackCooldown || gojoState.azulCooldown > 0} className="bg-blue-600 hover:bg-blue-500">
            Azul {gojoState.azulCooldown > 0 ? `(${gojoState.azulCooldown})` : ''}
          </Button>
          <Button onClick={() => gojoAttack('vermelho')} disabled={attackCooldown || gojoState.vermelhoCooldown > 0} className="bg-red-600 hover:bg-red-500">
            Vermelho {gojoState.vermelhoCooldown > 0 ? `(${gojoState.vermelhoCooldown})` : ''}
          </Button>
          <Button onClick={() => gojoAttack('vazioRoxo')} disabled={attackCooldown || gojoState.vazioRoxoCooldown > 0} className="bg-purple-600 hover:bg-purple-500">
            Vazio Roxo {gojoState.vazioRoxoCooldown > 0 ? `(${gojoState.vazioRoxoCooldown})` : ''}
          </Button>
          <Button onClick={() => gojoAttack('infinito')} disabled={attackCooldown || gojoState.infinitoCooldown > 0} className="bg-cyan-600 hover:bg-cyan-500">
            Infinito {gojoState.infinitoCooldown > 0 ? `(${gojoState.infinitoCooldown})` : gojoState.infinitoTurnsActive > 0 ? `(${gojoState.infinitoTurnsActive}t)` : ''}
          </Button>
          <Button onClick={() => gojoAttack('vazioInfinito')} disabled={attackCooldown || gojoState.vazioInfinitoUsed} className="bg-indigo-800 hover:bg-indigo-700">
            Vazio Infinito {gojoState.vazioInfinitoUsed ? '(Usado)' : ''}
          </Button>
        </>
      );
    }
    
    if (specialType === 'mario') {
      return (
        <Button onClick={marioMushroom} disabled={marioState.mushroomCooldown > 0} className="bg-red-500 hover:bg-red-400">
          🍄 Cogumelo {marioState.mushroomCooldown > 0 ? `(${marioState.mushroomCooldown})` : marioState.mushroomTurnsActive > 0 ? `(+15 por ${marioState.mushroomTurnsActive}t)` : ''}
        </Button>
      );
    }
    
    if (specialType === 'chronos') {
      return (
        <>
          <Button onClick={chronosRewind} disabled={!chronosState.canRewind} className="bg-cyan-600 hover:bg-cyan-500">
            ⏪ Voltar Turno
          </Button>
          <Button onClick={chronosTransform} disabled={chronosState.transformUsed} className="bg-purple-800 hover:bg-purple-700">
            ⏰ TRANSFORM {chronosState.transformUsed ? '(Usado)' : ''}
          </Button>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className={`min-h-screen overflow-x-auto ${isInfernoMode ? 'bg-gradient-to-br from-red-950 via-red-900 to-black' : 'dungeon-bg'}`}>
      <div className="min-w-max p-8">
        {/* Story */}
        <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 max-w-4xl ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-accent'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${isInfernoMode ? 'text-red-400' : 'cave-glow'}`}>📜 História</h2>
          <p className="text-sm">{story}</p>
        </div>

        {/* Character Info */}
        <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 inline-block ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'}`}>
          <h2 className="text-2xl font-bold mb-4">{character.nome}</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Arma: {character.arma}</div>
            <div>{specialType === 'yi' ? `Vidas: ${yiState.lives}` : `Vida: ${character.vida}`}</div>
            <div>Level: {character.level}</div>
            <div>Armadura: {stats.armadura}</div>
            <div>XP: {character.xp}/{character.level * 100}</div>
            {character.pointsToSpend > 0 && <div className="text-accent font-bold">Pontos: {character.pointsToSpend}</div>}
          </div>
          {specialType === 'luffy' && luffyState.currentGear > 0 && (
            <div className="mt-2 text-red-400 font-bold">⚡ Gear {luffyState.currentGear} Ativo!</div>
          )}
          {specialType === 'gojo' && gojoState.infinitoTurnsActive > 0 && (
            <div className="mt-2 text-cyan-400 font-bold">♾️ Infinito: {gojoState.infinitoTurnsActive} turnos</div>
          )}
          {character.pointsToSpend > 0 && (
            <Button onClick={() => onReturnToSheet(0)} className={`mt-4 w-full ${isInfernoMode ? 'bg-red-900 hover:bg-red-800' : 'bg-accent hover:bg-accent/90'}`}>
              Voltar à Ficha
            </Button>
          )}
        </div>

        {/* Equipment & Inventory */}
        <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 inline-block ml-4 ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'}`}>
          <h3 className="text-lg font-bold mb-2">⚔️ Equipamentos</h3>
          <div className="text-sm space-y-1">
            <div>Arma: {equippedWeapon?.nome || "Nenhuma"}</div>
            <div>Armadura: {equippedArmor?.nome || "Nenhuma"}</div>
          </div>
        </div>

        {inventory.length > 0 && (
          <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 inline-block ml-4 max-w-sm ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'}`}>
            <h3 className="text-lg font-bold mb-2">🎒 Inventário</h3>
            <div className="text-xs space-y-2 max-h-32 overflow-y-auto">
              {inventory.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-primary pb-1">
                  <span>{item.nome}</span>
                  {item.tipo === 'pocao' ? (
                    <Button onClick={() => usePotion(item, index)} size="sm" className="bg-destructive text-xs h-6">Usar</Button>
                  ) : item.tipo === 'especial' ? (
                    <span className="text-xs text-accent-foreground">✨</span>
                  ) : (
                    <Button onClick={() => equipItem(item)} size="sm" className="bg-accent text-xs h-6">Equipar</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Room Controls */}
        <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 inline-block ml-4 ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'}`}>
          <div className="text-sm font-bold mb-2">Dungeon: 100 Salas</div>
          <Button onClick={generateRooms} disabled={currentRoom > 0} className="bg-secondary hover:bg-secondary/90 border-2 border-primary">
            Gerar Nova Dungeon
          </Button>
        </div>

        {/* Rooms Display */}
        <div className="flex gap-4 mb-8">
          {visibleRooms.map((room) => (
            <div
              key={room.actualIndex}
              className={`parchment-bg p-6 rounded-sm border-4 w-48 h-48 flex flex-col items-center justify-center transition-all ${
                room.actualIndex === currentRoom 
                  ? isInfernoMode ? 'border-red-600 scale-110 shadow-lg' : 'border-accent scale-110 shadow-lg'
                  : room.actualIndex < currentRoom ? 'border-muted opacity-50' 
                  : room.isBoss ? 'border-destructive' : isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'
              }`}
            >
              <div className="text-4xl mb-2">
                {room.actualIndex < currentRoom ? '✅' : room.actualIndex === currentRoom ? '🚪' : room.isBoss ? '👑' : room.chest ? '📦' : '❓'}
              </div>
              <div className="text-center font-bold">Sala {room.actualIndex + 1}</div>
              {room.enemy && !room.cleared && room.actualIndex >= currentRoom && (
                <div className={`text-xs mt-2 ${room.isBoss ? 'text-destructive font-bold' : 'text-destructive'}`}>
                  {room.isBoss ? '⚠️ BOSS' : '⚠️ Perigo'}
                </div>
              )}
              {room.chest && room.actualIndex >= currentRoom && !room.cleared && (
                <div className="text-xs mt-1 text-amber-600 font-bold">📦 Baú!</div>
              )}
            </div>
          ))}
        </div>

        {/* Battle or Navigation */}
        {character.vida > 0 && (
          <>
            {inBattle && currentEnemy ? (
              isBossBattle ? (
                /* Boss Battle - Full Screen Style */
                <div className="fixed inset-0 z-40 flex flex-col" style={{ backgroundImage: `url(${getBossBackground(currentEnemy.nome)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 flex flex-col h-full p-8">
                    <h2 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      ⚔️ BOSS: {currentEnemy.nome} ⚔️
                    </h2>
                    
                    <div className="flex-1 flex items-center justify-around">
                      {/* Player Side */}
                      <div className="flex flex-col items-center bg-black/60 p-6 rounded-lg border-4 border-blue-500">
                        <div className={`relative ${
                          specialType === 'luffy' && luffyState.currentGear === 2 ? 'animate-luffy-gear2' :
                          specialType === 'luffy' && luffyState.currentGear === 3 ? 'animate-luffy-gear3' :
                          specialType === 'luffy' && luffyState.currentGear === 4 ? 'animate-luffy-gear4' :
                          specialType === 'luffy' && luffyState.currentGear === 5 ? 'animate-luffy-gear5' :
                          specialType === 'gojo' && gojoState.infinitoTurnsActive > 0 ? 'animate-gojo-infinity' : ''
                        }`}>
                          <img src={getHeroSprite()} alt={character.nome} className={`w-48 h-48 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`} style={{ imageRendering: 'pixelated' }} />
                        </div>
                        <div className="mt-2 text-center text-white font-bold">
                          <div className="text-xl">{character.nome}</div>
                          <div className="text-lg">{specialType === 'yi' ? `Vidas: ${yiState.lives}` : `HP: ${character.vida}`}</div>
                          {specialType === 'luffy' && luffyState.currentGear > 0 && <div className="text-orange-400">⚡ GEAR {luffyState.currentGear}</div>}
                          {specialType === 'gojo' && gojoState.infinitoTurnsActive > 0 && <div className="text-cyan-400">♾️ Infinito: {gojoState.infinitoTurnsActive}t</div>}
                        </div>
                      </div>
                      
                      {/* Special Effects */}
                      {specialAttackEffect && (
                        <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none`}>
                          {specialAttackEffect === 'sukuna-cleave' && <div className="text-8xl animate-pulse">🔪</div>}
                          {specialAttackEffect === 'sukuna-dismantle' && <div className="text-8xl animate-pulse">✂️</div>}
                          {specialAttackEffect === 'sukuna-flame' && <div className="text-8xl animate-pulse">🔥</div>}
                          {specialAttackEffect === 'sukuna-domain' && <div className="text-6xl text-red-500 font-bold animate-pulse">SANTUÁRIO MALEVOLENTE</div>}
                          {specialAttackEffect === 'gojo-blue' && <div className="w-32 h-32 rounded-full bg-blue-500 shadow-[0_0_60px_30px_rgba(59,130,246,0.8)]"></div>}
                          {specialAttackEffect === 'gojo-red' && <div className="w-24 h-24 rounded-full bg-red-500 shadow-[0_0_60px_30px_rgba(239,68,68,0.8)]"></div>}
                          {specialAttackEffect === 'gojo-purple' && <div className="w-40 h-40 rounded-full bg-purple-600 shadow-[0_0_80px_40px_rgba(147,51,234,0.8)]"></div>}
                          {specialAttackEffect === 'gojo-infinity' && <div className="text-8xl animate-spin">♾️</div>}
                          {specialAttackEffect === 'gojo-domain' && <div className="text-6xl text-indigo-400 font-bold animate-pulse">VAZIO INFINITO</div>}
                        </div>
                      )}
                      
                      {kamehamehaAnimation && (
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-yellow-400 animate-pulse z-20">
                          ⚡ KAMEHAMEHA! ⚡
                        </div>
                      )}
                      
                      {/* Boss Side */}
                      <div className="flex flex-col items-center bg-black/60 p-6 rounded-lg border-4 border-red-500">
                        <div className={`relative ${specialAttackEffect === 'chronos-transform' ? 'animate-chronos-transform' : ''}`}>
                          <img src={currentEnemy.foto} alt={currentEnemy.nome} className={`w-64 h-64 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`} style={{ imageRendering: 'pixelated' }} />
                        </div>
                        <div className="mt-2 text-center text-white">
                          <div className="text-xl font-bold text-red-400">{currentEnemy.nome}</div>
                          <div className="text-lg">HP: {currentEnemy.vida}</div>
                          {gojoState.enemyStunTurns > 0 && <div className="text-purple-400">Paralisado: {gojoState.enemyStunTurns}t</div>}
                        </div>
                      </div>
                    </div>
                    
                    {/* Boss Battle Controls */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2 bg-black/70 p-4 rounded-lg">
                      <Button onClick={attack} disabled={attackCooldown || (specialType === 'luffy' && luffyState.stunTurns > 0)} className="bg-destructive hover:bg-destructive/90 text-white font-bold">
                        {isGokuMode ? '⚡ Kamehameha' : 'Atacar'} {attackCooldown && ' (3s)'}
                      </Button>
                      {renderSpecialAttacks()}
                      {specialType === 'luffy' && (
                        <Button onClick={() => luffyState.currentGear > 0 ? setLuffyState(prev => ({ ...prev, currentGear: 0, gearTurnsActive: 0 })) : setLuffyState(prev => ({ ...prev, gearMenuOpen: !prev.gearMenuOpen }))} className="bg-red-600 hover:bg-red-500">
                          {luffyState.currentGear > 0 ? 'Desativar' : 'Gears'}
                        </Button>
                      )}
                      {specialType === 'guest1337' && (
                        <Button onClick={guest1337Block} disabled={attackCooldown} className="bg-blue-600 hover:bg-blue-500">🛡️ Bloquear</Button>
                      )}
                      {/* Boss Inventory Button */}
                      <Button onClick={() => setShowInventoryInBattle(!showInventoryInBattle)} className="bg-amber-600 hover:bg-amber-500">
                        🎒 Itens
                      </Button>
                    </div>
                    
                    {renderLuffyGearMenu()}
                    
                    {/* Inventory Popup for Boss */}
                    {showInventoryInBattle && inventory.length > 0 && (
                      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black/90 border-4 border-amber-500 p-4 rounded-lg z-50 max-w-md">
                        <h4 className="text-white font-bold mb-2">🎒 Inventário</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {inventory.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-white border-b border-amber-500/50 pb-1">
                              <span>{item.nome}</span>
                              {item.tipo === 'pocao' ? (
                                <Button onClick={() => usePotion(item, index)} size="sm" className="bg-green-600 text-xs">Usar</Button>
                              ) : item.tipo === 'especial' && item.especial === 'mantra_sombras' ? (
                                <Button onClick={() => useMantra(index)} size="sm" className="bg-purple-600 text-xs" disabled={mantraActive}>
                                  {mantraActive ? 'Ativa' : 'Usar Mantra'}
                                </Button>
                              ) : (
                                <Button onClick={() => equipItem(item)} size="sm" className="bg-accent text-xs">Equipar</Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button onClick={() => setShowInventoryInBattle(false)} className="mt-2 w-full bg-red-600">Fechar</Button>
                      </div>
                    )}
                    
                    {/* Battle Log for Boss */}
                    <div className="absolute top-4 right-4 bg-black/80 border-2 border-primary p-4 rounded-lg max-w-xs max-h-48 overflow-y-auto flex flex-col-reverse">
                      <h4 className="text-white font-bold mb-2">📜 Log</h4>
                      {battleLog.slice(-7).reverse().map((log, index) => <div key={index} className="text-white text-sm">{log}</div>)}
                    </div>
                  </div>
                </div>
              ) : (
                /* Normal Battle */
                <div className={`parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block min-w-[700px] ${isInfernoMode ? 'border-red-900 bg-red-950/80' : ''}`}>
                  <h3 className="text-xl font-bold mb-4">⚔️ Batalha: {currentEnemy.nome}</h3>
                  <div className="flex items-center justify-between gap-8 relative">
                    {/* Player */}
                    <div className="flex flex-col items-center">
                      <div className={`relative ${
                        specialType === 'luffy' && luffyState.currentGear === 2 ? 'animate-luffy-gear2' :
                        specialType === 'luffy' && luffyState.currentGear === 3 ? 'animate-luffy-gear3' :
                        specialType === 'luffy' && luffyState.currentGear === 4 ? 'animate-luffy-gear4' :
                        specialType === 'luffy' && luffyState.currentGear === 5 ? 'animate-luffy-gear5' :
                        specialType === 'gojo' && gojoState.infinitoTurnsActive > 0 ? 'animate-gojo-infinity' : ''
                      }`}>
                        <img src={getHeroSprite()} alt={character.nome} className={`w-48 h-48 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`} style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="mt-2 text-center font-bold">
                        <div>{character.nome}</div>
                        <div>{specialType === 'yi' ? `Vidas: ${yiState.lives}` : `HP: ${character.vida}`}</div>
                      </div>
                    </div>
                    
                    {/* Special Attack Effects */}
                    {specialAttackEffect && (
                      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none animate-${specialAttackEffect}`}>
                        {specialAttackEffect === 'sukuna-cleave' && <div className="text-8xl">🔪</div>}
                        {specialAttackEffect === 'sukuna-dismantle' && <div className="text-8xl">✂️</div>}
                        {specialAttackEffect === 'sukuna-flame' && <div className="text-8xl">🔥</div>}
                        {specialAttackEffect === 'sukuna-domain' && <div className="text-6xl text-red-900 font-bold bg-red-500/30 p-8 rounded-full">SANTUÁRIO</div>}
                        {specialAttackEffect === 'gojo-blue' && <div className="w-24 h-24 rounded-full bg-blue-500 shadow-[0_0_30px_15px_rgba(59,130,246,0.8)]"></div>}
                        {specialAttackEffect === 'gojo-red' && <div className="w-16 h-16 rounded-full bg-red-500 shadow-[0_0_30px_15px_rgba(239,68,68,0.8)]"></div>}
                        {specialAttackEffect === 'gojo-purple' && <div className="w-32 h-32 rounded-full bg-purple-600 shadow-[0_0_50px_25px_rgba(147,51,234,0.8)]"></div>}
                        {specialAttackEffect === 'gojo-infinity' && <div className="text-8xl">♾️</div>}
                        {specialAttackEffect === 'gojo-domain' && <div className="text-6xl text-indigo-400 font-bold">VAZIO INFINITO</div>}
                        {specialAttackEffect === 'yi-counter' && <div className="text-8xl">🛡️</div>}
                        {specialAttackEffect === 'yi-talisman' && <div className="text-8xl">📜</div>}
                        {specialAttackEffect === 'yi-explode' && <div className="w-32 h-32 rounded-full bg-orange-500 shadow-[0_0_50px_25px_rgba(255,165,0,0.8)]"></div>}
                        {specialAttackEffect === 'mario-mushroom' && <div className="text-8xl">🍄</div>}
                        {specialAttackEffect === 'chronos-rewind' && <div className="text-8xl">⏰</div>}
                        {specialAttackEffect === 'chronos-transform' && <div className="text-6xl">👶</div>}
                        {specialAttackEffect === 'block-success' && <div className="text-8xl">🛡️✨</div>}
                      </div>
                    )}
                    
                    {kamehamehaAnimation && (
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-yellow-400 animate-pulse z-20">
                        ⚡ KAMEHAMEHA! ⚡
                      </div>
                    )}
                    
                    {/* Enemy */}
                    <div className="flex flex-col items-center">
                      <div className={`relative ${specialAttackEffect === 'chronos-transform' ? 'animate-chronos-transform' : ''}`}>
                        <img src={currentEnemy.foto} alt={currentEnemy.nome} className={`w-48 h-48 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`} style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="mt-2 text-center text-sm">
                        <div className="font-bold">{currentEnemy.nome}</div>
                        <div>HP: {currentEnemy.vida}</div>
                        {gojoState.enemyStunTurns > 0 && <div className="text-purple-600 font-bold">Paralisado: {gojoState.enemyStunTurns}t</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button onClick={attack} disabled={attackCooldown || (specialType === 'luffy' && luffyState.stunTurns > 0)} className={`bg-destructive hover:bg-destructive/90 ${attackCooldown ? 'opacity-50' : ''}`}>
                      {isGokuMode ? '⚡ Kamehameha' : 'Atacar'}
                      {attackCooldown && ' (3s)'}
                    </Button>
                    
                    {renderSpecialAttacks()}
                    
                    {specialType === 'luffy' && (
                      <Button 
                        onClick={() => {
                          if (luffyState.currentGear > 0) {
                            setLuffyState(prev => ({ ...prev, currentGear: 0, gearTurnsActive: 0 }));
                            setBattleLog(prev => [...prev, '💨 Gear desativado!']);
                          } else {
                            setLuffyState(prev => ({ ...prev, gearMenuOpen: !prev.gearMenuOpen }));
                          }
                        }}
                        className="bg-red-600 hover:bg-red-500"
                      >
                        {luffyState.currentGear > 0 ? 'Desativar' : 'Gears'}
                      </Button>
                    )}
                    
                    {specialType === 'guest1337' ? (
                      <Button onClick={guest1337Block} disabled={attackCooldown} className="bg-blue-600 hover:bg-blue-500">
                        🛡️ Bloquear
                      </Button>
                    ) : (
                      <Button onClick={flee} className="bg-secondary hover:bg-secondary/90">Fugir</Button>
                    )}
                  </div>
                  
                  {renderLuffyGearMenu()}
                </div>
              )
            ) : (
              <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 inline-block min-w-[400px] ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'}`}>
                <h3 className="text-xl font-bold mb-4">🎮 Controles</h3>
                <div className="flex justify-center mb-4">
                  <img src={getHeroSprite()} alt={character.nome} className="w-48 h-48 object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
                </div>
                <p className="text-sm mb-4">Sala atual: {currentRoom + 1}/{maxRooms}</p>
                
                {specialType === 'chronos' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        value={chronosTargetRoom} 
                        onChange={(e) => setChronosTargetRoom(e.target.value)} 
                        placeholder="Sala (1-100)"
                        className="w-24"
                      />
                      <Button onClick={chronosTeleport} className="bg-cyan-600 hover:bg-cyan-500">
                        ⏰ Ir até sala
                      </Button>
                    </div>
                    <Button onClick={advanceRoom} className={`w-full font-bold text-lg px-8 py-4 ${currentRoom === maxRooms - 1 ? 'bg-yellow-600 hover:bg-yellow-500' : isInfernoMode ? 'bg-red-900 hover:bg-red-800' : 'bg-accent hover:bg-accent/90'}`}>
                      {currentRoom === maxRooms - 1 ? '🚪 ESCAPAR' : '🚪 Avançar'}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={advanceRoom} className={`font-bold text-lg px-8 py-4 w-full ${currentRoom === maxRooms - 1 ? 'bg-yellow-600 hover:bg-yellow-500' : isInfernoMode ? 'bg-red-900 hover:bg-red-800' : 'bg-accent hover:bg-accent/90'}`}>
                    {currentRoom === maxRooms - 1 ? '🚪 ESCAPAR' : '🚪 Avançar Sala'}
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Battle Log */}
        {battleLog.length > 0 && (
          <div className={`parchment-bg p-6 rounded-sm border-4 mb-8 inline-block max-w-2xl ml-4 align-top ${isInfernoMode ? 'border-red-900 bg-red-950/80' : 'border-primary'}`}>
            <h3 className="text-lg font-bold mb-4">📜 Log</h3>
            <div className="text-sm space-y-1 max-h-48 overflow-y-auto flex flex-col-reverse">
              {battleLog.slice(-7).reverse().map((log, index) => <div key={index}>{log}</div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
