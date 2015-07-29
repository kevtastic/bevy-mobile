/*
* BevyInfoView.ios.js
* Kevin made this. 
* guess who just crawled out the muck or mire
*/
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  View,
  Image,
  SwitchIOS,
  TouchableOpacity,
} = React;
var {
  Icon
} = require('react-native-icons');

var _ = require('underscore');
var constants = require('./../../constants.js');
var routes = require('./../../routes.js');

var InfoView = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      subscribed: false,
      public: true
    };
  },

  _renderAdminSettings() {
    // only render these for admins
    var user = this.props.user;
    var bevy = this.props.activeBevy;
    if(!_.contains(bevy.admins, user._id)) return null;
    return (
      <View style={[ styles.actionRow, {
        marginTop: 15
      }]}>
        <Text style={ styles.settingsTitle }>Admin Settings</Text>
        <TouchableHighlight 
          underlayColor='rgba(0,0,0,0.1)'
          style={[ styles.switchContainer, {
            borderTopWidth: 1,
            borderTopColor: '#ddd'
          }]}
          onPress={() => {
            var settingsRoute = routes.BEVY.SETTINGS;
            settingsRoute.setting = 'posts_expire_in';
            this.props.bevyNavigator.push(settingsRoute);
          }}
        >
          <View style={ styles.settingContainer }>
            <Text style={ styles.settingDescription }>
              Posts Expire In
            </Text>
            <Text style={ styles.settingValue }>
              { bevy.settings.posts_expire_in } Days
            </Text>
          </View>
        </TouchableHighlight>
        <View style={[ styles.switchContainer ]}>
            <Text style={ styles.switchDescription }>Public</Text>
            <SwitchIOS
              value={ this.state.public }
              onValueChange={(value) => {
                this.setState({
                  public: value
                });
              }}
            />
          </View>
      </View>
    );
  },

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.infoRow} >
          <View style={styles.picButton}>
            <Image 
              style={styles.profileImage}
              source={{ uri: this.props.activeBevy.image_url }}
            >
              <TouchableOpacity 
                activeOpacity={.8}
                style={styles.cameraTouchable}
                onPress={() => {

                }}
              >
                <Icon
                  name='ion|ios-camera-outline'
                  size={40}
                  color='white'
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </Image>
          </View>

          <View style={styles.profileDeetzColumn}>
            <Text style={styles.displayName}>
              { this.props.activeBevy.name }
            </Text>
            <Text style={styles.description}>
              { this.props.activeBevy.description }
            </Text>
            <View style={ styles.details }>
              <Icon
                name='ion|earth'
                size={ 15 }
                color='#888'
                style={{ width: 15, height: 15 }}
              />
              <Text style={ styles.detailText }> Public  </Text>
              <Icon
                name='ion|ios-people'
                size={ 15 }
                color='#888'
                style={{ width: 15, height: 15 }}
              />
              <Text style={ styles.detailText }> 18 Subscribers</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.actionRow}>
          {/* disable this if admin? */}
          <View style={[ styles.switchContainer, {
            marginTop: -10,
            borderTopWidth: 1,
            borderTopColor: '#ddd'
          }]}>
            <Text style={ styles.switchDescription }>Subscribed</Text>
            <SwitchIOS
              value={ this.state.subscribed }
              onValueChange={(value) => {
                this.setState({
                  subscribed: value
                });
              }}
            />
          </View>

          { this._renderAdminSettings() }
        </ScrollView>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: '#eee'
  },
  row: {
    flexDirection: 'row'
  },
  infoRow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    margin: 10,
    borderRadius: 2,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  { width: 0, height: 0 }
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: '#666',
  },
  cameraTouchable: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  cameraIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  profileDeetzColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 15
  },
  displayName: {
    fontSize: 24,
    textAlign: 'left',
    color: '#222'
  },
  description: {
    fontSize: 15,
    textAlign: 'left',
    color: '#666'
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  detailText: {
    color: '#888',
    fontSize: 14
  },

  actionRow: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  settingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6
  },
  settingsTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
  settingDescription: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  settingValue: {
    alignSelf: 'flex-end',
    fontSize: 17,
    color: '#888'
  },
  switchContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  switchDescription: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  switch: {

  }
})

module.exports = InfoView;