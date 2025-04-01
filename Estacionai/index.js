import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {cliRouter} from './routes/clientes.js'
import { vagaRouter } from './routes/vagas.js'
import { veiculoRouter } from './routes/veiculos.js'


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/clientes', cliRouter)
app.use('/vagas', vagaRouter)
app.use('/veiculos', veiculoRouter)

app.listen(3001, () => {
    console.log('Server is running on port 3000')
})
 