import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, FlatList, SafeAreaView, Modal, TouchableOpacity, Image } from "react-native";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_URL } from '@env';
import RecentDiagnozeItems from "./RecentDiagnozeItems";
import { useFocusEffect } from '@react-navigation/native';

const RecentActivities = () => {
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);

  const fetchTokenAndDiagnoses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded: any = jwtDecode(token);
        setDecodedToken(decoded);

        const userId = decoded?.id;
        const response = await fetch(`${APP_URL}/api/recent-diagonised/${userId}`);
        const data = await response.json();
        console.log("data", data);

        if (response.ok) {
          setDiagnoses(data);
        } else {
          setError("Failed to fetch recent diagnoses data.");
        }
      } else {
        setError("No token found.");
      }
    } catch (err: any) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenAndDiagnoses();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);  
      setError(null);    
      fetchTokenAndDiagnoses(); 
    }, [])
  );

  const openModal = (diagnosis: any) => {
    setSelectedDiagnosis(diagnosis);
    setIsModalVisible(true); 
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedDiagnosis(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.activities}>
        <Text>Loading recent activities...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.activities}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.activities}>
      <View style={styles.activityHeader}>
        <Text style={styles.recentActivity}>Recent Diagnoses</Text>
      </View>

      {diagnoses.length === 0 ? (
        <Text style={styles.noDataMessage}>No recent diagnoses available.</Text>
      ) : (
        <FlatList
          data={diagnoses}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={(itemData: any) => (
            <TouchableOpacity onPress={() => openModal(itemData.item)}>
              <RecentDiagnozeItems
                name={itemData.item.plantDisease.name} 
                image={itemData.item.image}
              />
            </TouchableOpacity>
          )}
        />
      )}

      {selectedDiagnosis && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Disease Details</Text>

              {/* Display Image */}
              {selectedDiagnosis.image && (
                <Image
                  source={{ uri: selectedDiagnosis.image }}
                  style={styles.diseaseImage}
                  resizeMode="contain"
                />
              )}

              {/* Disease Details */}
              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Detected Disease: </Text>
                {selectedDiagnosis.plantDisease.name.replace(/_/g, ' ')}
              </Text>

              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Symptoms: </Text>
                {selectedDiagnosis.plantDisease.symptoms}
              </Text>

              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Cause: </Text>
                {selectedDiagnosis.plantDisease.cause}
              </Text>

              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Effect: </Text>
                {selectedDiagnosis.plantDisease.effect}
              </Text>

              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Prevention: </Text>
                {selectedDiagnosis.plantDisease.prevention}
              </Text>

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activities: {
    paddingHorizontal: 15,
    marginVertical: 20,
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentActivity: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  diseaseImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  noDataMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default RecentActivities;
