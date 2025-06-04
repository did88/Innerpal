import { EmotionAnalyzer } from '../../utils/emotionAnalyzer';

describe('EmotionAnalyzer utility functions', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new EmotionAnalyzer();
  });

  test('calculateEmotionScore applies weights correctly', () => {
    const emotions = { joy: 0.6, sadness: 0.4, anger: 0 };
    const score = analyzer.calculateEmotionScore(emotions);
    expect(score).toBeCloseTo(0.6 * 1 + 0.4 * -1);
  });

  test('calculateAverageEmotions averages emotion values', () => {
    const data = [
      { emotions: { joy: 0.5, sadness: 0.5 } },
      { emotions: { joy: 0.25, sadness: 0.75 } },
    ];
    const avg = analyzer.calculateAverageEmotions(data);
    expect(avg.joy).toBeCloseTo(0.375);
    expect(avg.sadness).toBeCloseTo(0.625);
  });

  test('calculateTrend returns slope of linear data', () => {
    const trend = analyzer.calculateTrend([1, 2, 3, 4]);
    expect(trend).toBeCloseTo(1);
  });
});
