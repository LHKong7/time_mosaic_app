import type { PieceShape } from '@/types/mosaic';

/** Duration (minutes) → puzzle piece shape */
export function getShapeForDuration(minutes: number): PieceShape {
  if (minutes <= 2) return 'dot';
  if (minutes <= 3) return 'bar';
  if (minutes <= 5) return 'square';
  if (minutes <= 10) return 'L-shape';
  return 'T-shape';
}

/** Shape → number of grid cells it occupies */
export const SHAPE_CELLS: Record<PieceShape, number> = {
  'dot': 1,
  'bar': 2,
  'square': 4,
  'L-shape': 3,
  'T-shape': 4,
};

/** Shape → visual representation (grid offsets from origin) */
export const SHAPE_PATTERNS: Record<PieceShape, [number, number][]> = {
  'dot': [[0, 0]],
  'bar': [[0, 0], [1, 0]],
  'square': [[0, 0], [1, 0], [0, 1], [1, 1]],
  'L-shape': [[0, 0], [0, 1], [1, 1]],
  'T-shape': [[0, 0], [1, 0], [2, 0], [1, 1]],
};

/** Colors assigned to puzzle pieces by cognitive load */
export const PIECE_COLORS: Record<string, string> = {
  low: '#66BB6A',
  medium: '#42A5F5',
  high: '#AB47BC',
};

export const DEFAULT_GRID_SIZE = 10;
