import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

import { IGameService } from '../../Services/Interfaces/IGameService';
import { NumbersGameService } from '../../Services/NumbersGameService';
import { LettersGameService } from '../../Services/LettersGameService';
import { ConundrumGameService } from '../../Services/ConundrumGameService';

import { GameStage } from '../../Enums/GameStage';
import { GameType } from '../../Enums/GameType';

@Component({
    selector: 'timer',
    templateUrl: './app/Components/timer/app.timer.html'
})
export class TimerComponent implements OnInit, AfterViewInit {

    @Input() gameType: GameType;
    private ActiveGameService: IGameService;

    constructor(private numbersGameService: NumbersGameService, private lettersGameService: LettersGameService, private conundrumGameService: ConundrumGameService) {

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
      switch (<any>this.gameType) {
        case GameType.Numbers:
          this.ActiveGameService = this.numbersGameService;
          break;
        case GameType.Letters:
          this.ActiveGameService = this.lettersGameService
          break;
        case GameType.Conundrum:
          this.ActiveGameService = this.conundrumGameService
          break;
        default:
          this.ActiveGameService = null;
          break;
      }
    }

    get ClockStarted(): boolean {
      if (this.ActiveGameService) {
        return this.ActiveGameService.GameState.GameStage == GameStage.ClockStarted;
      } else {
        return false;
      }
    }

    get Display(): string {
      if (this.ActiveGameService && this.ActiveGameService.GameState.GameStage == GameStage.ClockStarted) {
        let leadingZero: string = this.ActiveGameService.GameState.CurrentTime < 10 ? "0" : "";
        return "00:" + leadingZero + this.ActiveGameService.GameState.CurrentTime.toString();
      } else {
        return "00:00"
      }
    }
}
