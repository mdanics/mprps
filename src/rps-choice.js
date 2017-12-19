/**
 * Created by mdanics18 on 2017-12-17.
 */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, ButtonToolbar } from 'react-bootstrap';
import './rps-choice.css';


class RpsChoice extends Component {
    constructor(props){
        super(props);
        this.state = {choice: "none", opponentChoice: false}
    }

    componentDidMount() {
        firebase.database().ref('games/' + this.props.instanceId).on('value', (snapshot) =>{
             if(this.props.player === "creator")
                 this.setState({opponentChoice: snapshot.val().opponentChoice});

            else if(this.props.player === "opponent")
                 this.setState({opponentChoice: snapshot.val().creatorChoice});
        })
    }

    choose = (choice) => {
        this.setState({choice: choice});

        const key = this.props.player + "Choice";
        firebase.database().ref('games/' + this.props.instanceId).update({
            [key]: choice,
        });

};

    isWinner = () => {
        if (this.state.choice === this.state.opponentChoice)
            return "tie";

        else if (this.state.choice === "paper" && this.state.opponentChoice === "rock")
            return true;

        else if (this.state.choice === "rock" && this.state.opponentChoice === "scissors")
            return true;

        else if (this.state.choice === "scissors" && this.state.opponentChoice === "paper")
            return true;
        else
            return false;

    };

    render() {

        let isWinner = this.isWinner();


        if (this.state.choice === "none"){
            return(
                <ButtonToolbar>
                    <Button bsStyle="primary" bsSize="large" active onClick={()=> {this.choose('rock')}}>Rock</Button>
                    <Button bsStyle="info" bsSize="large" active onClick={()=> {this.choose('paper')}}>Paper</Button>
                    <Button bsStyle="success" bsSize="large" active onClick={()=> {this.choose('scissors')}}>Scissors</Button>
                </ButtonToolbar>
            )
        }

        else if (this.state.opponentChoice === "none") return(
            <div>
                <h1> You chose {this.state.choice}</h1>
                <h2> Waiting for your opponent to choose</h2>
            </div>
        );

        else if (this.isWinner() === "tie") return(
            <div>
                <h1> It's a tie </h1>
                <h3> You both threw {this.state.choice}</h3>
            </div>
        );

        else if (this.isWinner()) return(
            <div>
                <h1> You Won! :) </h1>
                <h3> You threw {this.state.choice} and your opponent threw {this.state.opponentChoice}</h3>
            </div>
        );

        else return(
            <div>
                <h1> You lost! :( </h1>
                <h3> You threw {this.state.choice} and your opponent threw {this.state.opponentChoice}</h3>
                <Button bsStyle="success" href="/"> New Game </Button>
            </div>

        );


    }


}
export default RpsChoice