import {
  Animated,
  Easing,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Constants, {FONTS, Googlekey} from '../../Assets/Helpers/constant';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {navigate} from '../../../navigationRef';
import { Post } from '../../Assets/Helpers/Service';
import { LoadContext, ToastContext } from '../../../App';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import { PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { Down } from '../../../Theme';
import MapViewDirections from 'react-native-maps-directions';

const Stores = (props) => {
  const mapRef = useRef(null);
  const data =props.route.params.item
  const [shops,setshops]=useState([])
    const [toast, setToast] = useContext(ToastContext);
    const [loading, setLoading] = useContext(LoadContext);
      const [selectshop, setselectshop] = useState();
      const [location, setlocation] = useState(null);
  useEffect(()=>{
    nearbylocation();
    CustomCurrentLocation()
  },[])

  const CustomCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
          console.log(result);
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              (position) => {
                // setlocation(position);
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
            (position) => {
              console.log(position);
              setlocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
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

  const nearbylocation = () => {
    CuurentLocation(res => {
      //   const data = {
      //     track: {
      //       type: 'Point',
      //       coordinates: [res.coords.longitude, res.coords.latitude],
      //     },

      //   }
      // console.log('longitude===>', location.longitude);
      const data2 = {
        location: [Number(res.coords.longitude), Number(res.coords.latitude)],
        categoryId:data
      };
      // const data2 = {
      //   location: [87.56486769765615, 22.471533774911393],
      //   categoryId:data
      // };
      console.log('data==========>', data2);
      setLoading(true);
      Post('shopsnearme', data2, {}).then(
        async res => {
          setLoading(false);
          console.log('$%#@^&**', res);
          setshops(res?.data?.rides);
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    });
  };

  const PackageIcon = (item, index) => {
    // console.log('image=======>', item);
    return (
      <TouchableOpacity
        style={{height: 45, width: 40, position: 'relative'}}
        onPress={() => {
          // console.log('click')
          // selectshop(item)
        }}>
        <View style={[styles.startMarkerView, ]}>
          <View
            style={[
              styles.startMarkerView,
              {overflow: 'hidden', borderColor: Constants.red},
            ]}>
            <Image
              source={require('../../Assets/Images/shop2.png')}
              // source={
              //   item?.user?.img
              //     ? {
              //         uri: `${item.user.img}`,
              //       }
              //     : require('../../Assets/Images/shop2.png')
              // }
              onLoadEnd={() => {
                // item.isReady = true;
                // setPackagePlans([...packagePlans])
                // if (index + 1 === packagePlans.length) {
                //   setTimeout(() => {
                //     setIsmapready(true)
                //   }, 5000);
                // }
              }}
              defaultSource={require('../../Assets/Images/shop2.png')}
              style={{height: 40, width: 30,resizeMode:'center' }}
            />
          </View>
          {/* <View
            style={{
              position: 'absolute',
              bottom: -28,
            }}>
            <Down height={50} width={20} color={Constants.black} />
          </View> */}
        </View>
      </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <View style={{height: '70%'}}>
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
          // initialRegion={location}
            region={location}
            // region={{
            //      latitude: 22.469336569603133,
            //      longitude: 87.56172506021942,
            //      latitudeDelta: 0.015,
            //      longitudeDelta: 0.0121,
            //    }
            //   }
          showsUserLocation={true}>
          {/* {destination && ( */}
          {/* <Marker
              coordinate={{
                latitude: data.dest.coordinates[1],
                longitude: data.dest.coordinates[0],
              }}
              title={'Destination'}
              pinColor="green"
            // image={require('../../Assets/Images/Start.png')}
            /> */}
          {/* <Marker
              coordinate={{
                latitude: data.src.coordinates[1],
                longitude: data.src.coordinates[0],
              }}
              title={'Sourse'}
              pinColor={destination ? 'green' : '#de2c1f'}
            /> */}
          {/* {location && destination && ( */}
          {/* <MapViewDirections
              origin={{
                latitude: data.src.coordinates[1],
                longitude: data.src.coordinates[0],
              }}
              destination={{
                latitude: data.dest.coordinates[1],
                longitude: data.dest.coordinates[0],
              }}
              onReady={result => {
                const edgePadding = {
                  top: 100,
                  right: 50,
                  bottom: 100,
                  left: 50,
                };
                console.log('result', result);
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding,
                  animated: true,
                });
                setRouteCoordinates(result.coordinates);
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor={Constants.customblue}
              optimizeWaypoints={true}
            /> */}
          {/* )} */}
          {/* <MapViewDirections
          // origin={{
          //   latitude: location.latitude,
          //   longitude: location.longitude,
          // }}
          // destination={{
          //   latitude: shopdata?.location.coordinates[1],
          //   longitude: shopdata?.location.coordinates[0],
          // }}
          origin={{
            latitude: 22.4655801,
            longitude: 87.5760952,
          }}
          destination={{
            latitude: 22.4692361,
            longitude: 87.5619433,
          }}
          onReady={result => {
            // console.log('result', result);
            const edgePadding = {
              top: 100,
              right: 50,
              bottom: 100,
              left: 50,
            };
            console.log('result', result);
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding,
              animated: true,
            });
            setRouteCoordinates(result.coordinates);
          }}
          onError={(errorMessage) => {
            console.error('MapViewDirections Error: ', errorMessage);
          }}
          apikey={Googlekey}
          strokeWidth={3}
          strokeColor={Constants.custom_yellow}
          optimizeWaypoints={true}
        /> */}
          {shops&&shops.length>0&&shops.map((item, i) => (
            <Marker
              key={i}
              zIndex={8}
              // coordinate={location}
              // ref={mapRef}
              draggable={false}
              onPress={() => {
                // rideRef.current.show(), setridedata(item);
                setselectshop(item._id)
              }}
              // onDragEnd={e => {
              //   setlocation({
              //     latitude: e.nativeEvent.coordinate.latitude,
              //     longitude: e.nativeEvent.coordinate.longitude,
              //     latitudeDelta: 0.05,
              //     longitudeDelta: 0.05,
              //     // locationadd: add,
              //   });
              //   GetCurrentAddressByLatLong({
              //     lat: e.nativeEvent.coordinate.latitude,
              //     long: e.nativeEvent.coordinate.longitude,
              //   }).then((res: any) => {
              //     console.log('res===>', res);
              //     setlocationadd(res.results[0].formatted_address);
              //   });
              // }}
              // coordinate={{
              //   latitude: location?.latitude ? Number(location?.latitude) : 0,
              //   longitude: location?.longitude ? Number(location?.longitude) : 0,
              // }}
              coordinate={{
                latitude: item.location.coordinates[1],
                longitude: item.location.coordinates[0],
              }}
              // coordinate={{
              //   latitude: 37.78825,
              //   longitude: -122.4324,
              //   // latitudeDelta: 0.015,
              //   // longitudeDelta: 0.0121,
              // }}
              // title={'Sourse'}
            >
              <PackageIcon index={i} item={item} />
            </Marker>
          ))}

        </MapView>
      </View>
      <ScrollView style={styles.btmpart}>
        <Image
          source={require('../../Assets/Images/store.png')}
          style={styles.titleimg}
        />
        {/* <Text style={styles.stmtxt}>Store near me</Text> */}
        <Text style={styles.txt}>Make a choice to purchase goods </Text>
        <TouchableOpacity
          style={[styles.button, styles.shadowProp,{backgroundColor:selectshop?Constants.custom_yellow:'#7d6f56'}]}
          onPress={() => {selectshop&&data&&navigate('Productlist',{vendorid:selectshop,categotyid:data})}}>
          <Text style={styles.buttontxt}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Stores;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  map: {
    flex: 1,
  },
  btmpart: {
    backgroundColor: Constants.custom_black,
    // marginTop:-20,
    // borderTopLeftRadius:25,
    // borderTopRightRadius:25,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  titleimg: {
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 10,
    marginBottom: 50,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  txt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
  },
  stmtxt: {
    color: Constants.white,
    fontSize: 22,
    fontFamily: FONTS.ExtraBold,
    textAlign: 'center',
    marginBottom:10
  },

});
