import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Eye, EyeOff, Edit, Save, X, Home, FileText, Construction, FolderKanban, Mail, Globe } from 'lucide-react';

const pageIcons = {
  home: Home,
  about: FileText,
  services: Construction,
  projects: FolderKanban,
  contact: Mail,
};

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const data = await api.get('/pages');
      setPages(data);
    } catch (error) {
      showToast('Failed to load pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (page) => {
    try {
      await api.put(`/pages/${page.slug}`, { visible: !page.visible });
      setPages(pages.map(p => p.slug === page.slug ? { ...p, visible: !p.visible } : p));
      showToast(`Page ${page.visible ? 'hidden' : 'visible'}`);
    } catch (error) {
      showToast('Failed to update page', 'error');
    }
  };

  const startEditing = (page) => {
    setEditingPage(page.slug);
    setEditForm({
      label: page.label,
      heroTitle: page.content?.heroTitle || '',
      heroSubtitle: page.content?.heroSubtitle || ''
    });
  };

  const cancelEditing = () => {
    setEditingPage(null);
    setEditForm({});
  };

  const savePage = async () => {
    setSaving(true);
    try {
      await api.put(`/pages/${editingPage}`, {
        label: editForm.label,
        content: {
          heroTitle: editForm.heroTitle,
          heroSubtitle: editForm.heroSubtitle
        }
      });
      setPages(pages.map(p =>
        p.slug === editingPage
          ? { ...p, label: editForm.label, content: { ...p.content, ...editForm } }
          : p
      ));
      setEditingPage(null);
      showToast('Page saved successfully');
    } catch (error) {
      showToast('Failed to save page', 'error');
    } finally {
      setSaving(false);
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
        <p className="text-gray-500 mt-1">Control page visibility and edit content.</p>
      </div>

      <div className="space-y-4">
        {pages.map((page) => {
          const Icon = pageIcons[page.slug] || Globe;
          const isEditing = editingPage === page.slug;

          return (
            <div key={page._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {isEditing ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Edit: {page.label}</h3>
                    <button onClick={cancelEditing} className="p-2 text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Page Label</label>
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={editForm.heroTitle}
                        onChange={(e) => setEditForm({ ...editForm, heroTitle: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                      <textarea
                        value={editForm.heroSubtitle}
                        onChange={(e) => setEditForm({ ...editForm, heroSubtitle: e.target.value })}
                        rows={3}
                        className="input resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={cancelEditing} className="btn-secondary">Cancel</button>
                    <button onClick={savePage} disabled={saving} className="btn-primary">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      page.visible ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{page.label}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          page.visible
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {page.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(page)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => toggleVisibility(page)}
                      className={`p-2 rounded-lg transition-colors ${
                        page.visible
                          ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {page.visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
