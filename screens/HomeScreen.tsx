import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import TimelineEvent from '../components/TimelineEvent';
import { SafeAreaView } from 'react-native-safe-area-context';

const EVENTS = [
  {
    id: 1,
    year: 'Creation',
    title: 'Creation of Prophet Adam (AS)',
    description: 'Prophet Adam (AS) was created as the first human and the first prophet.',
    location: 'Paradise',
    imagePrompt: 'heavenly garden with Prophet Adam, Islamic artistic style',
    category: 'Previous Prophets'
  },
  {
    id: 2,
    year: 'Expulsion from Paradise',
    title: 'Prophet Adam & Hawwa (AS) Sent to Earth',
    description: 'After eating from the forbidden tree, Adam (AS) and Hawwa (AS) were sent to Earth.',
    location: 'Earth',
    imagePrompt: 'Prophet Adam and Hawwa descending to Earth, spiritual Islamic art style',
    category: 'Previous Prophets'
  },
  {
    id: 3,
    year: '3000 BCE',
    title: 'Prophet Nuh (AS) and The Great Flood',
    description: 'Prophet Nuh (AS) built an ark and saved believers from a devastating flood.',
    location: 'Unknown',
    imagePrompt: 'huge wooden ark in stormy waters, Islamic artistic style',
    category: 'Previous Prophets'
  },
  {
    id: 4,
    year: '2000 BCE',
    title: 'Prophet Ibrahim (AS)',
    description: 'Built the Kaaba with his son Ismail (AS), establishing the foundation of Islamic monotheism.',
    location: 'Makkah',
    imagePrompt: 'ancient kaaba construction scene with Prophet Ibrahim, Islamic artistic style',
    category: 'Previous Prophets'
  },
  {
    id: 5,
    year: '1500 BCE',
    title: 'Prophet Musa (AS) and The Torah',
    description: 'Received the Torah and led the Children of Israel out of Egypt.',
    location: 'Egypt',
    imagePrompt: 'parting of the Red Sea, divine miracle, Islamic artistic style',
    category: 'Previous Prophets'
  },
  {
    id: 6,
    year: '1000 BCE',
    title: 'Prophet Dawud (AS) and The Psalms',
    description: 'Prophet Dawud (AS) was given the Zabur (Psalms) and ruled with wisdom.',
    location: 'Jerusalem',
    imagePrompt: 'ancient Jerusalem cityscape with Prophet Dawud reciting Psalms, Islamic art',
    category: 'Previous Prophets'
  },
  {
    id: 7,
    year: '900 BCE',
    title: 'Prophet Sulaiman (AS) and The Jinn',
    description: 'Prophet Sulaiman (AS) was granted control over Jinn, animals, and the wind.',
    location: 'Jerusalem',
    imagePrompt: 'Prophet Sulaiman\'s throne surrounded by Jinn and birds, Islamic art',
    category: 'Previous Prophets'
  },
  {
    id: 8,
    year: '0 CE',
    title: 'Birth of Prophet Isa (AS)',
    description: 'Birth of Prophet Isa (Jesus), son of Maryam, who received the Injeel (Gospel).',
    location: 'Bethlehem',
    imagePrompt: 'Blessed Maryam with baby Isa, peaceful divine scene, Islamic art style',
    category: 'Previous Prophets'
  },
  {
    id: 9,
    year: '570 CE',
    title: 'Birth of Prophet Muhammad ﷺ',
    description: 'Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant.',
    location: 'Makkah',
    imagePrompt: 'Ancient Mecca city architectural illustration with Islamic geometric patterns, golden hour',
    category: 'Prophet\'s Life'
  },
  {
    id: 10,
    year: '610 CE',
    title: 'First Revelation',
    description: 'The first verses of the Quran were revealed to Prophet Muhammad ﷺ in Cave Hira.',
    location: 'Cave Hira, Makkah',
    imagePrompt: 'Mystical cave entrance with divine light, Islamic art style',
    category: 'Revelation'
  },
  {
    id: 11,
    year: '622 CE',
    title: 'The Hijra',
    description: 'Migration of Prophet Muhammad ﷺ and his followers from Makkah to Madinah.',
    location: 'Makkah to Madinah',
    imagePrompt: 'Desert caravan journey at night under stars, Islamic artistic style',
    category: 'Migration'
  },
  {
    id: 12,
    year: '624 CE',
    title: 'Battle of Badr',
    description: 'The first major battle between Muslims and the Quraysh of Makkah.',
    location: 'Badr',
    imagePrompt: 'Desert battlefield scene with warriors and horses, Islamic artistic style',
    category: 'Major Events'
  },
  {
    id: 13,
    year: '625 CE',
    title: 'Battle of Uhud',
    description: 'Muslims faced hardships after an initial victory due to a strategic mistake.',
    location: 'Uhud',
    imagePrompt: 'Mountain battlefield scene, resilient Muslim warriors, Islamic art',
    category: 'Major Events'
  },
  {
    id: 14,
    year: '627 CE',
    title: 'Battle of the Trench',
    description: 'Muslims defended Madinah by digging a trench, preventing enemy forces from invading.',
    location: 'Madinah',
    imagePrompt: 'Large defensive trench with Muslim soldiers, Islamic art',
    category: 'Major Events'
  },
  {
    id: 15,
    year: '630 CE',
    title: 'Conquest of Makkah',
    description: 'Peaceful conquest of Makkah and cleansing of the Kaaba from idols.',
    location: 'Makkah',
    imagePrompt: 'Kaaba surrounded by victorious Muslim army, peaceful scene, Islamic art',
    category: 'Major Events'
  },
  {
    id: 16,
    year: '632 CE',
    title: 'Farewell Sermon',
    description: 'Prophet Muhammad ﷺ delivered his final sermon at Mount Arafat.',
    location: 'Mount Arafat',
    imagePrompt: 'Vast gathering at Mount Arafat, spiritual atmosphere, Islamic art',
    category: 'Prophet\'s Life'
  },
  {
    id: 17,
    year: '632 CE',
    title: 'Passing of Prophet Muhammad ﷺ',
    description: 'Prophet Muhammad ﷺ passed away, marking the end of revelation.',
    location: 'Madinah',
    imagePrompt: 'Serene mosque in Madinah with mourning companions, Islamic art style',
    category: 'Prophet\'s Life'
  }
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = ['all', ...new Set(EVENTS.map(event => event.category))];
  const filteredEvents = selectedCategory === 'all' 
    ? EVENTS 
    : EVENTS.filter(event => event.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>    
      <ImageBackground
        source={{ uri: 'https://api.a0.dev/assets/image?text=subtle islamic geometric pattern with stars on white background, minimal' }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Islamic Timeline</Text>
          <Text style={styles.headerSubtitle}>Major Historical Events</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            scrollY.setValue(offsetY);
          }}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          <View style={styles.timeline}>
            {filteredEvents.map((event, index) => (
              <TimelineEvent
                key={event.id}
                event={event}
                index={index}
                scrollY={scrollY}
                isLast={index === filteredEvents.length - 1}
              />
            ))}
          </View>
        </Animated.ScrollView>    
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  categoryScroll: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 2,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    height: 20,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  categoryText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  timeline: {
    padding: 20,
  },
}); 