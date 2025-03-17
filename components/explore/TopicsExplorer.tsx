import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sample topics for exploration
const TOPICS = [
  {
    id: 1,
    title: 'Prophet Muhammad ﷺ',
    icon: 'star',
    description: 'Learn about the life and teachings of the final Prophet',
    imagePrompt: 'Medina mosque with green dome, Islamic architectural style'
  },
  {
    id: 2,
    title: 'Islamic Golden Age',
    icon: 'flask',
    description: 'Discover the scientific and cultural achievements of Muslims',
    imagePrompt: 'Ancient Islamic library with scholars and astronomical instruments, Islamic art style'
  },
  {
    id: 3,
    title: 'Quran & Hadith',
    icon: 'book',
    description: 'Explore the holy texts and their meanings',
    imagePrompt: 'Open Quran with beautiful calligraphy and ornate decoration, Islamic art style'
  },
  {
    id: 4,
    title: 'Islamic Architecture',
    icon: 'mosque',
    description: 'Explore the beauty of mosques and Islamic buildings',
    imagePrompt: 'Stunning mosque with intricate geometric patterns and minarets, Islamic architecture'
  },
  {
    id: 5,
    title: 'Islamic Civilization',
    icon: 'landmark',
    description: 'Learn about the spread and impact of Islamic civilization',
    imagePrompt: 'Map showing Islamic world with cities and trade routes, Islamic cartography style'
  },
  {
    id: 6,
    title: 'Islamic Art',
    icon: 'paint-brush',
    description: 'Discover the beauty of Islamic calligraphy and art',
    imagePrompt: 'Islamic geometric patterns and calligraphy artwork, vibrant colors'
  }
];

export default function TopicsExplorer() {
  const handleTopicPress = (topic: any) => {
    console.log(`Selected topic: ${topic.title}`);
    // In a real app, this would navigate to a detailed view or trigger the AI chat
  };

  const renderTopicCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.topicCard}
      onPress={() => handleTopicPress(item)}
    >
      <Image
        source={{ uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(item.imagePrompt)}` }}
        style={styles.topicImage}
      />
      <View style={styles.topicContent}>
        <View style={styles.topicIconContainer}>
          <FontAwesome5 name={item.icon} size={16} color="#333333" />
        </View>
        <Text style={styles.topicTitle}>{item.title}</Text>
        <Text style={styles.topicDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.exploreTitle}>Explore Islamic Knowledge</Text>
      <Text style={styles.exploreSubtitle}>Select a topic to learn more</Text>
      
      <FlatList
        data={TOPICS}
        renderItem={renderTopicCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.topicsGrid}
        columnWrapperStyle={styles.topicRow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  exploreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  exploreSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  topicsGrid: {
    paddingBottom: 20,
  },
  topicRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  topicCard: {
    width: (width - 45) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  topicImage: {
    width: '100%',
    height: 100,
  },
  topicContent: {
    padding: 12,
  },
  topicIconContainer: {
    position: 'absolute',
    top: -20,
    right: 12,
    backgroundColor: '#ffffff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    zIndex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  topicDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
}); 