import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { IGameService } from '../../Services/Interfaces/IGameService';
import { NumbersGameService } from '../../Services/NumbersGameService';
import { LettersGameService } from '../../Services/LettersGameService';
import { ConundrumGameService } from '../../Services/ConundrumGameService';
import { GameType } from '../../Enums/GameType';
import { GameStage } from '../../Enums/GameStage';

@Component({
  selector: 'control-buttons',
  templateUrl: './app/Components/control-buttons/app.control-buttons.html'
})
export class ControlButtonsComponent implements OnInit {

  @Input() FullGame: boolean;
  @Input() ConundrumGame: boolean;
  @Input() SolutionButtonText: string;
  @Input() gameType: GameType;

  //pre-game
  @Output() StartClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  //in game
  @Output() SubmitClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() ClearClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  //post game
  @Output() SolutionClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() PlayAgainClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() NextRoundClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  private ActiveGameService: IGameService;
  gameStage: number;

  constructor(private numbersGameService: NumbersGameService, private lettersGameService: LettersGameService, private conundrumGameService: ConundrumGameService) {  }

  ngOnInit(): void {
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

  Start(): void {
    this.StartClick.emit(true);
  }

  Submit(endRound: boolean): void {
    this.SubmitClick.emit(endRound);
  }

  Clear(): void {
    this.ClearClick.emit(true);
  }

  Solution(): void {
    this.SolutionClick.emit(true);
  }

  PlayAgain(): void {
    this.PlayAgainClick.emit(true);
  }

  NextRound(): void {
    this.NextRoundClick.emit(true);
  }
}
