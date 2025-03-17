import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Featured events for the home screen
const FEATURED_EVENTS = [
  {
    id: 1,
    title: 'Birth of Prophet Muhammad ﷺ',
    year: '570 CE',
    image: 'https://api.a0.dev/assets/image?text=Ancient Mecca city with Kaaba at dawn, architectural illustration with Islamic geometric patterns, golden light',
    category: 'Prophet\'s Life'
  },
  {
    id: 7,
    title: 'The Hijra',
    year: '622 CE',
    image: 'https://api.a0.dev/assets/image?text=Desert caravan journey at night under stars with city silhouette in distance, Islamic artistic style',
    category: 'Migration'
  },
  {
    id: 13,
    title: 'Conquest of Makkah',
    year: '630 CE',
    image: 'https://api.a0.dev/assets/image?text=Kaaba surrounded by Muslim army entering peaceful city, Islamic artistic style',
    category: 'Major Events'
  }
];

// Categories for quick access
const CATEGORIES = [
  { name: 'Prophet\'s Life', icon: 'user' as const },
  { name: 'Major Battles', icon: 'shield' as const },
  { name: 'Caliphates', icon: 'award' as const },
  { name: 'Revelation', icon: 'book' as const }
];

// Recent searches for quick access
const RECENT_SEARCHES = [
  'Battle of Badr',
  'Hijra to Madinah',
  'Revelation of Quran',
  'Treaty of Hudaybiyyah'
];

export default function HomeScreen() {
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  // Animate elements on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  // Header animation based on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 60],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.3, 1],
    extrapolate: 'clamp'
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#333333', '#555555']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Header Title (visible on scroll) */}
          <Animated.Text 
            style={[
              styles.headerScrolledTitle, 
              { opacity: headerTitleOpacity }
            ]}
          >
            Islamic Timeline
          </Animated.Text>
          
          {/* Header Content (visible initially) */}
          <Animated.View 
            style={[
              styles.headerContent, 
              { 
                opacity: headerContentOpacity,
                transform: [{ 
                  translateY: scrollY.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, -20],
                    extrapolate: 'clamp'
                  }) 
                }]
              }
            ]}
          >
            <Text style={styles.headerTitle}>Islamic History</Text>
            <Text style={styles.headerSubtitle}>Explore 1400+ Years of History</Text>
            
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#555" style={styles.searchIcon} />
              <Link href="/explore" asChild>
                <TouchableOpacity 
                  style={styles.searchInput}
                  activeOpacity={0.7}
                >
                  <Text style={styles.searchPlaceholder}>Search events, people, places...</Text>
                  <View style={styles.searchButtonContainer}>
                    <LinearGradient
                      colors={['#444', '#333']}
                      style={styles.searchButton}
                    >
                      <Feather name="arrow-right" size={16} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Animated Container */}
        <Animated.View style={[
          styles.animatedContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}>
          {/* Featured Events Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Events</Text>
              <Link href="/timeline-fixed" asChild>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
              decelerationRate="fast"
              snapToInterval={width * 0.85 + 15}
              snapToAlignment="center"
            >
              {FEATURED_EVENTS.map((event) => (
                <Link key={event.id} href={`/timeline-fixed?event=${event.id}`} asChild>
                  <TouchableOpacity style={styles.featuredCard}>
                    <Image 
                      source={{ uri: event.image }}
                      style={styles.featuredImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.featuredGradient}
                    >
                      <View style={styles.featuredContent}>
                        <Text style={styles.featuredCategory}>{event.category}</Text>
                        <Text style={styles.featuredTitle}>{event.title}</Text>
                        <Text style={styles.featuredYear}>{event.year}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Link href="/timeline-fixed" asChild>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map((category, index) => (
                <Link key={index} href={`/timeline-fixed?category=${encodeURIComponent(category.name)}`} asChild>
                  <TouchableOpacity style={styles.categoryCard}>
                    <View style={styles.categoryIconContainer}>
                      <Feather name={category.icon} size={24} color="#333" />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Recent Searches Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentSearchesContainer}>
              {RECENT_SEARCHES.map((search, index) => (
                <Link key={index} href={`/explore?q=${encodeURIComponent(search)}`} asChild>
                  <TouchableOpacity style={styles.recentSearchItem}>
                    <Feather name="clock" size={16} color="#666" />
                    <Text style={styles.recentSearchText}>{search}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Explore Map Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore on Map</Text>
            </View>
            
            <Link href="/explore" asChild>
              <TouchableOpacity style={styles.mapCard}>
                <Image 
                  source={{ uri: 'https://api.a0.dev/assets/image?text=Islamic world map with historical sites marked, vintage style map with Islamic geometric border' }}
                  style={styles.mapImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.mapGradient}
                >
                  <Text style={styles.mapText}>View Historical Sites</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            
            <View style={styles.aboutCard}>
              <Text style={styles.aboutText}>
                The Islamic Timeline app provides a comprehensive journey through 1400+ years of Islamic history, 
                from the birth of Prophet Muhammad ﷺ to the modern era. Explore key events, figures, and places 
                that shaped the Islamic civilization.
              </Text>
              <TouchableOpacity style={styles.aboutButton}>
                <Text style={styles.aboutButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,


  },
  headerScrolledTitle: {
    position: 'absolute',
    top: 20,
    left: 90,
    right: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  headerContent: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 15,
    paddingLeft: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchPlaceholder: {
    color: '#777',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    flex: 1,
  },
  searchButtonContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  animatedContainer: {
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  featuredContainer: {
    paddingRight: 99,
  },
  featuredCard: {
    width: width * 0.85,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    padding: 15,
  },
  featuredContent: {
    
  },
  featuredCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  featuredYear: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  recentSearchesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  mapCard: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    justifyContent: 'flex-end',
    padding: 15,
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  aboutButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  aboutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
});
