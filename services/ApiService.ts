// services/ApiService.ts
import { Sensor, SensorData, ApiResponse } from '@/types/Sensor';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

export const ApiService = {
  async getSensors(): Promise<Sensor[]> {
    try {
      // Obtener datos meteorológicos reales de Nueva York
      const response = await fetch(
        `${OPEN_METEO_URL}?latitude=13.4355&longitude=-89.1132&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,wind_speed_10m&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const weatherData = await response.json();
      const current = weatherData.current;

      return [
        {
          id: 'sensor-1',
          name: 'Temperatura',
          type: 'temperature',
          location: { latitude: weatherData.latitude, longitude: weatherData.longitude },
          lastReading: current.temperature_2m,
          status: this.getStatusFromValue('temperature', current.temperature_2m)
        },
        {
          id: 'sensor-2',
          name: 'Humedad',
          type: 'humidity',
          location: { latitude: weatherData.latitude, longitude: weatherData.longitude },
          lastReading: current.relative_humidity_2m,
          status: this.getStatusFromValue('humidity', current.relative_humidity_2m)
        },
        {
          id: 'sensor-3',
          name: 'Presión Atmosférica',
          type: 'pressure',
          location: { latitude: weatherData.latitude, longitude: weatherData.longitude },
          lastReading: current.surface_pressure,
          status: this.getStatusFromValue('pressure', current.surface_pressure)
        },
        {
          id: 'sensor-4',
          name: 'Lluvia',
          type: 'rain',
          location: { latitude: weatherData.latitude, longitude: weatherData.longitude },
          lastReading: current.rain,
          status: this.getStatusFromValue('rain', current.rain)
        },
        {
          id: 'sensor-5',
          name: 'Velocidad Viento',
          type: 'wind',
          location: { latitude: weatherData.latitude, longitude: weatherData.longitude },
          lastReading: current.wind_speed_10m,
          status: this.getStatusFromValue('wind', current.wind_speed_10m)
        }
      ];
    } catch (error) {
      console.error('Error fetching weather data from Open-Meteo:', error);
      return this.getMockSensors();
    }
  },

  async updateSensor(sensorId: string, updateData: Partial<Sensor>): Promise<ApiResponse<void>> {
    // Open-Meteo es solo lectura, así que simulamos la actualización
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
      
      return { 
        success: true,
        data: undefined
      };
    } catch (error) {
      console.error('Error updating sensor:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  getStatusFromValue(type: string, value: number): 'active' | 'warning' | 'inactive' {
    switch (type) {
      case 'temperature':
        return value > 30 || value < 5 ? 'warning' : 'active';
      case 'humidity':
        return value > 80 || value < 30 ? 'warning' : 'active';
      case 'pressure':
        return value > 1030 || value < 1000 ? 'warning' : 'active';
      case 'rain':
        return value > 5 ? 'warning' : 'active';
      case 'wind':
        return value > 30 ? 'warning' : 'active';
      default:
        return 'active';
    }
  },

  // Fallback con datos mock por si Open-Meteo falla
  getMockSensors(): Sensor[] {
    const mockData = {
      temperature_2m: 22.5,
      relative_humidity_2m: 65,
      surface_pressure: 1013,
      rain: 0,
      wind_speed_10m: 15
    };

    return [
      {
        id: 'sensor-1',
        name: 'Sensor Temperatura NYC',
        type: 'temperature',
        location: { latitude: 40.7128, longitude: -74.0060 },
        lastReading: mockData.temperature_2m,
        status: this.getStatusFromValue('temperature', mockData.temperature_2m)
      },
      {
        id: 'sensor-2',
        name: 'Sensor Humedad NYC',
        type: 'humidity',
        location: { latitude: 40.7128, longitude: -74.0060 },
        lastReading: mockData.relative_humidity_2m,
        status: this.getStatusFromValue('humidity', mockData.relative_humidity_2m)
      },
      {
        id: 'sensor-3',
        name: 'Sensor Presión Atmosférica',
        type: 'pressure',
        location: { latitude: 40.7128, longitude: -74.0060 },
        lastReading: mockData.surface_pressure,
        status: this.getStatusFromValue('pressure', mockData.surface_pressure)
      },
      {
        id: 'sensor-4',
        name: 'Sensor Lluvia',
        type: 'rain',
        location: { latitude: 40.7128, longitude: -74.0060 },
        lastReading: mockData.rain,
        status: this.getStatusFromValue('rain', mockData.rain)
      },
      {
        id: 'sensor-5',
        name: 'Sensor Velocidad Viento',
        type: 'wind',
        location: { latitude: 40.7128, longitude: -74.0060 },
        lastReading: mockData.wind_speed_10m,
        status: this.getStatusFromValue('wind', mockData.wind_speed_10m)
      }
    ];
  },

  getMockSensorData(sensorId: string): SensorData {
    const mockValues: { [key: string]: { value: number; unit: string } } = {
      'sensor-1': { value: 22.5 + (Math.random() * 2 - 1), unit: '°C' },
      'sensor-2': { value: 65 + (Math.random() * 5 - 2.5), unit: '%' },
      'sensor-3': { value: 1013 + (Math.random() * 4 - 2), unit: 'hPa' },
      'sensor-4': { value: Math.random() > 0.8 ? Math.random() * 3 : 0, unit: 'mm' },
      'sensor-5': { value: 15 + (Math.random() * 10 - 5), unit: 'km/h' }
    };

    const data = mockValues[sensorId] || { value: 0, unit: 'units' };

    return {
      value: parseFloat(data.value.toFixed(2)),
      timestamp: new Date().toISOString(),
      unit: data.unit
    };
  }
};