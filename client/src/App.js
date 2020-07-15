import React, { Component } from 'react';

import './App.css';

const scheduleItems = ["day", "reading", "assignment", "testing"];

class App extends Component {
  state = {
    schedules: {},
    post: '',
    responseToPost: '',
  };
  fetchSchedules = this.fetchSchedules();
  
  componentDidMount() {
    this.fetchSchedules()
      .then(res => this.setState({ schedules: res}))
      .catch(err => console.log(err));
  }
  
  fetchSchedules() {
    return async () => {
      const response = await fetch('/api/get-schedules', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classes: ["testClass1", "testClass3"] }),
        });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      console.log(body);
      return body;
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
            SOS Schedule Viewer
          </p>
        </header>
        {
            Object.keys(this.state.schedules).length === 0? "loading":
              Object.keys(this.state.schedules).map(x=> <ul key={x}>{
                <span>
                    <strong>{this.state.schedules[x].name}</strong>
                    <ul key={x}>{this.state.schedules[x].schedule.map((y,i)=> scheduleItems.map((z,j)=> <li key = {x+i+j}>{y[z]}</li>))}</ul>
                  </span>
                  }</ul>)
          }
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;