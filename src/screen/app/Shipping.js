import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import LocationDropdown from '../../Assets/Component/LocationDropdown';
import {AddressContext, LoadContext, LocationContext, ToastContext} from '../../../App';
import {checkEmail} from '../../Assets/Helpers/InputsNullChecker';
import {goBack, navigate} from '../../../navigationRef';

const Shipping = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [submitted, setSubmitted] = useState(false);
  const [from, setFrom] = useState('');
  const [addressdata, setaddressdata] = useState({
    username: '',
    email: '',
    state: '',
    address: '',
    pincode: '',
    phone: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    data();
  }, []);
  const data = async () => {
    setLoading(true),
      GetApi(`getProfile`, {}).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            // setaddressdata(res.data);
            setaddressdata({...res?.data?.shipping_address,location:res?.data?.shipping_address?.location??{
        type: 'Point',
        coordinates: [currentLocation?.longitude, currentLocation?.latitude]
      },address:res?.data?.shipping_address?.address??locationadd})
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

  const submit = () => {
    if (
      addressdata.username === '' ||
      addressdata.address === '' ||
      addressdata.pincode === '' ||
      addressdata.phone === '' ||
      addressdata.city === '' ||
      addressdata.country === '' ||
      addressdata.email === '' ||
      addressdata.state === ''
    ) {
      setSubmitted(true);
      return;
    }

    const emailcheck = checkEmail(addressdata.email.trim());
    if (!emailcheck) {
      setToast('Your email id is invalid');
      return;
    }

    Post('updateProfile', {shipping_address:addressdata}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.status) {
          setSubmitted(false);
          goBack()
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getLocationVaue = (lat, add, set) => {
    console.log('lat=======>', lat);
    console.log('add=======>', add);
    // setlocationadd(add);
    setaddressdata({...addressdata, address: add,location:{
        type: 'Point',
        coordinates: [lat.lng, lat.lat],
      }});
  };
  return (
    <View style={styles.container}>
      <Header back={true} item={'Shipping address'} />
      <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex:1}}
                  >
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 20}} keyboardShouldPersistTaps='handled'>
        <Text style={styles.name}>Full Name</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.input, styles.shadowProp2]}
            placeholder="Name"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.username}
            onChangeText={username =>
              setaddressdata({...addressdata, username})
            }></TextInput>
        </View>
        {submitted && addressdata.username === '' && (
          <Text style={styles.require}>Name is required</Text>
        )}
        <Text style={styles.name}>Address</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <View style={[styles.input, styles.shadowProp2]}>
            <LocationDropdown
              value={addressdata.address}
              focus={from === 'location'}
              setIsFocus={setFrom}
              from="location"
              getLocationVaue={(lat, add) => getLocationVaue(lat, add)}
            />
          </View>
        </View>
        {submitted && addressdata.address === '' && (
          <Text style={styles.require}>Address is required</Text>
        )}

        <Text style={styles.name}>Email</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.input, styles.shadowProp2]}
            placeholder="Email"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.email}
            onChangeText={email =>
              setaddressdata({...addressdata, email})
            }></TextInput>
        </View>
        {submitted && addressdata.email === '' && (
          <Text style={styles.require}>Name is required</Text>
        )}

        <Text style={styles.name}>Mobile Number</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.input, styles.shadowProp2]}
            placeholder="Number"
            keyboardType="number-pad"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.phone}
            onChangeText={phone =>
              setaddressdata({...addressdata, phone})
            }></TextInput>
        </View>
        {submitted && addressdata.phone === '' && (
          <Text style={styles.require}>Number is required</Text>
        )}
        <Text style={styles.name}>City</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.input, styles.shadowProp2]}
            placeholder="City"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.city}
            onChangeText={city =>
              setaddressdata({...addressdata, city})
            }></TextInput>
        </View>
        {submitted && addressdata.city === '' && (
          <Text style={styles.require}>City is required</Text>
        )}
        <Text style={styles.name}>Country</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.input, styles.shadowProp2]}
            placeholder="Country"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.country}
            onChangeText={country =>
              setaddressdata({...addressdata, country})
            }></TextInput>
        </View>
        {submitted && addressdata.country === '' && (
          <Text style={styles.require}>Country is required</Text>
        )}
        <View style={styles.twoboxcov}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <Text style={[styles.name, {marginHorizontal: 0}]}>Zip Code</Text>
            <View style={[styles.inputbox2, styles.shadowProp]}>
              <TextInput
                style={[styles.input, styles.shadowProp2]}
                placeholder="Zip Code"
                placeholderTextColor={Constants.customgrey}
                value={addressdata?.pincode}
                onChangeText={pincode =>
                  setaddressdata({...addressdata, pincode})
                }></TextInput>
            </View>
          </View>
          {submitted && addressdata.pincode === '' && (
            <Text style={styles.require2}>Zip code is required</Text>
          )}
          </View>
          <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <Text style={[styles.name, {marginHorizontal: 0}]}>State</Text>
            <View style={[styles.inputbox2, styles.shadowProp]}>
              <TextInput
                style={[styles.input, styles.shadowProp2]}
                placeholder="Pin Code"
                placeholderTextColor={Constants.customgrey}
                value={addressdata?.state}
                onChangeText={state =>
                  setaddressdata({...addressdata, state})
                }></TextInput>
            </View>
          </View>
          {submitted && addressdata.state === '' && (
            <Text style={styles.require2}>State is required</Text>
          )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.shadowProp]}
          onPress={() => submit()}>
          <Text style={styles.buttontxt}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(false);
          navigate('App');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <Text style={styles.txt}>Your Order is Confirmed.</Text>
              <Text style={styles.txt2}>Thanks for your Order </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    navigate('App');
                    // await AsyncStorage.removeItem('userDetail');
                    // reset('App');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Shipping;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // padding: 20,
  },
  headtxt: {
    fontSize: 24,
    // fontWeight: '700',
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  input: {
    // height:60,
    flex: 1,
    backgroundColor: Constants.light_black,
    color: Constants.white,
    borderRadius: 10,
    paddingLeft: 10,
    // shadowColor: '#FFFFFF',
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 5,
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  inputbox2: {
    height: 60,
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 10,

    // flexDirection: 'row',
    // width: '90%',
    // alignSelf: 'center',
  },
  inputbox: {
    height: 60,
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 10,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  name: {
    color: Constants.white,
    fontSize: 12,
    fontFamily: FONTS.Regular,
    marginVertical: 10,
    marginHorizontal: 20,
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
    marginTop: 30,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 20,
    fontSize: 14,
    marginTop:10
  },
  require2: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    // marginLeft: 10,
    fontSize: 14,
    marginTop:10
  },
  twoboxcov: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    gap: 15,
  },
  txt: {
    color: Constants.black,
    fontSize: 20,
    marginVertical: 10,
    fontFamily: FONTS.Medium,
  },
  txt2: {
    color: Constants.black,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: FONTS.Medium,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 5,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 15,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
});
