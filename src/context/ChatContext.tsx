import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  time: string;
  type: 'text' | 'payment' | 'application';
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'completed';
  receiptNumber?: string;
  jobTitle?: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  time: string;
  avatar: string;
  recipientId: string;
  messages: ChatMessage[];
  reported?: boolean;
  reportReason?: string;
}

interface ChatContextType {
  conversations: Conversation[];
  addConversation: (conv: Conversation) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  sendApplicationMessage: (recipientId: string, recipientName: string, jobTitle: string) => void;
  reportConversation: (conversationId: string, reason: string) => void;
  markAsRead: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialConversations: Conversation[] = [
  { 
    id: '1', 
    name: 'Event Pro MMC', 
    lastMessage: 'Əla, orda olacam!', 
    unread: 0, 
    time: '10:33', 
    avatar: 'E',
    recipientId: '4',
    messages: [
      { id: '1', text: 'Salam, sabahki iş üçün maraqlanırdım', sender: 'other', time: '10:30', type: 'text' },
      { id: '2', text: 'Bəli, hələ də aktualdir. Saat 9-da başlayacaq.', sender: 'user', time: '10:32', type: 'text' },
      { id: '3', text: 'Əla, orda olacam!', sender: 'other', time: '10:33', type: 'text' },
    ]
  },
  { 
    id: '2', 
    name: 'Orxan Əliyev', 
    lastMessage: 'Sabah görüşərik', 
    unread: 2, 
    time: '09:15', 
    avatar: 'O',
    recipientId: '5',
    messages: [
      { id: '1', text: 'Sabah görüşərik', sender: 'other', time: '09:15', type: 'text' },
    ]
  },
  { 
    id: '3', 
    name: 'Cafe Milano', 
    lastMessage: 'İş saatları...', 
    unread: 0, 
    time: 'Dünən', 
    avatar: 'C',
    recipientId: '2',
    messages: [
      { id: '1', text: 'İş saatları 18:00-23:00 arasıdır.', sender: 'other', time: 'Dünən', type: 'text' },
    ]
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const addConversation = useCallback((conv: Conversation) => {
    setConversations(prev => {
      const exists = prev.find(c => c.recipientId === conv.recipientId);
      if (exists) return prev;
      return [conv, ...prev];
    });
  }, []);

  const addMessage = useCallback((conversationId: string, message: ChatMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.text,
          time: message.time,
        };
      }
      return conv;
    }));
  }, []);

  const sendApplicationMessage = useCallback((recipientId: string, recipientName: string, jobTitle: string) => {
    const existingConv = conversations.find(c => c.recipientId === recipientId);
    const time = new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
    
    const applicationMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `"${jobTitle}" elanına müraciət etdim`,
      sender: 'user',
      time,
      type: 'application',
      jobTitle,
    };

    if (existingConv) {
      setConversations(prev => prev.map(conv => {
        if (conv.id === existingConv.id) {
          return {
            ...conv,
            messages: [...conv.messages, applicationMessage],
            lastMessage: applicationMessage.text,
            time,
          };
        }
        return conv;
      }));
    } else {
      const newConv: Conversation = {
        id: Date.now().toString(),
        name: recipientName,
        lastMessage: applicationMessage.text,
        unread: 0,
        time,
        avatar: recipientName.charAt(0),
        recipientId,
        messages: [applicationMessage],
      };
      setConversations(prev => [newConv, ...prev]);
    }
  }, [conversations]);

  const reportConversation = useCallback((conversationId: string, reason: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          reported: true,
          reportReason: reason,
        };
      }
      return conv;
    }));
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unread: 0 };
      }
      return conv;
    }));
  }, []);

  return (
    <ChatContext.Provider value={{ 
      conversations, 
      addConversation, 
      addMessage, 
      sendApplicationMessage,
      reportConversation,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
