import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function PostCard({ post, user }) {
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(user && post.likes?.includes(user._id));
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async () => {
    if (!user) return; 
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    setIsSubmittingComment(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: newComment });
      if (res.data.success) {
        setComments([...comments, res.data.comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="post-author">
          <Link to={`/profile/${post.author?.username}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
            <div className="author-avatar">
              {post.author?.username ? post.author.username.charAt(0).toUpperCase() : '?'}
            </div>
            <span>{post.author?.username || 'Unknown User'}</span>
          </Link>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      <div className="post-content">
        {post.text}
      </div>
      
      <div className="post-actions">
        <button 
          className="post-action-btn" 
          onClick={handleLike} 
          style={{ color: isLiked ? 'var(--accent)' : 'var(--text-secondary)' }}
          title={user ? "Like post" : "Log in to like"}
        >
          <Heart size={18} fill={isLiked ? "var(--accent)" : "none"} /> {likesCount > 0 ? likesCount : 'Like'}
        </button>
        <button 
          className="post-action-btn" 
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={18} /> {comments.length > 0 ? comments.length : 'Comment'}
        </button>
        <button className="post-action-btn" style={{ marginLeft: 'auto' }} title="Coming soon">
          <Share2 size={18} /> Share
        </button>
      </div>

      {showComments && (
        <div className="comments-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          {comments.map((comment, index) => (
            <div key={index} className="comment-item" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <Link to={`/profile/${comment.author?.username}`} style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}>
                {comment.author?.username || 'Unknown User'}
              </Link>
              <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem', fontSize: '0.8rem' }}>
                {formatDate(comment.createdAt)}
              </span>
              <p style={{ marginTop: '0.25rem' }}>{comment.text}</p>
            </div>
          ))}
          
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder={user ? "Write a comment..." : "Log in to comment"} 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user || isSubmittingComment}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!user || !newComment.trim() || isSubmittingComment}
              style={{ padding: '0.5rem 1rem' }}
            >
              {isSubmittingComment ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
