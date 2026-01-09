import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase/client';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Terms'>;

export default function TermsScreen({ route, navigation }: Props) {
  const { email, password, fullName, username } = route.params;
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      Alert.alert('Error', 'Please accept the terms to continue');
      return;
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);

    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'https://placeholder.supabase.co' || 
        supabaseKey === 'placeholder-key') {
      Alert.alert(
        'Backend Not Configured',
        'Supabase backend is not set up yet.\n\n' +
        'To enable registration:\n' +
        '1. Create a Supabase project\n' +
        '2. Add credentials to .env file\n' +
        '3. Restart the app\n\n' +
        'See SETUP.md for instructions.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please check your internet connection')), 10000)
    );

    try {
      // 1. Create auth user with timeout
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
      });

      const { data: authData, error: authError } = await Promise.race([
        signUpPromise,
        timeoutPromise
      ]) as any;

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      // 2. Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        avatar_url: '', // Will be set in onboarding
        onboarding_completed: false,
      });

      if (profileError) throw profileError;

      // 3. Record terms acceptance
      const { error: termsError } = await supabase.from('terms_acceptances').insert({
        user_id: authData.user.id,
        version: '2026-01-01',
      });

      if (termsError) throw termsError;

      // Success - user will be redirected to onboarding by App.tsx
      console.log('Registration successful!');
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed', 
        error.message || 'An error occurred during registration. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subtitle}>Rendezvous Social Club — Community Code of Conduct</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Respect & Inclusion</Text>
          <Text style={styles.text}>
            Treat all members, staff, and venue partners with respect. No harassment, 
            discrimination, hate speech, or intimidation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consent & Boundaries</Text>
          <Text style={styles.text}>
            Respect personal boundaries. No unwanted contact, pressure, or inappropriate behavior. 
            "No" means no.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Confidentiality</Text>
          <Text style={styles.text}>
            This is an invite-only community. Do not share member data, photos, private event 
            details, or screenshots outside the community without permission.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events & Venues</Text>
          <Text style={styles.text}>
            Respect venues, staff, and neighbors. Damage, theft, or disruptive behavior may 
            result in immediate removal and banning.
          </Text>
        </View>

        {/* Add more sections as needed */}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setAccepted(!accepted)}
        >
          <View style={[styles.checkboxBox, accepted && styles.checkboxChecked]}>
            {accepted && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the Terms & Conditions and Code of Conduct
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!accepted || loading) && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={!accepted || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Accept & Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.linkText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
