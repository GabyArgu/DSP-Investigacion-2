export const ViroConfig = {
  // Configuración para iOS
  ios: {
    apiKey: process.env.EXPO_PUBLIC_VIRO_IOS_API_KEY || 'TU_API_KEY_IOS_AQUI',
  },
  // Configuración para Android
  android: {
    apiKey: process.env.EXPO_PUBLIC_VIRO_ANDROID_API_KEY || 'TU_API_KEY_ANDROID_AQUI',
  },
};

// Para desarrollo, puedes usar claves de prueba
export const isViroEnabled = (): boolean => {
  return !!(ViroConfig.ios.apiKey && ViroConfig.android.apiKey);
};