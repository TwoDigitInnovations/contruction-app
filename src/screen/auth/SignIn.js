import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useContext, useState} from 'react';
import styles from './styles';
import Navigation from '../../navigation';
import {useNavigation} from '@react-navigation/native';
import {navigate, reset} from '../../../navigationRef';
import {Post} from '../../Assets/Helpers/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoadContext, ToastContext, UserContext} from '../../../App';
import Constants from '../../Assets/Helpers/constant';

const SignIn = props => {
  const [showPass, setShowPass] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [user, setuser] = useContext(UserContext);
    const [toast, setToast] = useContext(ToastContext);
    const [loading, setLoading] = useContext(LoadContext);
  const [userDetail, setUserDetail] = useState({
    password: '',
    username: '',
  });
  const submit = async () => {
    if (userDetail.username === '' || userDetail.password === '') {
      setSubmitted(true);
      return;
    }
    // const player_id=await OneSignal.User.pushSubscription.getIdAsync()
    // const device_token=await OneSignal.User.pushSubscription.getTokenAsync()
    const data = {
      username: userDetail.username.trim(),
      password: userDetail.password,
      // player_id,
      // device_token
    };
    console.log('data==========>', userDetail);
    setLoading(true);
    Post('login', data, {...props}).then(
      async res => {
        setLoading(false);
        console.log(res);
        setSubmitted(false);
        if (res.status) {
          setUserDetail({
            password: '',
            username: '',
          });
          setLoading(false);
          await AsyncStorage.setItem('userDetail', JSON.stringify(res?.data));
          setuser(res?.data)
          setToast('Login Successfully');
          if (res.data.type === 'DRIVER') {
            if (res?.data?.verified==='VERIFIED') {
            reset('Drivertab');
          } else{
            reset('DriverForm');
          }
          }
         else if (res.data.type === 'VENDOR') {
          if (res?.data?.verified==='VERIFIED') {
            reset('Vendortab');
          } else{
            reset('VendorForm');
          }
            console.log('vendor')
          } else {
            reset('Project');
            console.log('Project')
          }
        } else {
          setLoading(false);
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

  return (
    <View style={styles.container}>
      <View style={{height: '45%'}}>
        <ImageBackground
          source={require('../../Assets/Images/topbg.png')}
          style={styles.imgbg}
          resizeMode="stretch">
          <Image
            source={require('../../Assets/Images/login.png')}
            style={styles.titleimg}
          />
        </ImageBackground>
      </View>
      <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex:1}}
            >
      <ScrollView style={styles.btmpart}>
        <Text style={styles.btmtext}>Email</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your email"
            style={[styles.input, styles.shadowProp2]}
            value={userDetail.username}
            onChangeText={username => setUserDetail({...userDetail, username})}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        {submitted && userDetail.username === '' && (
          <Text style={styles.require}>Email is required</Text>
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
          <Text style={styles.buttontxt}>LOG IN</Text>
        </TouchableOpacity>
        <View style={styles.signtxtcov}>
          {/* <Text style={styles.signtxt}>Don't have an Account ?</Text> */}
          <TouchableOpacity onPress={() => navigate('SignUp')}>
            <Text style={styles.signtxt2}>or Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.fortxt} onPress={() => navigate('ForgotPassword')}>
          Forget Password?
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
