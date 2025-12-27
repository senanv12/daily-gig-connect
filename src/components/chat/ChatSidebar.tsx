import { useState } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  time: string;
}

const mockMessages: Message[] = [
  { id: '1', text: 'Salam, sabahki iş üçün maraqlanırdım', sender: 'other', time: '10:30' },
  { id: '2', text: 'Bəli, hələ də aktualdir. Saat 9-da başlayacaq.', sender: 'user', time: '10:32' },
  { id: '3', text: 'Əla, orda olacam!', sender: 'other', time: '10:33' },
];

const mockConversations = [
  { id: '1', name: 'Event Pro MMC', lastMessage: 'Əla, orda olacam!', unread: 0, time: '10:33' },
  { id: '2', name: 'Orxan Əliyev', lastMessage: 'Sabah görüşərik', unread: 2, time: '09:15' },
  { id: '3', name: 'Cafe Milano', lastMessage: 'İş saatları...', unread: 0, time: 'Dünən' },
];

export function ChatSidebar() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1 bg-primary text-primary-foreground px-3 py-4 rounded-l-xl shadow-lg transition-all hover:pr-4",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Chat</span>
        <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold">
          2
        </span>
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-elevated z-50 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">Mesajlar</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversation(null)}
                className="shrink-0"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
              <div className="flex-1">
                <p className="font-medium">
                  {mockConversations.find(c => c.id === selectedConversation)?.name}
                </p>
                <p className="text-xs text-muted-foreground">Onlayn</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl",
                    message.sender === 'user'
                      ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {message.time}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesaj yazın..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Conversation List */
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left border-b border-border"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                  {conv.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
