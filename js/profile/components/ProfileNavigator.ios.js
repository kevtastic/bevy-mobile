/**
 * ProfileNavigator.js
 * kevin made this
 * all the sheiks in the world should be banished
 */
'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  Navigator
} = React;

var UserView = require('./UserView.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');

var routes = require('./../../routes');

var ProfileView = React.createClass({
  propTypes: {
    profileRoute: React.PropTypes.object,
    profileNavigator: React.PropTypes.object
  },

  render: function() {

    var view;
    switch(this.props.profileRoute.name) {
      case 'UserView':
      default:
        view = (
          <UserView
            { ...this.props }
          />
        );
        break;
    }

    return (
      <View style={{ flex: 1 }}>
        <Navbar 
          profileRoute={ this.props.profileRoute }
          profileNavigator={ this.props.profileNavigator }
          center='Profile'
          { ...this.props }
        />
        { view }
      </View>
    );
  }
});

var ProfileNavigator = React.createClass({
  render: function () {
    return (
      <Navigator
        navigator={ this.props.navigator }
        initialRoute={ routes.PROFILE.USER }
        initialRouteStack={ _.toArray(routes.PROFILE) }
        renderScene={(route, navigator) => 
          <ProfileView
            profileRoute={ route }
            profileNavigator={ navigator }
            { ...this.props }
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB673'
  },
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navbarText: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  left: {
    height: 32,
    width: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    height: 64,
    width: 32,
  }
});

module.exports = ProfileNavigator;