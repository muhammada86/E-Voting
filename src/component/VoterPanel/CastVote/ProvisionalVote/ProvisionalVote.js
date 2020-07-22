import React from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Vote from '../Vote';
import CastedVote from '../CastedVote/CastedVote';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
}
  from 'react-native-responsive-screen';
import VotingStatus from '../VotingStatus/VotingStatus';
import IP from '../../../CONSTANTS/CONSTANTS';
class NationalVote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      candidates: null,
      relatedCandidate: false,
      voterCastedCandidateInfo: null,
      voterSectorStatus: null,
      loading: true,
      year: null,
      month: null,
      electionFlags: null,
      monthName: [
        "January",
        "Februry",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    }
  } //CONSTRUCTOR ENDS HERE
  componentDidMount() {
    this.getUserDataHandler();
    this.getElectionFlagsHandler();
    let dateTime = new Date();
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    this.setState({ year: year, month: month })
  }

  getUserDataHandler = async () => {
    const userCNIC = await AsyncStorage.getItem('userCNIC');
    fetch(IP + "/admin/chklogin?cnic=" + userCNIC)
      .then(responseJson => responseJson.json())
      .then(res => {
        const userInfo = { ...res[0] };
        this.setState({ userInfo: userInfo, loading: false });
        if (!this.state.loading) {
          this.checkVoterVoteStatusHandler();
          this.getUserSectorStatus();
          this.getCandidatesHandler();
        }
      });
  }

  getUserSectorStatus = () => {
    fetch(IP + "/voter/getVoterSectorForPA?sectorName=" + this.state.userInfo["Sector_PP"])
      .then(responseJson => responseJson.json())
      .then(res => {
        this.setState({ voterSectorStatus: res });
      }).catch(err => {
        console.log(err);
      }).done();
  }

  checkVoterVoteStatusHandler = () => {
    fetch(IP + "/voter/checkVoterVoteStatus?cnic=" + this.state.userInfo["Cnic"] + "&sector=" + this.state.userInfo["Sector_PP"])
      .then(responseJson => responseJson.json())
      .then(res => {
        if (res == "NULL") {
          this.setState({ castedVoteUser: null })
        } else {
          this.setState({ castedVoteUser: res });
        }
      });
  }

  getCandidatesHandler = () => {
    fetch(IP + "/candidate/getCandidateBySectorPP?Sector_PP=" + this.state.userInfo["Sector_PP"]).then(
      responseJson => (responseJson.json()).then(
        res => {
          this.setState({ candidates: res });
        }
      )
    ).catch(err => {
      alert(err);
    });
  }

  static navigationOptions = {
    title: 'Provisional Vote'
  }

  confirmVoteHandler = (id) => {
    let candidateName = null;
    this.state.candidates.filter((candidate) => {
      if (candidate.Cnic == id) {
        candidateName = candidate.Name;
      }
    })
    Alert.alert(
      'Confirm Your Choice',
      'Cast To ' + candidateName + '?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        { text: 'Vote', onPress: () => this.castVoteHandler(id) },
      ],
      { cancelable: false },
    );
  }

  getElectionFlagsHandler = () => {
    fetch(IP + "/admin/getElectionFlags")
      .then(responseJson => responseJson.json())
      .then(res => {
        const flags = { ...res[0] };
        this.setState({ electionFlags: flags });
      });
  }


  castVoteHandler = (id) => {
    const voterCNIC = this.state.userInfo["Cnic"];
    const VotedcandidateCnic = id;
    let dateTime = new Date();
    let year = this.state.electionFlags.year;
    let month = this.state.electionFlags.month;
    const data = {
      castId: "0",
      candidate_CNIC: VotedcandidateCnic,
      voter_CNIC: voterCNIC,
      Sector_Type: this.state.userInfo["Sector_PP"],
      year: year,
      month: month,
      electionType: this.state.electionFlags.electionType
    }
    //SAVE VOTE CASTED
    fetch(IP + "/admin/saveVoteCasted", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(responseJson => responseJson.json())
      .then(res => {
        if (res != "Already") {
          alert(res);
        } else {
          alert("You have already casted your Vote.");
        }
        this.props.navigation.navigate('CastVote');
      }).catch(err => {
        alert(err);
      });

    //UPDATE VOTER PP VOTE CASTED STATUS

    // fetch("http://172.20.10.3/EvotingAPI/api/voter/updatedVoteCastedPP", {
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(updateVoterInfo)
    // }).then(responseJson => responseJson.json())
    //   .then(res => {
    //     alert(res);
    //     this.props.navigation.navigate('CastVote');
    //   }).catch(err => {
    //     alert(err);
    //   });
  }

  // getuserCastedCandidatehandler = () => {

  //   //VOTE CASTED CANDIDATE

  //   fetch("http://172.20.10.3/EvotingAPI/api/candidate/getVoteCastedCandidate?voterCNIC=" + this.state.userInfo["Cnic"] + "&Sector=PP-" + this.state.userInfo["Sector_PP"])
  //     .then(responseJson => responseJson.json())
  //     .then(res => {
  //       console.log(res);
  //       fetch("http://172.20.10.3/EvotingAPI/api/candidate/getVotedCandidateInfo?cnic=" + res[0]["candidate_CNIC"])
  //         .then(responseJson => responseJson.json())
  //         .then(res => {
  //           const relatedCandidate = { ...res[0] };
  //           this.setState({ voterCastedCandidateInfo: relatedCandidate, relatedCandidate: true });
  //         }).catch(err => {
  //           alert(err);
  //         });
  //     }).catch(err => {
  //       alert(err);
  //     })
  // }

  render() {
    let currentCastingStatus = null;
    let showStartButton = null;
    let voteCastedState = null;
    if (this.state.voterSectorStatus != null && this.state.voterSectorStatus.status == false) {
      currentCastingStatus = (
        <View>
          <Text style={Style.note}>Dear Citizen! There is no voting in your Sector for Provisional Assembly. </Text>
        </View>
      )
    } else if (this.state.electionFlags != null && (this.state.year != this.state.electionFlags.year
      || this.state.month != this.state.electionFlags.month)) {
      currentCastingStatus = (
        <View>
          <Text style={Style.note}>Dear Citizen! The {this.state.electionFlags.electionType == "GE" ? "General Election"
            : "By Election"} in your HALQA are expected to be in {this.state.monthName[this.state.electionFlags.month]} {this.state.electionFlags.year}.</Text>
        </View>
      )
    } else {
      if (this.state.loading && this.state.castedVoteUser == null) {
        currentCastingStatus = <ActivityIndicator size="small" color="green" style={{ flex: 1, marginTop: hp('40%'), justifyContent: 'center' }} />
      }
      else if (this.state.castedVoteUser != null) {
        for (let i = 0; i <= this.state.castedVoteUser.length - 1; i++) {
          if (this.state.castedVoteUser[i].electionType == this.state.electionFlags.electionType) {
            if (this.state.castedVoteUser[i].year == this.state.electionFlags.year &&
              this.state.castedVoteUser[i].month == this.state.electionFlags.month) {
              currentCastingStatus = null;
              showStartButton = null;
              voteCastedState = (
                <CastedVote />
              )
            } else {
              showStartButton = (
                <VotingStatus
                  candidates={this.state.candidates}
                  getCandidates={this.getCandidatesHandler}
                  confirmVote={this.confirmVoteHandler}
                  sectorPP={this.state.userInfo["Sector_PP"]}
                  sectype="PA"
                  electionType={this.state.electionFlags.electionType}
                  electionYear={this.state.electionFlags.year}
                  electionMonth={this.state.electionFlags.month}
                />
              )
            }
          } else {
            showStartButton = (
              <VotingStatus
                candidates={this.state.candidates}
                getCandidates={this.getCandidatesHandler}
                confirmVote={this.confirmVoteHandler}
                sectorPP={this.state.userInfo["Sector_PP"]}
                sectype="PA"
                electionType={this.state.electionFlags.electionType}
                electionYear={this.state.electionFlags.year}
                electionMonth={this.state.electionFlags.month}
              />
            )
          }
        }
      }
      else {
        showStartButton = (
          <VotingStatus
            candidates={this.state.candidates}
            getCandidates={this.getCandidatesHandler}
            confirmVote={this.confirmVoteHandler}
            sectorPP={this.state.userInfo["Sector_PP"]}
            sectype="PA"
            electionType={this.state.electionFlags.electionType}
            electionYear={this.state.electionFlags.year}
            electionMonth={this.state.electionFlags.month}
          />
        )
      }
    }
    return (
      <ScrollView>
        <View style={Style.parentContainer}>
          {showStartButton}
          {voteCastedState}
          {currentCastingStatus}
        </View >
      </ScrollView >
    )
  }
}

const Style = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  voteCastedStateIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center'
  }
})
export default NationalVote;

