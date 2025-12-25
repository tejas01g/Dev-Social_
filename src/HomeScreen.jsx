import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sample user data
  const user = {
    name: "Tejasvi",
    username: "@tejasvi",
    bio: "React Native Developer | Building Dev Social",
    followers: 245,
    following: 156,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  };

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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      hasImage: false,
    },
  ];

  // Function to open image in full screen
  const openFullScreenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
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
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📌</Text>
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>📱 Dev Social</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Search')}>
              <Text style={styles.icon}>🔍</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerIcon} onPress={() => alert("Notifications")}>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
              <Text style={styles.icon}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.profileAvatar}
              />
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileUsername}>{user.username}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.profileBio}>{user.bio}</Text>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>6</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>
          </View>

          {/* Create Post Button */}
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => navigation.navigate("AddPost")}
          >
            <View style={styles.createPostAvatar}>
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.createPostAvatarImage}
              />
            </View>
            <Text style={styles.createPostText}>What's on your mind, {user.name}?</Text>
            <View style={styles.createPostIcon}>
              <Text style={styles.photoIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          {/* Posts Feed */}
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>Latest Posts</Text>
            <TouchableOpacity>
              <Text style={styles.feedFilter}>Latest</Text>
            </TouchableOpacity>
          </View>

          {/* Posts List */}
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.postSeparator} />}
          />
        </ScrollView>
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
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
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#0EA5E9',
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
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  // Profile Card Styles
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#0EA5E9',
    fontWeight: '600',
    fontSize: 14,
  },
  profileBio: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  // Create Post Button
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  feedFilter: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  // Post Card Styles
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postSeparator: {
    height: 12,
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
    color: '#1E293B',
    marginBottom: 2,
  },
  usernameTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 13,
    color: '#64748B',
  },
  timeDot: {
    fontSize: 13,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },
  time: {
    fontSize: 13,
    color: '#94A3B8',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: '#64748B',
  },
  postContent: {
    fontSize: 15,
    color: '#334155',
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
    color: '#64748B',
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
  actionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
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
    top: 40,
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
    bottom: 40,
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