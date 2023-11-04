import React, {useEffect} from 'react';
import OneSignal from 'react-native-onesignal';
import {AppProvider} from './Provider/AppConfig';
import {UIProvider} from './Provider/UIProvider';
import {Navigation} from './Navigation/Navigation';
import Firebase from '@react-native-firebase/app';

export const App = () => {
  const onesignal = async () => {
    try {
      // OneSignal.setAppId('4b6816e6-57aa-4765-8898-a83164203baa');
      OneSignal.setAppId('e2155928-db3f-4fdc-881f-59940ab3e57b');
    } catch (e) {
      console.log('Error in App.js ', e);
    }
  };

  useEffect(() => {
    console.log(Firebase.apps.length);

    //check whether firebase is initilized or not
    if (Firebase.apps.length === 0) {
      console.log("firebase initialized");
      Firebase.initializeApp();
    }

    onesignal();
  });

  return (
    <AppProvider>
      <UIProvider>
        <Navigation />
      </UIProvider>
    </AppProvider>
  );
};
