import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ImageBackground,
  Linking,
} from 'react-native';
import React, { useContext, useState} from 'react';
import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
import {
  AccountIcon,
  EditIcon,
  FaqIcon,
  HistorytabIcon,
  HSIcon,
  LogoutIcon,
  PrivacyIcon,
  RightarrowIcon,
  TransactionIcon,
} from '../../../Theme';
import {navigate, reset} from '../../../navigationRef';
import Header from '../../Assets/Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../App';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const VendorAccount = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [user, setuser] = useContext(UserContext);
const InAppBrowserFunc=async(props)=>{
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(props, {
          // Customization options
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: Constants.custom_yellow,
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          enableBarCollapsing: false,
        });
      } else {
        Linking.openURL(props);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View style={[styles.container]}>
      <Header item={'Profile Settings'} />
      <ImageBackground
        source={require('../../Assets/Images/concretebg.png')}
        style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={[styles.procov]} onPress={()=>navigate('VendorProfile')}>
             <View style={styles.toppart}>
            <View style={{flexDirection: 'row', gap: 15}}>
              <Image
                source={
                  user?.img
                    ? {
                        uri: `${user.img}`,
                      }
                    : require('../../Assets/Images/profile3.png')
                }
                style={styles.proimg}
              />
              <View>
                <Text style={styles.nametxt}>{user?.username}</Text>
                <Text style={styles.protxt2}>{user?.email}</Text>
              </View>
            </View>
            <EditIcon style={{alignSelf:'center'}} color={Constants.white}/>
            </View>
            <View style={styles.toppart}>
                          <View>
                          <Text style={styles.headtxt2}>Available Balance</Text>
                    <Text style={styles.headtxt3}>{Currency}{user?.wallet?user?.wallet:0}</Text>
                    </View>
                    <Text style={styles.headtxt4} onPress={()=>navigate('DriverWithdraw')}>Withdraw</Text>
                        </View>
          </TouchableOpacity>
          {/* </View> */}
          {/* <View style={styles.verline}></View> */}
          <View style={[styles.card, styles.shadowProp]}>
            <TouchableOpacity
              style={styles.proopt}
              onPress={() => navigate('VendorProfile')}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <AccountIcon height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Account</Text>
                  <Text style={[styles.protxt4]}>
                    Make changes to your account
                  </Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.proopt}
              onPress={() => navigate('DriverTransactionHistory')}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <TransactionIcon height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Transaction History</Text>
                  <Text style={[styles.protxt4]}>
                    Check your transaction history
                  </Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.proopt}
              onPress={() => navigate('VendorHistory')}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <HistorytabIcon height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>History</Text>
                  <Text style={[styles.protxt4]}>
                    Check your order history
                  </Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.proopt}
              onPress={()=>InAppBrowserFunc('https://tawk.to/chat/68e8bb5a928294194e5fcd1d/1j76hnmv5')}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <HSIcon height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Help and Support</Text>
                  <Text style={[styles.protxt4]}>Cheak your notification</Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
             <TouchableOpacity
              style={styles.proopt}
              onPress={()=>navigate('Faq')}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <FaqIcon height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Faq</Text>
                  <Text style={[styles.protxt4]}>Find Answers to Your Questions</Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.proopt}
              onPress={() => navigate('Privacy')}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <PrivacyIcon height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Privacy policies</Text>
                  <Text style={[styles.protxt4]}>
                    Manage your device security
                  </Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.proopt}
              onPress={async () => {
                setModalVisible2(true);
              }}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <LogoutIcon color={Constants.black} height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Delete Account</Text>
                  <Text style={[styles.protxt4]}>Delete your account</Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.proopt}
              onPress={async () => {
                setModalVisible(true);
              }}>
              <View style={styles.protxt3}>
                <View style={styles.iconcov}>
                  <LogoutIcon color={Constants.black} height={20} width={20} />
                </View>
                <View>
                  <Text style={[styles.protxt]}>Log Out</Text>
                  <Text style={[styles.protxt4]}>
                    Further secure your account for safety
                  </Text>
                </View>
              </View>
              <RightarrowIcon
                color={Constants.customgrey}
                height={20}
                width={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <Text style={styles.textStyle}>
                Are you sure you want to sign out?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    await AsyncStorage.removeItem('userDetail');
                    reset('Auth');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <Text style={[styles.textStyle2, {color: Constants.red}]}>
                WARNING: You are about to delete your account. This action is
                permanent and cannot be undone.
              </Text>
              <Text style={styles.textStyle3}>
                • All your data, including personal information, and settings,
                will be permanently erased.
              </Text>
              <Text style={styles.textStyle3}>
                • You will lose access to all services and benefits associated
                with your account.
              </Text>
              <Text style={styles.textStyle3}>
                • You will no longer receive updates, support, or communications
                from us.
              </Text>
              <Text style={styles.textStyle}>
                Are you sure you want to delete your account?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible2(!modalVisible2)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible2(!modalVisible2);
                    await AsyncStorage.removeItem('userDetail');
                    reset('Auth');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VendorAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // paddingVertical: 20,
  },
  toppart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  proimg: {
    height: 50,
    width: 50,
    borderRadius: 35,
  },
  protxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  protxt5: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  protxt4: {
    color: Constants.customgrey,
    fontSize: 11,
    fontFamily: FONTS.Regular,
  },
  nametxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  protxt2: {
    color: Constants.white,
    fontFamily: FONTS.Regular,
    fontSize: 12,
    width: 180,
    marginTop: 5,
  },
  procov: {
    marginTop: 25,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Constants.custom_black,
    padding: 15,
    borderRadius: 7,
    gap: 10,
  },
  headtxt2: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Regular,
  },
  headtxt3: {
    fontSize: 20,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  headtxt4: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Constants.white,
    padding: 10,
    width: '30%',
    borderRadius: 15,
    alignSelf: 'center',
  },
  verline: {
    height: 1,
    width: '100%',
    backgroundColor: Constants.customgrey,
    marginVertical: 30,
  },
  proopt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 5,
    marginVertical: 15,
  },
  protxt3: {
    flexDirection: 'row',
    gap: 20,
  },

  /////////logout model //////
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

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  textStyle2: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  textStyle3: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 16,
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
    gap: 3,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.red,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  shadowProp: {
    shadowColor: Constants.black,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  card: {
    backgroundColor: Constants.white,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: '90%',
    marginVertical: 20,
    alignSelf: 'center',
    marginBottom:90
  },
  iconcov: {
    backgroundColor: Constants.customgrey,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
