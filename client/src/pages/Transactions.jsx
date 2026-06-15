import { useEffect, useState } from 'react';
import api from '../api.js';

function Transactions({ refreshKey, onDataChange }) {
  const [materials, setMaterials] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    material_id: '',
    transaction_type: 'IN',
    quantity: 1,
    notes: ''
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    const [materialsResponse, transactionsResponse] = await Promise.all([
      api.get('/materials'),
      api.get('/transactions')
    ]);
    setMaterials(materialsResponse.data);
    setTransactions(transactionsResponse.data);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/transactions', form);
      setForm({
        material_id: '',
        transaction_type: 'IN',
        quantity: 1,
        notes: ''
      });
      onDataChange();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to save transaction.'
      );
    }
  };

  return (
    <section className="page-grid">
      <section className="panel">
        <div className="panel-heading">
          <h2>Record Stock Movement</h2>
        </div>
        {error && <p className="error-message">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Material
            <select
              name="material_id"
              value={form.material_id}
              onChange={handleChange}
              required
            >
              <option value="">Select material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.material_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select
              name="transaction_type"
              value={form.transaction_type}
              onChange={handleChange}
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </label>
          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </label>
          <button type="submit">Save Transaction</button>
        </form>
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <h2>Recent Transactions</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Material</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td>{transaction.material_name}</td>
                  <td>
                    <span
                      className={
                        transaction.transaction_type === 'IN'
                          ? 'pill in'
                          : 'pill out'
                      }
                    >
                      {transaction.transaction_type === 'IN'
                        ? 'Stock In'
                        : 'Stock Out'}
                    </span>
                  </td>
                  <td>
                    {transaction.quantity} {transaction.unit}
                  </td>
                  <td>{transaction.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default Transactions;
