import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import AIChat from '@/components/explore/AIChat';
import TopicsExplorer from '@/components/explore/TopicsExplorer';
import MapExplorer from '@/components/explore/MapExplorer';

export default function ExploreLayout() {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <AIChat />;
      case 'topics':
        return <TopicsExplorer />;
      case 'map':
        return <MapExplorer />;
      default:
        return <AIChat />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Tab Selector */}
        <View style={styles.tabButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.tabButton, activeTab === 'chat' && styles.activeTabButton]}
            onPress={() => setActiveTab('chat')}
          >
            <FontAwesome5 
              name="comment-alt" 
              size={14} 
              color={activeTab === 'chat' ? '#333333' : '#999999'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabButtonText, activeTab === 'chat' && styles.activeTabButtonText]}>
              AI Chat
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.tabButton, activeTab === 'topics' && styles.activeTabButton]}
            onPress={() => setActiveTab('topics')}
          >
            <FontAwesome5 
              name="book-open" 
              size={14} 
              color={activeTab === 'topics' ? '#333333' : '#999999'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabButtonText, activeTab === 'topics' && styles.activeTabButtonText]}>
              Topics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.tabButton, activeTab === 'map' && styles.activeTabButton]}
            onPress={() => setActiveTab('map')}
          >
            <FontAwesome5 
              name="map-marked-alt" 
              size={14} 
              color={activeTab === 'map' ? '#333333' : '#999999'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabButtonText, activeTab === 'map' && styles.activeTabButtonText]}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content Views */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  tabButtonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 100,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
    marginHorizontal: 2,
    flexDirection: 'row',
  },
  activeTabButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
    textAlign: 'center',
  },
  activeTabButtonText: {
    color: '#333333',
  },
  tabIcon: {
    marginRight: 6,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
}); 