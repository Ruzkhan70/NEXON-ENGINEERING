import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Plus, Edit2, Trash2, X, Image, Save, Users } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    description: '',
    website: ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.get('/clients');
      setClients(data);
    } catch (error) {
      showToast('Failed to load clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client._id);
      setForm({
        name: client.name,
        logo: client.logo,
        description: client.description,
        website: client.website
      });
    } else {
      setEditingClient(null);
      setForm({
        name: '',
        logo: '',
        description: '',
        website: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient}`, form);
        showToast('Client updated successfully');
      } else {
        await api.post('/clients', form);
        showToast('Client created successfully');
      }
      loadClients();
      closeModal();
    } catch (error) {
      showToast('Failed to save client', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await api.delete(`/clients/${id}`);
      setClients(clients.filter(c => c._id !== id));
      showToast('Client deleted');
    } catch (error) {
      showToast('Failed to delete client', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your client logos.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-500 mb-4">Add your first client logo.</p>
          <button onClick={() => openModal()} className="btn-primary">
            Add Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {clients.map((client) => (
            <div key={client._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center p-8">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain scale-110 transition-transform group-hover:scale-125"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-400">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(client)}
                    className="p-2 bg-white rounded-lg shadow-lg text-gray-600 hover:text-primary-600"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteClient(client._id)}
                    className="p-2 bg-white rounded-lg shadow-lg text-gray-600 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 text-center bg-white">
                <h3 className="font-semibold text-gray-900">{client.name}</h3>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  className="input"
                  placeholder="/images/client-logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="input"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="input resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
