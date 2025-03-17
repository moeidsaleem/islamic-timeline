import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const TAB_COUNT = 5;
const WHEEL_RADIUS = 120; // Radius of the virtual wheel

// Define tabs outside the component to avoid initialization issues
const TABS = [
  {
    name: 'Home',
    path: '/',
    icon: (color: string) => <FontAwesome name="home" size={24} color={color} />,
  },
  {
    name: 'Timeline',
    path: '/timeline-fixed',
    icon: (color: string) => <FontAwesome name="history" size={24} color={color} />,
  },
  {
    name: 'AI Chat',
    path: '/ai-chat',
    icon: (color: string) => <FontAwesome5 name="comment-alt" size={22} color={color} />,
  },
  {
    name: 'Topics',
    path: '/topics',
    icon: (color: string) => <FontAwesome5 name="book-open" size={22} color={color} />,
  },
  {
    name: 'Map',
    path: '/map',
    icon: (color: string) => <FontAwesome5 name="map-marked-alt" size={22} color={color} />,
  },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  
  // Animation values for tab press feedback
  const tabAnimations = useRef(Array(TAB_COUNT).fill(0).map(() => new Animated.Value(1))).current;
  
  // Animation value for the revolution angle of the wheel
  const wheelAngle = useRef(new Animated.Value(0)).current;
  
  // Keep track of previous selected index for direction detection
  const prevSelectedIndexRef = useRef(2); // Default to middle tab
  
  // Track the currently selected tab index
  const [selectedTabIndex, setSelectedTabIndex] = useState(() => {
    try {
      // Initialize based on current pathname
      const initialPath = pathname.replace('/(tabs)', '');
      const index = TABS.findIndex(tab => initialPath.endsWith(tab.path));
      const foundIndex = index >= 0 ? index : 2;
      prevSelectedIndexRef.current = foundIndex; // Initialize previous index
      return foundIndex; // Default to middle tab if not found
    } catch (error) {
      console.log('Error initializing tab index:', error);
      return 2; // Default to middle tab on error
    }
  });

  // Update selected tab index when pathname changes
  useEffect(() => {
    try {
      if (!pathname) return;
      
      const currentPath = pathname.replace('/(tabs)', '');
      const index = TABS.findIndex(tab => currentPath.endsWith(tab.path));
      if (index >= 0) {
        setSelectedTabIndex(index);
        
        // Animate wheel to center the selected tab
        animateWheelToTab(index);
        
        // Update previous index after animation
        prevSelectedIndexRef.current = index;
      }
    } catch (error) {
      console.log('Error updating tab index:', error);
    }
  }, [pathname]);

  const isActive = (path: string) => {
    try {
      if (!pathname) return path === '/';
      if (path === '/' && pathname === '/(tabs)') return true;
      return pathname.endsWith(path);
    } catch (error) {
      console.log('Error checking active tab:', error);
      return false;
    }
  };

  // Calculate the angle needed to center a specific tab
  const calculateTargetAngle = (index: number) => {
    // Calculate how far from center this tab is (-2, -1, 0, 1, 2)
    const distanceFromCenter = index - Math.floor(TABS.length / 2);
    
    // Convert to angle in radians - each tab is 2π/TAB_COUNT radians apart
    // We want to rotate in the opposite direction of the distance
    return -distanceFromCenter * (2 * Math.PI / TAB_COUNT);
  };

  // Determine the best rotation direction based on current and target indices
  const determineRotationDirection = (currentIndex: number, targetIndex: number) => {
    // Calculate the shortest path (clockwise or counterclockwise)
    const clockwiseDist = (targetIndex - currentIndex + TABS.length) % TABS.length;
    const counterclockwiseDist = (currentIndex - targetIndex + TABS.length) % TABS.length;
    
    // Return true for clockwise, false for counterclockwise
    return clockwiseDist <= counterclockwiseDist;
  };

  // Animate the wheel to center the selected tab
  const animateWheelToTab = (index: number) => {
    try {
      const prevIndex = prevSelectedIndexRef.current;
      const targetAngle = calculateTargetAngle(index);
      const currentAngle = calculateTargetAngle(prevIndex);
      
      // Determine if we should go clockwise or counterclockwise
      const goClockwise = determineRotationDirection(prevIndex, index);
      
      // Get the current value of the animation
      let currentValue = 0;
      const valueListener = wheelAngle.addListener(({ value }) => {
        currentValue = value;
        wheelAngle.removeListener(valueListener);
      });
      
      // Calculate the shortest path to the target angle
      let finalAngle = targetAngle;
      
      // If we're moving from right to left (decreasing index)
      if (index < prevIndex) {
        // If we should go clockwise (the long way around)
        if (goClockwise) {
          finalAngle = targetAngle + 2 * Math.PI;
        }
      } 
      // If we're moving from left to right (increasing index)
      else if (index > prevIndex) {
        // If we should go counterclockwise (the long way around)
        if (!goClockwise) {
          finalAngle = targetAngle - 2 * Math.PI;
        }
      }
      
      // Use spring animation for smooth movement
      Animated.spring(wheelAngle, {
        toValue: finalAngle,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.log('Error animating wheel:', error);
    }
  };

  const navigateToTab = (path: string, index: number) => {
    try {
      // Don't do anything if already on this tab
      if (index === selectedTabIndex) return;
      
      // Animate the tab press
      Animated.sequence([
        Animated.timing(tabAnimations[index], {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(tabAnimations[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Set the selected tab index
      setSelectedTabIndex(index);
      
      // Animate wheel to center the selected tab
      animateWheelToTab(index);
      
      // Add the (tabs) prefix to the path
      router.push(`/(tabs)${path}` as any);
    } catch (error) {
      console.log('Error navigating to tab:', error);
    }
  };

  // Calculate position for each tab based on its position on the wheel
  const getTabPosition = (index: number, totalTabs: number) => {
    try {
      // Calculate the base angle for this tab on the wheel (in radians)
      const baseAngle = (index / totalTabs) * 2 * Math.PI;
      
      // Create an interpolated angle that combines the base angle with the wheel rotation
      const interpolatedAngle = Animated.add(
        baseAngle,
        wheelAngle
      );
      
      // Calculate the x and y position based on the angle
      // We use a portion of the full radius to create a subtle arc
      const translateX = interpolatedAngle.interpolate({
        inputRange: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI, 3 * Math.PI],
        outputRange: [-width, width/2, 0, -width/2, -width, width/2],
        extrapolate: 'clamp'
      });
      
      const translateY = interpolatedAngle.interpolate({
        inputRange: [-2 * Math.PI, -Math.PI, -Math.PI/2, 0, Math.PI/2, Math.PI, 3 * Math.PI/2, 2 * Math.PI, 3 * Math.PI],
        outputRange: [-20, 0, -15, -20, -15, 0, -15, -20, 0],
        extrapolate: 'clamp'
      });
      
      // Calculate rotation to make tabs follow the curve
      const rotate = interpolatedAngle.interpolate({
        inputRange: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI, 3 * Math.PI],
        outputRange: ['-15deg', '15deg', '0deg', '-15deg', '0deg', '15deg'],
        extrapolate: 'clamp'
      });
      
      // Calculate scale - tabs closer to center are larger
      const scale = interpolatedAngle.interpolate({
        inputRange: [-2 * Math.PI, -Math.PI, -Math.PI/2, 0, Math.PI/2, Math.PI, 3 * Math.PI/2, 2 * Math.PI, 3 * Math.PI],
        outputRange: [1, 0.85, 0.9, 1, 0.9, 0.85, 0.9, 1, 0.85],
        extrapolate: 'clamp'
      });
      
      // Calculate opacity - tabs at the edges are slightly more transparent
      const opacity = interpolatedAngle.interpolate({
        inputRange: [-2 * Math.PI, -Math.PI, -Math.PI/2, 0, Math.PI/2, Math.PI, 3 * Math.PI/2, 2 * Math.PI, 3 * Math.PI],
        outputRange: [1, 0.7, 0.85, 1, 0.85, 0.7, 0.85, 1, 0.7],
        extrapolate: 'clamp'
      });
      
      return {
        transform: [
          { translateX },
          { translateY },
          { rotate },
          { scale }
        ],
        opacity
      };
    } catch (error) {
      console.log('Error calculating tab position:', error);
      return { transform: [], opacity: 1 };
    }
  };

  // Determine if a tab should be rendered in front (higher z-index)
  // This is a static calculation instead of an animated value
  const getTabOrder = (index: number) => {
    // Calculate distance from the selected tab (center)
    const distance = Math.abs(index - selectedTabIndex);
    
    // The selected tab and its immediate neighbors get higher z-index
    if (distance <= 1) {
      return { zIndex: 5 - distance };
    }
    return { zIndex: 1 };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          <View style={styles.tabBarWrapper}>
            <View style={styles.arcBackground} />
            <View style={styles.tabBar}>
              {/* Render tabs in reverse order first to handle z-index properly */}
              {[...TABS].map((_, i) => {
                // Calculate the actual index in reverse order
                const reverseIndex = TABS.length - 1 - i;
                const tab = TABS[reverseIndex];
                
                // Skip tabs that should be in front - we'll render them in the next loop
                if (Math.abs(reverseIndex - selectedTabIndex) <= 1) {
                  return null;
                }
                
                try {
                  const active = isActive(tab.path);
                  const color = active ? '#fece1a' : '#666666';
                  const positionStyle = getTabPosition(reverseIndex, TABS.length);
                  
                  return (
                    <Animated.View 
                      key={`back-${tab.path}`}
                      style={[
                        styles.tabButtonContainer,
                        {
                          ...positionStyle,
                          transform: [...(positionStyle.transform || []), { scale: tabAnimations[reverseIndex] }]
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={[
                          styles.tabButton,
                          active && styles.activeTabButton
                        ]}
                        onPress={() => navigateToTab(tab.path, reverseIndex)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.iconContainer}>
                          {tab.icon(color)}
                          {active && <View style={styles.activeIndicator} />}
                        </View>
                        <Text 
                          style={[
                            styles.tabLabel, 
                            { color },
                            active && styles.activeTabLabel
                          ]}
                        >
                          {tab.name}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                } catch (error) {
                  console.log('Error rendering tab:', error);
                  return null;
                }
              })}
              
              {/* Now render the tabs that should be in front */}
              {TABS.map((tab, index) => {
                // Only render tabs that should be in front
                if (Math.abs(index - selectedTabIndex) > 1) {
                  return null;
                }
                
                try {
                  const active = isActive(tab.path);
                  const color = active ? '#fece1a' : '#666666';
                  const positionStyle = getTabPosition(index, TABS.length);
                  
                  return (
                    <Animated.View 
                      key={`front-${tab.path}`}
                      style={[
                        styles.tabButtonContainer,
                        {
                          ...positionStyle,
                          transform: [...(positionStyle.transform || []), { scale: tabAnimations[index] }]
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={[
                          styles.tabButton,
                          active && styles.activeTabButton
                        ]}
                        onPress={() => navigateToTab(tab.path, index)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.iconContainer}>
                          {tab.icon(color)}
                          {active && <View style={styles.activeIndicator} />}
                        </View>
                        <Text 
                          style={[
                            styles.tabLabel, 
                            { color },
                            active && styles.activeTabLabel
                          ]}
                        >
                          {tab.name}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                } catch (error) {
                  console.log('Error rendering tab:', error);
                  return null;
                }
              })}
            </View>
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginHorizontal: 15,
    marginBottom: Platform.OS === 'ios' ? 0 : 5,
  },
  blurContainer: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(200, 200, 200, 0.3)',
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  tabBarWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingTop: 5,
    position: 'relative',
  },
  arcBackground: {
    position: 'absolute',
    top: -80,
    left: -20,
    right: -20,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ scaleX: 1.2 }],
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: Platform.OS === 'ios' ? 10 : 15,
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  tabButtonContainer: {
    position: 'absolute',
    width: width / TAB_COUNT,
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tabButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 15,
  },
  activeTabButton: {
    backgroundColor: 'rgba(254, 206, 26, 0.05)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 30,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fece1a',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  activeTabLabel: {
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
}); 