import {
    KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { TextInput } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import Header from '../../Assets/Component/Header';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import { goBack } from '../../../navigationRef';
import { LoadContext } from '../../../App';

const RateReview = props => {
  const orderdata = props?.route?.params;
  const [loading, setLoading] = useContext(LoadContext);
  const [driverreview, setdriverreview] = useState('');
  const [driverrating, setdriverrating] = useState('');
  const [alreadyrated, setalreadyrated] = useState(false);
  const [productreview, setproductreview] = useState('');
  const [productrating, setproductrating] = useState('');
  const [vendorreview, setvendorreview] = useState('');
  const [vendorrating, setvendorrating] = useState('');
  console.log(orderdata);
  useEffect(() => {
    {
      orderdata?.driver?._id && getuserreview();
    }
  }, []);

  const addreview = () => {
    const data = {
      driver: orderdata?.driver,
      vendor: orderdata?.vendor?._id,
      product: orderdata?.product?._id,
      driverrating,
      driverreview,
      vendorrating,
      vendorreview,
      productrating,
      productreview,
    };
    console.log('data', data);
    setLoading(true);
    Post(`addreview`, data).then(
      async res => {
        setLoading(false);
        console.log(res);
        goBack();
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getuserreview = async () => {
    GetApi(
      `getReviewByUser?driver=${orderdata?.driver?._id}&vendor=${orderdata?.vendor?._id}&product=${orderdata?.product?._id}`,
    ).then(
      async res => {
        console.log(res);
        if (res?.status) {
          if (
            res?.data?.driverReview ||
            res?.data?.vendorReview ||
            res?.data?.productReview
          ) {
              setalreadyrated(true);
            setdriverreview(res?.data?.driverReview?.comment);
            setdriverrating(res?.data?.driverReview?.rating);
            setproductreview(res?.data?.productReview?.comment);
            setproductrating(res?.data?.productReview?.rating);
            setvendorreview(res?.data?.vendorReview?.comment);
            setvendorrating(res?.data?.vendorReview?.rating);
          }
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
      <Header />
      <KeyboardAvoidingView 
                          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                          style={{flex:1}}
                        >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textStyle}>Add Driver Rating & Review</Text>
        <View style={{ marginVertical: 10, marginHorizontal: 20 }}>
          {!alreadyrated ? (
            <StarRating
              rating={driverrating || '0'}
              enableHalfStar={false}
              color={Constants.custom_yellow}
              onChange={() => {}}
              onRatingEnd={e => setdriverrating(e)}
            />
          ) : (
            <StarRatingDisplay
              rating={driverrating || '0'}
              color={Constants.custom_yellow}
            />
          )}
        </View>

        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.inrshabox, styles.shadowProp2]}
            placeholder="Driver Review (Optional)"
            placeholderTextColor={Constants.customgrey2}
            numberOfLines={5}
            multiline={true}
            editable={!alreadyrated}
            value={driverreview}
            onChangeText={e => setdriverreview(e)}
          ></TextInput>
        </View>

        <View style={styles.horline}></View>

        <Text style={styles.textStyle}>Add Shop Rating & Review</Text>
        <View style={{ marginVertical: 10, marginHorizontal: 20 }}>
          {!alreadyrated ? (
            <StarRating
              rating={vendorrating || '0'}
              enableHalfStar={false}
              color={Constants.custom_yellow}
              onChange={() => {}}
              onRatingEnd={e => setvendorrating(e)}
            />
          ) : (
            <StarRatingDisplay
              rating={vendorrating || '0'}
              color={Constants.custom_yellow}
            />
          )}
        </View>

        <View style={[styles.inputbox, styles.shadowProp]}>
          <TextInput
            style={[styles.inrshabox, styles.shadowProp2]}
            placeholder="Shop Review (Optional)"
            placeholderTextColor={Constants.customgrey2}
            numberOfLines={5}
            multiline={true}
            editable={!alreadyrated}
            value={vendorreview}
            onChangeText={e => setvendorreview(e)}
          ></TextInput>
        </View>

        <View style={styles.horline}></View>

        <Text style={styles.textStyle}>Add Product Rating & Review</Text>
        <View style={{ marginVertical: 10, marginHorizontal: 20 }}>
          {!alreadyrated ? (
            <StarRating
              rating={productrating || '0'}
              enableHalfStar={false}
              color={Constants.custom_yellow}
              onChange={() => {}}
              onRatingEnd={e => setproductrating(e)}
            />
          ) : (
            <StarRatingDisplay
              rating={productrating || '0'}
              color={Constants.custom_yellow}
            />
          )}
        </View>

        <View
          style={[styles.inputbox, styles.shadowProp, { marginBottom: 70 }]}
        >
          <TextInput
            style={[styles.inrshabox, styles.shadowProp2]}
            placeholder="Product Review (Optional)"
            placeholderTextColor={Constants.customgrey2}
            numberOfLines={5}
            multiline={true}
            editable={!alreadyrated}
            value={productreview}
            onChangeText={e => setproductreview(e)}
          ></TextInput>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      {!alreadyrated&&<TouchableOpacity
        style={[styles.logOutButtonStyle2,{backgroundColor:(!driverrating||!vendorrating||!productrating)?'#baa172': Constants.custom_yellow}]}
        onPress={() => addreview()}
        disabled={!driverrating||!vendorrating||!productrating}
      >
        <Text style={styles.modalText}>Submit</Text>
      </TouchableOpacity>}
    </View>
  );
};

export default RateReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  textStyle: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.SfSemiBold,
    marginLeft: 20,
  },
  logOutButtonStyle2: {
    width: '90%',
    backgroundColor: Constants.custom_yellow,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    height: 50,
    position: 'absolute',
    bottom: 20,
  },
  inputbox: {
    backgroundColor: '#cdcdcd',
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 7,
    height: 60,
    height: 110,
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
    textAlignVertical: 'top',
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
  horline: {
    height: 2,
    backgroundColor: Constants.customgrey,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  modalText: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
});
