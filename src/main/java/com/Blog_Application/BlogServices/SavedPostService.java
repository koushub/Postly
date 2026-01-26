package com.Blog_Application.BlogServices;

import com.Blog_Application.Payload.PostDto;
import java.util.List;

public interface SavedPostService {

    boolean toggleSave(int userId, int postId);

    List<PostDto> getSavedPosts(int userId);
}