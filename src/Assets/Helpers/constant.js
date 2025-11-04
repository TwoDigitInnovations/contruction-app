const prodUrl = 'http://192.168.0.187:3000/v1/api/';
// const prodUrl = 'http://10.217.61.96:3000/v1/api/';
// const prodUrl = 'https://api.bodmass.com/v1/api/';

let apiUrl = prodUrl;
export const Googlekey ='AIzaSyCZRRqCOMrm_njXnzhtBi1GlNgYbLWZQxM'
export const Currency = 'KES';

const Constants = {
  baseUrl: apiUrl,
  yellow: '#FFE600',
  custom_black: '#22272B',
  custom_blue: '#2048BD',
  custom_yellow: '#C68E27',
  light_black: '#5E5B5B40',
  black: '#000000',
  white: '#FFFFFF',
  dark_white: '#FFFFFF',
  customgrey:'#858080',
  customgrey2:'#a7a9aa',
  // red: '#FE7237',
  red: '#FF0000',
  blue: '#7493FF',
  constant_appLaunched: 'appLaunched',
  HAS_ACCOUNT: 'HASACCOUNT',
  LANGUAGE_SELECTED: 'LANGUAGE_SELECTED',
  header_back_middle_right: 'header_back_middle_right',
  header_back: 'header_back',
  keyUserToken: 'token',
  isOnboarded: 'isOnboarded',
  authToken: '',
  keysocailLoggedIn: 'isSocialLoggedIn',
  isProfileCreated: 'isProfileCreated',
  userInfoObj: 'userInfoObj',
  lastUserType: 'lastUserType',
  isDeviceRegistered: 'isDeviceRegistered',
  canResetPass: 'canResetPass',
  fcmToken: 'fcmToken',
  productionUrl: prodUrl,
  // developmentUrl: devUrl,

  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,

  
};
///inter font
export const FONTS = {
  Regular:'Arimo-Regular',
  Medium:'Arimo-Medium',
  SemiBold:'Arimo-SemiBold',
  Bold:'Arimo-Bold',
  SfBold:'sfbold',
  SfSemiBold:'sfsemibold',
  SfMedium:'sfmedium',
};

export default Constants;
