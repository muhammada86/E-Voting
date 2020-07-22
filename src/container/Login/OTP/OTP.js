import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import IP from '../../../component/CONSTANTS/CONSTANTS';
export default class OTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
            userData: null,
            status: false
        };
    }
    async componentDidMount() {
        const chkcnic = await AsyncStorage.getItem('userCNIC');
        fetch(IP + "/admin/chkLogin?cnic=" + chkcnic)
            .then(responseJson => responseJson.json())
            .then(response => {
                this.setState({ userData: response[0], status: true });
            }).then(err => {
                console.log(err);
            }).done();
    }

    sendOtpToUserHandler = (code) => {
        fetch(IP + "/OTPService/checkValidityOfUserOTP?otp=" + code + "&cnic=" + this.state.userData["Cnic"])
            .then(responseJson => responseJson.json())
            .then(response => {
                if (response == "Successful") {
                    fetch(IP + "/OTPService/deleteRecentOTPRecord?code=" + code)
                        .then(responseJson => responseJson.json())
                        .then(res => {
                            console.log("RECORD DELETED :" + res);
                        }).then(err => console.log(err)).done();
                    this.setUserTokenForLoginHandler();
                    this.props.navigation.navigate('Evoting');

                } else {
                    alert("Wrong OTP, Try Again Carefully...!!");
                }
            }).then(err => {
                console.log(err);
            }).done();
    }

    setUserTokenForLoginHandler = async () => {
        const userToken = await AsyncStorage.setItem('userAuthToken', this.state.code);
    }
    resendCodehandler = () => {
        //this.sendOtpToUserHandler(this.state.code);
        alert("Please be patient...!!");
    }

    render() {
        return (
            <View style={Style.container}>
                <Text style={{ color: "green", padding: wp('1%') }}>Enter OTP(One Time Password) </Text>
                <Text style={{ padding: wp('1.5%') }}>Your One Time Password has been sent to your mobile number.please enter the number below.</Text>
                {this.state.status ?
                    <OTPInputView
                        pinCount={4}
                        onCodeChanged={code => { this.setState({ code }) }}
                        autoFocusOnLoad
                        codeInputFieldStyle={Style.underlineStyleBase}
                        codeInputHighlightStyle={Style.underlineStyleHighLighted}
                        onCodeFilled={code => this.sendOtpToUserHandler(code)}
                    />
                    :
                    <ActivityIndicator size="small" color="green" />

                }
                <Text style={{ color: "green", padding: 20, alignSelf: 'center' }}>Didn't get a code?</Text>
                <TouchableOpacity onPress={this.resendCodehandler}>
                    <Text style={Style.resendBtn}>Resend</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const Style = StyleSheet.create({
    container: {
        width: wp('80%'),
        marginTop: hp('20%'),
        height: 50,
        alignSelf: 'center'

    },
    borderStyleBase: {
        width: 30,
        height: 45
    },
    borderStyleHighLighted: {
        borderBottomColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 2,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    Logo: {
        width: wp('30%'),
        height: hp('30%'),
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    otpText: {
        fontSize: wp('3.5%'),
        fontWeight: 'bold',
        padding: 5,
        alignSelf: 'baseline',
        color: "white"
    },
    color: {
        color: "black"
    },
    resendBtn: {
        width: wp('26%'),
        paddingVertical: 8,
        paddingHorizontal: 26,
        textTransform: 'uppercase',
        height: hp('4.5%'),
        fontSize: wp('3%'),
        fontWeight: 'bold',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'green',
        color: 'white'
    }
});