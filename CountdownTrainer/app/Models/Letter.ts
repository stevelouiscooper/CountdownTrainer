export class Letter {
    private _Value: string;
    private _TopRowIndex: number;
    private _BottomRowIndex: number
    private _Display: boolean
    
    constructor(val: string, top: number, bottom: number) {
        this._Value = val;
        this._TopRowIndex = top;
        this._BottomRowIndex = bottom;
        this._Display = false;
    }

    get Value(): string {
        return this._Value;
    }

    set Value(val: string) {
        this._Value = val;
    }

    get TopRowIndex(): number {
        return this._TopRowIndex;
    }

    set TopRowIndex(top: number) {
        this._TopRowIndex = top;
    }

    get BottomRowIndex(): number {
        return this._TopRowIndex;
    }

    set BottomRowIndex(bottom: number) {
        this._BottomRowIndex = bottom;
    }

    get Display(): boolean {
        return this._Display;
    }

    set Display(disp: boolean) {
        this._Display = disp;
    }
}