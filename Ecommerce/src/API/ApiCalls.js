import crypto from '../Helper/crypto';
import DataHelper from '../Helper/DataHelper';
import {subscriptionKey} from '../Constants';
import {apiAppId} from '../Constants';
import {apiKey} from '../Constants';
import {apiIv} from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {urls} from './ApiURLS';
import axios from 'axios';

export const getRetailerConfig = async () => {
  try {
    const data = await AsyncStorage.getItem('RETAILER_CONFIG');
    // console.log('Async DATA', data);
    if (data) {
      const configData = JSON.parse(data).data;
      // console.log('Retailer config data', configData);
      return configData;
    }
  } catch {
    // console.log('Error while getting config data');
  }
};

export const makeHeader = async (value, requestMethod) => {
  const nonce = DataHelper.nonce();
  const timeStamp = Math.floor(new Date().getTime() / 1000);
  const signatureRawData = `${apiAppId}${requestMethod}${timeStamp}${nonce}`;
  const key = crypto.CryptoJS.enc.Utf8.parse(apiKey);
  const iv = crypto.CryptoJS.enc.Utf8.parse(apiIv);
  const options = {
    keySize: 128 / 8,
    iv: iv,
    mode: crypto.CryptoJS.mode.CBC,
    padding: crypto.CryptoJS.pad.Pkcs7,
  };
  const requestSignatureBase64 = crypto.encrypt(
    crypto.CryptoJS.enc.Utf8.parse(signatureRawData),
    key,
    options,
  );
  const authorizationHeader = `aes ${apiAppId}:${requestSignatureBase64}:${nonce}:${timeStamp}`;
  if (value === 'static') {
    // console.log('Static subscription key');
    return {
      headers: {
        Authorization: authorizationHeader,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        // 'Content-Type': 'application/json',
      },
    };
  } else {
    // console.log('Dynamic subscription key');
    const retConfigData = await getRetailerConfig();
    const decSubKey = crypto.decrypt(
      retConfigData.ApiSubscriptionKey,
      key,
      options,
    );
    // console.log('Decrypted ApiSubscriptionKey:', decSubKey);
    return {
      headers: {
        Authorization: authorizationHeader,
        'Ocp-Apim-Subscription-Key': decSubKey,
      },
    };
  }
};

export const login = async (email, password) => {
  // console.log('in login call', email, password);
  try {
    const key = crypto.CryptoJS.enc.Utf8.parse(apiKey);
    const iv = crypto.CryptoJS.enc.Utf8.parse(apiIv);
    const options = {
      keySize: 128 / 8,
      iv: iv,
      mode: crypto.CryptoJS.mode.CBC,
      padding: crypto.CryptoJS.pad.Pkcs7,
    };
    const encryptedPassword = crypto.encrypt(
      crypto.CryptoJS.enc.Utf8.parse(password),
      key,
      options,
    );
    const header = await makeHeader('static', 'POST');
    const data = {Email: email, EncPassword: encryptedPassword};
    // console.log('Login details:', data);
    // console.log(urls.user.login);
    // console.log('header....', JSON.stringify(header.headers));
    // console.log('Data', data);

    const result = await axios.post(urls.user.login, data, header);

    // console.log('Login API Result:', result.status);
    // console.log('Result status:', result.status);
    if (result.status === 200) {
      // console.log('Login API Result Data:', JSON.stringify(result.data));
      // console.log('Login API Result Data2:', JSON.stringify(result));
      const localData = {
        data: result.data.data,
        agentSessionID: result.data.agentSessioinId,
      };
      // console.log('======================', localData);

      await AsyncStorage.setItem('LOGIN_DATA', JSON.stringify(localData));
      return result;
    }
  } catch (e) {
    console.log(e);
    throw new Error('Invalid Email or Password');
  }
};

export const retailerConfig = async (
  retailerID,
  retailerUserID,
  agentSessionID,
) => {
  try {
    const data = {
      RetailerId: retailerID,
      RetailerUserId: retailerUserID,
      AgentSessionId: agentSessionID,
      UserType: 'Agent',
    };

    const header = await makeHeader('static', 'POST');
    // console.log('Retailer config params:', data);
    const result = await axios.post(urls.user.retailerConfig, data, header);

    if (result.status === 200) {
      // console.log(
      //   'Retailer config API Result Data:',
      //   JSON.stringify(result.data),
      // );
      const retailerConfigData = {data: result.data.data};
      await AsyncStorage.setItem(
        'RETAILER_CONFIG',
        JSON.stringify(retailerConfigData),
      );
      return result;
    }
  } catch (e) {
    // console.log(e);
    throw new Error('Retailer config failed');
  }
};

