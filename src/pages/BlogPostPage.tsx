import React, { useMemo } from 'react';
import { Clock, Calendar, ArrowLeft, Share2, Check } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface BlogPostPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, navigate }) => {
  const { blogPosts, addToast } = useRealEstate();

  const post = useMemo(() => {
    return blogPosts.find((b) => b.slug === slug || b.id === slug) || blogPosts[0];
  }, [blogPosts, slug]);

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Article link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-amber-700">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between pt-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-900">{post.authorName}</p>
              <p className="text-slate-400">Senior Real Estate Market Analyst</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            title="Share"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Featured Graphic */}
      <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed space-y-4">
        <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-lg text-xs italic text-amber-950">
          {post.excerpt}
        </div>

        <div className="whitespace-pre-line text-slate-700 text-sm leading-relaxed space-y-3">
          {post.content}
        </div>
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-2">
        {post.tags.map((t, idx) => (
          <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            #{t}
          </span>
        ))}
      </div>
    </article>
  );
};
