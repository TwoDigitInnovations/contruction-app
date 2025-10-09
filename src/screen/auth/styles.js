import {Dimensions, StyleSheet} from 'react-native';
import Constants, {FONTS} from '../../Assets/Helpers/constant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.custom_black,
  },
  imgbg:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'flex-end',
    
    // resizeMode:'contain',
    // backgroundColor:'red'
  },
  btmpart:{
    flex:1,
    backgroundColor:Constants.custom_black,
    marginTop:-20,
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    paddingHorizontal:20,
    paddingVertical:30
  },
  btmtext:{
    color:Constants.white,
    fontSize:20,
    paddingVertical:10,
    fontFamily:FONTS.Bold
  },
  input:{
    // height:60,
    flex:1,
    backgroundColor:Constants.light_black,
    color:Constants.white,
    borderRadius:10,
    paddingLeft:10,
    fontFamily:FONTS.Regular,
    fontSize:16
  },
  inputbox:{
    height:60,
    backgroundColor:Constants.custom_black,
    color:Constants.custom_black,
    borderRadius:10,
    flexDirection:'row',
  },
  shadowProp: {
    boxShadow:'0px 0px 8px 0.05px grey',
  },
  shadowProp2: {
    boxShadow:'inset 0px 0px 8px 8px #1b1e22',
  },
  button:{
    backgroundColor:Constants.custom_yellow,
   height:60,
   justifyContent:'center',
   alignItems:'center',
   marginTop:30,
   marginBottom:10,
   borderRadius:10
  },
  buttontxt:{
    color:Constants.white,
    fontSize:18,
    fontFamily:FONTS.SemiBold
  },
  signtxt:{
    color:Constants.white,
  },
  signtxt2:{
    color:Constants.customgrey2,
    fontFamily:FONTS.Regular,
    fontSize:16
  },
  fortxt:{
    color:Constants.customgrey2,
    alignSelf:'center',
    marginBottom:50,
    fontFamily:FONTS.Medium
  },
  signtxtcov:{
    justifyContent:'center',
    flexDirection:'row',
    // backgroundColor:'red',
    marginVertical:10
  },
  iconView: {
    marginRight:10,
    alignSelf: 'center',
    borderRightWidth: 4,
    borderRightColor:'red',
    position:'absolute',
    right:0,
    zIndex:99
    // backgroundColor:'red'
  },
  titleimg:{
    marginBottom:50
  },
  btnCov: {
    //   width: '50%',
    height: 60,
    flex:1,
    flexDirection: 'row',
    // justifyContent:'space-around',
    marginVertical: 20,
    borderRadius:10,
  },
  unselectBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    borderRadius:10,
    // backgroundColor:Constants.custom_yellow
  },
  selectBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    borderRadius:10,
    // boxShadow:'inset 0 0 8 8 #1b1e22',
    // boxShadow:'0 0 8 0.05 grey',
    backgroundColor:Constants.custom_yellow
  },
  btntxt:{
    
    color:Constants.white,
    fontFamily:FONTS.Bold,
    fontSize:16,
    // alignSelf:'center',
    // boxShadow:'inset 0 0 8 8 #966c1e',
    // width:'100%',
    // height:'100%',
    // textAlign:'center'
  },
  selectshad:{
    boxShadow:'inset 0px 0px 8px 8px #966c1e',
    height:'100%',
    width:'100%',justifyContent:'center',
    alignItems:'center',
    borderRadius:10
  },
  require:{
    color:Constants.red,
    fontFamily:FONTS.Medium,
    marginLeft:10,
    fontSize:14,
    marginTop:10
  },
});
export default styles;
