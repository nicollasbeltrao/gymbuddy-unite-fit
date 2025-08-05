import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  status: 'online' | 'offline' | 'last-seen';
  isNewMatch?: boolean;
  matchDate?: string;
  streak?: number;
  unreadCount: number;
  lastMessage: {
    text: string;
    time: string;
    isFromMe: boolean;
    type: 'text' | 'snap' | 'audio' | 'call' | 'workout';
    status: 'sent' | 'delivered' | 'read' | 'opened';
  };
}

interface ChatContextType {
  chatUsers: ChatUser[];
  addNewMatch: (profile: any) => void;
  updateLastMessage: (userId: number, message: ChatUser['lastMessage']) => void;
  markAsRead: (userId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

// Conversas iniciais
const initialChatUsers: ChatUser[] = [
  {
    id: 1,
    name: "Ana Silva",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    online: true,
    status: 'online',
    isNewMatch: true,
    matchDate: "2024-01-15",
    streak: 5,
    unreadCount: 2,
    lastMessage: {
      text: "🔥 Novo Snap",
      time: "2m",
      isFromMe: false,
      type: 'snap',
      status: 'sent'
    }
  },
  {
    id: 2,
    name: "Carlos Santos",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    online: false,
    lastSeen: "5m",
    status: 'last-seen',
    streak: 12,
    unreadCount: 0,
    lastMessage: {
      text: "Treino de pernas hoje foi incrível! 💪",
      time: "1h",
      isFromMe: false,
      type: 'text',
      status: 'read'
    }
  },
  {
    id: 3,
    name: "Marina Costa",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
    online: true,
    status: 'online',
    isNewMatch: true,
    matchDate: "2024-01-16",
    streak: 3,
    unreadCount: 1,
    lastMessage: {
      text: "📞 Chamada perdida",
      time: "15m",
      isFromMe: false,
      type: 'call',
      status: 'sent'
    }
  },
  {
    id: 4,
    name: "João Pereira",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    online: false,
    lastSeen: "1h",
    status: 'last-seen',
    streak: 8,
    unreadCount: 0,
    lastMessage: {
      text: "Amanhã às 7h no Smart Fit?",
      time: "2h",
      isFromMe: true,
      type: 'text',
      status: 'read'
    }
  },
  {
    id: 5,
    name: "Fernanda Lima",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    online: false,
    lastSeen: "30m",
    status: 'last-seen',
    streak: 15,
    unreadCount: 0,
    lastMessage: {
      text: "🎯 Meta semanal atingida!",
      time: "3h",
      isFromMe: false,
      type: 'workout',
      status: 'opened'
    }
  }
];

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>(initialChatUsers);

  const addNewMatch = (profile: any) => {
    const newChatUser: ChatUser = {
      id: Date.now(), // Usar timestamp como ID único
      name: profile.name,
      avatar: profile.image,
      online: false,
      lastSeen: "agora",
      status: 'last-seen',
      isNewMatch: true,
      matchDate: new Date().toISOString().split('T')[0],
      streak: 1,
      unreadCount: 1,
      lastMessage: {
        text: "🎉 Novo Match! Que tal conversarmos?",
        time: "agora",
        isFromMe: false,
        type: 'text',
        status: 'sent'
      }
    };

    setChatUsers(prev => [newChatUser, ...prev]);
  };

  const updateLastMessage = (userId: number, message: ChatUser['lastMessage']) => {
    setChatUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, lastMessage: message }
          : user
      )
    );
  };

  const markAsRead = (userId: number) => {
    setChatUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, unreadCount: 0, isNewMatch: false }
          : user
      )
    );
  };

  const value: ChatContextType = {
    chatUsers,
    addNewMatch,
    updateLastMessage,
    markAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 