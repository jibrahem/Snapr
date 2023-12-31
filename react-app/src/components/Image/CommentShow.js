import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageCommentsThunk, getSingleImageThunk } from "../../store/image";
import DeleteCommentModal from "../DeleteCommentModal";
import OpenModalMenuItem from "../OpenModalButton";
import UpdateComment from "../UpdateComment";
import "./Comments.css";
import CreateComment from "./CreateComment";

function CommentShow(image) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [description, setDescription] = useState("");
  const user = useSelector((state) => state.session.user);
  const imageId = image.image.id;

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const comments = useSelector((state) => state.images.imageComments);
  const commentArr = Object.values(comments);

  useEffect(() => {
    dispatch(getImageCommentsThunk(imageId));
    // dispatch(getSingleImageThunk(imageId))
  }, [dispatch, imageId]);

  const openMenu = (e) => {
    if (showMenu) return;
    commentArr.forEach((comment) => {
      // console.log("comment", comment.id);
      // console.log("e", e.target.id);
      if (Number(comment.id) === Number(e.target.id)) {
        setShowMenu(true);
      }
    });
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      // console.log("ulred", ulRef);
      // console.log("etarget", e.target);
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const ulClassName = "comment-dropdown" + (showMenu ? "" : " hidden");

  if (!commentArr) {
    return null;
  }

  const [userComment] = commentArr.filter(
    (comment) => comment.user_id === user.id
  );

  return (
    <>
      <div className="comments">
        {commentArr.length > 0 &&
          commentArr.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="profile-pic">
                <img
                  src={comment.User.profile_photo}
                  alt={comment.User.first_name}
                ></img>
              </div>
              <div className="prof-com">
                <div className="user-comment">
                  <div>
                    <div>
                      {comment.User.first_name} {comment.User.last_name}
                    </div>
                    <div className='comment-content'>{comment.description}</div>
                  </div>
                </div>
                {comment.user_id === user.id && (
                  <div>
                    <div className="iconic">
                      <div onClick={openMenu}>
                        <button>
                          <i
                            class="fa-regular fa-pen-to-square"
                            id={comment.id}
                          ></i>
                        </button>
                        <ul className={ulClassName} ref={ulRef}>
                          <UpdateComment comment={comment} image={image} />
                        </ul>
                      </div>
                      <div className="delete-modal">
                        <div>
                          <OpenModalMenuItem
                            buttonText="🗑️"
                            modalComponent={
                              <DeleteCommentModal
                                comment={comment}
                                image={image}
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        {!userComment && <CreateComment image={image} />}
      </div>
    </>
  );
}

export default CommentShow;
