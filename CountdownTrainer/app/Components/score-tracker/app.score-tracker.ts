import { Component, Input } from '@angular/core';

@Component({
  selector: 'score-tracker',
  templateUrl: 'app/Components/score-tracker/app.score-tracker.html',
})
export class ScoreTrackerComponent {
  @Input() Round: number;
  @Input() Score: number;
  @Input() MaxPossibleScore: number;
}
