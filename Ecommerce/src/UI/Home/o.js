import React, {Component} from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import {OTSession} from 'opentok-react-native';

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  mainText: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 10,
    color: 'black',
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.apiKey = '47339381';
    this.sessionId =
      '1_MX40NzMzOTM4MX5-MTYzNjU0NzE0NDMzMH41MDR0c2V6VlhVN1Y0Q09aaWJnSjN3N21-fg';
    this.token =
      'T1==cGFydG5lcl9pZD00NzMzOTM4MSZzaWc9Yjc0Njg3ZTlmOGY5MDgyZTdmZjdkNTYyZTQ1NjU1OGI4NTU3Y2I5MjpzZXNzaW9uX2lkPTFfTVg0ME56TXpPVE00TVg1LU1UWXpOalUwTnpFME5ETXpNSDQxTURSMGMyVjZWbGhWTjFZMFEwOWFhV0puU2pOM04yMS1mZyZjcmVhdGVfdGltZT0xNjM2NTQ3MTcxJm5vbmNlPTAuNDc3NDc5MTkwMTA0MzY0MjQmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzNzE1MTk3MCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';
    this.state = {
      signal: {
        data: '',
        type: '',
      },
      text: '',
      messages: [],
    };
    this.sessionEventHandlers = {
      signal: event => {
        if (event.data) {
          console.log('Session inclass', this.sessionankit);
          const myConnectionId =
            this.sessionankit.getSessionInfo().connection.connectionId;
          const oldMessages = this.state.messages;
          console.log('myConnection ID', myConnectionId);
          console.log('oldMessages', oldMessages);
          const messages =
            event.connectionId === myConnectionId
              ? [...oldMessages, {data: `Me: ${event.data}`}]
              : [...oldMessages, {data: `Other: ${event.data}`}];
          console.log('Messages', messages);
          this.setState({
            messages,
          });
        }
      },
    };
  }
  sendSignal() {
    if (this.state.text) {
      this.setState({
        signal: {
          type: '',
          data: this.state.text,
        },
        text: '',
      });
    }
  }
  _keyExtractor = (item, index) => index;
  _renderItem = ({item}) => <Text style={styles.item}>{item.data}</Text>;
  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.mainText}>
          {' '}
          OpenTok React Native Signaling Sample
        </Text>
        <OTSession
          apiKey={this.apiKey}
          sessionId={this.sessionId}
          token={this.token}
          signal={this.state.signal}
          eventHandlers={this.sessionEventHandlers}
          ref={instance => {
            this.sessionankit = instance;
          }}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            color: 'black',
          }}
          onChangeText={text => {
            this.setState({text});
          }}
          value={this.state.text}
        />
        <Button
          onPress={() => {
            this.sendSignal();
          }}
          title="Send Signal"
        />
        <FlatList
          data={this.state.messages}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );
  }
}

export default App;
