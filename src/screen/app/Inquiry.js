import {
  ImageBackground,
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
import React, { useState } from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {CrossIcon, DownarrIcon} from '../../../Theme';
import {navigate} from '../../../navigationRef';

const Inquiry = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Header item={'Contact us'} />
      <ImageBackground
        source={require('../../Assets/Images/concretebg.png')}
        style={styles.imgbg}>
        <Text style={styles.maintxt}>Inquiry form</Text>
        <KeyboardAvoidingView 
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      style={{flex:1}}
                    >
        <ScrollView>
        <Text style={styles.btmtext}>Full Name </Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your name"
            style={[styles.input, styles.shadowProp2]}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        <Text style={styles.btmtext}>Email</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your email"
            style={[styles.input, styles.shadowProp2]}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        <Text style={styles.btmtext}>Phone number</Text>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            placeholder="Enter your number"
            style={[styles.input, styles.shadowProp2]}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        <Text style={styles.btmtext}>Description</Text>
        <View style={[styles.inputbox, styles.shadowProp, {height: 100}]}>
          <TextInput
            // placeholder="Enter your email"
            style={[styles.input, styles.shadowProp2]}
            placeholderTextColor={Constants.customgrey2}></TextInput>
        </View>
        
        <TouchableOpacity
          style={[styles.button, styles.shadowProp]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttontxt}>Next</Text>
        </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
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
            <CrossIcon
              height={20}
              width={20}
              color={Constants.black}
              style={{alignSelf: 'flex-end'}}
              onPress={() => setModalVisible(!modalVisible)}
            />
            <View style={{backgroundColor: 'white', alignItems: 'center',paddingHorizontal:20}}>
              <Text style={styles.textStyle}>
              Your enquiry is submitted we will get back to you soon !
              </Text>
              
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Inquiry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  imgbg: {
    flex: 1,
  },
  inputbox: {
    backgroundColor: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    height: 60,
  },
  input: {
    // height:60,
    flex: 1,
    backgroundColor: Constants.light_black,
    color: Constants.white,
    borderRadius: 10,
    paddingLeft: 10,
    fontFamily: FONTS.Regular,
    fontSize: 16,
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
    backgroundColor: Constants.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  txt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  maintxt: {
    fontSize: 18,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    marginTop: 25,
    // marginBottom: 15,
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:70,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    // position: 'absolute',
    // bottom: 50,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  btmtext: {
    color: Constants.white,
    fontSize: 20,
    // paddingVertical:10,
    marginTop: 10,
    fontFamily: FONTS.Medium,
    paddingHorizontal: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FONTS.Medium,
    marginBottom:10
  },
});
