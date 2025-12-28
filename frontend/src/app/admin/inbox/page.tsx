'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getCsrfToken } from '../../../lib/utils';
import Spinner from '../../../components/Spinner';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactsResponse {
  items: Contact[];
  hasMore: boolean;
  nextCursor: string | null;
}

export default function AllMessagesPage() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (cursor?: string) => {
    try {
      if (!cursor) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const csrfToken = getCsrfToken();
      let url = `${process.env.NEXT_PUBLIC_API_URL}/contacts/get-all-contacts`;
      
      if (cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`;
      }

      const response = await fetch(url, {
        credentials: 'include',
        headers: csrfToken ? { 'x-csrf-token': csrfToken } : {}
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const contactsData: ContactsResponse = data.data;
        
        if (cursor) {
          setMessages(prev => [...prev, ...contactsData.items]);
        } else {
          setMessages(contactsData.items);
        }
        
        setHasMore(contactsData.hasMore);
        setNextCursor(contactsData.nextCursor);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error); // Debug log
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor && hasMore && !loadingMore) {
      fetchMessages(nextCursor);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) return 'Just now';
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && messages.length === 0) {
    return (
      <Spinner />
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="min-h-screen bg-[#eeeceb]">
        <div className="p-4 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          </div>
          <div className="bg-white p-8 text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={() => fetchMessages()}
              className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight text-center sm:text-left">
            Messages
          </p>
        </div>

        <div>
          <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
            <span className="font-medium">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {/* Messages List */}
          <div className="bg-white">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-12 h-12 text-[#eae2d6] mx-auto mb-4" />
                <p className="text-[#666666]">No messages found</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#eae2d6]">
                  {messages.map((message) => (
                    <div key={message._id} className="p-4 sm:p-7">
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
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="p-6 text-center border-t border-[#eae2d6]">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="sm:px-6 px-3 text-xs sm:text-base py-2 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current inline-block mr-2"></div>
                          Loading...
                        </>
                      ) : (
                        "Load More Messages"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}