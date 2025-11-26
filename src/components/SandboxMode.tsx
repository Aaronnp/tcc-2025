import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Enemy {
  nome: string;
  forca: number;
  des: number;
  cons: number;
  pdf: number;
  int: number;
  vida: number;
}

interface Props {
  onExit: () => void;
}

export default function SandboxMode({ onExit }: Props) {
  const [playerStats, setPlayerStats] = useState({
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    poderDeFogo: 10,
    vida: 100
  });

  const [customEnemy, setCustomEnemy] = useState<Enemy>({
    nome: "Inimigo Customizado",
    forca: 5,
    des: 5,
    cons: 5,
    pdf: 5,
    int: 5,
    vida: 50
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/80 border-4 border-purple-500 rounded-lg p-8 mb-8">
          <h1 className="text-5xl font-bold text-purple-400 mb-4 text-center animate-pulse">
            🎮 MODO SANDBOX 🎮
          </h1>
          <p className="text-white text-center mb-4">
            Crie suas próprias batalhas e teste diferentes configurações!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Player Stats */}
          <div className="bg-black/80 border-4 border-blue-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">⚔️ Status do Jogador</h2>
            <div className="space-y-3">
              {Object.keys(playerStats).map((stat) => (
                <div key={stat}>
                  <Label className="text-white capitalize">{stat}:</Label>
                  <Input
                    type="number"
                    value={playerStats[stat as keyof typeof playerStats]}
                    onChange={(e) => setPlayerStats({
                      ...playerStats,
                      [stat]: parseInt(e.target.value) || 0
                    })}
                    className="bg-gray-800 text-white border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Enemy Stats */}
          <div className="bg-black/80 border-4 border-red-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">👹 Criar Inimigo</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-white">Nome:</Label>
                <Input
                  type="text"
                  value={customEnemy.nome}
                  onChange={(e) => setCustomEnemy({
                    ...customEnemy,
                    nome: e.target.value
                  })}
                  className="bg-gray-800 text-white border-red-500"
                />
              </div>
              {['forca', 'des', 'cons', 'pdf', 'int', 'vida'].map((stat) => (
                <div key={stat}>
                  <Label className="text-white capitalize">{stat}:</Label>
                  <Input
                    type="number"
                    value={customEnemy[stat as keyof Omit<Enemy, 'nome'>]}
                    onChange={(e) => setCustomEnemy({
                      ...customEnemy,
                      [stat]: parseInt(e.target.value) || 0
                    })}
                    className="bg-gray-800 text-white border-red-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Button
            className="bg-green-600 hover:bg-green-500 text-white text-xl px-8 py-4 font-bold"
            disabled
          >
            🎯 INICIAR BATALHA (Em breve)
          </Button>
          <Button
            onClick={onExit}
            className="bg-red-600 hover:bg-red-500 text-white text-xl px-8 py-4 font-bold"
          >
            ⬅️ SAIR DO SANDBOX
          </Button>
        </div>

        <div className="mt-8 bg-black/80 border-4 border-yellow-500 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">📝 Recursos Sandbox</h3>
          <ul className="text-white space-y-2">
            <li>✅ Personalizar stats do jogador</li>
            <li>✅ Criar inimigos customizados</li>
            <li>🔜 Batalhas customizadas</li>
            <li>🔜 Criar dungeons personalizadas</li>
            <li>🔜 Testar diferentes itens</li>
          </ul>
        </div>
      </div>
    </div>
  );
}