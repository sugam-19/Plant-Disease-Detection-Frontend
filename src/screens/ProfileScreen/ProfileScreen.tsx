import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Toast from "react-native-toast-message";
import { AuthContext } from "../../components/context/AuthContext";
import axios from "axios";
import { APP_URL } from '@env';

const ProfileScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [decodedToken, setDecodedToken] = React.useState<any>(null);
  const [userDetails, setUserDetails] = React.useState<any>()
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded: any = jwtDecode(token);
          setDecodedToken(decoded);
          fetchUserDetails(decoded.id);
        }
      } catch (error) {
        console.error("Failed to fetch token from storage", error);
      }
    };
    fetchToken();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    setLoading(true); 
    try {
      const response = await axios.get(`${APP_URL}/api/auth/user-details/${userId}`);
      const userDetails = response.data;
      setUserDetails(userDetails)
      if (userDetails) {
        setFirstName(userDetails.first_name || "");
        setLastName(userDetails.last_name || "");
        setPhone(userDetails.phone || "");
        setCountry(userDetails.country || "");
        setCity(userDetails.city || "");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
        setLoading(false)
    }
  };

  const { logout } = React.useContext(AuthContext)

  const addUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${APP_URL}/api/auth/user-details`, {
        id: decodedToken?.id,
        firstName,
        lastName,
        phone,
        country,
        city,
      });
      fetchUserDetails(decodedToken?.id);
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your details have been updated successfully!',
      });
      console.log(response.data);
    } catch (error: any) {
      console.error("Error adding user details:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.errors || 'An error occurred!',
      });
    } finally {
        setLoading(false); 
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              // bs.current.snapTo(0);
            }}
          >
            <View style={styles.profileImageContainer}>
              <ImageBackground
                source={require("../../assets/images/profile.png")}
                style={styles.profileImage}
                imageStyle={{ borderRadius: 15 }}
              ></ImageBackground>
            </View>
          </TouchableOpacity>
          {
            userDetails ? 
            <Text style={styles.profileText}>{firstName} {lastName}</Text>
            :
            <Text style={styles.profileText}>Complete your profile</Text>
        }
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#009387" style={styles.loadingIndicator} />
        ) : (
        <>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#05375a" />
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            value={firstName}
            onChangeText={(val) => setFirstName(val)}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#05375a" />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            value={lastName}
            onChangeText={(val) => setLastName(val)}
          />
        </View>

        <View style={styles.action}>
          <Feather name="phone" size={20} color="#05375a" />
          <TextInput
            placeholder="Phone"
            keyboardType="number-pad"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            value={phone}
            onChangeText={(val) => setPhone(val)}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="globe" size={20} color="#05375a" />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            value={country}
            onChangeText={(val) => setCountry(val)}
          />
        </View>

        <View style={styles.action}>
          <Icon name="map-marker-outline" size={20} color="#05375a" />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            value={city}
            onChangeText={(val) => setCity(val)}
          />
        </View>

        <TouchableOpacity style={styles.commandButton}>
          <Text style={styles.panelButtonTitle} onPress={addUserDetails}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandButton} onPress={() => {
            logout()
        }}>
          <Text style={styles.panelButtonTitle}>Logout</Text>
        </TouchableOpacity>
    </>
    )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
    // paddingBottom: 30,
  },
  profileImageContainer: {
    height: 100,
    width: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 100,
    width: 100,
  },
  profileText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: '#333',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#009387",
    alignItems: "center",
    marginTop: 10,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#c4c4c4",
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 16,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ProfileScreen;
