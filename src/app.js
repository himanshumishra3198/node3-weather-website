const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Himanshu mishra'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Himanshu mishra'
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search)   {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help', (req,res) => {
    res.render('help',{
        title: 'Help',
        name: 'Himanshu mishra'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address)   {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error)  {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*',(req,res) => {
    res.render('404',{
        title: 404,
        errorMessage: 'Help article not found!',
        name: 'Himanshu mishra'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title: 404,
        errorMessage:'Page not found',
        name: 'Himanshu mishra'
    })
})

app.listen(port, () =>{
    console.log('Server is up on port ' + port)
}) 
