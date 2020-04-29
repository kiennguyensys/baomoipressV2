import React from "react";
import {
  TabBarBottom
} from "react-navigation";
import {BottomTabBar} from "react-navigation-tabs";
import { View, Text, Dimensions, Platform, Animated, Easing, Image, Button, TouchableOpacity} from "react-native";
import {Icon} from 'react-native-elements';
import logo from '../assets/images/transparent-icon.png';
var { width, height } = Dimensions.get('window');
height = height-20

export default class CustomTabBarBottom extends React.Component {
  constructor(props){
    super(props)
    this.state={
      animating: false,
      left: new Animated.Value(20),
      bottom: new Animated.Value(30),
      bottomCenter: new Animated.Value(30),

    }
  }
  onClickBtn = ()=>{
    this.props.navigation.setParams({ onClickBtn: true })
    this.setState({animating: true,
      left:  new Animated.Value(20),
      bottom: new Animated.Value(30),
      bottomCenter:new Animated.Value(30)})


    setTimeout(() => {
      Animated.timing(this.state.left, {
        toValue: 120,
        duration: 300,
        easing: Easing.linear,
      }).start();

      Animated.timing(this.state.bottom, {
        toValue: 130,
        duration: 300,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.bottomCenter, {
        toValue: 230,
        duration: 300,
        easing: Easing.linear,
      }).start();


    }, 100)



  }

  onCloseBtn = () =>{
    this.props.navigation.setParams({ onClickBtn: false })
    this.setState({animating: false})
  }

  render(){

    var expandedView = (this.state.animating)?
    <View style={{zIndex: 2, position: 'absolute'}}>
          <View style={{borderColor:'#fff', borderWidth:2, width: 50, height: 50, borderRadius: 50/2, bottom: 8, justifyContent:'center'}}>
            <Icon name={"close"} size={45} color={"#fff"} style={styles.buttonIcon} onPress={()=>this.onCloseBtn()}/>
          </View>

    </View> : <View></View>
    return (
      <View
      >
          <View style={styles.actionButton}>
            <View style={{backgroundColor:'#e0272e', width: 50, height: 50, borderRadius: 50/2, bottom: 8, justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity onPress={()=>this.onClickBtn()}>
                <Image
                source={logo}
                style={{ width: 48, height: 48, resizeMode:'contain'}}
                />
              </TouchableOpacity>
            </View>
          </View>
          {expandedView}
      </View>
    );
  }

};

const styles = {
  actionButton: {
    justifyContent: 'center', alignItems: 'center',
    width: 50,
    zIndex: 0,
  },
  buttonIcon: {
    textAlign: "center",
  },
  closeButton:{
    width: 50,
    position: 'absolute',
    bottom: 0
  },
  IconView:{
    backgroundColor:'#CC0000',
     width: 40,
     height:40,
     borderRadius: 40/2,
     justifyContent:'center',

  },
  iconText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  }
}
