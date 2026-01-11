import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { Modal, TextInput } from "react-native";

const { width } = Dimensions.get("window");

const thoughtCategories = ["💭 All Thoughts", "🌟 Motivation", "💡 Ideas", "📱 Tech", "🎯 Goals"];

// Thoughts Data
const dummyThoughts = [
  {
    id: 1,
    text: "Building Dev Social using React Native 🚀",
    category: "📱 Tech",
    time: "2h ago",
    likes: 42,
    comments: 8
  },
  {
    id: 2,
    text: "Exploring navigation & UI flow today.",
    category: "💡 Ideas",
    time: "4h ago",
    likes: 28,
    comments: 5
  },
  {
    id: 3,
    text: "Consistency > motivation.",
    category: "🌟 Motivation",
    time: "1d ago",
    likes: 156,
    comments: 23
  },
];

// Posts Data (with images)
const dummyPosts = [
  {
    id: 1,
    text: "My current coding setup! Clean desk, clean code.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    time: "1d ago",
    likes: 128,
    comments: 24,
    shares: 12
  },
  {
    id: 2,
    text: "Beautiful sunset from my home office today 🌅",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    time: "2d ago",
    likes: 203,
    comments: 45,
    shares: 22
  },
  {
    id: 3,
    text: "Just launched our new design system components!",
    image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&h=600&fit=crop",
    time: "3d ago",
    likes: 156,
    comments: 32,
    shares: 18
  },
];

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedThoughtCategory, setSelectedThoughtCategory] = useState("💭 All Thoughts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("thoughts"); // 'thoughts' or 'posts'
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser;
  const [editVisible, setEditVisible] = useState(false);
const [name, setName] = useState("");
const [username, setUsername] = useState("");
const [bio, setBio] = useState("");
const [editTechStack, setEditTechStack] = useState([]);
const [editHobbies, setEditHobbies] = useState([]);
const techStack = userData?.techStack || [];
const hobbies = userData?.hobbies || [];
const [myPosts, setMyPosts] = useState([]);
const [postsLoading, setPostsLoading] = useState(true);

const handleFollow = async targetUserId => {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  const myRef = firestore().collection("users").doc(currentUser.uid);
  const targetRef = firestore().collection("users").doc(targetUserId);

  const followingRef = myRef.collection("following").doc(targetUserId);
  const followerRef = targetRef.collection("followers").doc(currentUser.uid);

  const snap = await followingRef.get();

  if (snap.exists) {
    // UNFOLLOW
    await followingRef.delete();
    await followerRef.delete();

    await myRef.update({
      followingCount: firestore.FieldValue.increment(-1),
    });
    await targetRef.update({
      followersCount: firestore.FieldValue.increment(-1),
    });
  } else {
    // FOLLOW
    await followingRef.set({
      userId: targetUserId,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    await followerRef.set({
      userId: currentUser.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    await myRef.update({
      followingCount: firestore.FieldValue.increment(1),
    });
    await targetRef.update({
      followersCount: firestore.FieldValue.increment(1),
    });
  }
};


useEffect(() => {
  if (!user) return;

  const unsubscribeCounts = firestore()
    .collection("users")
    .doc(user.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        setUserData(prev => ({
          ...prev,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
        }));
      }
    });

  return unsubscribeCounts;
}, [user?.uid]);



useEffect(() => {
  if (!user) return;

  // USER DATA
  const unsubscribeUser = firestore()
    .collection("users")
    .doc(user.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        setUserData(data);
        setName(data.name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
      }
    });

  // USER POSTS (REAL-TIME)
const unsubscribePosts = firestore()
  .collection("posts")
  .where("userId", "==", user.uid)
  .orderBy("createdAt", "desc")
  .onSnapshot(
    snapshot => {
      if (!snapshot) {
        setMyPosts([]);
        setPostsLoading(false);
        return;
      }

      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyPosts(posts);
      setPostsLoading(false);
    },
    error => {
      console.log("Posts snapshot error:", error);
      setPostsLoading(false);
    }
  );


  // CLEANUP
  return () => {
    unsubscribeUser();
    unsubscribePosts();
  };
}, []);



  const handleLogout = async () => {
    await auth().signOut();
  };


  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filteredThoughts = selectedThoughtCategory === "💭 All Thoughts"
    ? dummyThoughts
    : dummyThoughts.filter(thought => thought.category === selectedThoughtCategory);

  const renderThoughtItem = ({ item }) => (
    <View style={styles.thoughtCard}>
      <View style={styles.thoughtHeader}>
        <Text style={styles.thoughtCategory}>{item.category}</Text>
        <Text style={styles.thoughtTime}>{item.time}</Text>
      </View>
      <Text style={styles.thoughtText}>{item.text}</Text>
      <View style={styles.thoughtStats}>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statCount}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statCount}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statIcon}>🔗</Text>
          <Text style={styles.statCount}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

 const renderPostItem = ({ item }) => (
  <View style={styles.postCard}>
    {/* Header */}
    <View style={styles.postHeader}>
      <Text style={styles.postTime}>
        {item.createdAt?.toDate
          ? new Date(item.createdAt.toDate()).toLocaleDateString()
          : "Just now"}
      </Text>

      <TouchableOpacity style={styles.postMoreButton}>
        <Text style={styles.moreIcon}>⋯</Text>
      </TouchableOpacity>
    </View>

    {/* Text */}
    <Text style={styles.postText}>{item.text}</Text>

    {/* Image (ONLY if exists) */}
    {item.image ? (
      <Image
        source={{ uri: item.image }}
        style={styles.postImage}
        resizeMode="cover"
      />
    ) : null}

    {/* Stats */}
    <View style={styles.postStats}>
      <TouchableOpacity style={styles.statButton}>
        <Text style={styles.statIcon}>❤️</Text>
        <Text style={styles.statCount}>{item.likes || 0}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statButton}>
        <Text style={styles.statIcon}>💬</Text>
        <Text style={styles.statCount}>{item.comments || 0}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statButton}>
        <Text style={styles.statIcon}>🔗</Text>
        <Text style={styles.statCount}>Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0EA5E9"]}
            tintColor="#0EA5E9"
            progressBackgroundColor="#131927"
          />
        }
      >

        {/* Header with Profile Info */}
        <View style={styles.header}>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userData?.name || "Loading..."}</Text>
          <Text style={styles.username}> @{userData?.username || "user"}</Text>

          <Text style={styles.bio}>
            {userData?.bio|| "Add your bio"}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{myPosts.length + dummyPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dummyThoughts.length}</Text>
              <Text style={styles.statLabel}>Thoughts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dummyPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userData?.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
             <View style={styles.stat}>
    <Text style={styles.statNumber}>
      {userData?.followingCount || 0}
    </Text>
    <Text style={styles.statLabel}>Following</Text>
  </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
      <TouchableOpacity
  style={styles.editBtn}
  onPress={() => {
    setEditTechStack(userData?.techStack || []);
    setEditHobbies(userData?.hobbies || []);
    setEditVisible(true);
  }}
