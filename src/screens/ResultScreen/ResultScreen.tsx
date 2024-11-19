import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ResultScreen = ({ route }: any) => {
  const { response } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Recognition Result</Text>
        {response ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Result: {response.result}</Text>
            {/* Display additional data from the response */}
            <Text style={styles.resultText}>Details: {response.details}</Text>
          </View>
        ) : (
          <Text style={styles.noDataText}>No result available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  resultContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  resultText: { fontSize: 18, marginBottom: 10 },
  noDataText: { fontSize: 18, color: 'gray', textAlign: 'center' },
});
