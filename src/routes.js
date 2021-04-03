const express = require('express')
const routes = express.Router()

const views = __dirname + '/views'

// Rotas 
routes.get('/', (req, res) =>  res.render(`${views}/index`))
routes.get('/job', (req, res) =>  res.render(`${views}/job`))
routes.get('/job/edit', (req, res) =>  res.render(`${views}/job`))
routes.get('/profile', (req, res) => res.render(`${views}/profile`))


// compartilhando as rotas com outros arquivos
module.exports = routes;