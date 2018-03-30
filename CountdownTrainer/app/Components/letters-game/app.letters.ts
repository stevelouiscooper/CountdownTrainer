import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';

import { IGameComponent } from '../Interfaces/IGameComponent';
import { LettersGameService } from '../../Services/LettersGameService';

import { LetterType } from '../../Enums/LetterType';
import { Letter } from '../../models/Letter';
import { GameStage } from '../../Enums/GameStage';
import { GameType } from '../../Enums/GameType';
import { TimerComponent } from '../timer/app.timer';
import { MessageBarComponent } from '../message-bar/app.message-bar';
import { LettersTopRowComponent } from '../letters-row/app.letters-top-row';
import { LettersBottomRowComponent } from '../letters-row/app.letters-bottom-row';
import { ScoreTracker } from '../../Models/ScoreTracker';

@Component({
    selector: 'letters',
    templateUrl: './app/Components/letters-game/app.letters.html'
})
export class LettersComponent implements IGameComponent {
    @ViewChild(TimerComponent)
    Timer: TimerComponent;

    @ViewChild(MessageBarComponent)
    messageBar: MessageBarComponent;

    @ViewChild(LettersTopRowComponent)
    TopRow: LettersTopRowComponent;

    @ViewChild(LettersBottomRowComponent)
    BottomRow: LettersBottomRowComponent;

    @Input() FullGame: boolean;

    @Output() NextRoundClick: EventEmitter<ScoreTracker> = new EventEmitter<ScoreTracker>();

    readonly SolutionButtonText: string = "Show best words";
    ShowBestWords: boolean;
    BestWords1: string;
    BestWords2: string;
    BestWords3: string;

    readonly GAME_TYPE: GameType = GameType.Letters;

    constructor(private gameService: LettersGameService) {
      this.ShowBestWords = false;
    }

    SelectLetter(letterType: LetterType): void {
      this.gameService.SelectLetter(letterType);
      this.UpdateBoard();
    }
  
    UseLetter(index: number) {
      this.gameService.UseLetter(index);
      this.UpdateBoard();
    }

    ReplaceLetter(index: number) {
      this.gameService.ReplaceLetter(index);
      this.UpdateBoard();
    }

    Submit(endRound: boolean): void {
      this.gameService.Submit(endRound);
      this.UpdateBoard();
    }

    getBestWords(index: number): string {
      let bestWords1: string = "";
      if (this.gameService.GameState.BestWords[index] && this.gameService.GameState.BestWords[index][0]) {
        bestWords1 = this.gameService.GameState.BestWords[index][0].length + " letter words:\n";
        for (let i = 0; i < this.gameService.GameState.BestWords[index].length; i++) {
          bestWords1 += this.gameService.GameState.BestWords[index][i];
          if (i < this.gameService.GameState.BestWords[index].length - 1) {
            bestWords1 += ", ";
          }
        }
        return bestWords1;
      }
    }

    ViewBestWords(): void {
      this.BestWords1 = this.getBestWords(0);
      this.BestWords2 = this.getBestWords(1);
      this.BestWords3 = this.getBestWords(2);
      this.ShowBestWords = true;
    }

    PlayAgain(): void {
      this.ShowBestWords = false;
      this.gameService.Reset();
      this.UpdateBoard();
    }

    Clear(): void {
        this.gameService.ClearBottomRow();
        this.UpdateBoard();
    }

    UpdateBoard(): void {
      this.TopRow.Write(this.gameService.GameState.TopRowLetters);
      this.BottomRow.Write(this.gameService.GameState.BottomRowLetters);
    }

    Reset(): void {
      this.TopRow.Reset();
      this.BottomRow.Reset();
      this.gameService.Reset();
    }

    NextRound(): void {
      this.ShowBestWords = false;
      this.NextRoundClick.emit(new ScoreTracker(this.gameService.GameState.Score, this.gameService.GameState.MaxPossibleScore));
      this.Reset();
    }
}
