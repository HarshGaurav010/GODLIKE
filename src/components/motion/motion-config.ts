/**
 * Every tunable value for the intro voyage and the hero barrels.
 * Colours, sizes and layers live in src/styles/tokens.css (--intro-*, --barrel-*).
 */

export const INTRO = {
  /** Transparent ship cut-out. The source bow points left, so it is mirrored. */
  shipSrc: "/images/pirate/intro/ship.webp",
  shipWidth: 669,
  shipHeight: 551,
  mirrorShip: true,
  /** Total crossing time, from off-screen left to off-screen right. */
  durationMs: 3000,
  /** Where the reveal seam sits, as a fraction of the ship's width from its stern. */
  seamAt: 0.55,
  /** Gentle rocking and bobbing on the waves. */
  rockDeg: 2.4,
  rockHz: 0.85,
  bobPx: 8,
  bobHz: 1.25,
  /** Bow lifts while the ship accelerates and dips as it slows. */
  pitchDeg: 2.5,
  /** If the ship image is not ready by then, skip straight to the site. */
  maxWaitForShipMs: 1500,
  /** Fade used when a visitor clicks, scrolls or presses a key to skip. */
  skipFadeMs: 280,
  /** Play once per browser tab; set false to play on every full page load. */
  oncePerSession: true,
  storageKey: "isle-intro-seen",
} as const;

export const BARRELS = {
  src: "/images/pirate/intro/barrel.webp",
  /** Width / height of the barrel cut-out. */
  aspect: 0.81,
  /** Never more than this many barrels in the hero at once. */
  maxAlive: 3,
  /** Pause between drops, picked randomly in this range (ms). */
  spawnEveryMs: [2600, 5200],
  firstDropDelayMs: 700,
  /** Barrel height as a fraction of the hero width, clamped in px. */
  sizeOfWidth: 0.075,
  sizePx: [28, 130],
  /** Per-barrel size variation. */
  sizeJitter: [0.85, 1.2],
  /** px/s². A touch stronger than "real" for a punchy fall. */
  gravity: 2600,
  /** Fraction of vertical speed kept on each bounce. */
  restitution: 0.42,
  /** Stop bouncing below this impact speed (px/s). */
  minBounceSpeed: 170,
  /** Spin while falling, deg/s, random within ±. */
  fallSpin: 90,
  /** Chance a barrel tumbles sideways after landing instead of wobbling. */
  tumbleChance: 0.4,
  tumbleSpeed: [160, 340],
  /** Rolling resistance, px/s². */
  rollFriction: 420,
  /** Spring that settles a barrel upright or on its side. */
  settleStiffness: 160,
  settleDamping: 10,
  /** Kick given to a landing barrel so it wobbles, deg/s. */
  wobbleKick: 260,
  /** Landing squash strength (0 disables it). */
  squash: 0.14,
  /** How long a barrel rests before fading away. */
  restMs: 2600,
  fadeMs: 650,
  /** Minimum gap between a landing barrel and headings/buttons/the ship (px). */
  keepOutMargin: 10,
} as const;
