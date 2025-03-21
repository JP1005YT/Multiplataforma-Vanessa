import express from 'express';
import connect from '../config/connection.js';
import { Vagas } from '../models/vaga.js';

const router = express.Router();

// Get all parking spots
router.get('/', async (_, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM Vagas');
        const spots = rows.map(row => new Vagas(row.id, row.numero, row.tipo, row.disponivel));
        res.json(spots);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Get a single parking spot by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM Vagas WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Parking spot not found');
        const spot = new Vagas(rows[0].id, rows[0].numero, rows[0].tipo, rows[0].disponivel);
        res.json(spot);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Create a new parking spot
router.post('/', async (req, res) => {
    const { numero, tipo, disponivel } = req.body;
    try {
        const [result] = await connect.query('INSERT INTO Vagas (numero, tipo, disponivel) VALUES (?, ?, ?)', [numero, tipo, disponivel]);
        const newSpot = new Vagas(result.insertId, numero, tipo, disponivel);
        res.status(201).json(newSpot);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Update an existing parking spot
router.put('/:id', async (req, res) => {
    const { numero, tipo, disponivel } = req.body;
    try {
        const [result] = await connect.query('UPDATE Vagas SET numero = ?, tipo = ?, disponivel = ? WHERE id = ?', [numero, tipo, disponivel, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Parking spot not found');
        const updatedSpot = new Vagas(req.params.id, numero, tipo, disponivel);
        res.json(updatedSpot);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Delete a parking spot
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await connect.query('DELETE FROM Vagas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Parking spot not found');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

export const vagaRouter = router;