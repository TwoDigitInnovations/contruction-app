import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Header from '../../Assets/Component/Header';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import {goBack, navigate} from '../../../navigationRef';
import {BackIcon, DashboardIcon, Down, DownarrIcon, RightarrowIcon, TruckIcon} from '../../../Theme';
import {AddressContext, LoadContext, LocationContext, ToastContext, UserContext} from '../../../App';
import {GetApi} from '../../Assets/Helpers/Service';

const Project = () => {
  const dumydata = [1];
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [orderlist, setorderlist] = useState([]);
  const [currentLocation, setcurrentLocation] = useContext(LocationContext);
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [user, setuser] = useContext(UserContext);

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
          setorderlist(res.data);
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
      <ImageBackground
        source={require('../../Assets/Images/homebg.png')}
        style={styles.bgimg}>

        <View style={styles.toppart}>
              <View style={styles.mainpart}>
                <View style={{ flexDirection: 'row',alignItems:'center', gap: 15, height: '100%' }}>
                  <BackIcon color={Constants.black} style={styles.aliself} onPress={()=>goBack()}/>
                    <TouchableOpacity style={styles.addtxt} onPress={()=>navigate('Shipping')}>
                  <Text style={styles.backtxt} numberOfLines={1}>{user?.address?user?.address:locationadd}</Text>
                  <Down height={20} width={20} color={Constants.white}/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>navigate('App',{screen:'Profile'})}
                  >
                <Image
                  source={
                    user?.img
                      ? {
                          uri: user.img
                        }
                      : require('../../Assets/Images/profile3.png')
                  }
                  style={styles.hi}
                />
                </TouchableOpacity>
              </View>
            </View>

      </ImageBackground>
      <FlatList
        data={orderlist}
        numColumns={2}
        style={{paddingHorizontal: 10}}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <TouchableOpacity
            style={[styles.inputbox2, styles.shadowProp]}
            onPress={() => navigate('Dashboard')}>
            <View style={[styles.inrshabox, styles.shadowProp2]}>
              <DashboardIcon />
              <Text style={styles.txt}>Dashboard</Text>
              <RightarrowIcon color={Constants.custom_yellow} />
            </View>
          </TouchableOpacity>
        )}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              styles.inputbox,
              styles.shadowProp,
              {marginBottom: orderlist.length === index + 1 ? 100 : 10},
            ]}
            onPress={() => navigate('Stores',{item:item._id})}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* <ScrollView style={{marginTop: 20}}>
        <TouchableOpacity style={[styles.inputbox2, styles.shadowProp]} onPress={()=>navigate('Dashboard')}>
          <View style={[styles.inrshabox, styles.shadowProp2]}>
            <DashboardIcon />
            <Text style={styles.txt}>Dashboard</Text>
            <RightarrowIcon color={Constants.custom_yellow}/>
          </View>
        </TouchableOpacity>
        <View style={styles.boxcov} >
          <TouchableOpacity style={[styles.inputbox, styles.shadowProp]} onPress={()=>navigate('Stores')}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>Order Concrete</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>Ballast</Text>
            </View>
          </View>
        </View>
        <View style={styles.boxcov}>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>Sand</Text>
            </View>
          </View>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>Bill of Quantities</Text>
            </View>
          </View>
        </View>
        <View style={[styles.boxcov,{marginBottom:100}]}>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>Exhauster</Text>
            </View>
          </View>
          <View style={[styles.inputbox, styles.shadowProp]}>
            <View style={[styles.inrshabox2, styles.shadowProp2]}>
              <TruckIcon />
              <Text style={styles.txt}>Book  Inspection</Text>
            </View>
          </View>
        </View>
      </ScrollView> */}
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  bgimg: {
    height: 240,
  },
  inputbox2: {
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 15,
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
    padding: 7,
    marginTop:25
  },
  inputbox: {
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 15,
    marginVertical: 10,
    alignSelf: 'center',
    padding: 7,
    flex: 1,
    marginHorizontal: 10,
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  inrshabox: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
  },
  inrshabox2: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Constants.light_black,
    // flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 15,
  },
  boxtext: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    flex: 1,
  },
  txt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.SfSemiBold,
    textAlign: 'center',
  },
  boxcov: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    paddingHorizontal: 20,
    gap: 15,
  },
  

  backtxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Bold,
  },
  toppart: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // backgroundColor: Constants.custom_black
  },
  addtxt:{
    flexDirection:'row',
    gap:5,
    width:'70%'
  },
  hi: {
    marginRight: 10,
    height: 35,
    width: 35,
    borderRadius: 35,
    // resizeMode:'cover'
  },
  aliself: {
    alignSelf: 'center',
    // fontWeight:'bold'
    // fontFamily:FONTS.Bold
  },
  mainpart:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingVertical:5,
    // backgroundColor:'transparent'
  }
});
