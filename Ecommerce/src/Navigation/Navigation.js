import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {PreLoginStackRoutes} from './Stack/PreLoginStack';

export const Navigation = () => {
  return (
    <NavigationContainer>
      <PreLoginStackRoutes />
    </NavigationContainer>
  );
};
