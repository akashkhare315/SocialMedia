import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setIsLoading(true);
      try {
        const profileRes = await api.get(`/users/${username}`);
        setProfile(profileRes.data);

        const postsRes = await api.get(`/posts/user/${username}`);
        if (postsRes.data.success) {
          setPosts(postsRes.data.posts);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileAndPosts();
  }, [username]);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 4 }}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>User not found</h2>
        <Link to="/feed" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Return to Feed</Link>
      </div>
    );
  }

  return (
    <div className="profile-container animate-fade-in">
      <div className="card profile-header-card">
        <div className="profile-avatar-large">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info-main">
          <h1>{profile.username}</h1>
          <p className="profile-bio">{profile.bio || 'This user has no bio.'}</p>
          <div className="profile-meta">
            <span className="meta-item"><Calendar size={16}/> Joined {formatDate(profile.createdAt)}</span>
          </div>
        </div>
        {loggedInUser && loggedInUser.username === profile.username && (
          <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }} title="Coming soon">Edit Profile</button>
        )}
      </div>

      <div className="profile-feed">
        <h2 style={{ marginBottom: '1rem' }}>Posts by {profile.username}</h2>
        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            This user hasn't posted anything yet.
          </div>
        ) : (
          <div className="post-list">
            {posts.map(post => (
              <div key={post._id} className="card post-card">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">
                      {post.author?.username ? post.author.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span>{post.author?.username || 'Unknown User'}</span>
                  </div>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-content">
                  {post.text}
                </div>
                <div className="post-actions">
                  <button className="post-action-btn" title="Coming soon">
                    <Heart size={18} /> Like
                  </button>
                  <button className="post-action-btn" title="Coming soon">
                    <MessageCircle size={18} /> Comment
                  </button>
                  <button className="post-action-btn" style={{ marginLeft: 'auto' }} title="Coming soon">
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
