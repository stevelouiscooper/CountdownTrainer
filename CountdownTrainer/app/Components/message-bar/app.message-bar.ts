import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import { IGameService } from '../../Services/Interfaces/IGameService';
import { NumbersGameService } from '../../Services/NumbersGameService';
import { LettersGameService } from '../../Services/LettersGameService';
import { ConundrumGameService } from '../../Services/ConundrumGameService';
import { GameType } from '../../Enums/GameType';

@Component({
  selector: 'message-bar',
  templateUrl: './app/Components/message-bar/app.message-bar.html'
})
export class MessageBarComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() gameType: GameType;
  private ActiveGameService: IGameService;
  private _display: string;

  constructor(private numbersGameService: NumbersGameService, private lettersGameService: LettersGameService, private conundrumGameService: ConundrumGameService, private cdRef: ChangeDetectorRef) {
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

  ngAfterViewChecked() {
    
    if (this.ActiveGameService) {
      this._display = this.ActiveGameService.GameState.Message;
    } else {
      this._display = "Waiting for Game Service"
    }
    this.cdRef.detectChanges();
  }

  get Display(): string {
    return this._display;
  }
}
