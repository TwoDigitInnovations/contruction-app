/* eslint-disable prettier/prettier */
import axios from 'axios';
import Constants from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionCheck from './ConnectionCheck';
// import RNFetchBlob from 'rn-fetch-blob';
import { navigate, reset } from '../../../navigationRef';

const GetApi = async (url, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          console.log(`jwt ${userDetail?.token}`);

          axios
            .get(Constants.baseUrl + url, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  // props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  // props?.navigation?.navigate('SignIn');
                  reset('Auth')
                  reject(err.response);
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Post = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log('url===>', Constants.baseUrl + url);
          console.log('token===>', `jwt ${userDetail?.token}`);
          console.log('data=====>', data);
          axios
            .post(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  // props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  reset('Auth')
                } 
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Put = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          console.log(`jwt ${userDetail?.token}`);
          axios
            .put(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                if (err?.response?.status === 401) {
                  // props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  reset('Auth')
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Delete = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          console.log(`jwt ${userDetail?.token}`);
          axios
            .delete(Constants.baseUrl + url, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                if (err?.response?.status === 401) {
                  // props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  reset('Auth')
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};


// const ApiFormData = async (img) => {
//   console.log(img);
//   const user = await AsyncStorage.getItem('userDetail');
//   let userDetail = JSON.parse(user);
//   return new Promise((resolve, reject) => {
//     try {
//       RNFetchBlob.fetch(
//         'POST',
//         `${Constants.baseUrl}user/fileupload`,
//         {
//           'Content-Type': 'multipart/form-data',
//           // Authorization: `jwt ${userDetail.token}`,
//         },
//         [
//           {
//             // name: 'file',
//             // filename: img.path.toString(),
//             // type: img.mime,
//             // data: RNFetchBlob.wrap(img.path),
//             name: 'file',
//             filename: img.fileName,
//             type: img.type,
//             data: RNFetchBlob.wrap(img.uri),
//           },
//         ],
//       )
//         .then(resp => {
//           // console.log('res============>', resp);
//           resolve(JSON.parse(resp.data));
//         })
//         .catch(err => {
//           console.log(err);
//           reject(err);
//         });
//     } catch (err) {
//       console.log(err);
//       reject(err);
//     }
//   });
// };

const PostWithImage = async (url, data) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log('url===>', Constants.baseUrl + url);
          console.log('token===>', `jwt ${userDetail?.token}`);
          console.log('data=====>', data);
          axios
            .post(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  // props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  reset('Auth')
                } 
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};
export { Post, Put, GetApi, Delete, PostWithImage };
