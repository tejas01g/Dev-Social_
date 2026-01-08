import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

const DEFAULT_AVATAR =
  'https://i.pravatar.cc/150?img=12';

const SearchScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL USERS (REAL-TIME) ================= */
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .orderBy('name')
      .onSnapshot(snapshot => {
        if (!snapshot) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(list);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  /* ================= USER CARD ================= */
 const renderUser = ({ item }) => (
  <TouchableOpacity
    style={styles.userCard}
    onPress={() =>
      navigation.navigate('UserProfile', {
        userId: item.id,
      })
    }
  >
    <Image
      source={{ uri: item.avatar || DEFAULT_AVATAR }}
      style={styles.avatar}
    />

    <View style={styles.userInfo}>
      <Text style={styles.name}>{item.name || 'User'}</Text>
      <Text style={styles.username}>
        @{item.username || 'username'}
      </Text>
    </View>
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Search Users</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading users...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.loadingText}>
              No users found
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#c81bd4ff',
    marginVertical: 16,
  },

  loadingText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1c1c1cff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c81bd4ff',
    marginBottom: 10,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  userInfo: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },

  username: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
