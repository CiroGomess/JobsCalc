const express = require('express')
const serve = express()
const routes = require('./routes')

// Tamplete Engine EJS embutindo JS em HTML
serve.set('view engine', 'ejs')

// Habilitando arquivos estaticos
serve.use(express.static("public"))

// Rotas
serve.use(routes)

const PORT = 3000
serve.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`))