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
      <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-yellow-500 rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl font-bold text-yellow-500 mb-2 text-center">⚔️ SELECIONAR PERSONAGEM ⚔️</h1>
        <p className="text-white text-center mb-6">
          Vitórias: {progress.totalVictories} | Hardcore: {progress.hardcoreVictories}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {SPECIAL_CHARACTERS.map((char) => {
            const unlocked = isCharacterUnlocked(char);
            return (
              <div 
                key={char.id}
                className={`p-4 rounded-lg border-2 ${
                  unlocked 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-500 hover:border-yellow-300' 
                    : 'bg-gray-900/50 border-gray-700'
                }`}
              >
                {unlocked && (
                  <div className="flex justify-center mb-2">
                    <img 
                      src={char.sprite} 
                      alt={char.nome} 
                      className="w-16 h-16 object-contain pixelated"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${unlocked ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {unlocked ? char.nome : '🔒 Trancado'}
                </h3>
                <p className={`text-sm mb-3 ${unlocked ? 'text-white' : 'text-gray-600'}`}>
                  {unlocked 
                    ? char.descricao 
                    : char.requiredHardcoreVictories 
                      ? `Requer ${char.requiredVictories} vitórias + ${char.requiredHardcoreVictories} hardcore`
                      : `Requer ${char.requiredVictories} vitória${char.requiredVictories > 1 ? 's' : ''}`
                  }
                </p>
                {char.specialType !== 'normal' && unlocked && (
                  <p className="text-cyan-400 text-xs mb-2 font-bold">
                    ⚡ Habilidade Especial
                  </p>
                )}
                {unlocked && (
                  <Button
                    onClick={() => onSelect(char)}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
                  >
                    Selecionar
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        <Button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
