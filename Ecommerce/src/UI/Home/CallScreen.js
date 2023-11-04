import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
import React, {useState, useEffect, useRef} from 'react';
 
import {
  EndAppointment,
  SearchProducts,
  updateAgentStatus,
} from '../../API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GetProductsBySKU} from '../../API/ApiCalls';
import {FlatList} from 'react-native';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {OTPublisher, OTSession, OTSubscriber} from 'opentok-react-native';

///////////////////////////////////////////////////////////////////////

function CallScreen({navigation, route}) {
  const [video, setvideo] = useState(false);
  const [camera, setcamera] = useState(false);
  const [mic, setmic] = useState(true);
  const [idno, setidno] = useState(0);
  const [chatgoals, setChatGoals] = useState([]);
  const [enteredGoal, setEnteredGoal] = useState('');
  const [add, setAdd] = useState(false);
  const [mute, setmute] = useState(false);
  const [calling, setcalling] = useState(false);
  const [snackbar, setsnackbar] = useState(false);
  const [timerandcontactbar, settimerandcontactbar] = useState(true);
  const [element, setelement] = useState('');
  const [categories, setCategories] = useState([{}]);
  const [indicator, setIndicator] = useState(true);
  const [signal, setSignal] = useState({});
  const [text, setText] = useState('');
  const [subscriberDetailsID, setSubscriberDetailsID] = useState();
  const [messages, setMessages] = useState([]);
  const [btnClick, setBtnClick] = useState(false);
  const [seconds, setseconds] = useState(0);
  const [minute, setMinute] = useState(0);
  const [id, setId] = useState(0);
  const [APILoading, setAPILoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchBoxFocus, setSearchBoxFocus] = useState(false);
  const sessionRef = useRef();
  var array = [{name: 'Call'}, {name: 'Chat'}, {name: 'Catalog'}];
  const {notificationData, decryptedKey, profileData} = route.params;
  let endBtnClick = true;

  const endAppointment = async () => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      await EndAppointment(
        notificationData.additionalData.AppointmentId,
        notificationData.additionalData.RetailerId,
        notificationData.additionalData.RetailerUserId,
        asyncLoginData.agentSessionID,
        'Aborted',
        'Agent',
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };
  const onSearchProducts = async onProduct => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      const searchProducts = await SearchProducts(
        onProduct,
        notificationData.additionalData.RetailerId,
        notificationData.additionalData.RetailerUserId,
        asyncLoginData.agentSessionID,
      );
      if (onProduct === '') {
        const getproductsbysku = await GetProductsBySKU(
          notificationData.additionalData.SKU,
          true,
          notificationData.additionalData.RetailerId,
          notificationData.additionalData.RetailerUserId,
          asyncLoginData.agentSessionID,
        );
        products([getproductsbysku.data.ProductDetails]);
      } else {
        products(searchProducts.data);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };
  const products = ProductDetails => {
    const cars = [];
    ProductDetails.map((item, index) => {
      const img = JSON.parse(item.ImageUrls).ImageUrls;
      const spece = JSON.parse(item.Specs);
      cars.push({
        Primaryproduct: 'Primary Product',
        Model: spece.Make + '\t' + spece.Model,
        Sku: item.SKU,
        Price: 'Price' + spece.Price,
        url: img[0],
      });
      setCategories(cars);
    });
  };
  const getProductsBySKU = async () => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      const getproductsbysku = await GetProductsBySKU(
        notificationData.additionalData.SKU,
        true,
        notificationData.additionalData.RetailerId,
        notificationData.additionalData.RetailerUserId,
        asyncLoginData.agentSessionID,
      );
      products([getproductsbysku.data.ProductDetails]);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const noSkuvalue = async noskuval => {
    if (
      notificationData.additionalData.SKU == null ||
      notificationData.additionalData.SKU === ''
    ) {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      const searchProducts = await SearchProducts(
        noskuval,
        notificationData.additionalData.RetailerId,
        notificationData.additionalData.RetailerUserId,
        asyncLoginData.agentSessionID,
      );
      products(searchProducts.data);
    } else {
      Promise.all([getProductsBySKU(), updateAgentstatus('Connected')]);
    }
  };

  const updateAgentstatus = async status => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      await updateAgentStatus(
        notificationData.additionalData.RetailerId,
        notificationData.additionalData.RetailerUserId,
        asyncLoginData.agentSessionID,
        status,
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const publisherProperties = {
    publishAudio: mic === true ? true : false,
    audioTrack: true,
    publishVideo: video === true ? true : false,
    cameraPosition: camera === true ? 'front' : 'back',
    resolution: '352x288',
    videoSource: 'camera',
    name: 'Mobile1',
  };

  const subscriberEventHandlers = {
    connected(e) {
      console.log('11.......subscriber connected', e);
      try {
        Timer();
        noSkuvalue();
        const connetedEvent = e;

        setSubscriberDetailsID(connetedEvent.stream.connectionId);
        Promise.all([getProductsBySKU(), updateAgentstatus('Connected')]);
        setIndicator(false);
      } catch (e) {
        console.log(e);
      }
    },
    otrnError(object) {
      console.log('12....... otrnError', object);
    },
    videoDisabled(event) {
      console.log('13.......videodisabled', event);
    },
    error(error) {
      console.log(`14.......There was an error with the subscriber: ${error}`);
    },
    videoEnabled(e) {
      console.log('15.......videoEnabled', e);
    },
    disconnected(event) {
      console.log('16.......disconnected', event);
    },
    videoDisableWarning(event) {
      console.log('17.......videoDisableWarning', event);
    },
    videoDisableWarningLifted(event) {
      console.log('18.......videoDisableWarningLifted', event);
    },
    videoDataReceived(event) {
      console.log('19.......video received', event);
    },
  };

  const sessionEventHandlers = {
    audioLevel: level => {
      console.log('21.......publisher audio level', level);
    },
    streamCreated: event => {
      console.log('22.......session stream created!', event);
    },
    streamDestroyed: event => {
      try {
        Promise.all([endAppointment(), updateAgentstatus('Available')]);
        navigation.pop();
        clearInterval(id);
      } catch (e) {
        console.log('ERROR in promise All', e);
      }
      console.log('23.......session stream destroyed!', event);
    },
    connectionCreated: obj => {
      console.log('24.......session connection created', obj);
    },
    connectionDestroyed: obj => {

      console.log('25...... connection Destroyed', obj);
    },
    error: err => {
      console.log('25.......Error in session', err);
    },
    sessionConnected: event => {
      console.log('26.......session connected', event);
    },
    sessionDisconnected: event => {
      console.log('27.......session disconnected', event);
    },
    sessionReconnected: obj => {
      console.log('28.......session Reconnected', obj);
    },
    sessionReconnecting: obj => {
      console.log('29.......session Reconnecting', obj);
    },
    signal: event => {
      const parsedEventData = JSON.parse(event.data);
      if (
        parsedEventData.type === 'MESSAGEFROMAGENT' ||
        parsedEventData.type === 'MESSAGEFROMCUSTOMER'
      ) {
        if (event.data) {
          const chatDataJson = event.data;
          const chatData = JSON.parse(chatDataJson);
          setMessages(prevMsg => {
            return [
              {
                data: chatData.data,
                type: chatData.type,
                agentName: chatData.agentName,
              },
              ...prevMsg,
            ];
          });
        }
      } else if (parsedEventData.type === 'CONTACTDETAILS') {
        const chatDataJson = event.data;
        const chatData = JSON.parse(chatDataJson);
        setMessages(prevMsg => {
          return [
            {
              data: chatData.data,
              type: chatData.type,
            },
            ...prevMsg,
          ];
        });
      } else {
      }
    },
  };
  const sendSignalHandler = (textData, type) => {
    if (type === 'MESSAGEFROMAGENT') {
      const signalData = {
        data: textData,
        type: type,
        agentName: profileData.data.FirstName,
      };

      if (text) {
        sessionRef.current.signal({
          data: JSON.stringify(signalData),
        });
        setText('');
      }
    } else if (type === 'CONTACTDETAILS') {
      const signalData = {
        data: textData,
        type: type,
      };

      sessionRef.current.signal({
        data: JSON.stringify(signalData),
      });
    } else if (type === 'ADDTOCART') {
      const signalData = {
        data: textData,
        type: type,
        price: '1190',
      };
      sessionRef.current.signal({
        data: JSON.stringify(signalData),
      });
    } else if (type === 'PRODUCTDETAILS') {
      const signalData = {
        data: textData,
        type: type,
      };
      sessionRef.current.signal({
        data: JSON.stringify(signalData),
      });
    }
  };
  const sessionIdFunc = value => {
  };

  const publisherEventHandlers = {
    streamCreated: event => {
      console.log('31........Publisher stream created!', event);
    },
    streamDestroyed: event => {
      console.log('32.........Publisher stream destroyed!', event);
    },
  };
  const Timer = () => {
    setId(
      setInterval(() => {
        setseconds(prev => prev + 1);
      }, 1000),
    );
  };
  useEffect(() => {
    if (seconds > 59) {
      setseconds(0);
      setMinute(prev => prev + 1);
    }
  }, [seconds, minute, id]);
  const sessionId = value => {
  };

  const HideKeyboardEvent = Keyboard.addListener('keyboardDidHide', () => {
    setSearchBoxFocus(false);
  });

  class Agent {
    constructor(description1, description2, description3) {
      this.description1 = description1;
      this.description2 = description2;
      this.description3 = description3;
    }
  }

  const AGENT = [
    new Agent(
      'Laptops',
      'Swamy Dev',
      'Laptops ,2-in-1 Laptops \n, Smart Phones, Tablets,\n Product Specialist \n',
    ),

    new Agent(
      '2-in-1 Laptops',
      'Swamy Dev',
      'Laptops ,2-in-1 Laptops \n, Smart Phones, Tablets,\n Product Specialist \n',
    ),

    new Agent(
      'Smart Phones',
      'Swamy Dev',
      'Laptops ,2-in-1 Laptops \n, Smart Phones, Tablets,\n Product Specialist \n',
    ),

    new Agent(
      'Tablets',
      'Swamy Dev',
      'Laptops ,2-in-1 Laptops \n, Smart Phones, Tablets,\n Product Specialist \n',
    ),
    new Agent(
      'Product Specialist',
      'Swamy Dev',
      'Laptops ,2-in-1 Laptops \n, Smart Phones, Tablets,\n Product Specialist \n',
    ),

    new Agent('Product Explainer', 'null', ''),
    new Agent('VSR Support', 'null', ''),

    new Agent('LG', 'null', ''),
    new Agent('Other Avaliable agents', 'null', ''),
  ];

  const snackBar = text => {
    return (
      <View style={styles.snackBarCntnr}>
        <Text style={styles.snackBarTxt}>{text}</Text>
      </View>
    );

    // snack bar message to show details sent to chat screen
  };

  //catalog flat list
  const renderGridItem = itemData => {
    return (
      <View style={styles.catalogListCntnr}>
        <Text style={styles.catalogListTxt}>
          {itemData.item.Primaryproduct}
        </Text>
        <View style={styles.catalogBoxDataContainer}>
          <View style={styles.catalogImageContainer}>
            <Image
              resizeMode="cover"
              source={{
                uri: itemData.item.url,
              }}
              // source={require('../../../assets/Laptop.png')}
              style={{width: 70, height: 70}}
            />
          </View>
          <View style={styles.catalogDataContainer}>
            <Text style={styles.catalogDataTitle}>{itemData.item.Model}</Text>
            <Text style={styles.catalogDataSKU}>{itemData.item.Sku}</Text>
            <Text style={styles.catalogDataPrice}>{itemData.item.Price}</Text>
          </View>
        </View>
        <View style={styles.catalogShareAddContainer}>
          <TouchableOpacity
            style={styles.shareContainer}
            onPress={() => {
              setelement('share');
              setsnackbar(true);
              setTimeout(() => {
                setsnackbar(false);
              }, 1000);
              sendSignalHandler(itemData.item.Model, '');
            }}>
            <MaterialCommunityIcons
              name="share-variant"
              size={15}
              color={'#696969'}
            />
            <Text style={styles.shareTxt}>Share</Text>
          </TouchableOpacity>
          {/* </View> */}

          <View style={styles.addToCartContainer}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                padding: 5,
                justifyContent: 'space-around',
              }}
              onPress={() => {
                setelement('addtocart');
                setsnackbar(true);
                setTimeout(() => {
                  setsnackbar(false);
                }, 1000);
                sendSignalHandler(itemData.item.Model, 'PRODUCTDETAILS');
              }}>
              <MaterialCommunityIcons name="cart" size={15} color={'white'} />
              <Text style={styles.addToCartTxt}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  //call add icon flatlist
  const addFlatList = itemData => {
    if (itemData.item.description2 === 'null') {
      return (
        <View
          style={{
            width: '100%',
            height: 70,
            padding: 10,
            flexDirection: 'column',
            justifyContent: 'space-around',
            borderBottomWidth: 0.5,
          }}>
          <Text style={{color: '#FB8B24', fontSize: 17}}>
            {itemData.item.description1}
          </Text>
          <View>
            <Text style={{color: '#2f4f4f'}}>No agent Avaliable</Text>
          </View>
        </View>
      );
    } else {
      return (
        //add call flat list
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            padding: 10,
            justifyContent: 'space-around',
            borderBottomWidth: 0.5,
          }}>
          <Text style={{color: '#FB8B24', fontSize: 17}}>
            {itemData.item.description1}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <MaterialCommunityIcons
              style={{width: 50, height: 50, alignSelf: 'center'}}
              name="account-circle"
              size={50}
              color={'#a9a9a9'}
            />
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                {itemData.item.description2}
              </Text>
              <Text style={{color: '#2f4f4f'}}>
                {itemData.item.description3}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  settimerandcontactbar(true);
                  setcalling(false);
                }, 5000);
                settimerandcontactbar(false);
                setcalling(true);
                setAdd(false);
              }}>
              <MaterialCommunityIcons
                name="phone-plus"
                size={35}
                color={'#FB8B24'}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };
  //chat flat list
  const chatText = ({item}) => {
    // chat screen text
    if (item.type === 'CONTACTDETAILS') {
      return (
        <View
          style={{
            padding: 10,
            backgroundColor: 'white',
            marginBottom: 15,
            // alignItems: 'center',
            alignSelf: 'flex-end',
            justifyContent: 'center',
            borderBottomEndRadius: 20,
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: 20,
          }}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{color: 'black', fontSize: 15, textAlign: 'left'}}>
              {/* {item.data} */}Name
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <MaterialCommunityIcons
                name="account"
                size={15}
                color={'black'}
              />
              <Text
                style={{
                  color: 'black',
                  fontSize: 15,
                  textAlign: 'left',
                  marginLeft: 5,
                }}>
                {item.data.agentName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <MaterialCommunityIcons name="email" size={15} color={'black'} />
              <Text style={{color: 'black', fontSize: 15, marginLeft: 5}}>
                support@connect.com
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (item.type === 'share') {
      return (
        <View
          style={{
            padding: 10,
            backgroundColor: '#FB8B24',
            marginBottom: 15,
            justifyContent: 'center',
            borderBottomEndRadius: 20,
            borderBottomLeftRadius: 20,
            alignSelf: 'flex-end',
            borderTopLeftRadius: 20,
          }}>
          <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>
            Shared Product :
          </Text>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
            }}>
            {item.data}
          </Text>
        </View>
      );
    } else if (item.type === 'addtocart') {
      return (
        <View
          style={{
            padding: 10,
            backgroundColor: 'white',
            marginBottom: 15,
            alignSelf: 'flex-end',
            borderBottomEndRadius: 20,
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: 20,
          }}>
          <Text style={{color: 'black', fontSize: 15}}>
            Request to add to cart sent to Customer for
          </Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            {item.data}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: 'white',
            marginVertical: 6,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: item.type === 'MESSAGEFROMAGENT' ? 20 : 0,
            borderTopRightRadius: item.type === 'MESSAGEFROMAGENT' ? 0 : 20,
            alignSelf:
              item.type === 'MESSAGEFROMAGENT' ? 'flex-end' : 'flex-start',
          }}>
          {item.type !== 'MESSAGEFROMAGENT' && (
            <Text style={{color: '#19a3ff', fontSize: 15, textAlign: 'left'}}>
              Customer
            </Text>
          )}
          <Text style={{color: 'black', fontSize: 14, textAlign: 'left'}}>
            {item.data}
          </Text>
        </View>
      );
    }
  };

  const videoButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setidno(0);
        }}
        style={video ? styles.nochatcircle : styles.chatcircle}>
        <MaterialCommunityIcons
          name="video"
          style={{alignSelf: 'center'}}
          size={33}
          color={video ? '#fffaf0' : '#fffa'}
        />
      </TouchableOpacity>
    );
  };
  // set the array of strings
  const addGoalHandler = (goalTitle, type) => {
    setMessages(prevMsg => {
      return [{data: goalTitle, type: type}, ...prevMsg];
    });
  };

  //set the text
  const goalInputHandler = enteredText => {
    setEnteredGoal(enteredText);
  };
  //tabs

  //call

  SplashScreen.hide();
  return (
    <View style={styles.fullscreen}>
      {/* //tab and 3 screens */}
      <View style={styles.rowarrayscreen}>
        {array.map((item, index) => (
          <TouchableOpacity
            style={index === idno ? styles.Topcontanier : styles.NoTopcontanier}
            onPress={() => {
              setidno(index);
            }}>
            <Text style={index === idno ? styles.toptext : styles.notoptext}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* //swap screen */}
      <View style={styles.swapscreen}>
        {indicator && (
          <Modal transparent={true}>
            <View
              style={{
                backgroundColor: 'black',
                flex: 1,
                justifyContent: 'center',
                opacity: 0.65,
                // position: 'absolute',
              }}>
              <ActivityIndicator size="large" color="#FB8B24" />
            </View>
          </Modal>
        )}
        <View
          style={{
            display: idno === 0 ? 'flex' : 'none',
            flex: 1,
          }}>
          <View style={styles.OTcontainer}>
            <OTSession
              eventHandlers={sessionEventHandlers}
              sessionId={notificationData.additionalData.SessionId}
              token={notificationData.additionalData.TokenId}
              signal={signal}
              ref={sessionRef}>
              <View style={styles.OTPublishercontainer}>
                <OTPublisher
                  properties={publisherProperties}
                  eventHandlers={publisherEventHandlers}
                  style={{height: 300, width: 400}}
                />
              </View>
              <View style={styles.OTSubscriberContainer}>
                <OTSubscriber
                  style={{height: 300, width: 400}}
                  eventHandlers={subscriberEventHandlers}
                  sessionId={sessionIdFunc}
                />
              </View>
            </OTSession>
          </View>
          <TouchableOpacity
            onPress={() => {
              setidno(1);
            }}
            style={styles.callcircle}>
            <MaterialCommunityIcons
              name="message"
              style={{alignSelf: 'center'}}
              size={24}
              color={'#fffa'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roundshape}
            onPress={async () => {
              setBtnClick(true);
              try {
                await Promise.all([
                  endAppointment(),
                  updateAgentstatus('Available'),
                ]);
                navigation.pop();
                clearInterval(id);
              } catch (e) {
                console.log('ERROR in promise All', e);
              }
            }}>
            <MaterialCommunityIcons
              name="phone-hangup-outline"
              size={30}
              color={'white'}
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>

          <View style={styles.BottomTabConatiner}>
            <View style={styles.boundshape}>
              <TouchableOpacity
                disabled={video ? false : true}
                onPress={() => {
                  video ? setcamera(pre => !pre) : '';
                }}>
                <View style={styles.nocircle}>
                  <Ionicons
                    name="camera-reverse-sharp"
                    style={{alignSelf: 'center'}}
                    size={scale(28)}
                    color={video ? '#696969' : '#a9a9a9'}
                  />
                </View>

                <Text
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    bottom: scale(10),
                    fontSize: 14,
                  }}>
                  {' '}
                  Flip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setvideo(prev => !prev);
                }}
                style={{paddingRight: 40}}>
                <View style={video ? styles.nocircle : styles.circle}>
                  <MaterialCommunityIcons
                    name={video ? 'video' : 'video-off'}
                    style={{alignSelf: 'center'}}
                    size={28}
                    color={video ? 'grey' : 'white'}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    bottom: 10,
                    fontSize: 14,
                  }}>
                  Video
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.boundshapetwo}>
              <TouchableOpacity
                onPress={() => {
                  setmic(mic => !mic);
                }}
                style={{paddingLeft: 30}}>
                <View style={mic ? styles.nocircle : styles.circle}>
                  <Ionicons
                    name={mic ? 'mic' : 'mic-off'}
                    style={{alignSelf: 'center'}}
                    size={28}
                    color={mic ? '#696969' : 'white'}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    bottom: 10,
                    fontSize: 14,
                  }}>
                  Mute
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={calling ? true : false}
                onPress={() => {
                  setAdd(true);
                }}>
                <View style={styles.nocircle}>
                  <MaterialCommunityIcons
                    name="account-plus"
                    style={{alignSelf: 'center'}}
                    size={28}
                    color={calling ? '#a9a9a9' : '#696969'}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    bottom: 10,
                    fontSize: 14,
                  }}>
                  {' '}
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{display: idno === 1 ? 'flex' : 'none', flex: 1}}>
          <View
            style={{
              backgroundColor: 'black',
              flex: 1,
              paddingBottom: 70,
              paddingHorizontal: 10,
            }}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={messages}
              inverted
              renderItem={chatText}
            />
          </View>
          {/* </View> */}
          {videoButton()}

          <View style={styles.textinputandsend}>
            <View style={styles.addinputstyle}>
              <TextInput
                style={{width: '80%', color: 'black'}}
                placeholder="Type Message Here"
                onChangeText={val => {
                  setText(val);
                }}
                value={text}
                placeholderTextColor="#555"
              />
              <TouchableOpacity style={styles.imageStyle}>
                <MaterialCommunityIcons
                  name="paperclip"
                  // style={
                  // }
                  size={25}
                  color={'#696969'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sendview}>
              <TouchableOpacity
                onPress={() => {
                  sendSignalHandler(text, 'MESSAGEFROMAGENT');
                }}>
                <FontAwesome5
                  name="paper-plane"
                  style={{alignSelf: 'center'}}
                  size={20}
                  color={video ? '#696969' : 'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{display: idno === 2 ? 'flex' : 'none', flex: 1}}>
            {videoButton()}
            {APILoading ? (
              <View
                style={{
                  backgroundColor: 'black',
                  flex: 1,
                  justifyContent: 'center',
                  opacity: 0.65,
                }}>
                <ActivityIndicator size="large" color="#FB8B24" />
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 90,
                  justifyContent: 'space-evenly',
                }}>
                <View
                  style={{
                    width: '74%',
                    backgroundColor: 'white',
                    height: 150,
                    marginBottom: 10,
                    padding: 20,
                    justifyContent: 'space-evenly',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontWeight: '700',
                    }}>
                    Customer Call (English)
                  </Text>
                  <Text
                    style={{
                      color: 'grey',
                      fontSize: 15,
                    }}>
                    Product Website
                  </Text>

                  <Text style={{color: 'grey', fontSize: 15}}>
                    Product:{notificationData.additionalData.ProductTitle}
                  </Text>
                </View>

                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={categories}
                  initialNumToRender={5}
                  renderItem={renderGridItem}
                  ListFooterComponent={() => {
                    return <View style={styles.FooterStyles}></View>;
                  }}
                />
              </View>
            )}
       
         
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                height: '10%',
                width: '100%',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                overflow: 'visible',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: searchBoxFocus ? '80%' : '35%',
                  backgroundColor: '#fff',
                  borderWidth: 0.5,
                  borderColor: '#000',
                  height: 45,
                  borderRadius: 5,
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <TextInput
                  style={{
                    color: 'black',
                    width: '85%',
                  }}
                  value={searchText}
                  onPressIn={() => {
                    setSearchBoxFocus(true);
                  }}
                  onChangeText={async val => {
                    setAPILoading(true);
                    setSearchText(val);
                    notificationData.additionalData.SKU == null ||
                    notificationData.additionalData.SKU === ''
                      ? noSkuvalue()
                      : val
                      ? await onSearchProducts(searchText)
                      : await onSearchProducts('');
                    setAPILoading(false);
                  }}
                  placeholder="Search Product"
                  placeholderTextColor="black"
                  underlineColorAndroid="transparent"
                />
                <Ionicons
                  name="search-outline"
                  size={24}
                />
              </View>
              {!searchBoxFocus && (
                <View
                  style={{
                    alignItems: 'center',
                    width: '35%',

                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#FB8B24',
                    height: 45,
                    borderRadius: 5,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                    }}>
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={16}
                      color={'#696969'}
                    />
                    <Text
                      style={{
                        color: '#FB8B24',
                        fontSize: 15,
                        fontWeight: '700',
                        marginLeft: 3,
                      }}>
                      View Full Catalog
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>

      {/* //timer and send contact */}
      {timerandcontactbar && (
        <View style={styles.timerandcontactbar}>
          <View style={styles.timerbar}>
            <Ionicons
              name="alarm-outline"
              style={{alignSelf: 'flex-start', marginRight: 7}}
              size={20}
              color={'white'}
            />
            {minute < 10 ? (
              <Text style={styles.timerNumber}>0{minute} :</Text>
            ) : (
              <Text style={styles.timerNumber}>{minute} :</Text>
            )}
            {seconds < 10 ? (
              <Text style={styles.timerNumber}>0{seconds}</Text>
            ) : (
              <Text style={styles.timerNumber}>{seconds}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.contactontouch}
            onPress={() => {
              const requiredData = {
                agentName: profileData.data.FirstName,
              };
              setelement('CONTACTDETAILS');
              setsnackbar(true);
              sendSignalHandler(requiredData, 'CONTACTDETAILS');
              setTimeout(() => {
                setsnackbar(false);
              }, 2000);
            }}>
            <FontAwesome5
              name="address-book"
              size={15}
              color={'white'}
            />

            <Text style={{color: 'white', fontSize: 15}}>Send Contact</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* //calling agent  */}
      {calling && (
        <View
          style={{
            backgroundColor: '#696969',
            width: '28%',
            height: '5%',
            alignSelf: 'center',
            marginTop: 66,
            borderTopLeftRadius: 35,
            borderBottomLeftRadius: 35,
            justifyContent: 'center',
            borderTopRightRadius: 35,
            borderBottomRightRadius: 35,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <FontAwesome5 name="phone-square" size={20} color={'white'} />
            <Text style={{color: 'white', textAlign: 'auto', fontSize: 15}}>
              Calling...
            </Text>
          </View>
        </View>
      )}

      {
        // mute bar  for customer
        mute && (
          <View style={styles.mutebar}>
            <Text
              style={{
                color: 'white',
                textAlign: 'left',
                fontSize: scale(12),
              }}>
              Customer sound : Muted
            </Text>
          </View>
        )
      }

      {
        //add for call screen
        add && (
          <View style={styles.ModelBottomTabContainer}>
            <View style={styles.ModelBottomTabTop}>
              <MaterialCommunityIcons
                name="plus"
                style={{color: '#FB8B24'}}
                size={35}
                color={'#696969'}
              />
              <Text style={{color: 'black', fontSize: 25}}>Add Agent</Text>
              <TouchableOpacity
                style={{position: 'absolute', right: 10}}
                onPress={() => {
                  setAdd(false);
                }}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={35}
                  color={'#696969'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.chatinputstyle}>
              <Ionicons
                name="search-outline"
                size={20}
                style={styles.imageStyle}
              />
              <TextInput
                style={{flex: 1}}
                placeholder="Search Agent name/ skills"
                underlineColorAndroid="transparent"
              />
            </View>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={AGENT}
              renderItem={addFlatList}
            />
          </View>
        )
      }

      {snackbar &&
        snackBar(
          element === 'CONTACTDETAILS'
            ? 'contact details shared with customer'
            : element === 'share'
            ? 'product details shared with the customer'
            : 'product added to the cart',
        )}
    </View>
  );
}

const styles = ScaledSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#dcdcdc',
  },

  rowarrayscreen: {
    width: '350@s',
    height: '45@vs',
    position: 'absolute',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  swapscreen: {
    width: '100%',
    height: '94%',
    backgroundColor: 'black',
    position: 'absolute',
    top: 46,
  },

  timerandcontactbar: {
    backgroundColor: '#696969',
    width: '230@s',
    height: '30@vs',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: '66@vs',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  mutebar: {
    backgroundColor: '#696969',
    width: '162@s',
    height: '35@vs',
    alignSelf: 'center',
    position: 'absolute',
    top: '120@vs',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },

  catalogscreen: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    position: 'relative',
    top: '46@vs',
  },

  timerbar: {
    flexDirection: 'row',
    borderRightWidth: 1,
    borderRightColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerNumber: {
    color: 'white',
  },

  sendview: {
    position: 'relative',
    alignSelf: 'flex-end',
    marginRight: '10@vs',
    backgroundColor: '#FB8B24',
    height: '40@vs', //any of height
    width: '40@s',
    justifyContent: 'center',
    borderRadius: 75,
  },
  snackBarCntnr: {
    width: '80%',
    backgroundColor: '#FB8B24',
    height: '24@vs',
    alignSelf: 'center',
    marginTop: '350@vs',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackBarTxt: {
    alignSelf: 'center',
    color: 'white',
    fontSize: '16@ms',
  },
  catalogListCntnr: {
    // flex: 1,
    paddingBottom: 30,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: '16@vs',
    flexDirection: 'column',
    padding: '14@s',
    borderRadius: '8@ms',
  },
  catalogListTxt: {
    color: 'grey',
    fontSize: '15@ms',
    fontWeight: '700',
  },
  catalogBoxDataContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '5@vs',
  },
  catalogDataContainer: {
    width: '70%',
    padding: '5@ms',
  },
  catalogDataTitle: {
    overflow: 'hidden',
    color: 'grey',
    fontSize: '15@ms',
    fontWeight: 'bold',
  },
  catalogDataSKU: {
    color: 'grey',
    fontSize: '15@ms',
  },
  catalogDataPrice: {
    color: 'grey',
    fontSize: '15@ms',
    fontWeight: 'bold',
  },
  catalogShareAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60@s',
    height: '25@vs',
    backgroundColor: 'white',
    borderColor: '#FB8B24',
    borderWidth: '2@vs',
    borderRadius: '6@s',
    alignItems: 'center',
  },
  shareTxt: {
    color: '#FB8B24',
    fontSize: '11@ms',
    fontWeight: 'bold',
  },
  addToCartContainer: {
    width: '70@s',
    height: '25@vs',
    backgroundColor: '#FB8B24',
    borderRadius: '6@s',
    justifyContent: 'center',
  },
  addToCartTxt: {
    color: 'white',
    fontSize: '10@ms',
    fontWeight: 'bold',
  },
  contactontouch: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  textinputandsend: {
    width: '100%',
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '10@vs',
  },

  NoTopcontanier: {
    flex: 1,
    height: '40@vs',
    justifyContent: 'flex-start',
    borderBottomColor: 'grey',
    borderRightWidth: '1@s',
    borderRightColor: '#dcdcdc',
  },

  Topcontanier: {
    flex: 1,
    justifyContent: 'flex-start',
    borderBottomColor: '#FB8B24',
    borderBottomWidth: '7@vs',
    borderRightWidth: '1@s',
    height: '40@vs',
    borderRightColor: '#dcdcdc',
  },

  toptext: {
    textAlign: 'center',
    color: '#FB8B24',
    fontSize: '18@ms',
  },

  notoptext: {
    fontSize: '18@ms',
    textAlign: 'center',
    color: 'grey',
  },

  BottomTabConatiner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '78@vs',
    paddingBottom: '20@vs',
    backgroundColor: '#fff5ee',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  ModelBottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: '20@s',
    paddingTop: '20@vs',
    width: '100%',
    height: '80%',
    backgroundColor: '#fff5ee',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  ModelBottomTabTop: {
    flexDirection: 'row',
    height: '8%',
    width: '100%',
  },

  item: {
    alignSelf: 'center',
    color: 'black',
  },

  roundshape: {
    backgroundColor: '#fa8072',
    height: '60@s', //any of height
    width: '60@s', //any of width
    justifyContent: 'center',
    position: 'absolute',
    bottom: '45@vs',
    zIndex: 1,
    alignSelf: 'center',
    borderRadius: 50, // it will be height/2
  },
  FooterStyles: {
    backgroundColor: 'black',
    height: 60,
  },

  boundshape: {
    width: '50%',
    height: '45%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: 'green',
  },

  boundshapetwo: {
    width: '50%',
    height: '45%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  circle: {
    position: 'relative',
    bottom: 10,
    borderRadius: 150 / 2,
    backgroundColor: '#808080',
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  nocircle: {
    position: 'relative',
    bottom: '10@vs',
    width: '36@s',
    height: '36@vs',
    justifyContent: 'center',
  },

  callcircle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: '12@s',
    top: '270@vs',
    backgroundColor: '#a9a9',
    height: '50@s', //any of height
    width: '50@s',
    justifyContent: 'center',
    borderRadius: 50,
  },

  chatcircle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: '270@vs',
    right: '12@s',
    backgroundColor: '#6969',
    height: '50@s', //any of height
    width: '50@s',
    zIndex: 1,
    justifyContent: 'center',
    borderRadius: 50,
  },

  nochatcircle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: '190@vs',
    right: '12@s',
    backgroundColor: '#FB8B24',
    height: '50@s', //any of height
    width: '50@s',
    zIndex: 1,
    justifyContent: 'center',
    borderRadius: 50,
  },

  textinputstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    left: '10@s',
    alignItems: 'center',
    width: '86%',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: '40@vs',
    borderRadius: 5,
    margin: 10,
    top: 20,
  },

  chatinputstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    marginTop: '20@vs',
    alignItems: 'center',
    width: '93%',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: '40@vs',
    borderRadius: 5,
  },

  addinputstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: '20@s',
    padding: 5,
    alignItems: 'center',
    width: '75%',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: '40@vs',
    borderRadius: 7,
  },

  imageStyle: {
    paddingRight: '5@ms',
  },

  ChatTxtInput: {
    width: '80%',
    padding: 10,
  },
  OTcontainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '90%',
  },
  OTPublishercontainer: {
    width: '100%',
    height: '50%',
  },
  OTSubscriberContainer: {
    width: '100%',
    height: '60%',
  },
});
export default CallScreen;
