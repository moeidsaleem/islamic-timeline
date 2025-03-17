import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import IslamicMap from '@/components/IslamicMap';
import { EVENTS } from '@/app/(tabs)/timeline-fixed';
import MapView from 'react-native-maps';

// Define Event interface based on the EVENTS array structure
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

export default function MapExplorer() {
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const mapRef = useRef<MapView>(null);

  // Search functionality for map events
  const handleMapSearch = (text: string) => {
    setMapSearchQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const filteredEvents = EVENTS.filter(event => 
      event.title.toLowerCase().includes(text.toLowerCase()) ||
      event.location.toLowerCase().includes(text.toLowerCase()) ||
      event.year.toLowerCase().includes(text.toLowerCase()) ||
      event.description.toLowerCase().includes(text.toLowerCase())
    );
    
    setSearchResults(filteredEvents.slice(0, 5)); // Limit to 5 results
  };

  const handleSelectSearchResult = (event: Event) => {
    setSelectedEvent(event);
    setMapSearchQuery(event.title);
    setSearchResults([]);
    // Focus map on selected event
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      }, 1000);
    }
  };

  // Render search result item
  const renderSearchResult = ({ item }: { item: Event }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => handleSelectSearchResult(item)}
    >
      <View style={styles.searchResultIconContainer}>
        <FontAwesome5 
          name={getCategoryIcon(item.category)} 
          size={16} 
          color="#555" 
        />
      </View>
      <View style={styles.searchResultTextContainer}>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <Text style={styles.searchResultSubtitle}>{item.year} • {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const getCategoryIcon = (category: string): string => {
    switch(category) {
      case 'Prophet\'s Life': return 'star';
      case 'Revelation': return 'book';
      case 'Migration': return 'route';
      case 'Battle': return 'shield-alt';
      case 'Treaty': return 'handshake';
      case 'Conquest': return 'flag';
      case 'Caliphate': return 'crown';
      default: return 'landmark';
    }
  };

  return (
    <View style={styles.mapContainer}>
      {/* Map Search Bar */}
      <View style={styles.mapSearchContainer}>
        <BlurView intensity={90} tint="light" style={styles.mapSearchBlur}>
          <View style={styles.mapSearchInputContainer}>
            <FontAwesome5 name="search" size={16} color="#666666" style={styles.mapSearchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.mapSearchInput}
              placeholder="Search Islamic historical events..."
              placeholderTextColor="#999999"
              value={mapSearchQuery}
              onChangeText={handleMapSearch}
            />
            {mapSearchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.mapSearchClear}
                onPress={() => {
                  setMapSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <FontAwesome5 name="times-circle" size={16} color="#666666" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </BlurView>
      </View>
      
      {/* Islamic Map Component */}
      <IslamicMap 
        onEventSelect={(event) => setSelectedEvent(event)}
        selectedEvent={selectedEvent}
        mapRef={mapRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
  },
  mapSearchContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  mapSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapSearchIcon: {
    marginRight: 10,
  },
  mapSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  mapSearchClear: {
    padding: 5,
  },
  searchResultsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 5,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchResultTextContainer: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  searchResultSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  mapSearchBlur: {
    flex: 1,
    borderRadius: 12,
  },
}); 