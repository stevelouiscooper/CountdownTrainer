import { Component, ViewChild } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';

import { IGameComponent } from '../Interfaces/IGameComponent';
import { NumbersGameService } from '../../Services/NumbersGameService';
import { Num } from '../../Models/Num';
import { GameStage } from '../../Enums/GameStage';
import { GameType } from '../../Enums/GameType';
import { TimerComponent } from '../timer/app.timer';
import { MessageBarComponent } from '../message-bar/app.message-bar';
import { NumberType } from '../../Enums/NumberType';
import { Equation } from '../../Models/Equation';
import { ScoreTracker } from '../../Models/ScoreTracker';

@Component({
    selector: 'numbers',
    templateUrl: 'app/Components/numbers-game/app.numbers.html',
    providers: [NumbersGameService]
})
export class NumbersComponent implements IGameComponent {
    @ViewChild(TimerComponent)
    Timer: TimerComponent;

    @ViewChild(MessageBarComponent)
    messageBar: MessageBarComponent;

    @Input() FullGame: boolean;

    @Output() NextRoundClick: EventEmitter<ScoreTracker> = new EventEmitter<ScoreTracker>();

    ShowSelection = true;
    ShowBoard = false;
    ShowSolution: boolean = false;
    readonly SolutionButtonText: string = "Show solution";

    readonly GAME_TYPE: GameType = GameType.Numbers;

    constructor(private numbersGameService: NumbersGameService) {
        
    }

    SelectNumber(num: Num): void {
      this.numbersGameService.SelectNumber(num);
      if (this.numbersGameService.GameState.GameStage == GameStage.PreTimer) {
          this.numbersGameService.StartTimer();
      }
    }

    ClickNumber(num: Num): void {
      this.numbersGameService.UseNumber(num);
    }

    ClickOperator(operator: string): void {
        this.numbersGameService.UseOperator(operator);
    }

		ClickEquation(index: number): void {
			this.numbersGameService.UseEquation(index);
		}

    Submit(endRound: boolean): void {
      this.numbersGameService.Submit(endRound);
    } 

    Clear(): void {
      this.numbersGameService.Clear();
    } 

    PlayAgain(): void {
      this.numbersGameService.Reset();
    }

    ViewSolution(): void {
      this.numbersGameService.ShowSolution();
    }

    Reset(): void {

    }

    NextRound(): void {
      this.NextRoundClick.emit(new ScoreTracker(this.numbersGameService.GameState.Score, 10));
    } 
}
