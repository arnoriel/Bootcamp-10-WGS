import React, { Component } from "react";
import './app.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            phone: "",
            email: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        const { name, phone, email } = this.state;
        alert(`A form was submitted with 
                \nName: ${name} \nPhone: ${phone} \nEmail: ${email}`);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Phone:
                        <input
                            type="text"
                            name="phone"
                            value={this.state.phone}
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="text"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Form;
