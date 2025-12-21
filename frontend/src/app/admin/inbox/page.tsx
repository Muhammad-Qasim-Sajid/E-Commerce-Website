'use client';

import { Inbox, Mail, MailOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InboxMainPage() {
  const inboxLinks = [
    {
      id: 'all',
      title: 'All Messages',
      description: 'View all contact messages',
      icon: Inbox,
      href: '/admin/inbox/all',
      color: 'text-blue-600',
      borderColor: 'border-blue-600',
    },
    {
      id: 'unread',
      title: 'Unread Messages',
      description: 'Messages that require your attention',
      icon: Mail,
      href: '/admin/inbox/unread',
      color: 'text-[#d4af37]',
      borderColor: 'border-[#d4af37]',
    },
    {
      id: 'read',
      title: 'Read Messages',
      description: 'Messages you have already reviewed',
      icon: MailOpen,
      href: '/admin/inbox/read',
      color: 'text-[#1a1a1a]',
      borderColor: 'border-[#1a1a1a]',
    }
  ];

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2">
              Inbox
            </div>
          </div>
        </div>

        {/* Inbox Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inboxLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="bg-white"
            >
              <div className="p-6 pl-7">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 border ${link.borderColor}`}>
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                </div>
                <div>
                  <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] tracking-tight mb-2">
                    {link.title}
                  </p>
                  <p className="text-sm text-[#666666] mb-4">
                    {link.description}
                  </p>
                  <div className="flex items-center gap-1 text-[#1a1a1a] text-sm font-medium">
                    <span>View Messages</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}