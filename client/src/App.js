import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    schedules: {
      "testClass1": {
      "name": "Physics",
      "schedule": [{
          "day": "11/3",
          "reading": "1.1",
          "assignment": "none",
          "testing": "none"
      },
      {
          "day": "11/4",
          "reading": "1.2",
          "assignment": "none",
          "testing": "none"
      }]
  }},
    post: '',
    responseToPost: '',
  };
  fetchSchedules = this.fetchSchedules();
  
  componentDidMount() {
    // this.fetchSchedules()
    //   .then(res => this.setState({ schedules: res}))
    //   .catch(err => console.log(err));
  }
  
  fetchSchedules() {
    return async () => {
      const response = await fetch('/api/all-schedules');
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      
      return body.testClass1;
    }
  }
  
  handleSubmit = async e => {
    
    console.log("schedule is ",this.schedules.name);
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.schedules.testClass1.name}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;