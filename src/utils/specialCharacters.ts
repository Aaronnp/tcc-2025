// Tipos para personagens especiais
import heroSukuna from "@/assets/hero-sukuna.png";
import heroLuffy from "@/assets/hero-luffy.png";
import heroLuffyGear2 from "@/assets/hero-luffy-gear2.png";
import heroLuffyGear3 from "@/assets/hero-luffy-gear3.png";
import heroLuffyGear4 from "@/assets/hero-luffy-gear4.png";
import heroLuffyGear5 from "@/assets/hero-luffy-gear5.png";
import heroYi from "@/assets/hero-yi.png";
import heroGojo from "@/assets/hero-gojo.png";
import heroMario from "@/assets/hero-mario.png";
import heroChronos from "@/assets/hero-chronos.png";
import heroGoku from "@/assets/hero-goku.png";
import heroSonic from "@/assets/hero-sonic.png";
import heroSword from "@/assets/hero-sword.png";
import heroGuest1337 from "@/assets/hero-guest1337.png";

export interface SpecialCharacter {
  id: string;
  nome: string;
  descricao: string;
  sprite: string;
  requiredVictories: number;
  requiredHardcoreVictories?: number;
  inDevelopment?: boolean;
  specialType: 'sukuna' | 'luffy' | 'yi' | 'gojo' | 'mario' | 'guest1337' | 'chronos' | 'goku' | 'sonic' | 'normal';
}

export const SPECIAL_CHARACTERS: SpecialCharacter[] = [
  {
    id: 'guerreiro',
    nome: 'Guerreiro',
    descricao: 'Personagem padrão',
    sprite: heroSword,
    requiredVictories: 0,
    specialType: 'normal'
  },
  {
    id: 'guest1337',
    nome: 'Guest 1337',
    descricao: 'Bloqueio poderoso! 50% chance de bloquear e dobrar dano do próximo ataque',
    sprite: heroGuest1337,
    requiredVictories: 1,
    specialType: 'guest1337'
  },
  {
    id: 'mario',
    nome: 'Mario',
    descricao: 'Cogumelo! +15 de dano por 2 turnos (cooldown 4 turnos)',
    sprite: heroMario,
    requiredVictories: 2,
    specialType: 'mario'
  },
  {
    id: 'yi',
    nome: 'Yi',
    descricao: '9 vidas! Counter → Insert → EXPLODE (500 de dano)',
    sprite: heroYi,
    requiredVictories: 5,
    specialType: 'yi'
  },
  {
    id: 'luffy',
    nome: 'Luffy',
    descricao: 'Sistema de Gears! Transformações poderosas com custos',
    sprite: heroLuffy,
    requiredVictories: 7,
    specialType: 'luffy'
  },
  {
    id: 'sukuna',
    nome: 'Sukuna',
    descricao: 'Rei das Maldições! 4 ataques especiais devastadores',
    sprite: heroSukuna,
    requiredVictories: 8,
    specialType: 'sukuna'
  },
  {
    id: 'gojo',
    nome: 'Gojo',
    descricao: 'O Mais Forte! Infinito, Azul, Vermelho, Vazio Roxo e Expansão de Domínio',
    sprite: heroGojo,
    requiredVictories: 9,
    specialType: 'gojo'
  },
  {
    id: 'goku',
    nome: 'Goku',
    descricao: 'Poder do Kamehameha! Derrota qualquer inimigo',
    sprite: heroGoku,
    requiredVictories: 10,
    specialType: 'goku'
  },
  {
    id: 'sonic',
    nome: 'Sonic',
    descricao: 'Velocidade extrema! Desvia de todos os ataques',
    sprite: heroSonic,
    requiredVictories: 10,
    specialType: 'sonic'
  },
  {
    id: 'chronos',
    nome: 'CHRONOS',
    descricao: 'Deus do Tempo! Voltar turnos, teleporte entre salas, TRANSFORM (inimigo vira bebê)',
    sprite: heroChronos,
    requiredVictories: 50,
    requiredHardcoreVictories: 50,
    specialType: 'chronos'
  }
];

