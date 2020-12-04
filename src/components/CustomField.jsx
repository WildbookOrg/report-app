import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import screens from '../constants/screens';
import theme from '../constants/theme';
import globalStyles from '../styles/globalStyles';
import styles from '../styles/newSightingStyles';
import LabeledInput from './LabeledInput.jsx';

export default function CustomField({ id, required, name, ...rest }) {
  // console.log('CustomField ' + rest);
  // console.log(rest);
  const { schema } = rest;
  const displayName =
    schema != null && schema.label != null ? schema.label : name;
  const description = schema != null ? schema.description : '';

  return (
    // TODO: Text should be Typography component
    <View>
      <Text style={[globalStyles.h2Text, globalStyles.inputHeader]}>
        {displayName}
        {required && ' *'}
      </Text>
      {description != '' && (
        <>
          <Text style={[globalStyles.subText, globalStyles.basicText]}>
            {description}
          </Text>
        </>
      )}
      {/* LabeledInput contains the actual custom field for input */}
      <LabeledInput name={name} {...rest} />
    </View>
  );
}