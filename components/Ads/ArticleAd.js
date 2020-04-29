import CustomArticleAd from './Custom/CustomArticleAd';

import React, { Component } from 'react';

export default class ArtcileAd extends Component {

    render() {
        return <CustomArticleAd ads={this.props.ads} navigation={this.props.navigation} />
    }

}
