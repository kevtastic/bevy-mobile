/**
 * MainTabBar.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  StatusBarIOS,
  TabBarIOS,
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var BevyNavigator = require('./../../../bevy/components/ios/BevyNavigator.ios.js');
var ChatNavigator = require('./../../../chat/components/ios/ChatNavigator.ios.js');
var MyBevies = require('./../../../bevy/components/ios/MyBevies.ios.js');
var NotificationView =
  require('./../../../notification/components/ios/NotificationView.ios.js');
var SettingsView = require('./../../../settings/components/ios/SettingsView.ios.js');
var SearchView = require('./SearchView.ios.js');

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var NotificationStore = require('./../../../notification/NotificationStore');
var BevyStore = require('./../../../bevy/BevyStore');
var BEVY = constants.BEVY;

var tabs = {
  Bevies: 'BevyNavigator',
  Chat: 'ChatNavigator',
  Notifications: 'NotificationNavigator',
  More: 'SettingsNavigator',
  Search: 'SearchView'
};

var MainTabBar = React.createClass({
  getInitialState() {
    return {
      selectedTab: tabs.Bevies,
    };
  },

  switchTab(tabName) {
    this.setState({
      selectedTab: tabs[tabName]
    });
  },

  _renderContent() {

    var tabBarActions = {
      switchTab: this.switchTab
    };

    switch(this.state.selectedTab) {
      case tabs.Bevies:
        return (
          <MyBevies
            { ...this.props }
            bevyNavigator={ this.props.bevyNavigator }
            tabBarActions={ tabBarActions }
          />
        );
        break;
      case tabs.Chat:
        return (
          <ChatNavigator
            { ...this.props }
            tabBarActions={ tabBarActions }
          />
        );
        break;
      case tabs.Notifications:
        return (
          <NotificationView
            { ...this.props }
            tabBarActions={ tabBarActions }
          />
        );
        break;
      case tabs.More:
        return (
          <SettingsView
            { ...this.props }
            tabBarActions={ tabBarActions }
          />
        );
      case tabs.Search:
        return (
          <SearchView
            {...this.props}
            tabBarActions={ tabBarActions }
          />
        )
        break;
    }
  },

  render() {
    return (
        <TabBarIOS
          tintColor='#2cb673'
          barTintColor='#FFF'
          translucent={ false }
        >
          <Icon.TabBarItem
            title='Home'
            iconName='android-home'
            selectedIconName='android-home'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Bevies }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Bevies,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Search'
            iconName='android-search'
            selectedIconName='android-search'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Search }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Search,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Chat'
            iconName='android-textsms'
            selectedIconName='android-textsms'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Chat }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Chat,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Notifications'
            iconName='android-notifications'
            selectedIconName='android-notifications'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Notifications }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Notifications,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='More'
            iconName='android-more-horizontal'
            selectedIconName='android-more-horizontal'
            size={ 28 }
            color='rgba(0,0,0,.3)'
            selected={ this.state.selectedTab === tabs.More }
            onPress={() => {
              this.setState({
                selectedTab: tabs.More,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
        </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
  tabBar: {
    height: 48,
    width: constants.width
  },
  tabIcon: {
  }
});

module.exports = MainTabBar;
