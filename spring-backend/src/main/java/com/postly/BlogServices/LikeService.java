package com.postly.BlogServices;

import com.postly.Payload.PostDto;
import java.util.List;

public interface LikeService {
    boolean toggleLike(int postId, int userId);
    List<PostDto> getLikedPosts(int userId);
}
