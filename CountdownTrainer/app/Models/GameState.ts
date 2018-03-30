import { GameStage } from '../Enums/GameStage';

export class GameState {
  protected _Message: string;
  protected _GameStage: GameStage;
  protected _Score: number;
  protected _MaximumScoreAchieved: boolean;
  protected _CurrentTime: number;
  public Message: string;
  public GameStage: GameStage;
  public Score: number;
  public MaximumScoreAchieved: boolean;
  public CurrentTime: number;

  constructor() {

  }
}