export const deviceToken = async (
  email,
  appDeviceToken,
  voipToken,
  platform,
  version,
  retailerID,
  retailerUserID,
  agentSessionID,
  oneSignalPlayerID,
) => {
  try {
    let data = {
      Email: email,
      AppDeviceToken: appDeviceToken,
      VOIPToken: voipToken,
      DeviceType: platform,
      AppVersion: version,
      // Env: 'Dev',
      RetailerId: retailerID,
      RetailerUserId: retailerUserID,
      AgentSessionId: agentSessionID,
      OneSignalPlayerId_NormalPN: oneSignalPlayerID,
    };
    if (__DEV__) {
      data = {...data, Env: 'Dev'};
    }
    const header = await makeHeader('dynamic', 'POST');
    // console.log('>>>>>>Device token parameters:', data);
    // console.log('>>>>>>Device token URL', urls.user.token);
    const result = await axios.post(urls.user.token, data, header);

    if (result.status === 200) {
      // console.log('Device token API Result Data:', result.data);
      await AsyncStorage.setItem('DeviceToken', JSON.stringify(result.data));

      return result.data;
    }
  } catch (e) {
    throw new Error('Device token failed');
  }
};
export const updateAgentStatus = async (
  retailerID,
  retailerUserID,
  agentSessionID,
  status,
) => {
  try {
    const data = {
      RetailerId: retailerID,
      RetailerUserId: retailerUserID,
      AgentSessionId: agentSessionID,
      Status: status,
    };
    const header = await makeHeader('static', 'POST');
    // console.log('Update Agent status params:', data);

    const result = await axios.post(urls.user.updateAgentStatus, data, header);
    // console.log('abcd', result);
    if (result.status === 200) {
      // console.log('Update Agent status API Result Data:', result.data);
      return result.data;
    }
  } catch (e) {
    // console.log('Error in Update agent status API', e);
    throw new Error('Update Agent status API failed');
  }
};
export const AgentForgotPassword = async email => {
  try {
    const data = {
      Email: email,
    };

    const header = await makeHeader('static', 'POST');
    // console.log('AgentForgotPassword params:', data);
    const result = await axios.post(
      urls.user.AgentForgotPassword,
      data,
      header,
    );

    if (result.status === 200) {
      // console.log('Agent Forgot Password API Result Data:', result.data);

      return result;
    }
  } catch (e) {
    throw new Error('Agent Forgot Password API failed');
  }
};

export const GetProductsBySKU = async (
  sKU,
  IssimilarDevicesReqd,
  retailerID,
  retailerUserID,
  agentSessionID,
) => {
  try {
    const data = {
      SKU: sKU,
      IsSimilarDevicesReqd: IssimilarDevicesReqd,
      RetailerID: retailerID,
      RetailerUserID: retailerUserID,
      AgentSessionID: agentSessionID,
    };
    const header = await makeHeader('static', 'POST');
    // console.log('get products by sku params:', data);
    const result = await axios.post(urls.user.GetProductsBySKU, data, header);
    // console.log('abcd', result);
    if (result.status === 200) {
      // console.log(' get products by SKU API Result Data:', result.data);
      return result.data;
    }
  } catch (e) {
    // console.log('Error in get products by sku API', e);
    throw new Error('get products by sku API failed');
  }
};
export const EndAppointment = async (
  appointmentId,
  retailerId,
  retailerUserId,
  agentSessionId,
  status,
  userType,
) => {
  try {
    const data = {
      AppointmentId: appointmentId,
      RetailerId: retailerId,
      RetailerUserId: retailerUserId,
      AgentSessionId: agentSessionId,
      Status: status,
      UserType: userType,
    };
    const header = await makeHeader('static', 'POST');
    // console.log('EndAppointment params:', data);
    const result = await axios.post(urls.user.EndAppointment, data, header);
    // console.log('abcd', result);
    if (result.status === 200) {
      // console.log(' EndAppointment API Result Data:', result.data);
      return result.data;
    }
  } catch (e) {
    // console.log('Error in EndAppointment API', e);
    throw new Error('EndAppointment API failed');
  }
};
export const SearchProducts = async (
  SearchText,
  RetailerId,
  RetailerUserId,
  AgentSessionId,
) => {
  try {
    const data = {
      searchText: SearchText,
      retailerId: RetailerId,
      retailerUserId: RetailerUserId,
      agentSessionId: AgentSessionId,
    };
    const header = await makeHeader('static', 'POST');
    // console.log('SearchProducts params:', data);
    const result = await axios.post(urls.user.SearchProducts, data, header);
    // console.log('abcd', result);
    if (result.status === 200) {
      // console.log(' SearchProducts API Result Data:', result.data);
      return result.data;
    }
  } catch (e) {
    // console.log('Error in SearchProducts API', e);
    throw new Error('SearchProducts API failed');
  }
};
