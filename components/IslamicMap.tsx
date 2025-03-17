import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
  ScrollView
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { EVENTS } from '@/app/(tabs)/timeline-fixed';

const { width, height } = Dimensions.get('window');

// Custom map style - Islamic theme
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

// Initial map region centered around Middle East
const initialRegion: Region = {
  latitude: 24.4539,
  longitude: 39.6142,
  latitudeDelta: 20,
  longitudeDelta: 20
};

// Category colors for markers
const categoryColors: Record<string, string> = {
  'Prophet\'s Life': '#4CAF50',
  'Revelation': '#2196F3',
  'Migration': '#FF9800',
  'Major Battles': '#F44336',
  'Major Events': '#9C27B0',
  'Peace Treaties': '#00BCD4',
  'Diplomacy': '#3F51B5',
  'Caliphates': '#795548',
  'Miracles': '#FFEB3B',
};

// Get icon for category
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Prophet\'s Life': 'star',
    'Revelation': 'book',
    'Migration': 'plane',
    'Major Battles': 'shield-alt',
    'Major Events': 'landmark',
    'Peace Treaties': 'handshake',
    'Diplomacy': 'scroll',
    'Caliphates': 'crown',
    'Miracles': 'magic'
  };
  
  return icons[category] || 'circle';
};

