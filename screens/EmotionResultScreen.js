import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const EmotionResultScreen = ({ route }) => {
  const { emotions, dominantEmotion, recommendations, emotionScore } = route.params.result;

  const chartData = Object.keys(emotions).map((key, index) => ({
    name: key,
    population: emotions[key],
    color: chartColors[index % chartColors.length],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>감정 분석 결과</Text>

      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />

      <Text style={styles.dominantText}>주된 감정: {dominantEmotion}</Text>
      <Text style={styles.scoreText}>감정 점수: {emotionScore.toFixed(2)}점</Text>
      <Text style={styles.recommendationTitle}>추천 행동:</Text>
      {recommendations.map((item, idx) => (
        <Text key={idx} style={styles.recommendationText}>• {item}</Text>
      ))}
    </View>
  );
};

const chartColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  dominantText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#7C3AED',
  },
  scoreText: {
    fontSize: 16,
    marginTop: 8,
    color: '#4B5563',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 10,
    marginBottom: 4,
  },
});

export default EmotionResultScreen;
