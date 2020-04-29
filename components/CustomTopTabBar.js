import { ScrollView, View, TouchableOpacity, Animated, Text, Platform, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import axios from 'axios';
import { api_url } from '../constants/API';

const Tab = ({ title, onPress, focused }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.tabView, focused ? styles.activeView : styles.inactive]}>
        <Text style={focused ? styles.activeText : styles.inactive}>{title.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  )
}

class CustomTopTabBar extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          menus: []
      }
  }

  componentDidMount() {
      this.cancelTokenSource = axios.CancelToken.source()
      this.getMenus()
  }

  getMenus = async() => {
      const menus = JSON.parse(await AsyncStorage.getItem('tabTitles'))
      this.setState({ menus: menus })
  }

  render(){
    const { navigationState, descriptors, navigation } = this.props
    return (
        <View style={{ height: 50 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={[styles.scrollView, {
                  backgroundColor: this.props.UI.backgroundColor
              }]}>

              <Tab
                title={"Trang chủ"}
                onPress={() => navigation.navigate("HomeScreen")}
                focused={navigationState.index === 0 }
              />

              {this.state.menus.map((route, index) => {
                return (
                  <Tab
                    title={route}
                    onPress={() => navigation.navigate("Tab" + index.toString())}
                    focused={(navigationState.index - 1) === index }
                    key={index}
                  />
                )
              })}

            </ScrollView>
        </View>
    )
  }
}

const styles = {
    scrollView: {
        borderBottomWidth: (Platform.OS == 'ios') ? 1 : 0,
        borderColor: '#e0e0e0',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    tabView: {
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeText: {
        color: 'red',
        fontSize: 14,
    },
    activeView: {
        borderBottomColor: 'red',
        borderBottomWidth: 2.5
    },
    inactive: {
        color: "#9c9c9c",
        fontSize: 14,
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(CustomTopTabBar)