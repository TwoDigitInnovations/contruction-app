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
import Header from '../../Assets/Component/Header';
import {DeleteIcon, StatusIcon, ThreedotIcon, ViewIcon} from '../../../Theme';
import {LoadContext, ToastContext} from '../../../App';
import {useIsFocused} from '@react-navigation/native';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import moment from 'moment';

const Work = () => {
  const [modalVisible, setModalVisible] = useState(null);
  const [assignmodel, setassignmodel] = useState(false);
  const [assignmodel2, setassignmodel2] = useState(false);
  const [currentStatus, setcurrentStatus] = useState();
  const [orderlist, setorderlist] = useState();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [page, setPage] = useState(1);
  const [orderid, setorderid] = useState('');
  const [curentData, setCurrentData] = useState([]);
  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      getorders(1);
    }
  }, [IsFocused]);

  const getorders = p => {
    setPage(p);
    setLoading(true);
    GetApi(`getvendororder?page=${p}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setCurrentData(res.data);
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

  const assigdriver = (id,status) => {
    const body={
      id,
      status
    }
    setLoading(true);
    Post(`changeorderstatus`, body).then(
      async res => {
        setLoading(false);
        console.log(res);
        getorders(1);
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
      <View style={{marginBottom: 140}}>
        <FlatList
          data={orderlist}
          showsVerticalScrollIndicator={false}
          renderItem={({item}, i) => {
            return (
              <View key={i}>
                <TouchableOpacity
                  style={[
                    styles.box,
                    {
                      backgroundColor:
                        item?.status === 'Pending'
                          ? Constants.white
                          : item?.status === 'Driverassigned'
                          ? '#E9FFE9'
                          : '#FFF6D8',
                    },
                  ]}
                  onPress={()=>item.status === 'Accepted'?navigate('OrderDetail', item):navigate('VenderOrders', item._id)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
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
                        <View style={{flexDirection:'row',gap:7,alignItems:'center'}}>
                        <Text style={styles.redeembtn}>
                          {moment(item?.sheduledate?item?.sheduledate:item?.createdAt).format('DD-MM-YYYY ')}   
                          </Text>
                          {item?.sheduledate&&<Text style={styles.amount2}>{item?.selectedSlot}</Text>}
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(item._id), console.log(item._id);
                      }}
                      style={{height: 30, width: 30, alignItems: 'flex-end'}}>
                      <ThreedotIcon />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.secendpart}>
                    <Text style={styles.secendboldtxt}>Location : </Text>
                    <Text style={styles.secendtxt2}>{item?.user?.address}</Text>
                  </View>
                   <View style={styles.secendpart}>
                                        <Text style={styles.secendboldtxt}>Product : </Text>
                                        <Text style={styles.secendtxt}>{item?.product?.name}</Text>
                                      </View>
                  
                                                        <View style={styles.secendpart}>
                                        <Text style={styles.secendboldtxt}>{item?.inputvalue?"Qty":"Category"} : </Text>
                                        <Text style={styles.secendtxt}> {item?.inputvalue?`${item?.inputvalue} ${item?.selectedAtribute?.unit}`:item?.product?.categoryname}</Text>
                                    </View>

                  <View style={styles.txtcol}>
                      <View style={styles.statuscov}>
                        {item?.status === 'Driverassigned' ? (
                          <Text style={styles.status}>Driver Assigned</Text>
                        ) : (
                          <Text></Text>
                        )}
                        <Text style={styles.amount}>{Currency} {item?.price}</Text>
                      </View>
                  </View>
                 {item.status === 'Pending' && <View style={styles.cancelAndLogoutButtonWrapStyle2}>
                                    <TouchableOpacity style={styles.cancelButtonStyle} onPress={()=>{setcurrentStatus('Reject'),setassignmodel2(true),setorderid(item?._id)}}>
                                      <Text
                                        style={[styles.modalText, {color: Constants.custom_yellow}]}>
                                        Reject
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.acceptButtonStyle} onPress={()=>{setcurrentStatus('Accept'),setassignmodel2(true),setorderid(item?._id)}}>
                                      <Text style={styles.modalText}>Accept</Text>
                                    </TouchableOpacity>
                                  </View>}
                </TouchableOpacity>

                {modalVisible === item._id && (
                  <TouchableOpacity
                    style={styles.backdrop}
                    onPress={() => setModalVisible(null)}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        {item.status === 'Accepted' && (
                          <TouchableOpacity
                            style={styles.popuplistcov}
                            onPress={() => {
                              navigate('OrderDetail', item),
                                setModalVisible(null);
                            }}>
                            <View style={styles.popuplistcov2}>
                              <ViewIcon />
                              <Text>View Order Details</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {item.status === 'Packed' && (
                          <TouchableOpacity
                            style={styles.popuplistcov}
                            onPress={() => {
                              setassignmodel(true),
                                setModalVisible(null),
                                setorderid(item._id);
                            }}>
                            <View style={styles.popuplistcov2}>
                              <ViewIcon />
                              <Text style={styles.popuptxt}>Assign Driver</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.popuplistcov}
                          onPress={() => {
                            navigate('VenderOrders', item._id),
                              setModalVisible(null);
                          }}>
                          <View style={styles.popuplistcov2}>
                            <StatusIcon />
                            <Text style={styles.popuptxt}>Status</Text>
                          </View>
                        </TouchableOpacity>
                        {/* <View style={styles.popuplistcov}>
                    <View style={styles.popuplistcov2}>
                      <DeleteIcon />
                      <Text>Delete Work Order</Text>
                    </View>
                  </View> */}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
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
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={assignmodel}
        onRequestClose={() => {
          setassignmodel(!assignmodel);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            {/* <Text style={styles.alrt}>Alert !</Text> */}
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to assign driver !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setassignmodel(!assignmodel)}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    assigdriver(orderid,'Driverassigned'), setassignmodel(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={assignmodel2}
        onRequestClose={() => {
          setassignmodel2(!assignmodel2);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to {currentStatus} this order !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setassignmodel2(!assignmodel2)}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    assigdriver(orderid,currentStatus==='Reject'?'Rejected':'Accepted'), setassignmodel2(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Work;

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
    marginTop: 5,
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
    // alignSelf: 'flex-end',
  },
  amount2: {
    color: Constants.custom_yellow,
    fontSize: 14,
    fontFamily: FONTS.Bold,
    textDecorationLine:'underline'
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

  ///////Pop up model////
  centeredView: {
    position: 'absolute',
    right: 20,
    top: 60,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    // paddingVertical: 20,
    // alignItems: 'center',
    boxShadow: '0px 0px 8px 0.05px grey',
    // paddingHorizontal:10
  },
  popuplistcov: {
    // marginVertical:10,
    borderBottomWidth: 1,
    borderColor: Constants.customgrey,
  },
  popuplistcov2: {
    flexDirection: 'row',
    gap: 10,
    margin: 10,
    minWidth: 150,
    alignItems: 'center',
    // borderBottomWidth:1,
    // borderColor:Constants.customgrey
  },
  backdrop: {
    // flex:1,
    // backgroundColor:Constants.red,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  popuptxt: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    color: Constants.black,
    paddingRight: 5,
  },

  /////model///
  centeredView2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
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
  ////////end////////

  cancelAndLogoutButtonWrapStyle2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // marginTop: 10,
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
    acceptButtonStyle: {
      flex: 0.5,
      backgroundColor: Constants.custom_yellow,
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
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
    modalText: {
      color: Constants.white,
      fontFamily: FONTS.SemiBold,
      fontSize: 14,
    },
});
