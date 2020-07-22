import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
}
  from 'react-native-responsive-screen';
import IP from '../../CONSTANTS/CONSTANTS';
class SearchVoter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voters: null,
      filterVoter: [],
      searchInput: ""
    };
  }
  componentDidMount() {
    fetch(IP + "/voter/getAllVoters")
      .then(responseJson => responseJson.json())
      .then(res => {
        this.setState({ voters: res });
      }).catch(err => {
        alert(err);
      });
  }

  searchVoterHandler = () => {
    let i = 0;
    let input = this.state.searchInput;
    let filtered = [];
    this.state.voters.filter((voter) => {
      if (voter.Cnic == input || voter.Sector_NA == input || voter.Sector_PP == input) {
        filtered[i] = voter;
        i++;
      }
    })

    this.setState({ filterVoter: filtered });
  }

  searchInputHandler = (v) => {
    this.setState({ searchInput: v, searchIconName: "" })
  }

  clearInputTextHandler = () => {
    this.setState({ searchInput: "" });
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Search Voter'
  })

  render() {
    let inputBtnType = null;
    let currentView = null;
    if (this.state.searchInput != "") {
      inputBtnType = (
        <Icon onPress={this.clearInputTextHandler}
          name="close"
          size={wp('6.5%')}
          style={Style.crossIcon}
          color="#2b2b2b" />
      );
    }

    if (this.state.filterVoter == "" && this.state.searchInput != "") {
      currentView = (
        <View>
          <Text style={{ justifyContent: 'center', fontSize: wp('5%'), alignSelf: 'center', }} >No Record Found..!!</Text>
        </View>
      )
    } else if (this.state.searchInput == "") {
      currentView = (
        <Search
          type="voter"
          data={this.state.voters}
        />
      )
    } else {
      currentView = (
        <Search
          type="voter"
          data={this.state.filterVoter == "" ? this.state.voters : this.state.filterVoter}
        />
      )
    }
    return (
      <View>
        {this.state.voters ?
          <View>
            <View style={Style.headerContainer}>
              <Icon
                name="search1"
                size={wp('6%')}
                style={Style.searchIcon}
                color="#2b2b2b" />
              <TextInput
                placeholder="Search Voter"
                placeholderTextColor="black"
                style={Style.Input}
                value={this.state.searchInput}
                onKeyPress={this.searchVoterHandler}
                onChangeText={val => this.searchInputHandler(val)}
              />
              {inputBtnType}
            </View>
            {currentView}
          </View >
          :
          <ActivityIndicator size="large" color="green" />
        }
      </View>
    );
  }
}



const Style = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Input: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#238441',
    paddingHorizontal: 40,
    borderRadius: 10,
    fontSize: 17,
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    top: wp('7.7%'),
    left: wp('6.4%'),
  },
  crossIcon: {
    position: 'absolute',
    top: wp('7%'),
    left: wp('86%'),
  },
})

export default SearchVoter
