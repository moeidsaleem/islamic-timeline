import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ExploreScreen() {
  useEffect(() => {
    // Redirect to the topics tab
    router.replace('/(tabs)/topics');
  }, []);

  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
