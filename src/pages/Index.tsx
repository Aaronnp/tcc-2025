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
  carisma: number;
  vida: number;
  armadura: number;
  arma: string;
}

const Index = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (char: Character) => {
    setCharacter(char);
    setGameStarted(true);
  };

  return (
    <>
      {!gameStarted ? (
        <CharacterCreation onStartGame={handleStartGame} />
      ) : character ? (
        <GameArea character={character} />
      ) : null}
    </>
  );
};

export default Index;
