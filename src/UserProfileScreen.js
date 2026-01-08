import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=12';

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const currentUser = auth().currentUser;

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const isMyProfile = currentUser?.uid === userId;

  /* ================= FETCH USER + POSTS ================= */
  useEffect(() => {
    if (!userId) return;

    // 🔥 USER DATA
    const unsubscribeUser = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setUserData(doc.data());
        }
        setLoading(false);
      });

    // 🔥 USER POSTS (SAFE + GUARANTEED)
    const unsubscribePosts = firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (!snapshot || snapshot.empty) {
            setPosts([]);
            setPostsLoading(false);
            return;
          }

          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPosts(list);
          setPostsLoading(false);
        },
        error => {
          console.log('Post fetch error:', error);
          setPosts([]);
          setPostsLoading(false);
        },
      );

    return () => {
      unsubscribeUser();
      unsubscribePosts();
    };
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <Image
          source={{ uri: userData?.avatar || DEFAULT_AVATAR }}
          style={styles.avatar}
        />

        {/* Name */}
        <Text style={styles.name}>{userData?.name || 'User'}</Text>

        {/* Username */}
        <Text style={styles.username}>@{userData?.username || 'username'}</Text>

        {/* Bio */}
        {userData?.bio ? <Text style={styles.bio}>{userData.bio}</Text> : null}

        {/* Action Button */}
        {!isMyProfile && (
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Posts */}
        <Text style={styles.sectionTitle}>Posts ({posts.length})</Text>

        {postsLoading ? (
          <Text style={styles.loading}>Loading posts...</Text>
        ) : posts.length === 0 ? (
          <Text style={styles.emptyText}>No posts yet</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <Text style={styles.postText}>{item.text}</Text>

                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.postImage}
                  />
                )}

                <Text style={styles.postTime}>
                  {item.createdAt?.toDate
                    ? new Date(item.createdAt.toDate()).toLocaleString()
                    : 'Just now'}
                </Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 24,
    paddingHorizontal: 16,
  },

  loading: {
    color: '#9CA3AF',
    marginTop: 40,
    textAlign: 'center',
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#c81bd4ff',
    alignSelf: 'center',
    marginBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E5E7EB',
    textAlign: 'center',
  },

  username: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 10,
    textAlign: 'center',
  },

  bio: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  followBtn: {
    alignSelf: 'center',
    backgroundColor: '#c81bd4ff',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },

  followText: {
    color: '#fff',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: 12,
  },

  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },

  postCard: {
    backgroundColor: '#1c1c1cff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#c81bd4ff',
    marginBottom: 12,
  },

  postText: {
    color: '#E5E7EB',
    fontSize: 15,
    marginBottom: 8,
  },

  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },

  postTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
