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
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import Constants, {FONTS, Googlekey} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {BackIcon, LocationIcon} from '../../../Theme';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {goBack, navigate} from '../../../navigationRef';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import MapViewDirections from 'react-native-maps-directions';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import GetCurrentAddressByLatLong from '../../Assets/Component/GetCurrentAddressByLatLong';
import { AddressContext, LoadContext, LocationContext, ProductContext, UserContext } from '../../../App';
import { GetApi } from '../../Assets/Helpers/Service';

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
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [user, setuser] = useContext(UserContext);
  const [selectedProductData, setselectedProductData] =
      useContext(ProductContext);
  const [rendermap, setrendermap] = useState(false);
  useEffect(() => {
    {selectedProductData?.productid&&getproductbyid()}
    // {!user?.shipping_address?.address&&getlocation();}
  }, []);
  
  const getproductbyid = () => {
    setLoading(true);
    GetApi(`getProductById/${selectedProductData?.productid}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status ) {
          setproductdetail(res.data);
          setrendermap(true)
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  // const getlocation = () => {
  //   CuurentLocation(res => {
  //     setcurrentLocation({
  //       latitude: res.coords.latitude,
  //       longitude: res.coords.longitude,
  //       latitudeDelta: 0.05,
  //       longitudeDelta: 0.05,
  //     });
  //     GetCurrentAddressByLatLong({
  //       lat: res.coords.latitude,
  //       long: res.coords.longitude,
  //     }).then(res => {
  //       console.log('res===>', res);
  //       setlocationadd(res.results[0].formatted_address);
  //     });
  //   });
  // };
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

const Mapcom=useCallback(()=>{
  return(<MapView
    ref={mapRef}
    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
    style={styles.map}
    region={
      {
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }
    }
    showsUserLocation={true}
    >
    {/* {destination && ( */}
   {productdetail?.posted_by?.location?.coordinates?.length>0&& <Marker
          coordinate={{
            latitude: productdetail?.posted_by?.location.coordinates[1],
            longitude: productdetail?.posted_by?.location.coordinates[0],
          }}
          title={'Destination'}
          pinColor="green"
        // image={require('../../Assets/Images/Start.png')}
        />}
    {currentLocation?.latitude&&<Marker
          coordinate={{
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
          }}
          title={'Sourse'}
          pinColor={'red'}
        />}
    {currentLocation && productdetail?.posted_by?.location?.coordinates?.length>0&& (
    <MapViewDirections
      origin={{
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
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
      onError={(errorMessage) => {
        console.error('MapViewDirections Error: ', errorMessage);
      }}
      apikey={Googlekey}
      strokeWidth={3}
      strokeColor={Constants.custom_yellow}
      optimizeWaypoints={true}
    />
     )} 
  </MapView>)
},[rendermap,currentLocation])

  return (
    <View style={styles.container}>
      <View style={{height:'35%'}}>
      {currentLocation?.latitude&&<Mapcom />}
      <TouchableOpacity
          style={styles.baccover}
          onPress={() => goBack()}>
          <BackIcon height={20} width={20}/>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                     style={{flex:1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.maintxt}>Order category</Text>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt} numberOfLines={2}>
              {productdetail?.posted_by?.address}
            </Text>
            <LocationIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt} numberOfLines={2}>
              {locationadd}
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
              useradd: locationadd,
              description: description,
              sheduledate: extradate,
              currentLocation: currentLocation,
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
    flex: 1,
    // height:400
  },
  baccover:{
            position: 'absolute',
            top: 20,
            left: 20,
            borderRadius: 30,
            backgroundColor:Constants.white,
            height:35,
            width:35,
            justifyContent:'center',
            alignItems:'center',
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
});
