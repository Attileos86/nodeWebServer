const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('logs.txt', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log');
        }
        next();
    });
});

app.use((req, res, next) => {
    //return res.render('maintenance.hbs');
    next();   
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>{
    console.log('Getting: /');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my homepage',
    });
});

app.get('/about', (req, res) => {
    console.log('Getting: /about');
    res.render('about.hbs', {
        pageTitle: 'About page',
    });
});

app.get('/bad', (req, res) => {
    res.send({erroMessage: 'Unable to handle request'});
});

app.listen(process.env.port || 3000, () => console.log(`Server is up on port ${app.get('port') || 3000}`));