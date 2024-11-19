import React from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animateable from "react-native-animatable";

const SplashScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animateable.Image
          animation="bounceIn"
        //   duraton="1500"
          // source={require("../assets/images/app.png")}
        />
        <Text style={styles.logo1}>PDDS</Text>
      </View>
      <Animateable.View animation="fadeInUpBig" style={styles.footer}>
        <View>
          <Text style={styles.title}>Stay connected with everyone</Text>
          <Text style={styles.text}>Sign in with account</Text>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={(navigate) => navigation.navigate("SignInScreen")}
          >
            <Text style={styles.textSign}>Get Started</Text>
            <MaterialIcons name="navigate-next" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </Animateable.View>
    </View>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: 0,
    alignItems: "center",
    fontSize: 15,
  },
  commandButton: {
    padding: 15,
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
    backgroundColor: "#009387",
  },
  logo1: {
    fontSize: 64,
    fontWeight: "bold",
    color: "white",
    // fontFamily: "lucida grande, tahoma, verdana, arial, sans-serif",
  },
});