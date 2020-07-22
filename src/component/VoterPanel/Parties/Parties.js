import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import IP from '../../CONSTANTS/CONSTANTS';


class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parties: null,
            loading: true
        };
    }
    componentDidMount() {
        const sectorObj = this.props.navigation.state.params;
        fetch(IP + "/party/getVoterSectorParties?na=" + sectorObj.sectorNA + "&pa=" + sectorObj.sectorPP)
            .then(responseJson => responseJson.json())
            .then(res => {
                this.setState({ parties: res, loading: false });
            }).catch(err => {
                alert(err);
            });
    }
    static navigationOptions = ({ navigation }) => ({
        title: 'Parties'
    });
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
                {!this.state.loading ? <Search data={this.state.parties} type="party" />
                    :
                    <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} color="green" size="small" />
                }
            </View>
        );
    }
}

export default Party
