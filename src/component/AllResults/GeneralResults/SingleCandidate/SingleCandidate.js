import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import CustomResultList from '../../CustomResultList/CustomResultList';
import styles from '../../../GlobalStyle/GlobalStyle';
import IP from '../../../CONSTANTS/CONSTANTS';
export default class SingleCandidate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidateResult: null,
            response: false
        };
    }
    componentDidMount() {
        const candidateInfo = this.props.navigation.state.params;
        let url = IP + "/result/getPartyCandidateStatus?sector=" + candidateInfo.sector + "&cnic=" + candidateInfo.cnic + "&year=" + candidateInfo.year;
        fetch(url)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (res == "No Record Found") {
                    this.setState({ response: true });
                } else {
                    this.setState({ candidateResult: res[0] });
                }
            }).catch(err => {
                alert(err);
            }).done();
    }

    goBackHandler = () => {
        this.props.navigation.navigate("CandidateList");
    }
    render() {
        let result = <ActivityIndicator size="small" color="green" style={{ marginTop: 250 }} />;
        if (this.state.response === true) {
            result = <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 30, alignSelf: 'center' }}>No Record Found Against Candidate</Text>
        } else if (this.state.candidateResult != null) {
            result = (
                <CustomResultList
                    name={this.state.candidateResult.name}
                    votes={this.state.candidateResult.votes}
                    sector={this.state.candidateResult.sector}
                    status={this.state.candidateResult.status}
                    type="singleCandidateList"
                />
            )
        }
        return (
            <View>
                <TouchableOpacity onPress={this.goBackHandler}>
                    <Text style={styles.goBackBtn}>Go BACK</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Candidate Result</Text>
                {result}
            </View >
        );
    }
}
