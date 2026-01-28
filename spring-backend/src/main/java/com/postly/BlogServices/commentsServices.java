package com.postly.BlogServices;

import com.postly.Payload.CommentDto;
import java.util.List;

public interface commentsServices {
	public CommentDto addCommentDto(CommentDto cDto,int postId, int userId);
	public void deleteComment(int id);
	List<CommentDto> getCommentsByUser(int userId);
	List<CommentDto> getAllComments();
}
