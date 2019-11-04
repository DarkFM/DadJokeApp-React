import React, { Component } from 'react';

import './Joke.css';

export default class Joke extends Component {
    getJokeEmoji() {
        const voteCount = this.props.vote;
        if (voteCount > 25) return '🤣';
        else if (voteCount > 22) return '😂';
        else if (voteCount > 19) return '😁';
        else if (voteCount > 17) return '😆';
        else if (voteCount > 15) return '😄';
        else if (voteCount > 12) return '🙂';
        else if (voteCount > 9) return '🤨';
        else if (voteCount > 5) return '😐';
        else if (voteCount > 3) return '🥱';
        else if (voteCount >= 0) return '😕';
        else return '😠';
    }

    getBorderColor() {
        let voteCount = this.props.vote;
        let red = 255;
        let green = 0;
        let stepSize = 16;
        while (green < 255 && voteCount-- > 1) {
            green += stepSize;
            if (green > 255) {
                green = 255;
            }
        }
        while (red > 0 && voteCount-- > 1) {
            red -= stepSize;
            if (red < 0) {
                red = 0;
            }
        }
        // console.log(this.padString(red.toString(16)) + this.padString(green.toString(16)) + '00');
        return this.padString(red.toString(16)) + this.padString(green.toString(16)) + '00';
    }

    padString(val, padStr = '0', padLength = 2) {
        return (padStr.repeat(padLength) + val).slice(-padLength);
    }

    render() {
        return (
            <div className="Joke">
                <div className="Joke-btn-group">
                    <i
                        onClick={() => this.props.updateVote(this.props.id, 1)}
                        className="fas fa-arrow-up"
                    ></i>
                    <span style={{ borderColor: `#${this.getBorderColor()}` }}>{this.props.vote}</span>
                    <i
                        onClick={() => this.props.updateVote(this.props.id, -1)}
                        className="fas fa-arrow-down"
                    ></i>
                </div>
                <p className="Joke-text">{this.props.joke}</p>
                <div className="Joke-img-container">{this.getJokeEmoji()}</div>
            </div>
        );
    }
}
