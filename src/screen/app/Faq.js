import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import {LayoutAnimation, Platform, UIManager} from 'react-native';
import { GetApi } from '../../Assets/Helpers/Service';
import { LoadContext, } from '../../../App';
import moment from 'moment';
import { ArrowupIcon, DownarrIcon } from '../../../Theme';
import Header from '../../Assets/Component/Header';


if (
 Platform.OS === 'android' &&
 UIManager.setLayoutAnimationEnabledExperimental
) {
 UIManager.setLayoutAnimationEnabledExperimental(true);
}
const Faq = () => {
      const [loading, setLoading] = useContext(LoadContext);
      const [value, setValue] = useState();
      const [faqList, setfaqList] = useState([]);

    useEffect(()=>{
      getFaq()
    },[])
  const getFaq = async () => {
    setLoading(true);
    GetApi(`getfaq`).then(
      async res => {
        setLoading(false);

        console.log(res);
        if (res.status) {
          setLoading(false);
          setfaqList(res.data);
        } else {
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
      },
    );
  };
  return (
    <View style={styles.container}>
      <Header item={'Faq'} />
      <FlatList
      data={faqList}
      renderItem={(({item},i)=><View
          key={i}
          style={[
            styles.plancard,{
              backgroundColor:
                item?._id === value
                  ? Constants.custom_yellow
                  : Constants.black,},]}>
          <View style={styles.rowbtn}>
            <Text style={[styles.planname,{color:item?._id === value?Constants.black:Constants.custom_yellow}]}>{item?.question}</Text>
            <TouchableOpacity
              style={[styles.arrcov,{
                backgroundColor:
                  item?._id === value
                    ? Constants.black
                    : Constants.custom_yellow,}]}
              onPress={() => {
               LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                item?._id === value ? setValue(null) : setValue(item?._id);
              }}>
             {item?._id === value?<ArrowupIcon height={20} width={20} color={Constants.custom_yellow}/>: <DownarrIcon height={20} width={20}/>}
            </TouchableOpacity>
          </View>
          {item?._id === value && (
            <View>
              <Text style={styles.dectxt}>{item?.answer}</Text>
              
            </View>
          )}
        </View>)}

      />
    </View>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    // padding: 20,
  },
  arrcov: {
    height: 25,
    width: 25,
    backgroundColor: Constants.custom_yellow,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planname: {
    color: Constants.custom_yellow,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  plancard: {
    backgroundColor: Constants.black,
    borderRadius: 20,
    marginTop: 20,
    padding: 15,
    width:'90%',
    alignSelf:'center'
  },
  dectxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginVertical:10
  },
  rowbtn: {flexDirection: 'row', justifyContent: 'space-between'},
});
