import React, { Component } from 'react';
import * as firebase from 'firebase';
import * as shortid from 'shortid';
import { BrowserRouter, Route, Redirect, withRouter, Router} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Rps from './rps'
import { userGuid }from './guidGenerator'

let config = {
    apiKey: "AIzaSyA5LBW5ggyiGSjNGGJaN6Si66QF3HRJlzU",
    authDomain: "mp-rps.firebaseapp.com",
    databaseURL: "https://mp-rps.firebaseio.com",
    projectId: "mp-rps",
    storageBucket: "mp-rps.appspot.com",
    messagingSenderId: "7019780124"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

let dbInstanceRef;

class App extends Component {
    constructor(props) {
        super(props);
        const urlSeparator = '';
        const slashUrlSeparator = '/' + urlSeparator;
        this.state = {instanceId: window.location.pathname, player: "", urlSeparator: urlSeparator, slashUrlSeparator: slashUrlSeparator };
    }

    componentDidMount() {
        let location = window.location.pathname;
        if (location === "/" || location === this.state.slashUrlSeparator)  {
            let instanceId = shortid.generate();
            this.setState({instanceId: this.state.slashUrlSeparator + instanceId, player: "creator"});
            firebase.database().ref('rps/games/' + instanceId).set({
                instanceId: instanceId,
                creatorChoice: "none",
                creatorGUID: userGuid(),
                creatorConnected: true,
                creatorWins: 0,
                creatorRemach: false,
                opponentChoice: "none",
                opponentConnected: false,
                opponentGUID: "",
                opponentWins: 0,
                opponentRemach: false,
            });
        }
        else if (location.includes(this.state.urlSeparator)) {
            let instanceId = window.location.pathname.substring(this.state.slashUrlSeparator.length);
            firebase.database().ref('rps/games/' + instanceId).once('value').then((snapshot) =>{
                let creatorGUID = snapshot.val().creatorGUID;
                if (creatorGUID === userGuid()){
                    console.log("creator joined");
                    this.setState({player: "creator"});
                    firebase.database().ref('rps/games/' + instanceId).update({
                        creatorConnected: true
                    })
                }
                if (creatorGUID !== userGuid()){
                    console.log("opponent joined");
                    this.setState({player: "opponent"});
                    firebase.database().ref('rps/games/' + instanceId).update({
                        opponentGUID: userGuid(),
                        opponentConnected: true,
                    })
                }
            });
        }
    }

    render() {
      return (
        <BrowserRouter>
      <div className="App">

          <Redirect to={this.state.instanceId} push={true} />
        <div>
            <Route exact path={this.state.slashUrlSeparator + ":instanceId"} render={props => <Rps slashUrlSeparator={this.state.slashUrlSeparator} {...props} />} />
            {/*<Route path={this.state.slashUrlSeparator + ":instanceId"} component={ Rps } slashUrlSeparator="lego"/>*/}
        </div>
      </div>
        </BrowserRouter>
    );
  }
}

export default App;
