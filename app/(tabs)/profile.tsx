import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  LogOut, 
  Award, 
  Edit3, 
  ChevronRight,
  Bell,
  HelpCircle,
  Shield,
  Moon
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUserProfile, setLearningLevel } = useUserStore();
  const { signOut } = useAuthStore();
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  
  const handleChangePhoto = async () => {
    if (Platform.OS === 'web') {
      // Web implementation would use a file input
      Alert.alert('Upload on Web', 'This feature is limited on web. In a full implementation, we would use a file input element.');
      return;
    }
    
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your media library to change your profile photo.');
      return;
    }
    
    try {
      setIsChangingPhoto(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // In a real app, upload to Supabase Storage
        // const fileName = `profile-${Date.now()}.jpg`;
        // const { data, error } = await supabase.storage
        //   .from('profiles')
        //   .upload(fileName, asset.uri);
        
        // if (error) throw error;
        
        // const { data: { publicUrl } } = supabase.storage
        //   .from('profiles')
        //   .getPublicUrl(fileName);
        
        // Update user profile with new photo URL
        await updateUserProfile({
          profilePicture: asset.uri, // In real app, use publicUrl
        });
      }
    } catch (error) {
      console.error('Error changing profile photo:', error);
      Alert.alert('Upload Failed', 'There was an error changing your profile photo. Please try again.');
    } finally {
      setIsChangingPhoto(false);
    }
  };

  const handleChangeLearningLevel = () => {
    Alert.alert(
      'Select Learning Level',
      'Choose your German proficiency level',
      [
        {
          text: 'Beginner',
          onPress: () => setLearningLevel('beginner'),
        },
        {
          text: 'Intermediate',
          onPress: () => setLearningLevel('intermediate'),
        },
        {
          text: 'Advanced',
          onPress: () => setLearningLevel('advanced'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // Navigation is handled by the protected route hook
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleChangePhoto}
            disabled={isChangingPhoto}
          >
            {user?.profilePicture ? (
              <Image 
                source={{ uri: user.profilePicture }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>
                  {(user?.name?.[0] || 'S').toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Edit3 size={16} color={Colors.card} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{user?.name || 'Student'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'student@example.com'}</Text>
          
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>
              {user?.learningLevel?.charAt(0).toUpperCase() + user?.learningLevel?.slice(1) || 'Beginner'}
            </Text>
          </View>
        </View>
        
        {!user?.isPremium && (
          <Card style={styles.premiumCard}>
            <View style={styles.premiumContent}>
              <Award size={24} color={Colors.secondary} />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDescription}>
                  Unlock all features and enhance your learning experience
                </Text>
              </View>
            </View>
            <Button 
              title="View Plans" 
              variant="secondary"
              onPress={() => router.push('/payment')}
            />
          </Card>
        )}

<Text style={styles.sectionTitle}>Account Settings</Text>
        
        <View style={styles.settingsContainer}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleChangeLearningLevel}
          >
            <View style={styles.settingIconContainer}>
              <Settings size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Learning Level</Text>
              <Text style={styles.settingDescription}>
                {user?.learningLevel?.charAt(0).toUpperCase() + user?.learningLevel?.slice(1) || 'Beginner'}
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Manage your notification preferences
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Appearance</Text>
              <Text style={styles.settingDescription}>
                Light mode
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>
                Get help with using the app
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Read our privacy policy
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Log Out"
          variant="outline"
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color={Colors.primary} />}
          style={styles.logoutButton}
        />

<Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: '600',
    color: Colors.card,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '20', // 20% opacity
    borderRadius: 16,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  premiumCard: {
    backgroundColor: Colors.card,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  premiumDescription: {
    fontSize: 12,
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  settingsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textLight,
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});