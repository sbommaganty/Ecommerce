import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CallScreen from '../../UI/Home/CallScreen';
import {Home} from '../../UI/Home/Home';
import {Login} from '../../UI/Login/Login';
const Stack = createNativeStackNavigator();

export const PostLoginStackRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Home'} component={Home} />
      <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen name={'CallScreen'} component={CallScreen} />
    </Stack.Navigator>
  );
};
