import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../lib/hooks/useAuth';
import { useProfile } from '../../lib/hooks/useProfile';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_HERO_URL = 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=1200&h=400&fit=crop'; // Mallorca sunset

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile(user?.id);
  const [uploading, setUploading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const updateHeroImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && user) {
      setUploading(true);
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        
        const fileExt = result.assets[0].uri.split('.').pop();
        const filePath = `${user.id}/hero.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-heroes')
          .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-heroes')
          .getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ hero_image_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        Alert.alert('Success', 'Hero image updated!');
      } catch (error: any) {
        Alert.alert('Upload Failed', error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const resetHeroImage = async () => {
    if (!user) return;

    Alert.alert(
      'Reset Hero Image',
      'Reset to default sunset image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .update({ hero_image_url: null })
                .eq('id', user.id);

              if (error) throw error;
              Alert.alert('Success', 'Hero image reset to default!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  const heroUrl = profile.hero_image_url || DEFAULT_HERO_URL;

  return (
    <ScrollView style={styles.container}>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: heroUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <TouchableOpacity style={styles.heroButton} onPress={updateHeroImage} disabled={uploading}>
            <Text style={styles.heroButtonText}>
              {uploading ? 'Uploading...' : 'Change Hero'}
            </Text>
          </TouchableOpacity>
          {profile.hero_image_url && (
            <TouchableOpacity style={styles.heroButton} onPress={resetHeroImage}>
              <Text style={styles.heroButtonText}>Reset to Default</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: profile.avatar_url }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.full_name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        {profile.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.events_attended_count}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.friends_count}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat' as never)}
        >
          <Text style={styles.chatButtonText}>💬 Contact Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Gallery Section */}
      <View style={styles.gallerySection}>
        <Text style={styles.sectionTitle}>Gallery</Text>
        <View style={styles.galleryGrid}>
          <TouchableOpacity style={styles.addPhotoButton}>
            <Text style={styles.addPhotoText}>+</Text>
            <Text style={styles.addPhotoSubtext}>Add Photo</Text>
          </TouchableOpacity>
          {/* TODO: Display user's gallery images */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  heroButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: -50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  gallerySection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: 32,
    color: '#007AFF',
  },
  addPhotoSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
