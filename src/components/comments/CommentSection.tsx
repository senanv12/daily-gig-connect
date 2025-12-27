import { useState } from 'react';
import { Star, Send, User, MoreHorizontal, Flag, ThumbsUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  rating?: number;
  createdAt: Date;
  likes: number;
  likedBy: string[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, rating?: number) => void;
  onLikeComment: (commentId: string) => void;
  onReportComment: (commentId: string, reason: string) => void;
  showRating?: boolean;
  title?: string;
}

export function CommentSection({
  comments,
  onAddComment,
  onLikeComment,
  onReportComment,
  showRating = true,
  title = 'Şərhlər',
}: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Daxil olun',
        description: 'Şərh yazmaq üçün hesabınıza daxil olun.',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Xəta',
        description: 'Şərh mətni boş ola bilməz.',
        variant: 'destructive',
      });
      return;
    }

    if (showRating && rating === 0) {
      toast({
        title: 'Xəta',
        description: 'Zəhmət olmasa reytinq seçin.',
        variant: 'destructive',
      });
      return;
    }

    onAddComment(newComment, showRating ? rating : undefined);
    setNewComment('');
    setRating(0);
    toast({
      title: 'Şərh əlavə edildi',
      description: 'Şərhiniz uğurla göndərildi.',
    });
  };

  const handleReport = (commentId: string) => {
    onReportComment(commentId, 'Uyğunsuz məzmun');
    toast({
      title: 'Şikayət göndərildi',
      description: 'Şikayətiniz baxılacaq.',
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'İndicə';
    if (minutes < 60) return `${minutes} dəqiqə əvvəl`;
    if (hours < 24) return `${hours} saat əvvəl`;
    if (days < 7) return `${days} gün əvvəl`;
    return new Date(date).toLocaleDateString('az-AZ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">{comments.length} şərh</span>
      </div>

      {/* Add Comment Form */}
      <div className="bg-muted/30 rounded-xl p-4 space-y-4">
        {showRating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reytinq:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      (hoveredRating || rating) >= star
                        ? "text-gold fill-gold"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Şərhinizi yazın..." : "Şərh yazmaq üçün daxil olun"}
          className="bg-background min-h-[100px]"
          disabled={!isAuthenticated}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!isAuthenticated || !newComment.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4 mr-2" />
            Göndər
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Hələ şərh yoxdur. İlk şərhi siz yazın!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="bg-card border border-border rounded-xl p-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold shrink-0">
                    {comment.userAvatar || comment.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{comment.userName}</span>
                      {comment.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-3.5 w-3.5",
                                star <= comment.rating!
                                  ? "text-gold fill-gold"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className={cn(
                          "flex items-center gap-1 text-sm transition-colors",
                          comment.likedBy.includes(user?.id || '')
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleReport(comment.id)}>
                      <Flag className="h-4 w-4 mr-2" />
                      Şikayət et
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
