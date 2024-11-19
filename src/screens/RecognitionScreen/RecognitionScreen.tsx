import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { APP_URL } from '@env';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const { width, height } = Dimensions.get('window');

const RecognitionScreen = () => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false); // Image scanning effect
  const [error, setError] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState<boolean>(false); // Track if image is captured
  const [apiResponse, setApiResponse] = useState<any | null>(null); // Store API response
  const [diseaseName, setDiseaseName] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = React.useState<any>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const devices = useCameraDevice('back');
  const cameraRef = useRef<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const status = await Camera.requestCameraPermission();
        setCameraPermission(status === 'granted');
      } catch (err) {
        console.error('Permission request error:', err);
        setError('Failed to request camera permission');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded = jwtDecode(token);
          setDecodedToken(decoded);
        } else {
          console.log('Token not found');
          setError('Token not found');
        }
      } catch (error) {
        console.error("Failed to fetch token from storage", error);
        setError('Failed to fetch token');
      }
    };
  
    fetchToken();
  }, []); // Run this effect once when the component mounts 
  
  const handleViewResult = () => {
    if (apiResponse) {
      setIsModalVisible(true);
    } else {
      Alert.alert('No Result', 'Please capture or upload an image first.');
    }
  };
  

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async (response: any) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setCapturedImage(selectedImage);
        setIsCameraActive(false);
        setIsCaptured(true); 
        setIsScanning(true); 
        setError(null);
        const userId: any = decodedToken?.id 

        const formData = new FormData();
        formData.append('image', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'galleryImage.jpg',
        });
        formData.append('userId', userId);

        try {
          const res = await axios.post(`${APP_URL}/api/image/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const result = res.data?.result?.result;
          console.log("res", res.data);
          setApiResponse(res.data);
          setDiseaseName(result);
          setIsScanning(false); // End scanning effect
        } catch (error) {
          console.error('Error uploading image:', error);
          setIsScanning(false);
          Alert.alert('Error', 'Failed to upload image.');
        }
      }
    });
  };

  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto();
        const imagePath = `file://${photo.path}`;
        setCapturedImage(imagePath);
        setIsCameraActive(false);
        setIsCaptured(true); // Image captured from camera
        setIsScanning(true); // Start scanning effect

        // const fetchToken = async () => {
        //   try {
        //     const token = await AsyncStorage.getItem('userToken');
        //     if (token) {
        //       const decoded: any = jwtDecode(token);
        //       setDecodedToken(decoded);
        //     }
        //   } catch (error) {
        //     console.error("Failed to fetch token from storage", error);
        //   }
        // };
        // fetchToken();

        const userId : any = decodedToken?.id 

        const formData = new FormData();
        formData.append('image', {
          uri: imagePath,
          type: 'image/jpeg',
          name: 'capturedImage.jpg',
        });
        formData.append('userId', userId); 

        const res = await axios.post(`${APP_URL}/api/image/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("res", res);
        const result = res.data?.result?.result;
        setApiResponse(res.data); // Store the response from API
        setDiseaseName(result);
        setIsScanning(false); // End scanning effect
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      setIsScanning(false);
      setError('Failed to capture photo');
    }
  };

  const handleRecapture = () => {
    setCapturedImage(null);
    setIsCaptured(false);
    setIsCameraActive(true); 
    setError(null);
  };

  if (cameraPermission === null) {
    return <Text style={styles.loadingText}>Requesting camera permission...</Text>;
  }

  if (cameraPermission === false) {
    return <Text style={styles.loadingText}>Camera permission is not granted.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Recognition</Text>
      </View>

<Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Disease Details</Text>

      {/* Display Image */}
      {apiResponse?.imageUrl && (
        <Image
          source={{ uri: apiResponse.imageUrl }}
          style={styles.diseaseImage}
          resizeMode="contain"
        />
      )}

      {/* Disease Details */}
      {apiResponse?.plantDetail ? (
        <>
          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Detected Disease: </Text>
            {apiResponse.plantDetail.name.replace(/_/g, ' ')}
          </Text>

          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Symptoms: </Text>
            {apiResponse.plantDetail.symptoms}
          </Text>

          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Cause: </Text>
            {apiResponse.plantDetail.cause}
          </Text>

          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Effect: </Text>
            {apiResponse.plantDetail.effect}
          </Text>

          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Prevention: </Text>
            {apiResponse.plantDetail.prevention}
          </Text>

          {apiResponse?.result?.result && (
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>Result: </Text>
              {apiResponse.result.result.replace(/_/g, ' ')}
            </Text>
          )}
        </>
      ) : (
        <Text style={styles.modalText}>No details available</Text>
      )}

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIsModalVisible(false)}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isCameraActive && devices != null ? (
        <View style={styles.cameraContainer}>
          {devices ? (
            <Camera
              style={styles.camera}
              device={devices}
              ref={cameraRef}
              isActive={isCameraActive}
              photo={true}
              video={false} // Ensure video is not enabled if you just need photos
              audio={false} // Disable audio if you do not need it
            />
          ) : (
            <Text style={styles.loadingText}>Camera is not available.</Text>
          )}
        </View>
      ) : (
        <>
        <View style={styles.imagePreviewContainer}>
        {capturedImage && (
          <>
            <Image source={{ uri: capturedImage }} style={styles.capturedImagePreview} />
            {diseaseName && (
              <Text style={styles.diseaseNameText}>
                Detected Disease: {diseaseName.replace(/_/g, ' ')}
              </Text>
            )}
          </>
        )}
      </View>
      </>
      )}

      {isScanning && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.scanningText}>Scanning Image...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={isCaptured ? handleRecapture : handleCapture}
          disabled={isUploading}
        >
          {isUploading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.buttonText}>{isCaptured ? 'Recapture' : 'Capture'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.galleryButton} 
          onPress={handlePickImage} 
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>

        {/* Show the View Result button only if an image has been captured */}
        {isCaptured && (
          <TouchableOpacity 
            style={styles.viewResultButton} 
            onPress={handleViewResult}
          >
            <Text style={styles.buttonText}>View Result</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RecognitionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, backgroundColor: '#1fa35a' },
  backButton: { position: 'absolute', left: 10, top: 15 },
  pageTitle: { fontSize: 24, color: 'white', fontWeight: 'bold', textAlign: 'center', flex: 1 },
  cameraContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', margin: 0 },
  camera: { width: '100%', height: '100%' },
  imagePreviewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  capturedImagePreview: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 20 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  scanningText: { color: '#fff', fontSize: 20, marginTop: 10, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30, paddingBottom: 30 },
  captureButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginBottom: 15,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#48C9B0',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginBottom: 15,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewResultButton: {
    backgroundColor: '#1fa35a',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginTop: 15,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  loadingText: { textAlign: 'center', color: 'white', fontSize: 20 },
  errorContainer: { padding: 15, backgroundColor: '#e74c3c' },
  errorText: { color: 'white', fontSize: 16 },
  diseaseNameText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',  
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#1fa35a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  diseaseImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});

