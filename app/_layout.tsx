import React, { useEffect, useRef } from 'react';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  Text,
  Image,
  Platform
} from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Link, usePathname, useRouter } from 'expo-router';
import FloatingActionButton from '@/components/FloatingActionButton';
import BottomIndicator from '@/components/BottomIndicator';

const { width, height } = Dimensions.get('window');

export default function RootLayout() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderRadiusAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Animate content when drawer opens/closes
  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(borderRadiusAnim, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(borderRadiusAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  const navigationItems = [
    { name: 'Home', icon: 'home' as const, path: '/' as const },
    { name: 'Timeline', icon: 'clock' as const, path: '/(tabs)/timeline-fixed' as const },
    { name: 'Explore', icon: 'compass' as const, path: '/(tabs)/explore' as const },
    { name: 'Map', icon: 'map' as const, path: '/map' as const },
    { name: 'Favorites', icon: 'bookmark' as const, path: '/favorites' as const },
    { name: 'Settings', icon: 'settings' as const, path: '/settings' as const },
  ];

  const renderDrawerContent = () => {
    return (
      <View style={[styles.drawerContent, { paddingTop: insets.top + 20 }]}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=elegant islamic geometric pattern in black overlay, circular emblem' }} 
            style={styles.logo} 
          />
          <Text style={styles.appTitle}>Islamic Timeline</Text>
          <Text style={styles.appSubtitle}>Journey Through History</Text>
        </View>
        
        <View style={styles.navigationSection}>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.navigationItem,
                pathname === item.path && styles.activeNavigationItem,
              ]}
              onPress={() => {
                router.push(item.path as any );
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Feather
                name={item.icon}
                size={22}
                color={pathname === item.path ? '#333333' : '#666666'}
                style={styles.navigationIcon}
              />
              <Text
                style={[
                  styles.navigationText,
                  pathname === item.path && styles.activeNavigationText,
                ]}
              >
                {item.name}
              </Text>
              {pathname === item.path && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
            <Feather name="info" size={18} color="#666666" />
            <Text style={styles.footerButtonText}>About</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
            <Feather name="help-circle" size={18} color="#666666" />
            <Text style={styles.footerButtonText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerType="slide"
      drawerStyle={styles.drawer}
      overlayStyle={styles.overlay}
    >
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ],
            borderRadius: borderRadiusAnim,
            overflow: 'hidden',
          },
        ]}
      >
        <Slot />
        
        {/* Custom floating action button */}
        <FloatingActionButton
          icon="menu"
          position="top-left"
          style={{ top: insets.top + 10 }}
          onPress={() => setOpen(true)}
          showHeader={true}
        />
        
        {/* Bottom navigation indicator */}
        <BottomIndicator style={{ bottom: insets.bottom + 10 }} />
      </Animated.View>
      <StatusBar style="dark" />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: '80%',
    backgroundColor: '#f8f8f8',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  navigationSection: {
    flex: 1,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeNavigationItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  navigationIcon: {
    marginRight: 15,
  },
  navigationText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  activeNavigationText: {
    color: '#333333',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 4,
    height: 20,
    backgroundColor: '#333333',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ translateY: -10 }],
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  footerButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
});
