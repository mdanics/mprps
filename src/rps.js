import React, { Component } from 'react';
import RpsChoice from './rps-choice'
import * as firebase from 'firebase';
import { userGuid }from './guidGenerator'
import { FormControl, Grid, Row, Col } from 'react-bootstrap'
import OpponentConnected from './opponentConnected'
import './rps.css'


class Rps extends Component {

    constructor(props) {
        super(props);
        const { match: { params } } = this.props;
        this.state = {instanceId: params.instanceId, player: "none", opponentConnected: false, creatorChoice: "none",
        opponentChoice: "none", otherPlayerWins: 0, yourWins: 0,
        };
    }

        componentDidMount() {
            firebase.database().ref('rps/games/' + this.state.instanceId).on('value', (snapshot) =>{

                if (snapshot.val().creatorGUID === userGuid()) {
                    this.setState({player: "creator"});
                    firebase.database().ref('rps/games/' + this.state.instanceId + "/creatorConnected").onDisconnect().set(false);
                }
                // else if (snapshot.val().opponentGUID === ""){
                //     alert("xxxx")
                // }
                else if (snapshot.val().opponentGUID === userGuid()) {
                    this.setState({player: "opponent"});
                    firebase.database().ref('rps/games/' + this.state.instanceId + "/opponentConnected").onDisconnect().set(false);
                }
                else {
                    this.setState({player: "none"})
                }

                //checks if other player joins

                console.log('somethign changed');
                if (this.state.player === "creator") {
                    this.setState({yourWins: snapshot.val().creatorWins, otherPlayerWins: snapshot.val().opponentWins});

                    if (snapshot.val().opponentConnected){
                        this.setState({opponentConnected: true})
                    }
                    else{
                        this.setState({opponentConnected: false})
                    }
                }
                if (this.state.player === "opponent") {
                    this.setState({yourWins: snapshot.val().opponentWins, otherPlayerWins: snapshot.val().creatorWins});

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
        };


        render(){

        let otherPlayerConnected = false;

        if (this.state.player === "creator" && this.state.opponentConnected)
                otherPlayerConnected = true;

        if (this.state.player === "opponent" && this.state.opponentConnected)
                otherPlayerConnected = true;

        console.log("player", this.state.player, "opp conn", this.state.opponentConnected);
        if (otherPlayerConnected){
            return (
                <Grid>
                    <Row>
                        <Col md = {2}>
                            <h3>You</h3>
                            <h1 style={{fontWeight: "bold"}}> {this.state.yourWins}</h1>

                        </Col>
                        <Col md = {8}>
                            <h1> Multiplayer Rock Paper Scissors </h1>
                        </Col>
                        <Col md = {2}>
                            <h3>Them</h3>
                            <h1 style={{fontWeight: "bold"}}> {this.state.otherPlayerWins}</h1>
                        </Col>
                   </Row>
                    <RpsChoice instanceId={this.state.instanceId} player={this.state.player}/>
                    <OpponentConnected opponentConnected={this.state.opponentConnected}/>
                </Grid>
            )
        }

        return(
            <Grid>

                <h1> Multiplayer Rock Paper Scissors </h1>
                <h2> Invite a friend to play with them </h2>
                <h4> Send this URL to a friend, then wait for them to show up</h4>
                <h5> (If you want to play with your self, open a different browser and use the link)</h5>
                <Row>
                    <Col xs={1} md={4}></Col>
                    <Col xs={4} md={4}><FormControl type="text" value={window.location.origin + this.props.slashUrlSeparator + this.state.instanceId} className="url" onFocus={this.handleFocus}/></Col>
                    <Col xs={1} md={4}></Col>
                </Row>
                <OpponentConnected opponentConnected={this.state.opponentConnected}/>
            </Grid>
        )


    }

}

export default Rps;
