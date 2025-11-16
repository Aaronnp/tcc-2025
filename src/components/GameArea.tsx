import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VictoryScreen from "@/components/VictoryScreen";
import heroSword from "@/assets/hero-sword.png";
import heroBow from "@/assets/hero-bow.png";
import heroStaff from "@/assets/hero-staff.png";
import heroAxe from "@/assets/hero-axe.png";
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
}

interface Props {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
  onReturnToSheet: (currentRoom: number) => void;
  initialRoom?: number;
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
  especial?: string; // Para itens especiais como "Mantra das Sombras"
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
  { nome: 'Infernus Veylor, O Assasino de Vultos', foto: bossInfernus, forca: 3, des: 10, cons: 43, pdf: 15, int: 15, vida: 215, magia: 350 },
  { nome: 'Aeternus, o Deus das Sombras', foto: bossAeternus, forca: 30, des: 30, cons: 100, pdf: 20, int: 30, vida: 750, magia: 2000 },
];

const getBossBackground = (bossName: string) => {
  if (bossName.includes('Arkanus')) return bossArkanusBackground;
  if (bossName.includes('Sombra Primordial')) return bossShadowBackground;
  if (bossName.includes('Infernus')) return bossInfernusBackground;
  if (bossName.includes('Aeternus')) return bossAeternusBackground;
  return bossBackground;
};

