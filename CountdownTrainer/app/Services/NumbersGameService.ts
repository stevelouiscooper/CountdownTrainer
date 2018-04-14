import { Injectable } from '@angular/core';

import { IGameService } from '../Services/Interfaces/IGameService';
import { TimerService } from './TimerService';
import { UtilitiesService } from './UtilitiesService';

import { Num } from '../Models/Num';
import { NumbersGameState } from '../Models/NumbersGameState';
import { GameStage } from '../Enums/GameStage';
import { NumberType } from '../Enums/NumberType';
import { Equation } from '../Models/Equation';

@Injectable()

export class NumbersGameService implements IGameService {

  private readonly BIG_NUMBERS: number[] = [25, 50, 75, 100];
  private readonly SMALL_NUMBERS: number[] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
  public readonly MAX_NUMBERS = 6;

  private gs: NumbersGameState;
  private bigNumbers: Num[];
  private smallNumbers: Num[];
  private SelectedNumbers: Num[];
  private numbersSelected: number;

  constructor(private timerService: TimerService) {
    this.gs = new NumbersGameState();
    this.bigNumbers = this.ShuffleNumbers(this.BIG_NUMBERS, NumberType.large);
    this.smallNumbers = this.ShuffleNumbers(this.SMALL_NUMBERS, NumberType.small);
    this.gs.GameStage = GameStage.PreGame;
    this.gs.Message = "Select " + this.MAX_NUMBERS + " numbers to begin.";
  }

  public get NumbersSelected(): number {
      return this.numbersSelected;
  }

  private initialise(): void {
    this.gs.GameStage = GameStage.PreGame;
    this.SelectedNumbers = [];
    this.numbersSelected = 0;
    this.gs.Equations[0] = this.createEmptyEquation();
    this.gs.Equations[1] = this.createEmptyEquation();
    this.gs.Equations[2] = this.createEmptyEquation();
    this.gs.EquationStr[0] = null;
    this.gs.EquationStr[1] = null;
    this.gs.EquationStr[2] = null;
    this.gs.Target = null;
    this.gs.SubmittedEquation = null;
    this.gs.ActiveEquation = 0;
    this.timerService.Reset();
  }

  public get GameState(): NumbersGameState {
    return this.gs;
  }

  private ShuffleNumbers(unshuffled: number[], numberType: number): Num[] {
    let numbers: number[] = <number[]>UtilitiesService.CopyArray(unshuffled);
    let shuffled: Num[] = [];
    while (numbers.length > 0) {
      let index: number = 0;
      let nextNumberIndex: number = UtilitiesService.GetRandom(0, numbers.length - 1);
      let nextNumber = numbers[nextNumberIndex];
      numbers[nextNumberIndex] = numbers[0];
      shuffled.push(new Num(nextNumber, numberType, index++));
      numbers.shift();
    }
    return shuffled;
  }

  public SelectNumber(num: Num): void {
    if (this.gs.GameStage === GameStage.PreGame) {
      this.initialise();
      this.gs.GameStage = GameStage.UserSelecting;
    }
    if (!num.IsSelected) {
      num.IsSelected = true;
      this.numbersSelected++;
      this.SelectedNumbers.push(num);
      let plural = this.numbersSelected == 5 ? "" : "s";
      if (this.numbersSelected < this.MAX_NUMBERS) {
        this.gs.Message = "Select " + (this.MAX_NUMBERS - this.numbersSelected) + " more number" + plural + ".";
      } else {
        this.SetTarget(true);
      }
    }
  }

  public StartTimer(): void {
        setTimeout(() => {
            this.gs.GameStage = GameStage.PreTimer;
            this.timerService.Start(this.gs, 3, this.preGameCallback, this.preTimerCompleteCallback, 30, this.timerTickCallback, this.timerCompleteCallback, this.postTimerCallback, this.postTimerCompleteCallback);
        }, 400);
  }
  
