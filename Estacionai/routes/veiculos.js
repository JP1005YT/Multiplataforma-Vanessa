import express from 'express';
import connect from '../config/connection.js';
import { Veiculo } from '../models/veiculo.js';

const router = express.Router();

// Get all vehicles
router.get('/', async (_, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM Veiculos');
        const vehicles = rows.map(row => new Veiculo(row.id, row.marca, row.modelo, row.ano, row.cor, row.cliente_id));
        res.json(vehicles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Get a single vehicle by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM Veiculos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Vehicle not found');
        const vehicle = new Veiculo(rows[0].id, rows[0].marca, rows[0].modelo, rows[0].ano, rows[0].cor, rows[0].cliente_id);
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Create a new vehicle
router.post('/', async (req, res) => {
    const { marca, modelo, ano, cor, cliente_id } = req.body;
    try {
        const [result] = await connect.query('INSERT INTO Veiculos (marca, modelo, ano, cor, cliente_id) VALUES (?, ?, ?, ?, ?)', [marca, modelo, ano, cor, cliente_id]);
        const newVehicle = new Veiculo(result.insertId, marca, modelo, ano, cor, cliente_id);
        res.status(201).json(newVehicle);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Update an existing vehicle
router.put('/:id', async (req, res) => {
    const { marca, modelo, ano, cor, cliente_id } = req.body;
    try {
        const [result] = await connect.query('UPDATE Veiculos SET marca = ?, modelo = ?, ano = ?, cor = ?, cliente_id = ? WHERE id = ?', [marca, modelo, ano, cor, cliente_id, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Vehicle not found');
        const updatedVehicle = new Veiculo(req.params.id, marca, modelo, ano, cor, cliente_id);
        res.json(updatedVehicle);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await connect.query('DELETE FROM Veiculos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Vehicle not found');
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

export const veiculoRouter = router;