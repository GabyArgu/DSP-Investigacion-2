// components/SensorList/SensorCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sensor } from '@/types/Sensor';

interface SensorCardProps {
  sensor: Sensor;
  onUpdate: (sensorId: string, data: Partial<Sensor>) => void;
  onSelect?: (sensor: Sensor) => void;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor, onUpdate, onSelect }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(sensor.lastReading.toString());
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'warning'>(sensor.status);

  const getStatusColor = (): string => {
    switch (sensor.status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getSensorIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (sensor.type) {
      case 'temperature': return 'thermometer';
      case 'humidity': return 'water';
      case 'pressure': return 'speedometer';
      default: return 'analytics';
    }
  };

  const handleUpdate = (): void => {
    const numericValue = parseFloat(editValue);
    if (isNaN(numericValue)) {
      Alert.alert('Error', 'Por favor ingrese un valor válido');
      return;
    }

    onUpdate(sensor.id, {
      lastReading: numericValue,
      status: editStatus
    });

    setModalVisible(false);
    Alert.alert('Éxito', 'Sensor actualizado correctamente');
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onSelect?.(sensor)}
        onLongPress={() => setModalVisible(true)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={getSensorIcon()} size={24} color="#333" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sensorName}>{sensor.name}</Text>
          <Text style={styles.sensorType}>Tipo: {sensor.type}</Text>
          <Text style={styles.sensorId}>ID: {sensor.id}</Text>
        </View>

        <View style={styles.dataContainer}>
          <Text style={styles.sensorValue}>
            {sensor.lastReading} {sensor.type === 'temperature' ? '°C' : '%'}
          </Text>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>
              {sensor.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Sensor</Text>

            <Text style={styles.label}>Valor:</Text>
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="numeric"
              placeholder="Ingrese el valor"
            />

            <Text style={styles.label}>Estado:</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  editStatus === 'active' && styles.statusButtonActive
                ]}
                onPress={() => setEditStatus('active')}
              >
                <Text style={styles.statusButtonText}>Activo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  editStatus === 'inactive' && styles.statusButtonInactive
                ]}
                onPress={() => setEditStatus('inactive')}
              >
                <Text style={styles.statusButtonText}>Inactivo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  editStatus === 'warning' && styles.statusButtonWarning
                ]}
                onPress={() => setEditStatus('warning')}
              >
                <Text style={styles.statusButtonText}>Advertencia</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sensorType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sensorId: {
    fontSize: 12,
    color: '#999',
  },
  dataContainer: {
    alignItems: 'flex-end',
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonInactive: {
    backgroundColor: '#F44336',
  },
  statusButtonWarning: {
    backgroundColor: '#FF9800',
  },
  statusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SensorCard;