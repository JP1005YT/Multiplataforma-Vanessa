import express from 'express';
import connect from '../config/connection.js';
import { Cliente } from '../models/cliente.js';

const router = express.Router();

// Get all clients
router.get('/', async (_, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM Clientes');
        const clients = rows.map(row => new Cliente(row.id, row.nome, row.telefone, row.email));
        res.json(clients);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Get a single client by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM Clientes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Client not found');
        const client = new Cliente(rows[0].id, rows[0].nome, rows[0].telefone, rows[0].email);
        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Create a new client
router.post('/', async (req, res) => {
    const { nome, telefone, email } = req.body;
    try {
        const [result] = await connect.query('INSERT INTO Clientes (nome, telefone, email) VALUES (?, ?, ?)', [nome, telefone, email]);
        const newClient = new Cliente(result.insertId, nome, telefone, email);
        res.status(201).json(newClient);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Update an existing client
router.put('/:id', async (req, res) => {
    const { nome, telefone, email } = req.body;
    try {
        const [result] = await connect.query('UPDATE Clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?', [nome, telefone, email, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Client not found');
        const updatedClient = new Cliente(req.params.id, nome, telefone, email);
        res.json(updatedClient);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Delete a client
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await connect.query('DELETE FROM Clientes WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Client not found');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

export const cliRouter = router;