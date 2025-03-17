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
  FlatList
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function AIChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.chatContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderChatMessage}
        keyExtractor={(item) => `message-${item.id}`}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isTyping ? (
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
        ) : null}
      />
      
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
                key={`question-${index}`}
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
  );
}

const styles = StyleSheet.create({
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
}); 