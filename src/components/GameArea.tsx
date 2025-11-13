import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroSword from "@/assets/hero-sword.png";
import heroBow from "@/assets/hero-bow.png";
import heroStaff from "@/assets/hero-staff.png";
import heroAxe from "@/assets/hero-axe.png";
import bossAeternus from "@/assets/boss-aeternus.png";
import bossInfernus from "@/assets/boss-infernus.png";
import bossShadow from "@/assets/boss-shadow.png";
import bossArkanus from "@/assets/boss-arkanus.png";
import enemyUraume from "@/assets/enemy-uraume.png";
import bossBackground from "@/assets/boss-background.png";

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
  tipo: 'arma' | 'armadura' | 'pocao';
  bonus?: {
    forca?: number;
    destreza?: number;
    constituicao?: number;
    inteligencia?: number;
    poderDeFogo?: number;
    armadura?: number;
  };
  cura?: number;
}

const enemies: Enemy[] = [
  { nome: 'Adalnir', foto: 'analnir.png', forca: 6, des: 3, cons: 4, pdf: 2, int: 0, vida: 20, magia: 1 },
  { nome: 'Alma Perdida', foto: 'analnir.png', forca: 2, des: 1, cons: 1, pdf: 0, int: 0, vida: 5, magia: 10 },
  { nome: 'Esqueleto Armado (e com vida)', foto: 'analnir.png', forca: 0, des: 2, cons: 2, pdf: 5, int: 0, vida: 10, magia: 10 },
  { nome: 'Esqueleto 💀', foto: 'analnir.png', forca: 0, des: 0, cons: 0, pdf: 0, int: 0, vida: 1, magia: 1 },
  { nome: 'Bandido Perdido', foto: 'analnir.png', forca: 5, des: 2, cons: 4, pdf: 0, int: 0, vida: 20, magia: 20 },
  { nome: 'Mosca Titânica', foto: 'analnir.png', forca: 8, des: 5, cons: 7, pdf: 0, int: 0, vida: 35, magia: 100 },
  { nome: 'Guarda Sombrio', foto: 'analnir.png', forca: 5, des: 1, cons: 6, pdf: 5, int: 0, vida: 30, magia: 50 },
  { nome: 'Goblin', foto: 'analnir.png', forca: 2, des: 2, cons: 2, pdf: 2, int: 0, vida: 10, magia: 100 },
  { nome: 'Supreme Adalnir', foto: 'analnir.png', forca: 12, des: 6, cons: 8, pdf: 4, int: 0, vida: 50, magia: 100 },
  { nome: 'Uraume', foto: enemyUraume, forca: 6, des: 2, cons: 2, pdf: 0, int: 0, vida: 10, magia: 25 },
  { nome: 'Sombra', foto: 'analnir.png', forca: 1, des: 6, cons: 1, pdf: 0, int: 0, vida: 5, magia: 45 },
  { nome: 'Atenas', foto: 'analnir.png', forca: 1, des: 2, cons: 5, pdf: 6, int: 0, vida: 25, magia: 50 },
];

const bosses: Enemy[] = [
  { nome: 'Arkanus, O Guerreiro Perdido', foto: bossArkanus, forca: 8, des: 2, cons: 20, pdf: 3, int: 5, vida: 75, magia: 300 },
  { nome: 'A Sombra Primordial', foto: bossShadow, forca: 6, des: 9999, cons: 0, pdf: 0, int: 10, vida: 1, magia: 500 },
  { nome: 'Infernus Veylor, O Assasino de Vultos', foto: bossInfernus, forca: 3, des: 10, cons: 43, pdf: 15, int: 15, vida: 215, magia: 350 },
  { nome: 'Aeternus, o Deus das Sombras', foto: bossAeternus, forca: 30, des: 30, cons: 100, pdf: 20, int: 30, vida: 750, magia: 2000 },
];

