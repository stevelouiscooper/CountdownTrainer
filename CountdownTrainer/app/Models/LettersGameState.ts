import { LetterType } from '../Enums/LetterType';
import { GameStage } from '../Enums/GameStage';
import { GameState } from './GameState';
import { Letter } from './Letter';

export class LettersGameState extends GameState {

    //constants
    private readonly _CONSONANTS: string[] = [
      "B", "B",
      "C", "C",
      "F", "F", "F",
      "G", "G", "G",
      "H", "H",
      "J",
      "K",
      "L", "L", "L", "L",
      "M", "M",
      "N", "N", "N", "N", "N", "N",
      "P", "P",
      "Q",
      "R", "R", "R", "R", "R", "R",
      "S", "S", "S", "S",
      "T", "T", "T", "T", "T", "T",
      "V", "V",
      "W", "W",
      "X",
      "Y", "Y",
      "Z"
    ];
    private readonly _VOWELS: string[] = [
      "A", "A", "A", "A", "A", "A", "A", "A", "A",
      "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
      "I", "I", "I", "I", "I", "I", "I", "I", "I",
      "O", "O", "O", "O", "O", "O", "O", "O",
      "U", "U", "U", "U",
    ];
    private readonly _MAX_LETTERS: number = 9;
    private readonly _MAX_CONSONANTS: number = 6;
    private readonly _MAX_VOWELS: number = 5;

    //setup and letter selection
    private _ShuffledConsonants: string[];
    private _ShuffledVowels: string[];
    private _LettersSelected: number = 0;
    private _VowelsSelected: number = 0;
    private _ConsonantsSelected: number = 0;
    private _NextBottomRowIndex: number = 0;

    //in game
    private _TopRowLetters: Letter[];
    private _BottomRowLetters: Letter[];
    private _SubmittedWord: string;

    //post game
    private _WordValid: boolean;
    private _BestWords: string[][];
    private _MaxPossibleScore: number;

    constructor() {
      super();
        this._TopRowLetters = [];
        this._BottomRowLetters = [];
        for (let i = 0; i < 9; i++) {
            this._TopRowLetters.push(new Letter(" ", i, null));
            this._BottomRowLetters.push(new Letter(" ", i, null));
        }
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

    get CONSONANTS(): string[] {
      return this._CONSONANTS;
    }

    get VOWELS(): string[] {
      return this._VOWELS;
    }

    get MAX_LETTERS(): number {
      return this._MAX_LETTERS;
    }

    get MAX_CONSONANTS(): number {
      return this._MAX_CONSONANTS;
    }

    get MAX_VOWELS(): number {
      return this._MAX_VOWELS;
    }

    get ShuffledConsonants(): string[] {
      return this._ShuffledConsonants;
    }

    set ShuffledConsonants(shuffledConsonants: string[]){
      this._ShuffledConsonants = shuffledConsonants;
    }

    get ShuffledVowels(): string[] {
      return this._ShuffledVowels;
    }

    set ShuffledVowels(shuffledVowels: string[]) {
      this._ShuffledVowels = shuffledVowels;
    }

    get LettersSelected(): number {
      return this._LettersSelected;
    }

    set LettersSelected(lettersSelected: number) {
      this._LettersSelected = lettersSelected;
    }

    get VowelsSelected(): number {
      return this._VowelsSelected;
    }

    set VowelsSelected(vowelsSelected: number) {
      this._VowelsSelected = vowelsSelected;
    }

    get ConsonantsSelected(): number {
      return this._ConsonantsSelected;
    }

    set ConsonantsSelected(consonantsSelected: number) {
      this._ConsonantsSelected = consonantsSelected;
    }

    get NextBottomRowIndex(): number {
      return this._NextBottomRowIndex;
    }

    set NextBottomRowIndex(nextBottomRowIndex: number) {
      this._NextBottomRowIndex = nextBottomRowIndex;
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

    get BestWords(): string[][] {
        return this._BestWords;
    }

    set BestWords(bestWords: string[][]) {
        this._BestWords = bestWords;
    }

    get MaxPossibleScore(): number {
      return this._MaxPossibleScore;
    }

    set MaxPossibleScore(maxPossibleScore: number) {
      this._MaxPossibleScore = maxPossibleScore;
    }
}
