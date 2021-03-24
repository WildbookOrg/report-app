import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import styles from '../../styles/newSightingStyles';

export default function AreaInput(rest) {
  const { name, schema, props } = rest;
  const { displayType } = rest;
  const type = (schema && schema.displayType) || displayType;
  const [north, setNorth] = useState('0.0');
  const [east, setEast] = useState('0.0');
  const [south, setSouth] = useState('0.0');
  const [west, setWest] = useState('0.0');
  //TODO test
  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <View style={styles.horizontal}>
        <Text style={[globalStyles.h2Text, globalStyles.inputHeader]}>
          North:
        </Text>
        <TextInput
          style={[globalStyles.inputField, { width: '20%' }]}
          keyboardType={'numeric'}
          placeholder={'0.0'}
          autoCorrect={false}
          value={
            (props.values.customFields[name] &&
              props.values.customFields[name]['Value']['north']) ||
            north
          }
          onChangeText={(val) => {
            [
              setNorth(val),
              props.setFieldValue(`customFields.${name}`, {
                Type: type,
                Value: {
                  north: val,
                  east: east,
                  south: south,
                  west: west,
                },
              }),
            ];
          }}
          onBlur={props.handleBlur(`customFields.${name}`)}
        />
        <Text style={[globalStyles.h2Text, globalStyles.inputHeader]}>
          East:
        </Text>
        <TextInput
          style={[globalStyles.inputField, { width: '20%' }]}
          keyboardType={'numeric'}
          placeholder={'0.0'}
          autoCorrect={false}
          value={
            (props.values.customFields[name] &&
              props.values.customFields[name]['Value']['east']) ||
            east
          }
          onChangeText={(val) => {
            [
              setEast(val),
              props.setFieldValue(`customFields.${name}`, {
                Type: type,
                Value: {
                  north: north,
                  east: val,
                  south: south,
                  west: west,
                },
              }),
            ];
          }}
          onBlur={props.handleBlur(`customFields.${name}`)}
        />
      </View>
      <View style={styles.horizontal}>
        <Text
          style={[
            globalStyles.h2Text,
            globalStyles.inputHeader,
            { paddingRight: '1%' },
          ]}
        >
          South:
        </Text>
        <TextInput
          style={[globalStyles.inputField, { width: '20%' }]}
          keyboardType={'numeric'}
          placeholder={'0.0'}
          autoCorrect={false}
          value={
            (props.values.customFields[name] &&
              props.values.customFields[name]['Value']['south']) ||
            south
          }
          onChangeText={(val) => {
            [
              setSouth(val),
              props.setFieldValue(`customFields.${name}`, {
                Type: type,
                Value: {
                  north: north,
                  east: east,
                  south: val,
                  west: west,
                },
              }),
            ];
          }}
          onBlur={props.handleBlur(`customFields.${name}`)}
        />
        <Text style={[globalStyles.h2Text, globalStyles.inputHeader]}>
          West:
        </Text>
        <TextInput
          style={[globalStyles.inputField, { width: '20%' }]}
          keyboardType={'numeric'}
          placeholder={'0.0'}
          autoCorrect={false}
          value={
            (props.values.customFields[name] &&
              props.values.customFields[name]['Value']['west']) ||
            west
          }
          onChangeText={(val) => {
            [
              setWest(val),
              props.setFieldValue(`customFields.${name}`, {
                Type: type,
                Value: {
                  north: north,
                  east: east,
                  south: south,
                  west: val,
                },
              }),
            ];
          }}
          onBlur={props.handleBlur(`customFields.${name}`)}
        />
      </View>
    </View>
  );
}
