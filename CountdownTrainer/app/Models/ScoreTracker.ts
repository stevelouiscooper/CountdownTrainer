export class ScoreTracker {
  Score: number;
  MaxPossibleScore: number;

  constructor(score: number, maxPossibleScore: number) {
    this.Score = score;
    this.MaxPossibleScore = maxPossibleScore;
  }
}
