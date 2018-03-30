import { Injectable } from '@angular/core';

import { GameState } from '../Models/GameState';
import { GameStage } from '../Enums/GameStage';

@Injectable()
export class TimerService {

  private PreTimer: any;
  private Timer: any;
  private PostTimer: any;

  public Reset(): void {
    clearInterval(this.PreTimer);
    clearInterval(this.Timer);
    clearInterval(this.PostTimer);
  }

  public Start(gs: GameState, preTimerTicks: number, preTimerTickCallback: Function, preTimerCompleteCallback: Function, timerTicks: number, timerCallback: Function, timerCompleteCallback: Function, postTimerCallback: Function, postTimerCompleteFunction: Function): void {
    gs.GameStage = GameStage.PreTimer;
    this.PreTimer = setInterval(() => {
      if (preTimerTicks > 0) {
        preTimerTickCallback(preTimerTicks, gs);
      } else if (preTimerTicks === 0) {
        preTimerCompleteCallback(gs);
        clearInterval(this.PreTimer);
        this.TimerStart(gs, timerTicks, timerCallback, timerCompleteCallback, postTimerCallback, postTimerCompleteFunction);
      }
      preTimerTicks--;
    }, 1000);
  }

  private TimerStart(gs: GameState, timerTicks: number, timerCallback: Function, timerCompleteCallback: Function, postTimerCallback: Function, postTimerCompleteFunction: Function) {
    gs.GameStage = GameStage.ClockStarted;
    gs.CurrentTime = timerTicks;
    this.Timer = setInterval(() => {
      if (timerTicks > 0) {
        gs.CurrentTime = timerTicks;
        timerCallback(timerTicks, gs);
      } else if (timerTicks === 0) {
        gs.GameStage = GameStage.PostGame;
        timerCompleteCallback(gs);
        clearInterval(this.Timer);
        this.PostTimerStart(gs, postTimerCallback, postTimerCompleteFunction)
      }
      timerTicks--;
    }, 1000);
  }

  private PostTimerStart(gs: GameState, postTimerCallback: Function, postTimerCompleteFunction: Function ) {
    let postTimerTicks = 3;
    this.PostTimer = setInterval(() => {
      if (postTimerTicks > 0) {
        postTimerCallback(postTimerTicks, gs);
      } else if (postTimerTicks === 0) {
        postTimerCompleteFunction(gs);
        clearInterval(this.Timer);
      }
      postTimerTicks--;
    }, 1000);
  }

  public EndRoundEarly(gs: GameState, timerCompleteCallback: Function, postTimerCallback: Function, postTimerCompleteFunction: Function) {
    gs.GameStage = GameStage.PostGame;
    timerCompleteCallback(gs);
    clearInterval(this.Timer);
    this.PostTimerStart(gs, postTimerCallback, postTimerCompleteFunction);
  }
}
