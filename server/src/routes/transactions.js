const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        stock_transactions.*,
        materials.material_name,
        materials.unit
      FROM stock_transactions
      JOIN materials ON materials.id = stock_transactions.material_id
      ORDER BY stock_transactions.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { material_id, transaction_type, quantity, notes } = req.body;
  const materialId = Number(material_id);
  const numericQuantity = Number(quantity);
  let client;

  try {
    if (!Number.isInteger(materialId) || materialId <= 0) {
      const error = new Error('Please select a valid material');
      error.status = 400;
      throw error;
    }

    if (!['IN', 'OUT'].includes(transaction_type)) {
      const error = new Error('Transaction type must be IN or OUT');
      error.status = 400;
      throw error;
    }

    if (numericQuantity <= 0 || Number.isNaN(numericQuantity)) {
      const error = new Error('Quantity must be greater than zero');
      error.status = 400;
      throw error;
    }

    client = await pool.connect();
    await client.query('BEGIN');

    const materialResult = await client.query(
      'SELECT * FROM materials WHERE id = $1 FOR UPDATE',
      [materialId]
    );

    if (!materialResult.rows.length) {
      const error = new Error('Material not found');
      error.status = 404;
      throw error;
    }

    const material = materialResult.rows[0];
    const currentQuantity = Number(material.current_quantity);
    const nextQuantity =
      transaction_type === 'IN'
        ? currentQuantity + numericQuantity
        : currentQuantity - numericQuantity;

    if (nextQuantity < 0) {
      const error = new Error('Stock out quantity cannot exceed current stock');
      error.status = 400;
      throw error;
    }

    const transactionResult = await client.query(
      `INSERT INTO stock_transactions
        (material_id, transaction_type, quantity, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [materialId, transaction_type, numericQuantity, notes || null]
    );

    await client.query(
      'UPDATE materials SET current_quantity = $1 WHERE id = $2',
      [nextQuantity, materialId]
    );

    await client.query('COMMIT');
    res.status(201).json(transactionResult.rows[0]);
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
