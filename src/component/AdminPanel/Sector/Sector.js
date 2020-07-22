import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Switch } from 'react-native';
import SectorList from "./SectorList/SectorList";
import IP from '../../CONSTANTS/CONSTANTS';

export default class Sector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectors: null,
            UpdateAll: true
        };
    }
    componentDidMount() {
        fetch(IP + '/admin/getSectors')
            .then(responseJson => responseJson.json())
            .then(res => {
                this.setState({ sectors: res });
            }).catch(err => {
                alert(err);
            }).done();
    }

    updateAllSectorHandler = (value) => {
        this.setState({ UpdateAll: value });
        const data = {
            status: value
        }
        fetch(IP + '/admin/updateAllSectorFlags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(resJson => resJson.json())
            .then(res => {
                if (res == "Updated") {
                    this.componentDidMount();
                } else {
                    console.log(res);
                }
            }).catch(err => {
                console.log(err);
            }).done();
    }

    switchValueHandler = (id) => {
        const updatedSectors = { ...this.state.sectors };
        const data = {
            sectorName: updatedSectors[id].sectorName,
            status: !this.state.sectors[id].status
        }
        fetch(IP + '/admin/saveSectorStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(resJson => resJson.json())
            .then(res => {
                if (res == "Updated")
                    this.componentDidMount();
            }).catch(err => {
                console.log(err);
            }).done();
    }
    render() {
        let sectorSwitches = null;
        if (this.state.sectors != null) {
            sectorSwitches = (
                this.state.sectors.map((sector, index) => (
                    <SectorList
                        key={index}
                        num={index + 1}
                        sectorName={sector.sectorName}
                        status={sector.status}
                        switchValue={() => this.switchValueHandler(index)}
                    />
                ))
            )
        } else {
            sectorSwitches = (
                <ActivityIndicator
                    size="large"
                    color="green"
                    style={{
                        flex: 1,
                    }}
                />
            )
        }
        return (
            <View style={{ marginTop: 20, padding: 10, flex: 1 }}>
                {this.state.sectors ?
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase' }}>Update ALL Sectors ({this.state.UpdateAll ? "ON" : "OFF"})</Text>
                        <Switch
                            value={this.state.UpdateAll}
                            onValueChange={() => this.updateAllSectorHandler(!this.state.UpdateAll)}
                        />
                    </View>
                    : null
                }
                {sectorSwitches}
            </View>
        );
    }
}