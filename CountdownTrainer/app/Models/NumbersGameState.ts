import { GameStage } from '../Enums/GameStage';
import { Equation } from '../Models/Equation';
import { GameState } from './GameState';

export class NumbersGameState extends GameState {
  private _Target: number;
  private _Equations = new Array<Equation>(3);
  private _EquationStr = new Array<string>(3);
  private _ActiveEquation: number;
  private _ActiveOperator: string = null;
  private _OperatorExpected: boolean = false;
  private _SubmittedEquation: Equation;
  private _EquationValid: boolean;
  private _SolutionEquation: Equation;

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

  get Target(): number {
    return this._Target;
  }

  set Target(target: number) {
    this._Target = target;
  }

  get Score(): number {
    return this._Score;
  }

  set Score(score: number) {
    this._Score = score;
  }

  get CurrentTime(): number {
    return this._CurrentTime;
  }

  set CurrentTime(currentTime: number) {
    this._CurrentTime = currentTime;
  }

  get MaximumScoreAchieved(): boolean {
    return this._MaximumScoreAchieved;
  }

  set MaximumScoreAchieved(achieved: boolean) {
    this._MaximumScoreAchieved = achieved;
  }

  get Equations(): Equation[] {
    return this._Equations;
  }

  set Equations(eq: Equation[]) {
    this._Equations = eq;
  }

  get EquationStr(): string[] {
    return this._EquationStr;
  }

  set EquationStr(eq: string[]) {
    this._EquationStr = eq;
  }

  get ActiveEquation(): number {
    return this._ActiveEquation;
  }

  set ActiveEquation(eq: number) {
    this._ActiveEquation = eq;
  }

  get ActiveOperator(): string {
    return this._ActiveOperator;
  }

  set ActiveOperator(op: string) {
    this._ActiveOperator = op;
  }

  get OperatorExpected(): boolean {
    return this._OperatorExpected;
  }

  set OperatorExpected(expected: boolean) {
    this._OperatorExpected = expected;
  }

  get SubmittedEquation(): Equation {
    return this._SubmittedEquation;
  }

  set SubmittedEquation(eq: Equation) {
    this._SubmittedEquation = eq;
  }

  get EquationValid(): boolean {
    return this._EquationValid;
  }

  set EquationValid(valid: boolean) {
    this._EquationValid = valid;
  }

  get SolutionEquation(): Equation {
    return this._SolutionEquation;
  }

  set SolutionEquation(eq: Equation) {
    this._SolutionEquation = eq;
  }
}
