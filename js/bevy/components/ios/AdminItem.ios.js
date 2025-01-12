/**
 * AdminItem.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  ActionSheetIOS,
  TouchableOpacity
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var UserStore = require('./../../../user/UserStore');

var AdminItem = React.createClass({
  propTypes: {
    admin: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Cancel',
        'View ' + this.props.admin.displayName + "'s Profile"
      ],
      cancelButtonIndex: 0
    }, buttonIndex => {
      switch(buttonIndex) {
        case 1:
          this.goToProfile();
          break;
      }
    })
  },

  goToProfile() {
    var route = {
      name: routes.MAIN.PROFILE,
      profileUser: this.props.admin
    };
    this.props.mainNavigator.push(route);
  },

  render() {
    var adminImageSource = UserStore.getUserImage(this.props.admin.image, 64, 64);

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.container }
        onPress={ this.showActionSheet }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={ adminImageSource }
          />
          <Text style={ styles.name }>
            { this.props.admin.displayName }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    marginRight: 15
  }
});

module.exports = AdminItem;
