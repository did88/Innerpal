import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Admin Panel</Text>
    <Text style={styles.text}>관리자 전용 기능입니다.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFCF0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  text: {
    fontSize: 16,
    color: '#374151',
  },
});

export default AdminScreen;
