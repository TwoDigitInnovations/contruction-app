import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
import {navigate} from '../../../navigationRef';
import Header from '../../Assets/Component/Header';
import {ThreedotIcon, TickboxIcon, TickIcon} from '../../../Theme';
import {LoadContext, ToastContext} from '../../../App';
import {GetApi} from '../../Assets/Helpers/Service';
import moment from 'moment';

const VenderOrders = props => {
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
              <View style={{flexDirection:'row',gap:7,alignItems:'center'}}>
              <Text style={styles.redeembtn}>{moment(orderdata?.sheduledate?orderdata?.sheduledate:orderdata?.createdAt).format('DD-MM-YYYY ')}</Text>
              {orderdata?.sheduledate&&<Text style={styles.amount2}>{orderdata?.selectedSlot}</Text>}
            </View>
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
            <View style={styles.statuscov}>
              {orderdata?.status === 'Driverassigned' ? (
                <Text style={styles.status}>Driver Assigned</Text>
              ) : orderdata?.status === 'Delivered' ? (
                <Text style={styles.status}>Delivered</Text>
              ) : (
                <Text></Text>
              )}
              <Text style={styles.amount}>{Currency} {orderdata?.price}</Text>
            </View>
          </View>
        </View>
      </View>
      {orderdata?.driver && (
        <View style={[styles.box]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                // source={require('../../Assets/Images/profile.png')}
                source={
                  orderdata?.driver?.img
                    ? {
                        uri: `${orderdata?.driver?.img}`,
                      }
                    : require('../../Assets/Images/profile.png')
                }
                style={styles.hi}
                // onPress={()=>navigate('Account')}
              />
              <View>
                <Text style={styles.name}>Driver Details </Text>
                <Text style={styles.name}>{orderdata?.driver?.username}</Text>
              </View>
            </View>
            <Text style={styles.deliveredbtn}>{orderdata?.status}</Text>
          </View>
          <View style={styles.secendpart}>
            <Text style={styles.secendboldtxt}>Location : </Text>
            <Text style={styles.secendtxt2}>{orderdata?.driver?.address}</Text>
          </View>
          <View style={styles.txtcol}>
            <View style={{}}>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Category : </Text>
                <Text style={styles.secendtxt}>
                  {orderdata?.product?.categoryname}
                </Text>
              </View>
            </View>
            <Text style={styles.amount}>{Currency} {orderdata?.price}</Text>
          </View>
        </View>
      )}
      <View style={[styles.box2, styles.shadowProp]}>
        <View style={[styles.inrshabox, styles.shadowProp2]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
               source={
                    orderdata?.selectedAtribute?.image
                      ? {
                          uri: `${orderdata?.selectedAtribute?.image}`,
                        }
                      : require('../../Assets/Images/cement.png')
                  }
                style={styles.hi2}
              />
              <View>
              <Text style={styles.name2}>{orderdata?.product?.name}</Text>
              {orderdata?.inputvalue&&<Text style={styles.waigh}>{orderdata?.selectedAtribute?.name}</Text>}
            </View>
            </View>
            <TickIcon style={{}} />
          </View>
          <View style={[styles.txtcol, {marginVertical: 10,alignItems:'center'}]}>
            {orderdata?.inputvalue&&<Text style={styles.waigh}> {orderdata?.inputvalue} {orderdata?.selectedAtribute?.unit}</Text>}
            <Text style={styles.amount}>{Currency} {orderdata?.selectedAtribute?.price?orderdata?.selectedAtribute?.price:orderdata?.product?.price}</Text>
          </View>
        </View>
      </View>
      {orderdata?.description&&<View style={[styles.inputbox, styles.shadowProp, { height: 110 }]}>
            <TextInput
              style={[
                styles.txtinp,
                styles.shadowProp3,
                { textAlignVertical: 'top' },
              ]}
              multiline={true}
              numberOfLines={4}
              editable={false}
              placeholder="Description"
              value={orderdata?.description}
            ></TextInput>
          </View>}
    </View>
  );
};

export default VenderOrders;

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
  waigh: {
      color: Constants.white,
      fontSize: 14,
      fontFamily: FONTS.SemiBold,
    },
  name: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
  },
  name2: {
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
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
    fontSize: 18,
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
  inputbox: {
    backgroundColor: '#cdcdcd',
    borderRadius: 15,
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
    padding: 7,
    height: 70,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 5px #1b1e22',
  },
  shadowProp3: {
    boxShadow: 'inset 0px 0px 8px 5px #cdcdcd',
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
  amount2: {
    color: Constants.custom_yellow,
    fontSize: 14,
    fontFamily: FONTS.Bold,
    textDecorationLine:'underline'
  },
});
