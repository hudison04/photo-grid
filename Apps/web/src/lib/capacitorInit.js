import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';

export const initCapacitor = async () => {
  try {
    // Hide splash screen after a short delay to ensure React has rendered
    setTimeout(async () => {
      try {
        await SplashScreen.hide();
      } catch (e) {
        console.log('SplashScreen plugin not available or running in web');
      }
    }, 2000);

    // Configure Status Bar
    try {
      await StatusBar.setStyle({ style: Style.Light });
    } catch (e) {
      console.log('StatusBar plugin not available or running in web');
    }

    // Request Push Notification permissions
    try {
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      }
    } catch (e) {
      console.log('PushNotifications plugin not available or running in web');
    }

  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
};