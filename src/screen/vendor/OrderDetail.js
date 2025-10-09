import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import {CheckboxactiveIcon, CheckboxIcon} from '../../../Theme';
import Header from '../../Assets/Component/Header';
import moment from 'moment';
import { Post } from '../../Assets/Helpers/Service';
import { LoadContext, ToastContext } from '../../../App';
import { goBack } from '../../../navigationRef';

const OrderDetail = (props) => {
  const data=props.route.params
  const [selectprod,setselectprod]=useState(false)
    const [toast, setToast] = useContext(ToastContext);
      const [loading, setLoading] = useContext(LoadContext);

  const Packedordervendor = (id) => {
    const body={
      id:id,
      status:'Packed'
    }
    setLoading(true);
    Post(`changeorderstatus`, body).then(
      async res => {
        setLoading(false);
        console.log(res);
        goBack()
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <View style={styles.container}>
      <Header item={'Order Detail'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.box}>
          <View style={{flexDirection: 'row'}}>
            <Image
              // source={require('../../Assets/Images/profile.png')}
              source={
                data?.user?.img
                  ? {
                      uri: `${data?.user?.img}`,
                    }
                  : require('../../Assets/Images/profile.png')
              }
              style={styles.hi}
              // onPress={()=>navigate('Account')}
            />
            <View>
              <Text style={styles.name}>{data?.user?.username}</Text>
              <Text style={styles.redeembtn}>{moment(data?.createdAt).format('DD-MM-YYYY ')}</Text>
            </View>
          </View>
          <View style={styles.secendpart}>
            <Text style={styles.secendboldtxt}>Location : </Text>
            <Text style={styles.secendtxt2}>
            {data?.user?.address}
            </Text>
          </View>
          <View style={styles.txtcol}>
            <View style={{}}>
              <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>Category : </Text>
                <Text style={styles.secendtxt}>{data?.product?.categoryname}</Text>
              </View>
              {/* <View style={styles.secendpart}>
                <Text style={styles.secendboldtxt}>QTY : </Text>
                <Text style={styles.secendtxt}>12</Text>
              </View> */}
            </View>
            <Text style={styles.amount}>₹{data?.price}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputbox2, styles.shadowProp]}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../Assets/Images/cement.png')}
                  //   source={{uri: `${item.image}`}}
                  style={styles.hi2}
                  // onPress={()=>navigate('Account')}
                />
                <View>
                  <Text style={[styles.name, {color: Constants.white}]}>
                    {data?.product?.name}
                  </Text>
                </View>
              </View>
             {selectprod? <CheckboxactiveIcon
                height={25}
                width={25}
                color={Constants.custom_yellow}
                onPress={()=>setselectprod(false)}
              />:
              <CheckboxIcon
                height={25}
                width={25}
                color={Constants.custom_yellow}
                onPress={()=>setselectprod(true)}
              />}
            </View>
            <View style={styles.txtcol}>
              <View style={{}}>
                {/* <View style={[styles.secendpart, {marginVertical: 20}]}>
                  <Text
                    style={[styles.secendboldtxt, {color: Constants.white}]}>
                    QTY :
                  </Text>
                  <Text style={[styles.secendtxt, {color: Constants.white}]}>
                    2
                  </Text>
                </View> */}
              </View>
              <Text style={styles.amount}>₹{data?.product?.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
        <Text style={[styles.donebtn,{backgroundColor:selectprod?Constants.custom_yellow:'#473c26'}]} onPress={()=>Packedordervendor(data._id)}>Done</Text>
    </View>
  );
};

export default OrderDetail;

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
    backgroundColor: '#E9FFF5',
    marginVertical: 10,
    padding: 20,
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
    // borderRadius: 50,
  },
  name: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
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
    fontFamily: FONTS.Regular,
    alignSelf: 'center',
  },
  secendtxt: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
    fontFamily: FONTS.Bold,
  },
  secendtxt2: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
    flex: 1,
    fontFamily: FONTS.SemiBold,
  },

  inputbox2: {
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 20,
    // width: '90%',
    // alignSelf: 'center',
    padding: 5,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  inrshabox: {
    // margin:10,
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    // flexDirection: 'row',
    padding: 20,
  },
  donebtn:{
    backgroundColor:Constants.custom_yellow,
    color:Constants.white,
    fontSize:16,
    fontFamily:FONTS.SemiBold,
    width:'35%',
    textAlign:'center',
    paddingVertical:10,
    borderRadius:15,
    alignSelf:'center',
    position:'absolute',
    bottom:30
  }
});
