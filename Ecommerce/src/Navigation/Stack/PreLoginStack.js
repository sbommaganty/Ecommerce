import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
// import {Home} from '../../UI/Home/Home';

import {Login} from '../../UI/Login/Login';
import {OTPScreen} from '../../UI/Login/OTPScreen';
import {LandingScreen} from '../../UI/LandingScreen';
// import {Home} from '../../UI/Home/Home';
import {ForgotPasswordScreen} from '../../UI/Login/ForgotPasswordScreen';
import {PostLoginStackRoutes} from './PostLoginStack';

const Stack = createNativeStackNavigator();

export const PreLoginStackRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName={'LandingScreen'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'LandingScreen'} component={LandingScreen} />

      <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen name={'OTPScreen'} component={OTPScreen} />
      <Stack.Screen
        name={'ForgotPasswordScreen'}
        component={ForgotPasswordScreen}
      />
      {/* <Stack.Screen name={'Home'} component={Home} /> */}
      <Stack.Screen name={'PostLoginStack'} component={PostLoginStackRoutes} />
    </Stack.Navigator>
  );
};
