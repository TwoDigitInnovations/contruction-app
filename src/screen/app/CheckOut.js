import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {LoadContext, ProductContext, ToastContext, UserContext} from '../../../App';
import Constants, {Currency, FONTS, Googlekey} from '../../Assets/Helpers/constant';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import Header from '../../Assets/Component/Header';
import axios from 'axios';
import { DeliveryIcon } from '../../../Theme';
import { reset } from '../../../navigationRef';

const Checkout = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [tax, settax] = useState(null);
  const [distance, setdistance] = useState(null);
  const [productdetail, setproductdetail] = useState();
  const [settingDate, setsettingDate] = useState();
  const [selectedProductData, setselectedProductData] =
      useContext(ProductContext);
      const [user, setuser] = useContext(UserContext);
console.log("selectedProductData",selectedProductData)
useEffect(() => {
    getproductbyid()
    getSetting()
  }, []);

const getproductbyid = () => {
    setLoading(true);
    GetApi(`getProductById/${selectedProductData?.productid}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setproductdetail(res.data);
          calculateDistance(res?.data?.posted_by?.location?.coordinates)
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
const getSetting = () => {
    setLoading(true);
    GetApi(`getSetting`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setsettingDate(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const calculateDistance = async (cord) => {
    setLoading(true);
    const origin = `${user?.shipping_address?.location?.coordinates[1]},${user?.shipping_address?.location?.coordinates[0]}`;
    const destination2 = `${cord[1]},${cord[0]}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination2}&key=${Googlekey}`;
    console.log('url', url);

    try {
      const response = await axios.get(url);
      const result = response.data;
      setLoading(false);
      console.log(response);
      const dist = result.rows[0].elements[0].distance?.value;
      setdistance(dist ? (dist / 1000).toFixed(0) : 0);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
const totalsum =Number(selectedProductData?.selectedAtribute?.price)*Number(selectedProductData?.inputvalue)
  const submit = () => {
    const data = {
      price: ( totalsum +((totalsum * Number(settingDate?.TaxRate)) / 100) +(distance * Number(settingDate?.RatePerKM)) ).toFixed(0),
      product: productdetail?._id,
      productname: productdetail?.name,
      vendor:productdetail.posted_by?._id,
      location:user?.shipping_address?.location
    };
    if (productdetail.description&&productdetail.description!='') {
      data.description = productdetail.description;
    }
    if (productdetail.sheduledate) {
      data.sheduledate = productdetail.sheduledate;
    }
    console.log('data', data);

    Post('createOrder', data, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.status) {
          setModalVisible(true);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <View style={styles.container}>
      <Header item={'Check Out'} />
      
            <Text>
              <Text style={styles.secendboldtxt}>Product Name : </Text>
              <Text style={styles.secendtxt}>
                {productdetail?.name}
              </Text>
            </Text>
                    <View
                      style={styles.selectatribute}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 15,
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: selectedProductData?.selectedAtribute?.image }}
                          style={{ height: 100, width: 100, borderRadius: 10 }}
                        />
                        <View style={{width:'50%'}}>
                        <Text style={styles.txt}>{selectedProductData?.selectedAtribute?.name}</Text>
                        <Text style={styles.txt3}>{selectedProductData?.inputvalue} {selectedProductData?.selectedAtribute?.unit}</Text>
                      </View>
                      </View>
                      <Text style={[styles.txt2]}>
                        {Currency} {selectedProductData?.selectedAtribute?.price}
                      </Text>
                    </View>

<Text style={styles.deliveloctxt}>Delivery Location</Text>
          <View
            style={[
              styles.totalpointcov,
              { alignItems: 'center', marginBottom: 30 },
            ]}>
            <View style={styles.locatcov}>
              <DeliveryIcon height={30} width={30} color={Constants.black} />
            </View>
            <View style={{ marginLeft: 10,width:'80%' }}>
              <Text style={styles.txt}>{user?.username}</Text>
              <Text style={styles.txt} numberOfLines={1}>
                {/* {user?.shipping_address?.house_no},{' '} */}
                {user?.shipping_address?.address}
              </Text>
            </View>
          </View>

       <View style={styles.btmbox}>
                <Text style={styles.paysumtxt}>Payment Summary</Text>
              <View style={styles.rowbetw2}>
                <Text style={styles.deltxt}>Total</Text>
                <Text style={styles.deltxt2}>{Currency}{totalsum}</Text>
              </View>
              <View style={styles.rowbetw2}>
                <Text style={styles.deltxt}>Tax</Text>
                <Text style={styles.deltxt2}>{Currency}{((totalsum * Number(settingDate?.TaxRate)) / 100).toFixed(0)}</Text>
              </View>
              <View style={styles.rowbetw2}>
                <Text style={styles.deltxt}>Delivery Fee</Text>
                <Text style={styles.deltxt2}>{Currency}{(distance * Number(settingDate?.RatePerKM)).toFixed(0)}</Text>
              </View>
              <View style={styles.rowbetw2}>
                <Text style={styles.deltxt}>Final</Text>
                <Text style={styles.deltxt2}>
                  {Currency}
                  {(
                    totalsum +
                    ((totalsum * Number(settingDate?.TaxRate)) / 100) +
                    (distance * Number(settingDate?.RatePerKM)) 
                  ).toFixed(0)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
          style={[
            styles.button,
            styles.shadowProp,]}
          onPress={() =>submit()}
        >
          <Text style={styles.buttontxt}>Place Order</Text>
        </TouchableOpacity>
        <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          navigate('App');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Image
                source={require('../../Assets/Images/correct.png')}
                style={styles.img}
              />
              <Text style={[styles.txt,{color:Constants.black}]}>Your Order is Confirmed.</Text>
              <Text style={styles.txt2}>Thanks for your Order </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    reset('App');
                  }}
                  style={styles.logOutButtonStyle}
                >
                  <Text style={styles.modalText}>Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    padding:20
  },
  rowbetw2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  paysumtxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  btmbox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    marginTop: 40,
    borderColor:Constants.white
  },
  deltxt: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.SemiBold,
  },
  deltxt2: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  secendtxt: {
    color: Constants.white,
    fontSize: 15,
    textAlign: 'left',
    fontFamily: FONTS.Bold,
    textTransform: 'capitalize',
  },
  secendboldtxt: {
    color: Constants.white,
    fontSize: 15,
    fontFamily: FONTS.Regular,
    alignSelf: 'center',
  },
  selectatribute: {
    flexDirection: 'row',
    // marginHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  txt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  txt2: {
    fontSize: 16,
    color: Constants.custom_yellow,
    fontFamily: FONTS.SemiBold,
  },
  txt3: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  totalpointcov: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  locatcov: {
    height: 40,
    width: 40,
    backgroundColor: Constants.customgrey2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deliveloctxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Bold,
    marginBottom: 10,
    marginTop:20
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
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
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
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
    width:'80%'
  },
  img:{
    height:80,
    width:80,
    marginVertical:10
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
});
