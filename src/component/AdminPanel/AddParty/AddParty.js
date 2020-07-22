import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
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
      photo: null,
      symbol: null,
      isBtnClicked: false,
      isFormValid: false,
      partyData: {
        name: {
          isValid: false,
          value: "",
          placeholder: "Party Name",
          error: ""
        },
        chairman: {
          isValid: false,
          value: "",
          placeholder: "Chairman",
          error: ""
        },
        viceChairman: {
          isValid: false,
          value: "",
          placeholder: "Vice Chairman",
          error: ""
        },
        founded: {
          isValid: false,
          value: "",
          placeholder: "Founded",
          error: ""
        },
        abbreviation: {
          isValid: false,
          value: "",
          placeholder: "Abbreviation",
          error: ""
        },
        spokePerson: {
          isValid: false,
          value: "",
          placeholder: "Spoke Person",
          error: ""
        },
        secretaryGeneral: {
          isValid: false,
          value: "",
          placeholder: "Secretary General",
          error: ""
        },
        founder: {
          isValid: false,
          value: "",
          placeholder: "Founder",
          error: ""
        },
        headquarter: {
          isValid: false,
          value: "",
          placeholder: "Headquarter",
          error: ""
        },
        slogan: {
          isValid: false,
          value: "",
          placeholder: "Slogan",
          error: ""
        },
        AdminCNIC: {
          isValid: false,
          value: "",
          placeholder: "Party Admin CNIC",
          error: ""
        },
      }
    };
  }

  uploadImageHandler = () => {
    const options = {
      noData: false
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
      }
    })
  }

  uploadSymbolHandler = () => {
    const options = {
      noData: false
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ symbol: response });
      }
    })
  }
  inputFieldChangeHandler = (val, id) => {
    let updatedFormElements = { ...this.state.partyData };
    updatedFormElements[id].value = val;
    this.setState({ value: updatedFormElements[id].value });
    if (updatedFormElements[id].value == "") {
      updatedFormElements[id].isValid = true;
      updatedFormElements[id].error = updatedFormElements[id].placeholder + " field required";
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
    if (validationState === true && this.state.photo != null && this.state.symbol != null) {
      this.setState({ isFormValid: validationState });
    }
  }

  savepartyDataHandler = () => {
    this.setState({ isBtnClicked: true });
    const partyData = { ...this.state.partyData };
    let i = 0;
    const dataArray = {
      "Party_Name": "",
      "Chairman": "",
      "Vice_Chairman": "",
      "Founded": "",
      "Abbreviation": "",
      "Spokeperson": "",
      "Secretary_General": "",
      "Founder": "",
      "Headquarters": "",
      "Slogan": "",
      "adminCnic": ""
    };


    const getPartyKeys = [];
    for (let key in partyData) getPartyKeys.push(key);
    for (let dataKeys in dataArray) {
      dataArray[dataKeys] = partyData[getPartyKeys[i]].value;
      i++;
    }

    const P_ID = 0;
    const imageData = this.state.photo == null ? "" : this.state.photo.data;
    const logoType = this.state.photo == null ? "" : this.state.photo.type;
    const symbolType = this.state.symbol == null ? "" : this.state.symbol.type;
    const electionSymbolData = this.state.symbol == null ? "" : this.state.symbol.data;
    let finalData = dataArray;
    finalData.P_ID = P_ID;
    finalData.imageData = imageData;
    finalData.imageType = logoType;
    finalData.symbolType = symbolType;
    finalData.Election_Symbol = electionSymbolData;
    //SAVE PARTY DATA
    fetch(IP + "/party/saveParty", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalData)
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
        if (res == "Party Saved Successfully") {
          for (let key in partyData) {
            resetFormElements = { ...this.state.partyData };
            resetFormElements[key].value = "";
          }
          this.setState({ partyData: resetFormElements, photo: null, symbol: null, isBtnClicked: false });
        }
      }).catch(err => {
        this.setState({ isBtnClicked: false });
        alert(err);
      });

  }

  render() {
    let formElementArray = [];
    for (let key in this.state.partyData) {
      formElementArray.push({
        id: key,
        config: this.state.partyData[key]
      })
    }

    const renderInput = formElementArray.map((formElement) => (
      <CustomInput
        key={formElement.id}
        label={formElement.config.placeholder}
        value={formElement.config.value}
        required={formElement.config.isValid}
        error={formElement.config.error}
        changeTextInputValueHandler={(val) => this.inputFieldChangeHandler(val, formElement.id)}
      />
    ));
    return (
      <ScrollView>
        <View>
          <View style={Style.imagesSection}>
            <View>
              {
                this.state.photo != null ?
                  <Image source={{ uri: 'data:' + this.state.photo.type + ';base64,' + this.state.photo.data }} style={Style.imageStyle} /> :
                  <Image source={require('../../../../assets/images/placeholder.png')} style={Style.imageStyle} />
              }
              <TouchableOpacity onPress={this.uploadImageHandler}>
                <Text style={Style.uploadImageBtn}>Upload Logo </Text>
              </TouchableOpacity>
            </View>
            <View>
              {
                this.state.symbol != null ?
                  <Image source={{ uri: 'data:' + this.state.symbol.type + ';base64,' + this.state.symbol.data }} style={Style.imageStyle} /> :
                  <Image source={require('../../../../assets/images/placeholder.png')} style={Style.imageStyle} />
              }
              <TouchableOpacity onPress={this.uploadSymbolHandler}>
                <Text style={Style.uploadImageBtn}>Upload Symbol </Text>
              </TouchableOpacity>
            </View>
          </View>
          {renderInput}
          <TouchableOpacity
            disabled={!this.state.isFormValid}
            activeOpacity={!this.state.isFormValid ? 1 : 0.1}
            onPress={this.savepartyDataHandler}
          >
            <Text style={Style.uploadPartyBtn}>{!this.state.isFormValid ? "Disabled" : "Save Party"} </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}



const Style = StyleSheet.create({
  imageStyle: {
    justifyContent: 'center',
    marginTop: wp('2%'),
    resizeMode: 'contain',
    width: wp('50%'),
    height: hp('15%'),
    alignContent: 'center',
    alignSelf: 'center'
  },
  imagesSection: {
    flex: 10,
    flexDirection: 'row',
  },
  uploadImageBtn: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'green',
    fontSize: wp('3%'),
    marginTop: wp('1%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('3%'),
    width: wp('40%'),
    height: wp('10%'),
    textTransform: 'uppercase',
    borderRadius: 10,
    fontWeight: 'bold'

  },
  uploadPartyBtn: {
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
  }
})
