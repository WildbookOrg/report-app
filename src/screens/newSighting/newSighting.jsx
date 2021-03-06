import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup';
import * as Permissions from 'expo-permissions';
import screens from '../../constants/screens';
import theme from '../../constants/theme';
import globalStyles from '../../styles/globalStyles';
import styles from '../../styles/newSightingStyles';
import AsyncStorage from '@react-native-community/async-storage';
import sightingFormFields from '../../components/fields/sightingFormFields';
import CustomField from '../../components/CustomField.jsx';
import Typography from '../../components/Typography';
import testSettingsPacket from '../../constants/testSettingsPacket';
import generalValidationSchema from '../../components/fields/validationSchema';
import NetInfo from '@react-native-community/netinfo';
import GeneralFields from '../../components/fields/GeneralFields';
import SightingDetailsFields from '../../components/fields/SightingDetailsFields';
import IndividualInformationFields from '../../components/fields/IndividualInformationFields';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import { ImageSelectContext } from '../../context/imageSelectContext';
import { ReportContext } from '../../context/reportContext';
import UppyComponent from '../../components/UppyComponent';
import testGetReport from '../../constants/testGetReport';
import { baseUrl } from '../../constants/urls';
import axios from 'axios';
import { transformUpload } from '../../components/transformUpload';
import { Buffer } from 'buffer';
import { ActionSheetIOS } from 'react-native';

