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
import Spinner from "react-native-loading-spinner-overlay/lib";
import Toast from 'react-native-toast-message';
import axios from "axios";
import { APP_URL } from '@env';

const ResetPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [emailExists, setEmailExists] = React.useState<boolean>(false);

  const checkIfEmailExists = async (email: string) => {
    try {
      const response = await axios.post(`${APP_URL}/api/auth/check-email`, { email });
      console.log("res", response);

      // Check if the email is found based on the response structure
      return response.data && response.data.user ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address.',
      });
      return;
    }

    setIsLoading(true);

    // Check if the email exists in the system
    const emailExists = await checkIfEmailExists(email);

    if (!emailExists) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email is not registered in the system.',
      });
      setIsLoading(false);
      return;
    }

    // If email exists, show new password input
    setEmailExists(true);
    setIsLoading(false);
  };

  const handleSetNewPassword = async () => {
    if (!newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a new password.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${APP_URL}/api/auth/set-new-password`, {
        email,
        newPassword,
      });
      console.log("res", response)

      if (response.data && response.data.message) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message,
        });
        navigation.navigate("SignInScreen");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to reset password. Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
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
        <Text style={styles.text_header}>{emailExists ? "Set New Password" : "Reset Password"}</Text>
      </View>
      <Animateable.View animation="fadeInUpBig" style={styles.footer}>
        {!emailExists ? (
          <>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="05375a" size={20} />
              <TextInput
                placeholder="Your Email"
                style={styles.textInput}
                autoCapitalize="none"
                value={email}
                onChangeText={(val) => setEmail(val)}
              />
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.commandButton}
                onPress={handleResetPassword}
              >
                <Text style={[styles.textSign, { fontSize: 18 }]}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.text_footer}>New Password</Text>
            <View style={styles.action}>
              <FontAwesome name="lock" color="05375a" size={20} />
              <TextInput
                placeholder="Enter New Password"
                style={styles.textInput}
                secureTextEntry
                autoCapitalize="none"
                value={newPassword}
                onChangeText={(val) => setNewPassword(val)}
              />
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.commandButton}
                onPress={handleSetNewPassword}
              >
                <Text style={[styles.textSign, { fontSize: 18 }]}>Set New Password</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.commandButton1}
            onPress={() => navigation.navigate("SignInScreen")}
          >
            <Text style={[styles.textSign, { fontSize: 18, color: "#009387" }]}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animateable.View>
    </View>
  );
};

export default ResetPasswordScreen;

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
    marginTop: 10,
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
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
});
