import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { Database } from '../../types/database';

type GalleryImage = Database['public']['Tables']['gallery_images']['Row'] & {
  event?: Database['public']['Tables']['events']['Row'];
};

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = (width - 48) / numColumns; // 16px padding on each side + 8px gaps

export default function GalleryScreen() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select(`
          *,
          event:event_id (*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages((data || []) as GalleryImage[]);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGallery();
  };

  const openImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderImage = ({ item }: { item: GalleryImage }) => {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => openImage(item)}
      >
        <Image
          source={{ uri: item.image_url }}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading gallery...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🖼️</Text>
            <Text style={styles.emptyText}>No images yet</Text>
            <Text style={styles.emptySubtext}>
              Check back soon for beautiful moments from our events!
            </Text>
          </View>
        }
      />

      {/* Image Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          >
            <ScrollView
              contentContainerStyle={styles.modalContent}
              maximumZoomScale={3}
              minimumZoomScale={1}
            >
              {selectedImage && (
                <>
                  <Image
                    source={{ uri: selectedImage.image_url }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                  <View style={styles.imageDetails}>
                    {selectedImage.caption && (
                      <Text style={styles.caption}>{selectedImage.caption}</Text>
                    )}
                    {selectedImage.event && (
                      <TouchableOpacity style={styles.eventLink}>
                        <Text style={styles.eventLinkText}>
                          From: {selectedImage.event.title}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {selectedImage.category && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {selectedImage.category}
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  imageContainer: {
    width: imageSize,
    height: imageSize,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: width,
  },
  imageDetails: {
    padding: 20,
    width: '100%',
  },
  caption: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  eventLink: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  eventLinkText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
});
