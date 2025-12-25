import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Dev Social</Text>

        <TouchableOpacity onPress={() => alert("Notifications")}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Welcome Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome 👋</Text>
          <Text style={styles.cardText}>
            This is your home feed.  
            Tech posts, coding tips and updates will appear here.
          </Text>
        </View>

        {/* Dummy Post */}
        <View style={styles.post}>
          <Text style={styles.username}>@tejasvi</Text>
          <Text style={styles.postText}>
            🚀 Building Dev Social with React Native & Zustand!
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity>
              <Text style={styles.action}>❤️ Like</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.action}>💬 Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.action}>🔗 Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Post CTA */}
        <TouchableOpacity
          style={styles.addPost}
          onPress={() => navigation.navigate("AddPost")}
        >
          <Text style={styles.addPostText}>+ Create Post</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0EA5E9",
  },

  icon: {
    fontSize: 22,
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: "#555",
  },

  post: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  username: {
    fontWeight: "600",
    marginBottom: 6,
  },

  postText: {
    fontSize: 14,
    marginBottom: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  action: {
    fontSize: 14,
    color: "#0EA5E9",
  },

  addPost: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  addPostText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
