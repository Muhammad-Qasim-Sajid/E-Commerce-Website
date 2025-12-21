'use client';

import { useState } from 'react';
import { MailOpen, Clock } from 'lucide-react';

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  phone?: string;
};

const messagesData: Message[] = [
  {
    _id: '1',
    name: 'Alexander Rothschild',
    email: 'alex@email.com',
    subject: 'Product Inquiry - Chronograph Pro',
    message: 'I would like to know more about the materials used in the Chronograph Pro. Specifically, what type of sapphire crystal is used?',
    isRead: false,
    createdAt: '2024-02-20T10:30:00Z',
    phone: '+1234567890'
  },
  {
    _id: '2',
    name: 'Emma Chen',
    email: 'emma.chen@email.com',
    subject: 'Order #GW-2024-7890 Status',
    message: 'Could you please provide an update on the shipping status of my order? It\'s been a week since confirmation.',
    isRead: true,
    createdAt: '2024-02-19T14:20:00Z'
  },
  {
    _id: '3',
    name: 'James Wilson',
    email: 'james.w@email.com',
    subject: 'Customization Request',
    message: 'I\'m interested in purchasing the Classic Dress Watch but would like to know if personal engraving is available on the case back.',
    isRead: false,
    createdAt: '2024-02-19T09:15:00Z',
    phone: '+1234567892'
  },
  {
    _id: '4',
    name: 'Sophia Martinez',
    email: 'sophia.m@email.com',
    subject: 'Return Request - Order #GW-2024-6555',
    message: 'I received the wrong size for the watch. The strap is too small. How do I initiate a return and exchange?',
    isRead: true,
    createdAt: '2024-02-18T16:45:00Z'
  },
  {
    _id: '5',
    name: 'Michael Tanaka',
    email: 'm.tanaka@email.com',
    subject: 'Wholesale Inquiry',
    message: 'I represent a luxury goods retailer in Tokyo and would like to discuss wholesale pricing for your collection.',
    isRead: true,
    createdAt: '2024-02-17T11:10:00Z'
  },
  {
    _id: '6',
    name: 'Olivia Brown',
    email: 'olivia.b@email.com',
    subject: 'Warranty Question',
    message: 'Does the international warranty cover servicing in Switzerland? I travel frequently between countries.',
    isRead: false,
    createdAt: '2024-02-17T13:30:00Z'
  },
  {
    _id: '7',
    name: 'Robert Garcia',
    email: 'robert.g@email.com',
    subject: 'Product Availability - Limited Edition',
    message: 'When will the limited edition skeleton watch be back in stock? I missed the last release.',
    isRead: true,
    createdAt: '2024-02-16T15:00:00Z'
  },
  {
    _id: '8',
    name: 'Charlotte Lee',
    email: 'charlotte.l@email.com',
    subject: 'Gift Packaging',
    message: 'Do you offer special gift packaging for watches? I want to make it extra special for my husband\'s anniversary.',
    isRead: false,
    createdAt: '2024-02-16T12:45:00Z'
  }
];

type TabType = 'all' | 'unread' | 'read';

export default function AdminInbox() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [messages, setMessages] = useState<Message[]>(messagesData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) {
        return 'Just now';
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleReadStatus = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg._id === messageId ? { ...msg, isRead: !msg.isRead } : msg
    ));
  };

  const filteredMessages = messages.filter(message => {
    if (activeTab === 'unread') return !message.isRead;
    if (activeTab === 'read') return message.isRead;
    return true; // 'all'
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const readCount = messages.filter(msg => msg.isRead).length;

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight text-center sm:text-left">
            Inbox
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-6 bg-white">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 font-medium transition-colors relative ${
              activeTab === "all"
                ? "text-[#1a1a1a] text-sm"
                : "text-[#666666] hover:text-[#1a1a1a] text-xs"
            }`}
          >
            <div className="flex items-center justify-center gap-1 cursor-pointer">
              All
              <span className="bg-[#f9f7f3] text-[#666666] text-xs px-2 py-0.5 rounded-full">
                {messages.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 font-medium transition-colors relative ${
              activeTab === "unread"
                ? "text-[#1a1a1a] text-sm"
                : "text-[#666666] hover:text-[#1a1a1a] text-xs"
            }`}
          >
            <div className="flex items-center justify-center gap-1 cursor-pointer">
              Unread
              {unreadCount > 0 && (
                <span className="bg-[#d4af37] text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("read")}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 font-medium transition-colors relative ${
              activeTab === "read"
                ? "text-[#1a1a1a] text-sm"
                : "text-[#666666] hover:text-[#1a1a1a] text-xs"
            }`}
          >
            <div className="flex items-center justify-center gap-1 cursor-pointer">
              Read
              {readCount > 0 && (
                <span className="bg-[#f9f7f3] text-[#666666] text-xs px-2 py-0.5 rounded-full">
                  {readCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Messages List */}
        <div className="bg-white">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <MailOpen className="w-12 h-12 text-[#eae2d6] mx-auto mb-4" />
              <p className="text-[#666666]">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#eae2d6]">
              {filteredMessages.map((message) => (
                <div key={message._id} className={`p-4 sm:p-6`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Sender Info */}
                    <div className="lg:w-1/4 space-y-3">
                      <div className="flex-1 space-y-0.5">
                        <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight">
                          {message.name}
                        </p>
                        <p className="text-xs text-[#666666] truncate">
                          {message.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-[#666666]">
                          <Clock className="w-3 h-3" />
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="lg:w-2/4 space-y-2">
                      <p className="font-medium text-[#1a1a1a] text-sm sm:text-base">
                        {message.subject}
                      </p>
                      <p className="text-sm text-[#666666]">
                        {message.message}
                      </p>
                    </div>

                    {activeTab == "all" ? (
                      <div
                        className="lg:w-1/4 flex flex-col items-start lg:items-end gap-2"
                        onClick={() => toggleReadStatus(message._id)}
                      >
                        <p className={`text-xs text-white px-3 py-1 rounded-full ${message.isRead ? `bg-[#1a1a1a]` : `bg-[#d4af37]`}`}>
                          {message.isRead ? "Read" : "Unread"}
                        </p>
                      </div>
                    ) : (
                      <div
                        className="lg:w-1/4 flex flex-col items-start lg:items-end gap-2"
                        onClick={() => toggleReadStatus(message._id)}
                      >
                        <p className="text-xs text-[#666666] transition-colors px-3 py-1 border border-[#eae2d6] cursor-pointer">
                          {message.isRead ? "Mark as Unread" : "Mark as Read"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666666] tracking-tight">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
              <span>{unreadCount} unread</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#eae2d6] rounded-full"></div>
              <span>{readCount} read</span>
            </div>
          </div>
          <div>
            Showing {filteredMessages.length} of {messages.length} messages
          </div>
        </div>
      </div>
    </div>
  );
}