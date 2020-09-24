import React from 'react';
import {Button, Text, StyleSheet,Image,View,ScrollView} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import screens from '../constants/screens';
import { Icon } from 'react-native-elements';
import Humpback from '../../assets/humpback.jpg';
import theme from '../constants/theme';

const ViewSightingStack = createStackNavigator();

const ViewSightingScreen = ({Navigation}) => {
    return(
        //hardcoded to be replaced for later 
        <View style={styles.InfoView}>
            <Image style={styles.image} source={Humpback}/>
           <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Text style={styles.InfoHeader}>Humpback</Text>
            <Text style={styles.InfoText}>9/20/2020</Text> 
            <View style={styles.Divider}/>
            <Text style={styles.Title}>Sighting</Text>
            <View style={styles.Divider}/>
            <Text style={styles.InfoHeader}>Species</Text>
            <Text style={styles.InfoText}>Humpback Whale</Text> 
            <Text style={styles.InfoHeader}>Title</Text>
            <Text style={styles.InfoText}>Humpy</Text>
            <Text style={styles.InfoHeader}>Location</Text>
            <Text style={styles.InfoText}>Portland, OR</Text>  
            <Text style={styles.InfoHeader}>Sighting Context</Text>
            <Text style={styles.InfoText}>I saw it. The thing was absolutly 
            massive bro.</Text> 
           </ScrollView>
        </View>
    );
};

export default function ViewSightingStackScreen({navigation}){
    return(
        <ViewSightingStack.Navigator
        screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Icon
                name="bars"
                type="font-awesome"
                color={theme.black}
                onPress={() => navigation.toggleDrawer()}
                iconStyle={styles.icon}
              />
            ),
        }}
        >
        <ViewSightingStack.Screen
            name={screens.viewSighting}
            component ={ViewSightingScreen}
            options={{
                headerTitle: () => <Text style={styles.headerText}>View Sighting</Text>,
            }}
        />
        </ViewSightingStack.Navigator>


    );
}
const styles = StyleSheet.create({
    headerText: {
      fontFamily: 'Lato-Regular',
      fontSize: 14,
    },
    icon: {
      marginLeft: 16,
    },
    image: {
        width: '100%',
        height: '40%',
        alignItems: "center",
    },
    InfoView: {
        flex: 1,
        marginBottom: 10,
        
    },
    InfoHeader: {
        color: '#2c2c2c',
        fontFamily: 'Lato-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 20,
    },
    InfoText: {
        fontFamily:'Lato-Regular',
        fontSize: 18,
        marginTop: 5,
        marginLeft: 20,
        opacity: 0.5,
    },
    Title: {
        color: '#2c2c2c',
        textAlign: 'center',
        fontFamily:'Lato-Regular',
        fontSize: 22,
        marginTop: 10,
        fontWeight:'bold',
    },
    Divider: {
        marginLeft: 25,
        marginTop: 10,
        borderBottomColor: '#2C2C2C', 
        borderBottomWidth: 0.5,
        width: 375,
        opacity: 0.5,
    }
  });