import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useContext, useEffect, useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { BackIcon, EditIcon } from '../../../Theme';
import { GetApi, Post, PostWithImage } from '../../Assets/Helpers/Service';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import { checkEmail } from '../../Assets/Helpers/InputsNullChecker';
import { goBack } from '../../../navigationRef';

const Account = () => {
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [submitted, setSubmitted] = useState(false);
  const [user, setuser] = useState(UserContext);
  const [otpfield, setotpfield] = useState(false);
  const [edit, setEdit] = useState(false);
  const cameraRef = createRef();
  const [otpval, setotpval] = useState({
    otp: '',
  });
  const [userDetail, setUserDetail] = useState({
    email: '',
    username: '',
    phone: '',
    img: '',
  });
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    setLoading(true);
    GetApi(`getProfile`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setUserDetail({
            email: res.data.email,
            username: res.data.username,
            phone: res.data.phone,
            img: res.data.img,
          });
        } else {
          // setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const submit = () => {
    console.log(userDetail);
    if (
      userDetail.username === '' ||
      userDetail.phone === ''
      // || userDetail.email === ''
    ) {
      setSubmitted(true);
      return;
    }

    const emailcheck = checkEmail(userDetail.email);
    if (!emailcheck) {
      setToast('Your email id is invalid');
      return;
    }
    // // {userDetail.otp&& data.otp=userDetail.otp}
    // if (otpval.otp) {
    //   data.otp = otpval.otp;
    // }
    const formData = new FormData();
        formData.append('username', userDetail.username);
        formData.append('phone', userDetail.phone);
        formData.append('email', userDetail.email.toLowerCase());
        if (userDetail?.img?.uri) {
          formData.append('img', userDetail?.img);
        }
    setLoading(true);
    PostWithImage('updateprofile', formData).then(
      async res => {
        setLoading(false);
        console.log(res);

        if (res.status) {
          // await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          setToast(res.data.message);

          // if (res.data?.otp) {
          //   setotpfield(true);
          //   setEdit(true);
          // } else {
            setEdit(false);
            // setotpfield(false);
            setuser(res?.data)
            goBack()
            // setotpval({ otp: '' });
          // }
        } else {
          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
    // }
  };
  const getImageValue = async img => {
    setUserDetail({
      ...userDetail,
      img: {
        uri: img.assets[0].uri,
        type: img.assets[0].type,
        name: img.assets[0].fileName,
      },
    });
  };
  console.log('img', userDetail.img);
  const cancel = () => {
    setEdit(false);
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.toppart}>
        <View style={styles.mainpart}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              height: '100%',
            }}
          >
            <BackIcon
              color={Constants.white}
              style={styles.aliself}
              onPress={() => goBack()}
            />
            <Text style={styles.backtxt}>My Account</Text>
          </View>
        </View>
      </View>
      <View style={styles.profilepart}>
        {edit && (
          <Pressable
            style={styles.editiconcov}
            onPress={() => cameraRef.current.show()}
          >
            <EditIcon height={15} color={Constants.white} />
          </Pressable>
        )}
        {userDetail?.img?.uri?<Image
          source={
            userDetail?.img?.uri
              ? {
                  uri: `${userDetail.img.uri}`,
                }
              : require('../../Assets/Images/profile3.png')
          }
          style={styles.proimg}
        />:
        <Image
          source={
            userDetail?.img
              ? {
                  uri: `${userDetail.img}`,
                }
              : require('../../Assets/Images/profile3.png')
          }
          style={styles.proimg}
        />}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ paddingHorizontal: 20, marginVertical: 25 }}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            placeholder="What’s your name?"
            style={[styles.input]}
            value={userDetail.username}
            onChangeText={username =>
              setUserDetail({ ...userDetail, username })
            }
            placeholderTextColor={Constants.customgrey2}
          ></TextInput>
          <View style={styles.inputcov}>
            <Image
              source={require('../../Assets/Images/nigeria.png')}
              style={styles.proimg2}
            />
            <TextInput
              placeholder="Phone Number"
              style={[styles.input2]}
              value={userDetail.phone}
              onChangeText={phone => setUserDetail({ ...userDetail, phone })}
              placeholderTextColor={Constants.customgrey2}
            ></TextInput>
          </View>
          <TextInput
            placeholder="Select your email"
            style={[styles.input]}
            value={userDetail.email}
            onChangeText={email => setUserDetail({ ...userDetail, email })}
            placeholderTextColor={Constants.customgrey2}
          ></TextInput>
          {/* {otpfield && (
            <TextInput
              placeholder="Enter OTP"
              style={[styles.input]}
              value={otpval.otp}
              onChangeText={otp => setotpval({ ...otpval, otp })}
              keyboardType="number-pad"
              placeholderTextColor={Constants.customgrey2}
            ></TextInput>
          )} */}
          {edit ? (
            <TouchableOpacity style={[styles.button]} onPress={submit}>
              <Text style={styles.buttontxt}>Update Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                setEdit(true);
              }}
            >
              <Text style={styles.buttontxt}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={cancel}
      />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  backtxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SfMedium,
  },
  toppart: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Constants.custom_black,
  },
  aliself: {
    alignSelf: 'center',
  },
  mainpart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  proimg: {
    height: 100,
    width: 100,
    borderRadius: 105,
  },
  proimg2: {
    height: 25,
    width: 25,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  protxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  protxt2: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
  },
  profilepart: {
    // width: '100%',
    // alignItems: 'center',
    height: 120,
    width: 120,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 9,
    marginBottom: 20,
  },
  input: {
    height: 60,
    // flex:1,
    backgroundColor: Constants.white,
    color: Constants.black,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingLeft: 10,
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    marginVertical: 10,
  },
  input2: {
    flex: 1,
    backgroundColor: Constants.white,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
  },
  inputcov: {
    height: 60,
    // flex:1,
    backgroundColor: Constants.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
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
});
