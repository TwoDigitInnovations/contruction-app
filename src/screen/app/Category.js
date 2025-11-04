import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Constants, { FONTS, Googlekey } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { BackIcon, LocationEditIcon, LocationIcon } from '../../../Theme';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { goBack, navigate } from '../../../navigationRef';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import MapViewDirections from 'react-native-maps-directions';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import GetCurrentAddressByLatLong from '../../Assets/Component/GetCurrentAddressByLatLong';
import {
  AddressContext,
  LoadContext,
  LocationContext,
  ProductContext,
  UserContext,
} from '../../../App';
import { GetApi } from '../../Assets/Helpers/Service';
import { useIsFocused } from '@react-navigation/native';

const Category = props => {
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const animatedValue = new Animated.Value(0);
  const [open, setOpen] = useState(false);
  const [sheddate, setsheddate] = useState(new Date());
  const [productdetail, setproductdetail] = useState();
  const [extradate, setextradate] = useState(null);
  const [description, setdescription] = useState('');
  const [loading, setLoading] = useContext(LoadContext);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [usedLocation, setUsedLocation] = useState();
  const [usedAddress, setUsedAddress] = useState();
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [user, setuser] = useContext(UserContext);
  const [selectedProductData, setselectedProductData] =
    useContext(ProductContext);
  const [rendermap, setrendermap] = useState(false);
  const IsFocused = useIsFocused();
  useEffect(() => {
    {
      selectedProductData?.productid && getproductbyid();
    }
  }, []);
  useEffect(() => {
    if (IsFocused) {
      setUsedLocation({
        latitude:
          user?.shipping_address?.location?.coordinates?.length > 0
            ? user?.shipping_address?.location?.coordinates[1]
            : currentLocation?.latitude,
        longitude:
          user?.shipping_address?.location?.coordinates?.length > 0
            ? user?.shipping_address?.location?.coordinates[0]
            : currentLocation?.longitude,
      });
      setUsedAddress(
        user?.shipping_address?.address
          ? user?.shipping_address?.address
          : locationadd,
      );
    }
  }, [IsFocused]);
  console.log('usedlocation', usedLocation);
  const getproductbyid = () => {
    setLoading(true);
    GetApi(`getProductById/${selectedProductData?.productid}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setproductdetail(res.data);
          setrendermap(true);
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

  const Mapcom = useCallback(() => {
    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: usedLocation?.latitude,
          longitude: usedLocation?.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        {/* {destination && ( */}
        {productdetail?.posted_by?.location?.coordinates?.length > 0 && (
          <Marker
            coordinate={{
              latitude: productdetail?.posted_by?.location.coordinates[1],
              longitude: productdetail?.posted_by?.location.coordinates[0],
            }}
            title={'Destination'}
            pinColor="green"
            // image={require('../../Assets/Images/Start.png')}
          />
        )}
        {usedLocation?.latitude && (
          <Marker
            coordinate={{
              latitude: usedLocation?.latitude,
              longitude: usedLocation?.longitude,
            }}
            title={'Sourse'}
            pinColor={'red'}
          />
        )}
        {usedLocation &&
          productdetail?.posted_by?.location?.coordinates?.length > 0 && (
            <MapViewDirections
              origin={{
                latitude: usedLocation?.latitude,
                longitude: usedLocation?.longitude,
              }}
              destination={{
                latitude: productdetail?.posted_by?.location?.coordinates[1],
                longitude: productdetail?.posted_by?.location?.coordinates[0],
              }}
              onReady={result => {
                const edgePadding = {
                  top: 100,
                  right: 50,
                  bottom: 100,
                  left: 50,
                };
                console.log('MapViewDirections: result', result);
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding,
                  animated: true,
                });
                setRouteCoordinates(result.coordinates);
              }}
              onError={errorMessage => {
                console.error('MapViewDirections Error: ', errorMessage);
              }}
              apikey={Googlekey}
              strokeWidth={3}
              strokeColor={Constants.custom_yellow}
              optimizeWaypoints={true}
            />
          )}
      </MapView>
    );
  }, [rendermap, usedLocation]);

  return (
    <View style={styles.container}>
      <View style={{ height: '35%' }}>
        {usedLocation?.latitude && <Mapcom />}
        <TouchableOpacity style={styles.baccover} onPress={() => goBack()}>
          <BackIcon height={20} width={20} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.maintxt}>Order category</Text>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.inrshabox, styles.shadowProp2]}>
              <Text style={styles.txt} numberOfLines={2}>
                {productdetail?.posted_by?.address}
              </Text>
            </View>
          </View>
          <View style={styles.ndboxcov}>
            <View
              style={[styles.inputbox, styles.shadowProp, { width: '85%' }]}
            >
              <View style={[styles.inrshabox, styles.shadowProp2]}>
                <Text style={styles.txt} numberOfLines={2}>
                  {usedAddress}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.locationiconCov}
              onPress={() => navigate('Shipping')}
            >
              <LocationEditIcon height={30} width={30} />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputbox, styles.shadowProp, { height: 110 }]}>
            <TextInput
              style={[
                styles.txtinp,
                styles.shadowProp2,
                { textAlignVertical: 'top' },
              ]}
              multiline={true}
              numberOfLines={4}
              placeholder="Description"
              value={description}
              onChangeText={e => setdescription(e)}
              placeholderTextColor={Constants.customgrey}
            ></TextInput>
          </View>

          <DatePicker
            // style={{zIndex: '50'}}
            modal
            open={open}
            minimumDate={new Date()}
            mode="date"
            theme="dark"
            // maximumDate={maxDate}
            // androidVariant="nativeAndroid"
            date={sheddate}
            onConfirm={date => {
              setOpen(false);
              setsheddate(date);
              setextradate(date);
              // console.log(date.toString())
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          <View style={styles.flr}>
            <View style={styles.flr2}>
              <Text style={styles.shdtxt}>Schedule Delievery</Text>
              <TouchableOpacity onPress={() =>{extradate?setextradate(null):setOpen(true)}}>
                {extradate ? (
                  <Image
                    source={require('../../Assets/Images/on.png')}
                    style={styles.onoffbtn}
                  />
                ) : (
                  <Image
                    source={require('../../Assets/Images/off.png')}
                    style={styles.onoffbtn}
                  />
                )}
              </TouchableOpacity>
            </View>
            {extradate && (
              <Text style={[styles.shdtxt,{color:Constants.custom_yellow}]} onPress={() => setOpen(true)}>
                {moment(sheddate).format('DD/MM/YYYY ')}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.button, styles.shadowProp]}
            onPress={() => {
              if (user?.shipping_address?.address) {
                navigate('CheckOut');
                setselectedProductData({
                  ...selectedProductData,
                  description: description,
                  sheduledate: extradate,
                });
              } else {
                navigate('Shipping');
              }
            }}
          >
            <Text style={styles.buttontxt}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  map: {
    flex: 1,
    // height:400
  },
  baccover: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 30,
    backgroundColor: Constants.white,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 5px 0.08px grey',
  },
  inputbox: {
    backgroundColor: '#cdcdcd',
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    height: 70,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 5px #cdcdcd',
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
  txtinp: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    backgroundColor: 'red',
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
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
    marginBottom: 50,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  onoffbtn: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  ndboxcov: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  locationiconCov: {
    backgroundColor: Constants.white,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '13%',
  },
  flr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal:20,
    marginTop:10
  },
  flr2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5
  },
});
