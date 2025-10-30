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

const VendorProfile = () => {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setuser] = useContext(UserContext);
  const [from, setFrom] = useState('');
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState();
  const [userDetail, setUserDetail] = useState({
    username: '',
    shop_name: '',
    address: '',
    country: '',
    phone: '',
    business_license_no: '',
    business_license_img: '',
    tax_reg_img: '',
    tax_reg_no: '',
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
      tax_reg_img: imgobj,
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
      business_license_img: imgobj,
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
        setStatus(res?.data?.verified ? res?.data?.verified : 'Pending');
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
      userDetail.shop_name === '' ||
      !userDetail.shop_name ||
      userDetail.phone === '' ||
      !userDetail.phone ||
      userDetail.tax_reg_img === '' ||
      !userDetail.tax_reg_img ||
      userDetail.business_license_no === '' ||
      !userDetail.business_license_no ||
      userDetail.business_license_img === '' ||
      !userDetail.business_license_img ||
      userDetail.tax_reg_no === '' ||
      !userDetail.tax_reg_no
    ) {
      setSubmitted(true);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('username', userDetail.username);
    formData.append('phone', userDetail.phone);
    formData.append('address', userDetail.address);
    formData.append('location', JSON.stringify(userDetail?.location));
    formData.append('country', userDetail.country);
    formData.append('shop_name', userDetail.shop_name);
    formData.append('tax_reg_no', userDetail.tax_reg_no);
    formData.append('business_license_no', userDetail.business_license_no);
    if (userDetail?.business_license_img?.uri) {
      formData.append('business_license_img', userDetail?.business_license_img);
    }
    if (userDetail?.tax_reg_img?.uri) {
      formData.append('tax_reg_img', userDetail?.tax_reg_img);
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
            style={styles.headercov}
          >
            <BackIcon
              height={25}
              width={25}
              color={Constants.white}
              onPress={() => goBack()}
            />
            <Text style={styles.headtxt}>Profile</Text>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 10,marginLeft:20}}>
                  <Text style={styles.statustxt}>Verification Status -</Text>
                  <Text style={[styles.statustxt, {color: '#fab905', marginLeft: 3}]}>
                    {status}
                  </Text>
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
          <Text style={styles.name}>Store Name</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              editable={edit}
              // autoCapitalize="characters"
              //   placeholder="Enter Name"
              placeholderTextColor={Constants.customgrey2}
              value={userDetail?.shop_name}
              onChangeText={shop_name =>
                setUserDetail({ ...userDetail, shop_name: shop_name })
              }
            />
          </View>
          {submitted &&
            (userDetail.shop_name === '' || !userDetail.shop_name) && (
              <Text style={styles.require}>Store Name is required</Text>
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
          <Text style={styles.name}>Tax Number</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              editable={edit}
              placeholderTextColor={Constants.customgrey2}
              value={userDetail?.tax_reg_no}
              onChangeText={tax_reg_no => {
                setUserDetail({
                  ...userDetail,
                  tax_reg_no: tax_reg_no,
                });
                console.log(userDetail.tax_reg_no);
              }}
            />
          </View>
          {submitted && !userDetail?.tax_reg_no && (
            <Text style={styles.require}>
              Tax Registration Number is required
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
              <Text style={styles.uploadtxt}>Tax Registration</Text>
            </TouchableOpacity>
            <View style={styles.uploadimgbox}>
              {userDetail?.tax_reg_img && (
                <Image
                  source={{
                    uri: userDetail?.tax_reg_img?.uri
                      ? userDetail?.tax_reg_img?.uri
                      : userDetail?.tax_reg_img,
                  }}
                  style={styles.imgstyle2}
                />
              )}
            </View>
          </View>
          {submitted && !userDetail?.tax_reg_img && (
            <Text style={styles.require}>Business License is required</Text>
          )}
          <Text style={styles.name}>Business License Number</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.input, styles.shadowProp2]}
              editable={edit}
              placeholderTextColor={Constants.customgrey2}
              value={userDetail?.business_license_no}
              onChangeText={business_license_no => {
                setUserDetail({
                  ...userDetail,
                  business_license_no: business_license_no,
                });
                console.log(userDetail.business_license_no);
              }}
            />
          </View>
          {submitted &&
            (userDetail.business_license_no === '' ||
              !userDetail.business_license_no) && (
              <Text style={styles.require}>Tax Registration is required</Text>
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
              <Text style={styles.uploadtxt}>Business License</Text>
            </TouchableOpacity>
            <View style={styles.uploadimgbox}>
              {userDetail?.business_license_img && (
                <Image
                  source={{
                    uri: userDetail?.business_license_img?.uri
                      ? userDetail?.business_license_img.uri
                      : userDetail.business_license_img,
                  }}
                  style={styles.imgstyle2}
                />
              )}
            </View>
          </View>

          {submitted && !userDetail?.business_license_img && (
            <Text style={styles.require}>Business License is required</Text>
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

export default VendorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 10 : 20,
  },
  headercov:{
              flexDirection: 'row',
              gap: 20,
              alignItems: 'center',
              marginLeft: 20,
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
