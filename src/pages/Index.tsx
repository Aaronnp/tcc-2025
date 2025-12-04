import { useState } from "react";
import CharacterCreation from "@/components/CharacterCreation";
import GameArea from "@/components/GameArea";
import CharacterSelect from "@/components/CharacterSelect";
import SandboxMode from "@/components/SandboxMode";
import { Button } from "@/components/ui/button";
import { getGameProgress, resetGameProgress } from "@/utils/gameProgress";
import { SpecialCharacter } from "@/utils/specialCharacters";

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

const Index = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [savedRoom, setSavedRoom] = useState(0);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [selectedCharacterBonus, setSelectedCharacterBonus] = useState<any>(null);
  const [selectedSpecialType, setSelectedSpecialType] = useState<string>('normal');
  const [isAftermatch, setIsAftermatch] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showCharactersTab, setShowCharactersTab] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [progress, setProgress] = useState(getGameProgress());

  const refreshProgress = () => setProgress(getGameProgress());

  const [characterBeforeLevelUp, setCharacterBeforeLevelUp] = useState<Character | null>(null);

  const handleStartGame = (char: Character) => {
    // Check for sandbox unlock cheat
    if (char.nome.toLowerCase() === 'unlocksandbox') {
      setShowSandbox(true);
      return;
    }
    
    // Check for character test modes
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
        specialType: 'goku',
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
        specialType: 'sonic',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modosukuna') {
      const testChar: Character = {
        ...char,
        nome: 'Sukuna (Teste)',
        specialType: 'sukuna',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modoluffy') {
      const testChar: Character = {
        ...char,
        nome: 'Luffy (Teste)',
        specialType: 'luffy',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modoyi') {
      const testChar: Character = {
        ...char,
        nome: 'Yi (Teste)',
        vida: 5,
        specialType: 'yi',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modogojo') {
      const testChar: Character = {
        ...char,
        nome: 'Gojo (Teste)',
        specialType: 'gojo',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modomario') {
      const testChar: Character = {
        ...char,
        nome: 'Mario (Teste)',
        specialType: 'mario',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modoguest') {
      const testChar: Character = {
        ...char,
        nome: 'Guest 1337 (Teste)',
        specialType: 'guest1337',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }

    if (nomeLower === 'modochronos') {
      const testChar: Character = {
        ...char,
        nome: 'CHRONOS (Teste)',
        specialType: 'chronos',
      };
      setCharacter(testChar);
      setGameStarted(true);
      return;
    }
    
    // Apply special type from character selection
    const finalChar: Character = {
      ...char,
      specialType: selectedSpecialType,
    };
    
    // Yi always has 5 HP and 9 lives (handled in GameArea)
    if (selectedSpecialType === 'yi') {
      finalChar.vida = 5;
    }
    
    setCharacter(finalChar);
    setGameStarted(true);
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
    setCharacter(updatedChar);
  };

  const handleReturnToSheet = (currentRoom: number, resetCharacter: boolean = false) => {
    setSavedRoom(currentRoom);
    setGameStarted(false);
    if (resetCharacter) {
      setCharacter(null);
      setCharacterBeforeLevelUp(null);
      setSelectedCharacterBonus(null);
      setSelectedSpecialType('normal');
      setIsAftermatch(false);
      refreshProgress();
    } else if (character) {
      // Save character before level up in case they want to cancel
      setCharacterBeforeLevelUp({...character});
    }
  };

  const handleCancelLevelUp = () => {
    if (characterBeforeLevelUp) {
      setCharacter(characterBeforeLevelUp);
      setGameStarted(true);
    }
  };
  
  const handleCharacterSelect = (selectedChar: SpecialCharacter) => {
    setSelectedSpecialType(selectedChar.specialType);
    setShowCharacterSelect(false);
  };

  const handleResetProgress = () => {
    resetGameProgress();
    refreshProgress();
    setShowResetConfirm(false);
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
            Selecione um personagem para jogar!
          </p>
          <p className="text-muted-foreground text-center mb-8">
            Vitórias: {progress.totalVictories} | Hardcore: {progress.hardcoreVictories}
          </p>
          
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                setShowCharactersTab(false);
                setShowCharacterSelect(true);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-8 py-4 font-bold"
            >
              🎮 ESCOLHER PERSONAGEM
            </Button>
            {progress.totalVictories >= 3 && (
              <Button
                onClick={() => {
                  setShowCharactersTab(false);
                  setShowSandbox(true);
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-8 py-4 font-bold"
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
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xl px-8 py-4 font-bold"
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

  // Reset confirmation modal
  if (showResetConfirm) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">⚠️ REINICIAR PROGRESSO? ⚠️</h2>
          <p className="text-white text-center mb-6">
            Você perderá TODAS as suas {progress.totalVictories} vitórias e todos os personagens desbloqueados!
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResetProgress}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              REINICIAR
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isInHardcoreCreation = character?.hardcore || isAftermatch;

  if (!gameStarted) {
    return (
      <div className="relative">
        {/* Botão de Reiniciar Progresso */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={() => setShowResetConfirm(true)}
            className="bg-red-900 hover:bg-red-800 text-red-100 font-bold px-4 py-2 text-sm"
          >
            🔄 Reiniciar
          </Button>
        </div>
        
        <CharacterCreation 
          onStartGame={handleStartGame} 
          existingCharacter={character || undefined} 
          selectedCharacterBonus={selectedCharacterBonus}
          isAftermatch={isAftermatch}
          selectedSpecialType={selectedSpecialType}
          onCancelLevelUp={character?.pointsToSpend ? handleCancelLevelUp : undefined}
        />
        {/* Esconde o botão PERSONAGENS no modo impossível */}
        {!isInHardcoreCreation && (
          <div className="fixed top-4 right-4 z-50">
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
