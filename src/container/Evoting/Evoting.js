import React, { Component } from 'react';
import { View, ActivityIndicator, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import AndroidOpenSettings from 'react-native-android-open-settings';

class Evoting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {}
    }
  }
  componentDidMount() {
    NetInfo.fetch().then(state => {
      this.setState({ networkStatus: state.isConnected });
      if (this.state.networkStatus === false) {
        console.log(this.state.networkStatus)
        Alert.alert(
          'Ooops! Connection Error.',
          'Data is not reachable',
          [
            {
              text: 'Exit',
              onPress: () => BackHandler.exitApp()
            },
            {
              text: 'Open Wireless Settings',
              onPress: () => AndroidOpenSettings.wirelessSettings()
            },
          ],
          { cancelable: true },
        );
      } else {
        this.checkLoginType();
      }
    });
  }

  checkLoginType = async () => {
    const userType = await AsyncStorage.getItem('userType');
    switch (userType) {
      case 'voter':
        this.props.navigation.navigate('VoterPanel')
        break;
      case 'party':
        this.props.navigation.navigate('PartyPanel')
        break;
      case 'admin':
        this.props.navigation.navigate('AdminPanel')
        break;
      case 'candidate':
        this.props.navigation.navigate('CandidatePanel')
        break;
      default:
        this.props.navigation.navigate('Login')
        break;
    }
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="small" color="green" />
      </View>
    );
  };
};

export default Evoting;