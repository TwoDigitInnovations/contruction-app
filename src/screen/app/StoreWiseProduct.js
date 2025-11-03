import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Post } from '../../Assets/Helpers/Service';
import {
  LoadContext,
  LocationContext,
  ProductContext,
  ToastContext,
  UserContext,
} from '../../../App';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { navigate } from '../../../navigationRef';

const StoreWiseProduct = props => {
  const data = props.route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [user, setuser] = useContext(UserContext);
  const [selectedProductData, setselectedProductData] =
    useContext(ProductContext);
  const [storeList, setStoreList] = useState([]);
  const [inputvalue, setinputvalue] = useState('');
  const [selectedItem, setSelectedItem] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedAtribute, setselectedAtribute] = useState({});

  useEffect(() => {
    {
      data?.attributeName && data?.categoryId && getSellerProduct();
    }
  }, []);
  const getSellerProduct = () => {
    const body = {
      location:
        user?.shipping_address?.location?.coordinates?.length > 0
          ? user?.shipping_address?.location?.coordinates
          : [currentLocation?.longitude, currentLocation?.latitude],
      categoryId: data?.categoryId,
      attributeName: data?.attributeName,
    };
    setLoading(true);
    Post(`getVendorsByCategoryAndAttribute`, body).then(
      async res => {
        setLoading(false);
        console.log(res);
        setStoreList(res?.data);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const filteredStores = storeList.filter(
      proit =>
        proit?.products?.length > 0 &&
        proit?.products[0]?.attributes?.some(
          attr => attr?.name === data?.attributeName && attr?.value
        )
    );

  return (
    <View style={styles.container}>
      <Header item={'Shops Product Detail'} />
     {filteredStores?.length > 0 ?
         <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.maintxt}>Select Shop for the product</Text>
      {storeList?.map((proit, ind) => (
          <TouchableOpacity style={[styles.boxcov,{backgroundColor:selectedItem===proit?._id?Constants.custom_yellow:'transparent',marginBottom:storeList?.length-1===ind?100:0}]} key={ind} onPress={()=>{setSelectedItem(proit?._id),setSelectedProduct(proit?.products[0]?._id),setselectedAtribute(proit?.products[0]?.attributes?.find(
    attr => attr?.name === data?.attributeName && attr?.value
  )
        )}}>
            <Text>
              <Text style={styles.secendboldtxt}>Store Name : </Text>
              <Text style={styles.secendtxt}>
                { proit?.shop_name}
              </Text>
            </Text>
            <Text>
              <Text style={styles.secendboldtxt}>Store Address : </Text>
              <Text style={styles.secendtxt}>
                { proit?.address}
              </Text>
            </Text>
            <Text>
              <Text style={styles.secendboldtxt}>Product Name : </Text>
              <Text style={styles.secendtxt}>
                {proit?.products?.length > 0 && proit?.products[0].name}
              </Text>
            </Text>
            {proit?.products?.length > 0 &&
              proit?.products[0]?.attributes &&
              proit?.products[0]?.attributes?.length > 0 &&
              proit?.products[0].attributes.map(
                (item, index) =>
                  item?.value &&
                  item?.name === data?.attributeName && (
                    <View
                      style={styles.selectatribute}
                      key={index}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 15,
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: item?.image }}
                          style={{ height: 40, width: 40, borderRadius: 5 }}
                        />
                        <Text style={styles.txt}>{item?.name}</Text>
                      </View>
                      <Text style={[styles.txt2,{color:selectedItem===proit?._id?Constants.white:Constants.custom_yellow}]}>
                        {Currency} {item?.price}
                      </Text>
                    </View>
                  ),
              )}

          </TouchableOpacity>
        ))}
        </ScrollView>:
        <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Dimensions.get('window').height - 250,
              }}>
              <Text
                style={{
                  color: Constants.white,
                  fontSize: 20,
                  fontFamily: FONTS.SemiBold,
                }}>
                No Shops available
              </Text>
            </View>}
        
      {filteredStores?.length > 0&&<TouchableOpacity
          style={[
            styles.button,
            styles.shadowProp,
            {
              backgroundColor:
                !selectedItem
                  ? '#baa172'
                  : Constants.custom_yellow,
            },
          ]}
          disabled={!selectedItem}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttontxt}>Next</Text>
        </TouchableOpacity>}

        <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: Constants.custom_black, alignItems: 'center'}}>
              <Text style={styles.textStyle}>
                Please enter the quentity you want
              </Text>
              <View style={styles.inputcov}>
        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.inrshabox, styles.shadowProp2]}
            value={inputvalue}
            keyboardType='number-pad'
            onChangeText={setinputvalue}
          />
        </View>
        {selectedAtribute?.unit && (
          <Text style={styles.txt3}> {selectedAtribute?.unit}</Text>
        )}
      </View>

      {Number(inputvalue) > Number(selectedAtribute?.value) && (
        <Text style={styles.require}>
          Available stock is less than your entered value. You can purchase up
          to {selectedAtribute?.value} {selectedAtribute?.unit}.
        </Text>
      )}
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
                    setselectedProductData({
              productid: selectedProduct,
              selectedAtribute,
              inputvalue,
            });
            navigate('Category');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default StoreWiseProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  inputbox: {
    backgroundColor: '#cdcdcd',
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
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
    fontFamily: FONTS.SemiBold,
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
    marginTop: 20,
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
    bottom: 20,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  selectatribute: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputcov: {
    flexDirection: 'row',
    gap: 15,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginHorizontal: 15,
    fontSize: 14,
    marginTop: 10,
  },
  boxcov: {
    borderWidth: 1,
    borderColor: Constants.white,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    marginTop:10
  },
  secendtxt: {
    color: Constants.white,
    fontSize: 15,
    textAlign: 'left',
    fontFamily: FONTS.Bold,
    textTransform: 'capitalize',
  },
  secendboldtxt: {
    color: Constants.white,
    fontSize: 15,
    fontFamily: FONTS.Regular,
    alignSelf: 'center',
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
    backgroundColor: Constants.custom_black,
    borderRadius: 10,
    padding: 15,
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
    borderWidth:1,
    borderColor:Constants.white
  },

  textStyle: {
    color: Constants.white,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  modalText: {
    color: Constants.white,
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
    backgroundColor: Constants.custom_yellow,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
