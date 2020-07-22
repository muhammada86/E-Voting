import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView
}
    from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/FontAwesome';

class getStarted extends React.Component {
    constructor(props) {
        super(props);
        this.checkWelcomeStateHandler();
    }

    checkWelcomeStateHandler = async () => {
        const getWelcomeScreenState = await AsyncStorage.getItem('welcomeScreen');
        if (getWelcomeScreenState === "isTrue") {
            this.props.navigation.navigate("AuthLoading");
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={Style.mainContainer}>
                    <View style={Style.LogoContainer}>
                        <Image style={Style.Logo} source={require('../../../assets/images/logo.png')} />

                        <Text style={Style.ecpText}>{"\n"}Election Commission </Text>
                        <Text style={Style.ecpText}>Of Pakistan</Text>
                    </View>
                    <TouchableOpacity
                        style={Style.BtnContainer}
                        onPress={() => this.props.navigation.navigate('AuthLoading')}>
                        <Text
                            style={Style.startedBtn}>
                            Get Started&nbsp;
                <Icon name="chevron-right" size={wp('3%')} color="white" />
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

}
const Style = StyleSheet.create({
    mainContainer: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#2E944A',

    },
    LogoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 90,
    },
    Logo: {
        width: wp('50%'),
        height: hp('50%'),
        resizeMode: 'contain'
    },
    ecpText: {
        fontSize: wp('4,3%'),
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase'
    },
    startedBtn: {
        width: wp('40%'),
        paddingHorizontal: 30,
        paddingVertical: 18,
        textTransform: 'uppercase',
        height: hp('7.5%'),
        fontSize: wp('3.3%'),
        fontWeight: 'bold',
        marginTop: 40,
        borderRadius: 50,
        alignSelf: 'center',
        backgroundColor: '#258441',
        color: 'white'
    }
})
export default getStarted;