export type PieceShape = 'dot' | 'bar' | 'square' | 'L-shape' | 'T-shape';

export interface PuzzlePiece {
  id: string;
  microTaskId: string;
  shape: PieceShape;
  colorHex: string;
  earnedAt: number;
  duration: number;
}

export interface DailyCanvas {
  date: string; // YYYY-MM-DD
  pieces: PuzzlePiece[];
  gridSize: number; // e.g. 10 for 10x10
  completionRate: number; // 0-1
}
