import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Header from '../../Assets/Component/Header';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { RadioButton } from 'react-native-paper';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { CrossIcon, UploadIcon } from '../../../Theme';
import { navigate } from '../../../navigationRef';
import moment, { duration } from 'moment';
import DatePicker from 'react-native-date-picker';
import { GetApi, Post, PostWithImage } from '../../Assets/Helpers/Service';
import {
  AddressContext,
  LoadContext,
  LocationContext,
  ProjectctContext,
  ToastContext,
  UserContext,
} from '../../../App';
import LocationDropdown from '../../Assets/Component/LocationDropdown';
import { keepLocalCopy, pick } from '@react-native-documents/picker';

const Project = () => {
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [project, setproject] = useContext(ProjectctContext);
  const [user, setuser] = useContext(UserContext);
  const [jobtype, setjobtype] = useState('New');
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectlist, setprojectlist] = useState([]);
  const [from, setFrom] = useState('');
  const [projectdata, setprojectdata] = useState({
    name: '',
    projectname: '',
    location: null,
    address: '',
    startdate: new Date(),
    duration: '',
    billOfQuentity: '',
  });
  const mapRef = useRef(null);

  useEffect(() => {
    getprojects();
  }, []);
  useEffect(() => {
  setprojectdata(prev => ({
    ...prev,
    name: user?.username,
    address: locationadd,
    location: currentLocation
  }));
}, [locationadd, currentLocation, user]);

  const openpopup = () => {
    if (
      projectdata.name === '' ||
      projectdata.projectname === '' ||
      projectdata.address === '' ||
      projectdata.duration === ''
    ) {
      setSubmitted(true);
      return;
    }
    setModalVisible(true);
  };
  const getprojects = () => {
    setLoading(true);
    GetApi('getProjectbyuser').then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setprojectlist(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const submit = () => {
    const formData = new FormData();
    formData.append('billOfQuentity', projectdata.billOfQuentity);
    formData.append('name', projectdata.name);
    formData.append(
      'location',
      JSON.stringify({
        type: 'Point',
        coordinates: [
          projectdata?.location?.longitude,
          projectdata?.location?.latitude,
        ],
      }),
    );
    formData.append('startdate', new Date(projectdata.startdate).toISOString());
    formData.append('address', projectdata.address);
    formData.append('duration', projectdata.duration);
    formData.append('projectname', projectdata.projectname);
    setLoading(true);
    PostWithImage('createProject', formData).then(
      async res => {
        setLoading(false);
        setSubmitted(false);
        console.log(res);
        if (res.status) {
          setModalVisible(false);
          setjobtype('Existing');
          setToast(res.data.message);
          setprojectdata({
            name: '',
            location: null,
            projectname: '',
            startdate: new Date(),
            address: '',
            billOfQuentity: '',
            duration: '',
          });
          getprojects();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
    // }
  };
  const getLocationVaue = (lat, add) => {
    setprojectdata({
      ...projectdata,
      location: { latitude: lat.lat, longitude: lat.lng },
      address: add,
    });
  };
  return (
    <View style={styles.container}>
      <Header />
      <RadioButton.Group
        onValueChange={type => {
          setjobtype(type);
        }}
        value={jobtype}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <RadioButton.Item
            mode="android"
            label={'New Project'} //Organization
            value="New"
            position="leading"
            color={Constants.white}
            uncheckedColor={Constants.customgrey}
            labelStyle={{
              color: jobtype === 'New' ? Constants.white : Constants.customgrey,
              fontSize: 16,
              fontWeight: '700',
            }}
            // labelVariant="displayLarge"
          />
          <RadioButton.Item
            mode="android"
            // style={{fontSize: 12}}
            label={'Existing Project'} //Individual
            value="Existing"
            position="leading"
            color={Constants.white}
            uncheckedColor={Constants.customgrey}
            labelStyle={{
              color:
                jobtype === 'Existing' ? Constants.white : Constants.customgrey,
              fontSize: 16,
              fontWeight: '700',
            }}
          />
        </View>
      </RadioButton.Group>
      {jobtype === 'New' ? (
        <View style={{ flex: 1 }}>
          {currentLocation?.longitude && currentLocation?.latitude && (
            <MapView
              // key={projectdata?.location}
              ref={mapRef}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: projectdata?.location?.latitude
                  ? projectdata?.location?.latitude
                  : currentLocation?.latitude,
                longitude: projectdata?.location?.longitude
                  ? projectdata?.location?.longitude
                  : currentLocation?.longitude,
                latitudeDelta: 0.315,
                longitudeDelta: 0.3121,
              }}
              showsUserLocation={true}
            >
              <Marker
                coordinate={{
                  latitude: projectdata?.location?.latitude
                    ? projectdata?.location?.latitude
                    : currentLocation?.latitude,
                  longitude: projectdata?.location?.longitude
                    ? projectdata?.location?.longitude
                    : currentLocation?.longitude,
                }}
                title={'Sourse'}
              />
            </MapView>
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.btmpart}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={require('../../Assets/Images/project.png')}
                style={styles.titleimg}
              />
              <View style={[styles.inputbox, styles.shadowProp]}>
                <TextInput
                  placeholder="Name"
                  style={[styles.input, styles.shadowProp2]}
                  value={projectdata.name}
                  onChangeText={name =>
                    setprojectdata({ ...projectdata, name })
                  }
                  placeholderTextColor={Constants.customgrey2}
                ></TextInput>
              </View>
              {submitted && projectdata.name === '' && (
                <Text style={styles.require}>Name is required</Text>
              )}
              <View style={[styles.inputbox, styles.shadowProp]}>
                <TextInput
                  placeholder="Project Name"
                  style={[styles.input, styles.shadowProp2]}
                  value={projectdata.projectname}
                  onChangeText={projectname =>
                    setprojectdata({ ...projectdata, projectname })
                  }
                  placeholderTextColor={Constants.customgrey2}
                ></TextInput>
              </View>
              {submitted && projectdata.projectname === '' && (
                <Text style={styles.require}>Project Name is required</Text>
              )}
              <View style={[styles.inputbox, styles.shadowProp]}>
                <View style={[styles.input, styles.shadowProp2]}>
                  <LocationDropdown
                    value={projectdata.address}
                    focus={from}
                    setIsFocus={setFrom}
                    placeholder="location"
                    getLocationVaue={(lat, add) => getLocationVaue(lat, add)}
                  />
                </View>
              </View>
              {submitted && projectdata.location === '' && (
                <Text style={styles.require}>Location is required</Text>
              )}
              <TouchableOpacity
                style={[styles.inputbox, styles.shadowProp]}
                onPress={() => setOpen(true)}
              >
                <View style={[styles.input3, styles.shadowProp2, {}]}>
                  <Text style={styles.stattxt}>Start Date</Text>
                  <TextInput
                    placeholder="Start Date"
                    style={[styles.input2]}
                    value={moment(projectdata?.startdate).format('DD/MM/YYYY ')}
                    editable={false}
                    placeholderTextColor={Constants.customgrey2}
                  ></TextInput>
                </View>
              </TouchableOpacity>
              <DatePicker
                // style={{zIndex: '50'}}
                modal
                open={open}
                minimumDate={new Date()}
                mode="date"
                theme="dark"
                // maximumDate={maxDate}
                // androidVariant="nativeAndroid"
                date={projectdata?.startdate}
                onConfirm={date => {
                  setOpen(false);
                  setprojectdata({ ...projectdata, startdate: date });
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              <View style={[styles.inputbox, styles.shadowProp]}>
                <TextInput
                  placeholder="Duration of Project."
                  style={[styles.input, styles.shadowProp2]}
                  value={projectdata.duration}
                  onChangeText={duration =>
                    setprojectdata({ ...projectdata, duration })
                  }
                  placeholderTextColor={Constants.customgrey2}
                ></TextInput>
              </View>
              {submitted && projectdata.duration === '' && (
                <Text style={styles.require}>Duration is required</Text>
              )}
              {/* <View
          style={styles.uplocov}>
          <TouchableOpacity
            style={styles.uploadbox}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                cameraRef.current.show();
              }, 100);
            }}>
            <UploadIcon
              color={Constants.custom_yellow}
              height={'90%'}
              width={'100%'}
            />
            <Text style={styles.uploadtxt}>Upload Bill of Quentity</Text>
          </TouchableOpacity>
          <View style={styles.uploadimgbox}>
            {projectdata?.billOfQuentity?.uri && (
              <Image
                source={{
                  uri: projectdata?.billOfQuentity?.uri,
                }}
                style={styles.imgstyle2}
              />
            )}
          </View>
        </View> */}
              <TouchableOpacity
                style={[styles.inputbox, styles.shadowProp]}
                onPress={async () => {
                  try {
                    const res = await pick();
                    console.log(res);
                    const [copyResult] = await keepLocalCopy({
                      files: [
                        {
                          uri: res[0].uri,
                          fileName: res[0].name ?? 'fallback-name',
                        },
                      ],
                      destination: 'documentDirectory',
                    });
                    if (copyResult.status === 'success') {
                      // do something with the local copy:
                      console.log(copyResult.localUri);
                      setprojectdata({
                        ...projectdata,
                        billOfQuentity: {
                          name: res[0].name,
                          type: res[0].nativeType,
                          uri: copyResult.localUri,
                        },
                      });
                    }
                  } catch (err) {}
                }}
              >
                <TextInput
                  placeholder="Upload Bill of Quentity"
                  editable={false}
                  style={[
                    styles.input,
                    styles.shadowProp2,
                    { paddingRight: 60 },
                  ]}
                  value={projectdata?.billOfQuentity?.uri}
                  placeholderTextColor={Constants.customgrey2}
                ></TextInput>
                <UploadIcon
                  color={Constants.custom_yellow}
                  height={35}
                  width={35}
                  style={styles.uploicon}
                />
              </TouchableOpacity>
              {submitted && !projectdata?.billOfQuentity?.uri && (
                <Text style={styles.require}>Bill of Quentity is required</Text>
              )}
              <TouchableOpacity
                style={[styles.button, styles.shadowProp]}
                onPress={() => openpopup()}
              >
                <Text style={styles.buttontxt}>Next</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      ) : (
        <View style={{ marginBottom: 120 }}>
          <FlatList
            data={projectlist}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.inputbox2, styles.shadowProp]}
                onPress={() => {setproject(item?._id),navigate('App')}}
              >
                <View style={[styles.inrshabox, styles.shadowProp2]}>
                  <Image
                    source={require('../../Assets/Images/projectbox.png')}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.boxtext}>{item.name}</Text>
                    <Text style={styles.boxtext}>{item.projectname}</Text>
                    <Text style={styles.boxtext}>{item.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: Dimensions.get('window').height - 200,
                }}
              >
                <Text
                  style={{
                    color: Constants.white,
                    fontSize: 20,
                    fontFamily: FONTS.SemiBold,
                  }}
                >
                  No Projects
                </Text>
              </View>
            )}
          />
        </View>
      )}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CrossIcon
              height={20}
              width={20}
              style={{ alignSelf: 'flex-end' }}
              color={Constants.black}
              onPress={() => setModalVisible(!modalVisible)}
            />
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Do you want to save this project ?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={[styles.cancelButtonStyle, styles.shadowProp]}
                >
                  <Text
                    style={[
                      styles.modalText,
                      { color: Constants.custom_yellow },
                    ]}
                  >
                    NO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.logOutButtonStyle, styles.shadowProp]}
                  onPress={() => submit()}
                >
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  map: {
    height: '30%',
  },
  btmpart: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // marginTop:-20,
    // borderTopLeftRadius:25,
    // borderTopRightRadius:25,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 10,
  },
  input: {
    // height:60,
    flex: 1,
    backgroundColor: Constants.light_black,
    color: Constants.white,
    borderRadius: 10,
    paddingLeft: 20,
    // shadowColor: '#FFFFFF',
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 5,
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  input2: {
    // height:60,
    flex: 1,
    // backgroundColor: Constants.red,
    color: Constants.white,
    // borderRadius: 10,
    // paddingLeft: 20,
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  stattxt: {
    color: Constants.white,
    // borderRadius: 10,
    // paddingLeft: 20,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    alignSelf: 'center',
  },
  input3: {
    // height:60,
    flex: 1,
    backgroundColor: Constants.light_black,
    borderRadius: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    gap: 10,
  },
  inputbox: {
    height: 60,
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 10,
  },
  inputbox2: {
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  titleimg: {
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 10,
    marginBottom: 50,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },

  textStyle: {
    color: Constants.black,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: FONTS.Medium,
  },
  modalText: {
    color: Constants.white,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 5,
  },
  cancelButtonStyle: {
    flex: 0.5,
    // backgroundColor: Constants.black,
    borderColor: Constants.custom_yellow,
    borderWidth: 1.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 15,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.custom_yellow,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  inrshabox: {
    // margin:10,
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    flexDirection: 'row',
    padding: 5,
  },
  boxtext: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    flex: 1,
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 14,
    marginVertical: 5,
  },
  uplocov: {
    flexDirection: 'row',
    height: 100,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },

  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
  },
  imgstyle2: {
    height: '100%',
    width: '100%',
    // flex:1,
    resizeMode: 'contain',
  },
  uploadbox: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor:Constants.red
  },
  uploadimgbox: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor:Constants.red
  },
  uploadtxt: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    lineHeight: 17,
  },
  uploicon: {
    position: 'absolute',
    right: 10,
    zIndex: 99,
    alignSelf: 'center',
  },
});
