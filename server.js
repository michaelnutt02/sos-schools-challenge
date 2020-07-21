const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000; //listens on localhost:5000 during development

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/get-schedules', (req, res) => { //api command to retrieve schedules and lectures for the given classes
  console.log(req.body); //body format should be {classes:['className1', 'className2', ...]}
  let rawdata = fs.readFileSync('schedules.json');
  let schedules = JSON.parse(rawdata);
  res.send(Object.keys(schedules) //retrieves all class keys in the schedules.json file
  .filter(x=>req.body.classes.includes(x)) //filters on requested classes
  .reduce((p,n)=>{ //rebuilds json object with the requested classes
    p[n] = schedules[n]; 
    return p
  },{})); //sends back the schedules.json file filtered for the requested classes
});

app.listen(port, () => console.log(`Listening on port ${port}`));