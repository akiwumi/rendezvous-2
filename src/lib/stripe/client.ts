import { supabase } from '../supabase/client';

/**
 * Create a payment intent for event ticket purchase
 */
export async function createPaymentIntent(
  eventId: string,
  amount: number,
  currency: string = 'eur'
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    // Call Supabase Edge Function to create payment intent
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        eventId,
        amount,
        currency,
      },
    });

    if (error) throw error;

    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Confirm payment and create ticket
 */
export async function confirmPayment(
  paymentIntentId: string,
  eventId: string,
  userId: string
): Promise<void> {
  try {
    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        event_id: eventId,
        stripe_payment_intent_id: paymentIntentId,
        status: 'succeeded',
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Update RSVP to confirmed
    const { error: rsvpError } = await supabase
      .from('event_rsvps')
      .update({
        status: 'attending_confirmed',
        payment_id: payment.id,
      })
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (rsvpError) throw rsvpError;

    // Create ticket
    const { error: ticketError } = await supabase
      .from('tickets')
      .insert({
        user_id: userId,
        event_id: eventId,
        payment_id: payment.id,
        status: 'valid',
      });

    if (ticketError) throw ticketError;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

/**
 * Get user's tickets
 */
export async function getUserTickets(userId: string) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        event:event_id (*),
        payment:payment_id (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}
