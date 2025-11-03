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
import { LoadContext, ToastContext, UserContext } from '../../../App';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
  
  const DriverWork = () => {
    const [modalVisible, setModalVisible] = useState(null);
    const [acceptmodel, setacceptmodel] = useState(false);
    const dumydata = [{name:'hello'}, {name:'hello'}, {name:'hello'}, {name:'hello'}];

    const [orderid, setorderid] = useState('');
        const [toast, setToast] = useContext(ToastContext);
        const [loading, setLoading] = useContext(LoadContext);
        const [user, setuser] = useContext(UserContext);
        const [currentTab, setCurrentTab] = useState('pending')
        const [orderlist,setorderlist]=useState([])
          const IsFocused = useIsFocused();
          useEffect(() => {
            if (IsFocused&&user?.verified==='VERIFIED') {
              setorderlist([])
              nearbylocation();
              setCurrentTab('pending')
            }
          }, [IsFocused]);

        const nearbylocation = () => {
          CuurentLocation(res => {
            //   const data = {
            //     track: {
            //       type: 'Point',
            //       coordinates: [res.coords.longitude, res.coords.latitude],
            //     },
      
            //   }
            // console.log('longitude===>', location.longitude);
            const data2 = {
              location: [Number(res.coords.longitude), Number(res.coords.latitude)]
            };
            // const data2 = {
            //   location: [87.56486769765615, 22.471533774911393],
            //   categoryId:data
            // };
            console.log('data==========>', data2);
            setLoading(true);
            Post('nearbyorderfordriver', data2, {}).then(
              async res => {
                setLoading(false);
                console.log('$%#@^&**', res);
                setorderlist(res?.data);
              },
              err => {
                setLoading(false);
                setorderlist([])
                console.log(err);
              },
            );
          });
        };
        const acceptedorderfordriver = () => {
            setLoading(true);
            GetApi('acceptedorderfordriver', {}).then(
              async res => {
                setLoading(false);
                console.log('$%#@^&**', res);
                setorderlist(res?.data);
              },
              err => {
                setLoading(false);
                setorderlist([])
                console.log(err);
              },
            );
        };

        
          const Acceptorder = (id) => {
            setLoading(true);
            Post(`acceptorderdriver/${id}`, {}).then(
              async res => {
                setLoading(false);
                console.log(res);
                if (res?.status) {
                  nearbylocation()
                  
                } else {
                  if (res?.message) {
                    setToast(res?.message)
                  }
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
        {user?.verified==='VERIFIED'?<View>
        <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            borderBottomColor: currentTab === 'pending' ? Constants.custom_yellow : 'lightgray',
            borderBottomWidth: currentTab === 'pending' ? 5 : 2,
            height: 50,
            backgroundColor: currentTab === 'pending' ? 'white' : Constants.lightgrey,
            justifyContent: 'center'
          }}
          onPress={() => { setorderlist([]); nearbylocation(),setCurrentTab('pending'),setModalVisible(null) }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
              color: currentTab === 'pending' ? Constants.custom_yellow : 'white'
            }}
          >Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          flex: 1,
          borderBottomColor: currentTab === 'ongoing' ? Constants.custom_yellow : 'lightgray',
          borderBottomWidth: currentTab === 'ongoing' ? 5 : 2,
          height: 50,
          backgroundColor: currentTab === 'ongoing' ? 'white' : Constants.lightgrey,
          justifyContent: 'center'
        }}
          onPress={() => { setorderlist([]); acceptedorderfordriver(),setCurrentTab('ongoing'),setModalVisible(null) }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
            color: currentTab === 'ongoing' ? Constants.custom_yellow : 'white'
          }}>Ongoing</Text>
        </TouchableOpacity>
      </View>
        <View style={{marginBottom:70,flex:1}}>
        <FlatList
          data={orderlist}
          showsVerticalScrollIndicator={false}
          renderItem={({item},i) =>{return<View key={i}>
              <TouchableOpacity
                style={styles.box}
                >
                <View
                  style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  <TouchableOpacity
                    onPress={() => {setModalVisible(item._id),console.log(item.index)}}
                    style={{height:30,width:30,alignItems:'flex-end'}}>
                    <ThreedotIcon />
                  </TouchableOpacity>
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
                      <Text style={styles.secendboldtxt}>Category : </Text>
                      <Text style={styles.secendtxt}>{item?.product?.categoryname}</Text>
                    </View>
                  </View>
                  <Text style={styles.amount}>{Currency} {item?.price}</Text>
                </View>
                <View style={styles.cancelAndLogoutButtonWrapStyle2}>
                  {/* <TouchableOpacity style={styles.cancelButtonStyle}>
                    <Text
                      style={[styles.modalText, {color: Constants.custom_yellow}]}>
                      Reject
                    </Text>
                  </TouchableOpacity> */}
                  {!item?.driver&&<TouchableOpacity style={styles.acceptButtonStyle} onPress={()=>{setacceptmodel(true),setorderid(item?._id)}}>
                    <Text style={styles.modalText}>Accept</Text>
                  </TouchableOpacity>}
                </View>
              </TouchableOpacity>
             
                {modalVisible ===item._id&&<TouchableOpacity style={styles.backdrop} onPress={() =>setModalVisible(null)}><View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity style={styles.popuplistcov} onPress={()=>{navigate('DriverOrder',item._id),setModalVisible(null)}}>
                      <View style={styles.popuplistcov2}>
                        <ViewIcon />
                        <Text>View Order Details</Text>
                      </View>
                    </TouchableOpacity>
                   {item?.status!='Collected'&& <TouchableOpacity style={styles.popuplistcov} onPress={()=>{navigate('Map',{orderid:item._id,type:'shop'}),setModalVisible(null)}}>
                      <View style={styles.popuplistcov2}>
                        <StatusIcon />
                        <Text>Shop location</Text>
                      </View>
                    </TouchableOpacity>}
                    <TouchableOpacity style={styles.popuplistcov} onPress={()=>{navigate('Map',{orderid:item._id,type:'client'}),setModalVisible(null)}}>
                      <View style={styles.popuplistcov2}>
                        <DeleteIcon color={Constants.customgrey}/>
                        <Text>Client location</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                
              </View>
                </TouchableOpacity>}
              
            </View>}
          }
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
        </View>:
        <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: Dimensions.get('window').height - 300,
                    }}>
                    <Image
                      source={require('../../Assets/Images/waiting.png')}
                      style={{alignSelf: 'center', height: 200, width: 200}}
                    />
                    <Text style={styles.empttxt}>You are not verified yet.</Text>
        <Text style={styles.empttxt2}>
          Please wait for the verification to complete. It may take 3–5 business days.
        </Text>
        
                  </View>}
        <Modal
          animationType="none"
          transparent={true}
          visible={acceptmodel}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setacceptmodel(!acceptmodel);
          }}>
          <View style={styles.centeredView2}>
            <View style={styles.modalView2}>
              <Text style={styles.alrt}>Alert !</Text>
              <View
                style={{
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingHorizontal: 30,
                }}>
                <Text style={styles.textStyle}>
                  Are you sure you want to Accept this ride to delivery !
                </Text>
                <View style={styles.cancelAndLogoutButtonWrapStyle}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setacceptmodel(!acceptmodel)}
                    style={styles.cancelButtonStyle}>
                    <Text
                      style={[styles.modalText, {color: Constants.custom_yellow}]}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.logOutButtonStyle} onPress={()=>{Acceptorder(orderid),setacceptmodel(false)}}>
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
  
  export default DriverWork;
  
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
      fontFamily: FONTS.Bold,
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
      fontSize: 24,
      fontFamily: FONTS.Bold,
      alignSelf: 'flex-end',
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
      // borderBottomWidth:1,
      // borderColor:Constants.customgrey
    },
    backdrop:{
      // flex:1,
      // backgroundColor:Constants.red,
      height: '100%',
      width: '100%',
      position:'absolute',
      top:0,
      
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
    acceptButtonStyle: {
      flex: 1,
      backgroundColor: Constants.custom_yellow,
      borderRadius: 10,
      paddingVertical: 10,
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
    //////Model////////
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
    empttxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
  },
  empttxt2: {
    fontSize: 16,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  });
  