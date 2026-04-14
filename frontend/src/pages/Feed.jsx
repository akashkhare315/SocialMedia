import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/posts', { text: newPostContent });
      if (response.data.success) {
        setNewPostContent('');
        fetchPosts(); 
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      // Handle potential 401 unauthorized if cookie expired
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="feed-container animate-fade-in">
      <div className="feed-header">
        <h1>Latest Updates</h1>
      </div>

      <div className="card create-post-card">
        <form onSubmit={handleCreatePost} className="create-post-form">
          <textarea
            placeholder={user ? "What's on your mind?" : "Log in to share your thoughts..."}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
            disabled={!user || isSubmitting}
          />
          <div className="create-post-actions">
            <span className="char-count">{newPostContent.length} / 280 characters</span>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!user || !newPostContent.trim() || isSubmitting || newPostContent.length > 280}
            >
              {isSubmitting ? <Loader2 size={18} className="spinner" /> : (
                <><Send size={16} /> Post</>
              )}
            </button>
          </div>
        </form>
      </div>

      {isLoadingFeed ? (
        <div className="loader-container">
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 4 }}></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          No posts found. Be the first to share something!
        </div>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <PostCard key={post._id} post={post} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
