import React, { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const handleLike = async post => {
  const userId = auth().currentUser.uid;
  const postRef = firestore().collection('posts').doc(post.id);

  const alreadyLiked = post.likedBy?.includes(userId);

  await postRef.update({
    likes: firestore.FieldValue.increment(alreadyLiked ? -1 : 1),
    likedBy: alreadyLiked
      ? firestore.FieldValue.arrayRemove(userId)
      : firestore.FieldValue.arrayUnion(userId),
  });
};


const { width, height } = Dimensions.get('window');


const HomeScreen = ({ navigation }) => {
  const DEFAULT_AVATAR =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  /* ================= REAL-TIME GLOBAL POSTS ================= */
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(list);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const openFullScreenImage = url => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  /* ================= POST ITEM ================= */
  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      {/* Header */}
<View style={styles.postHeader}>
  <Image
    source={{
      uri:
        item.userAvatar ||
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    }}
    style={styles.avatarImage}
  />

  <View style={styles.userInfo}>
    <Text style={styles.userName}>
      {item.name || 'Dev Social User'}
    </Text>

    <Text style={styles.username}>
      @{item.username || 'devsocial'}
    </Text>

    <Text style={styles.time}>
      {item.createdAt?.toDate
        ? new Date(item.createdAt.toDate()).toLocaleString()
        : 'Just now'}
    </Text>
  </View>

  <TouchableOpacity>
    <Text style={styles.moreIcon}>⋯</Text>
  </TouchableOpacity>
</View>



      {/* Text */}
      <Text style={styles.postContent}>{item.text}</Text>

      {/* Image (optional) */}
      {item.image && (
        <TouchableOpacity
          style={styles.postImageContainer}
          onPress={() => openFullScreenImage(item.image)}
        >
          <Image source={{ uri: item.image }} style={styles.postImage} />
        </TouchableOpacity>
      )}

      {/* Stats */}
    <View style={styles.postActions}>
  {/* LIKE */}
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => handleLike(item)}
  >
    <Text style={styles.actionIcon}>❤️</Text>
    <Text style={styles.actionText}>{item.likes || 0}</Text>
  </TouchableOpacity>

  {/* COMMENT */}
  <TouchableOpacity style={styles.actionButton}>
    <Text style={styles.actionIcon}>💬</Text>
    <Text style={styles.actionText}>{item.comments || 0}</Text>
  </TouchableOpacity>

  {/* SHARE */}
  <TouchableOpacity style={styles.actionButton}>
    <Text style={styles.actionIcon}>🔗</Text>
    <Text style={styles.actionText}>{item.shares || 0}</Text>
  </TouchableOpacity>
</View>

    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Dev Social</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPostItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.createPostText}>What's on your mind?</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          loading ? (
            <Text style={styles.emptyText}>Loading feed...</Text>
          ) : (
            <Text style={styles.emptyText}>No posts yet 🚀</Text>
          )
        }
      />
      

      {/* Full Image Modal */}
      <Modal visible={modalVisible} transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// export default HomeScreen;

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
  postActions: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 8,
},

actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
},

actionIcon: {
  fontSize: 18,
  marginRight: 6,
},

actionText: {
  fontSize: 13,
  color: '#d8d8d8ff',
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
    backgroundColor: '#262525ff',
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
  timeText: {
  fontSize: 12,
  color: '#9CA3AF',
  marginTop: 2,
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