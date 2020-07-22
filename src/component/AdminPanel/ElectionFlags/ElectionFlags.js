import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
}
  from 'react-native-responsive-screen';
import IP from '../../CONSTANTS/CONSTANTS';
export default class ElectionFlags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionType: "GE",
      month: 1,
      year: 2020,
      date: 1
    };
  }

  saveElectionTypeChangedHandler = () => {
    const data = {
      id: 0,
      electionType: this.state.electionType,
      month: this.state.month,
      year: this.state.year,
      date: this.state.date
    }
    fetch(IP + "/admin/saveElectionFlags", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(responseJson => responseJson.json())
      .then(response => {
        alert("Successfully " + response + " Election Type");
      }).then(err => {
        if (err != undefined) {
          alert("Error Updating Election Type, Try Again!");
        } else {
          console.log(err);
        }
      }).done();
  }

  render() {
    return (
      <View style={Style.container}>
        <View style={Style.header}>
          <Text style={Style.text}> Update Election Type </Text>
        </View>
        <View style={Style.body}>
          <Text style={Style.text}>Election Type</Text>
          <Picker
            selectedValue={this.state.electionType}
            style={{ height: 50, width: '100%', borderColor: "green", alignSelf: 'center', color: "green" }}
            onValueChange={(itemValue, itemIndex) => this.setState({ electionType: itemValue })}>
            <Picker.Item label="General Election" value="GE" />
            <Picker.Item label="By Election" value="BP" />
          </Picker>

          <Text style={Style.text}>Election Year</Text>
          <Picker
            selectedValue={this.state.year}
            style={{ height: 50, width: '100%', borderColor: "green", alignSelf: 'center', color: "green" }}
            onValueChange={(itemValue, itemIndex) => this.setState({ year: itemValue })}>
            <Picker.Item label="2020" value="2020" />
            <Picker.Item label="2021" value="2021" />
            <Picker.Item label="2022" value="2022" />
            <Picker.Item label="2023" value="2023" />
            <Picker.Item label="2024" value="2024" />
            <Picker.Item label="2025" value="2025" />
            <Picker.Item label="2026" value="2026" />
            <Picker.Item label="2027" value="2027" />
            <Picker.Item label="2028" value="2028" />
            <Picker.Item label="2029" value="2029" />
            <Picker.Item label="3030" value="3030" />
          </Picker>

          <Text style={Style.text}>Election Month</Text>
          <Picker
            selectedValue={this.state.month}
            style={{ height: 50, width: '100%', borderColor: "green", alignSelf: 'center', color: "green" }}
            onValueChange={(itemValue, itemIndex) => this.setState({ month: itemValue })}>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="11" value="11" />
            <Picker.Item label="12" value="12" />
          </Picker>

          <Text style={Style.text}>Election Date</Text>
          <Picker
            selectedValue={this.state.date}
            style={{ height: 50, width: '100%', borderColor: "green", alignSelf: 'center', color: "green" }}
            onValueChange={(itemValue, itemIndex) => this.setState({ date: itemValue })}>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="11" value="11" />
            <Picker.Item label="12" value="12" />
            <Picker.Item label="13" value="13" />
            <Picker.Item label="14" value="14" />
            <Picker.Item label="15" value="15" />
            <Picker.Item label="16" value="16" />
            <Picker.Item label="17" value="17" />
            <Picker.Item label="18" value="18" />
            <Picker.Item label="19" value="19" />
            <Picker.Item label="20" value="20" />
            <Picker.Item label="21" value="21" />
            <Picker.Item label="22" value="22" />
            <Picker.Item label="23" value="23" />
            <Picker.Item label="24" value="24" />
            <Picker.Item label="25" value="25" />
            <Picker.Item label="26" value="26" />
            <Picker.Item label="27" value="27" />
            <Picker.Item label="28" value="28" />
            <Picker.Item label="29" value="29" />
            <Picker.Item label="30" value="30" />
            <Picker.Item label="31" value="31" />
          </Picker>

          <TouchableOpacity style={{ alignSelf: 'center', marginTop: 40 }} onPress={this.saveElectionTypeChangedHandler}>
            <Text style={Style.saveBtn} >Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const Style = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    padding: 10
  },
  body: {
    flex: 15,
    width: wp('90%'),
    alignSelf: 'center'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  saveBtn: {
    width: wp('30%'),
    paddingHorizontal: 30,
    paddingVertical: 18,
    textTransform: 'uppercase',
    height: hp('7.5%'),
    fontSize: wp('3.3%'),
    letterSpacing: 5,
    fontWeight: 'bold',
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: '#258441',
    color: 'white'
  }
})
