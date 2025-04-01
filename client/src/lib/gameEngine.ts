import { GameState, Upgrade } from "@shared/schema";

/**
 * Calculate the cost of upgrading to the next level
 * @param upgrade The upgrade to calculate the cost for
 * @returns The cost of the next level
 */
export function calculateUpgradeCost(upgrade: Upgrade): number {
  return Math.floor(upgrade.cost * Math.pow(upgrade.multiplier, 0.5));
}

/**
 * Calculate the effect of an upgrade at a specific level
 * @param upgrade The upgrade to calculate the effect for
 * @param level The level to calculate (defaults to current level)
 * @returns The effect of the upgrade at the specified level
 */
export function calculateUpgradeEffect(upgrade: Upgrade, level?: number): number {
  const effectiveLevel = level !== undefined ? level : upgrade.level;
  if (effectiveLevel <= 0) return 0;
  
  return upgrade.baseEffect * Math.pow(upgrade.multiplier, effectiveLevel - 1);
}

/**
 * Calculate total resource generation per second
 * @param upgrades Array of all upgrades
 * @returns The total resources generated per second
 */
export function calculateResourcesPerSecond(upgrades: Upgrade[]): number {
  return upgrades.reduce((total, upgrade) => {
    return total + calculateUpgradeEffect(upgrade);
  }, 0);
}

/**
 * Calculate resources earned during offline time
 * @param gameState Current game state
 * @param offlineTime Time offline in milliseconds
 * @returns Resources earned while offline
 */
export function calculateOfflineProgress(gameState: GameState, offlineTime: number): number {
  const seconds = offlineTime / 1000;
  const cappedSeconds = Math.min(seconds, 60 * 60 * 24); // Cap at 24 hours
  return gameState.resources.perSecond * cappedSeconds;
}

/**
 * Get next upgrade to unlock
 * @param upgrades Array of all upgrades
 * @returns The next upgrade to unlock or null if all are unlocked
 */
export function getNextUpgradeToUnlock(upgrades: Upgrade[]): Upgrade | null {
  const nextUpgrade = upgrades.find(upgrade => !upgrade.unlocked);
  return nextUpgrade || null;
}

/**
 * Format large numbers to be more readable
 * @param num Number to format
 * @returns Formatted string representation
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  } else {
    return Math.floor(num).toString();
  }
}

/**
 * Format time in seconds to a readable format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  } else if (m > 0) {
    return `${m}m ${s}s`;
  } else {
    return `${s}s`;
  }
}
