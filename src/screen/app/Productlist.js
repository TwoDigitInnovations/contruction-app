import {
    Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {LoadContext, ToastContext} from '../../../App';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import {navigate} from '../../../navigationRef';
import {TruckIcon} from '../../../Theme';
import Header from '../../Assets/Component/Header';

const Productlist = props => {
  const vendorid = props.route.params.vendorid;
  const categotyid = props.route.params.categotyid;
  console.log('cat', vendorid, categotyid);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [productlist, setproductlist] = useState([]);

  useEffect(() => {
    {
      vendorid && categotyid && getproduct();
    }
  }, []);
  const getproduct = () => {
    const data = {
      category: categotyid,
      posted_by: vendorid,
    };
    setLoading(true);
    Post(`getProductByVendorandCategory`, data, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setproductlist(res.data);
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
      <Header item={'Product List'} />
      {/* <View style={{padding: 10}}> */}
        <FlatList
          data={productlist}
          // numColumns={2}
          style={{flex:1}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.inputbox,
                styles.shadowProp,
                // {marginBottom: orderlist.length === index + 1 ? 100 : 10},
              ]}
                onPress={() => navigate('ProductDetail',{productid:item._id})}
            >
              <View style={[styles.inrshabox2, styles.shadowProp2]}>
                <View style={{gap:20,flexDirection:'row',marginRight:10,flex:1}}>
                <TruckIcon />
                <Text style={[styles.txt,{flex:1}]}>{item.name}</Text>
                </View>
                <Text style={styles.txt}>{item.price}</Text>
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
                  color:Constants.white ,
                  fontSize: 20,
                  fontFamily:FONTS.SemiBold
                }}>
                No Products
              </Text>
            </View>
          )}
        />
      {/* </View> */}
    </View>
  );
};

export default Productlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // padding:20
  },
  inputbox: {
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    alignSelf: 'center',
    padding: 7,
    flex: 1,
    width:'90%',
    marginHorizontal: 10,
  },
  inrshabox2: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    // flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 15,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  txt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    // textAlign: 'center',
    alignSelf:'center',
  },
});
