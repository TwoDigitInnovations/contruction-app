import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { navigationRef } from '../../navigationRef';
import SignUp from '../screen/auth/SignUp';
import Home from '../screen/app/Home';
import SignIn from '../screen/auth/SignIn';
import ForgotPassword from '../screen/auth/ForgotPassword';
import Project from '../screen/app/Project';
import { TabNav } from './TabScreen';
import Stores from '../screen/app/Stores';
import Concrete from '../screen/app/Concrete';
import Category from '../screen/app/Category';
import Shipping from '../screen/app/Shipping';
import Dashboard from '../screen/app/Dashboard';
import Profile from '../screen/app/Profile';
import Account from '../screen/app/Account';
import Inquiry from '../screen/app/Inquiry';
import Tracking from '../screen/app/Tracking';
import { Vendortab } from './VenderTab';
import VenderOrders from '../screen/vendor/VenderOrders';
import { Drivertab } from './DriverTab';
import ProductDetail from '../screen/app/ProductDetail';
import CheckOut from '../screen/app/CheckOut';
import OrderDetail from '../screen/vendor/OrderDetail';
import Map from '../screen/driver/Map';
import DriverOrder from '../screen/driver/DriverOrder';
import DriverForm from '../screen/driver/DriverForm';
import DriverAccount from '../screen/driver/DriverAccount';
import DriverProfile from '../screen/driver/DriverProfile';
import VendorForm from '../screen/vendor/VendorForm';
import VendorAccount from '../screen/vendor/VendorAccount';
import VendorProfile from '../screen/vendor/VendorProfile';



const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigate = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      {/* <AuthStack.Screen name="OtpVerify" component={OtpVerify} />
      <AuthStack.Screen name="ChangePassword" component={ChangePassword} /> */}
      
    </AuthStack.Navigator>
  );
};

export default function Navigation(props) {
  return (
    // <NavigationContainer>
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={props.initial}
       >
        
        <Stack.Screen name="Auth" component={AuthNavigate} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="App" component={TabNav} />
        <Stack.Screen name="Vendortab" component={Vendortab} />
        <Stack.Screen name="Drivertab" component={Drivertab} />
        <Stack.Screen name="Project" component={Project} />
        <Stack.Screen name="Stores" component={Stores} />
        <Stack.Screen name="Concrete" component={Concrete} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Shipping" component={Shipping} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Inquiry" component={Inquiry} />
        <Stack.Screen name="Tracking" component={Tracking} />
        <Stack.Screen name="VenderOrders" component={VenderOrders} />
        <Stack.Screen name="CheckOut" component={CheckOut} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="DriverOrder" component={DriverOrder} />
        <Stack.Screen name="VendorForm" component={VendorForm} />
        <Stack.Screen name="VendorAccount" component={VendorAccount} />
        <Stack.Screen name="VendorProfile" component={VendorProfile} />
        <Stack.Screen name="DriverForm" component={DriverForm} />
        <Stack.Screen name="DriverAccount" component={DriverAccount} />
        <Stack.Screen name="DriverProfile" component={DriverProfile} />
        
   
      </Stack.Navigator>

    </NavigationContainer>
  );
}
