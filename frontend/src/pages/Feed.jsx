import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
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
    if (!newPostContent.trim() && !selectedImage) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('text', newPostContent);
      if (selectedImage) formData.append('image', selectedImage);

      const response = await api.post('/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setNewPostContent('');
        setSelectedImage(null);
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

          {selectedImage && (
            <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block' }}>
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ maxHeight: '150px', borderRadius: '8px' }} />
              <button 
                type="button" 
                onClick={() => setSelectedImage(null)} 
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}
              >×</button>
            </div>
          )}

          <div className="create-post-actions" style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)' }}>
                <ImageIcon size={20} />
                <span style={{ fontSize: '0.9rem' }}>Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }} 
                  disabled={!user || isSubmitting}
                />
              </label>
              <span className="char-count">{newPostContent.length} / 280 characters</span>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!user || (!newPostContent.trim() && !selectedImage) || isSubmitting || newPostContent.length > 280}
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
