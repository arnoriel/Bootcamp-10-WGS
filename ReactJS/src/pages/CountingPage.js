import React, { Component } from "react";
import './app.css';

class CountingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }
    render() {
        return (
            <div>
                <h1>You clicked {this.state.count} times</h1>
                <button onClick={() => this.setState({count: this.state.count + 1})}>
                    tambah
                </button>
                <button onClick={() => this.setState({count: this.state.count - 1})}>
                    kurang
                </button>
            </div>
        )
    }
}
export default CountingPage;