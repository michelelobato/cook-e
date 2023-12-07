
// creating the dynamic website that takes information fromthe business form and creates a webpage in the given template
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { MongoClient } = require('mongodb');


const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017/CookE';

app.use(express.static("/public"))
app.use('/img', express.static(__dirname + '/img'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('your_database_name');
        const dataCollection = db.collection('your_collection_name');

        // API endpoint to get data
        app.get('/api/data', (req, res) => {
            dataCollection.find({}).toArray()
                .then(results => {
                    res.json(results);
                })
                .catch(error => console.error(error));
        });
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'Buissness.html')); // Adjust the file name/path as necessary
        });
        app.get('/BStyle.css', (req, res) => {
            res.sendFile(path.join(__dirname, 'BStyle.css')); // Adjust the file name/path as necessary
        });

        app.post('/submit-form', async (req, res) => {
            const formData = req.body; 
            dataCollection.insertOne(formData)
                .then(result => {
                    console.log('Form Data Saved');
                })
                .catch(error => console.error(error));

            // Generate a new HTML page using the form data
            const templatePath = path.join(__dirname, 'template.html');
            let templateHTML = await fs.readFile(templatePath, 'utf8');
            console.log(formData)
            
            app.get('/yelp.css', (req, res) => {
                res.sendFile(path.join(__dirname, 'yelp.css')); // Adjust the file name/path as necessary
            });

            templateHTML = templateHTML.replace('<h1 id="restaurantName"></h1>', `<h1 id="restaurantName">${formData.BName}</h1>`);
            templateHTML = templateHTML.replace('<h2 id="restaurantTagline"></h2>', `<h2 id="restaurantTagline">${formData.BrestaurantTagline}</h2>`);
            templateHTML = templateHTML.replace('{{LocationArea}}', formData.BLocation);
            templateHTML = templateHTML.replace('{{restaurantAddress}}', formData.BAddress);
            templateHTML = templateHTML.replace('{{openingHours}}', formData.BopeningHours);
            templateHTML = templateHTML.replace('{{website}}', formData.BWebsite);

            //templateHTML = templateHTML.replace('<p id="openingHours">Open: {{openingHours}}</p>', `<p id="openingHours">Open :${formData.BopeningHours}</p>`);
            templateHTML = templateHTML.replace('{{GoogleMapsURL}}', formData.BGoogleMapsURL);
            templateHTML = templateHTML.replace('{{OrderLink}}', formData.BOrderLink);
            templateHTML = templateHTML.replace('{{Pop1}}', formData.BdishesList1)
            templateHTML = templateHTML.replace('{{Pop2}}', formData.BdishesList2)
            templateHTML = templateHTML.replace('{{Pop3}}', formData.BdishesList3)

            res.send(templateHTML);
        });

    })
    .catch(console.error);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
