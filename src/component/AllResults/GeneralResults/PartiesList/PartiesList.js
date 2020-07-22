import React, { Component } from 'react';
import { Text, View, ActivityIndicator, ScrollView, Picker } from 'react-native';
import CustomResultList from '../../CustomResultList/CustomResultList';
import IP from '../../../CONSTANTS/CONSTANTS';

export default class PartiesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parties: null
    };
  }
  componentDidMount() {
    fetch(IP + "/party/getAllParties")
      .then(responseJson => responseJson.json())
      .then(res => {
        this.setState({ parties: res });
      }).catch(err => {
        alert(err);
      }).done();
  }

  goToPartyCandidatesResults = (id) => {
    const sectorType = this.props.navigation.state.params;
    const partyData = {
      ID: id,
      type: sectorType.type,
      year: sectorType.year
    }
    this.props.navigation.navigate('CandidateList', partyData);
  }


  render() {
    let list = <ActivityIndicator size="small" color="green" style={{ flex: 1, justifyContent: 'center', marginTop: 250 }} />
    if (this.state.parties) {
      let i = 0;
      list = this.state.parties.map(party => {
        i++;
        return (
          <CustomResultList
            key={party.P_ID}
            goToPartyCandidatesResults={() => this.goToPartyCandidatesResults(party.P_ID)}
            partyName={party.Abbreviation}
            type="partyList"
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
        <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Parties List</Text>
        {list}
      </ScrollView >
    );
  }
}
