const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8adgo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5055

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");
  
  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
   });

   app.get('/appointments', (req, res) => {
    appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });
   
   app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    console.log(date);
    appointmentCollection.find({date: date.date})
       .toArray((err,documents)=>{
          res.send(documents);
       })
   });


//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})