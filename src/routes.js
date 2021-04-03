const express = require('express')
const routes = express.Router()

const views = __dirname + '/views'

const profile = {
    name: 'Ciro Gomes',
    avatar: 'https://avatars.githubusercontent.com/u/43193194?v=4',
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
}


// Rotas 
routes.get('/', (req, res) => res.render(`${views}/index`))

routes.get('/job', (req, res) => res.render(`${views}/job`))

routes.get('/job/edit', (req, res) => res.render(`${views}/job`))

routes.get('/profile', (req, res) => res.render(`${views}/profile`, { profile: profile }))


// compartilhando as rotas com outros arquivos
module.exports = routes;