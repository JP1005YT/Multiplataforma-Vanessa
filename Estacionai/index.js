import express from 'express'
import {cliRouter} from './routes/clientes.js'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/clientes', cliRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
 