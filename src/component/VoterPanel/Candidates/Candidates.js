import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import IP from '../../CONSTANTS/CONSTANTS';

class Candidate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: null,
            loading: true
        };
    }
    componentDidMount() {
        const sectorObj = this.props.navigation.state.params;
        fetch(IP + "/candidate/getVoterSectorCandidate?na=" + sectorObj.sectorNA + "&pa=" + sectorObj.sectorPP)
            .then(responseJson => responseJson.json())
            .then(res => {
                this.setState({ candidates: res, loading: false });
            }).catch(err => {
                alert(err);
            });
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Candidates'
    })

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
                {
                    !this.state.loading ? <Search data={this.state.candidates} type="candidate" /> :
                        <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} color="green" size="small" />
                }
            </View>
        );
    }
}

export default Candidate
