import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CharacterStats {
  nome: string;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  poderDeFogo: number;
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
  const [enemyHp, setEnemyHp] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const handleCreateCharacter = () => {
    setCreatedCharacters([...createdCharacters, { ...characterForm }]);
    setCharacterForm({
      nome: "Herói Customizado",
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      poderDeFogo: 10,
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
    setPlayerHp(selectedCharacter.constituicao * 10);
    setEnemyHp(selectedEnemy.vida);
    setBattleLog([`Batalha iniciada: ${selectedCharacter.nome} VS ${selectedEnemy.nome}`]);
    setIsPlayerTurn(true);
    setPhase('battle');
  };

  const handlePlayerAttack = () => {
    if (!selectedCharacter || !selectedEnemy || !isPlayerTurn) return;
    
    const damage = selectedCharacter.tipoDano === 'forca' 
      ? selectedCharacter.forca + selectedCharacter.inteligencia
      : selectedCharacter.poderDeFogo + selectedCharacter.inteligencia;
    
    const newEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newEnemyHp);
    setBattleLog([...battleLog, `${selectedCharacter.nome} atacou causando ${damage} de dano!`]);
    
    if (newEnemyHp <= 0) {
      setBattleLog([...battleLog, `${selectedCharacter.nome} atacou causando ${damage} de dano!`, `🎉 ${selectedCharacter.nome} venceu a batalha! 🎉`]);
      return;
    }
    
    setIsPlayerTurn(false);
    setTimeout(() => handleEnemyAttack(newEnemyHp), 1500);
  };

  const handleEnemyAttack = (currentEnemyHp: number) => {
    if (!selectedCharacter || !selectedEnemy || currentEnemyHp <= 0) return;
    
    const damage = selectedEnemy.tipoDano === 'forca' 
      ? selectedEnemy.forca + selectedEnemy.inteligencia
      : selectedEnemy.poderDeFogo + selectedEnemy.inteligencia;
    
    const newPlayerHp = Math.max(0, playerHp - damage);
    setPlayerHp(newPlayerHp);
    setBattleLog(prev => [...prev, `${selectedEnemy.nome} atacou causando ${damage} de dano!`]);
    
    if (newPlayerHp <= 0) {
      setBattleLog(prev => [...prev, `💀 ${selectedCharacter.nome} foi derrotado! 💀`]);
      return;
    }
    
    setIsPlayerTurn(true);
  };

  const handleBack = () => {
    if (phase === 'creation') {
      onExit();
    } else if (phase === 'selection') {
      setPhase('creation');
    } else if (phase === 'battle') {
      setPhase('selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/80 border-4 border-yellow-500 rounded-lg p-6 mb-8">
          <h1 className="text-5xl font-bold text-yellow-400 mb-2 text-center animate-pulse">
            🎮 MODO SANDBOX 🎮
          </h1>
          <p className="text-white text-center">
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
              <div className="bg-black/80 border-4 border-blue-500 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">CRIAR SEU PERSONAGEM</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-white">Nome:</Label>
                    <Input
                      value={characterForm.nome}
                      onChange={(e) => setCharacterForm({ ...characterForm, nome: e.target.value })}
                      className="bg-gray-800 text-white border-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Tipo de Dano:</Label>
                    <Select value={characterForm.tipoDano} onValueChange={(v) => setCharacterForm({ ...characterForm, tipoDano: v as 'forca' | 'poderDeFogo' })}>
                      <SelectTrigger className="bg-gray-800 text-white border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="poderDeFogo">Poder de Fogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'poderDeFogo'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-white capitalize">{stat}:</Label>
                      <Input
                        type="number"
                        value={characterForm[stat as keyof Omit<CharacterStats, 'nome' | 'tipoDano'>]}
                        onChange={(e) => setCharacterForm({
                          ...characterForm,
                          [stat]: parseInt(e.target.value) || 0
                        })}
                        className="bg-gray-800 text-white border-blue-500"
                      />
                    </div>
                  ))}
                  <Button onClick={handleCreateCharacter} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold">
                    CRIAR PERSONAGEM
                  </Button>
                </div>
              </div>

              {/* Create Enemy */}
              <div className="bg-black/80 border-4 border-red-500 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-red-400 mb-4 text-center">CRIAR INIMIGO</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-white">Nome:</Label>
                    <Input
                      value={enemyForm.nome}
                      onChange={(e) => setEnemyForm({ ...enemyForm, nome: e.target.value })}
                      className="bg-gray-800 text-white border-red-500"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Tipo de Dano:</Label>
                    <Select value={enemyForm.tipoDano} onValueChange={(v) => setEnemyForm({ ...enemyForm, tipoDano: v as 'forca' | 'poderDeFogo' })}>
                      <SelectTrigger className="bg-gray-800 text-white border-red-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="poderDeFogo">Poder de Fogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'poderDeFogo', 'vida'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-white capitalize">{stat}:</Label>
                      <Input
                        type="number"
                        value={enemyForm[stat as keyof Omit<EnemyStats, 'nome' | 'tipoDano'>]}
                        onChange={(e) => setEnemyForm({
                          ...enemyForm,
                          [stat]: parseInt(e.target.value) || 0
                        })}
                        className="bg-gray-800 text-white border-red-500"
                      />
                    </div>
                  ))}
                  <Button onClick={handleCreateEnemy} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold">
                    CRIAR INIMIGO
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-500 text-white text-xl px-8 py-4 font-bold">
                ⬅️ VOLTAR PARA O MODO NORMAL
              </Button>
              <Button onClick={handleGoToSelection} className="bg-green-600 hover:bg-green-500 text-white text-xl px-8 py-4 font-bold">
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
              <div className="bg-black/80 border-4 border-red-500 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-red-400 mb-4 text-center">Escolher inimigo para lutar contra</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {createdEnemies.map((enemy, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedEnemy(enemy)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedEnemy?.nome === enemy.nome
                          ? 'bg-red-600 border-2 border-red-300'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <p className="text-white font-bold">{enemy.nome}</p>
                      <p className="text-sm text-gray-300">Vida: {enemy.vida} | Força: {enemy.forca}</p>
                      {selectedEnemy?.nome === enemy.nome && (
                        <p className="text-yellow-400 text-xs mt-1">*selecionado*</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Character */}
              <div className="bg-black/80 border-4 border-blue-500 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">Escolher personagem criado</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {createdCharacters.map((char, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedCharacter(char)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedCharacter?.nome === char.nome
                          ? 'bg-blue-600 border-2 border-blue-300'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <p className="text-white font-bold">{char.nome}</p>
                      <p className="text-sm text-gray-300">Força: {char.forca} | Destreza: {char.destreza}</p>
                      {selectedCharacter?.nome === char.nome && (
                        <p className="text-yellow-400 text-xs mt-1">*selecionado*</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-500 text-white text-xl px-8 py-4 font-bold">
                ⬅️ VOLTAR PARA CRIAÇÃO
              </Button>
              <Button onClick={handleGoToBattle} className="bg-green-600 hover:bg-green-500 text-white text-xl px-8 py-4 font-bold">
                IR PARA LUTA ⚔️
              </Button>
            </div>
          </>
        )}

        {/* Phase 3: Battle */}
        {phase === 'battle' && selectedCharacter && selectedEnemy && (
          <>
            <div className="bg-black/80 border-4 border-purple-500 rounded-lg p-8 mb-8">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">
                {selectedEnemy.nome} VS {selectedCharacter.nome}
              </h2>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-red-400 mb-2">{selectedEnemy.nome}</h3>
                  <div className="bg-red-900 rounded-lg p-4">
                    <p className="text-white text-xl">HP: {enemyHp}/{selectedEnemy.vida}</p>
                    <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                      <div 
                        className="bg-red-500 h-4 rounded-full transition-all"
                        style={{ width: `${(enemyHp / selectedEnemy.vida) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    disabled
                    className="mt-4 bg-red-600 text-white font-bold px-8 py-4"
                  >
                    Lutar (lado do inimigo)
                  </Button>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">{selectedCharacter.nome}</h3>
                  <div className="bg-blue-900 rounded-lg p-4">
                    <p className="text-white text-xl">HP: {playerHp}/{selectedCharacter.constituicao * 10}</p>
                    <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                      <div 
                        className="bg-blue-500 h-4 rounded-full transition-all"
                        style={{ width: `${(playerHp / (selectedCharacter.constituicao * 10)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handlePlayerAttack}
                    disabled={!isPlayerTurn || playerHp <= 0 || enemyHp <= 0}
                    className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4"
                  >
                    Lutar (lado do personagem)
                  </Button>
                </div>
              </div>

              {/* Battle Log */}
              <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                <h4 className="text-yellow-400 font-bold mb-2">Log de Batalha:</h4>
                {battleLog.map((log, idx) => (
                  <p key={idx} className="text-white text-sm">{log}</p>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-500 text-white text-xl px-8 py-4 font-bold">
                ⬅️ VOLTAR PARA CRIAÇÃO
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