// Define Event interface to match the structure in timeline-fixed.tsx
interface Event {
  id: number;
  year: string;
  title: string;
  description: string;
  location: string;
  imagePrompt: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface IslamicMapProps {
  onEventSelect?: (event: Event) => void;
  selectedEvent?: Event | null;
  mapRef?: React.RefObject<MapView>;
}

const IslamicMap: React.FC<IslamicMapProps> = ({ onEventSelect, selectedEvent, mapRef }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [region, setRegion] = useState<Region>(initialRegion);
  const detailsAnim = useRef(new Animated.Value(0)).current;
  const internalMapRef = useRef<MapView>(null);
  
  // Use the provided mapRef or fall back to internal ref
  const actualMapRef = mapRef || internalMapRef;

  // When selectedEvent changes from parent, update the map
  useEffect(() => {
    if (selectedEvent && actualMapRef.current) {
      setActiveEvent(selectedEvent);
      setShowDetails(true);
      
      // Animate to the selected event
      actualMapRef.current.animateToRegion({
        latitude: selectedEvent.latitude,
        longitude: selectedEvent.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      }, 1000);
      
      // Show details panel
      Animated.timing(detailsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [selectedEvent]);

  // Filter events by selected category
  const filteredEvents = selectedCategory 
    ? EVENTS.filter(event => event.category === selectedCategory)
    : EVENTS;
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(EVENTS.map(event => event.category)))];
  
  // Handle marker press
  const handleMarkerPress = (event: Event) => {
    setActiveEvent(event);
    
    // Animate details panel
    Animated.spring(detailsAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
    
    // Center map on selected event
    if (actualMapRef.current && event.latitude && event.longitude) {
      actualMapRef.current.animateToRegion({
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }, 1000);
    }
    
    // Call onEventSelect if provided
    if (onEventSelect) {
      onEventSelect(event);
    }
  };
  
  // Close details panel
  const closeDetails = () => {
    Animated.timing(detailsAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setActiveEvent(null));
  };
  
  // Filter by category
  const filterByCategory = (category: string) => {
    setSelectedCategory(category === 'All' ? null : category);
    
    // Reset map to initial region when changing categories
    if (actualMapRef.current) {
      actualMapRef.current.animateToRegion(initialRegion, 1000);
    }
  };
  
  // Animation values for details panel
  const detailsTranslateY = detailsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });
  
  const detailsOpacity = detailsAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0.7, 1],
  });

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        ref={actualMapRef}
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : 'google'}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsCompass
        showsScale
        rotateEnabled
        minZoomLevel={2}
      >
        {filteredEvents.map((event) => (
          event.latitude && event.longitude ? (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude
              }}
              title={event.title}
              description={`${event.year} - ${event.location}`}
              onPress={() => handleMarkerPress(event)}
              tracksViewChanges={false}
            >
              <View style={[
                styles.markerContainer,
                { backgroundColor: categoryColors[event.category] || '#333333' },
                activeEvent?.id === event.id && styles.activeMarker
              ]}>
                <FontAwesome5 
                  name={getCategoryIcon(event.category)} 
                  size={14} 
                  color={activeEvent?.id === event.id ? '#ffffff' : '#333333'} 
                />
              </View>
            </Marker>
          ) : null
        ))}
      </MapView>
      
      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <BlurView intensity={90} tint="light" style={styles.categoryFilterBlur}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilterScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  (category === 'All' && !selectedCategory) || category === selectedCategory 
                    ? styles.categoryButtonActive 
                    : null
                ]}
                onPress={() => filterByCategory(category)}
              >
                {category !== 'All' && (
                  <FontAwesome5 
                    name={getCategoryIcon(category)} 
                    size={12} 
                    color={(category === 'All' && !selectedCategory) || category === selectedCategory 
                      ? '#FFFFFF' 
                      : '#333333'} 
                    style={styles.categoryIcon}
                  />
                )}
                <Text style={[
                  styles.categoryButtonText,
                  (category === 'All' && !selectedCategory) || category === selectedCategory 
                    ? styles.categoryButtonTextActive 
                    : null
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BlurView>
      </View>
      
      {/* Map Controls */}
      <View style={styles.mapControlsContainer}>
        <BlurView intensity={90} tint="light" style={styles.mapControlsBlur}>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              if (actualMapRef.current) {
                actualMapRef.current.animateToRegion(initialRegion, 1000);
              }
            }}
          >
            <FontAwesome5 name="home" size={16} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              if (actualMapRef.current) {
                actualMapRef.current.animateToRegion({
                  ...region,
                  latitudeDelta: region.latitudeDelta * 0.5,
                  longitudeDelta: region.longitudeDelta * 0.5,
                }, 500);
              }
            }}
          >
            <FontAwesome5 name="search-plus" size={16} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              if (actualMapRef.current) {
                actualMapRef.current.animateToRegion({
                  ...region,
                  latitudeDelta: region.latitudeDelta * 2,
                  longitudeDelta: region.longitudeDelta * 2,
                }, 500);
              }
            }}
          >
            <FontAwesome5 name="search-minus" size={16} color="#333333" />
          </TouchableOpacity>
        </BlurView>
      </View>
      
      {/* Event Details Panel */}
      {activeEvent && (
        <Animated.View 
          style={[
            styles.detailsContainer,
            {
              transform: [{ translateY: detailsTranslateY }],
              opacity: detailsOpacity,
            }
          ]}
        >
          <BlurView intensity={90} tint="light" style={styles.detailsBlur}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsHeaderLeft}>
                <View style={[
                  styles.detailsCategoryBadge,
                  { backgroundColor: categoryColors[activeEvent.category] || '#333333' }
                ]}>
                  <FontAwesome5 
                    name={getCategoryIcon(activeEvent.category)} 
                    size={12} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.detailsCategoryText}>{activeEvent.category}</Text>
                </View>
                <Text style={styles.detailsYear}>{activeEvent.year}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeDetails}>
                <FontAwesome5 name="times" size={16} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.detailsTitle}>{activeEvent.title}</Text>
            
            <View style={styles.detailsLocationContainer}>
              <FontAwesome5 name="map-marker-alt" size={14} color="#666666" style={styles.detailsLocationIcon} />
              <Text style={styles.detailsLocation}>{activeEvent.location}</Text>
            </View>
            
            <Text style={styles.detailsDescription}>{activeEvent.description}</Text>
            
            <View style={styles.detailsCoordinatesContainer}>
              <Text style={styles.detailsCoordinatesLabel}>Coordinates:</Text>
              <Text style={styles.detailsCoordinates}>
                {activeEvent.latitude.toFixed(4)}°, {activeEvent.longitude.toFixed(4)}°
              </Text>
            </View>
            
            <TouchableOpacity style={styles.viewInTimelineButton}>
              <FontAwesome5 name="clock" size={14} color="#FFFFFF" style={styles.viewInTimelineIcon} />
              <Text style={styles.viewInTimelineText}>View in Timeline</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      )}
      
      {/* Map Title */}
      {/* <View style={styles.mapTitleContainer}>
        <BlurView intensity={90} tint="light" style={styles.mapTitleBlur}>
          <Text style={styles.mapTitle}>Islamic Historical Events</Text>
          <Text style={styles.mapSubtitle}>Explore the geography of Islamic history</Text>
        </BlurView>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  activeMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#2196F3',
    zIndex: 2,
  },
  categoryFilterContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 60 : 280,

    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  categoryFilterBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryFilterScroll: {
    paddingHorizontal: 10,
    paddingVertical: 10,

  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  mapControlsContainer: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 200 : 220,
    zIndex: 2,
  },
  mapControlsBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  detailsBlur: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    padding: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  detailsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
  },
  detailsCategoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  detailsYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  detailsLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsLocationIcon: {
    marginRight: 8,
  },
  detailsLocation: {
    fontSize: 14,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  detailsDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  detailsCoordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 10,
    borderRadius: 8,
  },
  detailsCoordinatesLabel: {
    fontSize: 13,
    color: '#666666',
    marginRight: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  detailsCoordinates: {
    fontSize: 13,
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  viewInTimelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewInTimelineIcon: {
    marginRight: 8,
  },
  viewInTimelineText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  mapTitleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  mapTitleBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
});

export default IslamicMap; 