import * as React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

import Headers from "../../components/Header";
import RecentNews from "../../components/RecentNews";
import RecentActivities from "../../components/RecentActivities";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
// import Workouts from "../../components/Workouts";

const data = [
  {
    key: 1,
    name: "Water",
    time: "1",
    kcal: "0",
    quantity: "1ltrs",
    // image: require("../../assets/images/water.jpg"),
  },
  {
    key: 2,
    name: "Rice",
    time: "1",
    kcal: "272",
    quantity: "80g",
    // image: require("../../assets/images/rice.jpg"),
  },
  {
    key: 3,
    name: "Chicken Curry",
    time: "1",
    kcal: "110",
    quantity: "100g",
    // image: require("../../assets/images/chickencurry.jpg"),
  },
  {
    key: 4,
    name: "Green Vegitables",
    time: "1",
    kcal: "23",
    quantity: "100g",
    // image: require("../../assets/images/green.jpg"),
  },
];

const HomeScreen = () => {
  const [decodedToken, setDecodedToken] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded: any = jwtDecode(token);
          setDecodedToken(decoded);
        }
      } catch (error) {
        console.error("Failed to fetch token from storage", error);
      }
    };
    fetchToken();
  }, []);
  return (
    // <ScrollView>
    <SafeAreaView style={styles.screen}>
      <Headers data={decodedToken} />
      {/* <Text style={styles.tokenInfo}>Token Info: {JSON.stringify(decodedToken)}</Text> */}
      <RecentNews />
      <RecentActivities />
    </SafeAreaView>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tokenInfo: {
    fontSize: 16,
    padding: 10,
    color: "#333",
  },
});

export default HomeScreen;