import { NumberType } from '../Enums/NumberType';

export class Num {
  private _Value: number;
  private _NumberType: NumberType;
  private _Index: number;
  private _IsSelected: boolean;
  private _IsUsed: boolean;

  constructor(value: number, numberType: number, index: number) {
    this._Value = value;
    this._NumberType = numberType;
    this._Index = index;
    this._IsSelected = false;
    this._IsUsed = false;
  }

  get Value(): number {
    return this._Value;
  }

  set Value(val: number) {
    this._Value = val;
  }

  set NumberType(numberType: NumberType) {
    this._NumberType = numberType;
  }

  get NumberType(): NumberType {
    return this._NumberType;
  }

  set Index(index: number) {
    this._Index = index;
  }

  get Index(): number {
    return this._Index;
  }

  set IsSelected(isSelected: boolean) {
    this._IsSelected = isSelected;
  }

  get IsSelected(): boolean {
    return this._IsSelected;
  }

  set IsUsed(isUsed: boolean) {
    this._IsUsed = isUsed;
  }

  get IsUsed(): boolean {
    return this._IsUsed;
  }
}
