import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroSword from "@/assets/hero-sword.png";
import heroBow from "@/assets/hero-bow.png";
import heroStaff from "@/assets/hero-staff.png";
import heroAxe from "@/assets/hero-axe.png";
import heroGoku from "@/assets/hero-goku.png";
import heroSonic from "@/assets/hero-sonic.png";

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
}

interface Props {
  onExit: () => void;
}

type Phase = 'creation' | 'selection' | 'battle';

const WEAPON_SPRITES: Record<string, string> = {
  'Espada': heroSword,
  'Arco': heroBow,
  'Cajado': heroStaff,
  'Machado': heroAxe,
  'Goku': heroGoku,
  'Sonic': heroSonic,
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
    tipoDano: 'forca'
  });

  const [enemyForm, setEnemyForm] = useState<EnemyStats>({
    nome: "Inimigo Customizado",
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    poderDeFogo: 10,
    vida: 100,
    tipoDano: 'forca'
  });

  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [enemyMaxHp, setEnemyMaxHp] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [attackCooldown, setAttackCooldown] = useState(false);

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
      tipoDano: 'forca'
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
      tipoDano: 'forca'
    });
  };

  const handleGoToSelection = () => {
    if (createdCharacters.length === 0 || createdEnemies.length === 0) {
      alert("Crie pelo menos 1 personagem e 1 inimigo!");
      return;
    }
    setPhase('selection');
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
    setPhase('battle');
  };

  const handlePlayerAttack = () => {
    if (!selectedCharacter || !selectedEnemy || !isPlayerTurn || attackCooldown) return;
    
    setAttackCooldown(true);
    
    // Sistema de combate igual ao RPG normal
    const attackStat = selectedCharacter.tipoDano === 'forca' 
      ? selectedCharacter.forca 
      : selectedCharacter.poderDeFogo;
    
    // Dano = stat principal + inteligência + dado (1-6)
    const playerDamage = Math.max(1, attackStat + selectedCharacter.inteligencia + Math.floor(Math.random() * 6) + 1);
    
    // Sistema de esquiva do inimigo (se destreza maior, 30% chance de desviar)
    let enemyDodged = false;
    if (selectedEnemy.destreza > selectedCharacter.destreza) {
      enemyDodged = Math.random() < 0.3;
    }
    
    let newEnemyHp = enemyHp;
    
    if (enemyDodged) {
      setBattleLog(prev => [...prev, `💨 ${selectedEnemy.nome} desviou do seu ataque!`]);
    } else {
      newEnemyHp = Math.max(0, enemyHp - playerDamage);
      setEnemyHp(newEnemyHp);
      setBattleLog(prev => [...prev, `⚔️ ${selectedCharacter.nome} atacou causando ${playerDamage} de dano!`]);
      
      if (newEnemyHp <= 0) {
        setBattleLog(prev => [...prev, `🎉 ${selectedCharacter.nome} venceu a batalha! 🎉`]);
        setAttackCooldown(false);
        return;
      }
    }
    
    setIsPlayerTurn(false);
    
    // Contra-ataque do inimigo após 1.5 segundos
    setTimeout(() => {
      handleEnemyAttack(newEnemyHp);
    }, 1500);
  };

  const handleEnemyAttack = (currentEnemyHp: number) => {
    if (!selectedCharacter || !selectedEnemy || currentEnemyHp <= 0) {
      setAttackCooldown(false);
      setIsPlayerTurn(true);
      return;
    }
    
    const attackStat = selectedEnemy.tipoDano === 'forca' 
      ? selectedEnemy.forca 
      : selectedEnemy.poderDeFogo;
    
    const enemyDamage = Math.max(1, attackStat + selectedEnemy.inteligencia + Math.floor(Math.random() * 6) + 1);
    
    // Sistema de esquiva do jogador (se destreza maior, 50% chance de desviar)
    let playerDodged = false;
    if (selectedCharacter.destreza > selectedEnemy.destreza) {
      playerDodged = Math.random() < 0.5;
    }
    
    if (playerDodged) {
      setBattleLog(prev => [...prev, `💨 ${selectedCharacter.nome} desviou do ataque!`]);
    } else {
      setPlayerHp(prevHp => {
        const newPlayerHp = Math.max(0, prevHp - enemyDamage);
        setBattleLog(prev => [...prev, `💥 ${selectedEnemy.nome} atacou causando ${enemyDamage} de dano!`]);
        
        if (newPlayerHp <= 0) {
          setBattleLog(prev => [...prev, `💀 ${selectedCharacter.nome} foi derrotado! 💀`]);
        }
        return newPlayerHp;
      });
    }
    
    setIsPlayerTurn(true);
    
    // Libera o cooldown após mais 1.5 segundos (total 3 segundos)
    setTimeout(() => {
      setAttackCooldown(false);
    }, 1500);
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

  const getCharacterSprite = (arma: string) => {
    return WEAPON_SPRITES[arma] || heroSword;
  };

  return (
    <div className="min-h-screen dungeon-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="parchment-bg border-4 border-primary rounded-sm p-6 mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-primary mb-2 text-center">
            🎮 MODO SANDBOX 🎮
          </h1>
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
                    <Input
                      value={characterForm.nome}
                      onChange={(e) => setCharacterForm({ ...characterForm, nome: e.target.value })}
                      className="bg-input border-2 border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Aparência (Arma):</Label>
                    <Select value={characterForm.arma} onValueChange={(v) => setCharacterForm({ ...characterForm, arma: v })}>
                      <SelectTrigger className="bg-input border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Espada">Espada</SelectItem>
                        <SelectItem value="Arco">Arco</SelectItem>
                        <SelectItem value="Cajado">Cajado</SelectItem>
                        <SelectItem value="Machado">Machado</SelectItem>
                        <SelectItem value="Goku">Goku</SelectItem>
                        <SelectItem value="Sonic">Sonic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Tipo de Dano:</Label>
                    <Select value={characterForm.tipoDano} onValueChange={(v) => setCharacterForm({ ...characterForm, tipoDano: v as 'forca' | 'poderDeFogo' })}>
                      <SelectTrigger className="bg-input border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="poderDeFogo">Poder de Fogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Vida:</Label>
                    <Input
                      type="number"
                      value={characterForm.vida}
                      onChange={(e) => setCharacterForm({ ...characterForm, vida: parseInt(e.target.value) || 0 })}
                      className="bg-input border-2 border-border"
                    />
                  </div>
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'poderDeFogo'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-foreground font-bold capitalize">
                        {stat === 'forca' ? 'Força' : 
                         stat === 'constituicao' ? 'Constituição' : 
                         stat === 'inteligencia' ? 'Inteligência' :
                         stat === 'poderDeFogo' ? 'Poder de Fogo' : stat}:
                      </Label>
                      <Input
                        type="number"
                        value={characterForm[stat as keyof Omit<CharacterStats, 'nome' | 'tipoDano' | 'arma' | 'vida'>]}
                        onChange={(e) => setCharacterForm({
                          ...characterForm,
                          [stat]: parseInt(e.target.value) || 0
                        })}
                        className="bg-input border-2 border-border"
                      />
                    </div>
                  ))}
                  <Button onClick={handleCreateCharacter} className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold">
                    CRIAR PERSONAGEM
                  </Button>
                </div>
              </div>

              {/* Create Enemy */}
              <div className="parchment-bg border-4 border-red-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-red-800 mb-4 text-center">CRIAR INIMIGO</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-foreground font-bold">Nome:</Label>
                    <Input
                      value={enemyForm.nome}
                      onChange={(e) => setEnemyForm({ ...enemyForm, nome: e.target.value })}
                      className="bg-input border-2 border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Tipo de Dano:</Label>
                    <Select value={enemyForm.tipoDano} onValueChange={(v) => setEnemyForm({ ...enemyForm, tipoDano: v as 'forca' | 'poderDeFogo' })}>
                      <SelectTrigger className="bg-input border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="poderDeFogo">Poder de Fogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-bold">Vida:</Label>
                    <Input
                      type="number"
                      value={enemyForm.vida}
                      onChange={(e) => setEnemyForm({ ...enemyForm, vida: parseInt(e.target.value) || 0 })}
                      className="bg-input border-2 border-border"
                    />
                  </div>
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'poderDeFogo'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-foreground font-bold capitalize">
                        {stat === 'forca' ? 'Força' : 
                         stat === 'constituicao' ? 'Constituição' : 
                         stat === 'inteligencia' ? 'Inteligência' :
                         stat === 'poderDeFogo' ? 'Poder de Fogo' : stat}:
                      </Label>
                      <Input
                        type="number"
                        value={enemyForm[stat as keyof Omit<EnemyStats, 'nome' | 'tipoDano' | 'vida'>]}
                        onChange={(e) => setEnemyForm({
                          ...enemyForm,
                          [stat]: parseInt(e.target.value) || 0
                        })}
                        className="bg-input border-2 border-border"
                      />
                    </div>
                  ))}
                  <Button onClick={handleCreateEnemy} className="w-full bg-red-700 hover:bg-red-600 text-white font-bold">
                    CRIAR INIMIGO
                  </Button>
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
                          <img src={getCharacterSprite(char.arma)} alt={char.nome} className="w-8 h-8 object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
                          <span className="text-foreground text-sm">{char.nome} (Vida: {char.vida})</span>
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
                        <div key={idx} className="bg-muted p-2 rounded-sm border border-border">
                          <span className="text-foreground text-sm">{enemy.nome} (Vida: {enemy.vida})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={handleBack} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold">
                ⬅️ VOLTAR
              </Button>
              <Button onClick={handleGoToSelection} className="bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-4 font-bold">
                IR PARA A SELEÇÃO ➡️
              </Button>
            </div>
          </>
        )}

        {/* Phase 2: Selection */}
        {phase === 'selection' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Select Enemy */}
              <div className="parchment-bg border-4 border-red-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-red-800 mb-4 text-center">Escolher inimigo para lutar contra</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {createdEnemies.map((enemy, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedEnemy(enemy)}
                      className={`p-4 rounded-sm cursor-pointer transition-all border-2 ${
                        selectedEnemy?.nome === enemy.nome
                          ? 'bg-red-200 border-red-600'
                          : 'bg-muted hover:bg-muted/80 border-border'
                      }`}
                    >
                      <p className="text-foreground font-bold">{enemy.nome}</p>
                      <p className="text-sm text-muted-foreground">Vida: {enemy.vida} | Força: {enemy.forca} | Destreza: {enemy.destreza}</p>
                      {selectedEnemy?.nome === enemy.nome && (
                        <p className="text-red-700 text-xs mt-1 font-bold">*selecionado*</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Character */}
              <div className="parchment-bg border-4 border-blue-700 rounded-sm p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">Escolher personagem criado</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {createdCharacters.map((char, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedCharacter(char)}
                      className={`p-4 rounded-sm cursor-pointer transition-all border-2 flex items-center gap-4 ${
                        selectedCharacter?.nome === char.nome
                          ? 'bg-blue-200 border-blue-600'
                          : 'bg-muted hover:bg-muted/80 border-border'
                      }`}
                    >
                      <img src={getCharacterSprite(char.arma)} alt={char.nome} className="w-12 h-12 object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
                      <div>
                        <p className="text-foreground font-bold">{char.nome}</p>
                        <p className="text-sm text-muted-foreground">Vida: {char.vida} | Força: {char.forca} | Destreza: {char.destreza}</p>
                        {selectedCharacter?.nome === char.nome && (
                          <p className="text-blue-700 text-xs mt-1 font-bold">*selecionado*</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={handleBack} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold">
                ⬅️ VOLTAR
              </Button>
              <Button onClick={handleGoToBattle} className="bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-4 font-bold">
                IR PARA LUTA ⚔️
              </Button>
            </div>
          </>
        )}

        {/* Phase 3: Battle */}
        {phase === 'battle' && selectedCharacter && selectedEnemy && (
          <>
            <div className="parchment-bg border-4 border-primary rounded-sm p-8 mb-8 shadow-xl">
              <h2 className="text-4xl font-bold text-foreground mb-6 text-center">
                {selectedEnemy.nome} VS {selectedCharacter.nome}
              </h2>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Enemy Side */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-red-800 mb-2">{selectedEnemy.nome}</h3>
                  <div className="bg-red-100 border-2 border-red-300 rounded-sm p-4">
                    <p className="text-red-900 text-xl font-bold">HP: {enemyHp}/{enemyMaxHp}</p>
                    <div className="w-full bg-red-200 rounded-full h-4 mt-2">
                      <div 
                        className="bg-red-600 h-4 rounded-full transition-all"
                        style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-red-800">
                      FOR: {selectedEnemy.forca} | DES: {selectedEnemy.destreza} | INT: {selectedEnemy.inteligencia}
                    </div>
                  </div>
                </div>

                {/* Player Side */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">{selectedCharacter.nome}</h3>
                  <div className="flex justify-center mb-2">
                    <img 
                      src={getCharacterSprite(selectedCharacter.arma)} 
                      alt={selectedCharacter.nome}
                      className="w-24 h-24 object-contain pixelated"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-sm p-4">
                    <p className="text-blue-900 text-xl font-bold">HP: {playerHp}/{playerMaxHp}</p>
                    <div className="w-full bg-blue-200 rounded-full h-4 mt-2">
                      <div 
                        className="bg-blue-600 h-4 rounded-full transition-all"
                        style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-blue-800">
                      FOR: {selectedCharacter.forca} | DES: {selectedCharacter.destreza} | INT: {selectedCharacter.inteligencia}
                    </div>
                  </div>
                  <Button
                    onClick={handlePlayerAttack}
                    disabled={!isPlayerTurn || playerHp <= 0 || enemyHp <= 0 || attackCooldown}
                    className="mt-4 bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-4"
                  >
                    ⚔️ ATACAR {attackCooldown && '(Aguarde...)'}
                  </Button>
                </div>
              </div>

              {/* Battle Log */}
              <div className="bg-muted border-2 border-border rounded-sm p-4 max-h-48 overflow-y-auto">
                <h4 className="text-primary font-bold mb-2">Log de Batalha:</h4>
                {battleLog.map((log, idx) => (
                  <p key={idx} className="text-foreground text-sm">{log}</p>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleBack} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold">
                ⬅️ VOLTAR
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
