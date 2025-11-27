import { useState } from "react";
import CharacterCreation from "@/components/CharacterCreation";
import GameArea from "@/components/GameArea";
import CharacterSelect from "@/components/CharacterSelect";
import SandboxMode from "@/components/SandboxMode";
import { Button } from "@/components/ui/button";
import { getGameProgress } from "@/utils/gameProgress";

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
}

const Index = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [savedRoom, setSavedRoom] = useState(0);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [selectedCharacterBonus, setSelectedCharacterBonus] = useState<any>(null);
  const [isAftermatch, setIsAftermatch] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showCharactersTab, setShowCharactersTab] = useState(false);
  const [testCharacterMode, setTestCharacterMode] = useState<string | null>(null);
  const progress = getGameProgress();

  const handleStartGame = (char: Character) => {
    // Check for sandbox unlock cheat
    if (char.nome.toLowerCase() === 'unlocksandbox') {
      setShowSandbox(true);
      return;
    }
    
    // Check for character test mode: modogoku, modosonic, etc.
    const nomeLower = char.nome.toLowerCase();
    
    if (nomeLower === 'modogoku') {
      const testChar: Character = {
        ...char,
        nome: 'Goku (Teste)',
        forca: 999,
        destreza: 999,
        constituicao: 999,
        inteligencia: 999,
        poderDeFogo: 999,
        vida: 999999,
        arma: 'Goku',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    if (nomeLower === 'modosonic') {
      const testChar: Character = {
        ...char,
        nome: 'Sonic (Teste)',
        destreza: 9999,
        vida: char.constituicao * 2 + 10,
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    if (nomeLower === 'modoguerreiro') {
      const testChar: Character = {
        ...char,
        nome: 'Guerreiro (Teste)',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    if (nomeLower === 'modoarqueiro') {
      const testChar: Character = {
        ...char,
        nome: 'Arqueiro Sombrio (Teste)',
        destreza: char.destreza + 5,
        poderDeFogo: char.poderDeFogo + 3,
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    if (nomeLower === 'modomago') {
      const testChar: Character = {
        ...char,
        nome: 'Mago das Sombras (Teste)',
        inteligencia: char.inteligencia + 8,
        poderDeFogo: char.poderDeFogo + 4,
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    if (nomeLower === 'modopaladino') {
      const testChar: Character = {
        ...char,
        nome: 'Paladino (Teste)',
        forca: char.forca + 6,
        constituicao: char.constituicao + 6,
        vida: (char.constituicao + 6) * 2 + 10,
        armadura: char.constituicao + 6 + 10,
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    if (nomeLower === 'modolorde') {
      const testChar: Character = {
        ...char,
        nome: 'Lorde das Sombras (Teste)',
        forca: char.forca + 10,
        destreza: char.destreza + 10,
        constituicao: char.constituicao + 10,
        inteligencia: char.inteligencia + 10,
        poderDeFogo: char.poderDeFogo + 10,
        vida: (char.constituicao + 10) * 2 + 10,
        armadura: char.constituicao + 10 + 10,
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    setCharacter(char);
    setGameStarted(true);
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
    setCharacter(updatedChar);
  };

  const handleReturnToSheet = (currentRoom: number, resetCharacter: boolean = false) => {
    setSavedRoom(currentRoom);
    setGameStarted(false);
    // Se resetCharacter for true (morte ou vitória), reseta o personagem completamente
    if (resetCharacter) {
      setCharacter(null);
      setSelectedCharacterBonus(null);
      setIsAftermatch(false);
    }
  };
  
  const handleCharacterSelect = (selectedChar: any) => {
    setSelectedCharacterBonus(selectedChar.bonus);
    setIsAftermatch(selectedChar.id === 5);
    setShowCharacterSelect(false);
  };

  if (showSandbox) {
    return <SandboxMode onExit={() => {
      setShowSandbox(false);
      setGameStarted(false);
      setCharacter(null);
    }} />;
  }

  if (showCharactersTab) {
    return (
      <div className="min-h-screen dungeon-bg flex items-center justify-center p-8">
        <div className="parchment-bg border-4 border-primary rounded-sm p-8 max-w-4xl shadow-2xl">
          <h1 className="text-5xl font-bold text-primary mb-6 text-center">
            🎭 PERSONAGENS 🎭
          </h1>
          <p className="text-foreground text-xl text-center mb-4">
            Esta funcionalidade está em desenvolvimento!
          </p>
          <p className="text-muted-foreground text-center mb-8">
            Em breve você poderá desbloquear personagens especiais baseado nas suas conquistas.
          </p>
          
          {/* Preview dos personagens */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-primary font-bold">🔒 Goku</p>
              <p className="text-muted-foreground text-sm">Requer 10 vitórias</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-blue-700 font-bold">🔒 Sonic</p>
              <p className="text-muted-foreground text-sm">Requer 10 vitórias</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-red-700 font-bold">🔒 Luffy</p>
              <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-purple-700 font-bold">🔒 Sukuna</p>
              <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-green-700 font-bold">🔒 Yi</p>
              <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-cyan-700 font-bold">🔒 Gojo</p>
              <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-red-600 font-bold">🔒 Mario</p>
              <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
            </div>
            <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
              <p className="text-gray-700 font-bold">🔒 Guest 1337</p>
              <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {progress.totalVictories >= 3 && (
              <Button
                onClick={() => {
                  setShowCharactersTab(false);
                  setShowSandbox(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-8 py-4 font-bold"
              >
                🎮 SANDBOX
              </Button>
            )}
            {progress.totalVictories < 3 && (
              <div className="bg-muted p-4 rounded-sm border-2 border-border text-center">
                <p className="text-muted-foreground font-bold">🔒 SANDBOX</p>
                <p className="text-muted-foreground text-sm">Requer 3 vitórias ({progress.totalVictories}/3)</p>
              </div>
            )}
            <Button
              onClick={() => setShowCharactersTab(false)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold"
            >
              ⬅️ VOLTAR
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showCharacterSelect) {
    return (
      <CharacterSelect 
        onSelect={handleCharacterSelect} 
        onClose={() => setShowCharacterSelect(false)} 
      />
    );
  }

  // Verifica se está no modo impossível (hardcore ativo na criação)
  const isInHardcoreCreation = character?.hardcore || isAftermatch;

  if (!gameStarted) {
    return (
      <div className="relative">
        <CharacterCreation 
          onStartGame={handleStartGame} 
          existingCharacter={character || undefined} 
          selectedCharacterBonus={selectedCharacterBonus}
          isAftermatch={isAftermatch}
        />
        {/* Esconde o botão PERSONAGENS no modo impossível */}
        {!isInHardcoreCreation && (
          <div className="fixed top-4 left-4 z-50">
            <Button
              onClick={() => setShowCharactersTab(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-3"
            >
              🎭 PERSONAGENS
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (character) {
    return (
      <GameArea 
        character={character} 
        onCharacterUpdate={handleCharacterUpdate}
        onReturnToSheet={handleReturnToSheet}
        initialRoom={savedRoom}
        isAftermatch={isAftermatch}
      />
    );
  }

  return null;
};

export default Index;