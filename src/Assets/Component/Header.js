import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useContext, } from 'react';
import Constants, { FONTS } from '../Helpers/constant';
import { goBack, navigate } from '../../../navigationRef';
import {  UserContext } from '../../../App';
import { BackIcon } from '../../../Theme';

const Header = props => {
  const [user, setuser] = useContext(UserContext);
  return (
    <View style={[styles.toppart,{backgroundColor: props.transbgcolour ? 'transparent' : Constants.custom_black}]}>
      <View style={styles.mainpart}>
        <View style={{ flexDirection: 'row',alignItems:'center', gap: 20, height: '100%' }}>
          <BackIcon color={props.backcolor?props.backcolor:Constants.white} style={styles.aliself} onPress={()=>goBack()}/>
          <Text style={styles.backtxt}>{props?.item}</Text>
        </View>
        <TouchableOpacity onPress={()=>{
          if (user?.type==='VENDOR') {
            navigate('Vendortab',{screen:'VendorAccount'})
          } else if (user?.type==='DRIVER'){
            navigate('Drivertab',{screen:'DriverAccount'})
          } 
          else{
            navigate('App',{screen:'Profile'})
          }
        }}
          >
        <Image
          source={
            user?.img
              ? {
                  uri: user.img
                }
              : require('../../Assets/Images/profile3.png')
          }
          style={styles.hi}
        />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  backtxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SfMedium,
  },
  toppart: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Constants.custom_black
  },
  hi: {
    marginRight: 10,
    height: 35,
    width: 35,
    borderRadius: 35,
    // resizeMode:'cover'
  },
  aliself: {
    alignSelf: 'center',
    // fontWeight:'bold'
    // fontFamily:FONTS.Bold
  },
  mainpart:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingVertical:5,
    // backgroundColor:'transparent'
  }
});