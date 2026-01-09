import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../lib/hooks/useAuth';
import { format } from 'date-fns';

interface EventRSVP {
  id: string;
  event_id: string;
  status: string;
  events: {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    location_name: string;
    price_eur: number;
  };
}

export default function CalendarScreen() {
  const { user } = useAuth();
  const [attendingEvents, setAttendingEvents] = useState<EventRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendingEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          event_id,
          status,
          events (
            id,
            title,
            start_time,
            end_time,
            location_name,
            price_eur
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'attending_confirmed')
        .order('events(start_time)', { ascending: true });

      if (error) throw error;
      setAttendingEvents((data || []) as EventRSVP[]);
    } catch (error) {
      console.error('Error fetching attending events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendingEvents();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendingEvents();
  };

  const renderEvent = ({ item }: { item: EventRSVP }) => {
    if (!item.events) return null;

    const event = item.events;
    const eventDate = new Date(event.start_time);
    const isPast = eventDate < new Date();

    return (
      <TouchableOpacity
        style={[styles.eventCard, isPast && styles.pastEventCard]}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateMonth}>{format(eventDate, 'MMM')}</Text>
          <Text style={styles.dateDay}>{format(eventDate, 'd')}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, isPast && styles.pastEventText]}>
            {event.title}
          </Text>
          <Text style={styles.eventTime}>
            {format(eventDate, 'h:mm a')} · {event.location_name}
          </Text>
          {event.price_eur > 0 && (
            <Text style={styles.eventPrice}>€{event.price_eur.toFixed(2)}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.reminderButton}>
          <Text style={styles.reminderButtonText}>🔔</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={attendingEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming events</Text>
            <Text style={styles.emptySubtext}>
              RSVP to events to see them here!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pastEventCard: {
    opacity: 0.6,
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateMonth: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  pastEventText: {
    color: '#999',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  reminderButton: {
    padding: 8,
  },
  reminderButtonText: {
    fontSize: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
