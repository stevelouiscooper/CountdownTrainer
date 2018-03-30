import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryService } from './Services/DictionaryService';
import { TimerService } from './Services/TimerService';
import { NumbersGameService } from './Services/NumbersGameService';
import { LettersGameService } from './Services/LettersGameService';
import { ConundrumGameService } from './Services/ConundrumGameService';
import { UtilitiesService } from './Services/UtilitiesService';

import { CountdownAppComponent } from './Components/app.countdown';
import { MenuComponent }  from './Components/main-menu/app.main-menu';
import { CountdownGameComponent } from './Components/countdown-game/app.countdown-game';
import { LettersComponent } from './Components/letters-game/app.letters';
import { NumbersComponent } from './Components/numbers-game/app.numbers';
import { ConundrumComponent } from './Components/conundrum/app.conundrum';
import { TimerComponent } from './Components/timer/app.timer';
import { LettersTopRowComponent } from './Components/letters-row/app.letters-top-row';
import { LettersBottomRowComponent } from './Components/letters-row/app.letters-bottom-row';
import { ControlButtonsComponent } from './Components/control-buttons/app.control-buttons';
import { MessageBarComponent } from './Components/message-bar/app.message-bar'; 
import { ScoreTrackerComponent } from './Components/score-tracker/app.score-tracker';

@NgModule({
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot([
		{ path: 'app', component: CountdownAppComponent },
    { path: 'countdown', component: CountdownGameComponent },
		{ path: 'letters', component: LettersComponent },
		{ path: 'numbers', component: NumbersComponent },
    { path: 'conundrum', component: ConundrumComponent },
		{ path: 'menu', component: MenuComponent },
	], { useHash: true }
		)],
    declarations: [
        CountdownAppComponent, MenuComponent, CountdownGameComponent, LettersComponent, NumbersComponent, ConundrumComponent,
      TimerComponent, LettersTopRowComponent, LettersBottomRowComponent, ControlButtonsComponent, MessageBarComponent, ScoreTrackerComponent],
    bootstrap: [CountdownAppComponent],
    providers: [UtilitiesService, DictionaryService, TimerService, NumbersGameService, LettersGameService, ConundrumGameService, HttpClient, HttpClientModule]
})
export class AppModule { }
