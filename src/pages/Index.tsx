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
  const progress = getGameProgress();

  const handleStartGame = (char: Character) => {
    setCharacter(char);
    setGameStarted(true);
    
    // Easter egg: unlock sandbox
    if (char.nome.toLowerCase() === 'unlocksandbox') {
      const updatedProgress = { ...progress, sandboxUnlocked: true };
      localStorage.setItem('rpg_progress', JSON.stringify(updatedProgress));
    }
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
    setCharacter(updatedChar);
  };

  const handleReturnToSheet = (currentRoom: number) => {
    setSavedRoom(currentRoom);
    setGameStarted(false);
  };
  
  const handleCharacterSelect = (selectedChar: any) => {
    setSelectedCharacterBonus(selectedChar.bonus);
    setIsAftermatch(selectedChar.id === 5);
    setShowCharacterSelect(false);
  };

  return (
    <>
      {showSandbox ? (
        <SandboxMode onExit={() => setShowSandbox(false)} />
      ) : showCharacterSelect ? (
        <CharacterSelect 
          onSelect={handleCharacterSelect} 
          onClose={() => setShowCharacterSelect(false)} 
        />
      ) : !gameStarted ? (
        <>
          {progress.totalVictories > 0 && (
            <div className="fixed top-4 right-4 z-50 space-y-2">
              <Button 
                onClick={() => setShowCharacterSelect(true)}
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold w-full"
              >
                ⚔️ PERSONAGENS
              </Button>
              {progress.sandboxUnlocked && (
                <Button 
                  onClick={() => setShowSandbox(true)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold w-full"
                >
                  🎮 SANDBOX
                </Button>
              )}
            </div>
          )}
          <CharacterCreation 
            onStartGame={handleStartGame} 
            existingCharacter={character || undefined} 
            selectedCharacterBonus={selectedCharacterBonus}
            isAftermatch={isAftermatch}
          />
        </>
      ) : character ? (
        <GameArea 
          character={character} 
          onCharacterUpdate={handleCharacterUpdate}
          onReturnToSheet={handleReturnToSheet}
          initialRoom={savedRoom}
          isAftermatch={isAftermatch}
        />
      ) : null}
    </>
  );
};

export default Index;