  preGameCallback(ticks: number, gs: NumbersGameState): void {
    gs.Message = "Get ready ... " + ticks;
  }

  preTimerCompleteCallback(gs: NumbersGameState): void {
    gs.Message = "COUNTDOWN!!!";
  }

  timerTickCallback(ticks: number, gs: NumbersGameState): void {

  }

  timerCompleteCallback(gs: NumbersGameState): void {

  }

  postTimerCallback(ticks: number, gs: NumbersGameState): void {
    gs.MaximumScoreAchieved = true;
    if (!gs.SubmittedEquation) {
      let completeEquations: number = NumbersGameService.GetCompleteEquations(gs);
      if (completeEquations == 1) {
        gs.SubmittedEquation = NumbersGameService.GetSubmittedEquation(gs);
        gs.Message = "You submitted: " + gs.SubmittedEquation.toString();
      } else if (completeEquations == 0) {
        gs.EquationValid = false;
        gs.Score = 0;
        gs.Message = "You did not submit an answer. 0 points scored.";
      } else {
        gs.EquationValid = false;
        gs.Score = 0;
        gs.Message = "You must submit a single equation as your answer. 0 points scored.";
      }
    } else {
      gs.Message = "You submitted: " + gs.SubmittedEquation.toString();
    }
  }

  postTimerCompleteCallback(gs: NumbersGameState): void {
    gs.Score = 0;
    if (gs.SubmittedEquation) {
      if (gs.SubmittedEquation.Left && !gs.SubmittedEquation.Right) {
        gs.SubmittedEquation = gs.SubmittedEquation.Left;
      }
      gs.EquationValid = NumbersGameService.CheckEquationValid(gs.SubmittedEquation);
      if (gs.EquationValid) {
        let answer: number = gs.SubmittedEquation.evaluate();
        gs.Score = NumbersGameService.GetNumbersGameScore(answer, gs.Target);
        gs.Message = "You declared " + answer + ". " + gs.Score + " points scored.";
      } else {
        gs.Message = "Your answer contained an invalid equation. 0 points."
      }
    }
    gs.MaximumScoreAchieved = gs.EquationValid && (gs.Score === 10);
    if (gs.MaximumScoreAchieved) {
      gs.Message += " Maximum points!";
    }
    gs.GameStage = GameStage.Finished;
  }

  public Submit(endRound: boolean): void {
    if (endRound) {
      this.timerService.EndRoundEarly(this.gs, this.timerCompleteCallback, this.postTimerCallback, this.postTimerCompleteCallback);
    } else {
      let completeEquations: number = NumbersGameService.GetCompleteEquations(this.gs);
      if (completeEquations == 1) {
        this.gs.SubmittedEquation = NumbersGameService.GetSubmittedEquation(this.gs);
        this.gs.Message = "Submitted equation: " + this.gs.SubmittedEquation.toString();
        this.Clear();
      } else {
        this.gs.Message = "You can only submit when there is one equation on the board.";
      }
    }
  }

  public EndGame(): void {

  }

