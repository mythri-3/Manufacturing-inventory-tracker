import { useEffect, useState } from 'react';
import api from '../api.js';

const emptyForm = {
  material_name: '',
  category: '',
  unit: '',
  current_quantity: 0,
  reorder_level: 0,
  unit_cost: 0
};

function Materials({ refreshKey, onDataChange }) {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadMaterials = () => {
    api.get('/materials').then((response) => setMaterials(response.data));
  };

  useEffect(() => {
    loadMaterials();
  }, [refreshKey]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/materials/${editingId}`, form);
      } else {
        await api.post('/materials', form);
      }

      resetForm();
      onDataChange();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to save material.'
      );
    }
  };

  const editMaterial = (material) => {
    setEditingId(material.id);
    setForm({
      material_name: material.material_name,
      category: material.category,
      unit: material.unit,
      current_quantity: material.current_quantity,
      reorder_level: material.reorder_level,
      unit_cost: material.unit_cost
    });
  };

  const deleteMaterial = async (id) => {
    setError('');

    try {
      await api.delete(`/materials/${id}`);
      onDataChange();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to delete material.'
      );
    }
  };

  return (
    <section className="page-grid">
      <section className="panel">
        <div className="panel-heading">
          <h2>{editingId ? 'Edit Material' : 'Add Material'}</h2>
        </div>
        {error && <p className="error-message">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Material Name
            <input
              name="material_name"
              value={form.material_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Unit
            <input name="unit" value={form.unit} onChange={handleChange} required />
          </label>
          <label>
            Current Quantity
            <input
              name="current_quantity"
              type="number"
              min="0"
              step="0.01"
              value={form.current_quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Reorder Level
            <input
              name="reorder_level"
              type="number"
              min="0"
              step="0.01"
              value={form.reorder_level}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Unit Cost
            <input
              name="unit_cost"
              type="number"
              min="0"
              step="0.01"
              value={form.unit_cost}
              onChange={handleChange}
              required
            />
          </label>
          <div className="button-row">
            <button type="submit">{editingId ? 'Save Changes' : 'Add Material'}</button>
            {editingId && (
              <button className="secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <h2>All Materials</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Reorder</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td>{material.material_name}</td>
                  <td>{material.category}</td>
                  <td>{material.unit}</td>
                  <td>{material.current_quantity}</td>
                  <td>{material.reorder_level}</td>
                  <td>${Number(material.unit_cost).toFixed(2)}</td>
                  <td className="actions">
                    <button type="button" onClick={() => editMaterial(material)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => deleteMaterial(material.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default Materials;
