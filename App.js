import React, { useEffect, useState, createContext } from 'react';
import {
  Modal,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './src/navigation';
import CustomToaster from './src/Assets/Component/CustomToaster';
import Constants, { FONTS } from './src/Assets/Helpers/constant';
import Spinner from './src/Assets/Component/Spinner';
import { OneSignal } from 'react-native-onesignal';

import SplashScreen from 'react-native-splash-screen';
import { PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import GetCurrentAddressByLatLong from './src/Assets/Component/GetCurrentAddressByLatLong';
import { GetApi, Post } from './src/Assets/Helpers/Service';
import CuurentLocation from './src/Assets/Component/CuurentLocation';
import Toast from 'react-native-toast-message';

export const Context = React.createContext('');
export const ToastContext = React.createContext('');
export const LoadContext = React.createContext('');
export const LocationContext = React.createContext('');
export const UserContext = React.createContext('');
export const AddressContext = React.createContext('');
export const ProductContext = React.createContext('');
export const ProjectctContext = React.createContext('');

const App = () => {
  const [initial, setInitial] = useState('');
  const [toast, setToast] = useState('');
  const [startupdateloc, setstartupdateloc] = useState(false);
  const [interval, setinter] = useState();
  const [dark, setdark] = useState(false);
  const [mycountry, setmycountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setuser] = useState({});
  const [selectedProductData, setselectedProductData] = useState({});
  const [currentLocation, setcurrentLocation] = useState(null);
  const [locationadd, setlocationadd] = useState('');
  const [project, setproject] = useState('');
  const APP_ID = '6748d85b-5696-492b-94ec-a0e58a3ebaaf';

  useEffect(() => {
    OneSignal.initialize(APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, [OneSignal]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  useEffect(() => {
    CustomCurrentLocation();
    setInitialRoute();
  }, []);

  const setInitialRoute = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userDetail = JSON.parse(user);
    console.log('userDetail', userDetail);
    console.log('userDetailid', userDetail?._id);
    if (userDetail?._id) {
      setuser(userDetail);
      if (userDetail.type === 'DRIVER') {
        if (userDetail.vehicle_doc_no) {
          setInitial('Drivertab');
        } else {
          setInitial('DriverForm');
        }
      } else if (userDetail.type === 'VENDOR') {
        if (userDetail.tax_reg_no) {
          setInitial('Vendortab');
        } else {
          setInitial('VendorForm');
        }
      } else {
        setInitial('Project');
        console.log('Project');
      }
      getProfile();
      console.log('initial', initial);
    } else {
      setInitial('Auth');
    }
  };
  const CustomCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
          console.log(result);
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              position => {
                setcurrentLocation({
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
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
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
              setcurrentLocation({
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
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        } else {
          console.log('location permission denied');
        }
      }
    } catch (err) {
      console.log('location err =====>', err);
    }
  };

  const getProfile = () => {
    GetApi(`getProfile`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setuser(res?.data);
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

  useEffect(() => {
    console.log('enter=====?>');
    clearInterval(interval);
    let int;
    if (user?.type === 'DRIVER' && user?.verified === 'VERIFIED') {
      int = setInterval(() => {
        updateTrackLocation(int);
      }, 30000);
      setinter(int);
    } else {
      clearInterval(int);
    }
    return () => {
      clearInterval(int);
    };
  }, [user]);

  const updateTrackLocation = inter => {
    CuurentLocation(res => {
      const data = {
        track: {
          type: 'Point',
          coordinates: [res.coords.longitude, res.coords.latitude],
        },
      };
      Post('driverupdatelocation', data).then(
        async res => {
          if (res.status) {
          } else {
            clearInterval(inter);
            console.log('stop');
          }
        },
        err => {
          clearInterval(inter);
          // setLoading(false);
          console.log(err);
        },
      );
    });
  };
useEffect(() => {
    if (toast) {
      Toast.show({
        type: 'success',
        text1: toast,
        position: 'top',
        visibilityTime: 2500,
        autoHide: true,
        onHide: () => {
          setToast('');
        },
      });
    }
  }, [toast]);
  return (
    <Context.Provider value={[initial, setInitial]}>
      <ToastContext.Provider value={[toast, setToast]}>
        <LoadContext.Provider value={[loading, setLoading]}>
        <ProjectctContext.Provider value={[project, setproject]}>
          <LocationContext.Provider
            value={[currentLocation, setcurrentLocation]}
          >
            <AddressContext.Provider value={[locationadd, setlocationadd]}>
              <UserContext.Provider value={[user, setuser]}>
              <ProductContext.Provider value={[selectedProductData, setselectedProductData]}>
                <SafeAreaView style={styles.container}>
                  <Spinner color={'#fff'} visible={loading} />
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={'black'}
                  />
                  {initial !== '' && <Navigation initial={initial} />}
                  {/* <Navigation /> */}
                  <Toast />
                </SafeAreaView>
                </ProductContext.Provider>
              </UserContext.Provider>
            </AddressContext.Provider>
          </LocationContext.Provider>
          </ProjectctContext.Provider>
        </LoadContext.Provider>
      </ToastContext.Provider>
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
});

export default App;
