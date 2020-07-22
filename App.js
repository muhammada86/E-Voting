import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import GetStarted from './src/component/GetStarted/GetStarted';
import AuthLoading from './src/container/Login/AuthLoading/AuthLoading';
import Login from './src/container/Login/Login';
import OTP from './src/container/Login/OTP/OTP';
import Evoting from './src/container/Evoting/Evoting';
import VoterPanel from './src/container/VoterPanel/Voterpanel';
import CandidatePanel from './src/container/CandidatePanel/Candidate';
import CastVote from './src/component/VoterPanel/CastVote/CastVote';
import Results from './src/container/Results/Results';
import Parties from './src/component/VoterPanel/Parties/Parties';
import Candidates from './src/component/VoterPanel/Candidates/Candidates';
import ProvisonalResults from './src/component/AllResults/ProvisionalResults/ProvisionalResults';
import NationalResults from './src/component/AllResults/NationalResults/NationalResults';
import NationalVote from './src/component/VoterPanel/CastVote/NationalVote/NationalVote';
import ProvisionalVote from './src/component/VoterPanel/CastVote/ProvisionalVote/ProvisionalVote';
import PartyPanel from "./src/container/PartyPanel/PartyPanel";
import AdminPanel from "./src/container/AdminPanel/AdminPanel";
import SearchVoter from './src/component/AdminPanel/SearchVoter/SearchVoter';
import SearchCandidate from './src/component/AdminPanel/SearchCandidate/SearchCandidate';
import ElectionFlags from './src/component/AdminPanel/ElectionFlags/ElectionFlags';
import AddParty from './src/component/AdminPanel/AddParty/AddParty';
import AddCandidate from './src/component/PartyPanel/AddCandidate/AddCandidate';
import PendingCandidate from './src/component/PartyPanel/PendingCandidate/PendingCandidate';
import ApprovedCandidate from './src/component/PartyPanel/ApprovedCandidate/ApprovedCandidate';
import Sector from './src/component/AdminPanel/Sector/Sector';
import PartiesList from './src/component/AllResults/GeneralResults/PartiesList/PartiesList';
import CandidateList from './src/component/AllResults/GeneralResults/CandidateList/CandidateList';
import SingleCandidate from './src/component/AllResults/GeneralResults/SingleCandidate/SingleCandidate';
import OverallStatistics from './src/component/AllResults/OverallStatistics/OverallStatistics';
import MoreStats from './src/component/AdminPanel/MoreStats/MoreStats';
import ApproveCandidate from './src/component/AdminPanel/ApproveCandidate/ApproveCandidate';
import HalqaList from './src/component/CandidatePanel/HalqaList/HalqaList';
import HalqaResult from './src/component/CandidatePanel/HalqaResult/HalqaResult';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { fadeIn, zoomIn, flipY, fromBottom } from 'react-navigation-transitions';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Transition } from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
}
  from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';


//------------------------------------------------------------//
//---------------------ADMIN STACK NAVIGATOR-----------------//
//-----------------------------------------------------------//


const IndividualCandidatesResultStackNavigator = createStackNavigator({
  SingleCandidate: SingleCandidate
}, {
  navigationOptions: {
    headerVisible: false
  },
  headerMode: 'none'
})


const PartyCandidatesResultStackNavigator = createStackNavigator({
  CandidateList: CandidateList,
  SingleCandidate: IndividualCandidatesResultStackNavigator
}, {
  navigationOptions: {
    title: 'Parties'
  },
  headerMode: 'none'
})

const liveCandidateWinnerStackNavigator = createStackNavigator({
  PartiesList: PartiesList,
  CandidateList: PartyCandidatesResultStackNavigator,
  OverallStatistics: OverallStatistics
}, {
  navigationOptions: {
    headerVisible: false
  },
  headerMode: 'none'
});

const liveResultsStackNavigator = createStackNavigator({
  Results: Results,
  PartiesList: liveCandidateWinnerStackNavigator
}, {
  headerBackTitleVisible: true,
  navigationOptions: ({ navigation }) => ({
    title: 'Results',
    headerLeft:
      <Icon
        name={'arrowleft'}
        onPress={() => { navigation.goBack() }}
      />
  })
})

