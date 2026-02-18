import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Check,
    Clock,
    AlertCircle,
    Package,
    Activity,
    X,
    MessageSquare,
    ChevronRight
} from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'alert' | 'success' | 'info' | 'message';
    read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Device Update Required',
        message: 'Firmware v2.4 available for Pinnacle 360 (SN-8821).',
        time: '10m ago',
        type: 'alert',
        read: false
    },
    {
        id: '2',
        title: 'Order Delivered',
        message: 'Order #2026-001 has arrived at reception.',
        time: '1h ago',
        type: 'success',
        read: false
    },
    {
        id: '3',
        title: 'New Protocol Prescribed',
        message: 'Dr. Chen assigned "Circadian Reset" to Sarah C.',
        time: '3h ago',
        type: 'info',
        read: true
    },
    {
        id: '4',
        title: 'Academy Certification',
        message: 'Staff member "Alex" completed Module 2.',
        time: '1d ago',
        type: 'success',
        read: true
    }
];

export const NotificationCenter: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const removeNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case 'success': return <Check className="w-5 h-5 text-emerald-500" />;
            case 'info': return <Activity className="w-5 h-5 text-cyan-500" />;
            case 'message': return <MessageSquare className="w-5 h-5 text-indigo-500" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className="relative z-50">
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded-full transition-all relative ${open ? 'bg-cyan-50 text-cyan-600' : 'hover:bg-slate-100 text-slate-400'
                    }`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* Popover */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur">
                                <h3 className="font-bold text-slate-900">Notifications</h3>
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        onClick={clearAll}
                                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* List */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400">
                                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50">
                                        {notifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={`p-4 hover:bg-slate-50 transition-colors relative group cursor-pointer ${!notification.read ? 'bg-cyan-50/30' : ''
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-100 shadow-sm shrink-0`}>
                                                        {getIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-0.5">
                                                            <h4 className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                                {notification.title}
                                                            </h4>
                                                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Delete Action */}
                                                <button
                                                    onClick={(e) => removeNotification(notification.id, e)}
                                                    className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>

                                                {!notification.read && (
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full" />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-2 border-t border-slate-100 bg-slate-50">
                                <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 group">
                                    View settings <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
