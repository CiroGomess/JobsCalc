const express = require('express')
const serve = express()
const routes = require('./routes')

// Tamplete Engine EJS embutindo JS em HTML
serve.set('view engine', 'ejs')

// Habilitando arquivos estaticos
serve.use(express.static("public"))

// usar o req.body
serve.use(express.urlencoded({ extended: true }))

// Rotas
serve.use(routes)

const link = 'http://localhost:3000'
const PORT = 3000
serve.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT} - ${link}`))