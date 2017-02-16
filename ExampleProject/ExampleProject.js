/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
    Linking,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

const CleverTap = require('clevertap-react-native');

class ExampleProject extends Component {

    componentDidMount() {
        // optional: add listeners for CleverTap Events
        CleverTap.addListener(CleverTap.CleverTapProfileDidInitialize, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapProfileDidInitialize, event); });
        CleverTap.addListener(CleverTap.CleverTapProfileSync, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapProfileSync, event); });
        CleverTap.addListener(CleverTap.CleverTapInAppNotificationDismissed, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapInAppNotificationDismissed, event); });

        // for iOS only: register for push notifications
        CleverTap.registerForPush();

        // Listener to handle incoming deep links
        Linking.addEventListener('url', this._handleOpenUrl);

        // this handles the case where a deep link launches the application
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('launch url', url);
                this._handleOpenUrl({url});
            }
        }).catch(err => console.error('launch url error', err));

        // check to see if CleverTap has a launch deep link
        // handles the case where the app is launched from a push notification containing a deep link
        CleverTap.getInitialUrl((err, url) => {
            if (url) {
                console.log('CleverTap launch url', url);
                this._handleOpenUrl({url}, 'CleverTap');
            } else if (err) {
                console.log('CleverTap launch url', err);
            }
        });
    }

    componentWillUnmount() {
        // clean up listeners
        Linking.removeEventListener('url', this._handleOpenUrl);
        CleverTap.removeListeners();
    }

    _handleOpenUrl(event, from) {
        console.log('handleOpenUrl', event.url, from);
    }

    _handleCleverTapEvent(eventName, event) {
        console.log('handleCleverTapEvent', eventName, event);
    }

    render() {
        return (
          <View style={styles.container}>
            <TouchableHighlight style={styles.button}
              onPress={this._recordEvent}>
              <Text>Record Event</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button}
              onPress={this._recordChargedEvent}>
              <Text>Record Charged Event</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button}
              onPress={this._updateUserProfile}>
              <Text>Update User Profile</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button}
              onPress={this._getUserProfileProperty}>
              <Text>Get User Profile Property</Text>
            </TouchableHighlight>
          </View>
        );
    }

    _recordEvent(event) {
        CleverTap.recordEvent('testEvent');
        CleverTap.recordEvent('testEventWithProps', {'foo': 'bar'});
    }

    _recordChargedEvent(event) {
        CleverTap.recordChargedEvent({'totalValue': 20, 'category': 'books'}, [{'title': 'book1'}, {'title': 'book2'}, {'title': 'book3'}]);
    }

    _updateUserProfile(event) {
        CleverTap.profileSet({'Name': 'testUserA1', 'Identity': '123456', 'Email': 'test@test.com', 'custom1': 123});
        CleverTap.profileSetMultiValuesForKey(['a', 'b', 'c'], 'letters');
        CleverTap.profileAddMultiValueForKey('d', 'letters');
        CleverTap.profileAddMultiValuesForKey(['e', 'f'], 'letters');
        CleverTap.profileRemoveMultiValueForKey('b', 'letters');
        CleverTap.profileRemoveMultiValuesForKey(['a', 'c'], 'letters');
        CleverTap.setLocation(34.15, -118.20);
    }

    _getUserProfileProperty(event) {
        CleverTap.enablePersonalization();

        CleverTap.profileGetProperty('Name', (err, res) => {
            console.log('CleverTap Profile Name: ', res, err);
        });

        CleverTap.profileGetCleverTapID((err, res) => {
            console.log('CleverTapID', res, err);
        });

        CleverTap.profileGetCleverTapAttributionIdentifier((err, res) => {
            console.log('CleverTapAttributionIdentifier', res, err);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginBottom: 20
    }
});

module.exports = ExampleProject;