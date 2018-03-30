import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import * as dictionary from '../Content/dictionary.json';
import { UtilitiesService } from './UtilitiesService';
import { Observable } from 'rxjs';

@Injectable()
export class DictionaryService {

  //Letters game
  public static DictionaryURL: string = 'app/Content/dictionary.json';
  public static Dictionary: string[] = [];
  public static OneLetterWords: string[] = [];
  public static TwoLetterWords: string[] = [];
  public static ThreeLetterWords: string[] = [];
  public static FourLetterWords: string[] = [];
  public static FiveLetterWords: string[] = [];
  public static SixLetterWords: string[] = [];
  public static SevenLetterWords: string[] = [];
  public static EightLetterWords: string[] = [];
  public static NineLetterWords: string[] = [];

  //Conundrum
  public static ConundrumWordsUrl: string = 'app/Content/conundrum.json';
  public static ConundrumWords: string[] = [];

  constructor(private http: HttpClient) {
    this.GetDictionary();
    this.GetConundrumWords()
  }

  GetDictionary(): void {
    this.http.get(DictionaryService.DictionaryURL)
      .subscribe(data => this.WriteDictionary(<string[]>data));
  }

  GetConundrumWords() {
    this.http.get(DictionaryService.ConundrumWordsUrl)
      .subscribe(data => DictionaryService.ConundrumWords = <string[]>data);
  }

  WriteDictionary(words: string[]): void {
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].trim();
      if (words[i].length < 10 && /^[a-zA-Z]+$/.test(words[i])) {
        switch (words[i].length) {
          case 1:
            DictionaryService.OneLetterWords.push(words[i]);
            break;
          case 2:
            DictionaryService.TwoLetterWords.push(words[i]);
            break;
          case 3:
            DictionaryService.ThreeLetterWords.push(words[i]);
            break;
          case 4:
            DictionaryService.FourLetterWords.push(words[i]);
            break;
          case 5:
            DictionaryService.FiveLetterWords.push(words[i]);
            break;
          case 6:
            DictionaryService.SixLetterWords.push(words[i]);
            break;
          case 7:
            DictionaryService.SevenLetterWords.push(words[i]);
            break;
          case 8:
            DictionaryService.EightLetterWords.push(words[i]);
            break;
          case 9:
            DictionaryService.NineLetterWords.push(words[i]);
            break;
        }
      }
    }
  }


  public static GetConundrumWord(): string {
    return DictionaryService.ConundrumWords[UtilitiesService.GetRandom(0, DictionaryService.ConundrumWords.length)].trim().toUpperCase();
  }

  public static CheckWordValid(word: string): boolean {
    let wordValid: boolean = false;
    word = word.toLowerCase();
    switch (word.length) {
      case 1:
        if (DictionaryService.OneLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 2:
        if (DictionaryService.TwoLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 3:
        if (DictionaryService.ThreeLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 4:
        if (DictionaryService.FourLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 5:
        if (DictionaryService.FiveLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 6:
        if (DictionaryService.SixLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 7:
        if (DictionaryService.SevenLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 8:
        if (DictionaryService.EightLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      case 9:
        if (DictionaryService.NineLetterWords.indexOf(word) > -1) {
          wordValid = true;
        }
        break;
      default:
        wordValid = false;
        break;
    }
    return wordValid;
  }

  public static GetBestWords(letters: string[]): string[][] {
    let bestWords: string[][] = [];

    let possibleNineLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.NineLetterWords);
    let possibleEightLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.EightLetterWords);
    let possibleSevenLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.SevenLetterWords);
    let possibleSixLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.SixLetterWords);
    let possibleFiveLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.FiveLetterWords);
    let possibleFourLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.FourLetterWords);
    let possibleThreeLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.ThreeLetterWords);
    let possibleTwoLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.TwoLetterWords);
    let possibleOneLetterWords = DictionaryService.GetPossibleWords(letters, DictionaryService.OneLetterWords);

    let arraysAdded = 0;

    if (possibleNineLetterWords.length > 0) {
      bestWords.push(possibleNineLetterWords);
      arraysAdded++;
    }
    if (possibleEightLetterWords.length > 0) {
      bestWords.push(possibleEightLetterWords);
      arraysAdded++;
    }
    if (possibleSevenLetterWords.length > 0) {
      bestWords.push(possibleSevenLetterWords);
      arraysAdded++;
    }
    if (possibleSixLetterWords.length > 0 && arraysAdded < 3) {
      bestWords.push(possibleSixLetterWords);
      arraysAdded++;
    }
    if (possibleFiveLetterWords.length > 0 && arraysAdded < 3) {
      bestWords.push(possibleFiveLetterWords);
      arraysAdded++;
    }
    if (possibleFourLetterWords.length > 0 && arraysAdded < 3) {
      bestWords.push(possibleFourLetterWords);
      arraysAdded++;
    }
    if (possibleThreeLetterWords.length > 0 && arraysAdded < 3) {
      bestWords.push(possibleThreeLetterWords);
      arraysAdded++;
    }
    if (possibleTwoLetterWords.length > 0 && arraysAdded < 3) {
      bestWords.push(possibleTwoLetterWords);
      arraysAdded++;
    }
    if (possibleOneLetterWords.length > 0 && arraysAdded < 3) {
      bestWords.push(possibleOneLetterWords);
      arraysAdded++;
    }
    return bestWords;
  }

  private static GetPossibleWords(letters: string[], words: string[]): string[] {
    let possibleWords: string[] = [];
    for (let i = 0; i < words.length; i++) {
      if (DictionaryService.CanBeMadeWithTheseLetters(letters, words[i])) {
        possibleWords.push(words[i]);
      }
    }
    return possibleWords;
  }

  private static CanBeMadeWithTheseLetters(letters: string[], word: string): boolean {
    let copy = <string[]>UtilitiesService.CopyArray(letters);
    word = word.toUpperCase();
    for (let i = 0; i < word.length; i++) {
      let index = copy.indexOf(word[i]);
      if (index > -1) {
        copy.splice(index, 1);
      } else {
        return false;
      }
    }
    return true;
  }
}