const adminCastVoteStackNavigator = createStackNavigator({
  CastVote: CastVote,
  NationalVote: NationalVote,
  ProvisionalVote: ProvisionalVote
},
  {
    transitionConfig: () => zoomIn(500),
  })

const AdminDashboardStackNavigator = createStackNavigator({
  AdminPanel: AdminPanel,
  MoreStats: MoreStats
}, {
  transitionConfig: () => fromBottom(500)
})

const AdminTabNavigator = createBottomTabNavigator({
  CastVote: {
    screen: adminCastVoteStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Cast Vote',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="key" color="white" size={wp('6%')} />
      )
    },
  },
  AdminDashboard: {
    screen: AdminDashboardStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Dashboard',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="dashboard" color="white" size={wp('6%')} />
      )
    },
  },

  Results: {
    screen: liveResultsStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Overall Results',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="profile" color="white" size={wp('6%')} />
      )
    },
  }
},
  {
    tabBarOptions: {
      activeTintColor: 'black',
      activeBackgroundColor: '#2E944A',
      inactiveBackgroundColor: '#1b5432',
      inactiveTintColor: 'white'
    },
    transitionConfig: () => flipY(500),
  });

const ElectionFlagsStackNavigator = createStackNavigator({
  ElectionFlags: {
    screen: ElectionFlags,
    navigationOptions: ({ navigation }) => ({
      title: 'Election Flags',
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingHorizontal: 15
            }} />
        </TouchableOpacity>
      ),
    })
  }
})

const AdminSearchCandidateStackNavigator = createStackNavigator({
  SearchCandidate: {
    screen: SearchCandidate,
    navigationOptions: ({ navigation }) => ({
      title: 'Search Candidate',
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingHorizontal: 15
            }} />
        </TouchableOpacity>
      ),
    })
  }
})

const AdminAddPartyStackNavigator = createStackNavigator({
  AddParty: {
    screen: AddParty,
    navigationOptions: ({ navigation }) => ({
      title: 'Add Party',
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingHorizontal: 15
            }} />
        </TouchableOpacity>
      ),
    })
  }
});

const AdminApproveCandidateStackNavigator = createStackNavigator({
  SectorSetting: {
    screen: ApproveCandidate,
    navigationOptions: ({ navigation }) => ({
      title: 'Approve Candidate',
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingHorizontal: 15
            }} />
        </TouchableOpacity>
      ),
    })
  }
})

const AdminSectorStackNavigator = createStackNavigator({
  SectorSetting: {
    screen: Sector,
    navigationOptions: ({ navigation }) => ({
      title: 'Halqa Setting',
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingHorizontal: 15
            }} />
        </TouchableOpacity>
      ),
    })
  }
})

const AdminSearchVoterStackNavigator = createStackNavigator({
  SearchVoter: {
    screen: SearchVoter,
    navigationOptions: ({ navigation }) => ({
      title: 'Search Voter',
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingHorizontal: 15
            }} />
        </TouchableOpacity>
      ),
    })
  }
})



const AdminStackNavigator = createStackNavigator({
  AdminTabNavigator: {
    screen: AdminTabNavigator,
    navigationOptions: ({ navigation }) => ({
      title: 'Dashboard',
      headerStyle: {
        height: wp('13%')
      },
      drawerType: 'slide',
      drawerWidth: 500,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu-unfold" size={wp('5%')} color="black"
            style={{
              paddingVertical: 4,
              paddingLeft: 10
            }} />
        </TouchableOpacity>
      ),
    })
  }
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
)

const customDrawerComponentContent = (props) => (
  <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center', }}>
    <View>
      <Image
        style={{
          width: 140,
          height: 140,
          resizeMode: 'contain',
          borderRadius: 75,
          marginHorizontal: 0,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginVertical: 4,
        }}
        source={require("./assets/images/logo.png")}
      />
    </View>
    <DrawerNavigatorItems {...props} />
  </View>
)

