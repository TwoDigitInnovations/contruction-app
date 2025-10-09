import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import Constants, {FONTS, Googlekey} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {LocationIcon} from '../../../Theme';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {navigate} from '../../../navigationRef';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import MapViewDirections from 'react-native-maps-directions';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import GetCurrentAddressByLatLong from '../../Assets/Component/GetCurrentAddressByLatLong';
import { AddressContext, LoadContext, LocationContext } from '../../../App';

const Category = props => {
  const mapRef = useRef(null);
  const shopdata = props?.route?.params.shopdata;
  const productdata = props?.route?.params;
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const animatedValue = new Animated.Value(0);
  const [location, setlocation] = useState();
  const [open, setOpen] = useState(false);
  const [sheddate, setsheddate] = useState(new Date());
  const [locationaddlocal, setlocationaddlocal] = useState(null);
  const [extradate, setextradate] = useState(null);
  const [description, setdescription] = useState('');
  const [loading, setLoading] = useContext(LoadContext);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
    const [locationadd, setlocationadd] = useContext(AddressContext);
  const [rendermap, setrendermap] = useState(false);
  useEffect(() => {
    getlocation();
  }, []);
  useEffect(() => {
    
    // setTimeout(() => {
      setrendermap(true)
    // }, 200);
  }, []);

  const getlocation = () => {
    CuurentLocation(res => {
      setlocation({
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setcurrentLocation({
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      GetCurrentAddressByLatLong({
        lat: res.coords.latitude,
        long: res.coords.longitude,
      }).then(res => {
        console.log('res===>', res);
        setlocationaddlocal(res.results[0].formatted_address);
        setlocationadd(res.results[0].formatted_address);
      });
    });
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
  console.log(location);
  console.log(shopdata.location);
  const GOOGLE_MAPS_APIKEY='AIzaSyArRBhTMMM3MwDesDJpVEENPbdmS8gC8q0';

const Mapcom=useCallback(()=>{
  return(<MapView
    ref={mapRef}
    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
    style={styles.map}
    //  initialRegion={{
    //    latitude: 22.4692361,
    //    longitude: 87.5619433,
    //    latitudeDelta: 0.015,
    //    longitudeDelta: 0.0121,
    //  }}
    // initialRegion={location}
    // region={{latitude: shopdata?.location.coordinates[1],
    //   longitude: shopdata?.location.coordinates[0],
    //   latitudeDelta: 0.05,
    //   longitudeDelta: 0.05}}
    // region={location}
    region={{
      latitude: 22.4692361,
      longitude: 87.5619433,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
    showsUserLocation={true}
    >
    {/* {destination && ( */}
   {shopdata?.location?.coordinates&& <Marker
          coordinate={{
            latitude: shopdata?.location.coordinates[1],
            longitude: shopdata?.location.coordinates[0],
          }}
          title={'Destination'}
          pinColor="green"
        // image={require('../../Assets/Images/Start.png')}
        />}
    {/* <Marker
      coordinate={{
        latitude: 22.4692361,
        longitude: 87.5619433,
      }}
      title={'Destination'}
      pinColor="green"
      // image={require('../../Assets/Images/Start.png')}
    /> */}
    {/* <Marker
      coordinate={{
        latitude: 22.4655801,
        longitude: 87.5760952,
      }}
      title={'Sourse'}
      pinColor={'red'}
    /> */}
    {location?.latitude&&<Marker
          coordinate={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
          title={'Sourse'}
          pinColor={'red'}
        />}
    {location && shopdata?.location?.coordinates&& (
    <MapViewDirections
      origin={{
        latitude: location?.latitude,
        longitude: location?.longitude,
      }}
      destination={{
        latitude: shopdata?.location?.coordinates[1],
        longitude: shopdata?.location?.coordinates[0],
      }}
      // origin={{
      //   latitude: 22.4655801,
      //   longitude: 87.5760952,
      // }}
      // destination={{
      //   latitude: 22.4692361,
      //   longitude: 87.5619433,
      // }}
      onReady={result => {
        // console.log('result', result);
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
      onError={(errorMessage) => {
        console.error('MapViewDirections Error: ', errorMessage);
      }}
      apikey={Googlekey}
      strokeWidth={3}
      strokeColor={Constants.custom_blue}
      optimizeWaypoints={true}
    />
     )} 
  </MapView>)
},[rendermap,location])

  return (
    <View style={styles.container}>
      <View style={styles.headcov}>
        <Header />
      </View>
      <View style={{height:400}}>
      <Mapcom />
      </View>
      <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                     style={{flex:1,paddingTop:10}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.maintxt}>Order category</Text>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt} numberOfLines={2}>
              {shopdata?.shop_address}
            </Text>
            <LocationIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt} numberOfLines={2}>
              {locationaddlocal}
            </Text>
            <LocationIcon />
          </View>
        </TouchableOpacity>

        <View style={[styles.inputbox, styles.shadowProp, {height: 110}]}>
          <TextInput
            style={[styles.txtinp, styles.shadowProp2]}
            multiline={true}
            numberOfLines={4}
            placeholder="Description"
            value={description}
            onChangeText={e => setdescription(e)}
            placeholderTextColor={Constants.customgrey}></TextInput>
        </View>

        {extradate && (
          <View style={[styles.inputbox, styles.shadowProp]}>
            <TextInput
              style={[styles.txtinp, styles.shadowProp2]}
              value={moment(sheddate).format('DD/MM/YYYY ')}
              editable={false}></TextInput>
          </View>
        )}

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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            gap: 5,
          }}>
          <Text style={styles.shdtxt}>Schedule Delievery</Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
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
        <TouchableOpacity
          style={[styles.button, styles.shadowProp]}
          onPress={() =>
            navigate('Shipping', {
              useradd: locationaddlocal,
              description: description,
              sheduledate: extradate,
              location: location,
              price: productdata.price,
              productid: productdata.productid,
              productname: productdata.productname,
              posted_by: productdata.posted_by,
            })
          }>
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
    // flex: 1,
    height:400
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
  onoffbtn: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
});
