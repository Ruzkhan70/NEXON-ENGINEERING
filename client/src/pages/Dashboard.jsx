import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  FolderKanban,
  Handshake,
  MessageSquare,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, subtext }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalClients: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalPages: 5
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, messagesData] = await Promise.all([
        api.get('/stats'),
        api.get('/messages').catch(() => ({ slice: () => [] }))
      ]);
      
      setStats(statsData);
      setRecentMessages(Array.isArray(messagesData) ? messagesData.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="bg-blue-500"
        />
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={stats.totalProjects}
          color="bg-emerald-500"
        />
        <StatCard
          icon={Handshake}
          label="Clients"
          value={stats.totalClients}
          color="bg-purple-500"
        />
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={stats.totalMessages}
          color="bg-orange-500"
          subtext={`${stats.unreadMessages} unread`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
            <MessageSquare className="text-gray-400" size={20} />
          </div>
          
          {recentMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message._id}
                  className={`p-4 rounded-lg border ${
                    message.status === 'new'
                      ? 'bg-primary-50 border-primary-100'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.status === 'new' ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-500">{message.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Overview</h2>
            <TrendingUp className="text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-green-600" size={20} />
                </div>
                <span className="text-gray-700">Pages Visible</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{stats.totalPages}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <span className="text-gray-700">Content Sections</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">5</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stats.unreadMessages > 0 ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  {stats.unreadMessages > 0 ? (
                    <AlertCircle className="text-orange-600" size={20} />
                  ) : (
                    <CheckCircle className="text-green-600" size={20} />
                  )}
                </div>
                <span className="text-gray-700">Inbox Status</span>
              </div>
              <span className={`text-sm font-medium ${
                stats.unreadMessages > 0 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {stats.unreadMessages > 0 ? `${stats.unreadMessages} pending` : 'All caught up'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
