import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { analytics } from '../lib/supabase';
import { emotionAnalyzer } from '../utils/emotionAnalyzer';

const { width } = Dimensions.get('window');

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
  style: { borderRadius: 16 },
};

const rangeOptions = [7, 30];

const EmotionStatsScreen = () => {
  const [range, setRange] = useState(7);
  const [stats, setStats] = useState(null);
  const [trendSlope, setTrendSlope] = useState(0);

  const loadStats = async (days) => {
    const { data } = await analytics.getEmotionPatterns(days);
    if (data) {
      setStats(data);
      const moods = data.moodTrends.map(t => t.averageMood);
      setTrendSlope(emotionAnalyzer.calculateTrend(moods));
    }
  };

  useEffect(() => { loadStats(range); }, [range]);

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const pieData = Object.keys(stats.emotionDistribution).map((key, i) => ({
    name: key,
    population: stats.emotionDistribution[key],
    color: chartColors[i % chartColors.length],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  const lineData = {
    labels: stats.moodTrends.map(t => t.date.slice(5)),
    datasets: [{
      data: stats.moodTrends.map(t => t.averageMood),
      color: () => '#7C3AED',
      strokeWidth: 2,
    }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.rangeTabs}>
        {rangeOptions.map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => setRange(option)}
            style={[styles.tab, range === option && styles.activeTab]}
          >
            <Text style={range === option ? styles.activeTabText : styles.tabText}>
              {option}일
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>감정 분포</Text>
      <PieChart
        data={pieData}
        width={width - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="20"
      />

      <Text style={styles.sectionTitle}>기분 추세</Text>
      <LineChart
        data={lineData}
        width={width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 8 }}
      />
      <Text style={styles.trendText}>최근 추세 기울기: {trendSlope.toFixed(2)}</Text>
    </View>
  );
};

const chartColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF0',
    padding: 20,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { fontSize: 16, color: '#374151' },
  rangeTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#7C3AED',
  },
  tabText: { color: '#374151' },
  activeTabText: { color: '#fff', fontWeight: '600' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  trendText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
    color: '#4B5563',
  },
});

export default EmotionStatsScreen;
