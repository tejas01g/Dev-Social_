import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CommentModal = ({ visible, postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(list);
      });

    return unsubscribe;
  }, [postId]);

  const sendComment = async () => {
    if (!text.trim()) return;

    const user = auth().currentUser;
    const userDoc = await firestore()
      .collection('users')
      .doc(user.uid)
      .get();

    const userData = userDoc.data();

    const postRef = firestore().collection('posts').doc(postId);

    await postRef.collection('comments').add({
      text: text.trim(),
      userId: user.uid,
      userName: userData?.name || 'User',
      userAvatar:
        userData?.avatar ||
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    await postRef.update({
      comments: firestore.FieldValue.increment(1),
    });

    setText('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Comments */}
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Text style={styles.name}>{item.userName}</Text>
                <Text style={styles.comment}>{item.text}</Text>
              </View>
            )}
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Add a comment..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
            <TouchableOpacity onPress={sendComment}>
              <Text style={styles.send}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    height: '70%',
    backgroundColor: '#111',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  close: {
    color: '#fff',
    fontSize: 18,
  },
  commentRow: {
    padding: 12,
  },
  name: {
    color: '#fff',
    fontWeight: '600',
  },
  comment: {
    color: '#ccc',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  send: {
    color: '#c81bd4ff',
    fontWeight: '600',
    marginLeft: 10,
  },
});
