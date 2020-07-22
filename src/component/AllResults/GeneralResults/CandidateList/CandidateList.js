import React, { Component } from 'react';
import { Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import CustomResultList from '../../CustomResultList/CustomResultList';
import styles from '../../../GlobalStyle/GlobalStyle';
import IP from '../../../CONSTANTS/CONSTANTS';


export default class CandidateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: null,
    };
  }

  componentDidMount() {
    const partyId = this.props.navigation.state.params;
    let url = IP + "/candidate/getCandidateByParty?pid=" + partyId.ID + "&sector=" + partyId.type;
    fetch(url)
      .then(responseJson => responseJson.json())
      .then(res => {
        this.setState({ candidates: res });
      }).catch(err => {
        console.log(err);
      }).done();
  }

  goToSingleCandidateHandler = (cnic, sectorNA, sectorPA, pid) => {
    let candidateSector = null;
    const partyId = this.props.navigation.state.params;
    if (partyId.type == "NA") {
      candidateSector = "NA-" + sectorNA;
    } else {
      candidateSector = sectorPA
    }
    const candidateData = {
      pid: pid,
      sector: candidateSector,
      cnic: cnic,
      year: partyId.year
    }
    this.props.navigation.navigate('SingleCandidate', candidateData)
  }
  goBackHandler = () => {
    this.props.navigation.navigate("PartiesList");
  }
  render() {
    let list = <ActivityIndicator size="small" color="green" style={{ marginTop: 240 }} />
    if (this.state.candidates != null) {
      const partyId = this.props.navigation.state.params;
      let i = 0;
      list = this.state.candidates.map(candidate => {
        i++;
        return (
          <CustomResultList
            key={candidate.id}
            goToPartyCandidate={() => this.goToSingleCandidateHandler(candidate.Cnic, candidate.Sector_NA, candidate.Sector_PP, partyId.ID)}
            candidateName={candidate.Name}
            type="candidateList"
            id={i}
          />
        )
      })
    }
    return (
      <ScrollView style={{
        flex: 1,
        flexDirection: 'column'
      }}>
        <TouchableOpacity onPress={this.goBackHandler}>
          <Text style={styles.goBackBtn}>Go BACK</Text>
        </TouchableOpacity>
        <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Candidates List</Text>
        {list}
      </ScrollView >
    );
  }
}
