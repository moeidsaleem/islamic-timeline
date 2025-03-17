import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import TimelineEvent from '@/components/TimelineEvent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { height } = Dimensions.get('window');
// Adjust ITEM_SIZE to be slightly larger to ensure proper spacing
const ITEM_SIZE = height * 0.28;

// Refined Islamic Timeline Events with accurate historical data
export const EVENTS = [
  {
    id: 1,
    year: '570 CE',
    title: 'Birth of Prophet Muhammad ﷺ',
    description: 'Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant. His birth marked the beginning of a new era in human history.',
    location: 'Makkah, Arabian Peninsula',
    imagePrompt: 'Ancient Mecca city with Kaaba at dawn, architectural illustration with Islamic geometric patterns, golden light',
    category: 'Prophet\'s Life',
    latitude: 21.4225,
    longitude: 39.8262
  },
  {
    id: 2,
    year: '610 CE',
    title: 'First Revelation',
    description: 'Angel Jibreel (Gabriel) appeared to Prophet Muhammad ﷺ in the Cave of Hira with the first verses of the Quran: "Read in the name of your Lord who created."',
    location: 'Cave Hira, Makkah',
    imagePrompt: 'Mystical cave entrance on Mount Nur with divine light emanating from within, serene atmosphere, Islamic art style',
    category: 'Revelation',
    latitude: 21.4583,
    longitude: 39.8625
  },
  {
    id: 3,
    year: '613 CE',
    title: 'Public Preaching',
    description: 'After three years of private invitations to Islam, Prophet Muhammad ﷺ began publicly preaching the message of monotheism, facing intense opposition from Meccan leaders.',
    location: 'Makkah',
    imagePrompt: 'Prophet addressing people on Mount Safa, Mecca cityscape, Islamic artistic style without depicting faces',
    category: 'Prophet\'s Life',
    latitude: 21.4225,
    longitude: 39.8262
  },
  {
    id: 4,
    year: '615 CE',
    title: 'First Migration to Abyssinia',
    description: 'Facing persecution, a group of Muslims migrated to Abyssinia (modern Ethiopia) where they received protection from the Christian king, Negus.',
    location: 'Abyssinia (Ethiopia)',
    imagePrompt: 'Ancient ships sailing across the Red Sea with mountains in background, Islamic artistic style',
    category: 'Migration',
    latitude: 9.1450,
    longitude: 40.4897
  },
  {
    id: 5,
    year: '619 CE',
    title: 'Year of Sorrow',
    description: 'Prophet Muhammad ﷺ lost his beloved wife Khadijah (RA) and his uncle Abu Talib, who had been his protectors and supporters.',
    location: 'Makkah',
    imagePrompt: 'Somber Meccan landscape with empty house at sunset, Islamic artistic style',
    category: 'Prophet\'s Life',
    latitude: 21.4225,
    longitude: 39.8262
  },
  {
    id: 6,
    year: '620 CE',
    title: 'Night Journey & Ascension',
    description: 'The miraculous night journey (Isra) from Makkah to Jerusalem and the ascension (Mi\'raj) to the heavens, where the five daily prayers were prescribed.',
    location: 'Makkah to Jerusalem to Heavens',
    imagePrompt: 'Al-Aqsa Mosque in Jerusalem with starry night sky and light beam to heavens, Islamic artistic style',
    category: 'Miracles',
    latitude: 31.7781,
    longitude: 35.2359
  },
  {
    id: 7,
    year: '622 CE',
    title: 'The Hijra',
    description: 'The migration of Prophet Muhammad ﷺ and his followers from Makkah to Madinah, marking the beginning of the Islamic calendar.',
    location: 'Makkah to Madinah',
    imagePrompt: 'Desert caravan journey at night under stars with city silhouette in distance, Islamic artistic style',
    category: 'Migration',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 8,
    year: '624 CE',
    title: 'Battle of Badr',
    description: 'The first major battle between 313 Muslims and over 1,000 Meccans. Despite being outnumbered, Muslims achieved a decisive victory with divine help.',
    location: 'Badr, Arabian Peninsula',
    imagePrompt: 'Desert battlefield scene with warriors and horses, divine light from sky, Islamic artistic style',
    category: 'Major Battles',
    latitude: 23.7333,
    longitude: 38.7833
  },
  {
    id: 9,
    year: '625 CE',
    title: 'Battle of Uhud',
    description: 'Muslims faced a setback after archers left their positions. Prophet Muhammad ﷺ was injured, and his uncle Hamza (RA) was martyred.',
    location: 'Mount Uhud, near Madinah',
    imagePrompt: 'Mountain battlefield scene with archers on hillside, Islamic artistic style',
    category: 'Major Battles',
    latitude: 24.5400,
    longitude: 39.6150
  },
  {
    id: 10,
    year: '627 CE',
    title: 'Battle of the Trench',
    description: 'Muslims defended Madinah by digging a trench around the city, successfully preventing a coalition of 10,000 enemy forces from invading.',
    location: 'Madinah',
    imagePrompt: 'Large defensive trench with Muslim defenders and city walls, Islamic artistic style',
    category: 'Major Battles',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 11,
    year: '628 CE',
    title: 'Treaty of Hudaybiyyah',
    description: 'A pivotal peace treaty between Muslims and the Quraysh of Makkah that allowed Muslims to perform pilgrimage the following year and opened the door for many conversions to Islam.',
    location: 'Hudaybiyyah, near Makkah',
    imagePrompt: 'Desert meeting with scrolls and delegates under palm trees, Islamic artistic style',
    category: 'Peace Treaties',
    latitude: 21.4510,
    longitude: 39.5770
  },
  {
    id: 12,
    year: '629 CE',
    title: 'Battle of Mu\'tah',
    description: 'The first battle between Muslims and the Byzantine Empire, where Zayd ibn Harithah, Ja\'far ibn Abi Talib, and Abdullah ibn Rawahah were martyred.',
    location: 'Mu\'tah, modern-day Jordan',
    imagePrompt: 'Byzantine-era battlefield with banners and distant mountains, Islamic artistic style',
    category: 'Major Battles',
    latitude: 31.0917,
    longitude: 35.6928
  },
  {
    id: 13,
    year: '630 CE',
    title: 'Conquest of Makkah',
    description: 'The peaceful conquest of Makkah where Prophet Muhammad ﷺ showed remarkable mercy by granting general amnesty to those who had persecuted Muslims for years.',
    location: 'Makkah',
    imagePrompt: 'Kaaba surrounded by Muslims with city gates open, dawn light, Islamic artistic style',
    category: 'Major Events',
    latitude: 21.4225,
    longitude: 39.8262
  },
  {
    id: 14,
    year: '631 CE',
    title: 'Year of Delegations',
    description: 'Various Arab tribes sent delegations to Madinah to accept Islam and pledge allegiance to Prophet Muhammad ﷺ, marking the widespread acceptance of Islam in Arabia.',
    location: 'Madinah',
    imagePrompt: 'Madinah cityscape with multiple delegations arriving from different directions, Islamic artistic style',
    category: 'Diplomacy',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 15,
    year: '632 CE',
    title: 'Farewell Pilgrimage & Final Sermon',
    description: 'Prophet Muhammad ﷺ performed his only complete Hajj and delivered his final sermon at Mount Arafat, establishing universal principles of human rights and equality.',
    location: 'Makkah & Mount Arafat',
    imagePrompt: 'Vast gathering at Mount Arafat with pilgrims in white garments, Islamic artistic style',
    category: 'Prophet\'s Life',
    latitude: 21.3550,
    longitude: 39.9842
  },
  {
    id: 16,
    year: '632 CE',
    title: 'Passing of Prophet Muhammad ﷺ',
    description: 'The Prophet ﷺ returned to his Lord on the 12th of Rabi al-Awwal, leaving behind the Quran and his Sunnah as guidance for humanity.',
    location: 'Madinah',
    imagePrompt: 'Prophet\'s Mosque in Madinah with somber atmosphere, soft light through windows, Islamic artistic style',
    category: 'Prophet\'s Life',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 17,
    year: '632-634 CE',
    title: 'Caliphate of Abu Bakr (RA)',
    description: 'The first Caliph who unified Arabia, suppressed apostasy movements, and compiled the Quran into a single manuscript.',
    location: 'Madinah',
    imagePrompt: 'Early Islamic administrative scene with scrolls and scribes, Islamic artistic style',
    category: 'Caliphates',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 18,
    year: '634-644 CE',
    title: 'Caliphate of Umar ibn Al-Khattab (RA)',
    description: 'The Islamic state expanded dramatically, conquering Persia, Syria, Egypt, and parts of Byzantine territories. Umar (RA) established many administrative systems.',
    location: 'Madinah & expanding territories',
    imagePrompt: 'Map showing Islamic expansion with architectural elements of conquered regions, Islamic artistic style',
    category: 'Caliphates',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 19,
    year: '644-656 CE',
    title: 'Caliphate of Uthman ibn Affan (RA)',
    description: 'Standardized the Quran into a single authorized version and continued Islamic expansion. Naval power developed during this period.',
    location: 'Madinah & Mediterranean',
    imagePrompt: 'Scribes working on Quranic manuscripts with identical copies being distributed, Islamic artistic style',
    category: 'Caliphates',
    latitude: 24.4672,
    longitude: 39.6150
  },
  {
    id: 20,
    year: '656-661 CE',
    title: 'Caliphate of Ali ibn Abi Talib (RA)',
    description: 'The fourth Rightly Guided Caliph faced internal challenges but maintained the principles of justice and piety established by the Prophet ﷺ.',
    location: 'Kufa, Iraq',
    imagePrompt: 'Ancient Kufa cityscape with administrative buildings and mosque, Islamic artistic style',
    category: 'Caliphates',
    latitude: 32.0346,
    longitude: 44.4033
  }
];

