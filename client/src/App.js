import React, { Component } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import './App.css';

const scheduleItems = ["day", "class", "reading", "assignment", "testing"];

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
                <span>
                    <strong> Schedule </strong>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          {[...scheduleItems.map((x,i) => <th key = {i}>{x}</th>),<th>?</th>]}
                        </tr>
                      </thead>
                      <tbody>
                        {/* {this.state.schedules[x].schedule.map((y,i)=> <tr key = {x+i}>{scheduleItems.map((z,j)=><td key = {x+i+j}>{z==="class"? 
                          this.state.schedules[x].name: y[z]}</td>)}</tr>)} */}
                        {Object.keys(this.state.schedules).reduce((acc, next)=> 
                          [...acc,...this.state.schedules[next].schedule.map(x=> {x.class = this.state.schedules[next].name; return x;})], [])
                          .sort(sortMonthDayYear)
                          .map((y,i)=> <tr key = {"x"+i}>{[...scheduleItems.map((z,j)=><td key = {"x"+i+j}>{y[z] === "none"? "":y[z]}</td>), 
                            <Form.Check aria-label="option 1" />]}</tr>)}
                        
                        {/* {Object.keys(this.state.schedules).reduce((acc, next)=> [...acc,...this.state.schedules[next].schedule], [])} */}
                      </tbody>
                    </Table>
                    {/* <BootstrapTable trStyle={rowStyleFormat} keyField='id' data={ Object.keys(this.state.schedules).reduce((acc, next)=> 
                          [...acc,...this.state.schedules[next].schedule.map(x=> {x.class = this.state.schedules[next].name; return x;})], [])
                          .sort(sortMonthDayYear) } columns={ [
                            { dataField: 'day', text: 'day' },
                            { dataField: 'class', text: 'class' },
                            { dataField: 'reading', text: 'reading' },
                            { dataField: 'assignment', text: 'assignment' },
                            { dataField: 'testing', text: 'testing' }
                          ] } /> */}
                  </span>
          }
      </div>
    );
  }
}

function sortMonthDayYear(a, b){
  var year = a.day.split("/")[2] - b.day.split("/")[2];
  if(year !== 0) return year;
  var month = a.day.split("/")[1] - b.day.split("/")[1];
  if(month !== 0) return month;
  var day = a.day.split("/")[0] - b.day.split("/")[0];
  return day;
}

function rowStyleFormat(row, rowIdx) {
  return { backgroundColor: rowIdx % 2 === 0 ? 'red' : 'blue' };
}

export default App;