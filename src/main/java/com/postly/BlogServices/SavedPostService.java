package com.postly.BlogServices;

import com.postly.Payload.PostDto;
import java.util.List;

public interface SavedPostService {

    boolean toggleSave(int userId, int postId);

    List<PostDto> getSavedPosts(int userId);
}