  public UseNumber(num: Num): number {
    let lastActiveEquation = this.gs.ActiveEquation;
    if (!num.IsUsed && this.gs.GameStage === GameStage.ClockStarted) {
      num.IsUsed = true;
      if (!this.gs.OperatorExpected) {
        //We weren't expecting an operator. Let's build an equation
        if (!this.gs.ActiveOperator) {
          //We don't have an active operator. Start a new equation.
          //Check if we already have an equation being built
          if (!this.gs.Equations[this.gs.ActiveEquation].IsEmpty()) {
            //if so replace the left side with new number
            let oldValue = this.gs.Equations[this.gs.ActiveEquation].Left.Value;
            this.gs.Equations[this.gs.ActiveEquation].Left = new Equation(num.Value, null, null, null);

            //replace the old value in the unused numbers row
            let replacedNum: Num = this.SelectedNumbers.filter(n => n.IsUsed == true && n.Value == oldValue)[0];
            replacedNum.IsUsed = false;
          } else {
            //Create left half of new equation
            let left: Equation = new Equation(num.Value, null, null, null);

            //Create new equation in the active equation slot
            this.gs.Equations[this.gs.ActiveEquation] = new Equation(null, left, null, null);
          }
          //And await next operator
          this.gs.OperatorExpected = true;
        } else {
          //We have an active operator. Build a new equation from active equation and our number

          //Create right half of new equation
          let right: Equation = new Equation(num.Value, null, null, null);

          //Add new right half of the active equation
          this.gs.Equations[this.gs.ActiveEquation].Right = right;

          //Move active equation slot up one
          if (this.gs.ActiveEquation < 2) {
            this.gs.ActiveEquation++;
          } else {
            this.gs.ActiveEquation = 0;
          }
          //Reset active operator
          this.gs.ActiveOperator = null;
        }
      } else {
        //We were expecting an operator. Never mind. Just rebuild active equation with current value.

        //Check if we already have an equation being built
        //if so replace the left side with new number
        let oldValue = this.gs.Equations[this.gs.ActiveEquation].Left.Value;
        this.gs.Equations[this.gs.ActiveEquation].Left = new Equation(num.Value, null, null, null);

        //replace the old value in the unused numbers row
        let replacedNum: Num = this.SelectedNumbers.filter(n => n.IsUsed == true && n.Value == oldValue)[0];
        replacedNum.IsUsed = false;

        //Create left half of new equation
        let left: Equation = new Equation(num.Value, null, null, null);

        //Create new equation in the active equation slot
        this.gs.Equations[this.gs.ActiveEquation] = new Equation(null, left, null, null);
        //And await next operator
      }
      this.WriteEquations(this.gs);
    }
    return lastActiveEquation;
  }

  public UseEquation(index: number): number {
    let lastActiveEquation: number = this.gs.ActiveEquation;
    if (this.gs.GameStage === GameStage.ClockStarted) {
      let equation = this.gs.Equations[index];
      if (!this.gs.OperatorExpected) {
        //We weren't expecting an operator. Let's build an equation.
        if (!this.gs.ActiveOperator) {
          //We don't have an active operator.
          //Set active equation to be a new equation with this equation on the left ...
          this.gs.Equations[index] = new Equation(null, this.gs.Equations[index], null, null);
          this.gs.ActiveEquation = index;
          lastActiveEquation = this.gs.ActiveEquation;
          //... and await operator
          this.gs.OperatorExpected = true;
          let opExpected = this.gs.OperatorExpected;
        } else if (index == this.gs.ActiveEquation && !equation.Right) {
          //just replace the values in equation
          let usedNumbers: number[] = equation.GetOriginalValuesFromEquation();
          this.ReplaceNumbers(usedNumbers);
          this.gs.Equations[index] = this.createEmptyEquation();
          this.gs.ActiveOperator = null;
        } else {
          //We have an active operator. Build a new equation from active equation and our number
          //Create new right half of equation
          let right: Equation = equation;

          //Set right of half of active equation
          this.gs.Equations[this.gs.ActiveEquation].Right = right;

          //Reset active equation slot to empty
          this.gs.Equations[index] = this.createEmptyEquation();

          //Move active equation slot up one
          if (this.gs.ActiveEquation < 2) {
            this.gs.ActiveEquation++;
          } else {
            this.gs.ActiveEquation = 0;
          }

          //Reset active operator
          this.gs.ActiveOperator = null;
        }
      } else {
        //We were expecting an operator. Never mind. Just set active equation to selected equation.
        this.gs.ActiveEquation = index;
      }
      this.WriteEquations(this.gs);
    }
    return lastActiveEquation;
  }

