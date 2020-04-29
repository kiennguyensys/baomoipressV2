import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, Image, TouchableOpacity, Animated} from 'react-native';
import { BaomoiText } from '../StyledText';
import {Icon} from 'react-native-elements';
import { connect } from 'react-redux';
import { updateUserData } from '../../store/actions/sessionActions';
import axios from 'axios';
import { api_url } from '../../constants/API.js';
import FastImage from 'react-native-fast-image';

const defaultImg = 'https://matthewsenvironmentalsolutions.com/images/com_hikashop/upload/thumbnails/400x400/not-available.png'

class AuthorSubscription extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state={
      source : {},
      isSubscribed: false,
      logo: '',
    }
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.user !== prevProps.user ) this.checkSubscription()

    if(this.props.taxonomy_source !=  prevProps.taxonomy_source) this.updateSource()
  }

  componentDidMount() {
      this.cancelTokenSource = axios.CancelToken.source()
      this.updateSource()
  }

  updateSource = () => {
      this.setState({source : this.props.taxonomy_source}, () => this.checkSubscription())

      axios.get(api_url + "get_source_logo",{
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.data)
      .then(json => {
        if(json.length != 0){
          var source_array = json.filter(e => e.title.toUpperCase() === this.state.source.name.toUpperCase())
            if(source_array.length != 0) this.setState({logo : source_array[0].img})

        }
      })
      // .then(json => console.log(json))
      .catch(err => console.log(err))

  }

  onSubscribe = async () => {
    if(this.props.user)
    {
      var bodyFormData = new FormData();
      bodyFormData.append('source', this.state.source.term_id.toString());
      await axios({
          method: 'post',
          url: api_url + 'update_user_subscription',
          data: bodyFormData,
          headers: {'Authorization': 'Bearer ' + this.props.userToken},
        },{
            cancelToken: this.cancelTokenSource.token
        })
            .catch(err => console.log(err))
        this.props.updateUser(this.props.user.id)
    }
  }


  onUnSubscribe = async () => {
      if(this.props.user) {
          var bodyFormData = new FormData();
          bodyFormData.append('source', this.state.source.term_id.toString());
          await axios({
              method: 'post',
              url: api_url + 'delete_user_subscription',
              data: bodyFormData,
              headers: {'Authorization': 'Bearer ' + this.props.userToken},
          },{
              cancelToken: this.cancelTokenSource.token
          })
              .catch(err => console.log(err))

          this.props.updateUser(this.props.user.id)
      }
  }

  checkSubscription = () => {
        if(this.props.user.subscribed && this.props.user.subscribed.includes(this.state.source.term_id.toString())) this.setState({isSubscribed : true})
        else this.setState({isSubscribed : false})
  }

  navigate = () => {
        requestAnimationFrame(() => {
          this.props.navigation.navigate("Source", {
              source: this.state.source
          })
        })
  }

  componentWillUnmount() {

     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }
  render(){


    var icon = (this.state.isSubscribed)?
    <TouchableOpacity style={[styles.IconView, {backgroundColor : 'red'}]} onPress={() => this.onUnSubscribe()}>
      <Icon
        name='user-check'
        type='feather'
        color='white'
        size={20}
      />

    </TouchableOpacity> :
    <TouchableOpacity style={styles.IconView} onPress={() => this.onSubscribe()}>
      <Icon
        name='user-plus'
        type='feather'
        color='red'
        size={20}
      />
    </TouchableOpacity>

    return(
      <View style={styles.container}>

        <TouchableOpacity style={{height: 28 , width: 28, borderRadius: 28/2, alignItems:'center', justifyContent:'center'}} onPress={this.navigate}>
          <FastImage
          source={{uri: this.state.logo || defaultImg}}
          style={{width: 28, height: 28, borderRadius: 28/2, backgroundColor: '#DCDCDC'}}
          resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center'}}onPress={this.navigate}>
        {
          (this.props.onHeader) ? <BaomoiText style={[styles.text,{color: this.props.UI.highLightColor}]}>{this.state.source.name}</BaomoiText>
          : <BaomoiText style={[styles.text,{color: '#C0C0C0'}]}>{this.state.source.name} - {this.props.moment}</BaomoiText>
        }
        </TouchableOpacity>

        {icon}

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex : 1
  },
  text: {
    textAlign: 'left',
    fontSize: 16,
    marginLeft: 5,
  },
  IconView:{
    width: 28,
    height: 28,
    alignItems: 'center',
    borderRadius: 2,
    justifyContent:'center',
    borderColor: 'red',
    borderWidth: 1,
  },
})

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user,
        userToken: state.session.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (id) => {dispatch(updateUserData(id))},
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthorSubscription)


