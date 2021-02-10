// Component that returns a TextInput based on the given schema
import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import globalStyles from '../../styles/globalStyles';
import styles from '../../styles/newSightingStyles';
import Typography from '../../components/Typography';
import theme from '../../constants/theme';

export default function IndividualInformation(input) {
  const { formikProps } = input;

  return (
    <View>
      <Text style={[globalStyles.inputHeader, globalStyles.h2Text]}>
        <Typography id="PHOTOGRAPHER_NAME" required={true} />
        {formikProps.touched.photographerName &&
          formikProps.errors.photographerName && (
            <Typography
              id="FIELD_REQUIRED"
              style={[
                globalStyles.h2TextInvalid,
                { fontFamily: 'Lato-Italic' },
              ]}
            />
          )}
      </Text>
      <TextInput
        style={[globalStyles.inputField]}
        autoCorrect={false}
        onChangeText={formikProps.handleChange('photographerName')}
        value={formikProps.values.photographerName}
        onBlur={formikProps.handleBlur('photographerName')}
        isValid={
          formikProps.touched.photographerName &&
          !formikProps.errors.photographerName
        }
        isInvalid={
          formikProps.touched.photographerName &&
          formikProps.errors.photographerName
        }
      />
      <Text style={[globalStyles.inputHeader, globalStyles.h2Text]}>
        <Typography id="PHOTOGRAPHER_EMAIL" required={true} />
        {formikProps.touched.photographerEmail &&
          formikProps.errors.photographerEmail && (
            <Typography
              id="FIELD_REQUIRED"
              style={[
                globalStyles.h2TextInvalid,
                { fontFamily: 'Lato-Italic' },
              ]}
            />
          )}
      </Text>
      <TextInput
        style={[globalStyles.inputField]}
        autoCorrect={false}
        onChangeText={formikProps.handleChange('photographerEmail')}
        value={formikProps.values.photographerEmail}
        onBlur={formikProps.handleBlur('photographerEmail')}
        isValid={
          formikProps.touched.photographerEmail &&
          !formikProps.errors.photographerEmail
        }
        isInvalid={
          formikProps.touched.photographerEmail &&
          formikProps.errors.photographerEmail
        }
      />
    </View>
  );
}
