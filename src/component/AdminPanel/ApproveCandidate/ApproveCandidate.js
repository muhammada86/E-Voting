import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import CustomList from '../../CustomList/CustomList';
import IP from '../../CONSTANTS/CONSTANTS';
export default class ApproveCandidate extends Component {
    constructor(props) {
        super(props);
        this.getCandidateToApproveHandler();
        this.state = {
            candidates: null,
            loading: true
        };
    }

    getCandidateToApproveHandler = () => {
        fetch(IP + "/candidate/getAllCandidatesToApprove")
            .then(responseJson => responseJson.json())
            .then(res => {
                this.setState({ candidates: res, loading: false });
            }).catch(err => {
                alert(err);
            });
    }

    changeCandidateStatusHandler = (id, status) => {
        const data = {
            status: status,
            CNIC: id
        }
        fetch(IP + "/candidate/updateCandidateStatus", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(responseJson => responseJson.json())
            .then(res => {
                if (res == "Updated") {
                    alert("Candidate State Updated Successfully");
                    this.setState({ loading: true });
                    this.getCandidateToApproveHandler();
                } else {
                    alert("Sorry, There is an error! Try Again Later");
                }
            }).catch(err => {
                alert(err);
            });
    }

    render() {
        let candidateData = null;
        let i = 0;
        if (!this.state.loading) {
            candidateData = this.state.candidates.map((cand, index) => {
                i++;
                return (
                    <CustomList
                        key={index}
                        cnic={cand.Cnic}
                        changeCandidateStatusToApproved={() => this.changeCandidateStatusHandler(cand.Cnic, "A")}
                        changeCandidateStatusToRejected={() => this.changeCandidateStatusHandler(cand.Cnic, "R")}
                        type="ApproveCandidate"
                        name={cand.Name}
                        gender={cand.Gender}
                        partyName={cand.Party_Name}
                        qualification={cand.Qualification}
                        school={cand.school}
                        property={cand.property}
                        assets={cand.asset}
                        accounts={cand.account}
                        secNA={cand.Sector_NA}
                        secPP={cand.Sector_PP}
                    />
                )
            })
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {this.state.loading ?
                    <ActivityIndicator color="green" size="small" />
                    :
                    <ScrollView>
                        <View>
                            <Text
                                style={{ padding: 10, fontWeight: 'bold', fontStyle: 'italic', fontSize: 15 }}
                            >Total Records to update are : {i}</Text>
                        </View>
                        {candidateData}
                    </ScrollView>
                }
            </View>
        );
    }
}
