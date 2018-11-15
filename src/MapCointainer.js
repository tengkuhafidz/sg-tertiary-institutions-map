import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import PropTypes from 'prop-types';
import axios from 'axios';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    map: {
        width: 'calc(100% - 240px)',
        height: 'calc(100% - 60px)',
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            height: '100%'
        },
    }
});

export class MapContainer extends Component {

    renderMarkers = (institutions) => {
        console.log('this.props.selectedPlace', this.props.selectedPlace)
        return institutions.map(institution => (
            <Marker
                key={institution.name}
                onClick={(props, marker, e) => this.props.onMarkerClick(props, marker, e)}
                title={institution.title}
                name={institution.name}
                animation={institution.name === this.props.selectedPlace.name ? '1' : '0'}
                position={institution.position}
                infoPosition={institution.infoPosition}
            />
        ))
    }

    renderNearbyAttractions = () => {
        if (!this.props.nearbyAttractions) {
            return <p>Loading...</p>
        } else {
            return this.props.nearbyAttractions.map(attraction => <li key={attraction.referralId}>{attraction.venue.name}</li>)
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Map
                google={this.props.google}
                zoom={12}
                className={classes.appBar}
                initialCenter={{ lat: 1.3607, lng: 103.8125 }}
                >
                {this.renderMarkers(this.props.institutions)}
                <InfoWindow
                    marker={this.props.activeMarker}
                    position={this.props.selectedPlace.infoPosition}
                    visible={this.props.showingInfoWindow}
                    onClose={() => this.props.onClose()}
                >
                    <div>
                        <h2>{this.props.selectedPlace.title}</h2>
                        <h4>Top Nearby Attractions : </h4>
                        <ul>
                            {this.renderNearbyAttractions()}
                        </ul>
                        <p style={{fontSize: '0.8em'}}><em>Info By Foursquare</em></p>
                    </div>
                </InfoWindow>

            </Map>
        );
    }
}

MapContainer.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAPgr5dH4dzX2vifXRkF9df7eB56YBrDUQ'
})(withStyles(styles, { withTheme: true })(MapContainer));