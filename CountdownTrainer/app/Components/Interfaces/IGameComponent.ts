import { AfterViewInit, ViewChild } from '@angular/core';
import { TimerComponent } from '../../Components/timer/app.timer';
import { MessageBarComponent } from '../../Components/message-bar/app.message-bar';

export interface IGameComponent {
    Timer: TimerComponent;
    messageBar: MessageBarComponent;
    Submit(endRound: boolean): void;
    Clear(): void;
    Reset(): void;
}

