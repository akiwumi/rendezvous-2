import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../lib/hooks/useAuth';

export default function OnboardingScreen() {
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickImage = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        Alert.alert('Error', 'Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Alert.alert('Error', 'Image must be less than 5MB');
        return;
      }

      // Create preview URL
      const uri = URL.createObjectURL(file);
      setImageUri(uri);
      setImageFile(file);
    }
  };

  const skipOnboarding = async () => {
    if (!user) return;

    setUploading(true);
    try {
      // Mark onboarding as completed without photo
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Navigation will be handled automatically by AppNavigator
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setUploading(false);
    }
  };

  const uploadAndContinue = async () => {
    if (!user) return;

    // If no image selected, just skip
    if (!imageFile) {
      await skipOnboarding();
      return;
    }

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, imageFile, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Clean up preview URL
      if (imageUri) {
        URL.revokeObjectURL(imageUri);
      }

      // Navigation will be handled automatically by AppNavigator
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Add a profile picture (optional)</Text>

        {/* Hidden file input for web */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange as any}
        />

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>+</Text>
              <Text style={styles.avatarPlaceholderSubtext}>Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
            <Text style={styles.changeButtonText}>Change Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, uploading && styles.buttonDisabled]}
          onPress={uploadAndContinue}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {imageUri ? 'Upload & Continue' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>

        {!imageUri && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipOnboarding}
            disabled={uploading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.note}>
          You can add a profile picture later from your profile settings.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  avatarContainer: {
    marginBottom: 24,
    cursor: 'pointer',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  avatarPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    color: '#007AFF',
  },
  avatarPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  changeButton: {
    marginBottom: 24,
    cursor: 'pointer',
  },
  changeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 12,
    cursor: 'pointer',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 40,
  },
});
