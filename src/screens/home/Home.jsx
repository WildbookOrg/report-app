import React, { useContext, useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Typography from '../../components/Typography';
import theme from '../../constants/theme';
import globalStyles from '../../styles/globalStyles';
import screens from '../../constants/screens';
import { ReportContext } from '../../context/reportContext';
import AsyncStorage from '@react-native-community/async-storage';
import Sighting from '../localSightings/Sighting';
import { LinearGradient } from 'expo-linear-gradient';

/** <SightingCard> : A functional component that creates the sighting cards on the homepage
 *    @props
 *      name  -- the name of the sighting displayed in larger, upper text
 *      image -- the imported image to be used for the cover of the card
 *      date  -- the date of the sighting displayed in smaller, lower text
 */
const SightingCard = (props) => {
  return (
    <View style={cardElementStyles.sightingCard}>
      <Image style={cardElementStyles.imageCover} source={props.image} />
      <View style={cardElementStyles.sightingInfo}>
        <View style={cardElementStyles.sightingText}>
          <Text style={cardElementStyles.sightingTitle}>{props.name}</Text>
          <Text style={cardElementStyles.sightingDate}>{props.date}</Text>
        </View>
        <Icon
          name="more-vert"
          type="material-icons"
          size={28}
          color={theme.black}
        />
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [state, dispatch] = useContext(ReportContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storedSightings, setStoredSightings] = useState([]);

  // console.log(state.sightings);
  useEffect(() => {
    AsyncStorage.getItem('SightingSubmissions').then((result) =>
      result != null
        ? setStoredSightings(JSON.parse(result))
        : setStoredSightings([])
    );
  });

  const syncSighting = () => {
    setIsSyncing(true);
    setTimeout(
      () =>
        NetInfo.fetch().then((state) => {
          if (state.isInternetReachable) {
            alert(
              `Sent ${storedSightings.length} locally saved sighting(s) to the server`
            );
            AsyncStorage.removeItem('SightingSubmissions');
          } else {
            alert('No Internet, try again later.');
          }
          setIsSyncing(false);
        }),
      5000
    );
  };

  return (
    <View style={bodyStyles.parentView}>
      <View style={{ alignItems: 'center' }}>
        <View style={bodyStyles.sortByPos}>
          <Typography id="LAST_ADDED" style={bodyStyles.sortBy} />
          <Icon
            name="arrow-downward"
            type="material-icons"
            size={24}
            color={theme.black}
          />
        </View>
      </View>
      {storedSightings.length > 0 ? (
        <View style={offlineSightings.header}>
          <Typography
            id="OFFLINE_SIGHTINGS"
            style={offlineSightings.offlineSightingsText}
          />
          <View>
            <TouchableOpacity
              style={offlineSightings.syncButton}
              onPress={syncSighting}
            >
              <Typography id="SYNC" style={offlineSightings.syncButton} />
              <Icon
                name="sync"
                type="material-icons"
                size={22}
                color={theme.blue}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {storedSightings.length > 0 ? (
        <ScrollView contentContainerStyle={bodyStyles.content}>
          {storedSightings.map((sighting, index) => (
            <TouchableOpacity
              onPress={() => [
                navigation.navigate(screens.viewSighting, {
                  screen: screens.viewSighting,
                  params: { id: 2 },
                }),
              ]}
              style={cardElementStyles.touchableOpacityHolder}
              key={sighting.id}
            >
              <SightingCard
                key={sighting.id}
                image={26}
                name={sighting.title}
                date={sighting.location}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}
      {storedSightings.length > 0 ? (
        <View style={offlineSightings.header}>
          <Typography
            id="SYNCED_SIGHTINGS"
            style={offlineSightings.offlineSightingsText}
          />
        </View>
      ) : null}
      <ScrollView contentContainerStyle={bodyStyles.content}>
        {
          // Procedurally generate the cards from the sightings array
          state.sightings.map((sighting) => {
            return (
              <TouchableOpacity
                onPress={() => [
                  navigation.navigate(screens.viewSighting, {
                    screen: screens.viewSighting,
                    params: { id: sighting.id },
                  }),
                ]}
                style={cardElementStyles.touchableOpacityHolder}
                key={sighting.id}
              >
                <SightingCard
                  key={sighting.id}
                  image={sighting.image[0]}
                  name={sighting.name}
                  date={sighting.date}
                />
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
      <View style={bodyStyles.addNewPosition}>
        <TouchableOpacity
          onPress={() => navigation.navigate(screens.newSighting)}
        >
          <LinearGradient
            colors={['#21BDC1', '#41D06A']}
            start={[0, 0]}
            end={[1, 1]}
            style={bodyStyles.addNew}
          >
            <Text style={bodyStyles.addNewText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// TODO: Clean up explicit numbers and check on different displays
const bodyStyles = StyleSheet.create({
  parentView: {
    height: '100%',
    backgroundColor: theme.white,
  },
  sortBy: {
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    // alignSelf: 'flex-start',
    // flexDirection: 'row',
    // marginLeft: 12,
    // marginTop: 4,
  },
  sortByPos: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'visible',
    paddingBottom: 5,
    backgroundColor: theme.white,
    minHeight: 160,
  },
  // addSighting: {
  //   fontSize: 14,
  //   fontFamily: 'Lato-Regular',
  //   color: theme.white,
  // },
  // sortBy: {
  //   width: 102,
  //   marginTop: 10,
  //   marginHorizontal: 10,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignSelf: 'flex-start',
  // },
  addNewPosition: {
    // backgroundColor: theme.red,
    height: Dimensions.get('window').width * 0.07,
    width: Dimensions.get('window').width * 0.07,
    // marginTop: 15,
    // marginBottom: 10,
    // padding: '5%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: '7%',
    // iOS
    shadowColor: theme.black,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.35,
    // shadowRadius: 2.6,
    // // Android
    // elevation: 3,
  },
  addNew: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // marginTop: 15,
    // marginBottom: 10,
    // width: Dimensions.get('window').width * 0.9, // Looks dumb but is necessary
    height: '100%',
    width: '100%',
    // padding: 25,
    justifyContent: 'center',
    alignContent: 'center',
    // borderStyle: 'dashed',
    // borderWidth: 1,
    // borderColor: theme.primary,
    borderRadius: Dimensions.get('window').width * 0.09,
    // backgroundColor: theme.primary,
    // margin: '0%',
    // Android
    shadowRadius: 2.6,
    elevation: 4,
  },
  addNewText: {
    fontSize: 45,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    color: theme.white,
    // margin: '0%',
  },
});

const cardElementStyles = StyleSheet.create({
  touchableOpacityHolder: {
    width: '95%',
  },
  sightingCard: {
    flexDirection: 'row',
    marginVertical: 7,
    width: '95%',
    height: 80,
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: 'white',
    borderRadius: 6,
    // iOS
    shadowColor: theme.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.6,
    // Android
    elevation: 3,
  },
  sightingInfo: {
    paddingLeft: 22,
    paddingRight: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 2.5,
    alignItems: 'center',
  },
  imageCover: {
    resizeMode: 'cover', // TODO: Fix to dynamically take up space in View
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: 78,
    flex: 1,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  sightingText: {
    justifyContent: 'space-around',
    height: 36,
  },
  sightingTitle: {
    fontSize: 18,
    fontFamily: 'Lato-Regular',
  },
  sightingDate: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    color: '#777',
  },
});

const offlineSightings = StyleSheet.create({
  offlineSightingsText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    color: theme.black,
    opacity: 0.5,
  },
  scrollView: {
    marginLeft: 12,
    marginRight: 12,
    minHeight: 100,
  },
  offlineText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  syncButton: {
    flexDirection: 'row',
    color: theme.blue,
    fontSize: 18,
    fontFamily: 'Lato-Regular',
  },
  header: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default HomeScreen;
