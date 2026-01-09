// Generated types from Supabase
// Run: supabase gen types typescript --linked > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          username: string
          full_name: string
          bio: string | null
          avatar_url: string
          hero_image_url: string | null
          status: 'active' | 'suspended' | 'banned'
          role: 'member' | 'admin'
          share_attendance_with_friends: boolean
          onboarding_completed: boolean
          last_seen_at: string | null
          events_attended_count: number
          friends_count: number
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name: string
          bio?: string | null
          avatar_url: string
          hero_image_url?: string | null
          status?: 'active' | 'suspended' | 'banned'
          role?: 'member' | 'admin'
          share_attendance_with_friends?: boolean
          onboarding_completed?: boolean
        }
        Update: {
          username?: string
          full_name?: string
          bio?: string | null
          avatar_url?: string
          hero_image_url?: string | null
          share_attendance_with_friends?: boolean
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          start_time: string
          end_time: string
          timezone: string
          location_name: string
          location_address: string | null
          price_eur: number
          currency: string
          capacity: number | null
          rsvp_interested_count: number
          rsvp_attending_count: number
          cover_image_url: string | null
          category: string
          tags: string[] | null
          published: boolean
          published_at: string | null
          status: string
          created_by: string
          average_rating: number | null
          ratings_count: number
        }
      }
      event_rsvps: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          event_id: string
          user_id: string
          status: 'interested' | 'attending_pending_payment' | 'attending_confirmed' | 'cancelled'
          requires_payment: boolean
          payment_completed: boolean
        }
        Insert: {
          event_id: string
          user_id: string
          status: 'interested' | 'attending_pending_payment' | 'attending_confirmed' | 'cancelled'
          requires_payment?: boolean
          payment_completed?: boolean
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          excerpt: string | null
          cover_image_url: string | null
          type: 'announcement' | 'offer' | 'event_promotion'
          event_id: string | null
          published: boolean
          published_at: string | null
          author_id: string
          pinned: boolean
        }
      }
      friend_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          requester_id: string
          recipient_id: string
          status: 'pending' | 'accepted' | 'declined' | 'cancelled'
          responded_at: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: string
          title: string
          message: string
          related_user_id: string | null
          related_event_id: string | null
          read: boolean
          read_at: string | null
          action_url: string | null
          action_label: string | null
        }
      }
    }
  }
}
