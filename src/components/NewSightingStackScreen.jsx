import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { Formik } from 'formik';
import screens from '../constants/screens';
import theme from '../constants/theme';
import globalStyles from '../styles/globalStyles';
import styles from '../styles/newSightingStyles';

const NewSightingStack = createStackNavigator();

function NewSightingForm({ navigation }) {
  const [formSection, setFormSection] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={
            (styles.innerProgressBar,
            formSection === 0 && styles.thirtyThree,
            formSection === 1 && styles.sixtySix,
            formSection === 2 && styles.oneHundred)
          }
        />
      </View>
      <Formik
        initialValues={{
          title: '',
          location: '',
          sightingContext: '',
          status: '',
          relationships: '',
          matchIndividual: '',
          photographerName: '',
          photographerEmail: '',
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors, setStatus, resetForm }
        ) => {
          // console.log(values);
          Alert.alert('Form Answers', JSON.stringify(values));
          resetForm();
        }}
      >
        {(formikProps) => {
          return (
            <>
              <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                style={styles.keyboardView}
                scrollEnabled={true}
              >
                {formSection === 0 && (
                  <>
                    <View style={styles.addNew}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate(screens.newSighting)}
                      >
                        <Icon
                          name="cloud-upload"
                          type="font-awesome"
                          color={theme.black}
                          iconStyle={styles.addText}
                          size={40}
                        />
                        <Text
                          style={[globalStyles.inputHeader, styles.addText]}
                        >
                          Add Images
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Title
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange('title')}
                      value={formikProps.values.title}
                    />
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Location
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange('location')}
                      value={formikProps.values.location}
                    />
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Sighting Context
                    </Text>
                    <TextInput
                      style={[globalStyles.inputFields, styles.multiLine]}
                      autoCorrect={false}
                      multiline={true}
                      numberOfLines={5}
                      onChangeText={formikProps.handleChange('sightingContext')}
                      value={formikProps.values.sightingContext}
                    />
                    <View style={styles.keyboardView} />
                  </>
                )}
                {formSection === 1 && (
                  <>
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Status
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange('status')}
                      value={formikProps.values.status}
                    />
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Relationships
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange('relationships')}
                      value={formikProps.values.relationships}
                    />
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Match Individual
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange('matchIndividual')}
                      value={formikProps.values.matchIndividual}
                    />
                  </>
                )}
                {formSection === 2 && (
                  <>
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Photographer name
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange(
                        'photographerName'
                      )}
                      value={formikProps.values.photographerName}
                    />
                    <Text
                      style={[globalStyles.h2Text, globalStyles.inputHeader]}
                    >
                      Photographer email
                    </Text>
                    <TextInput
                      style={globalStyles.inputFields}
                      autoCorrect={false}
                      onChangeText={formikProps.handleChange(
                        'photographerEmail'
                      )}
                      value={formikProps.values.photographerEmail}
                    />
                  </>
                )}
              </KeyboardAwareScrollView>
              {formSection === 0 && (
                <View style={styles.buttonContainer}>
                  <View style={styles.horizontal}>
                    <TouchableOpacity>
                      <View style={[styles.button, globalStyles.invisible]}>
                        <Text style={globalStyles.buttonText}>Back</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFormSection(1)}>
                      <View style={(globalStyles.button, styles.button)}>
                        <Text style={globalStyles.buttonText}>Next </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {formSection === 1 && (
                <View style={styles.buttonContainer}>
                  <View style={styles.horizontal}>
                    <TouchableOpacity onPress={() => setFormSection(0)}>
                      <View style={[styles.button, styles.buttonInactive]}>
                        <Text style={globalStyles.buttonText}> Back </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFormSection(2)}>
                      <View style={styles.button}>
                        <Text style={globalStyles.buttonText}>Next</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {formSection === 2 && (
                <View style={styles.buttonContainer}>
                  <View style={styles.horizontal}>
                    <TouchableOpacity onPress={() => setFormSection(1)}>
                      <View style={[styles.button, styles.buttonInactive]}>
                        <Text style={globalStyles.buttonText}>Back</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        formikProps.handleSubmit();
                        setFormSection(0);
                        navigation.navigate(screens.home);
                      }}
                    >
                      <View style={styles.button}>
                        <Text style={globalStyles.buttonText}>Upload</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          );
        }}
      </Formik>
    </View>
  );
}

export default function NewSightingStackScreen({ navigation }) {
  return (
    <NewSightingStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerRight: () => (
          <Icon
            name="times"
            type="font-awesome"
            color={theme.black}
            onPress={() => {
              navigation.navigate(screens.home);
            }}
            iconStyle={globalStyles.icon}
          />
        ),
      }}
    >
      <NewSightingStack.Screen
        name={screens.newSighting}
        component={NewSightingForm}
        options={{
          headerTitle: () => (
            <Text style={globalStyles.headerText}>Sighting Info</Text>
          ),
        }}
      />
    </NewSightingStack.Navigator>
  );
}
