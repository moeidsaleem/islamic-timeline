import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = height * 0.28;

interface Event {
  id: number;
  year: string;
  title: string;
  description: string;
  location: string;
  imagePrompt: string;
  category: string;
  latitude?: number;
  longitude?: number;
}

interface TimelineEventProps {
  event: Event;
  index: number;
  scrollY: Animated.Value;
  isLast?: boolean;
}

export default function TimelineEvent({ event, index, scrollY, isLast = false }: TimelineEventProps) {
  // Calculate position for this item
  const position = Animated.subtract(index * ITEM_SIZE, scrollY);
  
  // Calculate animations based on position
  const isDisappearing = position.interpolate({
    inputRange: [-ITEM_SIZE, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const isAppearing = position.interpolate({
    inputRange: [0, ITEM_SIZE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const scale = Animated.add(
    isDisappearing,
    isAppearing
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.95, 1, 0.95],
    extrapolate: 'clamp',
  });
  
  // Improved opacity calculation to keep items visible longer
  const opacity = position.interpolate({
    inputRange: [-ITEM_SIZE * 2, -ITEM_SIZE, 0, ITEM_SIZE * 2, ITEM_SIZE * 3],
    outputRange: [1, 1, 1, 1, 0.7],
    extrapolate: 'clamp',
  });
  
  // Subtle rotation effect
  const rotateZ = position.interpolate({
    inputRange: [-ITEM_SIZE, 0, ITEM_SIZE],
    outputRange: ['2deg', '0deg', '-2deg'],
    extrapolate: 'clamp',
  });
  
  // Subtle translateY for a staggered effect
  const translateY = position.interpolate({
    inputRange: [-ITEM_SIZE, 0, ITEM_SIZE],
    outputRange: [20, 0, 10],
    extrapolate: 'clamp',
  });
  
  // Shadow opacity for depth effect
  const shadowOpacity = position.interpolate({
    inputRange: [-ITEM_SIZE, 0, ITEM_SIZE],
    outputRange: [0.2, 0.6, 0.2],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [
            { scale },
            { translateY },
            { rotateZ }
          ],
          shadowOpacity: shadowOpacity as any,
        },
      ]}
    >
      {/* Year marker */}
      <View style={styles.yearContainer}>
        <View style={styles.yearBubble}>
          <Text style={styles.yearText}>{event.year}</Text>
        </View>
        <View style={[styles.line, isLast && styles.lastLine]} />
      </View>
      
      {/* Event content */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.categoryContainer}>
            <FontAwesome5 
              name={getCategoryIcon(event.category)} 
              size={12} 
              color="#333333" 
              style={styles.categoryIcon} 
            />
            <Text style={styles.category}>{event.category}</Text>
          </View>
        </View>
        
        {/* Image with event's imagePrompt */}
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource(event.id, event.category, event.imagePrompt)}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {event.description}
        </Text>
        
        {/* Location */}
        <View style={styles.locationContainer}>
          <FontAwesome5 name="map-marker-alt" size={14} color="#666" style={styles.locationIcon} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.location}>{event.location}</Text>
            {(event.latitude !== undefined && event.longitude !== undefined) && (
              <Text style={styles.coordinates}>
                {event.latitude.toFixed(4)}°, {event.longitude.toFixed(4)}°
              </Text>
            )}
          </View>
        </View>
        
        {/* Read more button */}
        <TouchableOpacity style={styles.readMoreButton} activeOpacity={0.7}>
          <Text style={styles.readMoreText}>Read More</Text>
          <FontAwesome5 name="chevron-right" size={12} color="#333333" style={styles.readMoreIcon} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// Helper function to get category icon
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
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
  
  return icons[category] || 'circle';
}

// Helper function to get image source
function getImageSource(id: number, category: string, imagePrompt: string): any {
  // Use the api.a0.dev service with the event's imagePrompt
  return { 
    uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(imagePrompt)}` 
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  yearContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: 10,
  },
  yearBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 1,
  },
  yearText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  line: {
    position: 'absolute',
    top: 60,
    width: 2,
    height: ITEM_SIZE - 60,
    backgroundColor: '#e0e0e0',
    zIndex: 0,
  },
  lastLine: {
    height: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 230, 0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryIcon: {
    marginRight: 4,
  },
  category: {
    fontSize: 12,
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationTextContainer: {
    flexDirection: 'column',
  },
  location: {
    fontSize: 13,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  coordinates: {
    fontSize: 12,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
    borderRadius: 12,
  },
  readMoreText: {
    fontSize: 13,
    color: '#333333',
    marginRight: 4,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  readMoreIcon: {
    marginTop: 1,
  },
});