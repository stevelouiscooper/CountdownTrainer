export class Equation {
  private _Left: Equation;
  private _Right: Equation;
  private _Value: number;
  private _Operator: string;
  private _DivideError: boolean;
  private _SubtractError: boolean;

  constructor(value: number, left: Equation, right: Equation, operator: string) {
    this._Value = value;
    this._Left = left;
    this._Right = right;
    this._Operator = operator;
  }

  set Value(val: number) {
    this._Value = val;
  }

  get Value(): number {
    return this._Value;
  }

  set Left(eq: Equation) {
    this._Left = eq;
  }

  get Left(): Equation {
    return this._Left;
  }

  set Right(eq: Equation) {
    this._Right = eq;
  }

  get Right(): Equation {
    return this._Right;
  }

  set Operator(op: string) {
    this._Operator = op;
  }

  get Operator(): string {
    return this._Operator;
  }

  public evaluate = function () {
    if (this._Value != null) {
      return this._Value;
    } else {
      switch (this._Operator) {
        case '+':
          return this._Left.evaluate() + this._Right.evaluate();
        case '-':
          return this._Left.evaluate() - this._Right.evaluate();
        case '*':
          return this._Left.evaluate() * this._Right.evaluate();
        case '/':
          return this._Left.evaluate() / this._Right.evaluate();
      }
    }
  }

  public checkEquationValid = function (): boolean {
    if (this._Value != null) {
      return true;
    } else {
      switch (this._Operator) {
        case '+':
          return this._Left.checkEquationValid() && this._Right.checkEquationValid();
        case '-':
          if (this._Left.evaluate() < this._Right.evaluate()) {
            return false;
          } else {
            return this._Left.checkEquationValid() && this._Right.checkEquationValid()
          }
        case '*':
          return this._Left.checkEquationValid() && this._Right.checkEquationValid();
        case '/': if (this._Left.evaluate() % this._Right.evaluate() != 0) {
          return false;
        } else {
          return this._Left.checkEquationValid() && this._Right.checkEquationValid();
        }
      }
    }
  }

  public IsEmpty = function (): boolean {
    return !this._Value && !this._Left && !this._Right;
  }

  public GetOriginalValuesFromEquation(): number[]  {
    let values: number[] = [];
    if (this.Value != null) {
      values.push(this.Value);
    } else {
      let leftValues: number[] = this.Left ? this.Left.GetOriginalValuesFromEquation() : [];
      let rightValues: number[] = this.Right ? this.Right.GetOriginalValuesFromEquation() : [];
      return leftValues.concat(rightValues);
    }
    return values;
  }

  public toString(): string {
    let op = this._Operator ? " " + this.getOpString(this._Operator) : "";
    if (this._Value) {
      return this._Value.toString() + op;
    } else if (this._Left && !this._Right) {
      return this._Left.toString() + op;
    } else if (this._Left && this._Right) {
      return "(" + this._Left.toString() + op + " " + this._Right.toString() + ")";
    } else {
      return "";
    }
  }

  private getOpString(op: string): string {
    switch (op) {
      case '+':
        return op;
      case '&minus;':
        return op;
      case '*':
        return '&times;';
      case '/':
        return '&divide;';
      default:
        return op;
    }
  }
}
