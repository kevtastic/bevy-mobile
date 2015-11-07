/**
 * PostView.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var SideMenu = require('react-native-side-menu');
var ChatView = require('./ChatView.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');
var ThreadList = require('./ThreadList.ios.js');
var ChatStore = require('./../ChatStore');

var _ = require('underscore');
var routes = require('./../../routes');

var ChatNavigator = React.createClass({

  propTypes: {
    allThread: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    return {
      navbarText: 'Chat'
    }
  },

  setNavbarText(text) {
    this.setState({
      navbarText: text
    });
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRoute={ routes.CHAT.LISTVIEW }
        initialRouteStack={[
          routes.CHAT.LISTVIEW
        ]}
        renderScene={(route, navigator) => {
          var view;
          switch(route.name) {
            case routes.CHAT.LISTVIEW.name:
            default:
              view = (
                <ThreadList 
                  { ...this.props }
                  chatNavigator={ navigator }
                />
              );
              break;
            case routes.CHAT.CHATVIEW.name:
              view = (
                <ChatView
                  {...this.props }
                  chatNavigator={ navigator }
                />
              )
              break;
          }

          var navbarText = 'Chat';
          if(!_.isEmpty(this.props.activeThread)) {
            if(!_.isEmpty(this.props.activeThread.bevy)) {
              // bevy chat
              navbarText = this.props.activeThread.bevy.name + "'s Chat";
            } else {
              // PM
              navbarText = ChatStore.getThreadName(this.props.activeThread._id);
            }
          }
          if(route.name == routes.CHAT.LISTVIEW.name) {
            navbarText = 'Chat'
          }
          if(navbarText.length > 30) {
            navbarText = navbarText.substr(0,30);
            navbarText = navbarText.concat('...');
          }

          var backButton = (route.name != routes.CHAT.CHATVIEW.name)
          ? <View />
          : <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={() => {
                navigator.pop();
              }} 
              style={ styles.backButtonContainer } 
            >
              <View style={ styles.backButton }>
                <Icon
                  name='ios-arrow-left'
                  size={ 30 }
                  color={ 'rgba(0,0,0,.3)' }
                  style={ styles.backButtonIcon }
                />
              </View>
            </TouchableOpacity>;

          var infoButton = (route.name != routes.CHAT.CHATVIEW.name)
          ? <View/>
          : <TouchableOpacity
              activeOpacity={.5}
              onPress={{}}
              style={{marginRight: 10, height: 39, width: 39, alignItems: 'center', justifyContent: 'center'}}
            >
              <Icon
                name='ios-information'
                size={30}
                color="rgba(0,0,0,0.3)"
              />
            </TouchableOpacity>;

          return (
            <View style={{ flex: 1, backgroundColor: '#eee'}}>
              <Navbar 
                chatRoute={ route }
                chatNavigator={ navigator }
                left={ backButton }
                center={ navbarText }
                right={infoButton}
                { ...this.props }
              />
              { view }
            </View>
          );
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 39,
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: 5
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  backButtonIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
    height: 30
  },
  backButtonText: {
    fontSize: 15
  }
});

module.exports = ChatNavigator;
