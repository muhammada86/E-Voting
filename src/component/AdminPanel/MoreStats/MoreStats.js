import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import StatsCell from './StatsCell/StatsCell';


export default class MoreStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Statistics"
    })

    render() {
        const statObj = this.props.navigation.state.params;
        return (
            <ScrollView style={styles.container}>
                <StatsCell
                    totalMaleVoters={statObj.totalMaleVoters}
                    totalFemaleVoters={statObj.totalFemaleVoters}
                    totalCastedVotes={statObj.totalVoteCasted}
                    totalMaleCandidates={statObj.totalMaleCandidates}
                    totalFemaleCandidates={statObj.totalFemaleCandidates}
                    totalNACastedVotes={statObj.totalNACastedVotes}
                    totalPACastedVotes={statObj.totalPACastedVotes}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})