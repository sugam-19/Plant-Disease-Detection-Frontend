import * as React from "react";
import { Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import ListItem from "./ListItem";

const RecentNews = () => {
  const [newsData, setNewsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=agriculture&apiKey=b06195a200594402a605eda0abb84574`
        );
        setNewsData(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView>
      <Text style={styles.listTitle}>Recent News</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={newsData}
        keyExtractor={(item: any) => item.url} // Use the URL as the unique key
        renderItem={({ item }) => {
          return (
            <ListItem
              name={item.title}
              time={new Date(item.publishedAt).toLocaleDateString()} // Format date as needed
              kcal={item.source.name} // Using source name as a substitute for kcal
              level="News" // Static text, replace as needed
              image={{ uri: item.urlToImage }} // Image from the API
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listTitle: {
    paddingHorizontal: 15,
    fontWeight: "bold",
    fontSize: 20,
    paddingVertical: 20,
  },
});

export default RecentNews;
