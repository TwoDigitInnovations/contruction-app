import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
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
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import {
  Delete,
  GetApi,
  Post,
  PostWithImage,
  Postwithimage,
} from '../../Assets/Helpers/Service';
import CoustomDropdown from '../../Assets/Component/CoustomDropdown';
import { useIsFocused } from '@react-navigation/native';
import { DeleteIcon, EditIcon, PlusIcon, UploadIcon } from '../../../Theme';
import { Dropdown } from 'react-native-element-dropdown';

const Products = () => {
  const cameraRef = useRef(null);
  const dropdownRef = useRef();
  const dropdownRef2 = useRef();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setuser] = useContext(UserContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showform, setshowform] = useState(false);
  const [images, setImages] = useState([]);
  const [productlist, setproductlist] = useState([]);
  const [catagorylist, setcatagorylist] = useState([]);
  const [stockstatus, setstockstatus] = useState('');
  const [modelvsible, setmodelvsible] = useState(false);
  const [selectedcat, setselectedcat] = useState(null);
  const [name, setname] = useState('');
  const [price, setprice] = useState('');
  const [selectId, setSelectId] = useState(null);

  const unitData = [
    { name: 'Kg', value: 'kg' },
    { name: 'Tons', value: 'tons' },
    { name: 'Piece', value: 'piece' },
  ];


  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused && user?.verified === 'VERIFIED') {
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
        setproductlist(res?.data?.product);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  useEffect(() => {
    if (user?.verified === 'VERIFIED') {
      getcategory();
    }
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
        setSelectId(null);
        getProducts();
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const cancel = () => {
    // setEdit(false);
  };
  const submit = () => {
    if (name === '' || !selectedcat.name) {
      setSubmitted(true);
      return;
    }
    if (selectedcat?.attributes?.length > 0) {
      for (let i = 0; i < selectedcat.attributes.length; i++) {
        const item = selectedcat.attributes[i];
        const hasValue = item?.value && item.value.trim() !== '';

        // If stock value is filled but price or image missing
        if (
          hasValue &&
          (!item.price || item.price.trim() === '' || !item.image || !item.unit)
        ) {
          setToast('Please complete all fields for the filled attribute.');
          return;
        }
      }
    }
    const formData = new FormData();
    formData.append('category', selectedcat._id);
    formData.append('categoryname', selectedcat.name);
    formData.append('price', price);
    formData.append('name', name);

    selectedcat?.attributes?.forEach((item, index) => {
      formData.append(`attributes[${index}][name]`, item.name ?? '');
      formData.append(`attributes[${index}][value]`, item.value ?? '');
      formData.append(`attributes[${index}][unit]`, item.unit ?? '');
      formData.append(`attributes[${index}][price]`, item.price ?? '');

      if (item?.image?.uri) {
        // new image file selected
        formData.append(`attributes[${index}][image]`, {
          uri: item.image.uri,
          type: item.image.type,
          name: item.image.name || `attr_${index}.jpg`,
        });
      } else if (
        typeof item?.image === 'string' &&
        item.image.startsWith('http')
      ) {
        // existing image URL, preserve it
        formData.append(`attributes[${index}][image]`, item.image);
      }
    });

    let url = `createProduct`;
    if (selectId) {
      url = `updateProduct`;
      formData.append('id', selectId);
    }

    setLoading(true);
    PostWithImage(url, formData, {}).then(async res => {
      setLoading(false);
      console.log(res);
      setSubmitted(false);
      if (res.status) {
        setselectedcat({});
        setname('');
        setprice('');
        setSelectId(null);
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
      {user?.verified === 'VERIFIED' ? (
        <View style={{ flex: 1 }}>
          {/* {!showform && (
            <Text
              style={styles.productbtn}
              onPress={() => {
                setselectedcat(null),
                  setname(''),
                  setprice(true),
                  setSelectId(null),
                  setshowform(true);
              }}
            >
              Add Product
            </Text>
          )} */}
          {!showform &&<TouchableOpacity style={styles.plsbuncov} onPress={() => {
                setselectedcat(null),
                  setname(''),
                  setprice(''),
                  setSelectId(null),
                  setshowform(true);
              }}>
            <PlusIcon height={30} width={30} color={Constants.black}/>
          </TouchableOpacity>}
          {showform && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1, paddingHorizontal: 20, marginBottom: 20 }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  onPress={() =>  dropdownRef.current?.open()}
                >
                  {/* <Text style={styles.add}>
                    {selectedcat?.name ? selectedcat?.name : 'Select Category'}
                  </Text> */}
                  <Dropdown
                    ref={dropdownRef}
                    data={catagorylist}
                    labelField="name"
                    valueField="_id"
                    placeholder="Select categoty"
                    value={selectedcat}
                    onChange={item => {}}
                    renderItem={item => (
                      <TouchableOpacity
                        style={styles.itemContainer}
                        onPress={() => {
                          console.log('item', item);
                          setselectedcat(item);
                          dropdownRef.current?.close();
                        }}
                      >
                        <Text style={styles.itemText}>{item.name} </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.selectedText}
                  />
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
                {selectedcat?.attributes.length === 0 && (
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
                )}
                {submitted && price === '' && (
                  <Text style={styles.require}>Price is required</Text>
                )}
                {selectedcat?.attributes &&
                  selectedcat?.attributes.length > 0 &&
                  selectedcat?.attributes.map((item, index) => (
                    <View style={styles.atribox} key={index}>
                      <View
                        style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}
                      >
                        <View
                          style={[
                            styles.textInput,
                            { width: '60%', marginTop: 0 },
                          ]}
                        >
                          <TextInput
                            style={styles.input}
                            placeholder="Enter stock amount"
                            placeholderTextColor={Constants.customgrey}
                            keyboardType='number-pad'
                            value={item.value}
                            onChangeText={text => {
                              const updatedAttributes =
                                selectedcat.attributes.map((attr, i) => {
                                  if (i === index) {
                                    return { ...attr, value: text };
                                  }
                                  return attr;
                                });

                              setselectedcat({
                                ...selectedcat,
                                attributes: updatedAttributes,
                              });
                            }}
                          />
                          <View style={[styles.mylivejobtitle]}>
                            <Text style={styles.jobtitle}>Available Stock</Text>
                          </View>
                        </View>
                        <Dropdown
                          ref={dropdownRef2}
                          data={unitData}
                          labelField="name"
                          valueField="value"
                          placeholder="Select Unit"
                          value={item.unit}
                          onChange={item => {}}
                          renderItem={item => (
                            <TouchableOpacity
                              style={styles.itemContainer}
                              onPress={() => {
                                const updatedAttributes =
                                  selectedcat.attributes.map((attr, i) => {
                                    if (i === index) {
                                      return { ...attr, unit: item?.value };
                                    }
                                    return attr;
                                  });

                                setselectedcat({
                                  ...selectedcat,
                                  attributes: updatedAttributes,
                                });
                                dropdownRef2.current?.close();
                              }}
                            >
                              <Text style={styles.itemText}>{item.name} </Text>
                            </TouchableOpacity>
                          )}
                          style={styles.dropdown2}
                          containerStyle={styles.dropdownContainer}
                          placeholderStyle={styles.placeholder}
                          selectedTextStyle={styles.selectedText}
                          itemTextStyle={styles.itemText}
                          itemContainerStyle={styles.itemContainerStyle}
                          selectedItemStyle={styles.selectedStyle}
                        />
                      </View>
                      <View style={styles.textInput}>
                        <TextInput
                          style={styles.input}
                          placeholder={`Enter price${
                            item?.unit ? ` / ${item.unit}` : ''
                          }`}
                          keyboardType="number-pad"
                          placeholderTextColor={Constants.customgrey}
                          value={item.price}
                          onChangeText={text => {
                            const updatedAttributes =
                              selectedcat.attributes.map((attr, i) => {
                                if (i === index) {
                                  return { ...attr, price: text };
                                }
                                return attr;
                              });

                            setselectedcat({
                              ...selectedcat,
                              attributes: updatedAttributes,
                            });
                          }}
                        />
                        <View style={[styles.mylivejobtitle]}>
                          <Text style={styles.jobtitle}>
                            Price{item?.unit && ' / '}
                            {item?.unit}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 100,
                          marginVertical: 15,
                          justifyContent: 'center',
                        }}
                      >
                        <TouchableOpacity
                          style={styles.uploadbox}
                          onPress={() => {
                            setActiveIndex(index);
                            Keyboard.dismiss();
                            setTimeout(() => {
                              if (cameraRef.current) {
                                cameraRef.current.show();
                              }
                            }, 150);
                          }}
                        >
                          <UploadIcon
                            color={Constants.custom_yellow}
                            height={'90%'}
                            width={'100%'}
                          />
                          <Text style={styles.uploadtxt}>Product Image</Text>
                        </TouchableOpacity>
                        <CameraGalleryPeacker
                          refs={cameraRef}
                          getImageValue={img => {
                            if (activeIndex === null) return;
                            const imagedata = {
                              name: img.assets[0].fileName,
                              type: img.assets[0].type,
                              uri: img.assets[0].uri,
                            };
                            const updatedAttributes =
                              selectedcat.attributes.map((attr, i) =>
                                i === activeIndex
                                  ? { ...attr, image: imagedata }
                                  : attr,
                              );

                            setselectedcat({
                              ...selectedcat,
                              attributes: updatedAttributes,
                            });
                          }}
                          base64={false}
                          cancel={cancel}
                        />
                        <View style={styles.uploadimgbox}>
                          {item?.image && (
                            <Image
                              source={{
                                uri: item?.image?.uri
                                  ? item?.image?.uri
                                  : item?.image,
                              }}
                              style={styles.imgstyle2}
                            />
                          )}
                        </View>
                      </View>
                      <View style={[styles.mylivejobtitle]}>
                        <Text style={styles.jobtitle}>{item.name}</Text>
                      </View>
                    </View>
                  ))}
                <View style={styles.btncov}>
                  <TouchableOpacity
                    style={styles.signInbtn}
                    onPress={() => setshowform(false)}
                  >
                    <Text style={styles.buttontxt}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.signInbtn}
                    onPress={() => submit()}
                  >
                    <Text style={styles.buttontxt}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          )}

          {/* </View> */}
          {!showform && (
            <View style={{ marginBottom: 70, flex: 1, marginHorizontal: 15 }}>
              <FlatList
                data={productlist}
                // style={{ paddingBottom: 200 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => <View></View>}
                renderItem={({ item,index }) => (
                  <View style={[styles.box2,{marginBottom:productlist?.length-1===index?75:0}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text>
                        <Text style={styles.secendboldtxt}>Category : </Text>
                        <Text style={styles.secendtxt}>
                          {item?.categoryname}
                        </Text>
                      </Text>
                      <View style={styles.txtcol2}>
                        <EditIcon
                          color={Constants.black}
                          onPress={() => {
                            setshowform(true);
                            setselectedcat({
                              _id: item?.category,
                              name: item?.categoryname,
                              attributes: item?.attributes,
                            });
                            setname(item?.name);
                            setprice(JSON.stringify(item?.price));
                            setSelectId(item?._id);
                          }}
                        />
                        <DeleteIcon
                          color="#E23F44"
                          onPress={() => {
                            setmodelvsible(true), setSelectId(item?._id);
                          }}
                        />
                      </View>
                    </View>
                    <Text>
                      <Text style={styles.secendboldtxt}>Name : </Text>
                      <Text style={styles.secendtxt}>{item?.name}</Text>
                    </Text>
                    {item?.attributes?.length > 0 ? (
                      (() => {
                        const filledAttributes = item.attributes.filter(
                          attr => attr?.value && attr.value.trim() !== '',
                        );

                        return (
                          <View style={{ marginTop: 5 }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                              }}
                            >
                              <Text style={styles.secendboldtxt}>
                                Attributes :
                              </Text>
                              <Text style={styles.secendtxt}>
                                {filledAttributes.length}/
                                {item.attributes.length}
                              </Text>
                            </View>

                            {filledAttributes.length > 0 ? (
                              filledAttributes.map((attr, index) => (
                                <View key={index} style={styles.attributeRow}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      gap: 15,
                                    }}
                                  >
                                    {attr?.image && (
                                      <Image
                                        source={
                                          typeof attr.image === 'string'
                                            ? { uri: attr.image }
                                            : { uri: attr.image.uri }
                                        }
                                        style={styles.attrImage}
                                      />
                                    )}
                                    <Text
                                      style={styles.secendtxt}>
                                      {attr.value}{' '}
                                      {attr?.unit ? ` ${attr.unit}` : ''}
                                    </Text>
                                  </View>
                                  <Text
                                    style={[styles.amount, { marginLeft: 10 }]}
                                  >
                                    {Currency} {attr?.price || '0'}
                                  </Text>
                                </View>
                              ))
                            ) : (
                              <Text
                                style={[styles.secendtxt, { marginTop: 6 }]}
                              >
                                No attributes filled yet.
                              </Text>
                            )}
                          </View>
                        );
                      })()
                    ) : (
                      <View style={styles.txtcol}>
                        <Text style={[styles.secendboldtxt,{fontFamily: FONTS.SemiBold}]}>Price : </Text>
                        <Text style={styles.amount}>{Currency} {item?.price}</Text>
                      </View>
                    )}
                  </View>
                )}
                ListEmptyComponent={() =>
                  !showform && (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: Dimensions.get('window').height - 250,
                      }}
                    >
                      <Text
                        style={{
                          color: Constants.white,
                          fontSize: 20,
                          fontFamily: FONTS.SemiBold,
                        }}
                      >
                        No Products
                      </Text>
                    </View>
                  )
                }
              />
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: Dimensions.get('window').height - 300,
          }}
        >
          <Image
            source={require('../../Assets/Images/waiting.png')}
            style={{ alignSelf: 'center', height: 200, width: 200 }}
          />
          <Text style={styles.empttxt}>You are not verified yet.</Text>
          <Text style={styles.empttxt2}>
            Please wait for the verification to complete. It may take 3–5
            business days.
          </Text>
        </View>
      )}

      <Modal
        animationType="none"
        transparent={true}
        visible={modelvsible}
        onRequestClose={() => {
          setmodelvsible(!modelvsible);
        }}
      >
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}
            >
              <Text style={styles.textStyle}>
                Are you sure you want to delete this product !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setmodelvsible(false);
                  }}
                  style={styles.cancelButtonStyle}
                >
                  <Text
                    style={[
                      styles.modalText,
                      { color: Constants.custom_yellow },
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    deleteProduct(selectId), setmodelvsible(false);
                  }}
                >
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
  atribox: {
    borderColor: Constants.customgrey2,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    // flexDirection: 'row',
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
    color: Constants.white,
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
    marginTop: 15,
    padding: 20,
    borderRadius: 10,
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
    fontFamily: FONTS.Regular,
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
    // justifyContent: 'flex-end',
    gap: 10,
  },
  amount: {
    color: Constants.custom_yellow,
    fontSize: 18,
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
    marginTop: 5,
    marginRight: 20,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  btncov: {
    flexDirection: 'row',
    marginBottom: 80,
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
  empttxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
  },
  empttxt2: {
    fontSize: 16,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  attributeRow: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    // marginTop: 4,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attrImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    // marginTop: 4,
  },

  dropdown: {
    borderRadius: 10,
    height: 60,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Constants.customgrey2,
  },
  dropdown2: {
    borderRadius: 10,
    // backgroundColor:'red',
    width: '35%',
    height: 60,
    padding: 10,
    borderWidth: 1,
    borderColor: Constants.customgrey2,
  },
  placeholder: {
    color: Constants.customgrey2,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    // paddingVertical: 12,
  },
  selectedText: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    // paddingVertical: 12,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    // width: '100%',
    backgroundColor: Constants.custom_yellow,
    borderBottomWidth: 1,
    borderColor: Constants.white,
  },
  itemText: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  dropdownContainer: {
    borderRadius: 12,
    backgroundColor: Constants.custom_yellow,
  },
  selectedStyle: {
    backgroundColor: Constants.custom_yellow,
  },
  itemContainerStyle: {
    borderBottomWidth: 1,
    borderColor: Constants.customgrey,
    backgroundColor: Constants.custom_yellow,
  },
  plsbuncov:{
    height:60,
    width:60,
    borderRadius:40,
    zIndex:99,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Constants.custom_yellow,
    position:'absolute',
    bottom:80,
    right:20
  }
});
