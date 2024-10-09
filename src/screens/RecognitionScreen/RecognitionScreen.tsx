import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigating back
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const RecognitionScreen = () => {
  const [cameraPermission, setCameraPermission] = useState<any>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const devices = useCameraDevice("back");
  const cameraRef: any = useRef(null);
  const navigation = useNavigation(); // For navigating back

  // Request camera permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status === "granted");
    })();
  }, []);

  if (cameraPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (cameraPermission === false) {
    return <Text>Camera permission is not granted.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Recognition</Text>
      </View>

      {/* Camera View with separated rounded corners and centered */}
      {devices != null ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={devices}
            ref={cameraRef}   
            isActive={true}
            photo={true}
          />
          {capturedImage && (
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          )}
        </View>
      ) : (
        <Text>No camera device available</Text>
      )}

      {/* Buttons for camera actions */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={async () => {
            if (cameraRef.current) {
              const photo = await cameraRef.current.takePhoto();
              const formData = new FormData();
              formData.append('image', {
                uri: photo.path,
                type: 'image/jpeg',
                name: 'capturedImage.jpg',
              });
              
              // Send the image to the backend
              const response = await axios.post('http:/localhost:3000/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            }
          }}
        >
          <Text style={styles.captureText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecognitionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1fa35a',
    height: 60,
    paddingTop: 15,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  pageTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    alignItems: "center",
  },
  cameraContainer: {
    width: 300, // Set width for the camera box
    height: 400, // Set height for the camera box
    borderRadius: 20, // Rounded corners
    borderWidth: 6, // Increase border width
    borderColor: 'gray', // Set border color to gray
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50, // Center vertically with margin
    alignSelf: 'center', // Center horizontally
    overflow: 'hidden', // Ensure the rounded corners don't join
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  capturedImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5, // Adjust opacity here
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureText: {
    fontSize: 16,
    color: '#000',
  },
});
