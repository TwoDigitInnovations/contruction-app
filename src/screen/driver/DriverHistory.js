import {
  Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useContext, useEffect, useState} from 'react';
  import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
  import {navigate} from '../../../navigationRef';
import { LoadContext, ToastContext } from '../../../App';
import { GetApi } from '../../Assets/Helpers/Service';
import moment from 'moment';
import Header from '../../Assets/Component/Header';
  
  const DriverHistory = () => {
           const [toast, setToast] = useContext(ToastContext);
           const [loading, setLoading] = useContext(LoadContext);
    const dumydata = [1, 2, 3, 4, 5];
    const [orderlist,setorderlist]=useState([])
    // const IsFocused = useIsFocused();
    useEffect(() => {
      // if (IsFocused) {
        getorderhistory();
      // }
    }, []);

  const getorderhistory = () => {
      setLoading(true);
      GetApi('orderhistoryfordriver', {}).then(
        async res => {
          setLoading(false);
          console.log('$%#@^&**', res);
          setorderlist(res?.data);
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
  };
    return (
      <View style={styles.container}>
        <Header item={'History'} />
        <View style={{flex:1,paddingBottom:70}}>
        <FlatList
          data={orderlist}
          renderItem={({item},index) => (
            <TouchableOpacity style={styles.box} onPress={() => navigate('DriverOrder',item._id)} key={index}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  // source={require('../../Assets/Images/profile.png')}
                  source={
                    item?.user?.img
                      ? {
                          uri: `${item?.user?.img}`,
                        }
                      : require('../../Assets/Images/profile.png')
                  }
                  style={styles.hi}
                  // onPress={()=>navigate('Account')}
                />
                <View>
                  <Text style={styles.name}>{item?.user?.username}</Text>
                  <Text style={styles.redeembtn}>{moment(item?.sheduledate?item?.sheduledate:item?.createdAt).format('DD-MM-YYYY ')}</Text>
                </View>
              </View>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Location : </Text>
                <Text style={styles.secendtxt2}>
                {item?.user?.address}
                </Text>
              </View>
              <View style={styles.txtcol}>
                <View style={{}}>
                  <View style={styles.secendpart}>
                    <Text style={styles.secendboldtxt}>Product : </Text>
                    <Text style={styles.secendtxt}>{item?.productname}</Text>
                  </View>
                  
                </View>
                <Text style={styles.amount}>{Currency} {item?.deliveryfee}</Text>
              </View>
              
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Dimensions.get('window').height - 200,
              }}>
              <Text
                style={{
                  color: Constants.white,
                  fontSize: 20,
                  fontFamily: FONTS.SemiBold,
                }}>
                No Orders available
              </Text>
            </View>
          )}
        />
        </View>
        
      </View>
    );
  };
  
  export default DriverHistory;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Constants.custom_black,
    },
    box: {
      backgroundColor: Constants.white,
      marginVertical: 10,
      padding: 20,
    },
    hi: {
      marginRight: 10,
      height: 50,
      width: 50,
      borderRadius: 50,
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
    name: {
      color: Constants.black,
      fontFamily: FONTS.SemiBold,
      fontSize: 14,
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
    modalText: {
      color: Constants.white,
      // fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: FONTS.Bold,
      fontSize: 14,
    },
    cancelAndLogoutButtonWrapStyle2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      gap: 3,
    },
    cancelButtonStyle: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      marginRight: 10,
      borderColor: Constants.custom_yellow,
      borderWidth: 1,
      borderRadius: 10,
    },
    logOutButtonStyle: {
      flex: 0.5,
      backgroundColor: Constants.custom_yellow,
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    },
    //////Model////////
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
      paddingVertical: 20,
      alignItems: 'center',
      width: '90%',
      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 2,
      // },
      // shadowOpacity: 0.25,
      // shadowRadius: 4,
      // elevation: 5,
      // position: 'relative',
    },
  
    textStyle: {
      color: Constants.black,
      // fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: FONTS.Medium,
      fontSize: 16,
      margin: 20,
      marginBottom: 10,
    },
    cancelAndLogoutButtonWrapStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      gap: 3,
    },
    alrt: {
      color: Constants.black,
      fontSize: 18,
      fontFamily: FONTS.Bold,
      // backgroundColor: 'red',
      width: '100%',
      textAlign: 'center',
      borderBottomWidth: 1.5,
      borderBottomColor: Constants.customgrey2,
      paddingBottom: 20,
    },
  });
  