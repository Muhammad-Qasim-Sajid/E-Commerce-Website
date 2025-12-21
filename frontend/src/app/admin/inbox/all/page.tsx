'use client';

import { useState, useEffect } from 'react';
import MessageList from '../../../../components/admin/MessageList';

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type PaginatedResponse = {
  items: Message[];
  hasMore: boolean;
  nextCursor: string | null;
};

export default function AllMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const loadMessages = async (loadMore = false) => {
    if (loadMore && !cursor) return;

    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      // FIXED: Removed /contacts/ from path
      let url = `${process.env.NEXT_PUBLIC_API_URL}/contacts/get-all-contacts`;
      
      if (loadMore && cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`;
      }

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load messages`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to load messages');
      }

      const paginatedData = data.data as PaginatedResponse;

      if (loadMore) {
        setMessages(prev => [...prev, ...paginatedData.items]);
      } else {
        setMessages(paginatedData.items);
      }

      setHasMore(paginatedData.hasMore);
      setCursor(paginatedData.nextCursor);
      
      // For total count - you might need a separate endpoint for this
      // Or calculate based on first load if not paginated
      if (!loadMore) {
        setTotalCount(paginatedData.items.length);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={() => loadMessages(true)}
          isLoadingMore={isLoadingMore}
          type="all"
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}