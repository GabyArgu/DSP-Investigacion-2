// components/ARScene/ViroARScene.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroText,
  ViroFlexView,
  ViroNode,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroTrackingStateConstants
} from '@reactvision/react-viro';

interface ViroARSceneProps {
  sensor: any;
  onBack: () => void;
  singleSensorMode?: boolean;
}

interface ARSceneComponentProps {
  sensor: any;
  onBack: () => void;
  singleSensorMode?: boolean;
}

const ARSceneComponent: React.FC<ARSceneComponentProps> = ({
  sensor,
  onBack,
  singleSensorMode = false
}) => {
  const [trackingState, setTrackingState] = useState<string>('INITIALIZING');

  const handleTrackingUpdated = (state: number, reason: number) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingState('TRACKING_NORMAL');
      console.log('✅ AR tracking normal');
    }
    else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setTrackingState('TRACKING_UNAVAILABLE');
      console.log('❌ AR no disponible');
    }
    else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
      setTrackingState('TRACKING_LIMITED');
      console.log('⚠️ AR tracking limitado');
    }
  };

  const getSensorColor = (type: string) => {
    switch (type) {
      case 'temperature': return '#ff6b6b';
      case 'humidity': return '#4ecdc4';
      case 'pressure': return '#45b7d1';
      default: return '#ffffff';
    }
  };

  const getSensorUnit = (type: string) => {
    switch (type) {
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'pressure': return 'hPa';
      default: return '';
    }
  };

  const formatText = (text: string) => {
    return text.replace(/ /g, '\u00A0');
  };

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      {trackingState !== 'TRACKING_NORMAL' && (
        <ViroFlexView
          position={[0, 0, -1]}
          width={1.5}
          height={0.5}
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 0.1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ViroText
            text={trackingState === 'TRACKING_LIMITED'
              ? "Mueve el dispositivo lentamente para detectar superficies"
              : "Inicializando AR..."}
            style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}
          />
        </ViroFlexView>
      )}

      <ViroARPlaneSelector>
        <ViroNode position={[0, 0, -1]} dragType="FixedToWorld" onDrag={() => { }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-evenly"
          }}>

          {singleSensorMode && sensor && (
            <>
              <ViroFlexView
                position={[0, 0, -0.1]}
                height={2}
                width={2.5}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }}
              >
              </ViroFlexView>
              <ViroText
                text={formatText(`Sensor: ${sensor.name}`)}
                style={{ fontSize: 16, color: '#007AFF' }}
                height={0.2}
                position={[-0.5, 0.6, 0]}
              />
              <ViroText
                text={formatText(`Tipo: ${sensor.type}`)}
                style={{ fontSize: 14, color: '#ffffff' }}
                height={0.2}
                position={[-0.5, 0.3, 0]}
              />
              <ViroText
                text={formatText(`Lectura: ${sensor.lastReading}${getSensorUnit(sensor.type)}`)}
                style={{ fontSize: 12, color: getSensorColor(sensor.type) }}
                height={0.2}
                position={[-0.5, 0, 0]}
              />
              <ViroText
                text={formatText(`Ubicación: ${sensor.location.latitude + ', ' + sensor.location.longitude || 'N/A'}`)}
                style={{ fontSize: 12, color: '#cccccc' }}
                height={0.2}
                position={[-0.5, -0.3, 0]}
              />

              <ViroBox
                position={[0, -1, 0]}
                scale={[0.3, 0.3, 0.3]}
                materials={[getSensorColor(sensor.type)]}
              />
            </>
          )}

        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

const ViroARSceneComponent: React.FC<ViroARSceneProps> = ({
  sensor,
  onBack,
  singleSensorMode = false
}) => {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ARSceneComponent
              sensor={sensor}
              onBack={onBack}
              singleSensorMode={singleSensorMode}
            />
          )
        }}
        style={styles.arContainer}
      />

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      {singleSensorMode && sensor && (
        <View style={styles.sensorInfoPanel}>
          <Text style={styles.sensorInfoText}>
            Visualizando: {sensor.name}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arContainer: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  sensorInfoPanel: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  sensorInfoText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ViroARSceneComponent;