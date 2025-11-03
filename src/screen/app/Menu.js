import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../../Assets/Component/Header';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { RightarrowIcon } from '../../../Theme';
import { GetApi } from '../../Assets/Helpers/Service';
import { LoadContext, ToastContext } from '../../../App';
import { navigate } from '../../../navigationRef';

const Menu = () => {
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [catagorylist, setcatagorylist] = useState([]);
  const [selCatList, setselCatList] = useState([]);
  const [currentcategory, setcurrentcategory] = useState('all');

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
          setselCatList(res.data);
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
      <Header item={'Menu'} />
      <View style={{ backgroundColor: Constants.custom_black }}>
        <FlatList
          data={[{ _id: 'all', name: 'All',attributes:[1,2] }, ...catagorylist]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => ( item?.attributes?.length>0&&
            <TouchableOpacity
              style={styles.optv}
              onPress={() => {
                setcurrentcategory(item._id);
                if (item._id === 'all') {
                 setselCatList(catagorylist) 
                } else{
                  setselCatList([item])
                }
              }}
            >
              <Text style={styles.opt}>{item.name}</Text>
              {currentcategory === item._id && (
                <View style={styles.line}></View>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selCatList?.length>0&&selCatList.map((item,index)=>(item?.attributes?.length>0&&<View key={index}>
          <View style={[styles.headcov,{marginBottom:10,marginTop:index!=0?10:0}]}>
            <Text style={styles.headtxt}>{item?.name}</Text>
          </View>

           {item?.attributes&&item?.attributes.map((it,ind)=> <TouchableOpacity style={styles.box} key={ind} onPress={()=>navigate('StoreWiseProduct',{categoryId:item?._id,attributeName:it?.name})}>
              <View
                style={{ flexDirection: 'row', gap: 20, alignItems: 'center',marginBottom:((selCatList?.length===index+1&&item?.attributes?.length>0&&ind === item.attributes.length - 1)||(catagorylist?.length-2===index&&item?.attributes?.length>0&&catagorylist[index+1]?.attributes?.length===0&&ind === item.attributes.length - 1))?100:0 }}
              >
                <Image source={require('../../Assets/Images/projectbox.png')} />
                <Text style={styles.opttxt}>{it?.name}</Text>
              </View>
              <RightarrowIcon color={Constants.black} />
            </TouchableOpacity>)}
            
        </View>))}
      </ScrollView>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  opt: {
    // backgroundColor: Constants.lightblue,
    color: Constants.white,
    // padding: 10,
    // fontWeight: '700',
    fontFamily: FONTS.Bold,
    fontSize: 14,
    borderRadius: 10,
  },
  optv: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  line: {
    height: 3,
    backgroundColor: Constants.white,
    marginVertical: 4,
    borderRadius: 5,
  },
  headcov: {
    backgroundColor: '#AEAEAE',
  },
  headtxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    marginVertical: 5,
  },
  opttxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
  },
});
