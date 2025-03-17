import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapExplorer from '@/components/explore/MapExplorer';
import CustomTabBar from '../../components/CustomTabBar';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MapExplorer />
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