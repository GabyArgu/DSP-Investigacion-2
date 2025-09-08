// components/SensorList/SensorList.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Text, Alert } from 'react-native';
import { ApiService } from '@/services/ApiService';
import { Sensor } from '@/types/Sensor';
import SensorCard from './SensorCard';

interface SensorListProps {
  onSensorSelect?: (sensor: Sensor) => void;
}

const SensorList: React.FC<SensorListProps> = ({ onSensorSelect }) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
  const interval = setInterval(() => {
    // Solo mostramos el refresco si no se está refrescando ya
    if (!refreshing) {
      setRefreshing(true);
      loadSensors().finally(() => setRefreshing(false));
    }
  }, 5000);

  return () => clearInterval(interval);
}, [refreshing]); 

  const loadSensors = async (): Promise<void> => {
    setRefreshing(true);
    try {
      const sensorData = await ApiService.getSensors();
      setSensors(sensorData);
    } catch (error) {
      console.error('Error loading sensors:', error);
      Alert.alert('Error', 'No se pudieron cargar los sensores');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateSensor = async (sensorId: string, newData: Partial<Sensor>): Promise<void> => {
    try {
      const result = await ApiService.updateSensor(sensorId, newData);
      if (result.success) {
        setSensors(prevSensors => 
          prevSensors.map(sensor => 
            sensor.id === sensorId 
              ? { ...sensor, ...newData }
              : sensor
          )
        );
      } else {
        Alert.alert('Error', 'No se pudo actualizar el sensor');
      }
    } catch (error) {
      console.error('Error updating sensor:', error);
      Alert.alert('Error', 'Error al actualizar el sensor');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SensorCard 
            sensor={item} 
            onUpdate={handleUpdateSensor}
            onSelect={onSensorSelect}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadSensors}
          />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
            No hay sensores disponibles. Desliza hacia abajo para recargar.
          </Text>
        }
      />
    </View>
  );
};

export default SensorList;