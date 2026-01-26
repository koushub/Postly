package com.Blog_Application.BlogServices;

import com.Blog_Application.Payload.PostDto;
import java.util.List;

public interface LikeService {
    boolean toggleLike(int postId, int userId);
    List<PostDto> getLikedPosts(int userId);
}
