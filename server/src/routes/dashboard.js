const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const summary = await pool.query(`
      SELECT
        COUNT(*)::int AS total_materials,
        COUNT(*) FILTER (WHERE current_quantity <= reorder_level)::int AS low_stock_count,
        COALESCE(SUM(current_quantity * unit_cost), 0)::numeric(12, 2) AS total_stock_value
      FROM materials
    `);

    const stockByMaterial = await pool.query(`
      SELECT material_name, current_quantity
      FROM materials
      ORDER BY material_name ASC
    `);

    res.json({
      summary: summary.rows[0],
      stockByMaterial: stockByMaterial.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
