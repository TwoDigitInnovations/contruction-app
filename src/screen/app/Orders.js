import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {
  ApprovedIcon,
  DownarrIcon,
  PendingIcon,
  TotalorderIcon,
} from '../../../Theme';
import {navigate} from '../../../navigationRef';
import { LoadContext, ToastContext } from '../../../App';
import { useIsFocused } from '@react-navigation/native';
import { GetApi } from '../../Assets/Helpers/Service';
import moment from 'moment';

const Orders = () => {
  const [orderlist ,setorderlist]=useState()
  const [toast, setToast] = useContext(ToastContext);
    const [loading, setLoading] = useContext(LoadContext);
    const [page, setPage] = useState(1);
    const [curentData, setCurrentData] = useState([]);
    const IsFocused = useIsFocused();
    useEffect(() => {
     if (IsFocused) {
       getorders(1)
     }
   }, [IsFocused]);
  const dumydata = [
    {'xyz':'xyz2'},
    {xyz:'xyz'},
  ];
  const getorders = (p) => {
    setPage(p);
    setLoading(true);
    GetApi(`getrequestProductbyuser?page=${p}`).then(
      async res => {
        setLoading(false);
       console.log(res)
        if (res.status) {
          setCurrentData(res.data)
        if (p === 1) {
          setorderlist(res.data);
        } else {
          setorderlist([...orderlist, ...res.data]);
        }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getorders(page + 1);
    }
  };
  return (
    <View style={styles.container}>
      <Header item={'My Orders'} />
      <ImageBackground
        source={require('../../Assets/Images/concretebg.png')}
        style={styles.imgbg}>
        <FlatList
          data={orderlist}
          showsVerticalScrollIndicator={false}
          renderItem={({item},i) => (
            <TouchableOpacity
              style={[styles.inputbox, styles.shadowProp,{marginBottom:dumydata.length ==i+1?150:10}]}
              onPress={() => navigate('Tracking',item?._id)}>
              <View style={[styles.inrshabox, styles.shadowProp2]}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <TotalorderIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center'}}
                  />
                  <View style={{}}>
                    <Text style={[styles.txt, {fontSize: 16}]}>
                      {item.productname}
                    </Text>
                    <Text style={styles.txt}>{moment(item?.sheduledate?item?.sheduledate:item?.createdAt).format('DD-MM-YYYY ')}</Text>
                    <Text style={styles.txt}>{Currency} {item.price}</Text>
                  </View>
                </View>
                <View style={{alignItems:'center'}}>
                  {item?.inputvalue&&<Text style={styles.txt}> {item?.inputvalue} {item?.selectedAtribute?.unit}</Text>}
                  <Text style={styles.deltxt} >{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Dimensions.get('window').height - 300,
              }}>
              <Text
                style={{
                  color: Constants.white,
                  fontSize: 20,
                  fontFamily: FONTS.Medium,
                }}>
                No Orders
              </Text>
            </View>
          )}
          onEndReached={() => {
            if (orderlist && orderlist.length > 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.05}
        />
      </ImageBackground>
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  imgbg: {
    flex: 1,
    paddingTop: 30,
  },
  inputbox: {
    backgroundColor: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    // height: 80,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  txt: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Regular,
    flex: 1,
    // textAlign:'center'
  },
  deltxt: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.custom_yellow,
    textAlign: 'center',
    borderRadius: 5,
    paddingBottom: 6,
    paddingTop: 4,
    paddingHorizontal:5
  },
});
