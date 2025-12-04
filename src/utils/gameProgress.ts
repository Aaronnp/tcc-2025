export interface GameProgress {
  totalVictories: number;
  hardcoreVictories: number;
  aftermatchVictories: number;
  unlockedCharacters: number[];
  hasDevilWeapon: boolean;
  sandboxUnlocked: boolean;
}

export const getGameProgress = (): GameProgress => {
  const saved = localStorage.getItem('rpg_progress');
  if (!saved) {
    return {
      totalVictories: 0,
      hardcoreVictories: 0,
      aftermatchVictories: 0,
      unlockedCharacters: [],
      hasDevilWeapon: false,
      sandboxUnlocked: false
    };
  }
  return JSON.parse(saved);
};

export const saveGameProgress = (progress: GameProgress) => {
  localStorage.setItem('rpg_progress', JSON.stringify(progress));
};

export const resetGameProgress = () => {
  localStorage.removeItem('rpg_progress');
};

export const addVictory = (isHardcore: boolean, isAftermatch: boolean) => {
  const progress = getGameProgress();
  progress.totalVictories++;
  if (isHardcore) {
    progress.hardcoreVictories++;
    progress.hasDevilWeapon = true;
  }
  if (isAftermatch) progress.aftermatchVictories++;
  
  // Desbloquear personagens
  if (progress.totalVictories >= 1 && !progress.unlockedCharacters.includes(1)) {
    progress.unlockedCharacters.push(1);
  }
  if (progress.totalVictories >= 3 && !progress.unlockedCharacters.includes(2)) {
    progress.unlockedCharacters.push(2);
  }
  if (progress.totalVictories >= 5 && !progress.unlockedCharacters.includes(3)) {
    progress.unlockedCharacters.push(3);
  }
  if (progress.totalVictories >= 10 && !progress.unlockedCharacters.includes(4)) {
    progress.unlockedCharacters.push(4);
  }
  if (progress.totalVictories >= 25 && progress.hardcoreVictories >= 1 && !progress.unlockedCharacters.includes(5)) {
    progress.unlockedCharacters.push(5);
  }
  if (progress.aftermatchVictories >= 1 && !progress.unlockedCharacters.includes(6)) {
    progress.unlockedCharacters.push(6);
  }
  
  // 100% = 6 personagens + vitória hardcore + vitória aftermatch
  if (progress.unlockedCharacters.length === 7 && progress.hardcoreVictories >= 1 && progress.aftermatchVictories >= 1) {
    progress.sandboxUnlocked = true;
  }
  
  saveGameProgress(progress);
};
