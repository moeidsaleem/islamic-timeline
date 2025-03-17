import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  Animated, 
  View, 
  Text, 
  ImageBackground,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type PositionType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface FloatingActionButtonProps {
  icon: keyof typeof Feather.glyphMap;
  position: PositionType;
  style?: ViewStyle;
  onPress: () => void;
  showHeader?: boolean;
  withHaptics?: boolean;
}

interface PositionStyles {
  [key: string]: ViewStyle;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  icon, 
  position, 
  style, 
  onPress,
  showHeader = true,
  withHaptics = true
}) => {
  const isTopLeft = position === 'top-left';
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    // Trigger haptic feedback
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };
  
  if (isTopLeft && showHeader) {
    return (
      <View style={styles.headerContainer}>
 
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={[styles.button, styles.positions[position], style]}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <BlurView intensity={80} tint="dark" style={styles.blurView}>
                <Feather name={icon} size={22} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>

          </View>

      </View>
    );
  }
  
  return (
    <TouchableOpacity
      style={[styles.button, styles.positions[position], style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <BlurView intensity={80} tint="dark" style={styles.blurView}>
        <Feather name={icon} size={22} color="#FFFFFF" />
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  blurView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    overflow: 'hidden',
  },
  positions: {
    'top-left': {
      top: 10,
      left: 20,
    },
    'top-right': {
      top: 10,
      right: 20,
    },
    'bottom-left': {
      bottom: 20,
      left: 20,
    },
    'bottom-right': {
      bottom: 20,
      right: 20,
    },
  } as PositionStyles,
  headerContainer: {
    width: width,
    height: 120,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 40,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  headerBackgroundImage: {
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
});

export default FloatingActionButton; 