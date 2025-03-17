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
  const [activeTab, setActiveTab] = useState('map');
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

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
            onPress={() => setActiveTab('discover')}
          >
            <FontAwesome5 
              name="compass" 
              size={18} 
              color={activeTab === 'discover' ? '#333333' : '#999999'} 
            />
            <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
              Discover
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'map' && styles.activeTab]}
            onPress={() => setActiveTab('map')}
          >
            <FontAwesome5 
              name="map-marked-alt" 
              size={18} 
              color={activeTab === 'map' ? '#333333' : '#999999'} 
            />
            <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
              Map
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}
          >
            <FontAwesome5 
              name="comment-alt" 
              size={18} 
              color={activeTab === 'chat' ? '#333333' : '#999999'} 
            />
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
              Chat
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Map View */}
        {activeTab === 'map' && (
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
        )}
        
        {/* Discover View */}
        {activeTab === 'discover' && (
          <ScrollView style={styles.discoverContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Explore Islamic History</Text>
            <Text style={styles.sectionSubtitle}>
              Discover the rich heritage and significant events that shaped Islamic civilization
            </Text>
            
            <FlatList
              data={TOPICS}
              renderItem={renderTopicCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topicsContainer}
            />
            
            <Text style={styles.sectionTitle}>Timeline Highlights</Text>
            <Text style={styles.sectionSubtitle}>
              Key moments from Islamic history
            </Text>
            
            {/* Timeline Highlights */}
            <View style={styles.timelineHighlights}>
              {EVENTS.slice(0, 5).map((event) => (
                <TouchableOpacity 
                  key={event.id}
                  style={styles.timelineEvent}
                  onPress={() => {
                    setActiveTab('map');
                    setSelectedEvent(event);
                  }}
                >
                  <View style={styles.timelineEventYear}>
                    <Text style={styles.timelineEventYearText}>{event.year}</Text>
                  </View>
                  <View style={styles.timelineEventContent}>
                    <Text style={styles.timelineEventTitle}>{event.title}</Text>
                    <Text style={styles.timelineEventLocation}>{event.location}</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={14} color="#999999" />
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => {
                  // Navigate to timeline
                }}
              >
                <Text style={styles.viewAllButtonText}>View Full Timeline</Text>
                <FontAwesome5 name="arrow-right" size={14} color="#333333" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        
        {/* Chat View */}
        {activeTab === 'chat' && (
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
              {messages.map((message) => renderChatMessage({ item: message }))}
              
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
        )}
      </Animated.View>
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
    opacity: 0.15,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
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
    letterSpacing: 0.5,
  },
  tabContainer: {
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
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  activeTabText: {
    color: '#333333',
  },
  chatContainer: {
    flex: 1,
    marginTop: 15,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '85%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '90%',
  },
  aiMessageBubble: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userMessageBubble: {
    backgroundColor: '#333333',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  aiMessageText: {
    color: '#333333',
  },
  userMessageText: {
    color: '#ffffff',
  },
  typingBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 40,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666666',
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.6,
  },
  typingDot2: {
    opacity: 0.8,
  },
  typingDot3: {
    opacity: 1,
  },
  suggestedContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  suggestedContent: {
    paddingBottom: 5,
  },
  suggestedQuestion: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  suggestedQuestionText: {
    fontSize: 13,
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#333333',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  exploreContainer: {
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
  topicImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
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
  mapContainer: {
    flex: 1,
    position: 'relative',
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
  mapSearchClearButton: {
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
  mapSearchClear: {
    padding: 5,
  },
  discoverContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  topicsContainer: {
    paddingBottom: 20,
  },
  timelineHighlights: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timelineEventYear: {
    width: 50,
    alignItems: 'center',
  },
  timelineEventYearText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  timelineEventContent: {
    flex: 1,
  },
  timelineEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  timelineEventLocation: {
    fontSize: 13,
    color: '#777',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  viewAllButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  suggestedQuestionsContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  suggestedQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  suggestedQuestionsContent: {
    paddingBottom: 5,
  }
});
