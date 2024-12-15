import React, { useEffect, useRef, useState } from "react";
import "../../styles/ViewPostModal.css";
import { X, Heart, MessageCircle, Share2, Bookmark, Send, MoreHorizontal, Edit, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, addReply, deleteComment, deleteReply, getPostComments, likeAndUnlikeComment, likeAndUnlikeReply, updateComment, updateReply } from "../../redux/Actions/commentActions";
import { toast } from "react-toastify";
import toastOptions from "../../constants/toast";
import usePostSave from "../../hooks/usePostSave";
import { deletePost, getPostById, updatePost } from "../../redux/Actions/postActions";
import usePostLike from "../../hooks/usePostLike";

const DropdownMenu = ({ onEdit, onDelete }) => (
    <div className="dropdown-menu">
      <div onClick={onEdit} className="dropdown-item">
        <Edit style={{ marginRight: "8px" }} /> Edit
      </div>
      <div onClick={onDelete} className="dropdown-item">
        <Trash style={{ marginRight: "8px" }} /> Delete
      </div>
    </div>
);

const ViewPostModal = ({ onLoad, onClose, postData }) => {
    const [allComments, setAllComments] = useState([]);
    const [inputText, setInputText] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [post, setPost] = useState(postData);
    const [text, setText] = useState({
        type: "Comment",
        id: post?._id
    });
    const [activeDropdown, setActiveDropdown] = useState(null);

    const commentInputRef = useRef(null);

    const dispatch = useDispatch();
    const { loading, error, message, comments } = useSelector((state) => state.comment);
    const { loading: replyLoading, error: replyError, message: replyMessage } = useSelector((state) => state.reply);
    const { loading: postLoading, error: postError, message: postMessage } = useSelector((state) => state.updatePost);
    const { error: delError, message: delMessage } = useSelector((state) => state.deletePost);
    const { user } = useSelector((state) => state.userAuth);
    const { post: postById } = useSelector((state) => state.post);

    const commentClick = () => {
        setText({
            type: "Comment",
            id: post?._id
        })
        if(commentInputRef.current){
            commentInputRef.current.focus();
        }
    };

    const replyClick = (id) => {
        setText({
            type: "Reply",
            id
        })
        if(commentInputRef.current){
            commentInputRef.current.focus();
        }
    };

    const handleCommentLike = (id) => {
        dispatch(likeAndUnlikeComment(id));
    };

    const handleReplyLike = (id) => {
        dispatch(likeAndUnlikeReply(id));
    };

    const handleDropdownToggle = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleEdit = (type, id, val) => {
        if(commentInputRef.current){
            commentInputRef.current.focus();
        }
        setInputText(val);
        if(type === "updateReply"){
            setText({
                type: "updateReply",
                id
            })
        } else if(type === "updateComment") {
            setText({
                type: "updateComment",
                id
            })
        } else {
            setText({
                type: "updateCaption",
                id
            })
        }
    };

    const handleDelete = (type, id) => {
        if(type === "Comment"){
            dispatch(deleteComment(id));
        } else if (type === "Reply") {
            dispatch(deleteReply(id));
        } else {
            dispatch(deletePost(id));
        }
    };

    const handleSend = () => {
        if(text.type === "Comment") {
            dispatch(addComment(text.id, inputText));
        } else if(text.type === "Reply") {
            dispatch(addReply(text.id, inputText));
        } else if(text.type === "updateReply") {
            dispatch(updateReply(text.id, inputText));
        } else if(text.type === "updateComment") {
            dispatch(updateComment(text.id, inputText));
        } else {
            dispatch(updatePost(text.id, inputText));
        }
    };

    useEffect(() => {
        if(comments) {
            setAllComments(comments);
        }
    }, [comments])

    useEffect(() => {
        if(postById) {
            setPost(postById);
        }
    }, [postById])

    useEffect(() => {
        if (message) {
            // toast.success(message, toastOptions);
            dispatch({ type: "CLEAR_MESSAGE" });
            dispatch(getPostComments(post?._id));
        }
        if(error) {
            toast.error(error, toastOptions);
            dispatch({ type: "CLEAR_ERROR" });
        }
        if (replyMessage) {
            // toast.success(replyMessage, toastOptions);
            dispatch({ type: "CLEAR_MESSAGE" });
            dispatch(getPostComments(post?._id));
        }
        if(replyError) {
            toast.error(replyError, toastOptions);
            dispatch({ type: "CLEAR_ERROR" });
        }
        if (postMessage) {
            // toast.success(postMessage, toastOptions);
            dispatch({ type: "CLEAR_MESSAGE" });
            dispatch(getPostById(post?._id));
        }
        if(postError) {
            toast.error(postError, toastOptions);
            dispatch({ type: "CLEAR_ERROR" });
        }
        if (delMessage) {
            toast.success(delMessage, toastOptions);
            dispatch({ type: "CLEAR_MESSAGE" });
            onLoad();
            onClose(false);
        }
        if(delError) {
            toast.error(delError, toastOptions);
            dispatch({ type: "CLEAR_ERROR" });
        }
    }, [message, error, dispatch, toastOptions, replyMessage, replyError, postMessage, postError, delMessage, delError]);

    useEffect(() => {
        setInputText("");
        setText({
            type: "Comment",
            id: post?._id
        })
    }, [allComments]);

    useEffect(() => {
        if (post) {
            setAllComments(post.comments);
        }
    }, [post]);

    const { savePost, SavedIcon, saved, setSaved } = usePostSave({post})

    const { likePost, LikedIcon, liked, setLiked } = usePostLike({post})

    // const { likeComment, LikeCommentIcon, commentLiked, setCommentLiked } = useCommentLike({post})

    // const { likereply, LikereplyIcon, replyLiked, setreplyLiked } = useReplyLike({post})

    useEffect(() => {
        if(liked) {
            dispatch(getPostById(post?._id))
            setLiked(false)
        }
    }, [liked])

    useEffect(() => {
        if(saved) {
            dispatch(getPostById(post?._id))
            setSaved(false)
        }
    }, [saved])

    return (
        <section>
            <div className="modal-cont">
                <div className="modal">
                {/* Image Section */}
                <div className="imgBx">
                    <img src={post?.image?.url} alt="Post" />
                </div>

                {/* Content Section */}
                <div className="post-cont">
                    <div className="close" onClick={() => onClose(false)}>
                        <X className="close" />
                    </div>

                    {/* Caption and Actions */}
                    <div className="post-info">
                        <div className="owner-info">
                            <div className="owner-avatar">
                                <img
                                src={post?.owner?.avatar?.url}
                                alt="Owner Avatar"
                                className="avatar"
                                />
                                <p><strong style={{ color: "#00bfff" }}>{post?.owner?.username}</strong></p>
                                <div className="more-box">
                                    <MoreHorizontal className="three-dots" style={{ cursor: "pointer", marginLeft: '12px', fontSize: '0.8rem' }} onClick={() => handleDropdownToggle("post")} />
                                    {activeDropdown === "post" && (
                                        <DropdownMenu
                                            onEdit={() => handleEdit("updateCaption", post?._id, post?.caption)}
                                            onDelete={() => handleDelete("Post", post?._id)}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="owner-details">
                                <p>{post?.caption}</p>
                                <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>3w</p>
                            </div>
                        </div>
                        <div className="actions">
                            <div className="util-item">
                                <div className="action-item" onClick={() => likePost(post?._id)}>
                                    <LikedIcon />
                                    <span>{post?.likes.length}</span>
                                </div>
                                <div className="action-item" onClick={() => commentClick()}>
                                    <MessageCircle />
                                    <span>{post?.comments?.length}</span>
                                </div>
                                <div className="action-item">
                                    <Share2 />
                                </div>
                            </div>
                            <div className="util-item">
                                <div className="action-item" onClick={() => savePost(post?._id)}>
                                    <SavedIcon />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="comments-section">
                        {allComments && allComments.length > 0 && allComments.map((comment) => (
                                <div key={comment._id} className="comment">
                                    <div className="comment-box">
                                        <img
                                            src={comment?.owner?.avatar?.url}
                                            alt="Comment Avatar"
                                            className="avatar"
                                        />
                                        <div className="comment-content">
                                            <div className="comment-text">
                                                <p>
                                                    <strong style={{ color: "#00bfff" }}>{comment?.owner?.username}</strong> {comment?.comment}
                                                </p>
                                                <Heart style={{ cursor: "pointer", flexShrink: "0", height: '1.2rem', width: '1rem',
                                                color: comment?.likes?.some((like) => like._id === user?._id) ? '#B22222' : 'inherit',
                                                fill: comment?.likes?.some((like) => like._id === user?._id) ? '#B22222' : 'inherit',
                                                transition: 'color 0.5s ease, fill 0.5s ease'
                                                }}
                                                onClick={() => handleCommentLike(comment?._id)}
                                                />
                                            </div>
                                            <div className="comment-actions">
                                                <span>3w</span>
                                                <span>{`${comment?.likes?.length} ${comment?.likes?.length === 1 ? "like" : "likes"}`} </span>
                                                <span style={{ cursor: "pointer" }} onClick={() => replyClick(comment?._id)}>Reply</span>
                                                <div className="more-box">
                                                    <MoreHorizontal className="three-dots" style={{ cursor: "pointer", marginLeft: '12px', fontSize: '0.8rem' }} 
                                                    onClick={() => handleDropdownToggle(
                                                        `comment-${comment?._id}`
                                                    )}
                                                    />
                                                    {activeDropdown === `comment-${comment?._id}` && (
                                                        <DropdownMenu
                                                        onEdit={() => handleEdit("updateComment", comment?._id, comment?.comment)}
                                                        onDelete={() => handleDelete("Comment", comment?._id)}
                                                        />
                                                    )}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggle Replies */}
                                    {comment?.reply?.length > 0 && (
                                        <div
                                            className="toggle-replies"
                                            onClick={() => setShowReplies(!showReplies)}
                                        >
                                            {showReplies ? "Hide Replies" : `View Replies (${comment?.reply?.length})`}
                                        </div>
                                    )}

                                    {showReplies && (
                                        <div className="replies">
                                            {comment?.reply?.map((reply) => (
                                                <div key={reply?._id} className="reply">
                                                    <div className="comment-box">
                                                        <img
                                                            src={reply?.owner?.avatar?.url}
                                                            alt="Comment Avatar"
                                                            className="avatar"
                                                        />
                                                        <div className="comment-content">
                                                            <div className="comment-text">
                                                                <p>
                                                                    <strong style={{ color: "#00bfff" }}>{reply?.owner?.username}</strong> {reply?.reply}
                                                                </p>
                                                                <Heart style={{ cursor: "pointer", flexShrink: "0", height: '1rem', width: '0.8rem',
                                                                color: reply?.likes?.some((like) => like._id === user?._id) ? '#B22222' : 'inherit',
                                                                fill: reply?.likes?.some((like) => like._id === user?._id) ? '#B22222' : 'inherit',
                                                                transition: 'color 0.5s ease, fill 0.5s ease'
                                                                }}
                                                                onClick={() => handleReplyLike(reply?._id)}
                                                                />
                                                            </div>
                                                            <div className="reply-actions">
                                                                <span>3w</span>
                                                                <span>{`${reply?.likes?.length} ${reply?.likes?.length === 1 ? "like" : "likes"}`} </span>
                                                                <div className="more-box">
                                                                    <MoreHorizontal className="three-dots" style={{ cursor: "pointer", marginLeft: '12px', fontSize: '0.8rem' }} 
                                                                    onClick={() =>
                                                                        handleDropdownToggle(`reply-${reply?._id}`)
                                                                    }
                                                                    />
                                                                    {activeDropdown === `reply-${reply?._id}` && (
                                                                        <DropdownMenu
                                                                            onEdit={() =>
                                                                            handleEdit("updateReply", reply?._id, reply?.reply)}
                                                                            onDelete={() =>
                                                                            handleDelete("Reply", reply?._id)}
                                                                        />
                                                                    )}
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>


                    <div className="comment-input">
                        <input
                            ref={commentInputRef}
                            type="text"
                            placeholder="Add a comment..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button disabled={inputText.trim() === "" || loading || replyLoading || postLoading} onClick={() => handleSend()}>
                            <Send className="comment-icon" />
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
};

export default ViewPostModal;
