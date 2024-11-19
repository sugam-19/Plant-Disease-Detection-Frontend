import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import moment from 'moment'; // For date and time formatting
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icons using react-native-vector-icons

const Headers = (data: any) => {
  // Get current day and time using moment.js (or use native Date if you prefer)
  const currentDate = moment().format('dddd, MMMM Do YYYY, h:mm A');
  console.log("data", data)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        {/* <Image 
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxb5moEN8e2TeiT2Ls5FtbLtZ5HnWkD1gr1Q&scom" }} 
          style={styles.profilePicture} 
        /> */}
        <Text style={styles.greetingText}>Hello, {data?.data?.username}!</Text>

        <Text style={styles.dateTimeText}>{currentDate}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#1fa35a",
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20
  },
  profileSection: {
    alignItems: "flex-start", 
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 40, 
    marginBottom: 10,
    borderColor: "#000000"
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Headers;
