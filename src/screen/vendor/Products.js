import {
  Dimensions,
  FlatList,
  Image,
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
import React, {createRef, useContext, useEffect, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import {LoadContext, ToastContext} from '../../../App';
import {Delete, GetApi, Post, Postwithimage} from '../../Assets/Helpers/Service';
import CoustomDropdown from '../../Assets/Component/CoustomDropdown';
import {useIsFocused} from '@react-navigation/native';
import { DeleteIcon, EditIcon } from '../../../Theme';

const Products = () => {
  const cameraRef = createRef();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [submitted, setSubmitted] = useState(false);
  const [showform, setshowform] = useState(false);
  const [images, setImages] = useState([]);
  const [productlist, setproductlist] = useState([]);
  const [catagorylist, setcatagorylist] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [stockstatus, setstockstatus] = useState('');
  const [modelvsible, setmodelvsible] = useState(false);
  const [selectedcat, setselectedcat] = useState();
  const [name, setname] = useState('');
  const [price, setprice] = useState('');
  const [selectId, setSelectId] = useState('');
  const [producttype, setproducttype] = useState('');
  const [userDetail, setUserDetail] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    wide: '',
    height: '',
    weight: '',
    length: '',
    stock_status: '',
    quantity: '',
    product_type: '',
    image: [],
  });

  const getDropValue = res => {
    setShowDrop(false);
    console.log('===>', res);
    setselectedcat(res);
  };

  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      getProducts();
    }
  }, [IsFocused]);

  // useEffect(() => {
  //   getOrders();
  // }, []);
  const getProducts = () => {
    setLoading(true);
    GetApi(`getProductByVendor`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        setproductlist(res?.data);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  useEffect(() => {
    getcategory();
  }, []);
  const getcategory = () => {
    setLoading(true);
    GetApi('getCategory', {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setcatagorylist(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const deleteProduct = () => {
    setLoading(true);
    Delete(`deleteProduct/${selectId}`).then(
      async res => {
        setLoading(false);
        setSelectId('')
        getProducts()
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getImageValue = async img => {
    const imagedata = {
      name: img.assets[0].fileName,
      type: img.assets[0].type,
      uri: img.assets[0].uri,
    };
    //   userDetail.image.push(imagedata)
    setImages(prevImages => [...prevImages, imagedata]);
    // setUserDetail({
    //   ...userDetail,
    //   image: {
    //     name: img.assets[0].fileName,
    //     type: img.assets[0].type,
    //     uri: img.assets[0].uri,
    //   },
    // });
    console.log(images);
  };
  const cancel = () => {
    // setEdit(false);
  };
  // const submit = async () => {
  //   console.log(userDetail);

  //   userDetail.product_type = producttype;
  //   userDetail.stock_status = stockstatus;
  //   userDetail.image = images;
  //   console.log(images);
  //   let formdata = new FormData();
  //   formdata.append('name', userDetail.name);
  //   formdata.append('description', userDetail.description);
  //   formdata.append('price', userDetail.price);
  //   formdata.append('sale_price', userDetail.sale_price);
  //   formdata.append('wide', userDetail.wide);
  //   formdata.append('height', userDetail.height);
  //   formdata.append('weight', userDetail.weight);
  //   formdata.append('length', userDetail.length);
  //   formdata.append('stock_status', userDetail.stock_status);
  //   formdata.append('quantity', userDetail.quantity);
  //   formdata.append('product_type', userDetail.product_type);
  //   userDetail.image.map((item, i) =>
  //     formdata.append('images[]', userDetail.image[i]),
  //   );
  //   console.log(formdata);
  //   setLoading(true);
  //   Postwithimage('products/create', formdata, {}).then(
  //     async res => {
  //       setLoading(false);
  //       console.log(res);

  //       if (res.success) {
  //         setToast({error: false, message: res.data.message});
  //         // getProfile();
  //         setUserDetail({
  //           name: '',
  //           description: '',
  //           price: '',
  //           sale_price: '',
  //           wide: '',
  //           height: '',
  //           weight: '',
  //           length: '',
  //           stock_status: '',
  //           quantity: '',
  //           product_type: '',
  //           image: [],
  //         });
  //         getProducts();
  //       } else {
  //         if (res?.message?.name) {
  //           setToast({error: true, message: res.message.name[0]});
  //         } else if (res?.message?.product_type) {
  //           setToast({error: true, message: res.message.product_type[0]});
  //         } else if (res?.message?.stock_status) {
  //           setToast({error: true, message: res.message.stock_status[0]});
  //         }
  //       }
  //     },
  //     err => {
  //       setLoading(false);
  //       console.log(err);
  //       setToast(res?.message);
  //     },
  //   );
  // };
  const submit = () => {
    if (name === '' || !selectedcat.name || price === '') {
      setSubmitted(true);
      return;
    }
    const d = {
      category: selectedcat._id,
      categoryname: selectedcat.name,
      attributes: selectedcat.attributes,
      price: Number(price),
      name,
    };
    let url=`createProduct`
    if (selectId) {
      url=`updateProduct`
      d.id=selectId
    }

    setLoading(true);
    Post(url, d, {}).then(async res => {
      setLoading(false);
      console.log(res);
      setSubmitted(false);
      if (res.status) {
        setselectedcat({});
        setname('');
        setprice('');
        setSelectId('')
        setshowform(false);
        getProducts();
      } else {
        setLoading(false);
        setToast(res.message);
      }
    });
  };


  return (
    <View style={styles.container}>
      <Header item={'Products'} />
        {!showform && (
          <Text style={styles.productbtn} onPress={() => setshowform(true)}>
            Add Product
          </Text>
        )}
            {/* <View style={{paddingHorizontal: 20, marginBottom: 20,flex:1}}> */}
        {showform && (
          <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{flex:1,paddingHorizontal: 20, marginBottom: 20,}}
                      >
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => setShowDrop(true)}>
              <Text style={styles.add}>
                {selectedcat?.name ? selectedcat?.name : 'Select Category'}
              </Text>
              <View style={[styles.mylivejobtitle]}>
                <Text style={styles.jobtitle}>Category</Text>
              </View>
            </TouchableOpacity>
            {submitted && !selectedcat?.name && (
              <Text style={styles.require}>Category is required</Text>
            )}

            <View style={styles.textInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                placeholderTextColor={Constants.customgrey}
                value={name}
                onChangeText={setname}
              />
              <View style={[styles.mylivejobtitle]}>
                <Text style={styles.jobtitle}>Product Name</Text>
              </View>
            </View>
            {submitted && name === '' && (
              <Text style={styles.require}>Name is required</Text>
            )}
            <View style={styles.textInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                keyboardType="number-pad"
                placeholderTextColor={Constants.customgrey}
                value={price}
                onChangeText={setprice}
              />
              <View style={[styles.mylivejobtitle]}>
                <Text style={styles.jobtitle}>Price</Text>
              </View>
            </View>
            {submitted && price === '' && (
              <Text style={styles.require}>Price is required</Text>
            )}
            {selectedcat?.attributes &&
              selectedcat?.attributes.length > 0 &&
              selectedcat?.attributes.map((item,index) => (
                <View style={styles.textInput} key={index}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter attribute values"
                    placeholderTextColor={Constants.customgrey}
                    value={item.value}
                    onChangeText={e => {
                      (item.value = e), setselectedcat({...selectedcat});
                    }}
                  />
                  <View style={[styles.mylivejobtitle]}>
                    <Text style={styles.jobtitle}>{item.name}</Text>
                  </View>
                </View>
              ))}
            <View style={styles.btncov}>
              <TouchableOpacity
                style={styles.signInbtn}
                onPress={() => setshowform(false)}>
                <Text style={styles.buttontxt}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signInbtn}
                onPress={() => submit()}>
                <Text style={styles.buttontxt}>Submit</Text>
              </TouchableOpacity>
            </View>
</ScrollView>
</KeyboardAvoidingView>
        )}
        
      {/* </View> */}
      {!showform&&<View style={{marginBottom: 70,flex:1,marginHorizontal:15}}>
        <FlatList
          data={productlist}
          style={{paddingBottom: 80}}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View>
            
          </View>}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.box2}>
              <View style={{flexDirection: 'row'}}>
                {/* <Image
                  // source={require('../../Assets/Images/salt.png')}
                  source={{
                    uri: `${item.image}`,
                  }}
                  style={styles.hi2}
                /> */}
                <View>
                  <Text style={styles.name}>{item?.categoryname}</Text>
                </View>
              </View>
              <View style={styles.txtcol}>
                  <View style={[styles.secendpart, {marginVertical: 10}]}>
                    <Text style={styles.secendboldtxt}>Attributes : </Text>
                    <Text style={styles.secendtxt}>
                      {item?.attributes?.length}
                    </Text>
                </View>
                <Text style={styles.amount}>₹{item.price}</Text>
              </View>
              <View style={styles.txtcol2}>
                <EditIcon color={Constants.black} onPress={()=>{
                setshowform(true)
                 setselectedcat({
                  _id:item?._id,
                  name:item?.name,
                  attributes:item?.attributes
                 })
                 setname(item?.name)
                 setprice(JSON.stringify(item?.price))
                 setSelectId(item?._id)
                }}/>
                <DeleteIcon color='#E23F44' onPress={()=>{setmodelvsible(true),setSelectId(item?._id)}}/>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() =>
            !showform && (
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
                  No Products
                </Text>
              </View>
            )
          }
        />
      </View>}
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={cancel}
      />
         <CoustomDropdown
          visible={showDrop}
          setVisible={setShowDrop}
          getDropValue={getDropValue}
          data={catagorylist}
        />
      {/* <CoustomDropdown
        visible={showDrop2}
        setVisible={setShowDrop2}
        getDropValue={getDropValue2}
        data={producttypelist}
      /> */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modelvsible}
        onRequestClose={() => {
          setmodelvsible(!modelvsible);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to delete this product !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setmodelvsible(false);
                  }}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    deleteProduct(selectId), setmodelvsible(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  textInput: {
    borderColor: Constants.customgrey2,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 7,
    // width: 370,
    height: 60,
    marginTop: 20,
    flexDirection: 'row',
  },
  input: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FONTS.Medium,
    color: Constants.white,
    flex: 1,
  },
  add: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FONTS.Medium,
    color: Constants.white,
    alignSelf: 'center',
    flex: 1,
    // backgroundColor:Constants.red
  },
  mylivejobtitle: {
    position: 'absolute',
    backgroundColor: Constants.custom_black,
    paddingHorizontal: 5,
    top: -10,
    left: 30,
  },
  jobtitle: {
    color: Constants.white,
    fontSize: 13,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
  },
  imgstyle: {
    height: '80%',
    width: '80%',
    // flex:1,
    resizeMode: 'contain',
  },
  imgstyle2: {
    height: '100%',
    width: '100%',
    // flex:1,
    resizeMode: 'contain',
  },
  uploadbox: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor:Constants.red
  },
  uploadimgbox: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor:Constants.red
  },
  uploadtxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  signInbtn: {
    height: 60,
    // width: 370,
    borderRadius: 10,
    backgroundColor: Constants.custom_yellow,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    flex: 1,
    marginHorizontal: 10,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  box2: {
    backgroundColor: '#E9FFF5',
    marginVertical: 10,
    padding: 20,
    borderRadius:10
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
    marginVertical: 5,
  },
  secendboldtxt: {
    color: Constants.black,
    fontSize: 15,
    fontFamily: FONTS.dmsans,
    alignSelf: 'center',
  },
  secendtxt: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
    fontFamily: FONTS.Bold,
  },
  txtcol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtcol2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap:10
  },
  amount: {
    color: Constants.custom_yellow,
    fontSize: 24,
    fontFamily: FONTS.Bold,
  },
  productbtn: {
    backgroundColor: Constants.custom_yellow,
    color: Constants.white,
    fontFamily: FONTS.Bold,
    fontSize: 20,
    borderRadius: 10,
    width: 150,
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: 20,
    marginRight:20,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  btncov: {
    flexDirection: 'row',
  },
  heading: {
    color: Constants.black,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    marginTop: 20,
  },

  //////Model////////
  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Regular,
    fontSize: 16,
    margin: 20,
    marginBottom: 10,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  alrt: {
    color: Constants.custom_yellow,
    fontSize: 18,
    fontFamily: FONTS.Medium,
    // backgroundColor: 'red',
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: Constants.customgrey2,
    paddingBottom: 20,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  centeredView2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
  },
  cancelButtonStyle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderColor: Constants.custom_yellow,
    borderWidth: 1,
    borderRadius: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.custom_yellow,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
