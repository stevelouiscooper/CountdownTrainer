import { EventEmitter, Output } from '@angular/core';
import { Letter } from '../../Models/Letter';

export class LettersRowComponent {
    private Letters: string[] = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    @Output() LetterClicked: EventEmitter<number> = new EventEmitter<number>();

    Write(letters: Letter[]) {
        for (let i = 0; i < this.Letters.length; i++) {
            if (letters[i].Display) {
                this.Letters[i] = letters[i].Value;
            } else {
                this.Letters[i] = " ";
            }
        }
    }

    public ClickLetter(index: number): void {
        this.LetterClicked.emit(index);
    }

    public Reset() {
        this.Letters = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    }
}
