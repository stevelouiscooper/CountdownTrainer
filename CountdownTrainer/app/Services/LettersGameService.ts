import { Injectable } from '@angular/core';

import { IGameService } from '../Services/Interfaces/IGameService';
import { TimerService } from './TimerService';
import { DictionaryService } from './DictionaryService';
import { UtilitiesService } from './UtilitiesService';

import { Letter } from '../Models/Letter';
import { LettersGameState } from '../Models/LettersGameState';
import { LetterType } from '../Enums/LetterType';
import { GameStage } from '../Enums/GameStage';

@Injectable()
export class LettersGameService implements IGameService {

  private gs: LettersGameState;

  constructor(private dictionaryService: DictionaryService, private timerService: TimerService) {
    this.gs = new LettersGameState();
    this.gs.ShuffledConsonants = UtilitiesService.ShuffleArray(this.gs.CONSONANTS);
    this.gs.ShuffledVowels = UtilitiesService.ShuffleArray(this.gs.VOWELS);
    this.gs.Message = "Select a vowel or consonant to begin.";
    this.gs.GameStage = GameStage.PreGame;
  }

  public get GameState(): LettersGameState {
    return this.gs;
  }

  public SelectLetter(letterType: LetterType): void {
    if (this.gs.GameStage == GameStage.PreGame) {
      this.gs.GameStage = GameStage.UserSelecting;
    }
    if (this.gs.GameStage == GameStage.UserSelecting) {
      if (this.gs.LettersSelected < this.gs.MAX_LETTERS) {
        let max: number;
        let selected: number;
        let letters: string[];
        if (letterType == LetterType.vowel) {
          max = this.gs.MAX_VOWELS;
          selected = this.gs.VowelsSelected;
          letters = this.gs.ShuffledVowels;
        } else {
          max = this.gs.MAX_CONSONANTS;
          selected = this.gs.ConsonantsSelected;
          letters = this.gs.ShuffledConsonants;
        }
        if (selected < max) {
          this.gs.TopRowLetters[this.gs.LettersSelected].Value = letters.pop();
          this.gs.TopRowLetters[this.gs.LettersSelected].Display = true;
          this.gs.LettersSelected++;
          letterType == LetterType.vowel ? this.gs.VowelsSelected++ : this.gs.ConsonantsSelected++;
          if (this.gs.LettersSelected < this.gs.MAX_LETTERS) {
            let plural = (9 - this.gs.LettersSelected) == 1 ? "" : "s";
            this.gs.Message = "Select " + (9 - this.gs.LettersSelected) + " more letter" + plural + ".";
          } else {
            this.gs.GameStage = GameStage.PreTimer;
            this.StartTimer();
          }
        } else {
          this.gs.Message = "You may not select more than " + max + " " + LetterType[letterType] + "s.";
        }
      }
    }
  }

  public StartTimer(): void {
    this.timerService.Start(this.gs, 3, this.preGameCallback, this.preTimerCompleteCallback, 30, this.timerTickCallback, this.timerCompleteCallback, this.postTimerCallback, this.postTimerCompleteCallback);
  }

  preGameCallback(ticks: number, gs: LettersGameState): void {
    gs.Message = "Get ready ... " + ticks;
  }

  preTimerCompleteCallback(gs: LettersGameState): void {
    gs.Message = "COUNTDOWN!!!";
  }

  timerTickCallback(ticks: number, gs: LettersGameState): void {
  }

  timerCompleteCallback(gs: LettersGameState): void {
    LettersGameService.GetSubmittedWord(gs);
    gs.Message = "You submitted: " + gs.SubmittedWord;
  }

  postTimerCallback(ticks: number, gs: LettersGameState): void {
    gs.MaximumScoreAchieved = true;
    gs.GameStage = GameStage.PostGame;
    gs.BestWords = DictionaryService.GetBestWords(LettersGameService.GetLetters(gs.TopRowLetters));
    if (!gs.SubmittedWord) {
      LettersGameService.GetSubmittedWord(gs);
    }
    gs.WordValid = LettersGameService.CheckWordValid(gs.SubmittedWord);
  }

  postTimerCompleteCallback(gs: LettersGameState) {
    if (gs.WordValid) {
      if (gs.SubmittedWord.length == 9) {
        gs.Score = 18;
      } else {
        gs.Score = gs.SubmittedWord.length;
      }
      gs.Message = "Well done. " + gs.SubmittedWord + " scores " + gs.Score + " points";
    } else if (gs.SubmittedWord.length == 0) {
      gs.Score = 0;
      gs.Message = "You failed to submit a word. " + gs.Score + " points";
    } else {
      gs.Score = 0;
      gs.Message = gs.SubmittedWord + " is not a valid word. " + gs.Score + " points";
    }

    gs.MaxPossibleScore = gs.BestWords[0][0].length;
    gs.MaximumScoreAchieved = gs.WordValid && (gs.SubmittedWord.length == gs.BestWords[0][0].length);
    if (gs.MaximumScoreAchieved) {
      gs.Message += " Maximum points!";
    }
    gs.GameStage = GameStage.Finished;
  }

  public Submit(endRound: boolean): void {
    LettersGameService.GetSubmittedWord(this.gs);
    this.ClearBottomRow();
    if (endRound) {
      this.timerService.EndRoundEarly(this.gs, this.timerCompleteCallback, this.postTimerCallback, this.postTimerCompleteCallback);
    } else {
      this.gs.Message = "Submitted word: " + this.gs.SubmittedWord;
    }
  }

  public static GetSubmittedWord(gs: LettersGameState): void {

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
    this.gs = new LettersGameState();
    this.gs.Message = "Select a vowel or consonant to play again.";
    this.gs.GameStage = GameStage.UserSelecting;
    this.gs.ShuffledConsonants = UtilitiesService.ShuffleArray(this.gs.CONSONANTS);
    this.gs.ShuffledVowels = UtilitiesService.ShuffleArray(this.gs.VOWELS);
    this.gs.LettersSelected = 0;
    this.gs.VowelsSelected = 0;
    this.gs.ConsonantsSelected = 0;
    this.gs.NextBottomRowIndex = 0;
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

  public static CheckWordValid(word: string) {
    if (word.length > 0) {
      return DictionaryService.CheckWordValid(word);
    } else {
      return false;
    }
  }
}
