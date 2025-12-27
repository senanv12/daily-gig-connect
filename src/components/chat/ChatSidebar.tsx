import { useState } from 'react';
import { MessageCircle, X, Send, ChevronRight, CreditCard, Check, Loader2, Flag, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useChat, ChatMessage, Conversation } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ChatSidebar() {
  const { isAuthenticated, user } = useAuth();
  const { conversations, addMessage, reportConversation, markAsRead } = useChat();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSendingPayment, setIsSendingPayment] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    
    addMessage(selectedConversation, message);
    setNewMessage('');
  };

  const generateReceiptNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'REC-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSendPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0 || !selectedConversation) {
      toast({
        title: 'Xəta',
        description: 'Düzgün məbləğ daxil edin.',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const receiptNumber = generateReceiptNumber();
    const paymentMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `${paymentAmount} AZN ödəniş göndərildi`,
      sender: 'user',
      time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      type: 'payment',
      paymentAmount: parseFloat(paymentAmount),
      paymentStatus: 'completed',
      receiptNumber,
    };
    
    addMessage(selectedConversation, paymentMessage);
    setPaymentAmount('');
    setShowPaymentModal(false);
    setIsSendingPayment(false);

    toast({
      title: 'Ödəniş göndərildi!',
      description: `${paymentAmount} AZN uğurla göndərildi. Çek: ${receiptNumber}`,
    });
  };

  const handleReport = () => {
    if (!reportReason.trim() || !selectedConversation) {
      toast({
        title: 'Xəta',
        description: 'Şikayət səbəbini qeyd edin.',
        variant: 'destructive',
      });
      return;
    }

    reportConversation(selectedConversation, reportReason);
    setReportReason('');
    setShowReportModal(false);

    toast({
      title: 'Şikayət göndərildi',
      description: 'Şikayətiniz baxılacaq.',
    });
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
    markAsRead(convId);
  };

  if (!isAuthenticated) return null;

  const isEmployer = user?.role === 'employer';

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-l-2xl shadow-lg transition-all duration-300 hover:pr-5 hover:shadow-xl",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Mesajlar</span>
        {totalUnread > 0 && (
          <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold shadow-md">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[420px] bg-card border-l border-border shadow-elevated z-50 transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <h3 className="font-semibold text-lg">Mesajlar</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {selectedConversation && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversation(null)}
                className="shrink-0 rounded-xl"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold shrink-0">
                {currentConversation.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium">{currentConversation.name}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Onlayn
                </p>
              </div>
              {/* Report Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReportModal(true)}
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>

            {/* Reported Banner */}
            {currentConversation.reported && (
              <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span>Bu söhbət üçün şikayət göndərildi</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] animate-fade-in",
                    message.sender === 'user' ? "ml-auto" : ""
                  )}
                >
                  {message.type === 'payment' ? (
                    <div className={cn(
                      "p-4 rounded-2xl",
                      message.sender === 'user'
                        ? "bg-success text-success-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">Ödəniş</span>
                        {message.paymentStatus === 'completed' && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </div>
                      <p className="text-2xl font-bold">{message.paymentAmount} AZN</p>
                      {message.receiptNumber && (
                        <div className="flex items-center gap-1 mt-2 text-xs opacity-80">
                          <FileText className="h-3.5 w-3.5" />
                          <span>Çek: {message.receiptNumber}</span>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-2">{message.time}</p>
                    </div>
                  ) : message.type === 'application' ? (
                    <div className={cn(
                      "p-3.5 rounded-2xl border-2 border-primary/30 bg-primary/5",
                      message.sender === 'user' ? "rounded-br-md" : "rounded-bl-md"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary">Müraciət</span>
                      </div>
                      <p className="text-sm text-foreground">{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{message.time}</p>
                    </div>
                  ) : (
                    <div className={cn(
                      "p-3.5 rounded-2xl",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    )}>
                      <p className="text-sm">{message.text}</p>
                      <p className={cn(
                        "text-xs mt-1.5",
                        message.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {message.time}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="p-4 border-t border-border bg-card animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Ödəniş göndər
                  </h4>
                  <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)} className="h-8 w-8 rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="pr-14 h-12 text-lg font-medium"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      AZN
                    </span>
                  </div>
                  <Button
                    onClick={handleSendPayment}
                    disabled={isSendingPayment}
                    className="h-12 px-6 bg-success hover:bg-success/90 text-white"
                  >
                    {isSendingPayment ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Göndər'
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ödəniş dərhal işçinin hesabına köçürüləcək. Çek məlumatları mesajda görünəcək.
                </p>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                {isEmployer && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPaymentModal(!showPaymentModal)}
                    className="shrink-0 h-12 w-12 rounded-xl border-2 border-success text-success hover:bg-success hover:text-white"
                  >
                    <CreditCard className="h-5 w-5" />
                  </Button>
                )}
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesaj yazın..."
                  className="flex-1 h-12 rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="shrink-0 h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Conversation List */
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Hələ mesaj yoxdur</p>
                <p className="text-sm text-muted-foreground/70 mt-1">İş elanlarına müraciət edəndə burada görünəcək</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold shrink-0 group-hover:bg-primary/20 transition-colors">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate flex items-center gap-2">
                        {conv.name}
                        {conv.reported && <Flag className="h-3 w-3 text-destructive" />}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-destructive" />
              Şikayət et
            </DialogTitle>
            <DialogDescription>
              Bu istifadəçi haqqında şikayət göndərin. Şikayətiniz yoxlanılacaq.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Şikayət səbəbini yazın..."
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportModal(false)}>
              Ləğv et
            </Button>
            <Button onClick={handleReport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Göndər
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
