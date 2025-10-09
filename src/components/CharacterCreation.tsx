import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface Props {
  onStartGame: (character: Character) => void;
}

export default function CharacterCreation({ onStartGame }: Props) {
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("");
  const [arma, setArma] = useState("Espada");
  
  const [stats, setStats] = useState({
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    carisma: 0,
  });

  const totalPoints = Object.values(stats).reduce((a, b) => a + b, 0);
  const maxPoints = 8;

  const handleStatChange = (stat: keyof typeof stats, value: number) => {
    const newValue = Math.max(0, value);
    const newStats = { ...stats, [stat]: newValue };
    const newTotal = Object.values(newStats).reduce((a, b) => a + b, 0);
    
    if (newTotal <= maxPoints) {
      setStats(newStats);
    }
  };

  const handleSubmit = () => {
    if (!nome || totalPoints !== maxPoints) {
      alert(`Você precisa distribuir exatamente ${maxPoints} pontos!`);
      return;
    }

    const character: Character = {
      nome,
      foto: foto || "https://via.placeholder.com/100",
      ...stats,
      vida: 10 + stats.constituicao * 2,
      armadura: stats.constituicao + 10,
      arma,
    };

    onStartGame(character);
  };

  return (
    <div className="min-h-screen dungeon-bg flex items-center justify-center p-4">
      <div className="parchment-bg p-8 rounded-sm shadow-2xl max-w-2xl w-full border-4 border-primary">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wider">
          RPG DA LIVRE VONTADE
        </h1>
        <p className="text-center mb-6 text-sm">
          Crie seu comedor de fast food
        </p>
        <p className="text-center mb-6 text-xs">
          Você tem {maxPoints} pontos para distribuir em 5 atributos
        </p>

        <div className="space-y-4">
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

          <div>
            <Label htmlFor="foto" className="text-sm font-bold">Imagem do seu americano:</Label>
            <Input
              id="foto"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              placeholder="Coloque o link"
              className="mt-1 bg-input border-2 border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(stats) as Array<keyof typeof stats>).map((stat) => (
              <div key={stat}>
                <Label htmlFor={stat} className="text-sm font-bold capitalize">
                  {stat === "forca" ? "Força" : 
                   stat === "constituicao" ? "Constituição" : 
                   stat === "inteligencia" ? "Inteligência" : stat}:
                </Label>
                <Input
                  id={stat}
                  type="number"
                  value={stats[stat]}
                  onChange={(e) => handleStatChange(stat, parseInt(e.target.value) || 0)}
                  className="mt-1 bg-input border-2 border-border"
                  min="0"
                />
              </div>
            ))}
          </div>

          <div className="text-center text-sm font-bold">
            Pontos usados: {totalPoints} / {maxPoints}
          </div>

          <div>
            <Label htmlFor="arma" className="text-sm font-bold">Item inicial de todo americano:</Label>
            <Select value={arma} onValueChange={setArma}>
              <SelectTrigger className="mt-1 bg-input border-2 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Espada">Espada</SelectItem>
                <SelectItem value="Arco">Arco</SelectItem>
                <SelectItem value="Cajado">Cajado</SelectItem>
                <SelectItem value="Fé">Fé</SelectItem>
                <SelectItem value="Machado">Machado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 border-2 border-primary-foreground"
          >
            CONFIRMAR AMERICANO 🔥
          </Button>
        </div>
      </div>
    </div>
  );
}
