import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopicsExplorer from '@/components/explore/TopicsExplorer';
import CustomTabBar from '../../components/CustomTabBar';

export default function TopicsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TopicsExplorer />
      <CustomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
}); 