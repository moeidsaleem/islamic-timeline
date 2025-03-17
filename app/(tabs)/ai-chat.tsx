import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AIChat from '@/components/explore/AIChat';
import CustomTabBar from '../../components/CustomTabBar';

export default function AIChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AIChat />
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