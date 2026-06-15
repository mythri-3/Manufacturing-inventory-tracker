const express = require('express');
const pool = require('../db');

const router = express.Router();

function buildMaterialPayload(body) {
  const payload = {
    material_name: String(body.material_name || '').trim(),
    category: String(body.category || '').trim(),
    unit: String(body.unit || '').trim(),
    current_quantity: Number(body.current_quantity),
    reorder_level: Number(body.reorder_level),
    unit_cost: Number(body.unit_cost)
  };

  if (!payload.material_name || !payload.category || !payload.unit) {
    const error = new Error('Material name, category, and unit are required');
    error.status = 400;
    throw error;
  }

  if (
    [payload.current_quantity, payload.reorder_level, payload.unit_cost].some(
      (value) => Number.isNaN(value) || value < 0
    )
  ) {
    const error = new Error('Quantity, reorder level, and unit cost must be zero or greater');
    error.status = 400;
    throw error;
  }

  return payload;
}

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM materials ORDER BY material_name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      material_name,
      category,
      unit,
      current_quantity,
      reorder_level,
      unit_cost
    } = buildMaterialPayload(req.body);

    const result = await pool.query(
      `INSERT INTO materials
        (material_name, category, unit, current_quantity, reorder_level, unit_cost)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [material_name, category, unit, current_quantity, reorder_level, unit_cost]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const {
      material_name,
      category,
      unit,
      current_quantity,
      reorder_level,
      unit_cost
    } = buildMaterialPayload(req.body);

    const result = await pool.query(
      `UPDATE materials
       SET material_name = $1,
           category = $2,
           unit = $3,
           current_quantity = $4,
           reorder_level = $5,
           unit_cost = $6
       WHERE id = $7
       RETURNING *`,
      [material_name, category, unit, current_quantity, reorder_level, unit_cost, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({ message: 'Material deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
