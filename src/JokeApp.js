import React, { Component } from 'react';
import Joke from './Joke';

import './JokeApp.css';

const STORAGE_NAME = 'DadJokes';

export default class JokeApp extends Component {
    constructor(props) {
        super(props);
        this.state = { jokes: [], isLoading: false };

        this.updateVote = this.updateVote.bind(this);
    }

    updateVote(id, incrementValue) {
        const jokes = [...this.state.jokes];
        const joke = jokes.find(joke => joke.id === id);
        joke.vote += incrementValue;
        jokes.sort((a, b) => b.vote - a.vote);

        this.setState({ jokes });
        localStorage.setItem(STORAGE_NAME, JSON.stringify(jokes));
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        let jokesStr = localStorage.getItem(STORAGE_NAME);
        let jokes = [];
        if (jokesStr) {
            jokes = JSON.parse(jokesStr).sort((a, b) => b.vote - a.vote);
        } else {
            jokes = (await this.getJokes(10)).sort((a, b) => b.vote - a.vote);
            localStorage.setItem(STORAGE_NAME, JSON.stringify(jokes));
        }
        this.setState({ jokes, isLoading: false });
    }

    getNewJokes() {
        this.setState({ isLoading: true });
        this.getJokes(10)
            .then(jokes => {
                const ids = this.state.jokes.map(j => j.id);
                const set = new Set(ids);
                const filteredJokes = jokes.filter(joke => !set.has(joke.id));
                const storedJokes = JSON.parse(localStorage.getItem(STORAGE_NAME));
                const newJokes = [...filteredJokes, ...storedJokes].sort((a, b) => b.vote - a.vote);
                localStorage.setItem(STORAGE_NAME, JSON.stringify(newJokes));
                this.setState({ isLoading: false, jokes: newJokes });
            })
            .catch(reason => {
                this.setState({ isLoading: false });
                return new Error(reason);
            });
    }

    async getJokes(numJokes) {
        const request = new Request('https://icanhazdadjoke.com/', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const promises = [];
        for (let i = 0; i < numJokes; i++) {
            const promise = fetch(request).then(resp => resp.json());
            promises.push(promise);
        }
        try {
            return Promise.all(promises).then(data =>
                data.reduce((acc, { id, joke }) => [...acc, { id, joke, vote: 0 }], [])
            );
        } catch (error) {
            alert('Network error. Refresh page to try again');
        }
    }

    render() {
        let markup;
        if (this.state.isLoading) {
            markup = (
                <div className="JokeApp">
                    <div className="JokeApp-lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            );
        } else {
            markup = (
                <div className="JokeApp">
                    <div className="JokeApp-sidebar">
                        <h1 className="JokeApp-title">
                            Dad <span className="JokeApp-thin-header">Jokes</span>
                        </h1>
                        <div className="JokeApp-emoji-container">
                            <span role="img" aria-label="smiling emoji">
                                😂
                            </span>
                        </div>
                        <button className="JokeApp-newjoke-btn" onClick={() => this.getNewJokes()}>
                            New Jokes
                        </button>
                    </div>
                    <div className="JokeApp-joke-container">
                        {this.state.jokes.map(j => (
                            <Joke
                                vote={j.vote}
                                key={j.id}
                                id={j.id}
                                joke={j.joke}
                                updateVote={this.updateVote}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        return markup;
    }
}