export default function GameArea({ character: initialCharacter, onCharacterUpdate, onReturnToSheet, initialRoom = 0 }: Props) {
  const [character, setCharacter] = useState(initialCharacter);
  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  
  // Atualiza a sala atual quando initialRoom mudar (retornando do level up)
  useEffect(() => {
    setCurrentRoom(initialRoom);
  }, [initialRoom]);
  const [maxRooms] = useState(100);
  
  // Estatísticas da run
  const [startTime] = useState(Date.now());
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [potionsUsed, setPotionsUsed] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [bossesDefeated, setBossesDefeated] = useState(0);
  const [hasCollectedMantra, setHasCollectedMantra] = useState(false);
  const [hasCollectedShadowGear, setHasCollectedShadowGear] = useState(false);
  const [hasCollectedLightGear, setHasCollectedLightGear] = useState(false);
  const [neverDied, setNeverDied] = useState(true);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  
  // Calcula o checkpoint mais próximo (múltiplo de 10)
  const [damageAnimation, setDamageAnimation] = useState<{show: boolean, damage: number, x: number, y: number}>({
    show: false,
    damage: 0,
    x: 0,
    y: 0
  });
  const [showInventoryInBattle, setShowInventoryInBattle] = useState(false);
  const [mantraActive, setMantraActive] = useState(false);
  const [mantraPenalty, setMantraPenalty] = useState({ armadura: 0, ataque: 0 });
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

  useEffect(() => {
    generateRooms();
  }, [maxRooms]);

  const generateRooms = () => {
    const newRooms = Array.from({ length: maxRooms }, (_, index) => {
      const roomNumber = index + 1;
      const isBossRoom = roomNumber % 25 === 0;
      
      if (isBossRoom) {
        const bossIndex = Math.min(Math.floor(roomNumber / 25) - 1, bosses.length - 1);
        return {
          enemy: { ...bosses[bossIndex] },
          cleared: false,
          isBoss: true,
          chest: null,
        };
      }
      
      // Baús especiais em salas específicas
      if (roomNumber === 45) {
        return {
          enemy: null,
          cleared: false,
          isBoss: false,
          chest: {
            nome: 'Mantra das Sombras',
            tipo: 'especial' as const,
            especial: 'mantra_sombras',
          },
        };
      }
      
      if (roomNumber === 70) {
        return {
          enemy: null,
          cleared: false,
          isBoss: false,
          chest: {
            nome: 'Armadura das Sombras',
            tipo: 'armadura' as const,
            bonus: { armadura: 10 },
          },
        };
      }
      
      if (roomNumber === 98) {
        return {
          enemy: null,
          cleared: false,
          isBoss: false,
          chest: {
            nome: 'Armadura de Luz',
            tipo: 'armadura' as const,
            bonus: { armadura: 25 },
          },
        };
      }
      
      const hasEnemy = Math.random() < 0.3; // 30% chance de inimigo
      const hasChest = !hasEnemy && Math.random() < 0.15; // 15% chance de baú se não tiver inimigo
      
      return {
        enemy: hasEnemy ? { ...enemies[Math.floor(Math.random() * enemies.length)] } : null,
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
      return {
        nome: `Arma Mágica +${Math.floor(Math.random() * 5) + 1}`,
        tipo: 'arma',
        bonus: {
          forca: Math.floor(Math.random() * 3) + 1,
          poderDeFogo: Math.floor(Math.random() * 3) + 1,
        },
      };
    } else {
      return {
        nome: `Armadura +${Math.floor(Math.random() * 5) + 1}`,
        tipo: 'armadura',
        bonus: {
          armadura: Math.floor(Math.random() * 10) + 5,
          constituicao: Math.floor(Math.random() * 2) + 1,
        },
      };
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

  const advanceRoom = () => {
    if (currentRoom >= maxRooms - 1) {
      setBattleLog(prev => [...prev, "🎉 Você completou todas as salas!"]);
      setStory("Você completou a Dungeon das Sombras! Parabéns, herói!");
      return;
    }

    playDoorSound();
    const nextRoom = currentRoom + 1;
    const room = rooms[nextRoom];

    if (room.enemy && !room.cleared) {
      setCurrentEnemy({ ...room.enemy });
      setInBattle(true);
      if (room.isBoss) {
        setBattleLog([`🔥 BOSS APARECEU: ${room.enemy.nome}!`]);
        setStory(`Um chefe poderoso bloqueia seu caminho: ${room.enemy.nome}!`);
      } else {
        setBattleLog([`⚔️ Um ${room.enemy.nome} apareceu!`]);
      }
    } else if (room.chest) {
      const potion: Item = {
        nome: 'Poção de Vida',
        tipo: 'pocao',
        cura: 20 + Math.floor(Math.random() * 30),
      };
      setBattleLog([`✅ Sala ${nextRoom + 1}: Você encontrou um baú com ${room.chest.nome} e uma Poção de Vida! 📦`]);
      setInventory(prev => [...prev, room.chest!, potion]);
      setCurrentRoom(nextRoom);
    } else {
      setBattleLog([`✅ Sala ${nextRoom + 1} está vazia e segura.`]);
      setCurrentRoom(nextRoom);
    }
  };

  const getTotalStats = () => {
    const weaponBonus = equippedWeapon?.bonus || {};
    const armorBonus = equippedArmor?.bonus || {};
    
    return {
      forca: character.forca + (weaponBonus.forca || 0) + (armorBonus.forca || 0) - mantraPenalty.ataque,
      poderDeFogo: character.poderDeFogo + (weaponBonus.poderDeFogo || 0) + (armorBonus.poderDeFogo || 0),
      armadura: character.armadura + (armorBonus.armadura || 0) - mantraPenalty.armadura,
    };
  };
  
  const playAttackSound = (weaponType: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Sons diferentes por arma
    switch(weaponType) {
      case 'Espada':
        oscillator.frequency.value = 250;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      case 'Arco':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'Cajado':
        oscillator.frequency.value = 400;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        oscillator.stop(audioContext.currentTime + 0.25);
        break;
      case 'Machado':
        oscillator.frequency.value = 150;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      default:
        oscillator.frequency.value = 300;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.stop(audioContext.currentTime + 0.15);
    }
    
    oscillator.start(audioContext.currentTime);
  };

  const playHealSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  };

  const playDamageSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 100;
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const attack = () => {
    if (!currentEnemy || !inBattle) return;

    // Tocar som de ataque baseado na arma
    playAttackSound(character.arma);
    
    // Animação de ataque
    setAttackAnimation(true);
    setTimeout(() => setAttackAnimation(false), 300);

    const stats = getTotalStats();
    
    // Verificar se tem Mantra das Sombras para atacar o segundo boss
    const hasMantraDosSombras = inventory.some(item => item.especial === 'mantra_sombras');
    
    // Se for o segundo boss e não tiver a Mantra ativada, o ataque erra
    if (currentEnemy.nome === 'A Sombra Primordial' && !mantraActive) {
      setBattleLog(prev => [
        ...prev,
        `⚔️ Seu ataque passou através da Sombra Primordial! Você precisa usar a Mantra das Sombras para acertá-la!`,
      ]);
      
      // Inimigo ataca de volta
      const enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(stats.armadura / 5));
      const newPlayerHp = character.vida - enemyDamage;
      
      playDamageSound();
      setBattleLog(prev => [...prev, `💥 A Sombra Primordial causou ${enemyDamage} de dano!`]);
      
      if (newPlayerHp <= 0) {
        setBattleLog(prev => [...prev, `💀 Você foi derrotado! Game Over.`]);
        setNeverDied(false);
        const updatedChar = { ...character, vida: 0 };
        setCharacter(updatedChar);
        onCharacterUpdate(updatedChar);
        setInBattle(false);
      } else {
        const updatedChar = { ...character, vida: newPlayerHp };
        setCharacter(updatedChar);
        onCharacterUpdate(updatedChar);
      }
      return;
    }
    
    // Se usar arco, usa poder de fogo ao invés de força
    const attackStat = character.arma === 'Arco' ? stats.poderDeFogo : stats.forca;
    
    // Adicionar bônus de dano da arma equipada
    const weaponDamageBonus = equippedWeapon?.bonus?.dano || 0;
    
    // Inteligência adiciona ao dado
    const playerDamage = Math.max(1, attackStat + stats.poderDeFogo + character.inteligencia + weaponDamageBonus + Math.floor(Math.random() * 6));
    
    // Rastrear dano total causado
    setTotalDamageDealt(prev => prev + playerDamage);
    
    // Sistema de esquiva: se o jogador tiver mais destreza, 50% chance de desviar
    let enemyDamage = 0;
    let dodged = false;
    
    if (character.destreza > currentEnemy.des) {
      dodged = Math.random() < 0.5;
    }
    
    if (!dodged) {
      enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(stats.armadura / 5));
      playDamageSound();
    }

    const newEnemyHp = currentEnemy.vida - playerDamage;
    const newPlayerHp = character.vida - enemyDamage;
    
    // Mostrar dano animado no boss
    const isBossBattle = rooms[currentRoom + 1]?.isBoss;
    if (isBossBattle) {
      setDamageAnimation({
        show: true,
        damage: playerDamage,
        x: Math.random() * 300 + 50,
        y: Math.random() * 200 + 50
      });
      setTimeout(() => setDamageAnimation({ show: false, damage: 0, x: 0, y: 0 }), 1000);
    }

    if (dodged) {
      setBattleLog(prev => [
        ...prev,
        `⚔️ Você causou ${playerDamage} de dano!`,
        `💨 Você desviou do ataque do inimigo!`,
      ]);
    } else {
      setBattleLog(prev => [
        ...prev,
        `⚔️ Você causou ${playerDamage} de dano!`,
        `💥 Inimigo causou ${enemyDamage} de dano!`,
      ]);
    }

    if (newEnemyHp <= 0) {
      const xpGained = 100;
      const newXP = character.xp + xpGained;
      const xpNeeded = character.level * 100;
      let newLevel = character.level;
      let newPointsToSpend = character.pointsToSpend;
      
      // Rastrear inimigos/bosses derrotados
      if (isBossBattle) {
        setBossesDefeated(prev => prev + 1);
        
        // Limpar mantra após derrotar um boss
        if (mantraActive) {
          setMantraActive(false);
          setMantraPenalty({ armadura: 0, ataque: 0 });
          setInventory(prev => prev.filter(item => item.especial !== 'mantra_sombras'));
        }
        
        // Verificar se derrotou o boss final
        if (currentEnemy.nome === 'Aeternus, o Deus das Sombras') {
          const timeElapsed = Date.now() - startTime;
          const minutes = Math.floor(timeElapsed / 60000);
          const seconds = Math.floor((timeElapsed % 60000) / 1000);
          setShowVictoryScreen(true);
        }
      } else {
        setEnemiesDefeated(prev => prev + 1);
      }
      
      if (newXP >= xpNeeded) {
        newLevel++;
        newPointsToSpend++;
        setBattleLog(prev => [...prev, `🎯 Você derrotou ${currentEnemy.nome}! +${xpGained} XP`, `🎊 LEVEL UP! Agora você é nível ${newLevel}! (+1 ponto para gastar)`]);
      } else {
        setBattleLog(prev => [...prev, `🎯 Você derrotou ${currentEnemy.nome}! +${xpGained} XP`]);
      }
      
      const updatedChar = { 
        ...character, 
        vida: newPlayerHp, 
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
    } else if (newPlayerHp <= 0) {
      setBattleLog(prev => [...prev, `💀 Você foi derrotado! Game Over.`]);
      const updatedChar = { ...character, vida: 0 };
      setCharacter(updatedChar);
      onCharacterUpdate(updatedChar);
      setInBattle(false);
    } else {
      setCurrentEnemy({ ...currentEnemy, vida: newEnemyHp });
      const updatedChar = { ...character, vida: newPlayerHp };
      setCharacter(updatedChar);
      onCharacterUpdate(updatedChar);
    }
  };

  const flee = () => {
    if (Math.random() < 0.5) {
      setBattleLog(prev => [...prev, `🏃 Você fugiu com sucesso!`]);
      setCurrentEnemy(null);
      setInBattle(false);
      // Avança uma porta ao fugir
      setCurrentRoom(currentRoom + 1);
    } else {
      const stats = getTotalStats();
      const enemyDamage = Math.max(1, (currentEnemy?.forca || 0) + Math.floor(Math.random() * 4));
      const newPlayerHp = character.vida - enemyDamage;
      setBattleLog(prev => [...prev, `❌ Falha ao fugir! Você levou ${enemyDamage} de dano.`]);
      
      if (newPlayerHp <= 0) {
        setBattleLog(prev => [...prev, `💀 Você foi derrotado! Game Over.`]);
        const updatedChar = { ...character, vida: 0 };
        setCharacter(updatedChar);
        onCharacterUpdate(updatedChar);
        setInBattle(false);
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
      setBattleLog(prev => [...prev, `⚔️ Você equipou: ${item.nome}`]);
    } else if (item.tipo === 'armadura') {
      setEquippedArmor(item);
      setBattleLog(prev => [...prev, `🛡️ Você equipou: ${item.nome}`]);
    } else if (item.tipo === 'especial') {
      setBattleLog(prev => [...prev, `✨ ${item.nome} obtida! Agora você pode atacar a Sombra Primordial!`]);
    }
  };

  const usePotion = (item: Item, index: number) => {
    if (item.tipo === 'pocao' && item.cura) {
      const maxHp = 10 + character.constituicao * 2;
      const newHp = Math.min(character.vida + item.cura, maxHp);
      const updatedChar = { ...character, vida: newHp };
      setCharacter(updatedChar);
      onCharacterUpdate(updatedChar);
      setBattleLog(prev => [...prev, `💚 Você usou ${item.nome} e recuperou ${item.cura} de vida!`]);
      setInventory(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const useMantra = (index: number) => {
    setMantraActive(true);
    setMantraPenalty({ armadura: 1, ataque: 1 });
    setBattleLog(prev => [...prev, `✨ Você ativou a Mantra das Sombras! (-1 Armadura, -1 Ataque)`]);
    setBattleLog(prev => [...prev, `⚡ Agora você pode atacar a Sombra Primordial!`]);
    // Não remove do inventário aqui, apenas após a batalha
  };

  const stats = getTotalStats();
  
  // Determina a pixel art do herói baseado na arma
  const getHeroSprite = () => {
    switch(character.arma) {
      case 'Espada': return heroSword;
      case 'Arco': return heroBow;
      case 'Cajado': return heroStaff;
      case 'Machado': return heroAxe;
      default: return heroSword;
    }
  };

  // Sistema de janela deslizante: mostra portas em intervalos de 5 (1-5, 6-10, 11-15, etc.)
  const getVisibleRooms = () => {
    const startRoom = Math.floor(currentRoom / 5) * 5;
    const endRoom = Math.min(maxRooms, startRoom + 5);
    return rooms.slice(startRoom, endRoom).map((room, index) => ({
      ...room,
      actualIndex: startRoom + index
    }));
  };

  const visibleRooms = getVisibleRooms();
  const isBossBattle = rooms[currentRoom + 1]?.isBoss;

  return (
    <div className="min-h-screen dungeon-bg overflow-x-auto">
      <div className="min-w-max p-8">
        {/* Story Section */}
        <div className="parchment-bg p-6 rounded-sm border-4 border-accent mb-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-2 cave-glow">📜 História</h2>
          <p className="text-sm">{story}</p>
        </div>

        {/* Character Info */}
        <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block">
          <h2 className="text-2xl font-bold mb-4">{character.nome}</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Arma: {character.arma}</div>
            <div>Vida: {character.vida}</div>
            <div>Level: {character.level}</div>
            <div>Armadura: {stats.armadura}</div>
            <div>XP: {character.xp}/{character.level * 100}</div>
            {character.pointsToSpend > 0 && (
              <div className="text-accent font-bold">Pontos: {character.pointsToSpend}</div>
            )}
          </div>
          <div className="mt-4 text-xs border-t-2 border-primary pt-2">
            Força: {stats.forca} | Destreza: {character.destreza} | Constituição: {character.constituicao} | 
            Inteligência: {character.inteligencia} | Poder de Fogo: {stats.poderDeFogo}
          </div>
          {character.pointsToSpend > 0 && (
            <Button 
              onClick={() => {
                const checkpoint = getLastCheckpoint(currentRoom);
                onReturnToSheet(checkpoint);
              }}
              className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Voltar à Ficha (Gastar Pontos)
              {currentRoom > 0 && (
                <span className="text-xs ml-2">
                  (Voltar {currentRoom - getLastCheckpoint(currentRoom)} {currentRoom - getLastCheckpoint(currentRoom) === 1 ? 'sala' : 'salas'})
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Equipment */}
        <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block ml-4">
          <h3 className="text-lg font-bold mb-2">⚔️ Equipamentos</h3>
          <div className="text-sm space-y-1">
            <div>Arma: {equippedWeapon?.nome || "Nenhuma"}</div>
            <div>Armadura: {equippedArmor?.nome || "Nenhuma"}</div>
          </div>
        </div>

        {/* Inventory */}
        {inventory.length > 0 && (
          <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block ml-4 max-w-sm">
            <h3 className="text-lg font-bold mb-2">🎒 Inventário</h3>
            <div className="text-xs space-y-2 max-h-32 overflow-y-auto">
              {inventory.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-primary pb-1">
                  <span>{item.nome}</span>
                  {item.tipo === 'pocao' ? (
                    <Button 
                      onClick={() => usePotion(item, index)}
                      size="sm"
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs h-6"
                    >
                      Usar
                    </Button>
                  ) : item.tipo === 'especial' ? (
                    <span className="text-xs text-accent-foreground">✨ Item Especial</span>
                  ) : (
                    <Button 
                      onClick={() => equipItem(item)}
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-6"
                    >
                      Equipar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Room Controls */}
        <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block ml-4">
          <div className="text-sm font-bold mb-2">Dungeon: 100 Salas</div>
          <Button 
            onClick={generateRooms} 
            disabled={currentRoom > 0}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-2 border-primary"
          >
            Gerar Nova Dungeon
          </Button>
        </div>

        {/* Rooms Display - Sistema de janela deslizante */}
        <div className="flex gap-4 mb-8">
          {visibleRooms.map((room, index) => (
            <div
              key={room.actualIndex}
              className={`parchment-bg p-6 rounded-sm border-4 w-48 h-48 flex flex-col items-center justify-center transition-all ${
                room.actualIndex === currentRoom 
                  ? 'border-accent scale-110 shadow-lg' 
                  : room.actualIndex < currentRoom 
                    ? 'border-muted opacity-50' 
                    : room.isBoss
                      ? 'border-destructive'
                      : 'border-primary'
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
              {room.chest && room.actualIndex >= currentRoom && (
                <div className="text-xs mt-2 text-accent">🎁 Baú</div>
              )}
            </div>
          ))}
        </div>

        {/* Battle or Navigation - Sempre visível */}
        {character.vida > 0 && (
          <>
            {inBattle && currentEnemy && isBossBattle ? (
              /* Tela de Batalha Estilo Undertale para Bosses */
              <div 
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{
                  backgroundImage: `url(${getBossBackground(currentEnemy.nome)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Tocar música do boss final */}
                {currentEnemy.nome === 'Aeternus, o Deus das Sombras' && (
                  <audio autoPlay loop>
                    <source src="/boss-music.mp3" type="audio/mpeg" />
                  </audio>
                )}
                <div className="w-full max-w-4xl mx-auto relative">
                  <div className="bg-black/80 border-8 border-white p-8 rounded-sm min-h-[600px] flex flex-col">
                    {/* Boss Sprite */}
                    <div className="flex justify-center mb-8 relative">
                      <img 
                        src={currentEnemy.foto} 
                        alt={currentEnemy.nome}
                        className={`w-96 h-96 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`}
                        style={{ imageRendering: 'pixelated' }}
                      />
                      {damageAnimation.show && (
                        <div 
                          className="absolute text-red-500 font-bold text-6xl animate-fade-out pointer-events-none"
                          style={{ 
                            left: `${damageAnimation.x}px`, 
                            top: `${damageAnimation.y}px`,
                            fontFamily: 'monospace',
                            textShadow: '2px 2px 4px black'
                          }}
                        >
                          -{damageAnimation.damage}
                        </div>
                      )}
                      {attackAnimation && (
                        <img 
                          src={slashEffect}
                          alt="slash"
                          className="absolute w-64 h-64 object-contain animate-fade-in pointer-events-none"
                          style={{ imageRendering: 'pixelated', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                        />
                      )}
                    </div>
                    
                    {/* Boss Info */}
                    <div className="text-white text-center mb-8 drop-shadow-lg">
                      <h2 className="text-3xl font-bold mb-2 drop-shadow-lg" style={{ fontFamily: 'monospace' }}>
                        {currentEnemy.nome}
                      </h2>
                      <div className="flex justify-center gap-4 text-lg drop-shadow-lg">
                        <span>HP: {currentEnemy.vida}</span>
                        <span>ATK: {currentEnemy.forca}</span>
                        <span>DEF: {currentEnemy.cons}</span>
                      </div>
                      <div className="mt-4 text-yellow-300 text-xl font-bold drop-shadow-lg" style={{ fontFamily: 'monospace' }}>
                        SEU HP: {character.vida}
                      </div>
                    </div>
                  
                  {/* Battle Box - Undertale Style */}
                  <div className="border-8 border-white bg-black p-8 flex justify-around items-center mt-auto">
                    <button
                      onClick={attack}
                      className="border-4 border-orange-500 bg-black text-orange-500 px-12 py-6 text-2xl font-bold hover:bg-orange-500 hover:text-black transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      ⚔️ FIGHT
                    </button>
                    <button
                      onClick={() => setShowInventoryInBattle(!showInventoryInBattle)}
                      className="border-4 border-blue-500 bg-black text-blue-500 px-12 py-6 text-2xl font-bold hover:bg-blue-500 hover:text-black transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      🎒 ITEM
                    </button>
                  </div>
                  
                  {/* Inventory in Battle */}
                  {showInventoryInBattle && (
                    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black border-8 border-white p-6 max-w-md w-full">
                      <h3 className="text-white text-xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>ITENS</h3>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {inventory.filter(item => item.tipo === 'pocao' || item.especial === 'mantra_sombras').length === 0 ? (
                          <p className="text-white" style={{ fontFamily: 'monospace' }}>Sem itens disponíveis</p>
                        ) : (
                          inventory.map((item, index) => {
                            if (item.tipo === 'pocao') {
                              return (
                                <button
                                  key={index}
                                  onClick={() => {
                                    usePotion(item, index);
                                    setShowInventoryInBattle(false);
                                  }}
                                  className="w-full text-left text-white border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-all"
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  {item.nome} (+{item.cura} HP)
                                </button>
                              );
                            } else if (item.especial === 'mantra_sombras' && !mantraActive) {
                              return (
                                <button
                                  key={index}
                                  onClick={() => {
                                    useMantra(index);
                                    setShowInventoryInBattle(false);
                                  }}
                                  className="w-full text-left text-purple-400 border-2 border-purple-400 px-4 py-2 hover:bg-purple-400 hover:text-black transition-all"
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  ✨ {item.nome} (Use contra a Sombra)
                                </button>
                              );
                            } else if (item.especial === 'mantra_sombras' && mantraActive) {
                              return (
                                <div
                                  key={index}
                                  className="w-full text-left text-gray-500 border-2 border-gray-500 px-4 py-2"
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  ✨ {item.nome} (Ativa)
                                </div>
                              );
                            }
                            return null;
                          })
                        )}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            ) : inBattle && currentEnemy ? (
              /* Batalha Normal */
              <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block min-w-[600px]">
                <h3 className="text-xl font-bold mb-4">⚔️ Batalha: {currentEnemy.nome}</h3>
                <div className="flex items-center justify-between gap-8 relative">
                  {/* Herói à esquerda */}
                  <div className="flex flex-col items-center">
                    <img 
                      src={getHeroSprite()} 
                      alt={character.nome}
                      className={`w-48 h-48 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`}
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="mt-2 text-center font-bold">
                      <div>{character.nome}</div>
                      <div>HP: {character.vida}</div>
                    </div>
                  </div>
                  
                  {/* Animação de dano no centro */}
                  {damageAnimation.show && (
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <img 
                        src={slashEffect}
                        alt="slash"
                        className="w-32 h-32 object-contain animate-fade-in pointer-events-none"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div 
                        className="absolute text-red-500 font-bold text-4xl animate-fade-out"
                        style={{ 
                          left: '50%', 
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontFamily: 'monospace',
                          textShadow: '2px 2px 4px black'
                        }}
                      >
                        -{damageAnimation.damage}
                      </div>
                    </div>
                  )}
                  
                  {/* Inimigo à direita */}
                  <div className="flex flex-col items-center">
                    <img 
                      src={currentEnemy.foto} 
                      alt={currentEnemy.nome}
                      className={`w-48 h-48 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`}
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="mt-2 text-center text-sm">
                      <div className="font-bold">{currentEnemy.nome}</div>
                      <div>HP: {currentEnemy.vida}</div>
                      <div className="text-xs">ATK: {currentEnemy.forca} | DEX: {currentEnemy.des}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="space-x-4">
                    <Button onClick={attack} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Atacar
                    </Button>
                    <Button onClick={flee} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      Fugir
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Navegação */
              <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block min-w-[400px]">
                <h3 className="text-xl font-bold mb-4">🎮 Controles</h3>
                <div className="flex justify-center mb-4">
                  <img 
                    src={getHeroSprite()} 
                    alt={character.nome}
                    className="w-48 h-48 object-contain pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div>
                  <p className="text-sm mb-4">Sala atual: {currentRoom + 1}/{maxRooms}</p>
                  <Button 
                    onClick={advanceRoom}
                    disabled={currentRoom >= maxRooms - 1}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-4 w-full"
                  >
                    Avançar Sala ➡️
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Battle Log */}
        {battleLog.length > 0 && (
          <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block max-w-2xl ml-4 align-top">
            <h3 className="text-lg font-bold mb-4">📜 Log de Eventos</h3>
            <div className="text-sm space-y-1 max-h-48 overflow-y-auto">
              {battleLog.slice(-15).map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
