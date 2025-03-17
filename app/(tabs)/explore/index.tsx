import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import IslamicMap from '@/components/IslamicMap';
import { EVENTS } from '@/app/(tabs)/timeline-fixed';
import MapView, { Region } from 'react-native-maps';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

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

// Sample chat messages
const INITIAL_MESSAGES = [
  {
    id: 1,
    text: 'As-salamu alaykum! I am your Islamic history guide. How can I assist you today?',
    sender: 'ai',
    timestamp: new Date().toISOString()
  }
];

// Sample suggested questions
const SUGGESTED_QUESTIONS = [
  'Who was Prophet Muhammad ﷺ?',
  'What is the significance of the Hijra?',
  'Tell me about the Islamic Golden Age',
  'What are the Five Pillars of Islam?',
  'Who were the Rightly Guided Caliphs?',
  'What contributions did Muslims make to science?'
];

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

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('discover');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const searchInputRef = useRef<TextInput>(null);
  const mapRef = useRef<MapView>(null);
  
  // Animation values for tab indicator
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const tabIndicatorWidth = useRef(new Animated.Value(0)).current;
  
  // Animation values for tab content
  const discoverFade = useRef(new Animated.Value(activeTab === 'discover' ? 1 : 0)).current;
  const mapFade = useRef(new Animated.Value(activeTab === 'map' ? 1 : 0)).current;
  const chatFade = useRef(new Animated.Value(activeTab === 'chat' ? 1 : 0)).current;

  useEffect(() => {
    // Animate the screen when it loads
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  // Animate tab indicator when activeTab changes
  useEffect(() => {
    let position = 0;
    let width = 0;
    
    // Calculate position based on active tab
    if (activeTab === 'discover') {
      position = 0;
      width = 33.33;
    } else if (activeTab === 'map') {
      position = 33.33;
      width = 33.33;
    } else if (activeTab === 'chat') {
      position = 66.66;
      width = 33.33;
    }
    
    // Animate the tab indicator
    Animated.parallel([
      Animated.spring(tabIndicatorPosition, {
        toValue: position,
        useNativeDriver: false,
        friction: 10,
        tension: 100
      }),
      Animated.spring(tabIndicatorWidth, {
        toValue: width,
        useNativeDriver: false,
        friction: 10,
        tension: 100
      })
    ]).start();
    
    // Animate tab content
    Animated.parallel([
      Animated.timing(discoverFade, {
        toValue: activeTab === 'discover' ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(mapFade, {
        toValue: activeTab === 'map' ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(chatFade, {
        toValue: activeTab === 'chat' ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
  }, [activeTab]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTabChange = (tab: string) => {
    // Add a subtle haptic feedback if available
    // Vibration.vibrate(10);
    
    // Animate the tab change
    setActiveTab(tab);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    handleSendMessage();
  };

  // Simple AI response generator (in a real app, this would call an actual AI API)
  const generateAIResponse = (query: string) => {
    const responses = [
      "Prophet Muhammad ﷺ was born in Makkah around 570 CE. He received his first revelation at age 40 and spent 23 years spreading the message of Islam.",
      "The Hijra refers to the migration of Prophet Muhammad ﷺ and his followers from Makkah to Madinah in 622 CE. This event marks the beginning of the Islamic calendar.",
      "The Islamic Golden Age (8th-14th centuries) was a period of cultural, economic, and scientific flourishing in the Islamic world. Scholars made significant contributions to mathematics, astronomy, medicine, and philosophy.",
      "The Five Pillars of Islam are: Shahada (faith), Salat (prayer), Zakat (charity), Sawm (fasting during Ramadan), and Hajj (pilgrimage to Makkah).",
      "The Rightly Guided Caliphs were the first four leaders after Prophet Muhammad ﷺ: Abu Bakr, Umar ibn Al-Khattab, Uthman ibn Affan, and Ali ibn Abi Talib. They ruled from 632-661 CE.",
      "Muslim scholars made numerous contributions to science, including algebra (by Al-Khwarizmi), optics (by Ibn al-Haytham), and advances in medicine (by Ibn Sina/Avicenna). They preserved and built upon Greek knowledge while adding their own discoveries."
    ];
    
    // In a real app, this would be a more sophisticated matching algorithm
    if (query.toLowerCase().includes('muhammad') || query.toLowerCase().includes('prophet'))
      return responses[0];
    else if (query.toLowerCase().includes('hijra'))
      return responses[1];
    else if (query.toLowerCase().includes('golden age'))
      return responses[2];
    else if (query.toLowerCase().includes('pillars'))
      return responses[3];
    else if (query.toLowerCase().includes('caliphs'))
      return responses[4];
    else if (query.toLowerCase().includes('science') || query.toLowerCase().includes('contributions'))
      return responses[5];
    else
      return "That's an interesting question about Islamic history. In a complete version of this app, I would connect to a knowledge base to provide you with accurate information. Would you like to explore one of the suggested topics instead?";
  };

  const renderChatMessage = ({ item }: { item: any }) => {
    const isAI = item.sender === 'ai';
    
    return (
      <View style={[styles.messageContainer, isAI ? styles.aiMessage : styles.userMessage]}>
        {isAI && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#f5f5f5', '#e0e0e0']}
              style={styles.avatar}
            >
              <FontAwesome5 name="mosque" size={14} color="#333333" />
            </LinearGradient>
          </View>
        )}
        <View style={[
          styles.messageBubble, 
          isAI ? styles.aiMessageBubble : styles.userMessageBubble
        ]}>
          <Text style={[styles.messageText, isAI ? styles.aiMessageText : styles.userMessageText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  const renderTopicCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.topicCard}
      onPress={() => {
        setActiveTab('chat');
        handleSuggestedQuestion(`Tell me about ${item.title}`);
      }}
    >
      <Image
        source={{ uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(item.imagePrompt)}` }}
        style={styles.topicImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topicImageOverlay}
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Premium Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => handleTabChange('discover')}
            activeOpacity={0.7}

          >
            <Animated.View style={[
              styles.tabContent,
              {
                opacity: activeTab === 'discover' ? 1 : 0.7,
                transform: [{ 
                  scale: activeTab === 'discover' ? 1.05 : 1 
                }
              ]
              }
            ]}>
              <FontAwesome5 
                name="compass" 
                size={20} 
                color={activeTab === 'discover' ? '#333333' : '#999999'} 
                style={styles.tabIcon}
              />
              <Text style={[
                styles.tabText, 
                activeTab === 'discover' && styles.activeTabText
              ]}>
                Discover
              </Text>
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => handleTabChange('map')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={[
              styles.tabContent,
              {
                opacity: activeTab === 'map' ? 1 : 0.7,
                transform: [{ 
                  scale: activeTab === 'map' ? 1.05 : 1 
                }]
              }
            ]}>
              <FontAwesome5 
                name="map-marked-alt" 
                size={20} 
                color={activeTab === 'map' ? '#333333' : '#999999'} 
                style={styles.tabIcon}
              />
              <Text style={[
                styles.tabText, 
                activeTab === 'map' && styles.activeTabText
              ]}>
                Map
              </Text>
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => handleTabChange('chat')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={[
              styles.tabContent,
              {
                opacity: activeTab === 'chat' ? 1 : 0.7,
                transform: [{ 
                  scale: activeTab === 'chat' ? 1.05 : 1 
                }]
              }
            ]}>
              <FontAwesome5 
                name="comment-alt" 
                size={20} 
                color={activeTab === 'chat' ? '#333333' : '#999999'} 
                style={styles.tabIcon}
              />
              <Text style={[
                styles.tabText, 
                activeTab === 'chat' && styles.activeTabText
              ]}>
                Chat
              </Text>
            </Animated.View>
          </TouchableOpacity>
          
          {/* Animated Tab Indicator */}
          <Animated.View 
            style={[
              styles.tabIndicator,
              {
                left: tabIndicatorPosition.interpolate({
                  inputRange: [0, 33.33, 66.66],
                  outputRange: [0, width/3, 2*width/3]
                }),
                width: width/3
              }
            ]} 
          />
        </View>
        
        {/* Content Views - Add fade transition between tabs */}
        <Animated.View style={styles.tabContentContainer}>
          {/* Map View */}
          <Animated.View 
            style={[
              styles.tabContentView,
              { 
                opacity: mapFade,
                zIndex: activeTab === 'map' ? 1 : 0
              }
            ]}
          >
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
          </Animated.View>
          
          {/* Discover View */}
          <Animated.View 
            style={[
              styles.tabContentView,
              { 
                opacity: discoverFade,
                zIndex: activeTab === 'discover' ? 1 : 0
              }
            ]}
          >
            <ScrollView style={styles.discoverContainer} showsVerticalScrollIndicator={false}>
              {/* Hero Section */}
              <View style={styles.heroSection}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.heroGradient}
                >
                  <Image
                    source={{ uri: 'https://api.a0.dev/assets/image?text=Beautiful%20Islamic%20architecture%20with%20geometric%20patterns%20and%20calligraphy' }}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                </LinearGradient>
                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle}>Explore Islamic History</Text>
                  <Text style={styles.heroSubtitle}>
                    Discover the rich heritage and significant events that shaped Islamic civilization
                  </Text>
                  <TouchableOpacity style={styles.heroButton}>
                    <Text style={styles.heroButtonText}>Start Journey</Text>
                    <FontAwesome5 name="arrow-right" size={14} color="#ffffff" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Featured Topics Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Topics</Text>
                  <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>See All</Text>
                    <FontAwesome5 name="chevron-right" size={12} color="#666666" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Explore key subjects in Islamic history and civilization
                </Text>
              </View>
              
              {/* Topics Carousel */}
              <FlatList
                data={TOPICS}
                renderItem={renderTopicCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topicsContainer}
                snapToInterval={width * 0.75 + 20}
                decelerationRate="fast"
                snapToAlignment="center"
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
              />
              
              {/* Timeline Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Timeline Highlights</Text>
                  <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>View All</Text>
                    <FontAwesome5 name="chevron-right" size={12} color="#666666" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Key moments that shaped Islamic history
                </Text>
              </View>
              
              {/* Timeline Highlights */}
              <View style={styles.timelineContainer}>
                {EVENTS.slice(0, 5).map((event, index) => (
                  <TouchableOpacity 
                    key={event.id}
                    style={[
                      styles.timelineEvent,
                      index === EVENTS.slice(0, 5).length - 1 && styles.lastTimelineEvent
                    ]}
                    onPress={() => {
                      setActiveTab('map');
                      setSelectedEvent(event);
                    }}
                  >
                    <View style={styles.timelineEventYearContainer}>
                      <Text style={styles.timelineEventYear}>{event.year}</Text>
                      {index < EVENTS.slice(0, 5).length - 1 && (
                        <View style={styles.timelineConnector} />
                      )}
                    </View>
                    <View style={styles.timelineEventCard}>
                      <View style={styles.timelineEventContent}>
                        <Text style={styles.timelineEventTitle}>{event.title}</Text>
                        <Text style={styles.timelineEventLocation}>
                          <FontAwesome5 name="map-marker-alt" size={12} color="#666666" style={{ marginRight: 4 }} />
                          {event.location}
                        </Text>
                        <Text numberOfLines={2} style={styles.timelineEventDescription}>
                          {event.description}
                        </Text>
                      </View>
                      <View style={styles.timelineEventIconContainer}>
                        <FontAwesome5 
                          name={getCategoryIcon(event.category)} 
                          size={18} 
                          color="#333333" 
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity 
                  style={styles.viewAllTimelineButton}
                  onPress={() => {
                    // Navigate to timeline
                  }}
                >
                  <LinearGradient
                    colors={['#333333', '#555555']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.viewAllTimelineButtonGradient}
                  >
                    <Text style={styles.viewAllTimelineButtonText}>View Complete Timeline</Text>
                    <FontAwesome5 name="arrow-right" size={14} color="#ffffff" style={{ marginLeft: 8 }} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              {/* Explore by Category Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Explore by Category</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Browse content by specific themes
                </Text>
                
                <View style={styles.categoriesGrid}>
                  {[
                    { icon: 'star', title: 'Prophet\'s Life', color: '#FFD700' },
                    { icon: 'book', title: 'Revelation', color: '#4CAF50' },
                    { icon: 'route', title: 'Migration', color: '#2196F3' },
                    { icon: 'shield-alt', title: 'Battles', color: '#F44336' },
                    { icon: 'handshake', title: 'Treaties', color: '#9C27B0' },
                    { icon: 'landmark', title: 'Civilization', color: '#FF9800' }
                  ].map((category, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}>
                      <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}20` }]}>
                        <FontAwesome5 name={category.icon} size={20} color={category.color} />
                      </View>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Bottom Spacing */}
              <View style={{ height: 30 }} />
            </ScrollView>
          </Animated.View>
          
          {/* Chat View */}
          <Animated.View 
            style={[
              styles.tabContentView,
              { 
                opacity: chatFade,
                zIndex: activeTab === 'chat' ? 1 : 0
              }
            ]}
          >
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.chatContainer}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
              <ScrollView 
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message) => (
                  <React.Fragment key={message.id}>
                    {renderChatMessage({ item: message })}
                  </React.Fragment>
                ))}
                
                {isTyping && (
                  <View style={[styles.messageContainer, styles.aiMessage]}>
                    <View style={styles.avatarContainer}>
                      <LinearGradient
                        colors={['#f5f5f5', '#e0e0e0']}
                        style={styles.avatar}
                      >
                        <FontAwesome5 name="mosque" size={14} color="#333333" />
                      </LinearGradient>
                    </View>
                    <View style={[styles.messageBubble, styles.aiMessageBubble, styles.typingBubble]}>
                      <View style={styles.typingIndicator}>
                        <View style={[styles.typingDot, styles.typingDot1]} />
                        <View style={[styles.typingDot, styles.typingDot2]} />
                        <View style={[styles.typingDot, styles.typingDot3]} />
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
              
              {/* Suggested Questions */}
              {messages.length <= 2 && !isTyping && (
                <View style={styles.suggestedQuestionsContainer}>
                  <Text style={styles.suggestedQuestionsTitle}>Suggested Questions:</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestedQuestionsContent}
                  >
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.suggestedQuestion}
                        onPress={() => handleSuggestedQuestion(question)}
                      >
                        <Text style={styles.suggestedQuestionText}>{question}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              {/* Input Area */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask about Islamic history..."
                  placeholderTextColor="#999999"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    inputText.trim() === '' && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={inputText.trim() === ''}
                >
                  <FontAwesome5 
                    name="paper-plane" 
                    size={16} 
                    color={inputText.trim() === '' ? '#CCCCCC' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
