import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
} from 'react-native-permissions';
import MapViewDirections from 'react-native-maps-directions';
import Constants, {FONTS, Googlekey} from '../../Assets/Helpers/constant';
import moment from 'moment';
import {goBack, navigate} from '../../../navigationRef';
import {LoadContext, ToastContext} from '../../../App';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import Header from '../../Assets/Component/Header';
import {TickIcon} from '../../../Theme';
// import CustomCurrentLocation from '../../Component/CustomCurrentLocation';

const Map = props => {
  const data = props?.route?.params?.orderid;
  const locationtpye = props?.route?.params?.type;
  // console.log(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [from, setFrom] = useState('');
  const [location, setlocation] = useState(null);
  const [destination, setdestination] = useState(null);
  const [locationadd, setlocationadd] = useState(null);
  const [destinationadd, setdestinationadd] = useState(null);
  const [per, setper] = useState(null);
  const [orderdetail, setorderdetail] = useState();

  const mapRef = useRef(null);
  const animatedValue = new Animated.Value(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    {
      data && MyOrders();
    }
    CustomCurrentLocation();
  }, [data]);

  const CustomCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
          console.log(result);
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              position => {
                // setlocation(position);
                console.log(position);
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
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
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

  console.log(destination);
  const MyOrders = () => {
    setLoading(true);
    GetApi(`getOrderById/${data}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        setorderdetail(res.data);
        if (locationtpye === 'shop') {
          setdestination({
            latitude: Number(res?.data?.vendor?.location?.coordinates[1]),
            longitude: Number(res?.data?.vendor?.location?.coordinates[0]),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        } else {
          setdestination({
            latitude: Number(res?.data?.location?.coordinates[1]),
            longitude: Number(res?.data?.location?.coordinates[0]),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      animateRoute();
    }
  }, [routeCoordinates]);
  const animateRoute = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const collectorder = id => {
    const body = {
      id: id,
      status: 'Collected',
    };
    setLoading(true);
    Post(`changeorderstatus`, body).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          MyOrders();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const deliverorder = id => {
    const body = {
      id: id,
      status: 'Delivered',
    };
    setLoading(true);
    Post(`changeorderstatus`, body).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          MyOrders();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };


  const Acceptorder = id => {
    setLoading(true);
    Post(`acceptorderdriver/${id}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.status) {
          MyOrders();
        } else {
          if (res?.message) {
            setToast(res?.message);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  // console.log('locationadd', locationadd);
  return (
    <View style={styles.container}>
      <Header item={'My Orders'} />
      {/* <Image
        source={require('../../Assets/Images/mapimg.png')}
        style={[styles.map, {width: '100%'}]}
      /> */}
      <View style={{flex: 1}}>
        {location?.latitude && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            //  initialRegion={{
            //    latitude: 37.78825,
            //    longitude: -122.4324,
            //    latitudeDelta: 0.015,
            //    longitudeDelta: 0.0121,
            //  }}
            initialRegion={location}
            region={location}
            showsUserLocation={true}>
            {destination?.latitude && (
              <Marker
                coordinate={destination}
                title={'Destination'}
                pinColor="red"
                // image={require('../../Assets/Images/Start.png')}
              />
            )}
            <Marker
              coordinate={location}
              title={'Sourse'}
              pinColor={'#C68E27'}
            />
            {location && destination && (
              <MapViewDirections
                origin={location}
                destination={destination}
                onReady={result => {
                  const edgePadding = {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                  };
                  console.log('result', result);
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding,
                    animated: true,
                  });
                  setRouteCoordinates(result.coordinates);
                }}
                apikey={Googlekey}
                strokeWidth={3}
                strokeColor={Constants.customblue}
                optimizeWaypoints={true}
              />
            )}
          </MapView>
        )}
      </View>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.box}>
          <View style={{flexDirection: 'row'}}>
            <Image
              // source={require('../../Assets/Images/profile4.png')}
              source={
                orderdetail?.user?.img
                  ? {
                      uri: `${orderdetail?.user?.img}`,
                    }
                  : require('../../Assets/Images/profile.png')
              }
              style={styles.hi}
              // onPress={()=>navigate('Account')}
            />
            <View>
              <Text style={styles.name}>{orderdetail?.user?.username}</Text>
              <Text style={styles.redeembtn}>
                {moment(orderdetail?.created_at).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.secendpart}>
            <Text style={styles.secendboldtxt}>Location : </Text>
            <Text style={styles.secendtxt2}>{orderdetail?.user?.address}</Text>
          </View>
          {/* <View style={styles.txtcol}>
            <View style={styles.secendpart}>
              <Text style={styles.secendboldtxt}>QTY : </Text>
              <Text style={styles.secendtxt}>{orderdetail?.qty}</Text>
            </View>
          </View> */}
          <View style={styles.txtcol}>
            <View style={{}}>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Category : </Text>
                <Text style={styles.secendtxt}>
                  {orderdetail?.product?.categoryname}
                </Text>
              </View>
            </View>
            <Text style={styles.amount}>₹{orderdetail?.price}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box2, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../Assets/Images/cement.png')}
                  // source={
                  //   userDetail?.img
                  //     ? {
                  //         uri: `${userDetail.img}`,
                  //       }
                  //     : require('../../Assets/Images/profile.png')
                  // }
                  style={styles.hi2}
                  // onPress={()=>navigate('Account')}
                />
                <Text style={styles.name2}>{orderdetail?.product?.name}</Text>
              </View>
              <TickIcon style={{}} />
            </View>
            <View style={[styles.txtcol, {marginVertical: 10}]}>
              {/* <View style={styles.secendpart}>
                        <Text
                          style={[
                            styles.secendboldtxt,
                            {color: Constants.custom_yellow},
                          ]}>
                          QTY :{' '}
                        </Text>
                        <Text style={[styles.secendtxt, {color: Constants.white}]}>
                          12
                        </Text>
                      </View> */}
              <Text style={styles.amount}>₹{orderdetail?.product?.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {orderdetail?.status === 'Collected' && (
          <TouchableOpacity
            style={styles.signInbtn}
            onPress={() => setModalVisible2(true)}>
            <Text style={styles.buttontxt}>Finish Ride</Text>
          </TouchableOpacity>
        )}
        {orderdetail?.status === 'Driverassigned' && orderdetail.driver && (
          <TouchableOpacity
            style={styles.signInbtn}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttontxt}>Start Ride</Text>
          </TouchableOpacity>
        )}
        {orderdetail?.status === 'Driverassigned' && !orderdetail.driver && (
          <TouchableOpacity
            style={styles.signInbtn}
            onPress={() => setModalVisible4(true)}>
            <Text style={styles.buttontxt}>Accept Ride</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to Start this ride !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    collectorder(orderdetail._id), setModalVisible(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to finish the ride?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible2(!modalVisible2)}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    deliverorder(orderdetail._id), setModalVisible2(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible4(!modalVisible4);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to Accept this ride to delivery !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible4(!modalVisible4)}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    setModalVisible4(false);
                    Acceptorder(orderdetail._id);
                  }}>
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

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  box: {
    backgroundColor: Constants.white,
    marginVertical: 10,
    padding: 20,
  },
  box2: {
    backgroundColor: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    padding: 7,
    height: 150,
  },
  hi: {
    marginRight: 10,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  hi2: {
    marginRight: 10,
    height: 50,
    width: 50,
    // borderRadius: 50,
  },
  redeembtn: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.custom_yellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 7,
    borderRadius: 8,
  },
  name: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  secendpart: {
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'space-between',
    marginLeft: 10,
    marginVertical: 5,
  },
  secendboldtxt: {
    color: Constants.black,
    fontSize: 15,
    fontFamily: FONTS.Regular,
    alignSelf: 'center',
  },
  secendtxt: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
    fontFamily: FONTS.Bold,
  },
  secendtxt2: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
    flex: 1,
    fontFamily: FONTS.SemiBold,
  },
  txtcol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex: 1,
  },
  amount: {
    color: Constants.custom_yellow,
    fontSize: 24,
    fontFamily: FONTS.Bold,
    alignSelf: 'flex-end',
  },
  signInbtn: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    backgroundColor: Constants.custom_yellow,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    // position: 'relative',
  },

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 16,
    margin: 20,
    marginBottom: 10,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  alrt: {
    color: Constants.black,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    // backgroundColor: 'red',
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: Constants.customgrey2,
    paddingBottom: 20,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  cancelButtonStyle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderColor: Constants.custom_yellow,
    borderWidth: 1,
    borderRadius: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.custom_yellow,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cancelAndLogoutButtonWrapStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 20,
    gap: 3,
  },
  name2: {
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    alignSelf: 'center',
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 5px #1b1e22',
  },
  inrshabox: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    padding: 20,
    // justifyContent:'space-between'
  },
});
