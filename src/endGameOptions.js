/**
 * Created by mdanics18 on 2017-12-19.
 */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, ButtonToolbar } from 'react-bootstrap';


class EndGameOptions extends Component {
    constructor(props){
        super(props);
        this.state = {remach: false, opponentRemach: false, remachText: "Remach?"}
    }

    componentDidMount(){

        firebase.database().ref('games/' + this.props.instanceId).on('value', (snapshot) =>{
            if(this.props.player === "creator")
                this.setState({opponentRemach: snapshot.val().opponentRemach});

            else if(this.props.player === "opponent")
                this.setState({opponentRemach: snapshot.val().creatorRemach});
        })
    }

    remach = () => {
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
            const key = this.props.player + "Remach";
            firebase.database().ref('games/' + this.props.instanceId).update({
                [key]: true,
            });
        }
    };

    render(){
        return(
        <ButtonToolbar>
            <Button bsStyle="success" onClick={this.remach}> {this.state.remachText} </Button>
            <Button bsStyle="warning" href="/"> New Game with New Opponent</Button>
        </ButtonToolbar>
        )
    }

}
export default EndGameOptions