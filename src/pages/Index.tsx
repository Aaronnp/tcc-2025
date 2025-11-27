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
  const progress = getGameProgress();

  const handleStartGame = (char: Character) => {
    // Check for sandbox unlock cheat
    if (char.nome.toLowerCase() === 'unlocksandbox') {
      setShowSandbox(true);
      return;
    }
    
    setCharacter(char);
    setGameStarted(true);
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

  if (showSandbox) {
    return <SandboxMode onExit={() => {
      setShowSandbox(false);
      setGameStarted(false);
      setCharacter(null);
    }} />;
  }

  if (showCharactersTab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
        <div className="bg-black/80 border-4 border-yellow-500 rounded-lg p-8 max-w-2xl">
          <h1 className="text-5xl font-bold text-yellow-400 mb-6 text-center animate-pulse">
            🎭 PERSONAGENS 🎭
          </h1>
          <p className="text-white text-xl text-center mb-8">
            Esta funcionalidade está em desenvolvimento!
          </p>
          <p className="text-gray-400 text-center mb-8">
            Em breve você poderá desbloquear personagens especiais baseado nas suas conquistas.
          </p>
          
          {/* Preview dos personagens */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600 text-center">
              <p className="text-yellow-400 font-bold">🔒 Goku</p>
              <p className="text-gray-400 text-sm">Requer 10 vitórias</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600 text-center">
              <p className="text-blue-400 font-bold">🔒 Sonic</p>
              <p className="text-gray-400 text-sm">Requer 10 vitórias</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {progress.totalVictories >= 3 && (
              <Button
                onClick={() => {
                  setShowCharactersTab(false);
                  setShowSandbox(true);
                }}
                className="bg-yellow-600 hover:bg-yellow-500 text-yellow-900 text-xl px-8 py-4 font-bold"
              >
                🎮 SANDBOX
              </Button>
            )}
            <Button
              onClick={() => setShowCharactersTab(false)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xl px-8 py-4 font-bold"
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

  if (!gameStarted) {
    return (
      <div className="relative">
        <CharacterCreation 
          onStartGame={handleStartGame} 
          existingCharacter={character || undefined} 
          selectedCharacterBonus={selectedCharacterBonus}
          isAftermatch={isAftermatch}
        />
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={() => setShowCharactersTab(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3"
          >
            🎭 PERSONAGENS
          </Button>
        </div>
        {progress.totalVictories >= 3 && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => setShowSandbox(true)}
              className="bg-yellow-600 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-3 text-lg"
            >
              SANDBOX
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
