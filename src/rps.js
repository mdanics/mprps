import React, { Component } from 'react';
import RpsChoice from './rps-choice'
import * as firebase from 'firebase';
import { userGuid }from './guidGenerator'
import { FormControl, Grid, Row, Col } from 'react-bootstrap'
import './rps.css'


class Rps extends Component {

    constructor(props) {
        super(props);
        const { match: { params } } = this.props;
        this.state = {instanceId: params.instanceId, player: "none", opponentConnected: false};
    }

        componentDidMount() {
            firebase.database().ref('games/' + this.state.instanceId).on('value', (snapshot) =>{
                if (snapshot.val().creatorGUID === userGuid()) {
                    this.setState({player: "creator"});
                    firebase.database().ref('games/' + this.state.instanceId + "/creatorConnected").onDisconnect().set(false);
                }
                // else if (snapshot.val().opponentGUID === ""){
                //     alert("xxxx")
                // }
                else if (snapshot.val().opponentGUID === userGuid()) {
                    this.setState({player: "opponent"});
                    firebase.database().ref('games/' + this.state.instanceId + "/opponentConnected").onDisconnect().set(false);
                }
                else {
                    this.setState({player: "none"})
                }

                //checks if other player joins

                console.log('somethign changed');
                if (this.state.player === "creator") {
                    if (snapshot.val().opponentConnected){
                        this.setState({opponentConnected: true})
                    }
                    else{
                        this.setState({opponentConnected: false})
                    }
                }
                if (this.state.player === "opponent") {
                    console.log('u r opp');
                    if (snapshot.val().creatorConnected){
                        this.setState({opponentConnected: true});
                        console.log('other is there');
                    }
                    else{
                        this.setState({opponentConnected: false});
                        console.log('other is not there');
                    }
                }
            })
        }

        handleFocus = (event) => {
        event.target.select();
        }


        render(){

        let otherPlayerConnected = false;

        if (this.state.player === "creator" && this.state.opponentConnected)
                otherPlayerConnected = true;

        if (this.state.player === "opponent" && this.state.opponentConnected)
                otherPlayerConnected = true;

        console.log("player", this.state.player, "opp conn", this.state.opponentConnected);
        if (otherPlayerConnected){
            return (
                <div>
                    <h2> Rock Paper Scissorss. Room name {this.state.instanceId} </h2>

                    <RpsChoice instanceId={this.state.instanceId} player={this.state.player}/>
                </div>
            )
        }

        return(
            <Grid>
                <h1> Multiplayer Rock Paper Scissors </h1>
                <h2> Invite a friend to play with them </h2>
                <h4> Send this URL to a friend, then wait for them to show up</h4>
                <Row>
                    <Col xs={1} md={4}></Col>
                    <Col xs={4} md={4}><FormControl type="text" value={window.location.origin + "/&" + this.state.instanceId} className="url" onFocus={this.handleFocus}/></Col>
                    <Col xs={1} md={4}></Col>
                </Row>
            </Grid>
        )


    }

}

export default Rps;