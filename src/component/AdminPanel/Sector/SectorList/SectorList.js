import React from 'react';
import { View, Text, Switch } from "react-native";

const sectorList = props => {
    let sectorLabel = null;
    if (
        props.sectorName.startsWith('PK') || props.sectorName.startsWith('PS') ||
        props.sectorName.startsWith('PP') || props.sectorName.startsWith('PB')) {
        sectorLabel = props.sectorName;
    } else {
        sectorLabel = "NA-" + props.sectorName;
    }
    return (
        <View>
            <View style={{ flex: 10, marginTop: 15 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{props.num}-  {sectorLabel}{props.status == true ? ' (ON)' : ' (OFF)'}</Text>
            </View>
            <View>
                <Switch
                    value={props.status}
                    onValueChange={props.switchValue}
                />
            </View>
        </View>
    )
}

export default sectorList;