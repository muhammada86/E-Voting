import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import IP from '../../CONSTANTS/CONSTANTS';

class ApprovedRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: null,
            loading: true
        };
    }

    componentDidMount() {
        const Obj = this.props.navigation.state.params;
        fetch(IP + "/candidate/getCandidateByStatus?status=" + Obj.approved + "&pid=" + Obj.PID)
            .then(responseJson => responseJson.json())
            .then(res => {
                this.setState({ candidates: res, loading: false });
            }).catch(err => {
                alert(err);
            });
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Approved Candidates'
    })
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
                {
                    !this.state.loading ? <Search data={this.state.candidates} type="candidate" /> :
                        <ActivityIndicator color="green" size="small" style={{ flex: 1, justifyContent: 'center' }} />
                }
            </View>
        );
    }
}

export default ApprovedRequest;
