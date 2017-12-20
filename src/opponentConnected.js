/**
 * Created by mdanics18 on 2017-12-20.
 */
import React, { Component } from 'react';
import "./opponentConnected.css"

class OpponentConnected extends Component {
    constructor(props) {
        super(props);

    }


    render(){

        let status;
        if (this.props.opponentConnected){
            status = "Opponent Connected"
        } else {
            status = "Opponent not connected"
        }

        return(
            <h4 className={((this.props.opponentConnected) ? "online" : "offline")}>
                {status}
            </h4>
        )
    }
}

export default OpponentConnected;
