import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Función para solicitar permisos de cámara
const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Permisos de Cámara",
          message: "Esta app necesita acceso a la cámara para realidad aumentada",
          buttonNeutral: "Preguntar después",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error al solicitar permisos de cámara:', err);
      return false;
    }
  } else {
    // En iOS, los permisos se manejan automáticamente a través de Info.plist
    // y se solicitan cuando se intenta usar la cámara por primera vez
    return true;
  }
};

// Función para verificar si ya tenemos permisos
const checkCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return hasPermission;
    } catch (err) {
      console.warn('Error al verificar permisos de cámara:', err);
      return false;
    }
  } else {
    return true;
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Solicitar permisos de cámara cuando se carga la app
    const initializePermissions = async () => {
      try {
        const hasPermission = await checkCameraPermission();
        if (!hasPermission) {
          await requestCameraPermission();
        }
      } catch (error) {
        console.error('Error inicializando permisos:', error);
      }
    };

    initializePermissions();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