export default function TimelineScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // Categories with icons
  const categoryIcons: Record<string, string> = {
    'all': 'globe',
    'Prophet\'s Life': 'star',
    'Revelation': 'book',
    'Migration': 'plane',
    'Major Battles': 'shield-alt',
    'Major Events': 'landmark',
    'Peace Treaties': 'handshake',
    'Diplomacy': 'scroll',
    'Expansion of Islam': 'expand-arrows-alt',
    'Caliphates': 'crown',
    'Miracles': 'magic'
  };

  const categories = ['all', ...new Set(EVENTS.map(event => event.category))];
  const filteredEvents = selectedCategory === 'all' 
    ? EVENTS 
    : EVENTS.filter(event => event.category === selectedCategory);

  // Simulate loading data with error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // In a real app, this would be where you fetch data from an API
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load timeline events. Please try again.');
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Make category container sticky with animation
  const categoryContainerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, Platform.OS === 'ios' ? 50 : 70],
    extrapolate: 'clamp'
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={{ uri: 'https://api.a0.dev/assets/image?text=subtle islamic geometric pattern with stars on white background, minimal' }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        {/* Header with title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Islamic Timeline</Text>
          <Text style={styles.headerSubtitle}>Journey Through History</Text>
        </View>
        
        {/* Category selector with blur effect and sticky behavior */}
        <Animated.View
          style={[
            styles.categoryContainerWrapper,
            {
              transform: [
                { translateY: categoryContainerTranslateY }
              ],
              zIndex: 100
            }
          ]}
        >
          <BlurView intensity={80} tint="light" style={styles.categoryContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoryScrollContent}
              decelerationRate="fast"
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    if (scrollViewRef.current) {
                      scrollY.setValue(0);
                      (scrollViewRef.current as any).scrollTo({ y: 0, animated: false });
                    }
                  }}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory
                  ]}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 
                    name={categoryIcons[category] || 'circle'} 
                    size={14} 
                    color={selectedCategory === category ? '#ffffff' : '#333333'} 
                    style={styles.categoryIcon}
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}>
                    {category === 'all' ? 'All Events' : category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </BlurView>
        </Animated.View>

        {/* Timeline events with improved scrolling and error handling */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#333333" />
            <Text style={styles.loadingText}>Loading timeline events...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-circle" size={40} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setIsLoading(true);
                setError(null);
                setTimeout(() => setIsLoading(false), 300);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate={Platform.OS === 'ios' ? 0.992 : 0.985}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              scrollY.setValue(offsetY);
            }}
            contentContainerStyle={styles.scrollViewContent}
            removeClippedSubviews={false}
            bounces={true}
          >
            <View style={styles.timeline}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <TimelineEvent
                    key={event.id}
                    event={event}
                    index={index}
                    scrollY={scrollY}
                    isLast={index === filteredEvents.length - 1}
                  />
                ))
              ) : (
                <View style={styles.noEventsContainer}>
                  <FontAwesome5 name="calendar-times" size={40} color="#999" />
                  <Text style={styles.noEventsText}>No events found for this category</Text>
                  <TouchableOpacity 
                    style={styles.resetButton}
                    onPress={() => setSelectedCategory('all')}
                  >
                    <Text style={styles.resetButtonText}>Show All Events</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* End of timeline marker */}
              {filteredEvents.length > 0 && (
                <View style={styles.endOfTimeline}>
                  <View style={styles.endDot} />
                  <Text style={styles.endText}>End of Timeline</Text>
                </View>
              )}
            </View>
          </Animated.ScrollView>
        )}

        {/* Floating scroll to top button */}
        {!isLoading && (
          <Animated.View
            style={[
              styles.scrollToTopButton,
              {
                opacity: scrollY.interpolate({
                  inputRange: [100, 200],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                })
              }
            ]}
          >
            <BlurView intensity={80} tint="light" style={styles.scrollToTopButtonBlur}>
              <TouchableOpacity
                style={styles.scrollToTopButtonInner}
                onPress={() => {
                  if (scrollViewRef.current) {
                    (scrollViewRef.current as any).scrollTo({ y: 0, animated: true });
                  }
                }}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="arrow-up" size={16} color="#333333" />
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        )}
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
    color: '#333333',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  categoryContainerWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 130,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 5,
    zIndex: 100,
  },
  categoryContainer: {
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.3)',
  },
  categoryScrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    marginRight: 6,
  },
  selectedCategory: {
    backgroundColor: '#333333',
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingTop: Platform.OS === 'ios' ? 180 : 210,
    minHeight: height * 1.5,
  },
  timeline: {
    padding: 20,
  },
  endOfTimeline: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  endDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333333',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  endText: {
    marginTop: 10,
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollToTopButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollToTopButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
}); 