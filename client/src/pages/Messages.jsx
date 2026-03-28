import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Mail, User, Clock, Trash2, CheckCircle, MailOpen, Reply, X } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await api.get('/messages');
      setMessages(data);
    } catch (error) {
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/messages/${id}`, { status: 'read' });
      setMessages(messages.map(m =>
        m._id === id ? { ...m, status: 'read' } : m
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      showToast('Message deleted');
    } catch (error) {
      showToast('Failed to delete message', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => m.status === 'new').length;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl" />
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
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Inbox</h2>
          </div>

          {messages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'new') markAsRead(message._id);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    message.status === 'new' ? 'bg-primary-50/50' : ''
                  } ${selectedMessage?._id === message._id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.status === 'new'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium truncate ${
                          message.status === 'new' ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {message.name}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{message.email}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{message.message}</p>
                    </div>
                    {message.status === 'new' && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedMessage.status === 'read' ? (
                    <MailOpen className="text-gray-400" size={20} />
                  ) : (
                    <Mail className="text-primary-500" size={20} />
                  )}
                  <h2 className="font-semibold text-gray-900">Message Details</h2>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMessage.name}</p>
                    <p className="text-sm text-primary-600">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-xs text-gray-500">{selectedMessage.phone}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Clock size={14} />
                    <span>{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                  {selectedMessage.subject && (
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Subject: {selectedMessage.subject}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Reply size={16} />
                    Reply via Email
                  </a>
                  {selectedMessage.status !== 'read' && (
                    <button
                      onClick={() => markAsRead(selectedMessage._id)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-gray-300" size={32} />
                </div>
                <p className="text-gray-500">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
