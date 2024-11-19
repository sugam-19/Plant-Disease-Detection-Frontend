import React from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";

interface ListItemProps {
  name: string;
  time: string;
  kcal: string;
  level: string;
  image: { uri: string };
}

const InfoData = (props: { data: string; title: string; style?: any }) => (
  <View style={{ ...props.style, paddingHorizontal: 10 }}>
    <Text style={styles.infoData}>{props.data}</Text>
    <Text style={styles.infoTitle}>{props.title}</Text>
  </View>
);

const ListItem: React.FC<ListItemProps> = ({ name, time, kcal, level, image }) => (
  <SafeAreaView style={styles.item}>
    <ImageBackground
      resizeMode="cover"
      style={styles.image}
      source={image}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{name}</Text>
        <View style={styles.datas}>
          <InfoData data={time} title="Published" />
          <InfoData
            style={{
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "#999",
            }}
            data={kcal}
            title="Source"
          />
          <InfoData data={level} title="Category" />
        </View>
      </View>
    </ImageBackground>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  item: {
    width: 350,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15,
    marginRight: 5,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4f4f4",
    textAlign: "center",
    padding: 10,
    textTransform: "uppercase",
  },
  datas: {
    flexDirection: "row",
    justifyContent: "center",
  },
  infoData: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#f4f4f4",
  },
  infoTitle: {
    color: "#f4f4f4",
    textAlign: "center",
  },
});

export default ListItem;
