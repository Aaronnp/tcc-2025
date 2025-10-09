import { useState } from "react";
import CharacterCreation from "@/components/CharacterCreation";
import GameArea from "@/components/GameArea";

interface Character {
  nome: string;
  foto: string;
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

const Index = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (char: Character) => {
    setCharacter(char);
    setGameStarted(true);
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
    setCharacter(updatedChar);
  };

  const handleReturnToSheet = () => {
    setGameStarted(false);
  };

  return (
    <>
      {!gameStarted ? (
        <CharacterCreation onStartGame={handleStartGame} existingCharacter={character || undefined} />
      ) : character ? (
        <GameArea 
          character={character} 
          onCharacterUpdate={handleCharacterUpdate}
          onReturnToSheet={handleReturnToSheet}
        />
      ) : null}
    </>
  );
};

export default Index;
