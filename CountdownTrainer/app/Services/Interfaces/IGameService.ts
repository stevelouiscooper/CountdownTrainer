import { TimerService } from '../TimerService';
import { GameStage } from '../../Enums/GameStage';
import { GameState } from '../../Models/GameState';


export interface IGameService {
  GameState: GameState;
  StartTimer(): void;
  preGameCallback(ticks: number, gs: GameState): void;
  preTimerCompleteCallback(gs: GameState): void;
  timerTickCallback(ticks: number, gs: GameState): void;
  timerCompleteCallback(gs: GameState): void;
  postTimerCallback(ticks: number, gs: GameState): void;
  postTimerCompleteCallback(gs: GameState): void;
  Submit(endRound: boolean): void;
  Reset(): void;
}
