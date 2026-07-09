import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { SectionLoader } from '../components/ui/index';
import { formatDate } from '../utils/helpers';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getOne(slug)
      .then(({ data }) => { setBlog(data.blog); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <SectionLoader />;
  if (!blog) return <div className="pt-32 text-center text-gray-400">Post not found</div>;

  return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/blog" className="text-sm text-gold-500 hover:underline mb-6 block">← Back to Blog</Link>
        {blog.coverImage && <img src={blog.coverImage} className="w-full h-64 object-cover mb-8" alt="" />}
        <span className="text-xs text-gold-500 uppercase tracking-widest">{blog.category?.replace(/-/g, ' ')}</span>
        <h1 className="font-display text-4xl text-navy-500 mt-2 mb-4">{blog.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-200">
          <span>{blog.author?.firstName} {blog.author?.lastName}</span>
          <span>·</span><span>{formatDate(blog.publishedAt)}</span>
          {blog.views > 0 && <><span>·</span><span>{blog.views} views</span></>}
        </div>
        <div className="text-gray-600 leading-relaxed whitespace-pre-line">{blog.content}</div>
      </div>
    </div>
  );
}
