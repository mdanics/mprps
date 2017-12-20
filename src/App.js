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

class App extends Component {
    constructor(props) {
        super(props);
        const urlSeperator = '';
        const slashUrlSeperator = '/' + urlSeperator;
        this.state = {instanceId: window.location.pathname, player: "", urlSeperator: urlSeperator, slashUrlSeperator: slashUrlSeperator };
    }

    componentDidMount() {
        let location = window.location.pathname;
        if (location === "/" || location === this.state.slashUrlSeperator)  {
            let instanceId = shortid.generate();
            this.setState({instanceId: this.state.slashUrlSeperator + instanceId, player: "creator"});
            firebase.database().ref('games/' + instanceId).set({
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
        else if (location.includes(this.state.urlSeperator)) {
            let instanceId = window.location.pathname.substring(this.state.slashUrlSeperator.length);
            firebase.database().ref('/games/' + instanceId).once('value').then((snapshot) =>{
                let creatorGUID = snapshot.val().creatorGUID;
                if (creatorGUID === userGuid()){
                    console.log("creator joined");
                    this.setState({player: "creator"});
                    firebase.database().ref('/games/' + instanceId).update({
                        creatorConnected: true
                    })
                }
                if (creatorGUID !== userGuid()){
                    console.log("opponent joined");
                    this.setState({player: "opponent"});
                    firebase.database().ref('/games/' + instanceId).update({
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
          <Route path={this.state.slashUrlSeperator + ":instanceId"} component={ Rps }/>
        </div>
      </div>
        </BrowserRouter>
    );
  }
}

export default App;
