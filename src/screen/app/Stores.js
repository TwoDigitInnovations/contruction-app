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
import React, { useContext, useEffect, useRef, useState } from 'react';
import Constants, { FONTS, Googlekey } from '../../Assets/Helpers/constant';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { navigate } from '../../../navigationRef';
import { Post } from '../../Assets/Helpers/Service';
import {
  LoadContext,
  LocationContext,
  ToastContext,
  UserContext,
} from '../../../App';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import { mapStyle } from '../../Assets/Helpers/MapStyle';

const Stores = props => {
  const mapRef = useRef(null);
  const data = props.route.params.item;
  const [shops, setshops] = useState();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [selectshop, setselectshop] = useState();
  const [selectshopname, setselectshopname] = useState();
  const [location, setlocation] = useState();
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [user, setuser] = useContext(UserContext);

  useEffect(() => {
    nearbylocation();
  }, []);

  const nearbylocation = () => {
    CuurentLocation(res => {
    const obj ={
        latitude:user?.shipping_address?.location?.coordinates?.length > 0
            ? user?.shipping_address?.location?.coordinates[1]
            : Number(res.coords.latitude),
            longitude:user?.shipping_address?.location?.coordinates?.length > 0
            ? user?.shipping_address?.location?.coordinates[0]
            : Number(res.coords.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
      }
      setlocation(obj)
      const data2 = {
        location: [
         obj?.longitude,
          obj?.latitude,
        ],
        categoryId: data,
      };
      console.log('data==========>', data2);
      setLoading(true);
      Post('shopsnearme', data2, {}).then(
        async res => {
          setLoading(false);
          console.log('$%#@^&**', res);
          setshops(res?.data);
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    });
  };

  const PackageIcon = () => {
    return (
      <View
        style={{
          height: 50,
          width: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../../Assets/Images/shop.png')}
          style={{ height: '100%', width: '100%' }}
          resizeMode="contain"
        />
      </View>
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
      <View style={{ height: '70%' }}>
        {location?.latitude && Array.isArray(shops) && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            region={location}
            showsUserLocation={true}
          >
            {shops &&
              shops.length > 0 &&
              shops.map((item, i) => (
                <Marker
                  key={i}
                  zIndex={8}
                  draggable={false}
                  onPress={() => {
                    setselectshop(item._id);
                    setselectshopname(item.shop_name);
                  }}
                  coordinate={{
                    latitude: item.location.coordinates[1],
                    longitude: item.location.coordinates[0],
                  }}
                >
                  <PackageIcon />
                </Marker>
              ))}
          </MapView>
        )}
      </View>
      <ScrollView style={styles.btmpart}>
        <Image
          source={require('../../Assets/Images/store.png')}
          style={styles.titleimg}
        />
        {/* <Text style={styles.stmtxt}>Store near me</Text> */}
        {selectshopname ? (
          <Text style={styles.txt2}>Selected Shop : {selectshopname}</Text>
        ) : (
          <Text style={styles.txt}>Make a choice to purchase goods </Text>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            styles.shadowProp,
            {
              backgroundColor: selectshop ? Constants.custom_yellow : '#7d6f56',
            },
          ]}
          onPress={() => {
            selectshop &&
              data &&
              navigate('ProductDetail', {
                vendorid: selectshop,
                categotyid: data,
              });
          }}
        >
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
  txt2: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  stmtxt: {
    color: Constants.white,
    fontSize: 22,
    fontFamily: FONTS.ExtraBold,
    textAlign: 'center',
    marginBottom: 10,
  },
});
