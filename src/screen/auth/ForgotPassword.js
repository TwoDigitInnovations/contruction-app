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
import {LoadContext, ToastContext} from '../../../App';
import Constants from '../../Assets/Helpers/constant';

const ForgotPassword = props => {
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [showPass, setShowPass] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');

  const sendotp = () => {
    if (email === '') {
      setSubmitted(true);
      return;
    }
    const d = {
      email: email,
    };
    //   console.log('data==========>', d);s
    setLoading(true);

    Post('sendOTP', d, {}).then(async res => {
      setLoading(false);
      console.log(res);
      setSubmitted(false);
      if (res.status) {
        setToast(res.data.message);
        // const data = {
        //   email: userDetail.email,
        //   token: res.data.token,
        // };
        // navigate('OtpVerify', {data});
        setShowEmail(false);
        setShowOtp(true);
        setShowPassword(false);
        setToken(res?.data?.token);
        console.log('enter');
        // setUserDetail({
        //   email: '',
        // });
      } else {
        setLoading(false);
        setToast(res.message);
      }
    });
  };
  const verifyotp = () => {
    if (value === '') {
      setSubmitted(true);
      return;
    }
    const data = {
      otp: value,
      token,
    };
    // data.token = otptoken;
    console.log('data==========>', data);
    setLoading(true);
    Post('verifyOTP', data, {}).then(
      async res => {
        setLoading(false);
        setSubmitted(false);
        console.log('res =======>', res);
        if (res.status) {
          setToast(res.data.message);
          setValue('');
          setShowEmail(false);
          setShowOtp(false);
          setShowPassword(true);
          setToken(res?.data?.token);
          // navigate('ChangePassword', {token: res.data.token});
        } else {
          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log('err =======>', err);
      },
    );
  };
  const submit = () => {
    if (confirmPassword === '' || password === '') {
      setSubmitted(true);
      return;
    }
    if (password !== confirmPassword) {
      setToast('Your password does not match with Confirm password');
      return;
    }

    const data = {
      password,
      token,
    };
    console.log('data==========>', data);
    setLoading(true);
    Post('changePassword', data, {}).then(
      async res => {
        setLoading(false);
        setSubmitted(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          await AsyncStorage.removeItem('userDetail');
          navigate('SignIn');
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
    // }
  };

  return (
    <View style={styles.container}>
      <View style={{height: '50%'}}>
        <ImageBackground
          source={require('../../Assets/Images/topbg.png')}
          style={styles.imgbg}
          resizeMode="stretch">
          <Image
            source={require('../../Assets/Images/forget.png')}
            style={styles.titleimg}
          />
        </ImageBackground>
      </View>
      <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex:1}}
                  >
      <ScrollView style={styles.btmpart} showsVerticalScrollIndicator={false}>
        {showEmail && (
          <View>
            <Text style={styles.btmtext}>Email</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                placeholder="Enter your email"
                style={[styles.input, styles.shadowProp2]}
                value={email}
                onChangeText={e => setEmail(e)}
                placeholderTextColor={Constants.customgrey2}></TextInput>
            </View>
          </View>
        )}
        {submitted && email === '' && (
          <Text style={styles.require}>Email is required</Text>
        )}

        {showOtp && (
          <View>
            <Text style={styles.btmtext}>OTP</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                placeholder="Enter OTP"
                style={[styles.input, styles.shadowProp2]}
                value={value}
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={e => setValue(e)}
                placeholderTextColor={Constants.customgrey2}></TextInput>
            </View>
          </View>
        )}
        {submitted && value === '' && (
          <Text style={styles.require}>OTP is required</Text>
        )}

        {showPassword && (
          <View>
            <Text style={styles.btmtext}>Password</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                placeholder="Enter password"
                style={[styles.input, styles.shadowProp2]}
                placeholderTextColor={Constants.customgrey2}
                value={password}
                onChangeText={password => setPassword(password)}
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
              <Text style={{color: 'red'}}>Password is required</Text>
            )}
            <Text style={styles.btmtext}>Confirm Password</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                placeholder="Enter Confirm Password"
                style={[styles.input, styles.shadowProp2]}
                placeholderTextColor={Constants.customgrey2}
                value={confirmPassword}
                onChangeText={confirmPassword =>
                  setConfirmPassword(confirmPassword)
                }
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
            {submitted && confirmPassword === '' && (
              <Text style={styles.require}>Confirm Password is required</Text>
            )}
          </View>
        )}
        {showEmail && (
          <TouchableOpacity
            style={[styles.button, styles.shadowProp,{marginTop:50}]}
            onPress={() => sendotp()}>
            <Text style={styles.buttontxt}>Next</Text>
          </TouchableOpacity>
        )}
        {showOtp && (
          <TouchableOpacity
            style={[styles.button, styles.shadowProp,{marginTop:50}]}
            onPress={() => verifyotp()}>
            <Text style={styles.buttontxt}>Verify OTP</Text>
          </TouchableOpacity>
        )}
        {showPassword && (
          <TouchableOpacity
            style={[styles.button, styles.shadowProp,{marginTop:50}]}
            onPress={() => submit()}>
            <Text style={styles.buttontxt}>Submit</Text>
          </TouchableOpacity>
        )}
        <View style={styles.signtxtcov}>
          {/* <Text style={styles.signtxt}>Don't have an Account ?</Text> */}
          <TouchableOpacity onPress={() => navigate('SignUp')}>
            <Text style={[styles.signtxt2,{marginBottom: 50}]}>or Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;
