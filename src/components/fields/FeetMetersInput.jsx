import React, { useState } from 'react';
import { Picker } from '@react-native-community/picker';
import globalStyles from '../../styles/globalStyles';
import { round } from 'lodash-es';
import styles from '../../styles/newSightingStyles';
import { View, TextInput } from 'react-native';

export default function FeetMetersInput(rest) {
  const { name, schema, props, id } = rest;
  const { displayType } = rest;
  const type = (schema && schema.displayType) || displayType;
  const [choice, setChoice] = useState('Feet');
  const [measurement, setMeasurement] = useState(
    (props.values.customFields[name] &&
      props.values.customFields[name]['Value'] &&
      round(
        props.values.customFields[name]['Value'] * 3.28084,
        2
      ).toString()) ||
      null
  );

  const onTextChange = (value) => {
    setMeasurement(value);
    props.setFieldValue(`customFields.${name}`, {
      Type: type,
      id,
      Value: value,
    });
    if (choice === 'Feet') {
      const tempVal = value * 0.3048;
      props.setFieldValue(`customFields.${name}`, {
        Type: type,
        id,
        Value: tempVal,
      });
    } else {
      props.setFieldValue(`customFields.${name}`, {
        Type: type,
        id,
        Value: value,
      });
    }
  };
  const onPickerChange = (value) => {
    if (choice === 'Meters') {
      setMeasurement(
        round(
          ((props.values.customFields[name] &&
            props.values.customFields[name]['Value']) ||
            0) * 3.28084,
          2
        ).toString()
      );
      setChoice(value);
    } else {
      setMeasurement(
        round(
          (props.values.customFields[name] &&
            props.values.customFields[name]['Value']) ||
            0,
          2
        ).toString()
      );
      setChoice(value);
    }
  };

  return (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
    >
      <TextInput
        style={[globalStyles.inputField, { width: '20%', height: '50%' }]}
        textAlign={'right'}
        keyboardType={'numeric'}
        placeholder={'0'}
        autoCorrect={false}
        value={measurement}
        onChangeText={onTextChange}
        onBlur={props.handleBlur(`customFields.${name}`)}
      />
      <Picker
        selectedValue={choice}
        style={{ height: 125, width: '50%' }}
        itemStyle={{ height: 125 }}
        onValueChange={onPickerChange}
      >
        <Picker.Item label={'Feet'} value={'Feet'} />
        <Picker.Item label={'Meters'} value={'Meters'} />
      </Picker>
    </View>
  );
}
