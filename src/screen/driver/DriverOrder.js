import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useContext, useEffect, useState} from 'react';
  import Constants, {FONTS} from '../../Assets/Helpers/constant';
  import {navigate} from '../../../navigationRef';
  import Header from '../../Assets/Component/Header';
  import {ThreedotIcon, TickboxIcon, TickIcon} from '../../../Theme';
  import {LoadContext, ToastContext} from '../../../App';
  import {GetApi} from '../../Assets/Helpers/Service';
  import moment from 'moment';
  
  const DriverOrder = props => {
    const data = props?.route?.params;
    console.log(data);
    const [toast, setToast] = useContext(ToastContext);
    const [loading, setLoading] = useContext(LoadContext);
    const [orderdata, setorderdata] = useState();
  
    useEffect(() => {
      {
        data && getOrderById();
      }
    }, [data]);
    const getOrderById = () => {
      setLoading(true);
      GetApi(`getOrderById/${data}`, {}).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            setorderdata(res.data);
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
        <Header item={'Orders'} />
        <View
          style={[
            styles.box,
            {
              backgroundColor:
                orderdata?.status === 'Pending'
                  ? Constants.white
                  : orderdata?.status === 'Driverassigned'
                  ? '#E9FFE9'
                  : '#FFF6D8',
            },
          ]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                // source={require('../../Assets/Images/profile.png')}
                source={
                  orderdata?.user?.img
                    ? {
                        uri: `${orderdata?.user?.img}`,
                      }
                    : require('../../Assets/Images/profile.png')
                }
                style={styles.hi}
                // onPress={()=>navigate('Account')}
              />
              <View>
                <Text style={styles.name}>{orderdata?.user?.username}</Text>
                <Text style={styles.redeembtn}>
                  {moment(orderdata?.createdAt).format('DD-MM-YYYY ')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.secendpart}>
            <Text style={styles.secendboldtxt}>Location : </Text>
            <Text style={styles.secendtxt2}>{orderdata?.user?.address}</Text>
          </View>
          <View style={styles.txtcol}>
            <View style={{}}>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Category : </Text>
                <Text style={styles.secendtxt}>
                  {orderdata?.product?.categoryname}
                </Text>
              </View>
              {/* <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>QTY : </Text>
                <Text style={styles.secendtxt}>12</Text>
              </View> */}
              <View style={styles.statuscov}>
                {orderdata?.status === 'Driverassigned' ? (
                  <Text style={styles.status}>Driver Assigned</Text>
                ) : orderdata?.status === 'Delivered' ?(
                  <Text style={styles.status}>Delivered</Text>
                ):<Text></Text>}
                <Text style={styles.amount}>₹{orderdata?.price}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.box]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                // source={require('../../Assets/Images/profile.png')}
                source={
                  orderdata?.vendor?.img
                    ? {
                        uri: `${orderdata?.vendor?.img}`,
                      }
                    : require('../../Assets/Images/profile.png')
                }
                style={styles.hi}
                // onPress={()=>navigate('Account')}
              />
              <View>
                <Text style={styles.name}>Vendor Details </Text>
                <Text style={styles.name}>{orderdata?.vendor?.username}</Text>
              </View>
            </View>
            {/* <Text style={styles.deliveredbtn}>{orderdata?.status}</Text> */}
          </View>
          <View style={styles.secendpart}>
            <Text style={styles.secendboldtxt}>Location : </Text>
            <Text style={styles.secendtxt2}>{orderdata?.vendor?.shop_address}</Text>
          </View>
          <View style={styles.txtcol}>
            {/* <View style={{}}>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Category : </Text>
                <Text style={styles.secendtxt}>
                  {orderdata?.product?.categoryname}
                </Text>
              </View>
            </View> */}
            <View style={{alignItems:'flex-end',width:'100%'}}>
            <Text style={styles.amount}>₹{orderdata?.price}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.box2, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../Assets/Images/cement.png')}
                  // source={
                  //   userDetail?.img
                  //     ? {
                  //         uri: `${userDetail.img}`,
                  //       }
                  //     : require('../../Assets/Images/profile.png')
                  // }
                  style={styles.hi2}
                  // onPress={()=>navigate('Account')}
                />
                <Text style={styles.name2}>{orderdata?.product?.name}</Text>
              </View>
              <TickIcon style={{}} />
            </View>
            <View style={[styles.txtcol, {marginVertical: 10}]}>
              {/* <View style={styles.secendpart}>
                <Text
                  style={[
                    styles.secendboldtxt,
                    {color: Constants.custom_yellow},
                  ]}>
                  QTY :{' '}
                </Text>
                <Text style={[styles.secendtxt, {color: Constants.white}]}>
                  12
                </Text>
              </View> */}
              <Text style={styles.amount}>₹{orderdata?.product?.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default DriverOrder;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Constants.custom_black,
    },
    box: {
      backgroundColor: Constants.white,
      marginVertical: 10,
      padding: 20,
      marginBottom: 20,
    },
  
    hi: {
      marginRight: 10,
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    hi2: {
      marginRight: 10,
      height: 50,
      width: 50,
    },
    redeembtn: {
      color: Constants.white,
      fontSize: 16,
      fontFamily: FONTS.Medium,
      backgroundColor: Constants.custom_yellow,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 7,
      borderRadius: 8,
    },
    deliveredbtn: {
      color: Constants.white,
      fontSize: 16,
      fontFamily: FONTS.Medium,
      backgroundColor: '#17AD53',
      paddingHorizontal: 10,
      paddingVertical: 5,
      // marginVertical: 7,
      height: 35,
      borderRadius: 8,
    },
    name: {
      color: Constants.black,
      fontFamily: FONTS.SemiBold,
      fontSize: 14,
    },
    name2: {
      color: Constants.white,
      fontFamily: FONTS.SemiBold,
      fontSize: 14,
      alignSelf: 'center',
    },
    secendpart: {
      flexDirection: 'row',
      // flex: 1,
      // justifyContent: 'space-between',
      marginLeft: 10,
      marginVertical: 5,
    },
    secendboldtxt: {
      color: Constants.black,
      fontSize: 15,
      fontFamily: FONTS.Bold,
      alignSelf: 'center',
    },
    secendtxt: {
      color: Constants.black,
      fontSize: 15,
      textAlign: 'left',
    },
    secendtxt2: {
      color: Constants.black,
      fontSize: 15,
      textAlign: 'left',
      flex: 1,
    },
    txtcol: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // flex: 1,
    },
    amount: {
      color: Constants.custom_yellow,
      fontSize: 24,
      fontFamily: FONTS.Bold,
      alignSelf: 'flex-end',
    },
    box2: {
      backgroundColor: Constants.custom_black,
      borderRadius: 15,
      marginVertical: 10,
      padding: 7,
      height: 150,
    },
    shadowProp: {
      boxShadow: '0px 0px 8px 0.05px grey',
    },
    shadowProp2: {
      boxShadow: 'inset 0px 0px 8px 5px #1b1e22',
    },
    inrshabox: {
      flex: 1,
      borderRadius: 15,
      backgroundColor: Constants.light_black,
      // justifyContent: 'space-evenly',
      // alignItems: 'center',
      padding: 20,
      // justifyContent:'space-between'
    },
    status: {
      color: Constants.custom_yellow,
      fontSize: 18,
      fontFamily: FONTS.Bold,
      // alignSelf: 'flex-end',
    },
    statuscov: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
  });
  