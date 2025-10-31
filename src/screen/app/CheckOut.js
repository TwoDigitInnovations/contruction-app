import {
    Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {LoadContext, ToastContext} from '../../../App';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import {navigate} from '../../../navigationRef';
import {TruckIcon} from '../../../Theme';
import Header from '../../Assets/Component/Header';

const Checkout = props => {
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
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

    // const userdata = {
    //   ...addressdata,
    //   userId: addressdata?._id,
    // };

    const data = {
      ...addressdata,
      price: productdata.price,
      product: productdata.productid,
      productname: productdata.productname,
      vendor:productdata.posted_by
    };
    if (location?.latitude && location?.longitude) {
      data.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      };
    }
    if (addressdata?.userid) {
      data.user = addressdata.userid;
    }
    if (productdata.description) {
      data.description = productdata.description;
    }
    if (productdata.sheduledate) {
      data.sheduledate = productdata.sheduledate;
    }
    // data.total = sumdata;

    // console.log('addressdata', addressdata);
    console.log('data', data);

    Post('createOrder', data, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.status) {
          setModalVisible(true);
          setSubmitted(false);
          setaddressdata({
            username: '',
            address: '',
            pincode: '',
            phone: '',
            city: '',
            country: '',
            email: '',
            state: '',
          });
        }
        // {
        //   addressdata?._id &&
        //     (setLoading(true),
        //     Post('updateprofile', userdata, {}).then(
        //       async res => {
        //         setLoading(false);
        //         console.log(res);

        //         if (res.status) {
        //           // navigate('App');
        //         } else {
        //           setToast(res?.message);
        //         }
        //       },
        //       err => {
        //         setLoading(false);
        //         console.log(err);
        //       },
        //     ));
        // }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <View style={styles.container}>
      <Header item={'Product List'} />
      
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // padding:20
  },
  inputbox: {
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    alignSelf: 'center',
    padding: 7,
    flex: 1,
    width:'90%',
    marginHorizontal: 10,
  },
  inrshabox2: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    // flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 15,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  txt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    // textAlign: 'center',
    alignSelf:'center',
  },
});
