import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import Constants, {
  Currency,
  FONTS,
  Googlekey,
} from '../../Assets/Helpers/constant';
import moment from 'moment';
import { goBack, navigate } from '../../../navigationRef';
import { LoadContext, ToastContext } from '../../../App';
import { GetApi, Post, PostWithImage } from '../../Assets/Helpers/Service';
import Header from '../../Assets/Component/Header';
import {
  CallIcon,
  Cross2Icon,
  CrossIcon,
  TickIcon,
  Upload2Icon,
  UploadIcon,
} from '../../../Theme';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import Signature from 'react-native-signature-canvas';
import ReactNativeBlobUtil from 'react-native-blob-util';
// import CustomCurrentLocation from '../../Component/CustomCurrentLocation';

const Map = props => {
  const data = props?.route?.params?.orderid;
  // let locationtype = props?.route?.params?.type;
  // console.log(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible6, setModalVisible6] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [location, setlocation] = useState(null);
  const [destination, setdestination] = useState(null);
  const [locationtype, setlocationtype] = useState(props?.route?.params?.type);
  const [per, setper] = useState(null);
  const [orderdetail, setorderdetail] = useState();
  const [images, setImages] = useState([]);

  const cameraRef = useRef();
  const signRef = useRef();
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

  console.log(destination);
  const MyOrders = (prp) => {
    setLoading(true);
    GetApi(`getOrderById/${data}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        setorderdetail(res.data);
        if (locationtype === 'shop'&&!prp) {
          setdestination({
            latitude: Number(res?.data?.vendor?.location?.coordinates[1]),
            longitude: Number(res?.data?.vendor?.location?.coordinates[0]),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        } else {
          console.log("client location set");
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
          setlocationtype('client');
          MyOrders(true);
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
  

const base64ToBlobWithRNBU = async (base64Data, mimeType = 'image/png') => {
   const dirs = ReactNativeBlobUtil.fs.dirs;
  const tempPath = `${dirs.CacheDir}/temp_signature.${mimeType.split('/')[1]}`;

  // Write Base64 data to file
  await ReactNativeBlobUtil.fs.writeFile(tempPath, base64Data, 'base64');

  // Return file path
  return tempPath;
};
  
  const handleSignature = async(signature) => {
    if (images?.length===0) {
      setToast('Please upload delivery image');
      return;
    }
    if (images?.length>5) {
      setToast('You can upload maximum 5 images');
      return;
    }
    console.log(signature);
    const base64Data = signature.split(',')[1]; // remove data:image/png;base64,
  const filePath = await base64ToBlobWithRNBU(base64Data);

  const formData = new FormData();
  formData.append('signature', {
    uri: `file://${filePath}`,
    type: 'image/png',
    name: 'signature.png',
  });
  images?.forEach((item, index) => {
    formData.append(`deliveryimg`, item);});
    formData.append('id', orderdetail?._id);
    formData.append('status', 'Delivered');
    console.log("formData",formData);
    setLoading(true);
    PostWithImage(`completeride`, formData).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setModalVisible6(false)
          goBack();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };


  const handleClear = () => {
    signRef.current.clearSignature();
  };

  return (
    <View style={styles.container}>
      <Header item={'My Orders'} />
      {/* <Image
        source={require('../../Assets/Images/mapimg.png')}
        style={[styles.map, {width: '100%'}]}
      /> */}
      <View style={{ flex: 1 }}>
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
            showsUserLocation={true}
          >
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
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.box}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={
                (orderdetail?.user?.img||orderdetail?.vendor?.img)
                  ? {
                      uri: locationtype === 'shop'?orderdetail?.vendor?.img:orderdetail?.user?.img,
                    }
                  : require('../../Assets/Images/profile.png')
              }
              style={styles.hi}
            />
            <View>
              <Text style={styles.name}>{locationtype === 'shop'
                    ? orderdetail?.vendor.shop_name:orderdetail?.user?.username}</Text>
              <View
                style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}
              >
                <Text style={styles.redeembtn}>
                  {moment(
                    orderdetail?.sheduledate
                      ? orderdetail?.sheduledate
                      : orderdetail?.createdAt,
                  ).format('DD-MM-YYYY ')}
                </Text>
                {orderdetail?.sheduledate && (
                  <Text style={styles.amount2}>
                    {orderdetail?.selectedSlot}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.secendpart}>
            <Text style={styles.secendboldtxt}>Location : </Text>
            <Text style={styles.secendtxt2}>{locationtype === 'shop'?orderdetail?.vendor?.address:orderdetail?.user?.address}</Text>
          </View>
          <View style={styles.txtcol}>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Category : </Text>
                <Text style={styles.secendtxt}>
                  {orderdetail?.product?.categoryname}
                </Text>
              </View>
            <Text style={styles.amount}>
              {Currency} {orderdetail?.deliveryfee}
            </Text>
          </View>
          <View style={[styles.txtcol,{alignItems:'center'}]}>
            <Text style={styles.redeembtn2}>{locationtype === 'shop'?"Seller":orderdetail?.status}</Text>
          <CallIcon color={Constants.custom_yellow} height={20} width={20} onPress={() => Linking.openURL(locationtype === 'shop'?`tel:${orderdetail?.vendor?.phone}`:`tel:${orderdetail?.user?.phone}`)}/>
          </View>
        </View>
        <View
          style={[
            styles.box2,
            styles.shadowProp,
            { marginBottom: orderdetail?.status != 'Delivered' ? 80 : 10 },
          ]}
        >
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={
                    orderdetail?.selectedAtribute?.image
                      ? {
                          uri: `${orderdetail?.selectedAtribute?.image}`,
                        }
                      : require('../../Assets/Images/cement.png')
                  }
                  style={styles.hi2}
                />
                <View>
                  <Text style={styles.name2}>{orderdetail?.product?.name}</Text>
                  {orderdetail?.inputvalue && (
                    <Text style={styles.waigh}>
                      {orderdetail?.selectedAtribute?.name}
                    </Text>
                  )}
                </View>
              </View>
              <TickIcon style={{}} />
            </View>
            <View style={[styles.txtcol, { marginVertical: 10 }]}>
              {orderdetail?.inputvalue && (
                <Text style={styles.buttontxt}>
                  {' '}
                  {orderdetail?.inputvalue}{' '}
                  {orderdetail?.selectedAtribute?.unit}
                </Text>
              )}
              <Text style={styles.amount}>
                {Currency}{' '}
                {orderdetail?.selectedAtribute?.price
                  ? orderdetail?.selectedAtribute?.price
                  : orderdetail?.product?.price}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {orderdetail?.status === 'Collected' && (
        <TouchableOpacity
          style={styles.signInbtn}
          onPress={() => setModalVisible6(true)}
        >
          <Text style={styles.buttontxt}>Finish Ride</Text>
        </TouchableOpacity>
      )}
      {orderdetail?.status === 'Driverassigned' && orderdetail.driver && (
        <TouchableOpacity
          style={styles.signInbtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttontxt}>Collect Load</Text>
        </TouchableOpacity>
      )}
      {orderdetail?.status === 'Driverassigned' && !orderdetail.driver && (
        <TouchableOpacity
          style={styles.signInbtn}
          onPress={() => setModalVisible4(true)}
        >
          <Text style={styles.buttontxt}>Accept Ride</Text>
        </TouchableOpacity>
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
          <View style={styles.modalView2}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}
            >
              <Text style={styles.textStyle}>
                Are you sure you have collected the load ?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}
                >
                  <Text
                    style={[
                      styles.modalText,
                      { color: Constants.custom_yellow },
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    collectorder(orderdetail._id), setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* <Modal
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
      </Modal> */}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible4(!modalVisible4);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView2}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}
            >
              <Text style={styles.textStyle}>
                Are you sure you want to Accept this ride to delivery !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible4(!modalVisible4)}
                  style={styles.cancelButtonStyle}
                >
                  <Text
                    style={[
                      styles.modalText,
                      { color: Constants.custom_yellow },
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    setModalVisible4(false);
                    Acceptorder(orderdetail._id);
                  }}
                >
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {modalVisible6 && (
        <Modal
          animationType="none"
          transparent={true}
          onRequestClose={() => {
            setModalVisible6(!modalVisible6);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CrossIcon
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}
                height={25}
                width={25}
                onPress={() => {
                  setModalVisible6(!modalVisible6);
                }}
                color={Constants.black}
              />
              <Text style={styles.textStyle}>
                Please upload your delivery image
              </Text>
              <View style={{ height: 150 }}>
                <ScrollView
                  style={{ flexDirection: 'row', marginVertical: 15,marginHorizontal:10 }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <TouchableOpacity
                    style={styles.uploadbox}
                    onPress={() => cameraRef.current.show()}
                  >
                    <View style={styles.uplodiconcov}>
                      <Upload2Icon
                        color={Constants.normal_green}
                        height={20}
                        width={20}
                      />
                    </View>
                    <Text style={styles.uploadtxt}>Add</Text>
                  </TouchableOpacity>
                  {images &&
                    images.length > 0 &&
                    images.map((item, i) => (
                      <View key={i}>
                        <Cross2Icon
                          color={Constants.red}
                          height={15}
                          width={15}
                          style={{
                            position: 'absolute',
                            zIndex: 10,
                            right: 0,
                          }}
                          onPress={() =>
                            setImages(prev =>
                              prev.filter(it => it?.uri !== item?.uri),
                            )
                          }
                        />
                        <Image
                          source={{ uri: item?.uri }}
                          style={styles.imgcov}
                          resizeMode="contain"
                        />
                      </View>
                    ))}
                </ScrollView>
              </View>
              <Text style={styles.textStyle2}>
                Please signature from customer
              </Text>
                <Signature
                  ref={signRef}
                  onOK={handleSignature}
                  descriptionText="Sign"
                  onEmpty={() => {console.log('Empty'),setToast('Please provide signature')}}
                  autoClear={false}
                  webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
                />
                 <TouchableOpacity
                  style={styles.clearstl}
                  onPress={() =>handleClear()}>
                  <Text style={styles.modalText}>Clear</Text>
                </TouchableOpacity>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                   signRef.current.readSignature()
                  }}
                >
                  <Text style={styles.modalText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={async img => {
          const imgobj = {
            uri: img.assets[0].uri,
            type: img.assets[0].type,
            name: img.assets[0].fileName,
          };
          setImages(prevImages => [...prevImages, imgobj]);
        }}
        base64={false}
        cancel={() => {}}
      />
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
    borderRadius: 5,
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
  redeembtn2: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    lineHeight:20,
    backgroundColor: Constants.custom_yellow,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginVertical: 7,
    borderRadius: 8,
    textAlign: 'center',
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
    fontSize: 18,
    fontFamily: FONTS.Bold,
    alignSelf: 'flex-end',
  },
  amount2: {
    color: Constants.custom_yellow,
    fontSize: 14,
    fontFamily: FONTS.Bold,
    textDecorationLine: 'underline',
  },
  signInbtn: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    backgroundColor: Constants.custom_yellow,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
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
    marginHorizontal: 20,
    marginVertical: 80,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    width: '95%',
    flex: 1,
  },
  modalView2: {
    marginHorizontal: 20,
    marginVertical: 80,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    width: '95%',
  },

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    margin: 20,
    marginBottom: 10,
  },
  textStyle2: {
    color: Constants.black,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
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
  clearstl: {
    backgroundColor: Constants.blue,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 10,
    alignSelf:'flex-end'
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
  waigh: {
    color: Constants.white,
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
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

  uploadbox: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Constants.customgrey2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgcov: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginLeft: 5,
  },
  uploadtxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
  uplodiconcov: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#bcb8cc',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  sigboxcov: {
    flexDirection: 'row',
    height: 100,
    // marginVertical: 15,
    justifyContent: 'center',
  },
  imgstyle2: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  uploadbox2: {
    flex: 1,
    alignItems: 'center',
  },
  uploadimgbox: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor:Constants.red
  },
});
