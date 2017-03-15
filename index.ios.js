/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import querystring from 'querystring';
import secrets from 'NearbyCoffee/secrets';

const searchURL = 'https://api.foursquare.com/v2/venues/explore';
function findVenues(latitude, longitude) {
  const params = {
    ll: `${latitude},${longitude}`,
    radius: '250',
    query: 'Coffeeshop with Wifi',
    client_id: secrets.foursquare.clientId,
    client_secret: secrets.foursquare.clientSecret, 
    v: '20170314',
    m: 'foursquare',
  };
  const urlWithParams = searchURL + '?' + querystring.stringify(params);
  console.log(urlWithParams);
  return fetch(urlWithParams)
    .then(res => res.json())
    .then(body => body.response.groups[0].items.map(item => item.venue))
    .then(venues => { console.log('received venues', venues); return venues; })
}

export default class NearbyCoffee extends Component {

  state = {venues: []};

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(res => {
      findVenues(res.coords.latitude, res.coords.longitude)
        .then(venues => this.setState({venues}));
    }, (err) => {
      alert('error');
    });
  }
  
  render() {
    return (
      <MapView style={{flex: 1}}>
        {this.state.venues.map(venue => <VenueMarker key={venue.id} venue={venue} />)}
      </MapView>
    );
  }
}

const VenueMarker = ({venue}) => (
  <MapView.Marker
    coordinate={{latitude: venue.location.lat, longitude: venue.location.lng}}
  />
);

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('NearbyCoffee', () => NearbyCoffee);
