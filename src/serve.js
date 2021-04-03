const express = require('express')
const serve = express()


const PORT = 3000
serve.listen(PORT, ()=> console.log(`Servidor iniciado na porta ${PORT}`))