import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {DownarrIcon} from '../../../Theme';
import {navigate} from '../../../navigationRef';
import CoustomDropdown from '../../Assets/Component/CoustomDropdown';
import {LoadContext, ToastContext} from '../../../App';
import {GetApi} from '../../Assets/Helpers/Service';

const ProductDetail = props => {
  const productid = props?.route?.params.productid;
  console.log(productid);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [productdetail, setproductdetail] = useState([]);

  useEffect(() => {
    {
      productid && getproduct();
    }
  }, []);
  const getproduct = () => {
    setLoading(true);
    GetApi(`getProductById/${productid}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setproductdetail(res.data);
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
        {productdetail?.attributes&&productdetail?.attributes.length>0&&productdetail.attributes.map(
          (item, index) =>
            item.value && (
              <View style={{}} key={index}>
                <Text style={styles.attributename}>{item.name}</Text>
                <TouchableOpacity
                  style={[styles.inputbox, styles.shadowProp]}
                  >
                  <View style={[styles.inrshabox, styles.shadowProp2]}>
                    <Text style={styles.txt}>{item.value}</Text>
                    {/* <DownarrIcon /> */}
                  </View>
                </TouchableOpacity>
              </View>
            ),
        )}

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
    textAlign:'center'
  }
});
