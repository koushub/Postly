import React from 'react';
import PostCard from './PostCard';

const PostGrid = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-base-300 rounded-xl">
        <p className="text-xl font-semibold opacity-50">No stories found.</p>
        <p className="text-sm opacity-40 mt-2">Try changing your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <div key={post.postId} className="h-full">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;