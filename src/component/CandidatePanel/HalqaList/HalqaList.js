import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import IP from '../../CONSTANTS/CONSTANTS';

export default class HalqaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectors: null,
            loading: true
        };
    }
    componentDidMount() {
        const obj = this.props.navigation.state.params;
        fetch(IP + "/candidate/getCandidateSectorsList?CNIC=" + obj.CNIC).then(responseJson => responseJson.json()).then(
            res => {
                this.setState({ sectors: res, loading: false });
            }
        ).catch(err => {
            alert(err);
        }).done();
    }
    static navigationOptions = ({ navigation }) => ({
        title: "Halqa List"
    })
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
                {!this.state.loading ? <Search data={this.state.sectors} type="halqaList" />
                    :
                    <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} color="green" size="small" />
                }
            </View>
        );
    }
}
