import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import {OTSession} from 'opentok-react-native';

const SignalChat = () => {
  const [signal, setSignal] = useState({});
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionankit, setSessionankit] = useState();
  // let oldMessages;
  let sessionRef = useRef();
  console.log('messages', messages);
  // console.log(
  //   'state ref data',
  //   sessionRef.current.state.sessionInfo.connection.connectionId,
  // );
  //   var session;

  useEffect(() => {
    // Session.connect();
  });

  const apiKey = '47339381';
  const sessionId =
    '2_MX40NzMzOTM4MX5-MTYzNzIxMDk2MzYwOX5kbytIUEYvaisvMlY0TnJRRFphWS9qQml-fg';
  const token =
    'T1==cGFydG5lcl9pZD00NzMzOTM4MSZzaWc9NDYzMGYyMWU5YmRmMzQ5ZDVhZTdlNjc0NmZiOThlZjg5ZTY0N2RmNTpzZXNzaW9uX2lkPTJfTVg0ME56TXpPVE00TVg1LU1UWXpOekl4TURrMk16WXdPWDVrYnl0SVVFWXZhaXN2TWxZMFRuSlJSRnBoV1M5cVFtbC1mZyZjcmVhdGVfdGltZT0xNjM3MjExMDA5Jm5vbmNlPTAuNTcxOTM2OTk5MjA1ODk3MSZyb2xlPXN1YnNjcmliZXImZXhwaXJlX3RpbWU9MTYzOTgwMzAwOCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

  const sessionEventHandlers = {
    // stream: event => {
    //   console.log('stream event', event);
    // },
    signal: event => {
      console.log('events', event.type);
      if (event.data) {
        // const myConnectionId =
        //   sessionRef.getSessionInfo().connection.connectionId;
        // oldMessages = messages;
        // console.log('myConnection ID', myConnectionId);
        // console.log('oldMessages', oldMessages);
        // const messages = [{...oldMessages}, {data: `Me: ${event.data}`}];

        // const messages =
        //   event.connectionId === myConnectionId
        //     ? [...oldMessages, {data: `Me: ${event.data}`}]
        //     : [...oldMessages, {data: `Other: ${event.data}`}];
        console.log('Messages', messages);
        setMessages(prevMsg => {
          return [...prevMsg, {data: `Me: ${event.data}`}];
        });
      }
    },
  };

  const sendSignal2 = () => {
    if (text) {
      sessionRef.current.signal({
        data: text,
      });
      setText('');
    }
  };
  const sendSignal = () => {
    if (text) {
      setSignal({type: '', data: text});
      setText('');
    }
  };
  const _keyExtractor = (item, index) => index;
  const _renderItem = ({item}) => <Text style={styles.item}>{item.data}</Text>;

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          height: '85%',
          marginTop: 60,
          position: 'absolute',
          backgroundColor: 'black',
          alignSelf: 'center',
        }}>
        <FlatList
          contentContainerStyle={{
            alignItems: 'flex-end',
            alignContent: 'space-around',
            padding: 10,
          }}
          keyExtractor={(item, index) => index}
          data={messages}
          inverted={true}
          renderItem={_renderItem}
        />
      </View>
      {/* {videoButton()} */}
      {/* <Image
resizeMode='contain'
source={require('./assets/group.png')}
style={{width: '60%',  height: '46%', alignSelf: 'center', marginTop: 150}}
        /> */}

      <View style={styles.textinputandsend}>
        <View style={styles.addinputstyle}>
          <TouchableOpacity style={styles.imageStyle}>
            <MaterialCommunityIcons
              name="paperclip"
              style={{flex: 1}}
              size={25}
              color={'#696969'}
            />
          </TouchableOpacity>
          <TextInput
            style={{width: '80%'}}
            placeholder="Type Message Here"
            onChangeText={goalInputHandler}
            value={enteredGoal}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.sendview}>
          <TouchableOpacity
            onPress={() => {
              if (enteredGoal) {
                sendSignal2();
                setEnteredGoal('');
                addGoalHandler(enteredGoal, 'text');
              }
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

      {/* <Text style={styles.mainText}>
        {' '}
        OpenTok React Native Signaling Functional
      </Text>
      <OTSession
        apiKey={apiKey}
        sessionId={sessionId}
        token={token}
        signal={signal}
        eventHandlers={sessionEventHandlers}
        // ref={e => {
        //   // console.log('ref event', e.state.sessionInfo.connection.connectionId);

        //   // sessionRef = e.state.sessionInfo.connection.connectionId;
        // }}
        ref={sessionRef}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          color: 'black',
        }}
        onChangeText={val => {
          setText(val);
        }}
        value={text}
      />
      <Button
        onPress={() => {
          sendSignal2();
        }}
        title="Send Signal"
      />
      <FlatList
        data={messages}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'black',
  },
  mainText: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 10,
    color: 'black',
  },
});
export default SignalChat;
