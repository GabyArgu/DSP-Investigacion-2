// types/Sensor.ts
export interface SensorData {
  value: number;
  timestamp: string;
  unit: string;
}

export type SensorType = 'temperature' | 'humidity' | 'pressure' | 'rain' | 'wind' | 'other';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: {
    latitude: number;
    longitude: number;
  };
  lastReading: number;
  status: 'active' | 'inactive' | 'warning';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ViroPosition = [number, number, number];