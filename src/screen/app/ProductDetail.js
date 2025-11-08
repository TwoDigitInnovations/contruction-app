import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { navigate } from '../../../navigationRef';
import { LoadContext, ProductContext, ToastContext } from '../../../App';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import { CheckboxactiveIcon, CheckboxIcon } from '../../../Theme';

const ProductDetail = props => {
  const vendorid = props.route.params.vendorid;
  const categotyid = props.route.params.categotyid;
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [selectedProductData, setselectedProductData] =
    useContext(ProductContext);
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
        if (res.status && res.data?.length > 0) {
          setproductdetail(res.data[0]);
          const firstWithValue = res?.data[0]?.attributes?.find(
            it => it?.value,
          );
          if (firstWithValue) setselectedAtribute(firstWithValue);
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
        style={styles.imgbg}
      >
        <Text style={styles.maintxt}>Select Mixed Design/Strength</Text>
        <Text style={styles.attributename}>
          {productdetail?.attributes?.length > 0
            ? productdetail.name
            : productdetail?.categoryname}
        </Text>
        {productdetail?.attributes &&
          productdetail?.attributes?.length > 0 &&
          productdetail.attributes.map(
            (item, index) =>
              item.value && (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    style={[styles.selectatribute,{borderColor:selectedAtribute?.name === item?.name ?Constants.custom_yellow:Constants.customgrey2,borderWidth:selectedAtribute?.name === item?.name ?1.5:1,}]}
                    onPress={() => setselectedAtribute(item)}
                  >
                      {/* {selectedAtribute?.name === item?.name ? (
                        <CheckboxactiveIcon
                          height={25}
                          width={25}
                          color={Constants.custom_yellow}
                        />
                      ) : (
                        <CheckboxIcon
                          height={25}
                          width={25}
                          color={Constants.custom_yellow}
                        />
                      )} */}
                      <Image
                        source={{ uri: item?.image }}
                        style={{height:60, width: 60, borderRadius: 5 }}
                      />
                      <View style={{width:'80%'}}>
                        <Text style={styles.txt}>{item.name}</Text>
                      <Text style={styles.txt2}>
                        {Currency} {item.price}
                      </Text>
                      </View>
                  </TouchableOpacity>
                </View>
              ),
          )}
        {productdetail?.attributes?.length > 0 ? (
          <View style={styles.inputcov}>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                style={[styles.inrshabox, styles.shadowProp2]}
                value={inputvalue}
                keyboardType="number-pad"
                onChangeText={setinputvalue}
              />
            </View>
            {selectedAtribute?.unit && (
              <Text style={styles.txt3}> {selectedAtribute?.unit}</Text>
            )}
          </View>
        ) : (
          <View
            style={[
              styles.inputbox,
              styles.shadowProp,
              { marginTop: 40, width: '90%' },
            ]}
          >
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <Text style={styles.txt4} numberOfLines={1}>
                {productdetail?.name}
              </Text>
              <Text style={styles.txt5}>
                {Currency} {productdetail?.price}
              </Text>
            </View>
          </View>
        )}

        {Number(inputvalue) > Number(selectedAtribute?.value) && (
          <Text style={styles.require}>
            Available stock is less than your entered value. You can purchase up
            to {selectedAtribute?.value} {selectedAtribute?.unit}.
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            styles.shadowProp,
            {
              backgroundColor:
                (inputvalue === '' || !selectedAtribute?.value) &&
                productdetail?.attributes?.length > 0
                  ? '#baa172'
                  : Constants.custom_yellow,
            },
          ]}
          disabled={
            (inputvalue === '' || !selectedAtribute?.value) &&
            productdetail?.attributes?.length > 0
          }
          onPress={() => {
            setselectedProductData({
              productid: productdetail?._id,
              selectedAtribute,
              inputvalue,
            });
            navigate('Category');
          }}
        >
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
    width: '80%',
    alignSelf: 'center',
    padding: 7,
    height: 60,
    // marginTop: 30,
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
  inrshabox2: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.white,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  txt3: {
    fontSize: 18,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  txt2: {
    fontSize: 16,
    color: Constants.custom_yellow,
    fontFamily: FONTS.Medium,
  },
  txt4: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    width: '78%',
  },
  txt5: {
    fontSize: 16,
    color: Constants.custom_yellow,
    fontFamily: FONTS.SemiBold,
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
  attributename: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textTransform: 'capitalize',
  },
  selectatribute: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 15,
    borderColor:Constants.customgrey2,
    padding:7,
    borderRadius:10,
    gap:15,
    alignItems:'center'
  },
  inputcov: {
    flexDirection: 'row',
    gap: 15,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginHorizontal: 15,
    fontSize: 14,
    marginTop: 10,
  },
});
