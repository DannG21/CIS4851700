const BASE_URL = process.env.REACT_APP_API_URL || '';
const publicVapidKey = process.env.REACT_APP_PUBLIC_VAPID_KEY || '';

export const isNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported by this browser');
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

export const subscribeToPushNotifications = async (token) => {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported by this browser');
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      
      await saveSubscription(subscription, token);
    }
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

const saveSubscription = async (subscription, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/push-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving push subscription:', error);
    throw error;
  }
};

export const scheduleHabitReminder = async (habitId, time, message, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/schedule-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        habitId,
        time,
        message
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule reminder');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    throw error;
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}