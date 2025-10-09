import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import {DownarrIcon} from '../../../Theme';
import {navigate} from '../../../navigationRef';
import CoustomDropdown from '../../Assets/Component/CoustomDropdown';

const Concrete = props => {
  const productdata = props.route.params;
  console.log(productdata);
  const [showDrop, setShowDrop] = useState(null);
  // const getDropValue = res => {
  //   setShowDrop(false);
  //   console.log('===>', res);
  //   setUserDetail({...userDetail, product_type: res});
  //   // setproducttype(res);
  // };
  return (
    <View style={styles.container}>
      <Header item={'Order Concrete'} />
      <ImageBackground
        source={require('../../Assets/Images/concretebg.png')}
        style={styles.imgbg}>
        <Text style={styles.maintxt}>Select Mixed Design/Strength</Text>
        {productdata.attributes.map((item,index) => (
          item.value&&<TouchableOpacity
            style={[styles.inputbox, styles.shadowProp]}
            onPress={() => setShowDrop(index)}>
            <View style={[styles.inrshabox, styles.shadowProp2]}>
              <Text style={styles.txt}>{item.name}</Text>
              <DownarrIcon />
            </View>
            {<CoustomDropdown
              visible={showDrop}
              setVisible={setShowDrop}
              getDropValue={res => {
                setShowDrop(false);
                console.log('===>', res);
                // setUserDetail({...userDetail, product_type: res});
                // setproducttype(res);
              }}
              data={item?.value.split(",")}
            />}
          </TouchableOpacity>
        ))}
        {/* <TouchableOpacity style={[styles.inputbox, styles.shadowProp]} onPress={()=>navigate('Stores')}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt}>c15 / 20 OPC ( UP )</Text>
            <DownarrIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]} onPress={()=>navigate('Stores')}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt}></Text>
            <DownarrIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputbox, styles.shadowProp]} onPress={()=>navigate('Stores')}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <Text style={styles.txt}></Text>
            <DownarrIcon />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.button, styles.shadowProp]}
          onPress={() => navigate('Category')}>
          <Text style={styles.buttontxt}>Next</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default Concrete;

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
    boxShadow: 'inset 0px 0px 8px 5px #cdcdcd',
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
});
