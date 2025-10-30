import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {navigate} from '../../../navigationRef';
import {LoadContext, ToastContext} from '../../../App';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import { CheckboxactiveIcon, CheckboxIcon } from '../../../Theme';

const ProductDetail = props => {
  const vendorid = props.route.params.vendorid;
  const categotyid = props.route.params.categotyid;
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [productdetail, setproductdetail] = useState([]);
  const [inputvalue, setinputvalue] = useState('');
  const [selectedAtribute, setselectedAtribute] = useState({});

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
        if (res.status&&res.data?.length>0) {
          setproductdetail(res.data[0]);
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
      <Header item={'Product Detail'} />
      <ImageBackground
        source={require('../../Assets/Images/concretebg.png')}
        style={styles.imgbg}>
        <Text style={styles.maintxt}>Select Mixed Design/Strength</Text>
        <Text style={styles.attributename}>{productdetail.name}</Text>
        {productdetail?.attributes&&productdetail?.attributes.length>0&&productdetail.attributes.map(
          (item, index) =>
            item.value && (
              <View style={{}} key={index}>
                <TouchableOpacity
                  style={styles.selectatribute}
                  onPress={()=>setselectedAtribute(item)}
                  >
                    {selectedAtribute?.name===item?.name?<CheckboxactiveIcon height={25} width={25} color={Constants.custom_yellow}/>:<CheckboxIcon height={25} width={25} color={Constants.custom_yellow}/>}
                    <Text style={styles.txt}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            ),
          )}
          <View style={{flexDirection:'row',gap:15}}>
                  <View
                  style={[styles.inputbox, styles.shadowProp]}
                  >
                    <TextInput 
                    style={[styles.inrshabox, styles.shadowProp2]}
                    value={inputvalue}
                    onChangeText={setinputvalue}
                    />
                </View>
                    <Text>/{selectedAtribute?.unit}</Text>
                    </View>

        <TouchableOpacity
          style={[styles.button, styles.shadowProp]}
          onPress={() => navigate('Category',{shopdata:productdetail?.posted_by,price:productdetail?.price,productid:productdetail?._id,productname:productdetail?.name,posted_by:productdetail?.posted_by})}>
          <Text style={styles.buttontxt}>Next</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  imgbg: {
    flex: 1,
  },
  inputbox: {
    backgroundColor: '#cdcdcd',
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    height: 60,
    marginTop:30
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0 0 8 5 #cdcdcd',
  },
  inrshabox: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.white,
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  txt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  maintxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Constants.custom_yellow,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  attributename:{
    color:Constants.white,
    fontSize:16,
    fontFamily:FONTS.Bold,
    textAlign:'center',
    textDecorationLine:'underline'
  },
  selectatribute:{
    flexDirection:'row',
    marginLeft:15,
    gap:15,
    alignItems:'center',
    marginTop:15
  },
});
