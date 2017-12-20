/**
 * Created by mdanics18 on 2017-12-19.
 */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, ButtonToolbar } from 'react-bootstrap';


class EndGameOptions extends Component {
    constructor(props){
        super(props);
        this.state = {remach: false, opponentRemach: false, remachText: "Remach?", totalWins: 0}
    }

    componentDidMount(){

        firebase.database().ref('games/' + this.props.instanceId).on('value', (snapshot) =>{
            if(this.props.player === "creator")
                this.setState({opponentRemach: snapshot.val().opponentRemach});

            else if(this.props.player === "opponent")
                this.setState({opponentRemach: snapshot.val().creatorRemach});

        });

        firebase.database().ref('games/' + this.props.instanceId).once('value', (snapshot) =>{
            if(this.props.player === "creator")
                this.setState({totalWins: snapshot.val().creatorWins});

            else if(this.props.player === "opponent")
                this.setState({totalWins: snapshot.val().opponentWins});

        }).then(() =>{
            if (this.props.isWinner === true){
                let newTotalWins = this.state.totalWins + 1;
                this.setState({totalWins: newTotalWins});

                if (this.props.player === "creator"){
                    firebase.database().ref('games/' + this.props.instanceId).update({
                        creatorWins: newTotalWins
                    });
                }
                else if (this.props.player === "opponent"){
                    firebase.database().ref('games/' + this.props.instanceId).update({
                        opponentWins: newTotalWins
                    });
                }
            }
            }
        );

    }

    remach = () => {
        const winsKey = this.props.player + "Wins";
        const remachKey = this.props.player + "Remach";



        if (this.state.opponentRemach){
            firebase.database().ref('games/' + this.props.instanceId).update({
                creatorChoice: "none",
                opponentChoice: "none",
                opponentRemach: false,
                creatorRemach: false,
            });
        }
        else {
            this.setState({remach: true, remachText: "Waiting for opponent..."});
            firebase.database().ref('games/' + this.props.instanceId).update({
                [remachKey]: true,
            });
        }
    };

    render(){
        return(
        <ButtonToolbar>
            <Button bsStyle="success" onClick={this.remach}> {this.state.remachText}</Button>
        </ButtonToolbar>
        )
    }

}
export default EndGameOptions