import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler,
    Vibration
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from "@react-native-community/netinfo";
import AndroidOpenSettings from 'react-native-android-open-settings';
import IP from '../../component/CONSTANTS/CONSTANTS';
// import PTRView from 'react-native-pull-to-refresh';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';

class Login extends Component {
    state = {
        userData: {},
        userInput: '',
        validated: false,
        isFormValid: false,
        btnName: 'lock',
        btnTitle: 'Enter CNIC',
        error: "",
        togglePass: false,
        passIconTitle: "eye",
        otpSent: false
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            this.setState({ networkStatus: state.isConnected });
            if (this.state.networkStatus === false) {
                Alert.alert(
                    'Ooops! Connection Error.',
                    'Data is not reachable',
                    [
                        {
                            text: 'Exit',
                            onPress: () => BackHandler.exitApp(),
                            style: 'cancel',
                        },
                        {
                            text: 'Open Wireless Settings',
                            onPress: () => AndroidOpenSettings.wirelessSettings()
                        },
                    ],
                    { cancelable: true },
                );
            }
        });
    }

    // _refresh = () => {
    //     return new Promise((resolve) => {
    //         setTimeout(() => { resolve() }, 2000)
    //     });
    // }

    onCnicChangeHandler = async v => {
        this.setState({ userInput: v });
        if (this.state.userInput.length == 12) {
            this.setState(
                {
                    isFormValid: true,
                    btnName: 'login',
                    btnTitle: 'Login',
                    checkingAuthDetail: false
                }
            )
        } else {
            this.setState(
                {
                    isFormValid: false,
                    btnName: 'lock',
                    btnTitle: 'Enter CNIC'
                }
            )
        }
        const userToken = await AsyncStorage.setItem('userAuthToken', this.state.userInput)
        const welcomeScreen = await AsyncStorage.setItem('welcomeScreen', "isTrue");
    }

    togglePasswordHandler = () => {
        this.setState({ togglePass: !this.state.togglePass });
        if (this.state.togglePass === false) {
            this.setState({ passIconTitle: "eye-off" });
        } else {
            this.setState({ passIconTitle: "eye" });
        }
    }
    loginHandler = async () => {
        this.setState({ checkingAuthDetail: true })
        fetch(IP + "/admin/chkLogin?CNIC=" + this.state.userInput)
            .then(response => (response.json())
                .then(res => {
                    if (res.length >= 1) {
                        const updatedData = { ...res[0] };
                        this.setState({ userData: updatedData, error: "", validated: true });
                        this.routingHandler();
                    } else {
                        this.setState({ error: "Invalid CNIC, Please Try again!!" });
                        Vibration.vibrate();
                    }
                }
                )
            ).catch(err => {
                Vibration.vibrate();
                alert(err);
            });
    }

    routingHandler = async () => {
        if (this.state.userData["Cnic"] !== "") {
            const userType = await AsyncStorage.setItem('userType', this.state.userData["type"]);
            const userObj = await AsyncStorage.setItem('userCNIC', this.state.userData["Cnic"]);
            const chkcnic = await AsyncStorage.getItem('userAuthToken');

            this.setState({ validated: true });
            const candidateData = {
                cnic: this.state.userData["Cnic"],
                type: this.state.userData["type"],
                name: this.state.userData["Name"]
            };
            fetch(IP + "/OTPService/sendOTP?name=" + this.state.userData["Name"] + "&cnic=" + this.state.userData["Cnic"] + "&number=" + this.state.userData["pNo"])
                .then(responseJson => responseJson.json())
                .then(res => {
                    if (res == "Success") {
                        this.props.navigation.navigate('OTP', candidateData);
                    }
                })
                .then(err => {
                    if (err == "Failed") {
                        alert("There is an error, Please Try Again Later");
                        this.setState({ validated: false });
                        this.props.navigation.navigate('Evoting');
                    } else {
                        //alert("Could Not Connected to the Server, Please Check your Connection")
                        this.setState({ validated: false });
                        this.props.navigation.navigate('Evoting');
                    }
                    this.setState({ validated: false });
                }).done();
        }
    }
    render() {
        let currentLabel = null;
        if (this.state.checkingAuthDetail) {
            currentLabel = <ActivityIndicator color="white" size="small" />
        }
        if (!this.state.validated) {
            currentLabel = (
                <TouchableOpacity
                    disabled={!this.state.isFormValid}
                    activeOpacity={!this.state.isFormValid ? 0.1 : 1}
                    onPress={this.loginHandler}>
                    <Text style={Style.loginBtn}>
                        {this.state.btnTitle} &nbsp;
                    <Icon name={this.state.btnName} size={wp('3.99%')} color="white" />
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={Style.mainContainer}>

                <View style={Style.LogoContainer}>
                    <Image style={Style.Logo} source={require('../../../assets/images/logo.png')} />
                    {/* <Text style={Style.ecpText}>ecp login panel </Text> */}
                </View>
                <View style={Style.InputContainer}>
                    <TextInput
                        onChangeText={value => this.onCnicChangeHandler(value)}
                        style={Style.Input}
                        secureTextEntry={!this.state.togglePass}
                        keyboardType={"number-pad"}
                        placeholder="Enter CNIC"
                        placeholderTextColor="black" />
                    <Icon
                        name="account-card-details-outline"
                        size={wp('4.5%')}
                        style={Style.inputIconUser}
                        color="#2b2b2b" />
                    <Text style={{ color: 'white', textTransform: 'capitalize', fontWeight: 'bold' }}>{this.state.error}</Text>

                    <Icon onPress={this.togglePasswordHandler}
                        name={this.state.passIconTitle}
                        size={wp('4.5%')}
                        style={Style.inputTogglePass}
                        color="#2b2b2b" />

                    {currentLabel}

                </View>
            </View>
        );
    };
};

const Style = StyleSheet.create({
    mainContainer: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#2E944A',
        justifyContent: 'flex-start',
    },
    LogoContainer: {
        marginTop: hp('10%'),
        alignItems: 'center',
    },
    Logo: {
        justifyContent: 'flex-start',
        width: wp('50%'),
        height: hp('50%'),
        resizeMode: 'contain'
    },
    ecpText: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        color: 'white',
        marginTop: hp('1%'),
        textTransform: 'uppercase'
    },
    InputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    Input: {
        borderBottomWidth: 3,
        borderBottomColor: '#238441',
        paddingHorizontal: wp('15.5%'),
        fontSize: wp('4%'),
        marginTop: 20,
        alignContent: 'flex-start'
    },
    inputIconUser: {
        position: 'absolute',
        top: wp('10%'),
        left: wp('23%'),
    },
    inputTogglePass: {
        position: 'absolute',
        top: wp('10%'),
        left: wp('69%'),
    },
    loginBtn: {
        color: 'white',
        fontSize: wp('3.33%'),
        paddingHorizontal: wp('6%'),
        paddingVertical: hp('1.8%'),
        textTransform: 'uppercase',
        borderRadius: 10,
        fontWeight: 'bold',
        backgroundColor: '#258441'

    }
})




export default Login;