const NewSighting = ({ navigation }) => {
  const errorData = 'Error no data';
  const settingsPacket = useAsyncStorage('appConfiguration');
  const sightingSubmissions = useAsyncStorage('SightingSubmissions');
  const [formSection, setFormSection] = useState(0); //what is the current section/screen
  const [formFields, setFormFields] = useState({}); //all the custom fields for each category
  const [views, setViews] = useState([]); //the different custom field sections
  const [numCategories, setNumCategories] = useState(null); //number of custom field categories
  const [customValidation, setCustomValidation] = useState('');
  const numGeneralForm = 3; //there are 3 general form screens
  const [imageState, imageStateDispatch] = useContext(ImageSelectContext); //Grab images from imageSelector
  const [reportState, reportDispatch] = useContext(ReportContext);
  const [headers, setHeaders] = useState([
    'General info',
    'Sighting details',
    'Individual info',
  ]);

  const renderImage = (item, i) => {
    return (
      <Image
        style={{
          flexGrow: 1,
          height: 120,
          width: '33%',
        }}
        source={{ uri: item.uri }}
        key={i}
      />
    );
  };

  const saveReport = (newReport) => {
    reportDispatch({ type: 'add', newSighting: newReport });
  };

  const clearImages = () => {
    imageStateDispatch({ type: 'clear' });
  };

  const validationSchema = [];
  generalValidationSchema.map((schema) => {
    validationSchema.push(schema);
  });
  const customPageSchema = yup.object().shape({
    customFields: yup
      .object()
      .shape(customValidation[formSection - numGeneralForm]),
  });
  validationSchema.push(customPageSchema);

  const getConfig = async () => {
    //-----TESTING START-----//
    try {
      // const settingsPacket = await axios(
      //   `${baseUrl}/api/v1/configuration/default/__bundle_setup`
      // );
      await AsyncStorage.setItem(
        'appConfiguration',
        //JSON.stringify(settingsPacket.data.response.configuration)
        JSON.stringify(testSettingsPacket)
      );
    } catch (settingsFetchError) {
      console.error(settingsFetchError);
    }
    //-----TESTING END-----//
    try {
      if (settingsPacket) {
        // console.log(settingsPacket);
        setNumCategories(
          settingsPacket['site.custom.customFieldCategories']['value'].length
        );
        return settingsPacket;
        //setFormFields(value);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (
          formSection === 0 ||
          e.data.action.source.includes('New Sighting')
        ) {
          return;
        }
        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            { text: 'OK', onPress: () => navigation.dispatch(e.data.action) },
          ],
          { cancelable: false }
        );
      }),
    [navigation, formSection]
  );

  const sendReport = async (values) => {
    const data = transformUpload(values, imageState);
    var urlTemp = [];
    var gotReport;
    try {
      const response = await axios.request({
        url: `${baseUrl}/api/v1/sightings/`,
        withCredentials: true,
        method: 'post',
        data,
      });
      if (response) {
        //response.data.result.id
        gotReport = await getReport(response.data.result.id);
        if (gotReport) {
          gotReport.data.encounters[0].assets.map((asset) => {
            urlTemp = [...urlTemp, asset.src];
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    try {
      // const response = await axios.get(
      //   `${baseUrl}/api/v1/sightings/${urlTemp}`
      // );
      var images = [];
      try {
        await axios
          .all(
            urlTemp.map((image) =>
              axios.get(`${baseUrl}${image}`, { responseType: 'arraybuffer' })
            )
          )
          .then(
            axios.spread(function (...res) {
              res.map((image) => {
                images = [
                  ...images,
                  {
                    uri:
                      'data:image/jpg;base64,' +
                      Buffer.from(image.data, 'binary').toString('base64'),
                  },
                ];
              });
              if (gotReport) {
                gotReport.data.encounters[0]['image'] = images;
                saveReport(gotReport.data);
              }
            })
          );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getReport = async (sightingId) => {
    const urlTemp = 'ec09d9b6-ad68-4f2d-81bd-75e375f940be';
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/sightings/${sightingId}`
      );
      if (response) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //sets views to display fields
  const form = async (formikProps) => {
    const appConfig = await getConfig();
    const customRequiredFields = [];
    if (appConfig) {
      const customFields = [];
      const fieldsByCategory = {};
      appConfig['site.custom.customFieldCategories']['value'].map(
        (category) => {
          const fieldDefinitions =
            appConfig[sightingFormFields[category.type]]['value'][
              'definitions'
            ];
          const fields = fieldDefinitions.filter((field) => {
            return (
              field.schema &&
              field.schema.category &&
              field.schema.category === category.id
            );
          });
          const requiredFieldDefinitions = fields.filter(
            (field) => field.required
          );
          const categoryValidation = requiredFieldDefinitions.map((field) => {
            return [field.name, field.type];
          });
          if (fields.length > 0) {
            fieldsByCategory[category.label] = fields;
            customFields.push(category);
            headers.push(category.label);
            if (categoryValidation) {
              const test = categoryValidation.reduce(
                (obj, item) => ({
                  ...obj,
                  [item[0]]:
                    item[1] === 'string'
                      ? yup.string().required('This is Required')
                      : yup.number().required('This is Required'),
                }),
                {}
              );
              customRequiredFields.push(test);
            } else {
              customRequiredFields.push({});
            }
          }
        }
      );
      fieldsByCategory['Regions'] = appConfig['site.custom.regions'];
      setCustomValidation(customRequiredFields); // validation
      setViews(customFields); // category titles for custom fields
      setNumCategories(customFields.length); // number of screens for custom fields
      setFormFields(fieldsByCategory); // fields based on each category
      return customFields.length;
    }
  };

  const progressBarPercentage = (formikProps) => {
    const totalCategories =
      (numCategories || form(formikProps)) + numGeneralForm;
    return ((formSection + 1) / totalCategories) * 100;
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        const newPermission = await ImagePicker.requestCameraRollPermissionsAsync();
        if (newPermission.status !== 'granted') {
          alert(
            'Sorry, we need camera roll permissions in upload photos. Enable them to continue.'
          );
        }
      }
      6;
    })();
  }, []);

  return (
    <View style={styles.container}>
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
          customFields: {},
        }}
        validationSchema={
          validationSchema[
            formSection > numGeneralForm ? numGeneralForm : formSection
          ]
        }
        onSubmit={(values, { resetForm }, formikProps) => {
          if (formSection === numCategories + 2) {
            NetInfo.fetch().then((state) => {
              // console.log(state);
              if (state.isInternetReachable) {
                alert(
                  'Internet Reachable: ' + JSON.stringify(values, undefined, 4)
                );
                sendReport(values);
              } else {
                if (sightingSubmissions) {
                  let updatedSubmissions = sightingSubmissions;
                  updatedSubmissions.push(values);
                  AsyncStorage.setItem(
                    'SightingSubmissions',
                    JSON.stringify(updatedSubmissions)
                  );
                } else {
                  AsyncStorage.setItem(
                    'SightingSubmissions',
                    JSON.stringify([values])
                  );
                }
                alert('No Internet', JSON.stringify(values, undefined, 4));
              }
            });
            resetForm();
            navigation.setOptions({
              headerTitle: headers[0],
            });
            setFormSection(0);
            clearImages();
            navigation.navigate(screens.home);
          } else {
            setFormSection(formSection + 1);
            navigation.setOptions({
              headerTitle: headers[formSection + 1],
            });
          }
        }}
      >
        {(formikProps) => {
          return (
            <>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progress,
                    {
                      width: progressBarPercentage(formikProps) + '%',
                    },
                  ]}
                />
              </View>
              <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                style={styles.keyboardView}
                scrollEnabled
              >
                {formSection === 0 && (
                  <>
                    {imageState.images.length == 0 ? (
                      <View style={styles.addNew}>
                        <TouchableOpacity
                          style={styles.addNewPadded}
                          onPress={() =>
                            navigation.navigate(screens.imageBrowser)
                          }
                        >
                          <Icon
                            name="add-a-photo"
                            type="material"
                            color={theme.black}
                            iconStyle={styles.addText}
                            size={40}
                          />
                          <Typography
                            id="ADD_IMAGES"
                            style={(globalStyles.inputHeader, styles.addText)}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity
                          style={styles.selectedImages}
                          onPress={() =>
                            navigation.navigate(screens.imageBrowser)
                          }
                        >
                          {imageState.images.map((item, i) =>
                            renderImage(item, i)
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                    <UppyComponent />
                    <GeneralFields formikProps={formikProps} />
                    <View style={[styles.horizontal, styles.bottomElement]}>
                      <TouchableOpacity>
                        <View style={[styles.button, globalStyles.invisible]}>
                          <Typography
                            id="BACK"
                            style={globalStyles.buttonText}
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => [
                          formikProps.handleSubmit(),
                          formikProps.setSubmitting(false),
                          //getReport(),
                        ]}
                      >
                        <View style={(globalStyles.button, styles.button)}>
                          <Typography
                            id="NEXT"
                            style={globalStyles.buttonText}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {formSection === 1 && (
                  <>
                    <SightingDetailsFields formikProps={formikProps} />
                    <View style={[styles.horizontal, styles.bottomElement]}>
                      <TouchableOpacity
                        onPress={() => [
                          setFormSection(0),
                          navigation.setOptions({
                            headerTitle: headers[0],
                          }),
                        ]}
                      >
                        <View style={[styles.button, styles.buttonInactive]}>
                          <Typography
                            id="BACK"
                            style={globalStyles.buttonText}
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => [
                          formikProps.handleSubmit(),
                          formikProps.setSubmitting(false),
                        ]}
                      >
                        <View style={styles.button}>
                          <Typography
                            id="NEXT"
                            style={globalStyles.buttonText}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {formSection === 2 && (
                  <>
                    <IndividualInformationFields formikProps={formikProps} />
                    <View style={[styles.horizontal, styles.bottomElement]}>
                      <TouchableOpacity
                        onPress={() => [
                          setFormSection(1),
                          navigation.setOptions({
                            headerTitle: headers[1],
                          }),
                        ]}
                      >
                        <View style={[styles.button, styles.buttonInactive]}>
                          <Typography
                            id="BACK"
                            style={globalStyles.buttonText}
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => [
                          formikProps.handleSubmit(),
                          formikProps.setSubmitting(false),
                        ]}
                      >
                        <View style={styles.button}>
                          <Typography
                            id="NEXT"
                            style={globalStyles.buttonText}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {formSection > 2 ? (
                  <>
                    <React.Suspense fallback="Loading Views...">
                      <View>
                        {views[formSection - numGeneralForm] ? (
                          formFields[
                            views[formSection - numGeneralForm]['label']
                          ].map((item) => {
                            if (
                              item.schema &&
                              item.schema.category &&
                              item.schema.category ===
                                views[formSection - numGeneralForm].id
                            ) {
                              return (
                                <CustomField
                                  key={item.id}
                                  id={item.id}
                                  required={item.required}
                                  schema={item.schema}
                                  name={item.name}
                                  displayType={item.displayType}
                                  props={formikProps}
                                  locationID={
                                    formFields['Regions']['value']['locationID']
                                  }
                                />
                              );
                            }
                          })
                        ) : (
                          <Text style={globalStyles.subText}>{errorData}</Text>
                        )}
                      </View>
                    </React.Suspense>
                    {formSection > 2 && formSection < numCategories + 2 ? (
                      <View style={[styles.horizontal, styles.bottomElement]}>
                        <TouchableOpacity
                          onPress={() => [
                            setFormSection(formSection - 1),
                            form(formikProps),
                            navigation.setOptions({
                              headerTitle: headers[formSection - 1],
                            }),
                          ]}
                        >
                          <View style={[styles.button, styles.buttonInactive]}>
                            <Text style={globalStyles.buttonText}> Back </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => [
                            formikProps.handleSubmit(),
                            formikProps.setSubmitting(false),
                            form(formikProps),
                          ]}
                        >
                          <View style={styles.button}>
                            <Text style={globalStyles.buttonText}>Next</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                    {formSection === numCategories + (numGeneralForm - 1) ? (
                      <View style={[styles.horizontal, styles.bottomElement]}>
                        <TouchableOpacity
                          onPress={() => [
                            setFormSection(formSection - 1),
                            form(formikProps),
                            navigation.setOptions({
                              headerTitle: headers[formSection - 1],
                            }),
                          ]}
                        >
                          <View style={[styles.button, styles.buttonInactive]}>
                            <Typography
                              id="BACK"
                              style={globalStyles.buttonText}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            formikProps.handleSubmit();
                          }}
                          disabled={formikProps.isSubmitting}
                        >
                          <View style={styles.button}>
                            <Typography
                              id="REPORT"
                              style={globalStyles.buttonText}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </>
                ) : null}
              </KeyboardAwareScrollView>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default NewSighting;
