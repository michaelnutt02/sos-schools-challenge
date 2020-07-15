const express = require('express');
const bodyParser = require('body-parser');
var schedules = require('./schedules.json');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ name: 'Hello From Express' });
});

app.get('/api/all-schedules', (req, res) => {
    res.send(schedules);
});

app.post('/api/get-schedule', (req, res) => {
  console.log(req.body);
  res.send(schedules[req.body.class]);
});

app.post('/api/get-schedules', (req, res) => {
  console.log(req.body);
  res.send(Object.keys(schedules).filter(x=>req.body.classes.includes(x)).reduce((p,n)=>{
    p[n] = schedules[n]; 
    return p
  },{}));
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));