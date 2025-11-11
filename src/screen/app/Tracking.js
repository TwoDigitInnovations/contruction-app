import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Constants, {Currency, FONTS, Googlekey} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {InvoiceIcon, LocationIcon, RightarrowIcon, StarIcon, TotalorderIcon} from '../../../Theme';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {navigate} from '../../../navigationRef';
import { LoadContext, ToastContext } from '../../../App';
import { GetApi } from '../../Assets/Helpers/Service';
import { mapStyle } from '../../Assets/Helpers/MapStyle';
import { useIsFocused } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import moment from 'moment';
import RNBlobUtil from 'react-native-blob-util';

const Tracking = (props) => {
  const orderid = props?.route?.params;
  const mapRef = useRef(null);
  const prevCoordsRef = useRef(null);
  const [loading, setLoading] = useContext(LoadContext);
  const [toast, setToast] = useContext(ToastContext);
  const [bearing, setBearing] = useState(null);
  const [orderData, setOrderData] = useState();
  const IsFocused = useIsFocused();
  const [intervalId, setIntervalId] = useState(null);

useEffect(() => {
    if (IsFocused) {
      getorderdetail()
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [IsFocused, orderid]);

  // Polling Effect: Run when ride changes or screen is focused
  useEffect(() => {
    if (orderData?.driver?._id&&orderData?.status!='Delivered' && IsFocused) {
      const id = setInterval(() => {
        getorderdetail2();
      }, 10000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [ IsFocused]);

  const getorderdetail2 = async () => {
    try {
      const res = await GetApi(`getOrderById/${orderid}`,);
      console.log(res)
      if (res?.status) {
        if (res?.data?.driver?.current_location?.coordinates?.length>0) {
          const newLat = res.data.driver.current_location.coordinates[1];
        const newLng = res.data.driver.current_location.coordinates[0];

          if (prevCoordsRef.current) {
          const oldLat = prevCoordsRef.current[1];
          const oldLng = prevCoordsRef.current[0];

          const bear = getBearing(oldLat, oldLng, newLat, newLng);
          setBearing(bear);
          console.log("bear", bear);
        }
        // update ref for next cycle
        prevCoordsRef.current = res.data.driver.current_location.coordinates;
      }
        setOrderData(res.data);
      } else {
        // Stop interval if something goes wrong
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      }
    } catch (err) {
      console.log(err);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

  const getorderdetail = () => {
    setLoading(true);
    GetApi(`getOrderById/${orderid}`).then(
      async res => {
        setLoading(false);
       console.log(res)
        if (res.status) {
          setOrderData(res.data)
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const animatedValue = new Animated.Value(0);
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
  const PackageIcon = () => {
    return (
      <View style={{ height: 40, width: 40,alignItems: "center", justifyContent: "center" }}>
        <Image source={require("../../Assets/Images/truck.png")} style={{height:'100%',width:'100%',}} resizeMode='contain'/>
      </View>
    );
  };
  const getBearing = (startLat, startLng, endLat, endLng) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLon = toRad(endLng - startLng);

  const y = Math.sin(dLon) * Math.cos(toRad(endLat));
  const x =
    Math.cos(toRad(startLat)) * Math.sin(toRad(endLat)) -
    Math.sin(toRad(startLat)) *
      Math.cos(toRad(endLat)) *
      Math.cos(dLon);

  let brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360; // normalize 0–360
};
 const getinvoice = async () => {
  setLoading(true)
  const { DownloadDir, DocumentDir } = RNBlobUtil.fs.dirs;
  const filePath = `${
    Platform.OS === 'android' ? DownloadDir : DocumentDir
  }/invoice-${Date.now()}.pdf`;

  try {
    const res = await RNBlobUtil.config({
      fileCache: true,
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        title: 'Invoice',
        description: 'Downloading invoice...',
        mime: 'application/pdf',
        mediaScannable: true,
      },
    }).fetch(
      'GET',
      // `http://192.168.0.187:3000/v1/api/generateInvoice?orderId=${orderid}`
      `https://api.bodmass.com/v1/api/generateInvoice?orderId=${orderid}`
    );

    console.log('Invoice downloaded:', res.path());
    setLoading(false)
    setToast('success',"Invoice downloaded successfully");
    // if (Platform.OS === 'ios') Linking.openURL(`file://${res.path()}`);
  } catch (err) {
    console.error('Error downloading invoice:', err);
  }
};
  return (
    <View style={styles.container}>
      <View style={styles.headcov}>
        <Header />
      </View>
      {orderData?.location?.coordinates?.length>0&&<MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            region={{
              latitude: orderData?.location?.coordinates[1],
              longitude: orderData?.location?.coordinates[0],
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            showsUserLocation={true}>
            {orderData?.location?.coordinates.length > 0 && (
              <Marker
                coordinate={{
                  latitude: orderData?.location?.coordinates[1],
                  longitude: orderData?.location?.coordinates[0],
                }}
                title='Source'
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.customMarker}>
            <View style={styles.innerCircle} />
          </View>
                </Marker>
            )}
            {orderData?.vendor?.location?.coordinates.length > 0 && (
              <Marker
                coordinate={{
                  latitude: orderData?.vendor?.location?.coordinates[1],
                  longitude: orderData?.vendor?.location?.coordinates[0],
                }}
                title='Destination'
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.customMarker}>
            <View style={styles.innerCircle} />
          </View>
              </Marker>
            )}
 {orderData?.driver?.current_location?.coordinates?.length>0 && (
              <Marker
                zIndex={8}
                draggable={false}
                coordinate={{
                  latitude: orderData?.driver?.current_location?.coordinates[1],
                  longitude: orderData?.driver?.current_location?.coordinates[0],
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true} // makes rotation work properly
                rotation={bearing} // 👈 pass calculated angle here
              >
                <PackageIcon />
              </Marker>
            )}
            {orderData?.vendor?.location && orderData?.location && (
              <MapViewDirections
                // waypoints={routeCoordinates.slice(0,25)}
                origin={{
                  latitude: orderData?.location?.coordinates[1],
                  longitude: orderData?.location?.coordinates[0],
                }}
                destination={{
                  latitude: orderData?.vendor?.location?.coordinates[1],
                  longitude: orderData?.vendor?.location?.coordinates[0],
                }}
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
                  //  mapRef.current.animateToRegion( result.coordinates, 1000)
                  setRouteCoordinates(result.coordinates);
                }}
                apikey={Googlekey}
                strokeWidth={4}
                strokeColor="#00bfff"
                //  strokeColors={['#4782F8']}
                optimizeWaypoints={true}
              />
            )}
          </MapView>}

      <ScrollView style={{flex: 1}}>
        <Text style={styles.maintxt}>Live Tracking</Text>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt}>{orderData?.vendor?.shop_address}</Text>
            <LocationIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt}>{orderData?.address}</Text>
            <LocationIcon />
          </View>
        </TouchableOpacity>
        <View
          style={[styles.inputbox2, styles.shadowProp3]}
          >
          <View style={[styles.inrshabox2, styles.shadowProp4]}>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TotalorderIcon
                height={30}
                width={30}
                style={{alignSelf: 'center'}}
              />
              <View style={{}}>
                <Text style={[styles.txt2, {fontSize: 16}]}>{orderData?.productname}</Text>
                <Text style={styles.txt2}>{moment(orderData?.sheduledate?orderData?.sheduledate:orderData?.createdAt).format('DD-MM-YYYY ')}</Text>
                <Text style={styles.txt2}>{Currency} {orderData?.total}</Text>
              </View>
            </View>
            <View style={{alignItems:'center',gap:3}}>
              {orderData?.inputvalue&&<Text style={[styles.txt,{color:Constants.white}]}> {orderData?.inputvalue} {orderData?.selectedAtribute?.unit}</Text>}
              <Text style={styles.deltxt}>{orderData?.status}</Text>
            </View>
          </View>
        </View>
        {<TouchableOpacity
            onPress={()=>navigate('RateReview',orderData)}
              style={styles.frow}>
              <View style={styles.listcov}>
                <StarIcon
                  height={23}
                  width={23}
                  color={Constants.custom_yellow}
                />
                <Text style={styles.revtxt}>
                  Rating and review
                </Text>
              </View>
              <RightarrowIcon
                color={Constants.black}
                height={15}
                width={15}
              />
            </TouchableOpacity>}
            {<TouchableOpacity
              style={styles.contactopt}
              onPress={() =>
                getinvoice()
              }>
              <InvoiceIcon color={Constants.custom_yellow} height={20} width={20} />
              <Text style={styles.othrttxt2}>
                Download Invoice
              </Text>
            </TouchableOpacity>}
      </ScrollView>
    </View>
  );
};

export default Tracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  map: {
    flex: 1,
  },
  inputbox: {
    backgroundColor: '#cdcdcd',
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    height: 60,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0 0 8 5 #cdcdcd',
  },
  inrshabox: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  txt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  maintxt: {
    fontSize: 20,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  shdtxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  inputbox2: {
    backgroundColor: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    // height: 80,
  },
  shadowProp3: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp4: {
    boxShadow: 'inset 0px 0px 8px 5px #1b1e22',
  },
  inrshabox2: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  txt2: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Regular,
    flex: 1,
    // textAlign:'center'
  },
  deltxt: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.custom_yellow,
    textAlign: 'center',
    borderRadius: 5,
    paddingBottom: 6,
    paddingTop: 4,
    paddingHorizontal:10
  },
  customMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  listcov: {
    flexDirection: 'row',
    // justifyContent:'space-between'
    gap: 20,
  },
  frow:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems:'center',
    marginHorizontal:20,
    marginTop:10,
  },
  revtxt:{
    fontFamily: FONTS.Medium, 
    fontSize: 14,
    color:Constants.custom_yellow,
    textDecorationLine:'underline'
  },
  othrttxt2: {
    color: Constants.custom_yellow,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  contactopt: {
    marginBottom:50,
    borderWidth: 1.5,
    borderColor: Constants.custom_yellow,
    borderRadius: 10,
    flexDirection: 'row',
    height: 55,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 15,
    marginVertical:10
  },
});