// Estado de habilidades do Sukuna
export interface SukunaState {
  desmantelarCooldown: number; // 2 turnos
  clevarCooldown: number; // 4 turnos
  fugaCooldown: number; // 5 turnos
  santuarioCooldown: number; // 10 turnos
}

// Estado de habilidades do Luffy
export interface LuffyState {
  currentGear: 0 | 2 | 3 | 4 | 5;
  gearTurnsActive: number;
  stunTurns: number; // Turnos sem fazer nada
  gearMenuOpen: boolean;
}

// Estado de habilidades do Yi
export interface YiState {
  lives: number; // 9 vidas
  currentStep: 'counter' | 'insert' | 'explode';
  hasTalisman: boolean;
}

// Estado de habilidades do Gojo
export interface GojoState {
  azulCooldown: number; // 5 turnos
  vermelhoCooldown: number; // 5 turnos
  vazioRoxoCooldown: number; // 10 turnos
  infinitoCooldown: number; // 5 turnos
  infinitoTurnsActive: number; // 3 turnos de invulnerabilidade
  vazioInfinitoUsed: boolean; // Só pode usar 1x
  enemyStunTurns: number; // Turnos que o inimigo fica paralisado
}

// Estado de habilidades do Mario
export interface MarioState {
  mushroomCooldown: number; // 4 turnos
  mushroomTurnsActive: number; // 2 turnos de buff
}

// Estado de habilidades do Guest1337
export interface Guest1337State {
  nextAttackDouble: boolean;
}

// Estado de habilidades do Chronos
export interface ChronosState {
  lastTurnState: any; // Salva o estado do turno anterior
  canRewind: boolean;
  transformUsed: boolean;
}

// Sprites do Luffy por Gear
export const LUFFY_SPRITES: Record<number, string> = {
  0: heroLuffy,
  2: heroLuffyGear2,
  3: heroLuffyGear3,
  4: heroLuffyGear4,
  5: heroLuffyGear5,
};

// Funções auxiliares
export const getCharacterSprite = (specialType: string, luffyGear?: number): string => {
  switch (specialType) {
    case 'sukuna': return heroSukuna;
    case 'luffy': return LUFFY_SPRITES[luffyGear || 0];
    case 'yi': return heroYi;
    case 'gojo': return heroGojo;
    case 'mario': return heroMario;
    case 'guest1337': return heroGuest1337;
    case 'chronos': return heroChronos;
    case 'goku': return heroGoku;
    case 'sonic': return heroSonic;
    default: return heroSword;
  }
};

// Calcula dano do Sukuna
export const calculateSukunaDamage = (attack: 'desmantelar' | 'clevar' | 'fuga' | 'santuario'): number => {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  switch (attack) {
    case 'desmantelar': return 30 + diceRoll;
    case 'clevar': return 50 + diceRoll;
    case 'fuga': return 35 + diceRoll;
    case 'santuario': return 250 + diceRoll;
  }
};

// Calcula bônus do Gear do Luffy
export const getLuffyGearBonus = (gear: number): { forca: number; destreza: number } => {
  switch (gear) {
    case 2: return { forca: 10, destreza: 25 };
    case 3: return { forca: 35, destreza: 0 };
    case 4: return { forca: 50, destreza: 25 };
    case 5: return { forca: 100, destreza: 50 }; // Gear 5: destreza alta, mas não infinita
    default: return { forca: 0, destreza: 0 };
  }
};

// Calcula custo do Gear do Luffy
export const getLuffyGearCost = (gear: number): string => {
  switch (gear) {
    case 2: return '-3 de vida por turno ativo';
    case 3: return '-5 de vida por turno ativo';
    case 4: return 'Dura 3 turnos, depois fica 2 turnos sem fazer nada';
    case 5: return '3 turnos para acabar com o oponente, senão 10 turnos sem fazer nada';
    default: return '';
  }
};

// Calcula dano do Gojo
export const calculateGojoDamage = (attack: 'azul' | 'vermelho' | 'vazioRoxo'): number => {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  switch (attack) {
    case 'azul': return 50 + diceRoll;
    case 'vermelho': return 35 + diceRoll;
    case 'vazioRoxo': return 150 + diceRoll;
  }
};
