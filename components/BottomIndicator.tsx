import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  ViewStyle,
  Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

interface BottomIndicatorProps {
  style?: ViewStyle;
}

const BottomIndicator: React.FC<BottomIndicatorProps> = ({ style }) => {
  const pathname = usePathname();
  
  // Map routes to icons and labels
  const getRouteInfo = () => {
    switch (pathname) {
      case '/':
        return { icon: 'home', label: 'Home' };
      case '/timeline':
        return { icon: 'clock', label: 'Timeline' };
      case '/explore':
        return { icon: 'compass', label: 'Explore' };
      case '/map':
        return { icon: 'map', label: 'Map' };
      case '/favorites':
        return { icon: 'bookmark', label: 'Favorites' };
      case '/settings':
        return { icon: 'settings', label: 'Settings' };
      default:
        return { icon: 'home', label: 'Home' };
    }
  };
  
  const { icon, label } = getRouteInfo();
  
  return (
    <Animated.View style={[styles.container, style]}>
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        <View style={styles.content}>
          <Feather name={icon as keyof typeof Feather.glyphMap} size={20} color="#333333" />
          <Text style={styles.label}>{label}</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blurView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
});

export default BottomIndicator; 