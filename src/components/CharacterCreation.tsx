import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

interface Props {
  onStartGame: (character: Character) => void;
  existingCharacter?: Character;
  selectedCharacterBonus?: {
    forca?: number;
    destreza?: number;
    constituicao?: number;
    inteligencia?: number;
    poderDeFogo?: number;
  };
  isAftermatch?: boolean;
}

export default function CharacterCreation({ onStartGame, existingCharacter, selectedCharacterBonus, isAftermatch }: Props) {
  const isLevelUp = !!existingCharacter;
  const [nome, setNome] = useState(existingCharacter?.nome || "");
  const [arma, setArma] = useState(existingCharacter?.arma || "Espada");
  const [hardcore, setHardcore] = useState(existingCharacter?.hardcore || false);
  const [hardcoreUnlocked, setHardcoreUnlocked] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [hellModeActive, setHellModeActive] = useState(false);
  const [redIntensity, setRedIntensity] = useState(0);
  const progress = getGameProgress();
  
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
  const maxPoints = isLevelUp ? pointsToSpend : (hellModeActive ? 35 : 15);

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
      if (!nome) {
        alert("Você precisa escolher um nome!");
        return;
      }
      
      if (totalPoints !== maxPoints) {
        alert(`Você precisa distribuir exatamente ${maxPoints} pontos! (Você usou ${totalPoints})`);
        return;
      }
      
      // Easter eggs
      const isCheatMode = nome.toLowerCase() === 'modocheat';
      const isGokuMode = nome.toLowerCase() === 'modogoku';
      const isSandboxMode = nome.toLowerCase() === 'unlocksandbox';
      const finalPoints = isCheatMode ? 9999 : 0;

      // Aplicar bonus do personagem selecionado
      const bonusStats = selectedCharacterBonus || {};
      const finalStats = {
        forca: stats.forca + (bonusStats.forca || 0),
        destreza: stats.destreza + (bonusStats.destreza || 0),
        constituicao: stats.constituicao + (bonusStats.constituicao || 0),
        inteligencia: stats.inteligencia + (bonusStats.inteligencia || 0),
        poderDeFogo: stats.poderDeFogo + (bonusStats.poderDeFogo || 0),
      };

      const character: Character = {
        nome,
        ...finalStats,
        vida: isGokuMode ? 999999 : (hardcore || isAftermatch ? 10 + finalStats.constituicao : 10 + finalStats.constituicao * 2),
        armadura: finalStats.constituicao + 10,
        arma: isGokuMode ? 'Goku' : (progress.hasDevilWeapon && hardcore ? 'Diabo' : arma),
        level: 1,
        xp: 0,
        pointsToSpend: finalPoints,
        hardcore: hardcore || isAftermatch,
      };

      onStartGame(character);
    }
  };

  const playGlitchSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = Math.random() * 1000 + 100;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleLogoClick = () => {
    if (isLevelUp) return;
    
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    playGlitchSound();
    
    // Aumenta o vermelho gradualmente
    setRedIntensity(prev => Math.min(prev + 10, 100));
    
    if (newCount >= 10 && !hardcoreUnlocked) {
      setHardcoreUnlocked(true);
      setHardcore(true);
      setHellModeActive(true);
      
      // Toca música sombria
      const audio = new Audio('/boss-music.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  // Glitches aleatórios
  useEffect(() => {
    if (!hellModeActive) return;
    
    const glitchInterval = setInterval(() => {
      const elements = document.querySelectorAll('.glitch-target');
      elements.forEach((el) => {
        if (Math.random() < 0.1) {
          el.classList.add('animate-shake');
          setTimeout(() => el.classList.remove('animate-shake'), 300);
        }
      });
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, [hellModeActive]);
  
  const statTooltips = {
    forca: "Aumenta o dano físico de Espada e Machado",
    destreza: "Permite desviar de ataques inimigos",
    constituicao: "Aumenta sua vida e armadura",
    inteligencia: "Adiciona bônus a todos os ataques",
    poderDeFogo: "Aumenta dano de Arco e magias"
  };

  return (
    <TooltipProvider>
      <div 
        className="min-h-screen dungeon-bg flex items-center justify-center p-4 transition-all duration-1000"
        style={{
          backgroundColor: hellModeActive 
            ? `rgb(${Math.min(50 + redIntensity * 2, 139)}, 0, 0)` 
            : undefined
        }}
      >
        <div className={`parchment-bg p-8 rounded-sm shadow-2xl max-w-2xl w-full border-4 ${
          hellModeActive ? 'border-red-600 glitch-target' : 'border-primary'
        }`}>
        <h1 
          className={`text-3xl font-bold text-center mb-2 tracking-wider cursor-pointer select-none glitch-target transition-all ${
            hellModeActive ? 'text-red-600 animate-pulse' : ''
          }`}
          onClick={handleLogoClick}
          title={!isLevelUp && !hardcoreUnlocked ? `Cliques: ${logoClickCount}/10` : ''}
        >
          {isLevelUp ? "LEVEL UP!" : (hellModeActive ? "🔥 RPG DO INFERNO 🔥" : (isAftermatch ? "⚠️ MODO AFTERMATCH ⚠️" : "RPG DAS SOMBRAS"))}
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
                <div className="flex items-center gap-2">
                  <Label htmlFor={stat} className="text-sm font-bold capitalize">
                    {stat === "forca" ? "Força" : 
                     stat === "constituicao" ? "Constituição" : 
                     stat === "inteligencia" ? "Inteligência" :
                     stat === "poderDeFogo" ? "Poder de Fogo" : stat}:
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{statTooltips[stat]}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
            <>
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
              
              {hardcoreUnlocked && (
                <div className="bg-gradient-to-r from-red-900/50 to-black p-6 rounded-lg border-4 border-red-500 shadow-lg shadow-red-500/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="hardcore"
                      checked={hardcore}
                      onChange={(e) => setHardcore(e.target.checked)}
                      className="w-5 h-5 cursor-pointer"
                      disabled={hardcoreUnlocked}
                    />
                    <Label htmlFor="hardcore" className="text-2xl font-bold text-red-400 cursor-pointer animate-pulse">
                      💀🔥 MODO INFERNO ATIVADO! 🔥💀
                    </Label>
                  </div>
                  <p className="text-sm text-red-300 font-bold">
                    +20 PONTOS EXTRAS! Vida reduzida à metade!
                  </p>
                  {progress.hasDevilWeapon && (
                    <p className="text-yellow-400 text-xs mt-2 font-bold">
                      ⚔️ Arma do Diabo desbloqueada! (+30 de dano)
                    </p>
                  )}
                </div>
              )}
            </>
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
    </TooltipProvider>
  );
}
