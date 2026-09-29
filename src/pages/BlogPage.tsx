import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface BlogPageProps {
  navigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const { blogPosts } = useRealEstate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Market Intelligence</span>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          Real Estate Insights, Legal Analysis & Investment Trends
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Actionable intelligence on high-yield housing societies, FBR tax revisions, society transfer procedures, and macroeconomic real estate dynamics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-16/9 bg-slate-900 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-amber-700">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {post.readingTime}
                  </span>
                </div>

                <h2 className="text-xl font-display font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-700">{post.authorName}</span>
              </div>
              <span className="font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
