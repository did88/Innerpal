import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { analytics } from '../lib/supabase';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [abnormalUsers, setAbnormalUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: global } = await analytics.getGlobalEmotionPatterns(30);
      if (global) setStats(global);
      const { data: abnormal } = await analytics.detectAbnormalUsers(7);
      if (abnormal) setAbnormalUsers(abnormal);
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.text}>Total entries: {stats.totalEntries}</Text>
          <Text style={styles.text}>Most common emotion: {stats.mostCommonEmotion}</Text>
          <Text style={styles.text}>Average intensity: {stats.averageIntensity.toFixed(2)}</Text>
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users with Abnormal Trends</Text>
        {abnormalUsers.length === 0 ? (
          <Text style={styles.text}>No abnormal patterns detected.</Text>
        ) : (
          abnormalUsers.map((u) => (
            <View key={u.user_id} style={styles.userBox}>
              <Text style={styles.userId}>User: {u.user_id}</Text>
              <Text style={styles.text}>Mood swings: {u.moodSwings}</Text>
              <Text style={styles.text}>Negative streak: {u.negativeStreak}</Text>
              <Text style={styles.text}>Follow-up: {u.recommended}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFCF0' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#1F2937' },
  userBox: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', marginBottom: 12 },
  userId: { fontWeight: '600', marginBottom: 4, color: '#1F2937' },
  text: { color: '#374151' },
});

export default AdminDashboardScreen;
