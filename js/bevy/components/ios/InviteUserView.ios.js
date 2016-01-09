/**
 * InviteUserView.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');
var AddedUserItem = require('./../../../user/components/ios/AddedUserItem.ios.js');
var Spinner = require('react-native-spinkit');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var StatusBarSizeIOS = require('react-native-status-bar-size');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var USER = constants.USER;
var CHAT = constants.CHAT;

var InviteUserView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    return {
      toInput: '',
      searching: false,
      searchUsers: [],
      ds: ds.cloneWithRows([]),
      addedUsers: [],
      keyboardSpace: 48
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);
    // listen to chat store events
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
    // populate list with random users for now
    UserActions.search('');
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, (frames) => {

      if (frames.end) {
        this.setState({keyboardSpace: frames.end.height});
      } else {
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }
    });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 48
      });
    });
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, (frames) => {

      if (frames.end) {
        this.setState({keyboardSpace: frames.end.height});
      } else {
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }
    });
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 48
      });
    });
  },

  onSearching() {
    console.log('searching');
    this.setState({
      searching: true
    });
  },

  onSearchError() {
    this.setState({
      searching: false,
      searchUsers: []
    });
  },

  onSearchComplete() {
    var searchUsers = UserStore.getUserSearchResults();
    console.log('search complete, ', searchUsers);
    this.setState({
      searching: false,
      searchUsers: searchUsers,
      ds: this.state.ds.cloneWithRows(searchUsers)
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  onSearchUserSelect(user) {
    var addedUsers = this.state.addedUsers;
    if(_.findWhere(this.state.addedUsers, { _id: user._id }) != undefined) {
      // user already exists
      // remove user from the list
      //addedUsers = _.reject(addedUsers, ($user) => $user._id == user._id);
    } else {
      // add user to list
      addedUsers.push(user);
      // clear text field
      this.setState({
        toInput: ''
      });
    }
    this.setState({
      addedUsers: addedUsers
    });
  },

  onChangeToText(text) {
    if(_.isEmpty(text) && _.isEmpty(this.state.toInput)) {
      // new and old text is empty
      // user probably pressed backspace on an empty field
      // so lets remove an added user if it exists
      var addedUsers = this.state.addedUsers;
      addedUsers.pop();
      this.setState({
        addedUsers: addedUsers
      });
      return;
    }

    // update state
    this.setState({
      toInput: text
    });
    // set search delay
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
  },

  search() {
    UserActions.search(this.state.toInput);
    this.setState({
      searching: true
    });
  },

  onRemoveAddedUser(user) {
    var addedUsers = this.state.addedUsers;
    addedUsers = _.reject(addedUsers, ($user) => $user._id == user._id);
    this.setState({
      addedUsers: addedUsers
    });
  },

  submit() {
    // dont allow for no added users
    if(_.isEmpty(this.state.addedUsers)) {
      return;
    }
    BevyActions.inviteUsers(this.state.addedUsers)
    // call action
    this.props.chatNavigator.pop();
  },

  _renderAddedUsers() {
    var users = [];
    for(var key in this.state.addedUsers) {
      var addedUser = this.state.addedUsers[key];
      users.push(
        <AddedUserItem
          key={ 'addeduser:' + addedUser._id }
          user={ addedUser }
          onRemove={ this.onRemoveAddedUser }
        />
      );
    }
    return users;
  },

  _renderSearchUsers() {
    if(this.state.searching) {
      return (
        <View style={ styles.progressContainer }>
          <Spinner
            isVisible={true}
            size={40}
            type={'Arc'}
            color={'#2cb673'}
          />
        </View>
      );
    } else if(!this.state.searching && _.isEmpty(this.state.searchUsers)) {
      return (
        <View style={ styles.progressContainer }>
          <Text style={ styles.noneFoundText }>
            No Users Found
          </Text>
        </View>
      );
    } else return (
      <ListView
        style={ styles.userList }
        dataSource={ this.state.ds }
        scrollRenderAheadDistance={ 300 }
        removeClippedSubviews={ true }
        initialListSize={ 10 }
        pageSize={ 10 }
        renderRow={(user) => {
          console.log(this.state.addedUsers, user._id);
          return (
            <UserSearchItem
              key={ 'searchuser:' + user._id }
              user={ user }
              onSelect={ this.onSearchUserSelect }
              selected={
                _.findWhere(this.state.addedUsers, { _id: user._id }) != undefined
              }
            />
          );
        }}
      />
    );
  },

  render() {
    var bevy = this.props.activeBevy;
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={ styles.iconButton }
            onPress={ this.goBack }
          >
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </TouchableHighlight>
            <Text style={ styles.title }>
              Add People to { bevy.name }
            </Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.submit }
            >
              <Icon
                name='done'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
          </View>
        </View>
        <View style={ styles.toBar }>
          <Text style={ styles.toText }>
            Search: 
          </Text>
          { this._renderAddedUsers() }
          <TextInput
            ref='ToInput'
            style={ styles.toInput }
            value={ this.state.toInput }
            onChangeText={ this.onChangeToText }
            placeholder=''
            placeholderTextColor='#AAA'
            underlineColorAndroid='#FFF'
          />
        </View>
        { this._renderSearchUsers() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toBar: {
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexWrap: 'wrap',
    paddingTop: 6,
    paddingHorizontal: 10
  },
  toText: {
    color: '#AAA',
    marginRight: 10,
    marginBottom: 6
  },
  toInput: {
    flex: 1,
    height: 36
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noneFoundText: {
    color: '#AAA',
    fontSize: 22
  },
  userList: {
    flex: 1,
  }
});

module.exports = InviteUserView;