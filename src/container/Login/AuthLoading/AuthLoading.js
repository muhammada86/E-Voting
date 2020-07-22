import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AuthLoading extends Component {
    constructor(props) {
        super(props);
        this.loadApp();
    }

    loadApp = async () => {
        const userToken = await AsyncStorage.getItem('userAuthToken');
        this.props.navigation.navigate(userToken ? 'Evoting' : 'Login');
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
}
