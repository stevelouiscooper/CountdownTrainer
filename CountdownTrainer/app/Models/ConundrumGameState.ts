import { GameStage } from '../Enums/GameStage';
import { GameState } from './GameState';
import { Letter } from './Letter';

export class ConundrumGameState extends GameState {

  //setup
  private _Solution: string;
  private _ConundrumWord: string;
  private _NextBottomRowIndex: number = 0;

  //in game
  private _TopRowLetters: Letter[];
  private _BottomRowLetters: Letter[];
  private _SubmittedWord: string;

  //post game
  private _WordValid: boolean;

  constructor() {
    super();
    this._GameStage = GameStage.UserSelecting;
    this._TopRowLetters = [];
    this._BottomRowLetters = [];
    for (let i = 0; i < 9; i++) {
      this._TopRowLetters.push(new Letter(" ", i, null));
      this._BottomRowLetters.push(new Letter(" ", i, null));
    }
  }

  get Solution(): string {
    return this._Solution;
  }

  set Solution(m: string) {
    this._Solution = m;
  }

  get ConundrumWord(): string {
    return this._ConundrumWord;
  }

  set ConundrumWord(m: string) {
    this._ConundrumWord = m;
  }

  get Message(): string {
    return this._Message;
  }

  set Message(m: string) {
    this._Message = m;
  }

  get GameStage(): GameStage {
    return this._GameStage;
  }

  set GameStage(stage: GameStage) {
    this._GameStage = stage;
  }

  get MaximumScoreAchieved(): boolean {
    return this._MaximumScoreAchieved;
  }

  set MaximumScoreAchieved(achieved: boolean) {
    this._MaximumScoreAchieved = achieved;
  }

  get TopRowLetters(): Letter[] {
    return this._TopRowLetters;
  }

  set TopRowLetters(letters: Letter[]) {
    this._TopRowLetters = letters;
  }

  get BottomRowLetters(): Letter[] {
    return this._BottomRowLetters;
  }

  set BottomRowLetters(letters: Letter[]) {
    this._BottomRowLetters = letters;
  }
  
  get NextBottomRowIndex(): number {
    return this._NextBottomRowIndex;
  }

  set NextBottomRowIndex(nextBottomRowIndex: number) {
    this._NextBottomRowIndex = nextBottomRowIndex;
  }

  get SubmittedWord(): string {
    return this._SubmittedWord;
  }

  set SubmittedWord(word: string) {
    this._SubmittedWord = word;
  }

  get WordValid(): boolean {
    return this._WordValid;
  }

  set WordValid(valid: boolean) {
    this._WordValid = valid;
  }

  get Score(): number {
    return this._Score;
  }

  set Score(score: number) {
    this._Score = score;
  }
}
