export type EnergyLevel = 'low' | 'medium' | 'high';
export type MotionState = 'stationary' | 'walking' | 'commuting';

export interface ContextSnapshot {
  motionState: MotionState;
  energyLevel: EnergyLevel;
  timestamp: number;
}
