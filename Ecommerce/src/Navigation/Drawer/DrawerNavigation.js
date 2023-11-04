import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from './Drawer';
import {PostLoginStackRoutes} from '../Stack/PostLoginStack';

const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName={'postLoginStack'}
      drawerContent={item => CustomDrawer(item)}>
      <Drawer.Screen name={'postLoginStack'} component={PostLoginStackRoutes} />
    </Drawer.Navigator>
  );
};
