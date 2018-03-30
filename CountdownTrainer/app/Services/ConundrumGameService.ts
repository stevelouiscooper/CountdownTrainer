import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IGameService } from '../Services/Interfaces/IGameService';
import { TimerService } from './TimerService';
import { DictionaryService } from './DictionaryService';
import { UtilitiesService } from './UtilitiesService';
import { Letter } from '../Models/Letter';
import { ConundrumGameState } from '../Models/ConundrumGameState';
import { GameStage } from '../Enums/GameStage';

@Injectable()
export class ConundrumGameService implements IGameService {


  private _ShowBestWords: boolean = true;
  private gs: ConundrumGameState;
  public gameStateObservable: Observable<ConundrumGameState>;
  private _gameStateBehaviourSubject: BehaviorSubject<ConundrumGameState>;

  constructor(private dictionaryService: DictionaryService, private timerService: TimerService) {
    this.gs = new ConundrumGameState();
    this.gs.GameStage = GameStage.PreGame;
    this.gs.Message = "Countdown Conundrum!!!";
  }

  public get GameState(): ConundrumGameState {
    return this.gs;
  }

  public StartRound() {
    this.StartTimer();
  }

  public StartTimer(): void {
    this.ClearBottomRow();
    this.gs.Solution = DictionaryService.GetConundrumWord();
    this.gs.SubmittedWord = "";
    this.gs.ConundrumWord = UtilitiesService.ScrambleWord(this.gs.Solution);
    for (let i = 0; i < this.gs.TopRowLetters.length; i++) {
      this.gs.TopRowLetters[i].Value = this.gs.ConundrumWord[i];
      this.gs.TopRowLetters[i].Display = true;
      this.gs.TopRowLetters[i].BottomRowIndex = null;
    }
    this.timerService.Start(this.gs, 0, this.preGameCallback, this.preTimerCompleteCallback, 30, this.timerTickCallback, this.timerCompleteCallback, this.postTimerCallback, this.postTimerCompleteCallback);
  }

  preGameCallback(ticks: number, gs: ConundrumGameState): void {
  }

  preTimerCompleteCallback(gs: ConundrumGameState): void {
    gs.Message = "COUNTDOWN!!!";
  }

  timerTickCallback(ticks: number, gs: ConundrumGameState): void {

  }

  timerCompleteCallback(gs: ConundrumGameState): void {
    gs.Message = "Time's Up!";
    ConundrumGameService.GetSubmittedWord(gs);
    gs.Message = gs.SubmittedWord.length === 9 ? "You submitted: " + gs.SubmittedWord : "You failed to submit an answer.";
  }

  postTimerCallback(ticks: number, gs: ConundrumGameState): void {
    gs.GameStage = GameStage.PostGame;
    if (!gs.SubmittedWord) {
      ConundrumGameService.GetSubmittedWord(gs);
    }
    gs.WordValid = gs.SubmittedWord === gs.Solution;
  }

  postTimerCompleteCallback(gs: ConundrumGameState) {
    if (gs.WordValid) {
        gs.Score = 10;
      gs.Message = "Well done. You solved the Conundrum! "
    } else {
      gs.Score = 0;
      gs.Message = "Bad luck the answer was: " + gs.Solution + ". ";
    }
    gs.Message += gs.Score + " points";
    gs.MaximumScoreAchieved = gs.WordValid;
    gs.GameStage = GameStage.Finished;
  }

  public Submit(endRound: boolean): void {
    ConundrumGameService.GetSubmittedWord(this.gs);
    this.ClearBottomRow();
    if (endRound) {
      this.timerService.EndRoundEarly(this.gs, this.timerCompleteCallback, this.postTimerCallback, this.postTimerCompleteCallback);
    } else {
      this.gs.Message = "Submitted word: " + this.gs.SubmittedWord;
    }
  }

  public static GetSubmittedWord(gs: ConundrumGameState): void {
    let word: string = "";
    for (let i = 0; i < gs.BottomRowLetters.length; i++) {
      if (gs.BottomRowLetters[i].Value != " ") {
        word += gs.BottomRowLetters[i].Value;
      }
    }
    if (word != "") {
      gs.SubmittedWord = word;
    }
  }

  public ClearBottomRow(): void {
    for (let i = 0; i < this.gs.BottomRowLetters.length; i++) {
      this.gs.BottomRowLetters[i].Value = " ";
      this.gs.BottomRowLetters[i].TopRowIndex = null;
      this.gs.BottomRowLetters[i].Display = false;

      this.gs.TopRowLetters[i].Display = true;
      this.gs.TopRowLetters[i].BottomRowIndex = null;
    }
    this.gs.NextBottomRowIndex = 0;
  }

  public Reset(): void {
    this.gs = new ConundrumGameState();
    this.gs.Message = "Countdown Conundrum!!!";
    this.gs.GameStage = GameStage.PreGame;
    this.timerService.Reset();
  }

  public UseLetter(index: number): void {
    if (this.gs.GameStage == GameStage.ClockStarted && this.gs.TopRowLetters[index].Display) {
      this.gs.TopRowLetters[index].BottomRowIndex = this.gs.NextBottomRowIndex;
      this.gs.TopRowLetters[index].Display = false;

      this.gs.BottomRowLetters[this.gs.NextBottomRowIndex].Value = this.gs.TopRowLetters[index].Value;
      this.gs.BottomRowLetters[this.gs.NextBottomRowIndex].TopRowIndex = index;
      this.gs.BottomRowLetters[this.gs.NextBottomRowIndex].Display = true;
      this.gs.NextBottomRowIndex++;
    }
  }

  public ReplaceLetter(index: number): void {
    if (this.gs.GameStage == GameStage.ClockStarted && this.gs.BottomRowLetters[index].Display) {
      let topRowIndex = this.gs.BottomRowLetters[index].TopRowIndex;
      this.gs.BottomRowLetters[index].TopRowIndex = null;
      this.gs.BottomRowLetters[index].Display = false;
      this.gs.BottomRowLetters[index].Value = " ";

      this.gs.TopRowLetters[topRowIndex].BottomRowIndex = null;
      this.gs.TopRowLetters[topRowIndex].Display = true;

      this.gs.NextBottomRowIndex = this.ShiftLettersLeft();
    }
  }

  public static GetLetters(letterObjects: Letter[]): string[] {
    let letters: string[] = [];
    for (let i = 0; i < letterObjects.length; i++) {
      letters.push(letterObjects[i].Value);
    }
    return letters;
  }

  private ShiftLettersLeft(): number {
    let nextIndex = 0;
    for (let i = 0; i < this.gs.BottomRowLetters.length - 1; i++) {
      let currentLetter: Letter = this.gs.BottomRowLetters[i];
      let nextLetter = this.gs.BottomRowLetters[i + 1];
      if (!currentLetter.Display && nextLetter.Display) {
        currentLetter.Value = nextLetter.Value;
        currentLetter.TopRowIndex = nextLetter.TopRowIndex;
        currentLetter.Display = true;
        nextLetter.Value = " ";
        nextLetter.TopRowIndex = null;
        nextLetter.Display = false;
        nextIndex = i + 1;
      } else if (!currentLetter.Display && !nextLetter.Display) {
        return i;
      }
    }
    return nextIndex;
  }

}
