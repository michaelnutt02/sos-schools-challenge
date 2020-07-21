import React, { Component } from 'react';
import { Table, Form, Container, Col, Row } from 'react-bootstrap'; //Uses react bootstrap for all visual elements

import './App.css';

const scheduleItems = ["day", "class", "reading", "assignment", "testing"]; //rows in schedule
const dayOfWeek = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"]; //used for getting day of the week from Date.getDay()

class App extends Component {
  state = {
    schedules: {}
  };
  fetchSchedules = this.fetchSchedules();
  
  componentDidMount() {
    this.fetchSchedules()
      .then(res => this.setState({ schedules: res}))
      .catch(err => console.log(err));
  }
  
  fetchSchedules() {
    return async () => {
      const response = await fetch('/api/get-schedules', { //fetches schedules and lectures
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classes: ["testClass1", "testClass3"] }), //Requests two of the test classes
        });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      console.log(body);
      return body;
    }
  }
  
render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            SOS Schedule Viewer
          </p>
        </header>
        {
            Object.keys(this.state.schedules).length === 0? "loading": //don't go into the below code if the schedule hasn't been fetched yet
            <Container>
              <Row>
                <Col>
                  <strong> Lectures </strong>
                  <Table striped bordered hover size="sm"> {/*lectures table*/}
                    <thead> {/*lectures headers*/}
                      <tr>
                        <th>day</th>
                        <th>class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(this.state.schedules).reduce((acc, next)=> //iterate over each class
                        [...acc,...this.state.schedules[next].lectures //combine all lectures
                        .map(x=> {x.class = this.state.schedules[next].name; return x;})], []) //add a name field containing the class name to each lecture item
                        .sort(sortMonthDayYear) //sort the lecture array on date
                        .map((y,i)=> <tr key = {"y"+i}>{[ //map each lecture element to html creating rows for each item
                          <td>{dayOfWeek[returnDay(y.date)]} {y.date.month}/{y.date.day}</td>, //print the date in month/day format plus the day of the week
                          <td><a href={y.link} target="_blank">{y.class}</a></td> //create a hyperlink based off of the route in lecture.link
                          ]}</tr>)}
                    </tbody>
                  </Table>
                </Col>
                <Col xs={9}>
                  <strong> Schedule </strong>
                  <Table striped bordered hover size="sm"> {/*schedule table*/}
                    <thead> {/*schedule headers*/}
                      <tr>
                        {[...scheduleItems.map((x,i) => <th key = {i}>{x}</th>),<th>?</th>] /*builds up headers from scheduleItems*/}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(this.state.schedules).reduce((acc, next)=> //iterate over each class
                        [...acc,...this.state.schedules[next].schedule //combine all schedules
                        .map(x=> {x.class = this.state.schedules[next].name; return x;})], []) //add a name field containing the class name to each schedule item
                        .sort(sortMonthDayYear) //sort the schedule array on date
                        .map((y,i)=> <tr key = {"x"+i}>{[ //map each schedule element to html creating rows for each item
                          <td>{dayOfWeek[returnDay(y.date)]} {y.date.month}/{y.date.day}</td>, //print the date in month/day format plus the day of the week
                          <td>{y.class}</td>,
                          <td>{filterNone(y.reading)}</td>,
                          <td>{filterNone(y.assignment)}</td>,
                          <td>{filterNone(y.testing)}</td>,
                          <Form.Check aria-label="option 1" />]}</tr>)}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          }
      </div>
    );
  }
}

function filterNone(a){ //filters out "none" so that it's just blank in the schedule
  return a==="none"?"":a;
}

function returnDay(a){ //returns the number associated with the correct index in array dayOfWeek
  var d = new Date();
  d.setFullYear(a.year, a.month, a.day);
  return d.getDay();
}

function sortMonthDayYear(a, b){ //used for sorting on date (earliest first)
  var year = parseInt(a.date.year) - parseInt(b.date.year);
  if(year !== 0) return year;
  var month = parseInt(a.date.month) - parseInt(b.date.month);
  if(month !== 0) return month;
  var day = parseInt(a.date.day) - parseInt(b.date.day);
  return day;
}

export default App;