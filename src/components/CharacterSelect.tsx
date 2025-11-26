import { Button } from "@/components/ui/button";
import { getGameProgress } from "@/utils/gameProgress";

interface Character {
  id: number;
  nome: string;
  descricao: string;
  bonus: {
    forca?: number;
    destreza?: number;
    constituicao?: number;
    inteligencia?: number;
    poderDeFogo?: number;
  };
  requiredVictories: number;
  requiredHardcore?: boolean;
}

const CHARACTERS: Character[] = [
  {
    id: 0,
    nome: "Guerreiro",
    descricao: "Personagem padrão",
    bonus: {},
    requiredVictories: 0
  },
  {
    id: 1,
    nome: "Arqueiro Sombrio",
    descricao: "+5 Destreza, +3 Poder de Fogo",
    bonus: { destreza: 5, poderDeFogo: 3 },
    requiredVictories: 1
  },
  {
    id: 2,
    nome: "Mago das Sombras",
    descricao: "+8 Inteligência, +4 Poder de Fogo",
    bonus: { inteligencia: 8, poderDeFogo: 4 },
    requiredVictories: 3
  },
  {
    id: 3,
    nome: "Paladino",
    descricao: "+6 Força, +6 Constituição",
    bonus: { forca: 6, constituicao: 6 },
    requiredVictories: 5
  },
  {
    id: 4,
    nome: "Lorde das Sombras",
    descricao: "+10 em todos os atributos",
    bonus: { forca: 10, destreza: 10, constituicao: 10, inteligencia: 10, poderDeFogo: 10 },
    requiredVictories: 10
  },
  {
    id: 5,
    nome: "Campeão Imortal",
    descricao: "+15 em todos os atributos, Modo AFTERMATCH",
    bonus: { forca: 15, destreza: 15, constituicao: 15, inteligencia: 15, poderDeFogo: 15 },
    requiredVictories: 25,
    requiredHardcore: true
  },
  {
    id: 6,
    nome: "Deus Guerreiro",
    descricao: "+50 em todos os atributos (Requer vitória AFTERMATCH)",
    bonus: { forca: 50, destreza: 50, constituicao: 50, inteligencia: 50, poderDeFogo: 50 },
    requiredVictories: 999 // Requer vitória no aftermatch
  }
];

interface Props {
  onSelect: (character: Character) => void;
  onClose: () => void;
}

export default function CharacterSelect({ onSelect, onClose }: Props) {
  const progress = getGameProgress();

  const isCharacterUnlocked = (char: Character) => {
    if (char.id === 0) return true;
    if (char.id === 6) {
      return progress.unlockedCharacters.includes(6);
    }
    return progress.unlockedCharacters.includes(char.id);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-yellow-500 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl font-bold text-yellow-500 mb-2 text-center">⚔️ SELECIONAR PERSONAGEM ⚔️</h1>
        <p className="text-white text-center mb-6">Vitórias: {progress.totalVictories} | Hardcore: {progress.hardcoreVictories}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {CHARACTERS.map((char) => {
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
                <h3 className={`text-xl font-bold mb-2 ${unlocked ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {unlocked ? char.nome : '🔒 Trancado'}
                </h3>
                <p className={`text-sm mb-3 ${unlocked ? 'text-white' : 'text-gray-600'}`}>
                  {unlocked ? char.descricao : `Requer ${char.requiredVictories} vitória${char.requiredVictories > 1 ? 's' : ''}${char.requiredHardcore ? ' + 1 Hardcore' : ''}`}
                </p>
                {unlocked && (
                  <>
                    {char.id === 5 && (
                      <p className="text-red-500 text-xs mb-2 font-bold">⚠️ Desbloqueia modo AFTERMATCH</p>
                    )}
                    <Button
                      onClick={() => onSelect(char)}
                      className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
                    >
                      Selecionar
                    </Button>
                  </>
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