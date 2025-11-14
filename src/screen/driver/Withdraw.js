import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { goBack } from '../../../navigationRef';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import { BackIcon } from '../../../Theme';

const DriverWithdraw = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [toast, setToast] = useContext(ToastContext);
  const [model, setmodel] = useState(false);
  const [amount, setamount] = useState();
  const [reqamount, setreqamount] = useState();
  const [notes, setnotes] = useState('');
  const [bank_name, setbank_name] = useState('');
  const [ac_no, setac_no] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    if (user?.bank_name && user?.ac_no) {
      setbank_name(user?.bank_name);
      setac_no(user?.ac_no);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150);
    } 
  }, []);
  const submit = async () => {
    const data = {
      amount: Number(amount),
      type: 'WITHDRAWAL',
      req_user_type: 'driver',
    };
    if (notes !== '' || !notes) {
      data.note = notes;
    }
    setLoading(true);
    Post('createTransaction', data).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setreqamount(Number(amount));
          setamount(null);
          setnotes('');
          getProfile();
          setmodel(true);
        } else {
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getProfile = () => {
    GetApi(`getProfile`).then(
      async res => {
        console.log(res.data);
        setUser(res?.data);
      },
      err => {
        console.log(err);
      },
    );
  };
  const updateprofile = () => {
    if (!bank_name || !ac_no) {
      setToast('Please fill all the fields');
      return;
    }
    const obj = {
      bank_name,
      ac_no,
    };
    setLoading(true);
    Post('updateprofile', obj).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          setUser(res?.data);
          setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
        } else {
          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.frowbtn}>
          <TouchableOpacity style={styles.backcov} onPress={() => goBack()}>
            <BackIcon color={Constants.white} />
          </TouchableOpacity>
          <Text style={styles.headtxt1}>Withdraw</Text>
          <View></View>
        </View>
        <View style={styles.amtline}>
          <View style={styles.amtlinepart}>
          <Text style={styles.amttxt}>Withdrawable amount</Text>
          <Text style={styles.amttxt2}>
            {Currency}
            {user?.wallet}
          </Text>
          </View>
         {user?.bank_name&& <View style={styles.amtlinepart}>
          <Text style={styles.amttxt}>Bank Name</Text>
          <Text style={styles.amttxt2}>{user?.bank_name}</Text>
          </View>}
          {user?.ac_no&&<View style={styles.amtlinepart}>
          <Text style={styles.amttxt}>A/c No </Text>
          <Text style={styles.amttxt2}>{user?.ac_no}</Text>
          </View>}
        </View>
        {user?.bank_name ? (
          <View>
            <Text style={styles.headamt}>Enter Amount</Text>
            <View style={styles.inpcov}>
              <Text
                style={[
                  styles.curtxt,
                  {
                    color:
                      Number(amount) > 0
                        ? Constants.white
                        : Constants.customgrey2,
                  },
                ]}
              >
                {Currency}
              </Text>
              <TextInput
                ref={inputRef}
                placeholder="0"
                placeholderTextColor={Constants.customgrey2}
                keyboardType="number-pad"
                style={[
                  styles.textinp,
                  Platform.OS === 'ios' && { lineHeight: 28 },
                ]}
                value={amount}
                onChangeText={e => setamount(e)}
              />
            </View>
            {Number(amount) > user?.wallet && (
              <Text style={styles.require}>
                Your entered value is more than the withdrawable amount
              </Text>
            )}
            <Text style={styles.nottxt}>Notes</Text>
            <View style={styles.inpucov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Optional"
                placeholderTextColor={Constants.customgrey2}
                numberOfLines={5}
                multiline={true}
                value={notes}
                onChangeText={e => setnotes(e)}
              ></TextInput>
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.name}>Bank Name</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                style={[styles.input, styles.shadowProp2]}
                placeholder="Enter Bank Name"
                value={bank_name}
                onChangeText={setbank_name}
                placeholderTextColor={Constants.customgrey2}
              />
            </View>
            <Text style={styles.name}>Account Number</Text>
            <View style={[styles.inputbox, styles.shadowProp]}>
              <TextInput
                style={[styles.input, styles.shadowProp2]}
                placeholder="Enter Account Number"
                value={ac_no}
                onChangeText={setac_no}
                placeholderTextColor={Constants.customgrey2}
              />
            </View>
          </View>
        )}
        {user?.bank_name?<TouchableOpacity
          style={[
            styles.btncov,
            {backgroundColor:
                Number(amount) > 0 && Number(amount) <= user?.wallet && amount
                  ? Constants.custom_yellow
                  : '#baa172',},
          ]}
          onPress={() => {
            if ( Number(amount) > 0 &&Number(amount) <= user?.wallet &&amount
            ) {
              submit();
            }
          }}
        >
          <Text
            style={[
              styles.btntxt,
              { color:
                  Number(amount) > 0 && Number(amount) <= user?.wallet && amount? Constants.white: Constants.black,},]}>
            Withdraw Amount
          </Text>
        </TouchableOpacity>:
        <TouchableOpacity
          style={[
            styles.btncov,
            {backgroundColor:
                bank_name && ac_no
                  ? Constants.custom_yellow
                  : '#baa172',},
          ]}
          onPress={() => updateprofile() }
          disabled={!bank_name || !ac_no}
        >
          <Text
            style={[
              styles.btntxt,
              { color:
                  Number(amount) > 0 && Number(amount) <= user?.wallet && amount? Constants.white: Constants.black,},]}>
            Add & Continue
          </Text>
        </TouchableOpacity>}
        <Modal transparent={true} visible={model} animationType="none">
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View style={styles.modal}>
              <View style={styles.box2}>
                <Image
                  source={require('../../Assets/Images/correct.png')}
                  style={styles.img}
                />
                <Text style={styles.modtxt}>
                  {Currency}
                  {reqamount} withdrawal request successful.
                </Text>
                <Text style={styles.modtxt2}>
                  It will reflect in your bank account within 2 days
                </Text>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => {
                    setmodel(false);
                    goBack();
                  }}
                >
                  <Text style={styles.buttontxt2}>Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default DriverWithdraw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    paddingVertical: 20,
  },
  backcov: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey4,
  },
  frowbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headtxt1: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    marginLeft: -20,
  },
  amtline: {
    // backgroundColor: Constants.customgrey5,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 20,
    boxShadow: '0px 1px 2px 0.05px grey',
  },
  amtlinepart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amttxt: {
    fontSize: 15,
    fontFamily: FONTS.Medium,
    color: Constants.white,
  },
  amttxt2: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    color: Constants.custom_yellow,
    width: '50%',
    textAlign: 'right',
  },
  headamt: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.white,
    textAlign: 'center',
    marginTop: 15,
  },
  nottxt: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.white,
    marginLeft: 20,
    marginTop: 25,
    marginBottom:Platform.OS === 'ios' ?10:5
  },
  textinp: {
    color: Constants.white,
    fontSize: 24,
    fontFamily: FONTS.SemiBold,
  },
  curtxt: {
    color: Constants.white,
    fontSize: 24,
    fontFamily: FONTS.Medium,
  },
  inpcov: {
    borderBottomWidth: 2,
    borderColor: Constants.white,
    width: '70%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputfield: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    flex: 1,
    textAlignVertical: 'top',
  },
  inpucov: {
    borderWidth: 1,
    borderColor: Constants.white,
    borderRadius: 15,
    height: 100,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  btncov: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    position: 'absolute',
    bottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  btntxt: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  ///model///
  modal: {
    // height: '40%',
    width: '85%',
    backgroundColor: Constants.white,
    borderRadius: 5,
  },
  box2: {
    padding: 20,
    // alignItems:'center',
    // justifyContent:'center'
  },
  modtxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  modtxt2: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  button2: {
    backgroundColor: '#4BAE50',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // marginBottom: 10,
    borderRadius: 7,
  },
  buttontxt2: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  img: { height: 80, width: 80, alignSelf: 'center', marginBottom: 15 },
  input: {
    flex: 1,
    backgroundColor: Constants.light_black,
    color: Constants.white,
    borderRadius: 10,
    paddingLeft: 10,
    fontFamily: FONTS.Regular,
    fontSize: 14,
  },
  inputbox: {
    height: 60,
    backgroundColor: Constants.custom_black,
    color: Constants.custom_black,
    borderRadius: 10,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
  },
  shadowProp: {
    boxShadow: '0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow: 'inset 0px 0px 8px 8px #1b1e22',
  },
  name: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Regular,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
