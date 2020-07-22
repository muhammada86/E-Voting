import React from 'react';
import { View, FlatList } from 'react-native';
import CustomList from '../CustomList/CustomList';

const search = (props) => {
    let flatList = null;
    if (props.type == "party") {
        flatList = (
            <View>
                <FlatList
                    data={props.data}
                    renderItem={
                        ({ item }) =>
                            <CustomList
                                type={props.type}
                                name={item.Party_Name}
                                symbol={item.Election_Symbol}
                                symbolType={item.symbolType}
                                chairman={item.Chairman}
                                secNA={item.Sector_NA}
                                secPP={item.Sector_PP}
                            />
                    }
                    keyExtractor={item => item.Cnic}
                />
            </View>
        )
    } else if (props.type == "candidate") {
        flatList = (
            <View>
                <FlatList
                    data={props.data}
                    renderItem={
                        ({ item }) =>
                            <CustomList
                                type={props.type}
                                name={item.Name}
                                gender={item.Gender}
                                partyName={item.Party_Name}
                                qualification={item.Qualification}
                                school={item.school}
                                property={item.property}
                                assets={item.asset}
                                accounts={item.account}
                                secNA={item.Sector_NA}
                                secPP={item.Sector_PP}
                            />
                    }
                    keyExtractor={item => item.Cnic}
                />
            </View>
        )
    } else if (props.type == "voter") {
        flatList = (
            <View>
                <FlatList
                    data={props.data}
                    renderItem={
                        ({ item }) =>
                            <CustomList
                                type={props.type}
                                name={item.Name}
                                gender={item.Gender}
                                cnic={item.Cnic}
                                secNA={item.Sector_NA}
                                secPP={item.Sector_PP}
                                address={item.Address}
                            />
                    }
                    keyExtractor={item => item.Cnic}
                />
            </View>
        )
    } else if (props.type == "halqaList") {
        flatList = (
            <View>
                <FlatList
                    data={props.data}
                    renderItem={
                        ({ item }) =>
                            <CustomList
                                type={props.type}
                                name={item.Name}
                                cnic={item.Cnic}
                                gender={item.Gender}
                                symbol={item.Election_Symbol}
                                symbolType={item.symbolType}
                                secNA={item.Sector_NA}
                                secPP={item.Sector_PP}
                            />
                    }
                    keyExtractor={item => item.Cnic}
                />
            </View>
        )
    } else if (props.type == "halqaResult") {
        flatList = (
            <View>
                <FlatList
                    data={props.data}
                    renderItem={
                        ({ item }) =>
                            <CustomList
                                type={props.type}
                                name={item.name}
                                partyName={item.partyName}
                                sector={item.sector}
                                status={item.status}
                                votes={item.votes}
                            />
                    }
                    keyExtractor={item => item.Cnic}
                />
            </View>
        )
    }
    return (
        <View>
            {flatList}
        </View>
    )
}

export default search;