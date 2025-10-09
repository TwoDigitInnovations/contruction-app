import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  Keyboard,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { GetApi, PostWithImage } from '../../Assets/Helpers/Service';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import { BackIcon, EditIcon, UploadIcon } from '../../../Theme';
import { goBack, reset } from '../../../navigationRef';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import { useIsFocused } from '@react-navigation/native';
import LocationDropdown from '../../Assets/Component/LocationDropdown';

const DriverProfile = () => {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setuser] = useContext(UserContext);
  const [from, setFrom] = useState('');
  const [edit, setEdit] = useState(false);
  const [userDetail, setUserDetail] = useState({
    username: '',
    address: '',
    country: '',
    phone: '',
    vehicle_doc_no: '',
    vehicle_doc_img: '',
    driving_licence_img: '',
    driving_licence_no: '',
  });

  const cameraRef = createRef();
  const cameraRef2 = createRef();
  const cameraRef3 = createRef();

  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      getProfile();
    }
  }, [IsFocused]);

  const getImageValue = async img => {
    const imgobj = {
      uri: img.assets[0].uri,
      type: img.assets[0].type,
      name: img.assets[0].fileName,
    };
    setUserDetail({
      ...userDetail,
      driving_licence_img: imgobj,
    });
  };
  console.log('img', userDetail);
  const cancel = () => {
    setEdit(false);
  };
  const getImageValue2 = async img => {
    const imgobj = {
      uri: img.assets[0].uri,
      type: img.assets[0].type,
      name: img.assets[0].fileName,
    };
    setUserDetail({
      ...userDetail,
      vehicle_doc_img: imgobj,
    });
  };
  const getImageValue3 = async img => {
    const imgobj = {
      uri: img.assets[0].uri,
      type: img.assets[0].type,
      name: img.assets[0].fileName,
    };
    setUserDetail({
      ...userDetail,
      img: imgobj,
    });
  };

  const getProfile = () => {
    setLoading(true);
    GetApi(`getProfile`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        setUserDetail({
          ...res?.data,
          phone: res?.data?.phone ?? user?.phone ?? '',
          username: res?.data?.username ?? user?.username ?? '',
        });
        setuser(res?.data)
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const submit = async () => {
    console.log(userDetail);
    if (
      userDetail.username === '' ||
      !userDetail.username ||
      userDetail.address === '' ||
      !userDetail.address ||
      userDetail.country === '' ||
      !userDetail.country ||
      userDetail.phone === '' ||
      !userDetail.phone ||
      userDetail.driving_licence_img === '' ||
      !userDetail.driving_licence_img ||
      userDetail.vehicle_doc_no === '' ||
      !userDetail.vehicle_doc_no ||
      userDetail.vehicle_doc_img === '' ||
      !userDetail.vehicle_doc_img ||
      userDetail.driving_licence_no === '' ||
      !userDetail.driving_licence_no
    ) {
      setSubmitted(true);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('username', userDetail.username);
    formData.append('phone', userDetail.phone);
    formData.append('address', userDetail.address);
    formData.append('country', userDetail.country);
    formData.append('driving_licence_no', userDetail.driving_licence_no);
    formData.append('vehicle_doc_no', userDetail.vehicle_doc_no);
    if (userDetail?.vehicle_doc_img?.uri) {
      formData.append('vehicle_doc_img', userDetail?.vehicle_doc_img);
    }
    if (userDetail?.driving_licence_img?.uri) {
      formData.append('driving_licence_img', userDetail?.driving_licence_img);
    }
    if (userDetail?.img?.uri) {
      formData.append('img', userDetail?.img);
    }
    PostWithImage('updateProfile', formData).then(
      async res => {
        setLoading(false);
        console.log(res);

        if (res.status) {
            setEdit(false);
          getProfile();
          goBack()
        } else {
        }
      },
      err => {
        setLoading(false);
        console.log(err);
        // setToast(res?.message);
        setToast([{ error: true, message: res.message }]);
      },
    );
  };
  const getLocationVaue = (lat, add, set) => {
    console.log('lat=======>', lat);
    console.log('add=======>', add);
    setUserDetail({
      ...userDetail,
      address: add,
      location: {
        type: 'Point',
        coordinates: [lat.lng, lat.lat],
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={[styles.container]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              alignItems: 'center',
              marginLeft: 20,
            }}
          >
            <BackIcon
              height={25}
              width={25}
              color={Constants.white}
              onPress={() => goBack()}
            />
            <Text style={styles.headtxt}>Profile</Text>
          </View>
          <View style={styles.profilepart}>
            {edit && (
              <Pressable
                style={styles.editiconcov}
                onPress={() => cameraRef3.current.show()}
              >
                <EditIcon height={15} color={Constants.white} />
              </Pressable>
            )}
            {userDetail?.img?.uri ? (
              <Image
                source={
                  userDetail?.img?.uri
                    ? {
                        uri: `${userDetail.img.uri}`,
                      }
                    : require('../../Assets/Images/profile3.png')
                }
                style={styles.proimg}
              />
            ) : (
              <Image
                source={
                  userDetail?.img
                    ? {
                        uri: `${userDetail.img}`,
                      }
                    : require('../../Assets/Images/profile3.png')
                }
                style={styles.proimg}
              />
            )}
          </View>
          <Text style={styles.name}>Full Name</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              placeholder="Enter Name"
              editable={edit}
              value={userDetail?.username}
              onChangeText={username =>
                setUserDetail({ ...userDetail, username })
              }
              placeholderTextColor={Constants.customgrey2}
            />
          </View>
          {submitted &&
            (userDetail.username === '' || !userDetail.username) && (
              <Text style={styles.require}>Name is required</Text>
            )}
          <Text style={styles.name}>Country</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              editable={edit}
              // placeholder="Enter Country"
              placeholderTextColor={Constants.customgrey2}
              value={userDetail?.country}
              onChangeText={country =>
                setUserDetail({ ...userDetail, country })
              }
            />
          </View>
          {submitted && (userDetail.country === '' || !userDetail.country) && (
            <Text style={styles.require}>Country is required</Text>
          )}
          <Text style={styles.name}>Address</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.input, styles.shadowProp2]}>
              <LocationDropdown
                value={userDetail?.address || ''}
                focus={from === 'location'}
                setIsFocus={setFrom}
                from="location"
                getLocationVaue={(lat, add) => getLocationVaue(lat, add)}
              />
            </View>
          </View>
          {submitted && (userDetail.address === '' || !userDetail.address) && (
            <Text style={styles.require}>Address is required</Text>
          )}
          <Text style={styles.name}>Phone Number</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              //   placeholder="Enter Name"
              // maxLength={10}
              editable={edit}
              placeholderTextColor={Constants.customgrey2}
              keyboardType="number-pad"
              value={userDetail?.phone}
              onChangeText={phone => setUserDetail({ ...userDetail, phone })}
            />
          </View>
          {submitted && (userDetail.phone === '' || !userDetail.phone) && (
            <Text style={styles.require}>Number is required</Text>
          )}
          <Text style={styles.name}>Driving License Number</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              editable={edit}
              placeholderTextColor={Constants.customgrey2}
              value={userDetail?.driving_licence_no}
              onChangeText={driving_licence_no => {
                setUserDetail({
                  ...userDetail,
                  driving_licence_no: driving_licence_no,
                });
                console.log(userDetail.driving_licence_no);
              }}
            />
          </View>
          {submitted && !userDetail?.driving_licence_no && (
            <Text style={styles.require}>
              License Number is required
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              height: 100,
              marginVertical: 15,
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={styles.uploadbox}
              disabled={!edit}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => {
                  cameraRef.current.show();
                }, 100);
              }}
            >
              <UploadIcon
                color={Constants.custom_yellow}
                height={'90%'}
                width={'100%'}
              />
              <Text style={styles.uploadtxt}>Driving License</Text>
            </TouchableOpacity>
            <View style={styles.uploadimgbox}>
              {userDetail?.driving_licence_img && (
                <Image
                  source={{
                    uri: userDetail?.driving_licence_img?.uri
                      ? userDetail?.driving_licence_img?.uri
                      : userDetail?.driving_licence_img,
                  }}
                  style={styles.imgstyle2}
                />
              )}
            </View>
          </View>
          {submitted && !userDetail?.driving_licence_img && (
            <Text style={styles.require}>License Image is required</Text>
          )}
          <Text style={styles.name}>Vehicle Document Number</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              editable={edit}
              placeholderTextColor={Constants.customgrey2}
              value={userDetail?.vehicle_doc_no}
              onChangeText={vehicle_doc_no => {
                setUserDetail({
                  ...userDetail,
                  vehicle_doc_no: vehicle_doc_no,
                });
                console.log(userDetail.vehicle_doc_no);
              }}
            />
          </View>
          {submitted &&
            (userDetail.vehicle_doc_no === '' ||
              !userDetail.vehicle_doc_no) && (
              <Text style={styles.require}>Vehicle Document is required</Text>
            )}

          <View
            style={{ flexDirection: 'row', height: 100, marginVertical: 15 }}
          >
            <TouchableOpacity
              style={styles.uploadbox}
              disabled={!edit}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => {
                  cameraRef2.current.show();
                }, 100);
              }}
            >
              <UploadIcon
                color={Constants.custom_yellow}
                height={'90%'}
                width={'100%'}
              />
              <Text style={styles.uploadtxt}>Vehicle Document</Text>
            </TouchableOpacity>
            <View style={styles.uploadimgbox}>
              {userDetail?.vehicle_doc_img && (
                <Image
                  source={{
                    uri: userDetail?.vehicle_doc_img?.uri
                      ? userDetail?.vehicle_doc_img.uri
                      : userDetail.vehicle_doc_img,
                  }}
                  style={styles.imgstyle2}
                />
              )}
            </View>
          </View>

          {submitted && !userDetail?.vehicle_doc_img && (
            <Text style={styles.require}>Vehicle Document is required</Text>
          )}

          {edit ? (
                      <TouchableOpacity style={[styles.signInbtn]} onPress={submit}>
                        <Text style={styles.buttontxt}>Update Profile</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.signInbtn]}
                        onPress={() => {
                          setEdit(true);
                        }}
                      >
                        <Text style={styles.buttontxt}>Edit Profile</Text>
                      </TouchableOpacity>
                    )}

          <CameraGalleryPeacker
            refs={cameraRef}
            getImageValue={getImageValue}
            base64={false}
            cancel={cancel}
          />
          <CameraGalleryPeacker
            refs={cameraRef2}
            getImageValue={getImageValue2}
            base64={false}
            cancel={cancel}
          />
          <CameraGalleryPeacker
            refs={cameraRef3}
            getImageValue={getImageValue3}
            base64={false}
            cancel={cancel}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 10 : 20,
  },
  signInbtn: {
    height: 60,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: Constants.custom_yellow,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
  },
  headtxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  statustxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.SfSemiBold,
  },
  aliself: {
    alignSelf: 'center',
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
  },
  imgstyle: {
    height: '80%',
    width: '80%',
    // flex:1,
    resizeMode: 'contain',
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
    fontSize: 16,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },

  ///model///
  modal: {
    // height: '40%',
    width: '85%',
    backgroundColor: Constants.black,
    borderRadius: 5,
  },
  box2: {
    padding: 20,
  },
  modtxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  button2: {
    backgroundColor: Constants.custom_yellow,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // marginBottom: 10,
    borderRadius: 10,
  },
  buttontxt2: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },

  input: {
    // height:60,
    flex: 1,
    backgroundColor: Constants.light_black,
    color: Constants.white,
    borderRadius: 10,
    paddingLeft: 10,
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  inputbox: {
    height: 60,
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 10,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  name: {
    color: Constants.white,
    fontSize: 12,
    fontFamily: FONTS.Regular,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  proimg: {
    height: 100,
    width: 100,
    borderRadius: 105,
  },
  editiconcov: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Constants.custom_yellow,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // marginTop: 115,
    right: 0,
    bottom: 10,
    zIndex: 9,
  },
  profilepart: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 9,
    marginBottom: 20,
  },
});
