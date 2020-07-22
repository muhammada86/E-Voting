import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp
}
  from 'react-native-responsive-screen';
import IP from '../../CONSTANTS/CONSTANTS';
class SearchCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: null,
      filterCandidates: [],
      searchInput: "",
    };
  }
  componentDidMount() {
    const obj = this.props.navigation.state.params;
    let url = "";
    if (obj.type == "party") {
      url = IP + "/candidate/searchCandidateByParty?pid= " + obj.PID;
    } else {
      url = IP + "/candidate/getAllCandidates";
    }
    fetch(url)
      .then(responseJson => responseJson.json())
      .then(res => {
        this.setState({ candidates: res });
      }).catch(err => {
        alert(err);
      });
  }
  searchCandidateHandler = () => {
    let i = 0;
    let input = this.state.searchInput;
    let filtered = [];
    this.state.candidates.filter((candidate) => {
      if (candidate.Cnic == input || candidate.Sector_NA == input || candidate.Sector_PP == input) {
        filtered[i] = candidate;
        i++;
      }
    })
    this.setState({ filterCandidates: filtered });
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Candidates'
  })

  searchInputHandler = (v) => {
    this.setState({ searchInput: v, searchIconName: "" })
  }

  clearInputTextHandler = () => {
    this.setState({ searchInput: "" });
  }

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

    if (this.state.filterCandidates == "" && this.state.searchInput != "") {
      currentView = (
        <View>
          <Text style={{ fontSize: wp('5%'), justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>No Record Found..!!</Text>
        </View >
      )
    } else if (this.state.searchInput == "") {
      currentView = (
        <Search
          type="candidate"
          data={this.state.candidates}
        />
      )
    } else {
      currentView = (
        <Search
          type="candidate"
          data={this.state.filterCandidates == "" ? this.state.candidates : this.state.filterCandidates}
        />
      )
    }
    return (
      <View>
        {this.state.candidates ?
          <View>
            <View style={Style.headerContainer}>
              <Icon
                name="search1"
                size={wp('6%')}
                style={Style.searchIcon}
                color="#2b2b2b" />
              <TextInput
                placeholder="Search Candidate"
                placeholderTextColor="black"
                style={Style.Input}
                value={this.state.searchInput}
                onKeyPress={this.searchCandidateHandler}
                onChangeText={val => this.searchInputHandler(val)}
              />
              {inputBtnType}
            </View>
            {currentView}
          </View >
          :
          <ActivityIndicator size="small" color="green" />
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

export default SearchCandidate
