import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Picker, Image, Alert, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import CustomInput from '../../CustomInput/CustomInput';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import IP from '../../CONSTANTS/CONSTANTS';

export default class AddParty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBtnClicked: false,
            isFormValid: false,
            candidateData: {
                cnic: {
                    isValid: false,
                    value: "",
                    placeholder: "3420285321725",
                    label: "CNIC",
                    error: ""
                },
                name: {
                    isValid: false,
                    value: "",
                    placeholder: "Muhammad Aqib",
                    label: "Full Name",
                    error: ""
                },
                age: {
                    isValid: false,
                    value: "",
                    placeholder: "26",
                    label: "Age",
                    error: ""
                },
                sectorNA: {
                    isValid: false,
                    value: "",
                    label: "Halqa NA",
                    placeholder: "64",
                    error: ""
                },
                sectorPA: {
                    isValid: false,
                    value: "",
                    label: "Halqa PA",
                    placeholder: "PP-64",
                    error: ""
                },
                gender: {
                    isValid: false,
                    value: "",
                    label: "Gender",
                    placeholder: "Male",
                    error: ""
                },
                qualification: {
                    isValid: false,
                    value: "",
                    label: "Qualification",
                    placeholder: "M.A Politics",
                    error: ""
                },
                qualification: {
                    isValid: false,
                    value: "",
                    label: "Qualification",
                    placeholder: "M.A Politics",
                    error: ""
                },
                institute: {
                    isValid: false,
                    value: "",
                    label: "Institute",
                    placeholder: "Barani Institute Of Information Technology",
                    error: ""
                },
                property: {
                    isValid: false,
                    value: "",
                    label: "Property",
                    placeholder: "Flat, Building",
                    error: ""
                },
                assets: {
                    isValid: false,
                    value: "",
                    label: "Assets",
                    placeholder: "Company,Web-Store",
                    error: ""
                },
                accounts: {
                    isValid: false,
                    value: "",
                    label: "Accounts",
                    placeholder: "IBAN-346274637280, IBAN-765432910293",
                    error: ""
                }
            }
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Add Candidate'
    })

    inputFieldChangeHandler = (val, id) => {
        let updatedFormElements = { ...this.state.candidateData };
        updatedFormElements[id].value = val;
        this.setState({ value: updatedFormElements[id].value });
        if (updatedFormElements[id].value == "") {
            updatedFormElements[id].isValid = true;
            updatedFormElements[id].error = updatedFormElements[id].label + " field required";
            this.setState({
                isValid: updatedFormElements[id].isValid,
                error: updatedFormElements[id].error
            });
        } else {
            updatedFormElements[id].error = ""
            this.setState({ error: updatedFormElements[id].error })
        }
        let validationState = true;
        for (let key in updatedFormElements) {
            if (updatedFormElements[key].value != "" && updatedFormElements[key].error == "") {
                validationState = true;
            } else {
                validationState = false;
            }
        }
        if (validationState === true) {
            this.setState({ isFormValid: validationState });
        }
    }


    savecandidateDataHandler = () => {
        this.setState({ isBtnClicked: true });
        const candidateData = { ...this.state.candidateData };
        let i = 0;
        const dataArray = {
            "Cnic": "",
            "Name": "",
            "Age": "",
            "Sector_NA": "",
            "Sector_PP": "",
            "Gender": "",
            "Qualification": "",
        };
        const getCandidateKeys = [];
        for (let key in candidateData) getCandidateKeys.push(key);
        for (let dataKeys in dataArray) {
            dataArray[dataKeys] = candidateData[getCandidateKeys[i]].value;
            i++;
        }
        let d = new Date();
        const obj = this.props.navigation.state.params;
        dataArray.pid = obj.PID;
        dataArray.status = "P"
        dataArray.year = d.getFullYear();
        dataArray.property = this.state.candidateData.property.value;
        dataArray.school = this.state.candidateData.institute.value;
        dataArray.asset = this.state.candidateData.assets.value;
        dataArray.account = this.state.candidateData.accounts.value;

        //SAVE CANDIDATE DATA
        fetch(IP + "/candidate/saveCandidate", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataArray)
        }).then(responseJson => responseJson.json())
            .then(res => {
                Alert.alert(
                    'NOTIFICATION!',
                    res,
                    [
                        {
                            text: 'OK',
                            style: 'ok',
                        }
                    ],
                    { cancelable: true },
                );
                let resetFormElements = {};
                if (res == "Saved") {
                    for (let key in candidateData) {
                        resetFormElements = { ...this.state.candidateData };
                        resetFormElements[key].value = "";
                    }
                    this.setState({ isFormValid: false, candidateData: resetFormElements, isBtnClicked: false });
                }
            }).catch(err => {
                this.setState({ isBtnClicked: false });
                alert(err);
            });
    }

    render() {
        let formElementArray = [];
        for (let key in this.state.candidateData) {
            formElementArray.push({
                id: key,
                config: this.state.candidateData[key]
            })
        }

        const renderInput = formElementArray.map((formElement) => (
            <CustomInput
                key={formElement.id}
                label={formElement.config.label}
                placeholder={formElement.config.placeholder}
                value={formElement.config.value}
                required={formElement.config.isValid}
                error={formElement.config.error}
                changeTextInputValueHandler={(val) => this.inputFieldChangeHandler(val, formElement.id)}
            />
        ));
        return (
            <ScrollView>
                <Image
                    source={require("../../../../assets/images/logo.png")}
                    style={Style.image}
                />
                <View>
                    {renderInput}
                    <TouchableOpacity
                        disabled={!this.state.isFormValid}
                        activeOpacity={!this.state.isFormValid ? 1 : 0.1}
                        onPress={this.savecandidateDataHandler}
                    >
                        <Text style={Style.uploadCandidateBtn}>{!this.state.isFormValid ? "Disabled" : "Save Candidate"} </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        )
    }
}

const Style = StyleSheet.create({
    uploadCandidateBtn: {
        color: 'white',
        fontSize: wp('3%'),
        fontWeight: '300',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.8%'),
        textTransform: 'uppercase',
        backgroundColor: 'green',
        borderRadius: 10,
        fontWeight: 'bold',
        marginVertical: wp('3%'),
        marginRight: 20,
        justifyContent: 'center',
        alignContent: 'flex-end',
        alignSelf: 'flex-end'
    },
    image: {
        width: 100,
        height: 150,
        marginTop: 10,
        resizeMode: 'cover',
        alignSelf: 'center',
    }
})
