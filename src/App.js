import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';



import MapContainer from './MapCointainer';
import axios from "axios";
import {Marker} from "google-maps-react";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        paddingTop: '60px',
        flexGrow: 1
        // padding: theme.spacing.unit * 3,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class App extends React.Component {
    state = {
        mobileOpen: false,
        institutionType: 'all',
        searchInput: '',
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click
        selectedPlace: {},         //Shows the infoWindow to the selected place upon a marker
        nearbyAttractions: null
    };

    onMarkerActivated = (props, marker, e) =>{
        console.log('onMarkerActivated', props)
        this.setState({ nearbyAttractions: null });

        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        }, () => {
            console.log('onMarkerActivated state', this.state.selectedPlace.position.lat)
            this.getRecommendedNearby()
        });




    }


    getRecommendedNearby = () => {
        const CLIENT_ID = 'TVOWFTGZGC11AIEWE0L03Z0EP3KOC20BZX5UABGN00NADNBU';
        const CLIENT_SECRET = 'YDMBRJVGCILY1YAHZQOFWEYZB3X5DGDJXND2XFFWY1LGSOBK';
        const foursquareApiUrl = `https://api.foursquare.com/v2/venues/explore?ll=${this.state.selectedPlace.position.lat},${this.state.selectedPlace.position.lng}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20120610`

        fetch(foursquareApiUrl)
            .then((resp) => resp.json())
            .then((data) => {
                console.log('response.data.response.groups.items', data.response.groups[0].items.slice(0,3) )
                this.setState({ nearbyAttractions: data.response.groups[0].items.slice(0,3) });
            })
            .catch(function(error) {
                // If there is any error you will catch them here
            });
    }

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedPlace: {}
            });
        }
    };


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    getInstitutions = () => {
        const universities = [
            {
                name: 'nus',
                title: 'National University of Singapore',
                position: {
                    lat: 1.297190,
                    lng: 103.779730
                },
                infoPosition: {
                    lat: 1.31,
                    lng: 103.779750
                }
            },{
                name: 'ntu',
                title: 'Nanyang Technological University',
                position: {
                    lat: 1.3564102704328083,
                    lng: 103.6939833825696
                }, infoPosition: {
                    lat: 1.37,
                    lng: 103.6939833825696
                }
            },{
                name: 'smu',
                title: 'Singapore Management University',
                position: {
                    lat: 1.301900,
                    lng: 103.857020
                }, infoPosition: {
                    lat: 1.312000,
                    lng: 103.857020
                }
            }
        ];

        const polytechnics = [
            {
                name: 'sp',
                title: 'Singapore Polytechnic',
                 position: {
                     lat: 1.309877,
                     lng: 103.777504
                 }, infoPosition: {
                    lat: 1.320877,
                    lng: 103.777504
                }
            },{
                name: 'rp',
                title: 'Republic Polytechnic',
                position: {
                    lat: 1.443389,
                    lng: 103.785477
                }, infoPosition: {
                    lat: 1.45389,
                    lng: 103.785477
                }
            },{
                name: 'np',
                title: 'Ngee Ann Polytechnic',
                position: {
                    lat: 1.281480,
                    lng: 103.845550
                }, infoPosition: {
                    lat: 1.295480,
                    lng: 103.845550
                }
            },{
                name: 'nyp',
                title: 'Nanyang Polytechnic',
                position: {
                    lat: 1.372190,
                    lng: 103.848320
                }, infoPosition: {
                    lat: 1.385190,
                    lng: 103.848320
                }
            },{
                name: 'tp',
                title: 'Temasek Polytechnic',
                position: {
                    lat: 1.3451884402700267,
                    lng: 103.93278954248845
                }, infoPosition: {
                    lat: 1.355884402700267,
                    lng: 103.93278954248845
                }
            }
        ];

        const all = [...polytechnics, ...universities];

        switch (this.state.institutionType) {
            case 'university':
                return universities;
            case 'polytechnic':
                return polytechnics;
            case 'all':
                return all;
        }
    }

    getFilteredInstitutions = () => {
        if(!this.state.searchInput) {
            return this.getInstitutions();
        } else {
            return this.getInstitutions().filter(institution => institution.title.toLowerCase().includes(this.state.searchInput.toLowerCase()))
        }
    }

    render() {
        const { classes, theme } = this.props;

        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <FormControl className={classes.formControl}>
                    <Input
                        type="text"
                        onChange={this.handleChange}
                        placeholder="Institution Name"
                        inputProps={{
                            name: 'searchInput',
                            id: 'search-input'
                        }}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>

                    <InputLabel htmlFor="institution-type">Institution Type</InputLabel>
                    <Select
                        value={this.state.institutionType}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'institutionType',
                            id: 'institution-type'
                        }}
                    >
                        <MenuItem value={'all'}>All</MenuItem>
                        <MenuItem value={'university'}>University</MenuItem>
                        <MenuItem value={'polytechnic'}>Polytechnic</MenuItem>
                    </Select>
                </FormControl>
                <Divider />
                <List>
                    {this.getFilteredInstitutions().map((institution, index) => (
                        <ListItem button key={institution.name} onClick={() => this.onMarkerActivated(institution)}
                        >
                            <ListItemText primary={institution.title} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            SG Institutions
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    {/* The implementation can be swap with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <MapContainer
                        institutions={this.getFilteredInstitutions()}
                        onMarkerClick={this.onMarkerActivated}
                        onClose={this.onClose}
                        activeMarker={this.state.activeMarker}
                        showingInfoWindow={this.state.showingInfoWindow}
                        selectedPlace={this.state.selectedPlace}
                        nearbyAttractions={this.state.nearbyAttractions}
                    />
                </main>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);