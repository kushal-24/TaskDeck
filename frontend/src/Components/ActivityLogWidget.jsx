import React, { useEffect, useState } from "react";
import { getRecentActivityLogsApi } from "../Api/activity.api";
import { Activity, Clock, FileText, UserPlus, UserMinus, MessageSquare, Paperclip, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ActivityLogWidget = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getRecentActivityLogsApi();
        setLogs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case "TASK_CREATED": return <FileText className="w-4 h-4 text-emerald-400" />;
      case "STATUS_CHANGED": return <CheckCircle className="w-4 h-4 text-cyan-400" />;
      case "USER_ASSIGNED": return <UserPlus className="w-4 h-4 text-blue-400" />;
      case "USER_UNASSIGNED": return <UserMinus className="w-4 h-4 text-orange-400" />;
      case "COMMENT_ADDED": return <MessageSquare className="w-4 h-4 text-violet-400" />;
      case "ATTACHMENT_UPLOADED": return <Paperclip className="w-4 h-4 text-pink-400" />;
      case "ATTACHMENT_DELETED": return <Paperclip className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        Recent Activity
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-black/20 rounded-xl border border-white/5">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No recent activity found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {logs.map((log, idx) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {getActionIcon(log.actionType)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white mr-1">{log.performedBy?.fullName || 'User'}</span>
                    {log.message || log.actionType.replace(/_/g, ' ').toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(log.createdAt)}
                    {log.taskId?.title && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 truncate max-w-[150px] inline-block align-bottom">
                        {log.taskId.title}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ActivityLogWidget;
