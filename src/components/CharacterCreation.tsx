import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface Props {
  onStartGame: (character: Character) => void;
  existingCharacter?: Character;
}

export default function CharacterCreation({ onStartGame, existingCharacter }: Props) {
  const isLevelUp = !!existingCharacter;
  const [nome, setNome] = useState(existingCharacter?.nome || "");
  const [arma, setArma] = useState(existingCharacter?.arma || "Espada");
  
  const [stats, setStats] = useState({
    forca: existingCharacter?.forca || 0,
    destreza: existingCharacter?.destreza || 0,
    constituicao: existingCharacter?.constituicao || 0,
    inteligencia: existingCharacter?.inteligencia || 0,
    poderDeFogo: existingCharacter?.poderDeFogo || 0,
  });

  const [newPoints, setNewPoints] = useState({
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    poderDeFogo: 0,
  });

  const totalNewPoints = Object.values(newPoints).reduce((a, b) => a + b, 0);
  const pointsToSpend = existingCharacter?.pointsToSpend || 0;
  const totalPoints = Object.values(stats).reduce((a, b) => a + b, 0);
  const maxPoints = isLevelUp ? pointsToSpend : 15;

  const handleStatChange = (stat: keyof typeof stats, value: number) => {
    if (isLevelUp) {
      const newValue = Math.max(0, value);
      const newPointsUpdate = { ...newPoints, [stat]: newValue };
      const newTotal = Object.values(newPointsUpdate).reduce((a, b) => a + b, 0);
      
      if (newTotal <= maxPoints) {
        setNewPoints(newPointsUpdate);
      }
    } else {
      const newValue = Math.max(0, value);
      const newStats = { ...stats, [stat]: newValue };
      const newTotal = Object.values(newStats).reduce((a, b) => a + b, 0);
      
      if (newTotal <= maxPoints) {
        setStats(newStats);
      }
    }
  };

  const handleSubmit = () => {
    if (isLevelUp) {
      if (totalNewPoints !== pointsToSpend) {
        alert(`Você precisa distribuir exatamente ${pointsToSpend} pontos!`);
        return;
      }

      const finalStats = {
        forca: stats.forca + newPoints.forca,
        destreza: stats.destreza + newPoints.destreza,
        constituicao: stats.constituicao + newPoints.constituicao,
        inteligencia: stats.inteligencia + newPoints.inteligencia,
        poderDeFogo: stats.poderDeFogo + newPoints.poderDeFogo,
      };

      const character: Character = {
        ...existingCharacter!,
        ...finalStats,
        vida: existingCharacter!.vida,
        armadura: finalStats.constituicao + 10,
        pointsToSpend: 0,
      };

      onStartGame(character);
    } else {
      if (!nome || totalPoints !== maxPoints) {
        alert(`Você precisa distribuir exatamente ${maxPoints} pontos!`);
        return;
      }

      const character: Character = {
        nome,
        ...stats,
        vida: 10 + stats.constituicao * 2,
        armadura: stats.constituicao + 10,
        arma,
        level: 1,
        xp: 0,
        pointsToSpend: 0,
      };

      onStartGame(character);
    }
  };

  return (
    <div className="min-h-screen dungeon-bg flex items-center justify-center p-4">
      <div className="parchment-bg p-8 rounded-sm shadow-2xl max-w-2xl w-full border-4 border-primary">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wider">
          {isLevelUp ? "LEVEL UP!" : "RPG DAS SOMBRAS"}
        </h1>
        <p className="text-center mb-6 text-sm">
          {isLevelUp ? `Distribua ${pointsToSpend} pontos` : "Crie seu lutador"}
        </p>
        {!isLevelUp && (
        <p className="text-center mb-6 text-xs">
            Você tem 15 pontos para distribuir em 5 atributos
          </p>
        )}

        <div className="space-y-4">
          {!isLevelUp && (
            <div>
              <Label htmlFor="nome" className="text-sm font-bold">Nome:</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome legal"
                className="mt-1 bg-input border-2 border-border"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(stats) as Array<keyof typeof stats>).map((stat) => (
              <div key={stat}>
                <Label htmlFor={stat} className="text-sm font-bold capitalize">
                  {stat === "forca" ? "Força" : 
                   stat === "constituicao" ? "Constituição" : 
                   stat === "inteligencia" ? "Inteligência" :
                   stat === "poderDeFogo" ? "Poder de Fogo" : stat}:
                </Label>
                {isLevelUp ? (
                  <div className="flex gap-2 items-center mt-1">
                    <Input
                      value={stats[stat]}
                      disabled
                      className="bg-muted border-2 border-border w-20"
                    />
                    <span className="text-lg font-bold">+</span>
                    <Input
                      id={stat}
                      type="number"
                      value={newPoints[stat]}
                      onChange={(e) => handleStatChange(stat, parseInt(e.target.value) || 0)}
                      className="mt-0 bg-input border-2 border-accent w-20"
                      min="0"
                    />
                    <span className="text-sm font-bold">= {stats[stat] + newPoints[stat]}</span>
                  </div>
                ) : (
                  <Input
                    id={stat}
                    type="number"
                    value={stats[stat]}
                    onChange={(e) => handleStatChange(stat, parseInt(e.target.value) || 0)}
                    className="mt-1 bg-input border-2 border-border"
                    min="0"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-sm font-bold">
            {isLevelUp 
              ? `Novos pontos usados: ${totalNewPoints} / ${pointsToSpend}`
              : `Pontos usados: ${totalPoints} / ${maxPoints}`
            }
          </div>

          {!isLevelUp && (
            <div>
              <Label htmlFor="arma" className="text-sm font-bold">Item inicial do seu lutador:</Label>
              <Select value={arma} onValueChange={setArma}>
                <SelectTrigger className="mt-1 bg-input border-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espada">Espada</SelectItem>
                  <SelectItem value="Arco">Arco</SelectItem>
                  <SelectItem value="Cajado">Cajado</SelectItem>
                  <SelectItem value="Machado">Machado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 border-2 border-primary-foreground"
          >
            {isLevelUp ? "CONFIRMAR PONTOS 🔥" : "CONFIRMAR LUTADOR 🔥"}
          </Button>
        </div>
      </div>
    </div>
  );
}