  public UseOperator(op: string) {
    let lastActiveEquation: number = this.gs.ActiveEquation;
    if (this.gs.GameStage === GameStage.ClockStarted) {
      if (!this.gs.Equations[this.gs.ActiveEquation].IsEmpty()) {
        //We have an active equation
        this.gs.ActiveOperator = op;
        if (this.gs.OperatorExpected) {
          if (this.gs.Equations[this.gs.ActiveEquation].Left && !this.gs.Equations[this.gs.ActiveEquation].Right) {
            //We have left side of equation only
            //Set the operator of the active equation to selected operator.
            this.gs.Equations[this.gs.ActiveEquation].Operator = op;
          } else if (this.gs.Equations[this.gs.ActiveEquation].Left && this.gs.Equations[this.gs.ActiveEquation].Right) {
            //active equation is an equation
            //Create left half of new equation
            this.gs.Equations[this.gs.ActiveEquation] = new Equation(null, this.gs.Equations[this.gs.ActiveEquation], null, op);
            //And await right half of equation
          }

          //We are no longer expecting an operator.
          this.gs.OperatorExpected = false;
        } else {
          //We weren't expecting an operator.
          //Set the operator of the active equation to selected operator.
          this.gs.Equations[this.gs.ActiveEquation].Operator = op;
        }
      }
      this.WriteEquations(this.gs);
    }
    return lastActiveEquation;
  }

  public Clear(): void {
    this.gs.ActiveEquation = 0;
    this.gs.Equations[0] = this.createEmptyEquation();
    this.gs.Equations[1] = this.createEmptyEquation();
    this.gs.Equations[2] = this.createEmptyEquation();
    this.SelectedNumbers.forEach(num => num.IsUsed = false);
    this.WriteEquations(this.gs);
  }

  public Reset(): void {
    this.gs.GameStage = GameStage.PreGame;
    this.gs.Message = "Select " + this.MAX_NUMBERS + " numbers to begin.";
    this.bigNumbers = this.ShuffleNumbers(this.BIG_NUMBERS, NumberType.large);
    this.smallNumbers = this.ShuffleNumbers(this.SMALL_NUMBERS, NumberType.small);
    this.initialise();
  }

  private createEmptyEquation(): Equation {
    return new Equation(null, null, null, "");
  }

  private SetTarget(ensureSolvable: boolean) {
    if (ensureSolvable) {
      this.gs.SolutionEquation = this.GenerateTargetFromSelectedNumbers(this.SelectedNumbers)
      this.gs.Target = this.gs.SolutionEquation.evaluate();
    } else {
      this.gs.Target = UtilitiesService.GetRandom(100, 999);
    }
  }

  private GenerateTargetFromSelectedNumbers(SelectedNumbers: Num[]): Equation {
    let target = 0;
    let eq: Equation = null;
    while (!(target > 100 && target < 1000)) {
      let copiedNumbers = UtilitiesService.CopyArray(SelectedNumbers);
      let numbersUsed = 0;
      let rand: number = Math.random();
      if (rand < 0.02) {
        numbersUsed = 2;
      } else if (rand < 0.14) {
        numbersUsed = 3;
      } else if (rand < 0.50) {
        numbersUsed = 4;
      } else if (rand < 0.8) {
        numbersUsed = 5;
      } else {
        numbersUsed = 6;
      }

      let numbersForEquation: number[] = [];

      //ensure the largest number is used, to prevent always getting low targets
      let maxIndex: number = this.GetMax(copiedNumbers);
      numbersForEquation.push(copiedNumbers[maxIndex].Value);
      copiedNumbers[maxIndex] = copiedNumbers[0];
      copiedNumbers.shift();

      while (numbersForEquation.length < numbersUsed) {
        let nextNumberIndex: number = UtilitiesService.GetRandom(0, copiedNumbers.length - 1);
        let nextNumber = copiedNumbers[nextNumberIndex];
        copiedNumbers[nextNumberIndex] = copiedNumbers[0];
        numbersForEquation.push(nextNumber.Value);
        copiedNumbers.shift();
      }
      eq = this.GenerateEquationFromNumbers(numbersForEquation);
      target = eq.evaluate();
    }
    return eq;
  }

