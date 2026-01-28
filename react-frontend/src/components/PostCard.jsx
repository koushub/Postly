import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="
      card 
      bg-base-100 
      shadow-xl 
      hover:shadow-2xl 
      transition-shadow duration-300 
      h-full flex flex-col
      border border-base-200
    ">
      {/* Image */}
      <figure className="relative h-48 overflow-hidden">
        <Link to={`/post/${post.postId}`} className="w-full h-full">
          <img
            src={
              post.imageName
                ? post.imageName
                : "https://placehold.co/600x400?text=No+Image"
            }
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-2 right-2 pointer-events-none">
          <div className="
            badge badge-primary badge-outline 
            font-semibold 
            bg-base-100/80 backdrop-blur-sm
          ">
            {post.category?.categoryTitle || "Uncategorized"}
          </div>
        </div>
      </figure>

      {/* Body */}
      <div className="card-body flex-1">
        <Link to={`/post/${post.postId}`} className="hover:no-underline">
          <h2 className="card-title text-2xl font-bold hover:text-primary transition-colors cursor-pointer">
            {post.title}
          </h2>
        </Link>

        <p className="text-base-content/70 line-clamp-3 text-lg mt-2">
          {post.content}
        </p>

        <div className="divider my-3"></div>

        {/* Author */}
        <div className="card-actions justify-between items-center mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="
                bg-primary text-primary-content 
                rounded-full w-8 h-8 
                flex items-center justify-center
              ">
                <span className="text-base font-bold">
                  {post.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="uppercase font-bold text-base-content/50 text-xs">
                Author
              </span>
              <span className="text-lg font-bold truncate max-w-[100px]">
                {post.user?.name || "Unknown"}
              </span>
            </div>
          </div>

          <Link
            to={`/post/${post.postId}`}
            className="btn btn-sm btn-primary btn-outline rounded-lg text-sm"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
