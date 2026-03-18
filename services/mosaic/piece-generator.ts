import type { MicroTask } from '@/types/task';
import type { PuzzlePiece } from '@/types/mosaic';
import { getShapeForDuration, PIECE_COLORS } from '@/constants/mosaic-config';

let counter = 0;

function generateId(): string {
  counter += 1;
  return `piece-${Date.now()}-${counter}`;
}

export function generatePiece(
  microTask: MicroTask,
  actualDuration: number
): PuzzlePiece {
  return {
    id: generateId(),
    microTaskId: microTask.id,
    shape: getShapeForDuration(actualDuration),
    colorHex: PIECE_COLORS[microTask.cognitiveLoad] ?? PIECE_COLORS.medium,
    earnedAt: Date.now(),
    duration: actualDuration,
  };
}
