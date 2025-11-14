/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { check, PERMISSIONS, RESULTS, request, requestMultiple } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Constants from '../Helpers/constant';

const CameraGalleryPeacker = (props) => {

  const options2 = {
    mediaType: 'photo',
    maxWidth: props?.width || 300,
    maxHeight: props?.height || 300,
    quality: props?.quality || 1,
    includeBase64: props.base64,
    saveToPhotos: true
  };


  const launchCameras = async () => {
    launchCamera(options2, (response) => {
      console.log(response)
      if (response.didCancel) {
        props?.cancel()
        console.log('User cancelled image picker');
      } else if (response.error) {
        props?.cancel()
        console.log('ImagePicker Error:', response.error);
      } else if (response.customButton) {
        props?.cancel()
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        onCancel()
        props.getImageValue(response);
      }
    });

  };

  const launchImageLibrarys = async () => {

    launchImageLibrary(options2, (response) => {
      if (response.didCancel) {
        props?.cancel()
        console.log('User cancelled image picker');
      } else if (response.error) {
        props?.cancel()
        console.log('ImagePicker Error:', response.error);
      } else if (response.customButton) {
        props?.cancel()
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
      // setTimeout(() => {
        props.refs.current?.hide()
      // }, 100);
        props.getImageValue(response);
      }
    });
  };

const requestMediaPermission = async (type, permission) => {
  try {
    const result = await check(permission);

    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      setTimeout(() => type(), 300);
      return;
    }

    if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
      const permissionResult = await request(permission);

      if (permissionResult === RESULTS.GRANTED || permissionResult === RESULTS.LIMITED) {
        setTimeout(() => type(), 300);
      } else {
        console.log('Permission denied');
      }
    }
  } catch (error) {
    console.error('Error checking or requesting permission:', error);
  }
};



  const onCancel = () => {
    if (props?.cancel !== undefined) {
      props?.cancel();
      props.refs.current?.hide();
    }
  };

  return (
    <ActionSheet
      ref={props.refs}
      closeOnTouchBackdrop={false}
      closeOnPressBack={false}
      containerStyle={{ backgroundColor: props.backgroundColor }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              color: props?.headerColor || Constants.black,
              fontSize: 20,
              fontWeight: '700',
              marginBottom: 20,
            }}>
            Choose your photo
          </Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', width: '100%' }}
          onPress={() => {
            Platform.OS === 'ios' ? requestMediaPermission(launchCameras, PERMISSIONS.IOS.CAMERA) : launchCameras()
          }}>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: props?.titleColor || Constants.black,
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Take a Picture
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 10 }}
          onPress={() => {
            Platform.OS === 'ios' ? requestMediaPermission(launchImageLibrarys, PERMISSIONS.IOS.PHOTO_LIBRARY) : launchImageLibrarys()

          }}>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: props?.titleColor || Constants.black,
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Choose from gallery
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'flex-end',
          }}
          onPress={() => {
            onCancel();
            props.refs.current?.hide();
          }}>
          <View style={{ marginLeft: 10, width: '100%' }}>
            <Text
              style={{
                color: props?.cancelButtonColor || Constants.black,
                fontSize: 18,
                fontWeight: '500',
                textAlign: 'right',
                marginRight: 20,
              }}>
              CANCEL
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

export default CameraGalleryPeacker;