  private GenerateEquationFromNumbers(numbers: number[]): Equation {
    let eq: Equation = this.createEmptyEquation();
    while (numbers.length > 0) {
      if (numbers[0] && numbers[1]) {
        if (eq.IsEmpty()) {
          eq.Left = new Equation(numbers[0], null, null, null);
          eq.Right = new Equation(numbers[1], null, null, null);
          let rand = Math.random();
          eq.Operator = rand > 0.75 && (numbers[1] > 1) ? "*" : "+";//force positive operator on first equation, to ensure numbers aren't always low
        } else {
          let right: Equation = new Equation(null, new Equation(numbers[0], null, null, null), new Equation(numbers[1], null, null, null), this.GetAppropriateOperator(numbers[0], numbers[1]));
          eq = new Equation(null, eq, right, this.GetAppropriateOperator(eq.evaluate(), right.evaluate()));
        }
        numbers.shift();
        numbers.shift();
      } else {
        let right = new Equation(numbers[0], null, null, null);
        eq = new Equation(null, eq, right, this.GetAppropriateOperator(eq.evaluate(), right.evaluate()));
        numbers.shift();
      }
    }
    return eq;
  }

  private GetMax(numbers: Num[]) {
    let maxIndex: number = 0;
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i].Value > numbers[maxIndex].Value) {
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  private GetAppropriateOperator(num1: number, num2: number): string {
    let operators: string[] = ["+"];
    if (num1 * num2 < 1000 && (num1 > 1 && num2 > 1)) {
      operators.push("*");
    }
    if (num1 % num2 == 0 && (num1 > 1 && num2 > 1)) {
      operators.push("/");
    }
    if (num1 > num2) {
      operators.push("-");
    }
    if (num1 % num2 == 0) {
      operators.push("/");
    }
    return operators[UtilitiesService.GetRandom(0, operators.length - 1)];
  }

  private ReplaceNumbers(values: number[]) {
    values.forEach((value) => {
      let replacedNum: Num = this.SelectedNumbers.filter(n => n.IsUsed == true && n.Value == value)[0];
      replacedNum.IsUsed = false;
    });
  }

  private WriteEquations(gs: NumbersGameState): void {
    gs.EquationStr[0] = gs.Equations[0].toString();
    gs.EquationStr[1] = gs.Equations[1].toString();
    gs.EquationStr[2] = gs.Equations[2].toString();
  };

  public static GetCompleteEquations(gs: NumbersGameState): number {
    let totalCompleteEquations = 0;
    if (!gs.Equations[0].IsEmpty()) {
      totalCompleteEquations++;
    }
    if (!gs.Equations[1].IsEmpty()) {
      totalCompleteEquations++;
    }
    if (!gs.Equations[2].IsEmpty()) {
      totalCompleteEquations++;
    }
    return totalCompleteEquations;
  }

  public static GetSubmittedEquation(gs: NumbersGameState): Equation {
    if (!gs.Equations[0].IsEmpty()) {
      return gs.Equations[0];
    } else if (!gs.Equations[1].IsEmpty()) {
      return gs.Equations[1];
    } else if (!gs.Equations[2].IsEmpty()) {
      return gs.Equations[2];
    } else {
      return null;
    }
  }

  public static CheckEquationValid(eq: Equation): boolean {
    if (!eq || eq.IsEmpty()) {
      return false;
    } else {
      return eq.checkEquationValid()
    }
  }

  public static GetNumbersGameScore(answer: number, target: number): number {
    let score: number = 0;
    let diff: number = Math.abs(answer - target);
    if (diff == 0) {
      score = 10;
    } else if (diff <= 5) {
      score = 7;
    } else if (diff <= 10) {
      score = 5;
    }
    return score;
  }

  public ShowSolution(): void {
    if (this.gs.GameStage === GameStage.Finished) {
      this.gs.Message = "Solution: " + this.gs.SolutionEquation.toString();
    }
  }
}
