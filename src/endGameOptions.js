/**
 * Created by mdanics18 on 2017-12-19.
 */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, ButtonToolbar } from 'react-bootstrap';


class EndGameOptions extends Component {
    constructor(props){
        super(props);
        this.state = {choice: "none", opponentChoice: false}
    }

    remach = () => {

        const key = this.props.player + "Remach";
        firebase.database().ref('games/' + this.props.instanceId).update({
            [key]: true,
        });
    };

    render(){



        return(
        <ButtonToolbar>
            <Button bsStyle="success" onClick={this.remach}> Remach </Button>
            <Button bsStyle="warning" href="/"> New Game </Button>
        </ButtonToolbar>
        )
    }

}
export default EndGameOptions