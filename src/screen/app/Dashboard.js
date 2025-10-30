import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import Header from '../../Assets/Component/Header'
import { ApprovedIcon, DownarrIcon, PendingIcon, TotalorderIcon } from '../../../Theme'
import { goBack, navigate } from '../../../navigationRef'
import { LoadContext } from '../../../App'
import { GetApi } from '../../Assets/Helpers/Service'

const Dashboard = () => {
  const [loading, setLoading] = useContext(LoadContext);
  const [orderdata, setorderdata] = useState();

  useEffect(() => {
    getordercounts();
  }, []);
  const getordercounts = () => {
    setLoading(true);
    GetApi('getordercount', {}).then(
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
        <Header item={'Dashboard'}/>
        <ImageBackground source={require('../../Assets/Images/concretebg.png')} style={styles.imgbg}>
        <View style={[styles.inputbox, styles.shadowProp]} >
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <TotalorderIcon height={30} width={30}/>
            <Text style={styles.txt}>Total Order  {orderdata?.totalOrderCount}</Text>
          </View>
        </View>
        <View style={[styles.inputbox, styles.shadowProp]} >
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <ApprovedIcon height={30} width={30}/>
            <Text style={styles.txt}>Order delivered  {orderdata?.totalDeliveredOrder}</Text>
          </View>
        </View>
        <View style={[styles.inputbox, styles.shadowProp]} >
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <PendingIcon height={30} width={30}/>
            <Text style={styles.txt}>Order Pending    {orderdata?.totalPendingOrder}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.button, styles.shadowProp]} onPress={()=>goBack()}>
          <Text style={styles.buttontxt}>Back</Text>
        </TouchableOpacity>
        </ImageBackground>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.custom_black,
      },
      imgbg:{
        flex:1,
        paddingTop:30
      },
      inputbox: {
        backgroundColor: Constants.custom_black,
        borderRadius: 15,
        marginVertical: 10,
        width: '90%',
        alignSelf: 'center',
        padding: 7,
        height:80
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
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal:20
      },
      txt:{
        fontSize:16,
        color:Constants.white,
        fontFamily:FONTS.Medium,
        flex:1,
        textAlign:'center'
      },
      button: {
        backgroundColor: Constants.custom_yellow,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        width:'90%',
        alignSelf:'center',
        position:'absolute',
        bottom:50
      },
      buttontxt: {
        color: Constants.white,
        fontSize: 18,
        fontFamily: FONTS.SemiBold,
      },
})