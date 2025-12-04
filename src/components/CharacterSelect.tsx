import { Button } from "@/components/ui/button";
import { getGameProgress } from "@/utils/gameProgress";
import { SPECIAL_CHARACTERS, SpecialCharacter } from "@/utils/specialCharacters";

interface Props {
  onSelect: (character: SpecialCharacter) => void;
  onClose: () => void;
}

export default function CharacterSelect({ onSelect, onClose }: Props) {
  const progress = getGameProgress();

  const isCharacterUnlocked = (char: SpecialCharacter) => {
    // Guerreiro sempre desbloqueado
    if (char.id === 'guerreiro') return true;
    
    // Chronos precisa de 50 vitórias normais E 50 hardcore
    if (char.id === 'chronos') {
      return progress.totalVictories >= 50 && progress.hardcoreVictories >= 50;
    }
    
    // Outros personagens só precisam das vitórias normais
    return progress.totalVictories >= char.requiredVictories;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="parchment-bg border-4 border-primary rounded-sm p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <h1 className="text-4xl font-bold text-primary mb-2 text-center cave-glow">⚔️ SELECIONAR PERSONAGEM ⚔️</h1>
        <p className="text-foreground text-center mb-6 font-bold">
          Vitórias: {progress.totalVictories} | Hardcore: {progress.hardcoreVictories}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {SPECIAL_CHARACTERS.map((char) => {
            const unlocked = isCharacterUnlocked(char);
            const inDev = char.inDevelopment;
            return (
              <div 
                key={char.id}
                className={`p-4 rounded-sm border-4 transition-all duration-300 ${
                  inDev 
                    ? 'bg-muted/50 border-muted cursor-not-allowed'
                    : unlocked 
                      ? 'parchment-bg border-primary hover:border-accent hover:scale-105' 
                      : 'bg-muted/30 border-muted'
                }`}
              >
                {unlocked && !inDev && (
                  <div className="flex justify-center mb-2">
                    <img 
                      src={char.sprite} 
                      alt={char.nome} 
                      className="w-16 h-16 object-contain pixelated hover:animate-bounce"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 text-center ${
                  inDev ? 'text-muted-foreground' : unlocked ? 'text-primary cave-glow' : 'text-muted-foreground'
                }`}>
                  {inDev ? `🚧 ${char.nome} (Em desenvolvimento)` : unlocked ? char.nome : '🔒 Trancado'}
                </h3>
                <p className={`text-sm mb-3 text-center ${unlocked && !inDev ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {unlocked || inDev
                    ? char.descricao 
                    : char.requiredHardcoreVictories 
                      ? `Requer ${char.requiredVictories} vitórias + ${char.requiredHardcoreVictories} hardcore`
                      : `Requer ${char.requiredVictories} vitória${char.requiredVictories > 1 ? 's' : ''}`
                  }
                </p>
                {char.specialType !== 'normal' && unlocked && !inDev && (
                  <p className="text-accent text-xs mb-2 font-bold text-center">
                    ⚡ Habilidade Especial
                  </p>
                )}
                {unlocked && !inDev && (
                  <Button
                    onClick={() => onSelect(char)}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                  >
                    Selecionar
                  </Button>
                )}
                {inDev && (
                  <Button
                    disabled
                    className="w-full bg-muted text-muted-foreground font-bold cursor-not-allowed"
                  >
                    Em breve...
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        <Button
          onClick={onClose}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
