import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const DEFAULT_AVATAR =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';


const AddPostScreen = ({ navigation }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = auth().currentUser;

  // TEMP image (next step Firebase Storage)
  const handlePickImage = () => {
    setImage("https://images.unsplash.com/photo-1557682224-5b8590cd9ec5");
  };

  const handleRemoveImage = () => setImage(null);

  const handlePost = async () => {
    if (!text.trim() && !image) {
      Alert.alert("Post empty", "Write something or add an image");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    setLoading(true);

    try {
      // 🔥 Get user profile data
      const userDoc = await firestore()
        .collection("users")
        .doc(user.uid)
        .get();

      const userData = userDoc.data();

      // 🔥 Save post
     await firestore().collection("posts").add({
  userId: user.uid,

  // ✅ MUST MATCH HOME FEED
  userName: userData?.name || "Dev Social User",
  userUsername: userData?.username || "devsocial",
  userAvatar: userData?.avatar || DEFAULT_AVATAR,

  text: text.trim(),
  image: image || null,

  likes: 0,
  comments: 0,
  shares: 0,

  createdAt: firestore.FieldValue.serverTimestamp(),
});


      Alert.alert("Posted 🎉", "Your post is live!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Post</Text>

        <TouchableOpacity
          style={[
            styles.postBtn,
            (!text.trim() && !image) && { opacity: 0.5 },
          ]}
          onPress={handlePost}
          disabled={loading}
        >
          <Text style={styles.postText}>
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.body}>
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          multiline
          value={text}
          onChangeText={setText}
        />

        {image && (
          <View style={styles.imageBox}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={handleRemoveImage}
            >
              <Text style={{ color: "#fff" }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handlePickImage}>
          <Text style={styles.icon}>📷 Add Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },

  cancel: {
    color: "#9CA3AF",
  },

  title: {
    color: "#fff",
    fontWeight: "700",
  },

  postBtn: {
    backgroundColor: "#c81bd4ff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  postText: {
    color: "#fff",
    fontWeight: "600",
  },

  body: {
    flex: 1,
    padding: 16,
  },

  input: {
    color: "#fff",
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },

  imageBox: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 220,
  },

  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    padding: 12,
  },

  icon: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});
