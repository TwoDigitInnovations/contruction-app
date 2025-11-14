import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ScrollView,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import styles from './styles';
import Navigation from '../../navigation';
import {useNavigation} from '@react-navigation/native';
import {navigate, reset} from '../../../navigationRef';
import {Post} from '../../Assets/Helpers/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoadContext, ToastContext} from '../../../App';
import Constants from '../../Assets/Helpers/constant';
import {checkEmail} from '../../Assets/Helpers/InputsNullChecker';
import LocationDropdown from '../../Assets/Component/LocationDropdown';
import {PERMISSIONS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import GetCurrentAddressByLatLong from '../../Assets/Component/GetCurrentAddressByLatLong';

const SignUp = props => {
  const [showPass, setShowPass] = useState(true);
  const [user, setuser] = useState(0);
  const [from, setFrom] = useState('');
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [location, setlocation] = useState(null);
  const [locationadd, setlocationadd] = useState(null);
  const [shopname, setshopname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    password: '',
    username: '',
    phone: '',
    email: '',
    // otp: '',
    type: 'USER',
  });
  useEffect(() => {
    // CustomCurrentLocation();
  }, []);
  const submit = () => {
    if (
      userDetail.username === '' ||
      userDetail.password === '' ||
      userDetail.phone === '' ||
      userDetail.email === ''
    ) {
      setSubmitted(true);
      return;
    }
    const emailcheck = checkEmail(userDetail.email.trim());
    if (!emailcheck) {
      setToast('Your email id is invalid');
      return;
    }
    userDetail.email = userDetail.email.toLowerCase().trim();
    // if (userDetail.type === 'VENDOR') {
    //   if (location?.latitude && location?.longitude) {
    //     userDetail.location = {
    //       type: 'Point',
    //       coordinates: [location.longitude, location.latitude],
    //     };
    //   } else {
    //     CustomCurrentLocation();
    //     return;
    //   }
    // }
    // if (userDetail.type === 'VENDOR') {
    //   if (locationadd) {
    //     userDetail.shop_address = locationadd;
    //   }
    //   if (shopname === '') {
    //     setSubmitted(true);
    //     return;
    //   } else {
    //     userDetail.shop_name = shopname;
    //   }
    // }

    console.log('data==========>', userDetail);
    setLoading(true);
    Post('signUp', userDetail, {...props}).then(
      async res => {
        setSubmitted(false);
        setLoading(false);
        console.log(res);
        if (res.success) {
          setUserDetail({
            password: '',
            username: '',
            type: 'USER',
          });
          navigate('SignIn');
          setToast('Registered Successfully');
        } else {
          console.log('error------>', res);
          if (res.message !== undefined) {
            setToast(res.message);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
        setSubmitted(false);
      },
    );
  };
  const getLocationVaue = (lat, add, set) => {
    console.log('lat=======>', lat);
    console.log('add=======>', add);
    setlocationadd(add);
    setlocation({
      latitude: lat.lat,
      longitude: lat.lng,
    });
  };
  const CustomCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
          console.log(result);
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              position => {
                // setlocation(position);
              },
              error => {
                console.log(error.code, error.message);
                //   return error;
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }
        });
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
              setlocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              GetCurrentAddressByLatLong({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              }).then(res => {
                console.log('res===>', res);
                setlocationadd(res.results[0].formatted_address);
              });
            },
            error => {
              console.log(error.code, error.message);
              //   return error;
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          console.log('location permission denied');
        }
      }
    } catch (err) {
      console.log('location err =====>', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{height: '40%'}}>
        <ImageBackground
          source={require('../../Assets/Images/topbg.png')}
          style={styles.imgbg}
          resizeMode="stretch">
          <Image
            source={require('../../Assets/Images/signup.png')}
            style={styles.titleimg}
          />
        </ImageBackground>
      </View>
      <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex:1}}
                  >
      <ScrollView style={styles.btmpart} showsVerticalScrollIndicator={false}>
        <View style={[styles.btnCov, styles.shadowProp]}>
          <TouchableOpacity
            style={[user === 0 ? styles.selectBtn : styles.unselectBtn]}
            onPress={() => {
              setuser(0);
              userDetail.type = 'USER';
            }}>
            <View style={user === 0 ? styles.selectshad : null}>
              <Text style={[styles.btntxt]}>Client</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[user === 1 ? styles.selectBtn : styles.unselectBtn]}
            onPress={() => {
              setuser(1);
              userDetail.type = 'VENDOR';
            }}>
            <View style={user === 1 ? styles.selectshad : null}>
              <Text style={[styles.btntxt]}>Vendor</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[user === 2 ? styles.selectBtn : styles.unselectBtn]}
            onPress={() => {
              setuser(2);
              userDetail.type = 'DRIVER';
            }}>
            <View style={user === 2 ? styles.selectshad : null}>
              <Text style={[styles.btntxt]}>Driver</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* {userDetail.type === 'VENDOR' && (
          <View>
            <Text style={styles.btmtext}>Address</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <View style={[styles.input, styles.shadowProp2]}>
                <LocationDropdown
                  value={locationadd}
                  focus={from === 'location'}
                  setIsFocus={setFrom}
                  from="location"
                  getLocationVaue={(lat, add) => getLocationVaue(lat, add)}
                />
              </View>
            </View>
            {submitted &&
              userDetail?.location?.latitude === '' &&
              !userDetail?.location?.latitude && (
                <Text style={styles.require}>Address is required</Text>
              )}
          </View>
        )}
       {userDetail.type==='VENDOR'&& <View>
          <Text style={styles.btmtext}>Shop Name</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              placeholder="Enter your shop name"
              style={[styles.input, styles.shadowProp2]}
              value={shopname}
              onChangeText={e => setshopname(e)}
              placeholderTextColor={Constants.customgrey2}></TextInput>
          </View>
          {submitted && shopname === '' && (
            <Text style={styles.require}>Shop Name is required</Text>
          )}
        </View>} */}
        <Text style={styles.btmtext}>Full Name</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your name"
            style={[styles.input, styles.shadowProp2]}
            value={userDetail.username}
            onChangeText={username => setUserDetail({...userDetail, username})}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        {submitted && userDetail.username === '' && (
          <Text style={styles.require}>Name is required</Text>
        )}

        <Text style={styles.btmtext}>Email</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your email"
            style={[styles.input, styles.shadowProp2]}
            value={userDetail.email}
            onChangeText={email => setUserDetail({...userDetail, email})}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        {submitted && userDetail.email === '' && (
          <Text style={styles.require}>Email is required</Text>
        )}
        <Text style={styles.btmtext}>Phone Number</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your number"
            style={[styles.input, styles.shadowProp2]}
            keyboardType='number-pad'
            value={userDetail.phone}
            onChangeText={phone => setUserDetail({...userDetail, phone})}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        {submitted && userDetail.phone === '' && (
          <Text style={styles.require}>Number is required</Text>
        )}

        <Text style={styles.btmtext}>Password</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter password"
            style={[styles.input, styles.shadowProp2]}
            placeholderTextColor={Constants.customgrey2}
            value={userDetail.password}
            onChangeText={password => setUserDetail({...userDetail, password})}
            secureTextEntry={showPass}></TextInput>
          <TouchableOpacity
            onPress={() => {
              setShowPass(!showPass);
            }}
            style={[styles.iconView, {borderRightWidth: 0}]}>
            <Image
              source={
                showPass
                  ? require('../../Assets/Images/eye-1.png')
                  : require('../../Assets/Images/eye.png')
              }
              style={{height: 22, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {submitted && userDetail.password === '' && (
          <Text style={styles.require}>Password is required</Text>
        )}
        <TouchableOpacity
          style={[styles.button, styles.shadowProp]}
          onPress={() => submit()}>
          <Text style={styles.buttontxt}>SIGN UP</Text>
        </TouchableOpacity>
        <View style={styles.signtxtcov}>
          {/* <Text style={styles.signtxt}>Don't have an Account ?</Text> */}
          <TouchableOpacity onPress={() => navigate('SignIn')}>
            <Text style={[styles.signtxt2, {marginBottom: 50}]}>
              or sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