>
  <Text style={styles.editText}>Edit Profile</Text>
</TouchableOpacity>

            <TouchableOpacity style={styles.messageBtn}>
              <Text style={styles.messageText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreIcon}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tech Stack Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tech Stack</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScrollView}
          >
            {techStack.map((tech, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{tech}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Hobbies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScrollView}
          >
            {hobbies.map((hobby, index) => (
              <View key={index} style={styles.hobbyChip}>
                <Text style={styles.hobbyText}>{hobby}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "thoughts" && styles.activeTab]}
            onPress={() => setActiveTab("thoughts")}
          >
            <Text style={[styles.tabText, activeTab === "thoughts" && styles.activeTabText]}>
              💭 Thoughts ({dummyThoughts.length})
            </Text>
            {activeTab === "thoughts" && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>
              📸 Posts ({myPosts.length})
            </Text>
            {activeTab === "posts" && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Thoughts Section - Only shown when activeTab is 'thoughts' */}
        {activeTab === "thoughts" && (
          <View style={styles.contentSection}>
            <View style={styles.contentHeader}>
              <Text style={styles.sectionTitle}>My Thoughts</Text>

              {/* Category Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollView}
              >
                {thoughtCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryChip,
                      selectedThoughtCategory === category && styles.selectedCategoryChip
                    ]}
                    onPress={() => setSelectedThoughtCategory(category)}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedThoughtCategory === category && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Thoughts List */}
            {filteredThoughts.length > 0 ? (
              <FlatList
                data={filteredThoughts}
                renderItem={renderThoughtItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.contentList}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>💭</Text>
                <Text style={styles.emptyStateText}>
                  No thoughts in this category yet
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Posts Section - Only shown when activeTab is 'posts' */}
     {activeTab === "posts" && (
  <View style={styles.contentSection}>
    <View style={styles.contentHeader}>
      <Text style={styles.sectionTitle}>My Posts</Text>
      <Text style={styles.contentCount}>
        {myPosts.length} posts
      </Text>
    </View>

    {postsLoading ? (
      <Text style={{ color: "#9CA3AF", textAlign: "center" }}>
        Loading posts...
      </Text>
    ) : myPosts.length === 0 ? (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>📸</Text>
        <Text style={styles.emptyStateText}>
          You haven’t posted anything yet
        </Text>
      </View>
    ) : (
      <FlatList
        data={myPosts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.contentList}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    )}
  </View>
)}


        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

 <Modal visible={editVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>

      <Text style={styles.modalTitle}>Edit Profile</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Username"
        placeholderTextColor="#9CA3AF"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Bio"
        placeholderTextColor="#9CA3AF"
        value={bio}
        onChangeText={setBio}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      {/* Tech Stack */}
      <Text style={styles.modalSubTitle}>Tech Stack</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {editTechStack.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.editChip}
            onPress={() =>
              setEditTechStack(editTechStack.filter((_, i) => i !== index))
            }
          >
            <Text style={styles.editChipText}>{item} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Add tech & press enter"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        onSubmitEditing={(e) => {
          const value = e.nativeEvent.text.trim();
          if (value) {
            setEditTechStack([...editTechStack, value]);
          }
        }}
      />

      {/* Hobbies */}
      <Text style={styles.modalSubTitle}>Hobbies</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {editHobbies.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.editChip}
            onPress={() =>
              setEditHobbies(editHobbies.filter((_, i) => i !== index))
            }
          >
            <Text style={styles.editChipText}>{item} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Add hobby & press enter"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        onSubmitEditing={(e) => {
          const value = e.nativeEvent.text.trim();
          if (value) {
            setEditHobbies([...editHobbies, value]);
          }
        }}
      />

      {/* Buttons */}
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setEditVisible(false)}
        >
          <Text style={{ color: "#9CA3AF" }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={async () => {
            await firestore()
              .collection("users")
              .doc(user.uid)
              .update({
                name,
                username,
                bio,
                techStack: editTechStack,
                hobbies: editHobbies,
              });
            setEditVisible(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Save</Text>
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20, 
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#c81bd4ff",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#c81bd4ff",
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 3,
    // borderColor: "#c81bd4ff",
  },
  cameraIcon: {
    fontSize: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#131927",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: width - 40,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  editBtn: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: "#c81bd4ff",
    marginRight: 12,
  },
  followingBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#c81bd4ff",
  },
  editText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  followingText: {
    color: "#0EA5E9",
  },
  messageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    marginRight: 12,
  },
  messageText: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500",
  },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  moreIcon: {
    fontSize: 20,
    color: "#E5E7EB",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  seeAll: {
    fontSize: 14,
    color: "#c81bd4ff",
    fontWeight: "500",
  },
  chipsScrollView: {
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#131927",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#c81bd4ff",
  },
  chipText: {
    color: "#22D3EE",
    fontSize: 14,
    fontWeight: "500",
  },
  hobbyChip: {
    borderColor: "#c81bd4ff",
    borderWidth: 1,
    backgroundColor: "#1F2937",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  hobbyText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#131927",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    position: "relative",
  },
  activeTab: {
    backgroundColor: "#c81bd4ff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#fff",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -8,
    width: 24,
    height: 3,
    backgroundColor: "#c81bd4ff",
    borderRadius: 1.5,
  },
  contentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contentHeader: {
    marginBottom: 16,
  },
  contentCount: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  categoryScrollView: {
    flexDirection: "row",
    marginTop: 12,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#131927",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  selectedCategoryChip: {
    backgroundColor: "#c81bd4ff",
    borderColor: "#0EA5E9",
  },
  categoryText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  contentList: {
    paddingTop: 8,
  },
  itemSeparator: {
    height: 12,
  },
  thoughtCard: {
    backgroundColor: "#131927",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  thoughtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  thoughtCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22D3EE",
  },
  thoughtTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  thoughtText: {
    fontSize: 15,
    color: "#E5E7EB",
    lineHeight: 22,
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: "#131927",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  postMoreButton: {
    padding: 4,
  },
  postText: {
    fontSize: 15,
    color: "#E5E7EB",
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    marginBottom: 12,
  },
  thoughtStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingTop: 12,
  },
  postStats: {
    flexDirection: "row",
    paddingTop: 12,
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statCount: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 80,
  },

  logoutBtn: {
    position: "absolute",
    top: 10,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#c81bd4ff",
  },

  logoutText: {
    color: "#c81bd4ff",
    fontSize: 13,
    fontWeight: "600",
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},
modalBox: {
  width: "90%",
  backgroundColor: "#131927",
  borderRadius: 12,
  padding: 20,
},
modalTitle: {
  color: "#E5E7EB",
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 16,
},
input: {
  borderWidth: 1,
  borderColor: "#1F2937",
  borderRadius: 8,
  padding: 12,
  color: "#fff",
  marginBottom: 12,
},
cancelBtn: {
  flex: 1,
  padding: 12,
  alignItems: "center",
},
saveBtn: {
  flex: 1,
  padding: 12,
  alignItems: "center",
  backgroundColor: "#c81bd4ff",
  borderRadius: 8,
},

modalSubTitle: {
  color: "#9CA3AF",
  marginVertical: 8,
  fontSize: 14,
},

editChip: {
  backgroundColor: "#1F2937",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 16,
  marginRight: 8,
  marginBottom: 8,
},

editChipText: {
  color: "#E5E7EB",

  fontSize: 13,
},



});

export default ProfileScreen;