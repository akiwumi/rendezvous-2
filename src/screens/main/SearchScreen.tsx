import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../lib/hooks/useAuth';
import { Database } from '../../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type FriendRequest = Database['public']['Tables']['friend_requests']['Row'];

type UserWithFriendship = Profile & {
  friendRequestStatus?: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  friendRequestId?: string;
};

export default function SearchScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithFriendship[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Search for users by name or username
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
        .limit(20);

      if (searchError) throw searchError;

      // Get friend requests to determine relationship status
      const { data: friendRequests, error: requestsError } = await supabase
        .from('friend_requests')
        .select('*')
        .or(
          `and(requester_id.eq.${user.id},recipient_id.in.(${profiles?.map((p) => p.id).join(',')})),` +
            `and(recipient_id.eq.${user.id},requester_id.in.(${profiles?.map((p) => p.id).join(',')}))`
        );

      if (requestsError) throw requestsError;

      // Enrich profiles with friendship status
      const enrichedProfiles: UserWithFriendship[] = (profiles || []).map((profile) => {
        const sentRequest = friendRequests?.find(
          (req) => req.requester_id === user.id && req.recipient_id === profile.id
        );
        const receivedRequest = friendRequests?.find(
          (req) => req.requester_id === profile.id && req.recipient_id === user.id
        );

        let friendRequestStatus: UserWithFriendship['friendRequestStatus'] = 'none';
        let friendRequestId: string | undefined;

        if (sentRequest) {
          friendRequestStatus =
            sentRequest.status === 'accepted' ? 'accepted' : 'pending_sent';
          friendRequestId = sentRequest.id;
        } else if (receivedRequest) {
          friendRequestStatus =
            receivedRequest.status === 'accepted' ? 'accepted' : 'pending_received';
          friendRequestId = receivedRequest.id;
        }

        return {
          ...profile,
          friendRequestStatus,
          friendRequestId,
        };
      });

      setUsers(enrichedProfiles);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (recipientId: string) => {
    setActionLoading(recipientId);
    try {
      const { error } = await supabase.from('friend_requests').insert({
        requester_id: user!.id,
        recipient_id: recipientId,
        status: 'pending',
      });

      if (error) throw error;

      // Create notification for recipient (would use Edge Function in production)
      await supabase.from('notifications').insert({
        user_id: recipientId,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${user?.email?.split('@')[0]} sent you a friend request`,
        related_user_id: user?.id,
      });

      Alert.alert('Success', 'Friend request sent!');
      searchUsers(); // Refresh list
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Create notification for requester (would use Edge Function in production)
      const userProfile = users.find((u) => u.friendRequestId === requestId);
      if (userProfile) {
        await supabase.from('notifications').insert({
          user_id: userProfile.id,
          type: 'friend_accepted',
          title: 'Friend Request Accepted',
          message: `${user?.email?.split('@')[0]} accepted your friend request`,
          related_user_id: user?.id,
        });
      }

      Alert.alert('Success', 'Friend request accepted!');
      searchUsers(); // Refresh list
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const renderActionButton = (userItem: UserWithFriendship) => {
    if (actionLoading === userItem.id || actionLoading === userItem.friendRequestId) {
      return (
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Loading...</Text>
        </View>
      );
    }

    switch (userItem.friendRequestStatus) {
      case 'accepted':
        return (
          <View style={styles.friendsBadge}>
            <Text style={styles.friendsBadgeText}>✓ Friends</Text>
          </View>
        );
      case 'pending_sent':
        return (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>Pending</Text>
          </View>
        );
      case 'pending_received':
        return (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => acceptFriendRequest(userItem.friendRequestId!)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => sendFriendRequest(userItem.id)}
          >
            <Text style={styles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>
        );
    }
  };

  const renderUser = ({ item }: { item: UserWithFriendship }) => {
    return (
      <View style={styles.userCard}>
        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.full_name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
        {renderActionButton(item)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Results */}
      {searchQuery.length < 2 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Search for friends</Text>
          <Text style={styles.emptySubtext}>
            Enter at least 2 characters to search
          </Text>
        </View>
      ) : loading ? (
        <View style={styles.emptyContainer}>
          <Text>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🤷</Text>
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  friendsBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#E8F5E9',
  },
  friendsBadgeText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFF3E0',
  },
  pendingBadgeText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
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
    paddingHorizontal: 40,
  },
});
