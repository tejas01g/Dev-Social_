import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sample posts with images
  const posts = [
    {
      id: '1',
      username: '@tejasvi',
      name: 'Tejasvi',
      time: '2h ago',
      content: '🚀 Just finished building this beautiful UI with React Native! The performance is incredible.',
      likes: 42,
      comments: 8,
      shares: 3,
      isLiked: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      hasImage: true,
    },
    {
      id: '2',
      username: '@react_dev',
      name: 'Sarah Chen',
      time: '4h ago',
      content: 'My current coding setup. Clean desk, clean code! What does your workspace look like?',
      likes: 128,
      comments: 24,
      shares: 12,
      isLiked: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
      hasImage: true,
    },
    {
      id: '3',
      username: '@native_guru',
      name: 'Alex Johnson',
      time: '1d ago',
      content: 'Working on a beautiful onboarding flow for our new app. React Native animations are getting better every day!',
      likes: 89,
      comments: 15,
      shares: 5,
      isLiked: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      hasImage: false,
    },
    {
      id: '4',
      username: '@ui_ux_pro',
      name: 'Maria Garcia',
      time: '2d ago',
      content: 'Just launched our new design system components! Check out these beautiful gradients.',
      likes: 156,
      comments: 32,
      shares: 18,
      isLiked: false,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&h=600&fit=crop',
      hasImage: true,
    },
    {
      id: '5',
      username: '@web_wizard',
      name: 'David Kim',
      time: '3d ago',
      content: 'Beautiful sunset from my home office today. Sometimes you need to appreciate the view while debugging!',
      likes: 203,
      comments: 45,
      shares: 22,
      isLiked: true,
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=200&h=200&fit=crop',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      hasImage: true,
    },
    {
      id: '6',
      username: '@code_master',
      name: 'Lisa Wang',
      time: '4d ago',
      content: 'Just finished this React Native tutorial series. Sharing my learning journey with all of you!',
      likes: 98,
      comments: 18,
      shares: 7,
      isLiked: false,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      hasImage: false,
    },
  ];

  // Function to open image in full screen
  const openFullScreenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Render each post item
  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      {/* Post Header with User Info */}
      <View style={styles.postHeader}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatarImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.usernameTime}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timeDot}>•</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* Post Image */}
      {item.hasImage && (
        <TouchableOpacity 
          style={styles.postImageContainer}
          activeOpacity={0.9}
          onPress={() => openFullScreenImage(item.image)}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.postImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.viewFullText}>Tap to view full image</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Post Stats */}
      <View style={styles.postStats}>
        <Text style={styles.statText}>{item.likes} likes</Text>
        <Text style={styles.statText}>{item.comments} comments</Text>
        <Text style={styles.statText}>{item.shares} shares</Text>
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            // Handle like functionality
            alert('Liked!');
          }}
        >
          <Text style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            // Handle comment functionality
            alert('Comments!');
          }}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            // Handle share functionality
            alert('Shared!');
          }}
        >
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            // Handle save functionality
            alert('Saved!');
          }}
        >
          <Text style={styles.actionIcon}>📌</Text>
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}> Dev Social</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerIcon} 
              onPress={() => navigation.navigate('Notifications')}
            >
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
              <Text style={styles.icon}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0EA5E9']}
              tintColor="#0EA5E9"
            />
          }
          ListHeaderComponent={
            <>
              {/* Create Post Button */}
              <TouchableOpacity
                style={styles.createPostButton}
                onPress={() => navigation.navigate('Add')}
              >
                <View style={styles.createPostAvatar}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }} 
                    style={styles.createPostAvatarImage}
                  />
                </View>
                <Text style={styles.createPostText}>What's on your mind?</Text>
                <View style={styles.createPostIcon}>
                  <Text style={styles.photoIcon}>📷</Text>
                </View>
              </TouchableOpacity>

              {/* Feed Header */}
              <View style={styles.feedHeader}>
                <Text style={styles.feedTitle}>Latest Posts</Text>
                <TouchableOpacity>
                  <Text style={styles.feedFilter}>Latest</Text>
                </TouchableOpacity>
              </View>
            </>
          }
          ListFooterComponent={
            <View style={styles.listFooter}>
              <Text style={styles.footerText}>You're all caught up! 🎉</Text>
            </View>
          }
        />
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
            
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => alert('Image saved!')}
            >
              <Text style={styles.saveButtonText}>⬇️ Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        paddingTop: 0, // SafeAreaView already handles top padding on iOS
      },
      android: {
        paddingTop: 8, // Extra padding for Android status bar
      },
    }),
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
    position: 'relative',
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#c81bd4ff',
  },
  icon: {
    fontSize: 22,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  // Create Post Button
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c81bd4ff',
    shadowColor: '#c81bd4ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  createPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  createPostAvatarImage: {
    width: '100%',
    height: '100%',
  },
  createPostText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
  },
  createPostIcon: {
    padding: 8,
  },
  photoIcon: {
    fontSize: 20,
  },
  // Feed Header
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  feedFilter: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  // Post Card Styles
  postCard: {
    borderWidth:1,
    borderColor:'#c81bd4ff',
    backgroundColor: '#1c1c1cff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#c81bd4ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  usernameTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 13,
    color: '#d8d8d8ff',
  },
  timeDot: {
    fontSize: 13,
    color: '#d8d8d8ff',
    marginHorizontal: 6,
  },
  time: {
    fontSize: 13,
    color: '#d8d8d8ff',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: '#d8d8d8ff',
  },
  postContent: {
    fontSize: 15,
    color: '#d8d8d8ff',
    lineHeight: 22,
    marginBottom: 12,
  },
  // Post Image Styles
  postImageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E2E8F0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    alignItems: 'center',
  },
  viewFullText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  postStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
    marginBottom: 10,
  },
  statText: {
    fontSize: 13,
    color: '#d8d8d8ff',
    marginRight: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  likedIcon: {
    color: '#EF4444',
  },
  actionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#d8d8d8ff',
    textAlign: 'center',
  },
  // Full Screen Image Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;