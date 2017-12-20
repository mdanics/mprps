/**
 * Created by mdanics18 on 2017-12-19.
 */
import React, { Component } from 'react';
import EndGameOptions from './endGameOptions'


const win = (instanceId, player, choice, opponentChoice, isWinner) => (
    <div>
        <h1> You Won! :) </h1>
        <h3> You threw {choice} and your opponent threw {opponentChoice}</h3>
        <EndGameOptions instanceId={instanceId} player={player} isWinner={isWinner}/>
    </div>
);

const lose = (instanceId, player, choice, opponentChoice, isWinner) => (
    <div>
        <h1> You lost! :( </h1>
        <h3> You threw {choice} and your opponent threw {opponentChoice}</h3>
        <EndGameOptions instanceId={instanceId} player={player} isWinner={isWinner}/>
    </div>
);

const tie = (instanceId, player, choice, isWinner) => (
    <div>
        <h1> It's a tie </h1>
        <h3> You both threw {choice}</h3>
        <EndGameOptions instanceId={instanceId} player={player} isWinner={isWinner}/>
    </div>
);

export { win, lose, tie }