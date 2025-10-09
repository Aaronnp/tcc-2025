import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Character {
  nome: string;
  foto: string;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  carisma: number;
  vida: number;
  armadura: number;
  arma: string;
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
  { nome: 'Uraume', foto: 'analnir.png', forca: 6, des: 2, cons: 2, pdf: 0, int: 0, vida: 10, magia: 25 },
  { nome: 'Sombra', foto: 'analnir.png', forca: 1, des: 6, cons: 1, pdf: 0, int: 0, vida: 5, magia: 45 },
  { nome: 'Atenas', foto: 'analnir.png', forca: 1, des: 2, cons: 5, pdf: 6, int: 0, vida: 25, magia: 50 },
];

export default function GameArea({ character: initialCharacter }: Props) {
  const [character, setCharacter] = useState(initialCharacter);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [maxRooms, setMaxRooms] = useState(10);
  const [rooms, setRooms] = useState<Array<{ enemy: Enemy | null; cleared: boolean }>>([]);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [inBattle, setInBattle] = useState(false);

  useEffect(() => {
    generateRooms();
  }, [maxRooms]);

  const generateRooms = () => {
    const newRooms = Array.from({ length: maxRooms }, () => {
      const hasEnemy = Math.random() < 0.1; // 10% chance
      return {
        enemy: hasEnemy ? enemies[Math.floor(Math.random() * enemies.length)] : null,
        cleared: false,
      };
    });
    setRooms(newRooms);
    setCurrentRoom(0);
  };

  const advanceRoom = () => {
    if (currentRoom >= maxRooms - 1) {
      setBattleLog(prev => [...prev, "🎉 Você completou todas as salas! História em breve..."]);
      return;
    }

    const nextRoom = currentRoom + 1;
    const room = rooms[nextRoom];

    if (room.enemy && !room.cleared) {
      setCurrentEnemy({ ...room.enemy });
      setInBattle(true);
      setBattleLog([`⚔️ Um ${room.enemy.nome} apareceu!`]);
    } else {
      setBattleLog([`✅ Sala ${nextRoom + 1} está vazia e segura.`]);
      setCurrentRoom(nextRoom);
    }
  };

  const attack = () => {
    if (!currentEnemy || !inBattle) return;

    const playerDamage = Math.max(1, character.forca + Math.floor(Math.random() * 6));
    const enemyDamage = Math.max(1, currentEnemy.forca + Math.floor(Math.random() * 6) - Math.floor(character.armadura / 5));

    const newEnemyHp = currentEnemy.vida - playerDamage;
    const newPlayerHp = character.vida - enemyDamage;

    setBattleLog(prev => [
      ...prev,
      `⚔️ Você causou ${playerDamage} de dano!`,
      `💥 Inimigo causou ${enemyDamage} de dano!`,
    ]);

    if (newEnemyHp <= 0) {
      setBattleLog(prev => [...prev, `🎯 Você derrotou ${currentEnemy.nome}!`]);
      const updatedRooms = [...rooms];
      updatedRooms[currentRoom + 1].cleared = true;
      setRooms(updatedRooms);
      setCurrentEnemy(null);
      setInBattle(false);
      setCurrentRoom(currentRoom + 1);
    } else if (newPlayerHp <= 0) {
      setBattleLog(prev => [...prev, `💀 Você foi derrotado! Game Over.`]);
      setCharacter({ ...character, vida: 0 });
      setInBattle(false);
    } else {
      setCurrentEnemy({ ...currentEnemy, vida: newEnemyHp });
      setCharacter({ ...character, vida: newPlayerHp });
    }
  };

  const flee = () => {
    if (Math.random() < 0.5) {
      setBattleLog(prev => [...prev, `🏃 Você fugiu com sucesso!`]);
      setCurrentEnemy(null);
      setInBattle(false);
    } else {
      const enemyDamage = Math.max(1, (currentEnemy?.forca || 0) + Math.floor(Math.random() * 4));
      const newPlayerHp = character.vida - enemyDamage;
      setBattleLog(prev => [...prev, `❌ Falha ao fugir! Você levou ${enemyDamage} de dano.`]);
      
      if (newPlayerHp <= 0) {
        setBattleLog(prev => [...prev, `💀 Você foi derrotado! Game Over.`]);
        setCharacter({ ...character, vida: 0 });
        setInBattle(false);
      } else {
        setCharacter({ ...character, vida: newPlayerHp });
      }
    }
  };

  return (
    <div className="min-h-screen dungeon-bg overflow-x-auto">
      <div className="min-w-max p-8">
        {/* Character Info */}
        <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block">
          <h2 className="text-2xl font-bold mb-4">{character.nome}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Arma: {character.arma}</div>
            <div>Vida: {character.vida}</div>
            <div>Armadura: {character.armadura}</div>
          </div>
          <div className="mt-4 text-xs border-t-2 border-primary pt-2">
            Força: {character.forca} | Destreza: {character.destreza} | Constituição: {character.constituicao} | 
            Inteligência: {character.inteligencia} | Carisma: {character.carisma}
          </div>
        </div>

        {/* Room Controls */}
        <div className="parchment-bg p-6 rounded-sm border-4 border-primary mb-8 inline-block ml-4">
          <div className="mb-4">
            <Label htmlFor="maxRooms" className="text-sm font-bold">Quantidade de Salas:</Label>
            <Input
              id="maxRooms"
              type="number"
              value={maxRooms}
              onChange={(e) => setMaxRooms(Math.max(1, parseInt(e.target.value) || 10))}
              className="mt-1 bg-input border-2 border-border w-32"
              min="1"
              disabled={currentRoom > 0}
            />
          </div>
          <Button 
            onClick={generateRooms} 
            disabled={currentRoom > 0}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-2 border-primary"
          >
            Gerar Nova Dungeon
          </Button>
        </div>

        {/* Rooms Display */}
        <div className="flex gap-4 mb-8">
          {rooms.map((room, index) => (
            <div
              key={index}
              className={`parchment-bg p-6 rounded-sm border-4 w-48 h-48 flex flex-col items-center justify-center transition-all ${
                index === currentRoom 
                  ? 'border-accent scale-110 shadow-lg' 
                  : index < currentRoom 
                    ? 'border-muted opacity-50' 
                    : 'border-primary'
              }`}
            >
              <div className="text-4xl mb-2">
                {index < currentRoom ? '✅' : index === currentRoom ? '🚪' : '❓'}
              </div>
              <div className="text-center font-bold">Sala {index + 1}</div>
              {room.enemy && !room.cleared && index >= currentRoom && (
                <div className="text-xs mt-2 text-destructive">⚠️ Perigo</div>
              )}
            </div>
          ))}
        </div>

        {/* Battle or Navigation */}
        {character.vida > 0 && (
          <div className="parchment-bg p-6 rounded-sm border-4 border-primary inline-block">
            {inBattle && currentEnemy ? (
              <div>
                <h3 className="text-xl font-bold mb-4">⚔️ Batalha: {currentEnemy.nome}</h3>
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
            ) : (
              <Button 
                onClick={advanceRoom}
                disabled={currentRoom >= maxRooms - 1}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-4"
              >
                Avançar Sala ➡️
              </Button>
            )}
          </div>
        )}

        {/* Battle Log */}
        {battleLog.length > 0 && (
          <div className="parchment-bg p-6 rounded-sm border-4 border-primary mt-8 inline-block max-w-2xl">
            <h3 className="text-lg font-bold mb-4">📜 Log de Eventos</h3>
            <div className="text-sm space-y-1 max-h-48 overflow-y-auto">
              {battleLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
