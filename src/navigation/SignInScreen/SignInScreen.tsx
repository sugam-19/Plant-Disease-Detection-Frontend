import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import * as Animateable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { AuthContext } from "../../components/context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import Toast from 'react-native-toast-message';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_URL } from '@env';

const SignInScreen = ({ navigation }: any) => {
  const [data, setData] = React.useState({
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { setIsAuthenticated } = React.useContext(AuthContext);

  const handleLogin = async () => {
    const inputData = {
      email: username,
      password: password,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${APP_URL}/api/auth/login`, inputData);

      if (!username || !password) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all fields.',
        });
        return;
      }

      if (response.data && response.data.errors) {
        if (response.data.errors.email) {
          Toast.show({
            text1: 'Login Error',
            text2: response.data.errors.email,
            type: 'error',
          });
        } else {
          Toast.show({
            text1: 'Registration Error',
            text2: 'An unexpected error occurred.',
            type: 'error',
          });
        }
      } else {
        // await AsyncStorage.setItem("userId", response.data.id);
        await AsyncStorage.setItem("userToken", response.data.accessToken);
        setIsAuthenticated(true);
        Toast.show({
          text1: 'Log In Successful',
          type: 'success',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid Credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animateable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="05375a" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            // value={username}
            // setValue={setUsername}
            autoCapitalize="none"
            value={username}
            onChangeText={(val) => setUsername(val)}
          />
          {data.check_textInputChange ? (
            <Animateable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animateable.View>
          ) : null}
        </View>
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
        <View style={styles.action}>
          <FontAwesome name="lock" color="05375a" size={20} />
          <TextInput
            secureTextEntry={data.secureTextEntry ? true : false}
            placeholder="Your Password"
            style={styles.textInput}
            autoCapitalize="none"
            value={password}
            onChangeText={(val) => setPassword(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={handleLogin}
          >
            <Text
              style={[
                styles.textSign,
                { fontSize: 18 },
                { fontWeight: "bold" },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign up */}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.commandButton1}
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            <Text
              style={[
                styles.textSign,
                { fontSize: 18 },
                { fontWeight: "bold" },
                { color: "#009387" },
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
          <Text style={styles.forgotPassword}>Forgot Password? Want to reset? </Text>
        </TouchableOpacity>
      </Animateable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 10,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: "auto",
    alignItems: "center",
    fontSize: 15,
  },
  commandButton: {
    padding: 10,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#009387",
  },
  commandButton1: {
    padding: 10,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "#009387",
    borderWidth: 2,
  },
  forgotPassword: {
    fontSize: 15,
    paddingTop: 10,
    opacity: 0.5,
    color: "#4775d1",
  },
  commandButtonFacebook: {
    backgroundColor: "#E7EAF4",
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  commandButtonGoogle: {
    backgroundColor: "#FAE9EA",
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});