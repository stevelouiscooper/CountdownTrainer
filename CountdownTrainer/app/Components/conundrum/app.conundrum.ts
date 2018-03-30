import { Component, ViewChild } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';

import { IGameComponent } from '../Interfaces/IGameComponent';
import { ConundrumGameService } from '../../Services/ConundrumGameService';
import { ConundrumGameState } from '../../Models/ConundrumGameState';

import { GameStage } from '../../Enums/GameStage';
import { GameType } from '../../Enums/GameType';
import { TimerComponent } from '../timer/app.timer';
import { MessageBarComponent } from '../message-bar/app.message-bar';
import { LettersTopRowComponent } from '../letters-row/app.letters-top-row';
import { LettersBottomRowComponent } from '../letters-row/app.letters-bottom-row';
import { ScoreTracker } from '../../Models/ScoreTracker';

@Component({
    selector: 'conundrum',
    templateUrl: 'app/Components/conundrum/app.conundrum.html',
})
export class ConundrumComponent implements IGameComponent, OnDestroy {
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

  readonly GAME_TYPE: GameType = GameType.Conundrum;

  constructor(private gameService: ConundrumGameService) {  }

  StartRound() {
    this.gameService.StartRound();
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

  PlayAgain(): void {
    this.Reset();
    this.gameService.StartRound();
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
    this.UpdateBoard();
  }

  NextRound(): void {
    this.NextRoundClick.emit(new ScoreTracker(this.gameService.GameState.Score, 10));
    this.Reset();
  }

  ngOnDestroy() {
    this.Reset();
    this.gameService.Reset();
  }

}
