import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import moment from 'moment';
import {
  BackIcon,
  CrossIcon,
  DownleftIcon,
  FilterIcon,
  GlassIcon,
  RadiooffIcon,
  RadioonIcon,
  ToprightIcon,
  WalletIcon,
} from '../../../Theme';
import { LoadContext, UserContext } from '../../../App';
import { goBack } from '../../../navigationRef';
import { GetApi } from '../../Assets/Helpers/Service';
import ActionSheet from 'react-native-actions-sheet';

const DriverTransactionHistory = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const [transactionlist, settransactionlist] = useState();
  const [selctedType, setselctedType] = useState('all');
  const typeRef = useRef();
  useEffect(() => {
    getProfile();
    getTransactions(1);
  }, []);
  const getTransactions = (p,type) => {
    setLoading(true);
    setPage(p);
    let url=`getTransaction?page=${p}`;
    if (type==='EARN') {
      url=`getTransaction?page=${p}&type=EARN`;
    } else if (type==='PENDING_WITHDRAWAL') {
      url=`getTransaction?page=${p}&type=WITHDRAWAL&status=Pending`;
    } else if (type==='APPROVED_WITHDRAWAL') {
      url=`getTransaction?page=${p}&type=WITHDRAWAL&status=Approved`;
    }
    GetApi(url).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        setCurrentData(res.data);
        if (p === 1) {
          settransactionlist(res.data);
        } else {
          settransactionlist([...transactionlist, ...res.data]);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getProfile = () => {
    setLoading(true);
    GetApi(`getProfile`).then(
      async res => {
        console.log(res.data);
        setUser(res?.data);
        setLoading(false);
      },
      err => {
        console.log(err);
        setLoading(false);
      },
    );
  };
  const fetchNextPage = () => {
    if (curentData.length === 20) {
      if (selctedType==='all') { 
        getTransactions(page + 1);
      } else{
        getTransactions(page + 1,selctedType);
      }
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.frowbtn}>
          <TouchableOpacity style={styles.backcov} onPress={() => goBack()}>
            <BackIcon color={Constants.white} />
          </TouchableOpacity>
          <Text style={styles.headtxt1}>Transaction History</Text>
          <View></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 15,
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <View style={styles.amtline}>
            <Text style={styles.amttxt}>Available balance</Text>
            <Text style={styles.amttxt2}>
              {Currency}
              {user?.wallet ? user?.wallet : 0}
            </Text>
          </View>
          <FilterIcon
            height={25}
            width={25}
            color={Constants.custom_yellow}
            onPress={() => typeRef?.current.show()}
          />
        </View>
        <FlatList
          data={transactionlist}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Dimensions.get('window').height - 200,
              }}
            >
              <Text
                style={{
                  color: Constants.white,
                  fontSize: 18,
                  fontFamily: FONTS.Medium,
                }}
              >
                No Transaction Available
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={styles.glascov}>
                  {item?.type === 'WITHDRAWAL' && item?.status === 'Pending' ? (
                    <GlassIcon height={25} width={25} color={Constants.white} />
                  ) : (
                    <WalletIcon
                      height={25}
                      width={25}
                      color={Constants.white}
                    />
                  )}
                </View>
                <View>
                  <Text style={styles.crdtxt1}>
                    {item?.type === 'WITHDRAWAL'
                      ? 'Withdrawal Amount'
                      : 'Earned Amount'}
                  </Text>
                  {item?.type === 'WITHDRAWAL' &&
                    item?.status === 'Pending' && (
                      <Text style={styles.crdtxt2}>Payment processing</Text>
                    )}
                  <Text style={styles.crdtxt3}>
                    {moment(item?.createdAt).format('DD-MM-YYYY hh:mm A')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
                <Text style={styles.crdtxt1}>
                  {Currency}
                  {item?.amount}
                </Text>
                {item?.type === 'WITHDRAWAL' ? (
                  <ToprightIcon
                    color={Constants.white}
                    height={30}
                    width={30}
                  />
                ) : (
                  <DownleftIcon
                    color={Constants.custom_yellow}
                    height={30}
                    width={30}
                  />
                )}
              </View>
            </View>
          )}
          onEndReached={() => {
            if (transactionlist && transactionlist.length > 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.05}
        />
        <ActionSheet
          ref={typeRef}
          closeOnTouchBackdrop={true}
          containerStyle={{ backgroundColor: Constants.black }}
        >
          <View style={styles.txtcov}>
            <Text style={styles.amttxt}>Select transaction type</Text>
            <CrossIcon
              style={styles.popupcross}
              height={26}
              width={26}
              color={Constants.white}
              onPress={() => {
                typeRef.current.hide();
              }}
            />
          </View>
          <TouchableOpacity style={styles.optcov} onPress={()=>{setselctedType('all'),getTransactions(1),typeRef.current.hide()}}>
            {selctedType==='all'?<RadioonIcon height={25} width={25} color={Constants.white} />:<RadiooffIcon height={25} width={25} color={Constants.white} />}
            <Text style={styles.crdtxt1}>All Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optcov} onPress={()=>{setselctedType('EARN'),getTransactions(1,'EARN'),typeRef.current.hide()}}>
            {selctedType==='EARN'?<RadioonIcon height={25} width={25} color={Constants.white} />:<RadiooffIcon height={25} width={25} color={Constants.white} />}
            <Text style={styles.crdtxt1}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optcov} onPress={()=>{setselctedType('PENDING_WITHDRAWAL'),getTransactions(1,'PENDING_WITHDRAWAL'),typeRef.current.hide()}}>
            {selctedType==='PENDING_WITHDRAWAL'?<RadioonIcon height={25} width={25} color={Constants.white} />:<RadiooffIcon height={25} width={25} color={Constants.white} />}
            <Text style={styles.crdtxt1}>Pending Withdrawals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optcov,{marginBottom:25}]} onPress={()=>{setselctedType('APPROVED_WITHDRAWAL'),getTransactions(1,'APPROVED_WITHDRAWAL'),typeRef.current.hide()}}>
            {selctedType==='APPROVED_WITHDRAWAL'?<RadioonIcon height={25} width={25} color={Constants.white} />:<RadiooffIcon height={25} width={25} color={Constants.white} />}
            <Text style={styles.crdtxt1}>Approved Withdrawals</Text>
          </TouchableOpacity>
        </ActionSheet>
      </View>
    </View>
  );
};

export default DriverTransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
    padding: 20,
  },
  backcov: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey2,
  },
  frowbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 20,
  },
  headtxt1: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    marginLeft: -20,
  },
  amtline: {
    flexDirection: 'row',
    // backgroundColor: Constants.customgrey5,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: 'space-between',
    boxShadow: '0px 1px 2px 0.05px grey',
    flex: 1,
  },
  amttxt: {
    fontSize: 15,
    fontFamily: FONTS.Medium,
    color: Constants.white,
  },
  amttxt2: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.custom_yellow,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems:'center',
    marginTop: 15,
    borderBottomWidth: 1,
    borderColor: Constants.customgrey2,
    paddingBottom: 10,
  },
  glascov: {
    backgroundColor: Constants.customgrey2,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  crdtxt1: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  crdtxt2: {
    fontSize: 13,
    color: '#e07d36',
    fontFamily: FONTS.Regular,
  },
  crdtxt3: {
    fontSize: 12,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
  },
  txtcov: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  optcov: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginHorizontal: 20,
  },
});
