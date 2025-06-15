// frontend/src/pages/ProductForm.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductForm() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    countInStock: '',
    category: '',
    brand: '',
    recycledContentRatio: '',
    transportDistance: '',
    packagingWeight: '',
    materialComposition: [{ name: '', ratio: '' }],
    certifications: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load materials and certificates
    axios.get('/api/options/materials')
      .then(res => setMaterials(res.data))
      .catch(err => console.error('Error loading materials:', err));
    axios.get('/api/options/certifications')
      .then(res => setCerts(res.data))
      .catch(err => console.error('Error loading certs:', err));
  }, []);

  // Compute totalRatio via useMemo so it's always up-to-date
  const totalRatio = useMemo(() => {
    const sum = form.materialComposition.reduce((acc, c) => {
      const r = parseFloat(c.ratio);
      return acc + (isNaN(r) ? 0 : r);
    }, 0);
    return sum;
  }, [form.materialComposition]);

  // Determine whether we can add another blank material row:
  const canAdd = totalRatio < 1 - 1e-8;

  // Debug logs to console:
  useEffect(() => {
    console.log('[Material Composition] totalRatio:', totalRatio);
    console.log('[Material Composition] canAdd:', canAdd);
  }, [totalRatio, canAdd]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCompChange = (index, field, value) => {
    setError('');
    setForm(prev => {
      const comps = [...prev.materialComposition];
      if (field === 'ratio') {
        if (value === '') {
          comps[index][field] = '';
        } else {
          const parsed = parseFloat(value);
          if (isNaN(parsed) || parsed < 0) {
            return prev;
          }
          const otherSum = comps.reduce((sum, c, idx) => {
            if (idx !== index) {
              const r = parseFloat(c.ratio);
              return sum + (isNaN(r) ? 0 : r);
            }
            return sum;
          }, 0);
          if (otherSum + parsed > 1 + 1e-8) {
            setError(`Cannot set ratio to ${parsed}. Remaining allowance is ${(1 - otherSum).toFixed(2)}.`);
            return prev;
          }
          comps[index][field] = parsed.toString();
        }
      } else if (field === 'name') {
        comps[index][field] = value;
      }
      return { ...prev, materialComposition: comps };
    });
  };

  const addComposition = () => {
    if (canAdd) {
      setError('');
      setForm(prev => ({
        ...prev,
        materialComposition: [...prev.materialComposition, { name: '', ratio: '' }]
      }));
    } else {
      setError('Cannot add more materials: total already reaches 1.');
    }
  };

  const handleCertToggle = name => {
    setForm(prev => {
      const exists = prev.certifications.includes(name);
      const newList = exists
        ? prev.certifications.filter(c => c !== name)
        : [...prev.certifications, name];
      return { ...prev, certifications: newList };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (Math.abs(totalRatio - 1) > 1e-6) {
      setError(`Total material composition must sum exactly to 1 before saving. Current sum: ${totalRatio.toFixed(2)}`);
      return;
    }
    setLoading(true);
    try {
      // No Authorization header now—just send the form data
      const response = await axios.post('/api/products', form);
      console.log('Product created:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Submission error:', err);
      // Show backend error message if any
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['name','image','price','countInStock','category','brand','recycledContentRatio','transportDistance','packagingWeight'].map(field => (
            <input
              key={field}
              name={field}
              type={
                ['price','countInStock','transportDistance','packagingWeight','recycledContentRatio'].includes(field) 
                  ? 'number' 
                  : 'text'
              }
              step={field==='recycledContentRatio' || field==='packagingWeight' ? '0.01' : undefined}
              min={field==='recycledContentRatio' ? '0' : undefined}
              max={field==='recycledContentRatio' ? '1' : undefined}
              placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={form[field]}
              onChange={handleChange}
              required={field!=='brand'}
              className="border p-2 rounded"
            />
          ))}
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Material Composition */}
        <h3 className="text-lg font-medium">
          Material Composition (Total: {totalRatio.toFixed(2)})
        </h3>
        {form.materialComposition.map((comp, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <select
              value={comp.name}
              onChange={e => handleCompChange(idx, 'name', e.target.value)}
              className="flex-1 border p-2 rounded"
              required
            >
              <option value="" disabled>Select a material…</option>
              {materials.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={comp.ratio}
              onChange={e => handleCompChange(idx, 'ratio', e.target.value)}
              className="w-24 border p-2 rounded"
              required
            />
          </div>
        ))}
        {Math.abs(totalRatio - 1) > 1e-6 && (
          <div className="text-yellow-600 mb-2">
            The sum of all material ratios must equal 1. Current sum: {totalRatio.toFixed(2)}.
          </div>
        )}
        <button
          type="button"
          onClick={addComposition}
          disabled={!canAdd}
          className={`px-4 py-2 text-white rounded ${
            canAdd ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Add Material
        </button>

        {/* Certifications */}
        <h3 className="text-lg font-medium">Certifications</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {certs.map(name => (
            <label key={name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.certifications.includes(name)}
                onChange={() => handleCertToggle(name)}
                className="rounded"
              />
              <span>{name}</span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || Math.abs(totalRatio - 1) > 1e-6}
          className={`w-full px-6 py-3 text-white font-semibold rounded ${
            (!loading && Math.abs(totalRatio - 1) <= 1e-6) 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
