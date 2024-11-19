import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import * as Animateable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Spinner from "react-native-loading-spinner-overlay/lib";
import axios from "axios";
import Toast from 'react-native-toast-message';
import { APP_URL } from '@env';

const SignUpScreen = ({ navigation }: any) => {
  const [data, setData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const validatePassword = (password: any) => {
    const passwordRequirements = {
      minLength: 8,
      upperCase: /[A-Z]/,
      lowerCase: /[a-z]/,
      numbers: /[0-9]/,
      specialChars: /[!@#$%^&*(),.?":{}|<>]/,
    };
  
    if (password.length < passwordRequirements.minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!passwordRequirements.upperCase.test(password)) {
      return 'Password must include at least one uppercase letter.';
    }
    if (!passwordRequirements.lowerCase.test(password)) {
      return 'Password must include at least one lowercase letter.';
    }
    if (!passwordRequirements.numbers.test(password)) {
      return 'Password must include at least one number.';
    }
    if (!passwordRequirements.specialChars.test(password)) {
      return 'Password must include at least one special character.';
    }
  
    return null; // No errors
  };

  const handleRegister = async () => {
    const { email, password, confirm_password, username } = data;

    if (!email || !password || !confirm_password || !username) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields.',
      });
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      Toast.show({
        text1: 'Password Validation Error',
        text2: passwordError,
        type: 'error',
      });
      return;
    }

    if (password !== confirm_password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.',
      });
      return;
    }

    setIsLoading(true);
    
    const inputData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post(`${APP_URL}/api/auth/register`, inputData);
      if (response.data && response.data.errors) {
        // Handle specific email error
        if (response.data.errors.email) {
          Toast.show({
            text1: 'Registration Error',
            text2: response.data.errors.email, // Display email error
            type: 'error',
          });
        } else {
          // Handle any other errors
          Toast.show({
            text1: 'Registration Error',
            text2: 'An unexpected error occurred.',
            type: 'error',
          });
        }
      } else {
        // Handle successful registration
        Toast.show({
          text1: 'Registration Successful',
          text2: 'You can now log in.',
          type: 'success',
        });
        navigation.navigate("SignInScreen")
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Spinner visible={isLoading} />
        <Text style={styles.text_header}>Register Now!</Text>
      </View>

      <Animateable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
        <Text style={[styles.text_footer, { marginTop: 10 }]}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="05375a" size={20} />
            <TextInput
              placeholder="Username"
              style={styles.textInput}
              value={data.username}
              autoCapitalize="none"
              onChangeText={(val) => setData({ ...data, username: val })}
            />
          </View>
          <Text style={[styles.text_footer, { marginTop: 10 }]}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="05375a" size={20} />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              value={data.email}
              autoCapitalize="none"
              onChangeText={(val) => setData({ ...data, email: val })}
            />
          </View>

          <Text style={[styles.text_footer, { marginTop: 10 }]}>Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="05375a" size={20} />
            <TextInput
              secureTextEntry={data.secureTextEntry}
              placeholder="Password"
              style={styles.textInput}
              autoCapitalize="none"
              value={data.password}
              onChangeText={(val) => setData({ ...data, password: val })}
            />
            <TouchableOpacity onPress={() => setData({ ...data, secureTextEntry: !data.secureTextEntry })}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={[styles.text_footer, { marginTop: 10 }]}>Confirm Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="05375a" size={20} />
            <TextInput
              secureTextEntry={data.confirm_secureTextEntry}
              placeholder="Confirm Password"
              style={styles.textInput}
              autoCapitalize="none"
              value={data.confirm_password}
              onChangeText={(val) => setData({ ...data, confirm_password: val })}
            />
            <TouchableOpacity onPress={() => setData({ ...data, confirm_secureTextEntry: !data.confirm_secureTextEntry })}>
              {data.confirm_secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.commandButton}
              onPress={handleRegister}
            >
              <Text style={[styles.textSign, { fontSize: 18, fontWeight: "bold" }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.commandButton1}
              onPress={() => navigation.navigate("SignInScreen")}
            >
              <Text style={[styles.textSign, { fontSize: 18, paddingBottom: 0, fontWeight: "bold", color: "#009387" }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animateable.View>
    </View>
  );
};

export default SignUpScreen;

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
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  commandButton: {
    padding: 10,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#009387",
  },
  commandButton1: {
    padding: 10,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#009387",
    borderWidth: 2,
    marginTop: -20,
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: 5,
    fontSize: 15,
  },
});
