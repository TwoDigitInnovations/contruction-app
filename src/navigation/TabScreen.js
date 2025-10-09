import React, {useCallback, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screen/app/Home';
import Constants from '../Assets/Helpers/constant';
import {HistoryIcon, HomeIcon, MenuIcon, ProfileIcon} from '../../Theme';
import Menu from '../screen/app/Menu';
import Orders from '../screen/app/Orders';
import Profile from '../screen/app/Profile';

const Tab = createBottomTabNavigator();

export const TabNav = () => {
  const TabArr = [
    {
      iconActive: <HomeIcon color={Constants.black} height={20} width={20} />,
      iconInActive: <HomeIcon color={Constants.white} height={20} width={20} />,
      component: Home,
      routeName: 'Home',
      name: 'Home',
    },
    {
      iconActive: <MenuIcon color={Constants.black} height={20} width={20} />,
      iconInActive: <MenuIcon color={Constants.white} height={20} width={20} />,
      component: Menu,
      routeName: 'Menu',
      name: 'Menu',
    },

    {
      iconActive: (
        <HistoryIcon color={Constants.black} height={20} width={20} />
      ),
      iconInActive: (
        <HistoryIcon color={Constants.white} height={20} width={20} />
      ),
      component: Orders,
      routeName: 'Orders',
      name: 'Orders',
    },
    {
      iconActive: (
        <ProfileIcon color={Constants.black} height={20} width={20} />
      ),
      iconInActive: (
        <ProfileIcon color={Constants.white} height={20} width={20} />
      ),
      component: Profile,
      routeName: 'Profile',
      name: 'Profile',
    },
  ];

  const TabButton = useCallback(
    (props) => {
      const isSelected = props?.['aria-selected'];
      const onPress = props?.onPress;
      const onclick = props?.onclick;
      const item = props?.item;
      const index = props?.index;
      return (
        <View style={[styles.tabBtnView]}>
          <TouchableOpacity
            onPress={onclick ? onclick : onPress}
            style={[styles.tabBtn]}>
            {isSelected ? item.iconActive : item.iconInActive}
          </TouchableOpacity>
          <Text
            style={[
              styles.tabtxt,
              {color: isSelected ? Constants.black : Constants.white},
            ]}>
            {item.routeName}
          </Text>
        </View>
      );
    },
    [],
  );

  return (
    <Tab.Navigator
      // initialRouteName='Categories'
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          width: '95%',
          height: 70,
          bottom: 20,
          marginLeft: '2.5%',
          backgroundColor: Constants.custom_yellow,
          borderRadius: 50,

          // borderTopRightRadius: 15,
          // borderTopLeftRadius: 15,
          // borderTopWidth: 0,
          //       shadowOffset: {width: 0, height: 12},
          // shadowOpacity: 0.3,
          // shadowRadius: 5,
          // elevation: 16,
          //       shadowColor:Constants.black
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
};

const styles = StyleSheet.create({
  tabBtnView: {
    // backgroundColor: isSelected ? 'blue' : '#FFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tabBtn: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 15,
  },
  tabBtnActive: {
    backgroundColor: Constants.black,
    flexDirection: 'row',
    paddingHorizontal: 12,
    // width:'110%',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBtnInActive: {
    backgroundColor: 'white',
  },
  tabtxt: {
    color: Constants.darkblue,
    fontWeight: '600',
    fontSize:12
  },
});
