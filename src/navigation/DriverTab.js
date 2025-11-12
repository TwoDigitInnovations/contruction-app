import React, {useCallback, useRef} from 'react';
import {Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { WorkIcon, Profile2Icon, Work2Icon } from '../../Theme';
import Constants from '../Assets/Helpers/constant';
import DriverWork from '../screen/driver/DriverWork';
import MyOrders from '../screen/driver/MyOrders';
import DriverAccount from '../screen/driver/DriverAccount';



const Tab = createBottomTabNavigator();

export const  Drivertab=()=>{
 
  const TabArr = [
    {
      iconActive: <WorkIcon color={Constants.custom_yellow} height={40} width={40}/>,
      iconInActive: <WorkIcon color={Constants.white} height={40} width={40}/>,
      component: DriverWork,
      routeName: 'DriverWork',
      name: 'Work orders',
    },
    {
      iconActive: <Work2Icon color={Constants.custom_yellow} height={40} width={40}/>,
      iconInActive: <Work2Icon color={Constants.white} height={40} width={40}/>,
      component: MyOrders,
      routeName: 'MyOrders',
      name: 'My orders',
    },
    {
      iconActive: <Profile2Icon color={Constants.custom_yellow} height={40} width={40}/>,
      iconInActive: <Profile2Icon color={Constants.white} height={40} width={40}/>,
      component: DriverAccount,
      routeName: 'DriverAccount',
      name: 'Account',
    },
    // {
    //   iconActive: <HistorytabIcon color={Constants.custom_yellow} height={40} />,
    //   iconInActive: <HistorytabIcon color={Constants.white} height={40} />,
    //   component: DriverHistory,
    //   routeName: 'DriverHistory',
    //   name: 'History',
    // },
  ];

  const TabButton = useCallback(
    (props) => {
      const isSelected = props?.['aria-selected'];
      const onPress = props?.onPress;
      const onclick = props?.onclick;
      const item = props?.item;
      const index = props?.index;
      return (
        <View style={styles.tabBtnView}>
         
          <TouchableOpacity
            onPress={onclick ? onclick : onPress}
            style={[
              styles.tabBtn,
              // isSelected ? styles.tabBtnActive : styles.tabBtnInActive,
            ]}>
            {isSelected ? item.iconActive : item.iconInActive}
            
          </TouchableOpacity>
          <Text style={[styles.tabtxt,{color:isSelected?Constants.custom_yellow:Constants.white}]}>{item.name}</Text>
        </View>
      );
    },
    [],
  );

  return (
    
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          width: '100%',
          height: 70,
          backgroundColor: '#3D3D3D',
          // borderTopRightRadius: 15,
          // borderTopLeftRadius: 15,
          borderTopWidth: 0,
        //   paddingTop: Platform.OS === 'ios' ? 10 : 0,
        },
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.routeName}
            component={item.component}
           
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => (
                <TabButton {...props} item={item} index={index} />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
    
  );
  
}

const styles = StyleSheet.create({
  tabBtnView: {
    // backgroundColor: isSelected ? 'blue' : '#FFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    height: 40,
    width: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: Constants.white,
  },
  tabBtnInActive: {
    backgroundColor: 'white',
  },
  tabtxt:{
    color:Constants.black,
    fontWeight:'400'
  }
});
