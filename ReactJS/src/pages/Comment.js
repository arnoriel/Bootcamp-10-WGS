// src/pages/Comment.js
import React, { Component } from "react";
import { faker } from '@faker-js/faker';

class Comment extends Component {
    constructor(props) {
        super(props);
        // Menghasilkan data palsu menggunakan Faker.js
        this.state = {
            comments: [
                {
                    avatar: faker.image.avatar(),
                    author: faker.person.fullName(),
                    date: "Today at 5:42PM",
                    text: faker.lorem.sentence(),
                },
                {
                    avatar: faker.image.avatar(),
                    author: faker.person.fullName(),
                    date: "5 days ago",
                    text: faker.lorem.sentence(),
                },
                {
                    avatar: faker.image.avatar(),
                    author: faker.person.fullName(),
                    date: "Yesterday at 12:30AM",
                    text: faker.lorem.sentence(),
                },
                {
                    avatar: faker.image.avatar(),
                    author: faker.person.fullName(),
                    date: "Today at 69:21AM",
                    text: faker.lorem.sentence(),
                }
            ]
        };
    }

    render() {
        return (
            <div className="ui comments">
                <h3 className="ui dividing header">Comments</h3>
                {this.state.comments.map((comment, index) => (
                    <div className="comment" key={index}>
                        <a className="avatar">
                            <img src={comment.avatar} alt="avatar" />
                        </a>
                        <div className="content">
                            <a className="author">{comment.author}</a>
                            <div className="metadata">
                                <span className="date">{comment.date}</span>
                            </div>
                            <div className="text">
                                {comment.text}
                            </div>
                        </div>
                    </div>
                ))}
                <form className="ui reply form" style={{ marginTop: '20px' }}>
                    <div className="field">
                        <textarea placeholder="Add a comment..." style={{ minHeight: '100px', padding: '10px' }}></textarea>
                    </div>
                    <div className="ui blue labeled submit icon button" style={{ marginTop: '10px' }}>
                        <i className="icon edit"></i> Add Reply
                    </div>
                </form>
            </div>
        );
    }
}

export default Comment;