export default function GameArea({ character: initialCharacter, onCharacterUpdate, onReturnToSheet, initialRoom = 0 }: Props) {
  const [character, setCharacter] = useState(initialCharacter);
  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  
  // Atualiza a sala atual quando initialRoom mudar (retornando do level up)
  useEffect(() => {
    setCurrentRoom(initialRoom);
  }, [initialRoom]);
  const [maxRooms] = useState(100);
  
  // Calcula o checkpoint mais próximo (múltiplo de 10)
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

  const advanceRoom = () => {
    if (currentRoom >= maxRooms - 1) {
      setBattleLog(prev => [...prev, "🎉 Você completou todas as salas!"]);
      setStory("Você completou a Dungeon das Sombras! Parabéns, herói!");
      return;
    }

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
      forca: character.forca + (weaponBonus.forca || 0) + (armorBonus.forca || 0),
      poderDeFogo: character.poderDeFogo + (weaponBonus.poderDeFogo || 0) + (armorBonus.poderDeFogo || 0),
      armadura: character.armadura + (armorBonus.armadura || 0),
    };
  };

  const attack = () => {
    if (!currentEnemy || !inBattle) return;

    // Animação de ataque
    setAttackAnimation(true);
    setTimeout(() => setAttackAnimation(false), 300);

    const stats = getTotalStats();
    
    // Se usar arco, usa poder de fogo ao invés de força
    const attackStat = character.arma === 'Arco' ? stats.poderDeFogo : stats.forca;
    
    // Inteligência adiciona ao dado
    const playerDamage = Math.max(1, attackStat + stats.poderDeFogo + character.inteligencia + Math.floor(Math.random() * 6));
    
    // Sistema de esquiva: se o jogador tiver mais destreza, 50% chance de desviar
    let enemyDamage = 0;
    let dodged = false;
    
    if (character.destreza > currentEnemy.des) {
      dodged = Math.random() < 0.5;
    }
    
    if (!dodged) {
      enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(stats.armadura / 5));
    }

    const newEnemyHp = currentEnemy.vida - playerDamage;
    const newPlayerHp = character.vida - enemyDamage;

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

  const stats = getTotalStats();
  
  // Determina a pixel art do herói baseado na arma
  const getHeroSprite = () => {
    switch(character.arma) {
      case 'Espada': return heroSword;
      case 'Arco': return heroBow;
      case 'Cajado': case 'Fé': return heroStaff;
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
                  backgroundImage: `url(${bossBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="w-full max-w-4xl mx-auto">
                  <div className="bg-black/80 border-8 border-white p-8 rounded-sm min-h-[600px] flex flex-col">
                    {/* Boss Sprite */}
                    <div className="flex justify-center mb-8">
                      <img 
                        src={currentEnemy.foto} 
                        alt={currentEnemy.nome}
                        className={`w-96 h-96 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`}
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    
                    {/* Boss Info */}
                    <div className="text-white text-center mb-8">
                      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'monospace' }}>
                        {currentEnemy.nome}
                      </h2>
                      <div className="flex justify-center gap-4 text-lg">
                        <span>HP: {currentEnemy.vida}</span>
                        <span>ATK: {currentEnemy.forca}</span>
                        <span>DEF: {currentEnemy.cons}</span>
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
                      onClick={flee}
                      className="border-4 border-yellow-400 bg-black text-yellow-400 px-12 py-6 text-2xl font-bold hover:bg-yellow-400 hover:text-black transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      ❤️ MERCY
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ) : inBattle && currentEnemy ? (
              /* Batalha Normal */
              <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block min-w-[400px]">
                <h3 className="text-xl font-bold mb-4">🎮 Controles</h3>
                <div className="flex items-center gap-4">
                  <img 
                    src={getHeroSprite()} 
                    alt={character.nome}
                    className={`w-48 h-48 object-contain pixelated ${attackAnimation ? 'animate-shake' : ''}`}
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">⚔️ Batalha: {currentEnemy.nome}</h4>
                  <div className="mb-4 text-sm">
                    <div>Vida do Inimigo: {currentEnemy.vida}</div>
                    <div>Força: {currentEnemy.forca} | Destreza: {currentEnemy.des} | Magia: {currentEnemy.magia}</div>
                  </div>
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
