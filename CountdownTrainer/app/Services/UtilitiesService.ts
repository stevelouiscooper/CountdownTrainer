import { Injectable } from '@angular/core';

@Injectable()
export class UtilitiesService {

  public static ReplaceAt = function (word: string, index: number, replacement: string) {
    return word.substr(0, index) + replacement + word.substr(index + replacement.length);
  }

  public static CopyArray<T>(original: T[]): T[] {
    let copy: any = [];
    for (let i = 0; i < original.length; i++) {
      copy.push(original[i]);
    }
    return copy;
  }

  public static GetRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static ShuffleArray<T>(original: T[]): T[] {
    let copy = UtilitiesService.CopyArray(original);
    let shuffled = [];
    while (copy.length > 0) {
      let nextIndex: number = UtilitiesService.GetRandom(0, copy.length - 1);
      let next = copy[nextIndex];
      copy[nextIndex] = copy[0];
      shuffled.push(next);
      copy.shift();
    }
    return shuffled;
  }

  public static ScrambleWord(word: string): string {
    let scrambled: string = "";
    while (word.length > 0) {
      let nextCharIndex: number = UtilitiesService.GetRandom(0, word.length - 1);
      let nextChar = word.charAt(nextCharIndex);
      word = UtilitiesService.ReplaceAt(word, nextCharIndex, word.charAt(0));
      scrambled += nextChar;
      word = word.substr(1);
    }
    return scrambled;
  }
}
