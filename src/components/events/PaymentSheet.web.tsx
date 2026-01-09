import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Database } from '../../types/database';

type Event = Database['public']['Tables']['events']['Row'];

interface PaymentSheetProps {
  visible: boolean;
  event: Event;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentSheet({ visible, event, userId, onClose, onSuccess }: PaymentSheetProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!event.price_eur) {
      Alert.alert('Error', 'Event price not set');
      return;
    }

    Alert.alert(
      'Web Payment',
      'Stripe payments are not available on web yet. Please use the mobile app to complete payments.\n\nFor development, this shows the payment UI flow.',
      [
        { text: 'Cancel', onPress: onClose, style: 'cancel' },
        {
          text: 'Simulate Payment',
          onPress: () => {
            Alert.alert(
              'Payment Simulated! 🎉',
              'In production, use the mobile app for real payments.',
              [{ text: 'OK', onPress: onClose }]
            );
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Complete Payment</Text>
          
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>
              {new Date(event.start_time).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.priceAmount}>€{event.price_eur?.toFixed(2)}</Text>
          </View>

          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              💳 Use the mobile app for secure payments
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payButton, styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            <Text style={styles.payButtonText}>Pay with Mobile App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.secureText}>🔒 Secure payment powered by Stripe</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  webNotice: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  webNoticeText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonDisabled: {
    backgroundColor: '#999',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  secureText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});
