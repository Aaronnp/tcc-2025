import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VictoryStats {
  tempo: string;
  danoTotal: number;
  pocoesUsadas: number;
  inimigosDerrota: number;
  bossesDerrota: number;
}

interface Achievement {
  id: string;
  nome: string;
  descricao: string;
  conquistado: boolean;
  icone: string;
}

interface Props {
  stats: VictoryStats;
  conquistas: Achievement[];
  onReturnToMenu: () => void;
}

export default function VictoryScreen({ stats, conquistas, onReturnToMenu }: Props) {
  const conquistasObtidas = conquistas.filter(c => c.conquistado);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-900/90 to-black/90 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse" style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.8)' }}>
            🎉 VITÓRIA! 🎉
          </h1>
          <p className="text-2xl text-yellow-200">
            Você derrotou Aeternus e salvou o reino!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Estatísticas da Run */}
          <Card className="bg-black/80 border-4 border-yellow-600 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              📊 Estatísticas
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">⏱️ Tempo de Jogo:</span>
                <span className="text-yellow-200 font-bold">{stats.tempo}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">⚔️ Dano Total Causado:</span>
                <span className="text-red-400 font-bold">{stats.danoTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">🧪 Poções Usadas:</span>
                <span className="text-green-400 font-bold">{stats.pocoesUsadas}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">💀 Inimigos Derrotados:</span>
                <span className="text-purple-400 font-bold">{stats.inimigosDerrota}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">👑 Bosses Derrotados:</span>
                <span className="text-yellow-400 font-bold">{stats.bossesDerrota}</span>
              </div>
            </div>
          </Card>

          {/* Conquistas */}
          <Card className="bg-black/80 border-4 border-yellow-600 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              🏆 Conquistas ({conquistasObtidas.length}/{conquistas.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {conquistas.map((conquista) => (
                <div 
                  key={conquista.id}
                  className={`p-3 rounded border-2 ${
                    conquista.conquistado 
                      ? 'bg-yellow-900/30 border-yellow-600' 
                      : 'bg-gray-900/30 border-gray-700 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{conquista.icone}</span>
                    <div className="flex-1">
                      <div className={`font-bold ${conquista.conquistado ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {conquista.nome}
                      </div>
                      <div className="text-xs text-gray-400">
                        {conquista.descricao}
                      </div>
                    </div>
                    {conquista.conquistado && (
                      <span className="text-green-400 text-xl">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={onReturnToMenu}
            className="bg-yellow-600 hover:bg-yellow-700 text-white text-xl px-8 py-6 border-4 border-yellow-400"
          >
            Voltar ao Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
