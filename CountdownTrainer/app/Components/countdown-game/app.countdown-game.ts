import { Component } from '@angular/core';

import { GameType } from '../../Enums/GameType';
import { ScoreTracker } from '../../Models/ScoreTracker';

@Component({
    selector: 'countdown-game',
    templateUrl: 'app/Components/countdown-game/app.countdown-game.html',
})
export class CountdownGameComponent {
  public Score: number;
  public MaxPossibleScore: number;
  public currentGameType: number;
  public Round: number;
  public GameOver: boolean;
  public Percentage: number;
  public GameOverMessage: string;

  constructor() {
    this.initialise();
  }

  initialise(): void {
    this.GameOver = false;
    this.Round = 1;
    this.currentGameType = this.SetGameType(this.Round);
    this.Score = 0;
    this.MaxPossibleScore = 0;
  }

  SetGameType(round: number): number {
    switch (round) {
      case 1:
        return <number>GameType.Letters;
      case 2:
        return <number>GameType.Letters;
      case 3:
        return <number>GameType.Numbers;
      case 4:
        return <number>GameType.Letters;
      case 5:
        return <number>GameType.Letters;
      case 6:
        return <number>GameType.Numbers;
      case 7:
        return <number>GameType.Letters;
      case 8:
        return <number>GameType.Letters;
      case 9:
        return <number>GameType.Numbers;
      case 10:
        return <number>GameType.Letters;
      case 11:
        return <number>GameType.Letters;
      case 12:
        return <number>GameType.Letters;
      case 13:
        return <number>GameType.Letters;
      case 14:
        return <number>GameType.Numbers;
      case 15:
        return <number>GameType.Conundrum;
      default:
        return 0;
    }
  }

  NextRound(scoreTracker: ScoreTracker) {
    this.Score += scoreTracker.Score;
    this.MaxPossibleScore += scoreTracker.MaxPossibleScore;
    if (this.Round < 15) {
      this.Round++;
      this.currentGameType = this.SetGameType(this.Round);
    } else {
      this.GameOver = true;
      this.Percentage = Math.round((this.Score / this.MaxPossibleScore) * 100);
      this.GameOverMessage = "Game over. You scored " + this.Score + " points. That's " + this.Percentage + "%. ";
      if (this.Score === this.MaxPossibleScore) {
        this.GameOverMessage += " That's a perfect score!";
      } else if (this.Percentage >= 90) {
        this.GameOverMessage += " That's a terrific score!";
      } else if (this.Percentage >= 80) {
        this.GameOverMessage += " That's a very good score!"
      } else if (this.Percentage >= 70) {
        this.GameOverMessage += " That's a pretty good score!"
      } else if (this.Percentage >= 60) {
        this.GameOverMessage += " That's a good effort!"
      } else {
        this.GameOverMessage += " That's dog shit!"
      }
    }
  }

  PlayAgain() {
    this.initialise();
  }
}
