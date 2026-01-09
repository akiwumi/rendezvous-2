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
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../lib/hooks/useAuth';
import { Database } from '../../types/database';
import { format } from 'date-fns';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PaymentSheet from '../../components/events/PaymentSheet';

type Event = Database['public']['Tables']['events']['Row'];
type RSVP = Database['public']['Tables']['event_rsvps']['Row'];

type Props = NativeStackScreenProps<any, 'EventDetail'>;

export default function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvp, setRsvp] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch user's RSVP if exists
      if (user) {
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setRsvp(rsvpData);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status: 'interested' | 'attending_confirmed') => {
    if (!user || !event) return;

    // Check if paid event and user wants to attend
    if (event.price_eur > 0 && status === 'attending_confirmed') {
      // Create pending RSVP first
      await createOrUpdateRSVP('attending_pending_payment');
      // Show payment sheet
      setShowPaymentSheet(true);
      return;
    }

    createOrUpdateRSVP(status);
  };

  const createOrUpdateRSVP = async (status: 'interested' | 'attending_confirmed' | 'attending_pending_payment') => {
    if (!user) return;

    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
          requires_payment: event!.price_eur > 0,
          payment_completed: event!.price_eur === 0 || status === 'attending_confirmed',
        })
        .select()
        .single();

      if (error) throw error;

      setRsvp(data);

      // If attending confirmed, trigger friend notification (would use Edge Function)
      if (status === 'attending_confirmed') {
        // TODO: Call Edge Function to notify friends
        Alert.alert(
          'Success!',
          'You are confirmed for this event!'
        );
      } else if (status === 'interested') {
        Alert.alert('Success!', 'You are now interested in this event!');
      }

      // Refresh event to update counts
      fetchEventDetails();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh event details to show updated RSVP status
    fetchEventDetails();
  };

  const cancelRSVP = async () => {
    if (!user || !rsvp) return;

    Alert.alert(
      'Cancel RSVP',
      'Are you sure you want to cancel your RSVP?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              const { error } = await supabase
                .from('event_rsvps')
                .delete()
                .eq('id', rsvp.id);

              if (error) throw error;

              setRsvp(null);
              Alert.alert('RSVP Cancelled', 'Your RSVP has been cancelled.');
              fetchEventDetails();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setActionLoading(false);
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

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const isPaidEvent = event.price_eur > 0;
  const isInterested = rsvp?.status === 'interested';
  const isAttending = rsvp?.status === 'attending_confirmed';
  const isPendingPayment = rsvp?.status === 'attending_pending_payment';

  return (
    <ScrollView style={styles.container}>
      {/* Event Image */}
      {event.cover_image_url && (
        <Image
          source={{ uri: event.cover_image_url }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      {/* Event Info */}
      <View style={styles.content}>
        {/* Price Badge */}
        {isPaidEvent ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>€{event.price_eur.toFixed(2)}</Text>
          </View>
        ) : (
          <View style={[styles.priceBadge, styles.freeBadge]}>
            <Text style={[styles.priceText, styles.freeText]}>FREE</Text>
          </View>
        )}

        {/* Category */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category.replace('_', ' ')}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{event.title}</Text>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.infoText}>
            {format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>🕐</Text>
          <Text style={styles.infoText}>
            {format(new Date(event.start_time), 'h:mm a')} -{' '}
            {format(new Date(event.end_time), 'h:mm a')}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoText}>{event.location_name}</Text>
            {event.location_address && (
              <Text style={styles.infoSubtext}>{event.location_address}</Text>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* RSVP Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{event.rsvp_attending_count}</Text>
            <Text style={styles.statLabel}>Attending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{event.rsvp_interested_count}</Text>
            <Text style={styles.statLabel}>Interested</Text>
          </View>
          {event.capacity && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{event.capacity}</Text>
                <Text style={styles.statLabel}>Capacity</Text>
              </View>
            </>
          )}
        </View>

        {/* Current RSVP Status */}
        {rsvp && (
          <View style={styles.statusContainer}>
            {isInterested && (
              <Text style={styles.statusText}>⭐ You are interested in this event</Text>
            )}
            {isAttending && (
              <Text style={[styles.statusText, styles.statusConfirmed]}>
                ✓ You are attending this event
              </Text>
            )}
            {isPendingPayment && (
              <Text style={[styles.statusText, styles.statusPending]}>
                ⏳ Payment pending - Complete payment to confirm
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!rsvp ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.interestedButton]}
                onPress={() => handleRSVP('interested')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <Text style={styles.interestedButtonText}>⭐ Interested</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.attendButton]}
                onPress={() => handleRSVP('attending_confirmed')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.attendButtonText}>
                    ✓ {isPaidEvent ? 'Buy Ticket' : 'Attend'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {isInterested && (
                <TouchableOpacity
                  style={[styles.button, styles.attendButton]}
                  onPress={() => handleRSVP('attending_confirmed')}
                  disabled={actionLoading}
                >
                  <Text style={styles.attendButtonText}>
                    Upgrade to {isPaidEvent ? 'Buy Ticket' : 'Attend'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelRSVP}
                disabled={actionLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel RSVP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Payment Sheet */}
      {event && user && (
        <PaymentSheet
          visible={showPaymentSheet}
          event={event}
          userId={user.id}
          onClose={() => setShowPaymentSheet(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
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
  coverImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  priceBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  freeBadge: {
    backgroundColor: '#34C759',
  },
  priceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  freeText: {
    color: '#fff',
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
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
    backgroundColor: '#ddd',
  },
  statusContainer: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  statusConfirmed: {
    color: '#34C759',
  },
  statusPending: {
    color: '#FF9500',
  },
  actions: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  interestedButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  interestedButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  attendButton: {
    backgroundColor: '#007AFF',
  },
  attendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});
