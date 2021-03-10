import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import screens from '../constants/screens';
import LocalSightings from '../screens/localSightings/LocalSightings';
import theme from '../constants/theme';
import Typography from './Typography';
import globalStyles from '../styles/globalStyles';

const LoginStack = createStackNavigator();

export default function ViewLocalSightingScreen({ navigation, route }) {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            type="material-icons"
            color={theme.black}
            onPress={() => navigation.toggleDrawer()}
            iconStyle={globalStyles.iconLeft}
          />
        ),
      }}
    >
      <LoginStack.Screen
        name="Login1"
        component={LocalSightings}
        options={{
          headerTitle: () => (
            <Typography id="LOCAL_SIGHTINGS" style={globalStyles.headerText} />
          ),
        }}
      />
    </LoginStack.Navigator>
  );
}