const AdminDrawerNavigator = createDrawerNavigator({
  AppTabNavigator: {
    screen: AdminStackNavigator,
    navigationOptions: {
      drawerLabel: 'Dashboard',
      headerStyle: {
        height: wp('9%')
      },
      drawerIcon: ({ tintColor }) => (
        <Icon name="dashboard" size={wp('4%')} color="black" />
      )
    }
  },
  SearchVoter: {
    screen: AdminSearchVoterStackNavigator,
    navigationOptions: {
      drawerLabel: 'Search Voter',
      drawerIcon: ({ tintColor }) => (
        <Icon name="filter" size={wp('4%')} color="black" />
      )
    }
  },
  AdminSearchCandidate: {
    screen: AdminSearchCandidateStackNavigator,
    navigationOptions: {
      drawerLabel: 'Search Candidate',
      drawerIcon: ({ tintColor }) => (
        <Icon name="search1" size={wp('4%')} color="black" />
      )
    }
  },
  PartySection: {
    screen: AdminAddPartyStackNavigator,
    navigationOptions: {
      drawerLabel: 'Add Party',
      drawerIcon: ({ tintColor }) => (
        <Icon name="pluscircle" size={wp('4%')} color="black" />
      )
    }
  },
  Sector: {
    screen: AdminSectorStackNavigator,
    navigationOptions: {
      drawerLabel: 'Halqa Setting',
      drawerIcon: ({ tintColor }) => (
        <Icon name="tool" size={wp('4%')} color="black" />
      )
    }
  },
  ApproveCandidate: {
    screen: AdminApproveCandidateStackNavigator,
    navigationOptions: {
      drawerLabel: 'Approve Candidate',
      drawerIcon: ({ tintColor }) => (
        <Icon name="check" size={wp('4%')} color="black" />
      )
    }
  },

  ElectionFlags: {
    screen: ElectionFlagsStackNavigator,
    navigationOptions: {
      drawerLabel: 'Election Flags',
      drawerIcon: ({ tintColor }) => (
        <Icon name="flag" size={wp('4%')} color="black" />
      )
    }
  }
}, {
  contentComponent: customDrawerComponentContent,
  drawerType: 'front'
})

//------------------------------------------------------------//
//-----------------------PARTY STACK NAVIGATOR---------------//
//-----------------------------------------------------------//

const PartyDashboardStackNavigator = createStackNavigator({
  PartyPanel: PartyPanel,
  SearchCandidate: SearchCandidate,
  ApprovedCandidate: ApprovedCandidate,
  PendingCandidate: PendingCandidate,
  AddCandidate: AddCandidate,
  NationalResults: NationalResults,
  ProvisonalResults: ProvisonalResults
}, {
  transition: (
    <Transition.Together>
      <Transition.Out
        type="slide-bottom"
        durationMs={400}
        interpolation="easeOut"
      />
      <Transition.In type="fade" durationMs={500} />
    </Transition.Together>
  ),
})

// const PartyDashboardStackNavigator = createStackNavigator({
//   PartyPanel: PartyPanel
// }, {
//   transitionConfig: () => fromBottom(500)
// })


const PartyTabNavigator = createBottomTabNavigator({
  CastVote: {
    screen: adminCastVoteStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Cast Vote',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="key" color="white" size={wp('6%')} />
      )
    },
  },
  PartyDashboard: {
    screen: PartyDashboardStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Dashboard',
      headerStyle: {
        height: wp('9%')
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name="dashboard" color="white" size={wp('6%')} />
      )
    },
  },

  Results: {
    screen: liveResultsStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Overall Result',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="profile" color="white" size={wp('6%')} />
      )
    },
  },
},
  {
    tabBarOptions: {
      activeTintColor: 'black',
      activeBackgroundColor: '#2E944A',
      inactiveBackgroundColor: '#1b5432',
      inactiveTintColor: 'white'
    },
    transitionConfig: () => flipY(500)
  });

const PartyStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: PartyTabNavigator,
  }
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  })


//------------------------------------------------------------//
//-------------------VOTER STACK NAVIGATOR-------------------//
//-----------------------------------------------------------//

const CastVoteStackNavigator = createStackNavigator({
  CastVote: CastVote,
  NationalVote: NationalVote,
  ProvisionalVote: ProvisionalVote
},
  {
    transitionConfig: () => zoomIn(500)
  })

const VoterDashboardStackNavigator = createStackNavigator({
  VoterPanel: VoterPanel,
  Parties: Parties,
  Candidates: Candidates,
  NationalResults: NationalResults,
  ProvisonalResults: ProvisonalResults
}, {
  transition: (
    <Transition.Together>
      <Transition.Out
        type="slide-bottom"
        durationMs={400}
        interpolation="easeOut"
      />
      <Transition.In type="fade" durationMs={500} />
    </Transition.Together>
  ),
})


const CandidateDashboardStackNavigator = createStackNavigator({
  CandidatePanel: CandidatePanel,
  HalqaList: HalqaList,
  HalqaResult: HalqaResult,
  Parties: Parties,
  Candidates: Candidates,
  NationalResults: NationalResults,
  ProvisonalResults: ProvisonalResults
}, {
  transition: (
    <Transition.Together>
      <Transition.Out
        type="slide-bottom"
        durationMs={400}
        interpolation="easeOut"
      />
      <Transition.In type="fade" durationMs={500} />
    </Transition.Together>
  ),
})


const CandidateTabNavigator = createBottomTabNavigator({
  CastVote: {
    screen: CastVoteStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Cast Vote',
      headerStyle: {
        height: wp('9%')
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name="key" color="white" size={wp('6%')} />
      )
    },
  },
  Dashboard: {
    screen: CandidateDashboardStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Dashboard',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="dashboard" color="white" size={wp('6%')} />

      )
    },
  },

  Results: {
    screen: liveResultsStackNavigator,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Overall Results',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="profile" color="white" size={wp('6%')} />
      )
    })
  },
},
  {
    tabBarOptions: {
      activeTintColor: 'black',
      activeBackgroundColor: '#2E944A',
      inactiveBackgroundColor: '#1b5432',
      inactiveTintColor: 'white'
    },
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  });

const CandidateStackNavigator = createStackNavigator({
  CandidateTabNavigator: {
    screen: CandidateTabNavigator,
  }
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  })

const VoterTabNavigator = createBottomTabNavigator({
  CastVote: {
    screen: CastVoteStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Cast Vote',
      headerStyle: {
        height: wp('9%')
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name="key" color="white" size={wp('6%')} />
      )
    },
  },
  Dashboard: {
    screen: VoterDashboardStackNavigator,
    navigationOptions: {
      tabBarLabel: 'Dashboard',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="dashboard" color="white" size={wp('6%')} />

      )
    },
  },

  Results: {
    screen: liveResultsStackNavigator,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Overall Results',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="profile" color="white" size={wp('6%')} />
      )
    })
  },
},
  {
    tabBarOptions: {
      activeTintColor: 'black',
      activeBackgroundColor: '#2E944A',
      inactiveBackgroundColor: '#1b5432',
      inactiveTintColor: 'white'
    },
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  });


const VoterStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: VoterTabNavigator,
  }
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
)
//------------------------------------------------------------//
//-------------------------ROOT STACK NAVIGATOR---------------//
//-----------------------------------------------------------//

const RootNavigator = createSwitchNavigator({
  GetStarted: GetStarted,
  AuthLoading: AuthLoading,
  Login: Login,
  OTP: OTP,
  Evoting: Evoting,
  VoterPanel: VoterStackNavigator,
  PartyPanel: PartyStackNavigator,
  AdminPanel: AdminDrawerNavigator,
  CandidatePanel: CandidateStackNavigator
}, {
  transitionConfig: () => fadeIn(1000),
})

export default createAppContainer(RootNavigator);

