/**
 * BevyBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
} = React;

var TabBar = require('./TabBar.ios.js');
var Menu = require('./Menu.ios.js');
var SideMenu = require('react-native-side-menu');
var PostList = require('./PostList.ios.js');
var Button = require('react-native-button');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 0,
  },
  menuContainer: {
    backgroundColor: '#111111',
  }
})

var InBevy = React.createClass({

  render: function () {
      var menu = <Menu />;

      return (
        <View style={styles.container}>
          <SideMenu menu={menu} disableGestures={true}>
            <PostList/>
          </SideMenu>
          <TabBar/>
        </View>
      );
    }
});

module.exports = InBevy;
