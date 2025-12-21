// components/admin/MessageList.tsx - FIXED VERSION
'use client';

import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCsrfToken } from '../../lib/utils';
import Spinner from '../Spinner';

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  phone?: string;
};

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  type: 'all' | 'unread' | 'read';
  totalCount?: number; // Added total count prop
}

export default function MessageList({
  messages,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
  type,
  totalCount,
}: MessageListProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  // Update local messages when parent messages change
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const formatDate = (dateString: string) => {
    try {
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
    } catch {
      return 'Unknown date';
    }
  };

  const toggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    try {
      const csrfToken = getCsrfToken();
      const endpoint = currentStatus ? 'mark-unread-contact' : 'mark-read-contact';
      
      // FIXED: Removed /contacts/ from path
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${messageId}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken && { 'x-csrf-token': csrfToken }),
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark message as ${currentStatus ? 'unread' : 'read'}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || `Failed to mark message as ${currentStatus ? 'unread' : 'read'}`);
      }

      // Update local state - remove message if it's in wrong tab now
      if (type === 'unread' && !currentStatus) {
        // Message was unread, now marked as read - remove from unread list
        setLocalMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else if (type === 'read' && currentStatus) {
        // Message was read, now marked as unread - remove from read list
        setLocalMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else {
        // Just update read status
        setLocalMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === messageId ? { ...msg, read: !currentStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error toggling read status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update message status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <>
      {/* Title with Count */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight">
            {type === 'all' && 'All Messages'}
            {type === 'unread' && 'Unread Messages'}
            {type === 'read' && 'Read Messages'}
          </p>
          {totalCount !== undefined && (
            <div className="text-sm text-[#666666]">
              <span className="font-medium">{localMessages.length}</span>
              {totalCount > localMessages.length && ` of ${totalCount}`} messages
            </div>
          )}
        </div>
        
        {/* Stats */}
        {type === 'all' && localMessages.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-[#666666] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
              <span>{localMessages.filter(m => !m.read).length} unread</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#1a1a1a] rounded-full"></div>
              <span>{localMessages.filter(m => m.read).length} read</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="bg-white">
        {localMessages.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-[#eae2d6] mx-auto mb-4" />
            <p className="text-[#666666]">No messages found</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#eae2d6]">
              {localMessages.map((message) => (
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
                        {message.phone && (
                          <p className="text-xs text-[#666666]">
                            Phone: {message.phone}
                          </p>
                        )}
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

                    {/* Status Button */}
                    <div className="lg:w-1/4 flex flex-col items-start lg:items-end gap-2">
                      {type === 'all' ? (
                        <div 
                          className="cursor-pointer"
                          onClick={() => toggleReadStatus(message._id, message.read)}
                        >
                          <span className={`text-xs text-white px-3 py-1 rounded-full ${message.read ? `bg-[#1a1a1a]` : `bg-[#d4af37]`}`}>
                            {message.read ? "Read" : "Unread"}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleReadStatus(message._id, message.read)}
                          className="text-xs text-[#666666] transition-colors px-3 py-1 border border-[#eae2d6] hover:bg-[#f9f7f3] cursor-pointer"
                        >
                          {message.read ? "Mark as Unread" : "Mark as Read"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="p-6 text-center border-t border-[#eae2d6]">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More Messages'}
                </button>
                <p className="text-xs text-[#888888] mt-2">
                  Showing {localMessages.length} messages
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}