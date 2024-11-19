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

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email.',
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post(`${APP_URL}/api/auth/forgot-password`, { email });
  
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message, // Show the message from the backend
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.message || 'Failed to send reset link. Please try again.',
        });
      }
    } catch (error: any) {
      console.error(error);
  
      // Check if the error is from a 404 (user not found)
      if (error.response && error.response.status === 404) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User not found. Please check your email.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Forgot Password</Text>
      </View>
      <Animateable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="envelope" color="#05375a" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
            value={email}
            onChangeText={(val) => setEmail(val)}
          />
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.commandButton} onPress={handlePasswordReset}>
            <Text style={styles.textSign}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.commandButton1} onPress={() => navigation.goBack()}>
            <Text style={[styles.textSign, { color: "#009387" }]}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animateable.View>
    </View>
  );
};

export default ForgotPasswordScreen;

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
    marginTop: 20,
  },
  textSign: {
    fontWeight: "bold",
    fontSize: 18,
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
  },
});
