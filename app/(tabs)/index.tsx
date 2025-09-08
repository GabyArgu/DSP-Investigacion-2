import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import SensorList from '@/components/SensorList/SensorList';
import ViroARScene from '@/components/ARScene/ViroARScene';
import { ApiService } from '@/services/ApiService';
import { Sensor } from '@/types/Sensor';

const HomeScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'ar'>('list');
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSensorSelect = (sensor: Sensor): void => {
    setSelectedSensor(sensor);
    setViewMode('ar');
  };

  const handleBackFromAR = (): void => {
    setViewMode('list');
    setSelectedSensor(null);
  };

  if (viewMode === 'ar') {
    return (
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando sensores...</Text>
          </View>
        ) : (
          <ViroARScene
            sensor={selectedSensor}
            onBack={handleBackFromAR}
            singleSensorMode={!!selectedSensor}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Lista de Sensores</Text>
      <SensorList onSensorSelect={handleSensorSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingLeft: 20
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 30,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    zIndex: 1000,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
});

export default HomeScreen;