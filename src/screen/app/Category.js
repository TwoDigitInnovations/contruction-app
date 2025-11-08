import {
  Animated,
  Easing,
  FlatList,
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
import { BackIcon, CrossIcon, LocationEditIcon } from '../../../Theme';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { goBack, navigate } from '../../../navigationRef';
import MapViewDirections from 'react-native-maps-directions';
import moment from 'moment';
import {
  AddressContext,
  LoadContext,
  LocationContext,
  ProductContext,
  UserContext,
} from '../../../App';
import { GetApi } from '../../Assets/Helpers/Service';
import { useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';

const Category = props => {
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const animatedValue = new Animated.Value(0);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [scheduleDate, setScheduleDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [productdetail, setproductdetail] = useState();
  const [description, setdescription] = useState('');
  const [loading, setLoading] = useContext(LoadContext);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [usedLocation, setUsedLocation] = useState();
  const [usedAddress, setUsedAddress] = useState();
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [user, setuser] = useContext(UserContext);
  const [selectedProductData, setselectedProductData] =
    useContext(ProductContext);
    const timeRef = useRef();
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

  // Generate next 7 dates
  const dates = Array.from({ length: 7 }, (_, i) => moment().add(i, "days"));
  const times=[
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM"
]

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

          <TouchableOpacity style={styles.flr} TouchableOpacity onPress={() =>{scheduleDate?setScheduleDate(null):timeRef?.current.show()}}>
              <Text style={styles.shdtxt}>Schedule Delievery</Text>
              <View>
                {scheduleDate ? (
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
              </View>
          </TouchableOpacity>
            {scheduleDate && (
              <Text style={styles.shdtxt2} onPress={() => timeRef?.current.show()}>
                {moment(scheduleDate).format('DD/MM/YYYY ')} {selectedSlot}
              </Text>
            )}
          <TouchableOpacity
            style={[styles.button, styles.shadowProp]}
            onPress={() => {
              if (user?.shipping_address?.address) {
                navigate('CheckOut');
                setselectedProductData({
                  ...selectedProductData,
                  description: description,
                  sheduledate: selectedDate,
                  selectedSlot
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
      <ActionSheet
        ref={timeRef}
        closeOnTouchBackdrop={true}
        containerStyle={{ backgroundColor: Constants.white }}
      >
        <View
          style={styles.txtcov}
        >
          <Text style={styles.sheetheadtxt}>
            Choose Delivery Date
          </Text>
          <CrossIcon
            style={styles.popupcross}
            height={26}
            width={26}
            onPress={() => {timeRef.current.hide()}}
          />
        </View>

      <FlatList
        horizontal
        data={dates}
        renderItem={({ item,index }) => (
          <TouchableOpacity
            style={[
              styles.dateItem,
              {marginLeft:index===0?15:0},
              selectedDate.isSame(item, "day") && styles.selectedDate,
            ]}
            onPress={() => setSelectedDate(item)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate.isSame(item, "day") && styles.selectedDateText,
              ]}
            >
              {item.format("ddd")}
            </Text>
            <Text
              style={[
                styles.dateText,
                selectedDate.isSame(item, "day") && styles.selectedDateText,
              ]}
            >
              {item.format("DD")}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      />

        <View style={styles.horline}></View>
        <Text style={[styles.sheetheadtxt,{marginLeft:10}]}>
            Choose Delivery Slot
          </Text>
      <FlatList
        data={times}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.slot,
              selectedSlot === item && styles.selectedSlot,
            ]}
            onPress={() => setSelectedSlot(item)}
          >
            <Text
              style={[
                styles.slotText,
                selectedSlot === item && styles.selectedSlotText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />


        <TouchableOpacity
          style={[styles.button, styles.shadowProp,{
              backgroundColor:!scheduleDate&&!selectedSlot? '#baa172': Constants.custom_yellow,}]}
          onPress={() => {setScheduleDate(selectedDate),timeRef.current.hide()}}
          disabled={!scheduleDate&&!selectedSlot}
        >
          <Text style={styles.buttontxt}>
            Set Date and Time-slot
          </Text>
        </TouchableOpacity>
      </ActionSheet>
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
  shdtxt2: {
    fontSize: 16,
    color: Constants.custom_yellow,
    fontFamily: FONTS.SemiBold,
    marginHorizontal:20
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

//////schedule sheet style
  dateItem: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    width: 70,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: "center",
  },
  selectedDate: { backgroundColor: Constants.custom_yellow },
  dateText: {
    fontSize: 16,
    color:Constants.black,
    fontFamily:FONTS.Medium,
 },
  selectedDateText: { 
    fontSize: 16,
    color:Constants.white,
    fontFamily:FONTS.Medium,
  },
  slot: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    width:'45%',
    marginLeft:10
  },
  selectedSlot: { backgroundColor: Constants.custom_yellow},
  slotText: { 
    textAlign: "center", 
    fontSize: 14,
    color:Constants.black,
    fontFamily:FONTS.Medium },
  selectedSlotText: { 
    fontSize: 16,
    color:Constants.white,
    fontFamily:FONTS.Medium,
  },
  sheetheadtxt: { 
    fontSize: 16,
    color:Constants.black,
    fontFamily:FONTS.SemiBold,
  },
  selectionBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#E8F0FF",
    borderRadius: 10,
    alignItems: "center",
  },
  horline: {
    borderTopWidth: 1,
    borderColor: '#dedede',
    marginBottom:10
  },
  txtcov:{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 15,
            paddingHorizontal: 10,
          },
});
