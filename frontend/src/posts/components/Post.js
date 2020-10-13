import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import Card from '../../shared/UIElements/Card';
import Modal from '../../shared/UIElements/Modal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import './css/Post.css';

const Post = props => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [isPostMenu, setIsPostMenu] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const [picture, setPicture] = useState();
    const captionRef = useRef();

    useEffect(() => {
        setPreviewUrl('http://localhost:5000/' + props.post.picture);
        setPicture(props.post.picture.replace('/', /\//g))
        if(!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }, [file, props.post.picture]);

    const pickedHandler = event => {
        let pickedFile;
        if(event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setPicture(pickedFile);
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    const TransparentBackdrop = props => {
        return ReactDOM.createPortal(
            <div onClick={() => setIsPostMenu(false)} className="transparent-backdrop"></div>,
            document.getElementById("transparent-backdrop-hook")
        )
    }

    let profilePic = {backgroundImage: `url(http://localhost:5000/${props.post.profilePic})`};
    let inputs = <div className="inputs">
    <div className="editpost-form">
    <div ref={captionRef} contentEditable="true" data-placeholder={auth.user.name && `What's on your mind, ${auth.user.name.split(" ")[0]}?`} className="addpost-caption">
        {props.post.caption}
    </div>
    {previewUrl &&
    <div className="image-preview">
    {previewUrl && 
    <React.Fragment>
        <span onClick={() => setPreviewUrl(null)} className="image-cross"><i className="fa fa-times" aria-hidden="true"></i></span>
    <img src={previewUrl} alt="Preview" />
    </React.Fragment>}
    {!previewUrl && null}
</div>}
</div>
    <div className="addpost-picture-container">
    <input id="addpost-file" className="addpost-file" type="file" onChange={pickedHandler} />
    <label htmlFor="addpost-file"><i className="fa fa-picture-o" aria-hidden="true"></i></label>
    <span>Add an image</span>
    {!isValid && <p>{props.errorText}</p>}
    </div>
    </div>;

    const showDeleteWarningHandler = () => {
        setShowDeleteConfirmModal(true);
        setIsPostMenu(false);
    };

    const cancelDeleteHandler = () => {
        setShowDeleteConfirmModal(false);
    };

    const showEditHandler = () => {
        setShowEditConfirmModal(true);
        setIsPostMenu(false);
    };

    const cancelEditHandler = () => {
        setShowEditConfirmModal(false);
    };

    const history = useHistory();

    const editPostHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('caption', captionRef.current.textContent.toString());
            formData.append('picture', picture);
            formData.append('oldPicture', props.post.picture);
            await sendRequest(
                `http://localhost:5000/api/posts/${props.post.id}`,
                'PATCH',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token
                }
                );
                history.push('/');
        }
     catch (err) {
         console.log(err);
     }
    }

    const deletePostHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/posts/${props.post.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                });
                history.push('/');
        }
     catch (err) {
         console.log(err);
     }
    }

    return (
        <React.Fragment>
            <Modal
            className="delete-post-modal"
            show={showDeleteConfirmModal}
            onCancel={cancelDeleteHandler}
            header="Delete Post?"
            footerClass="place-item__modal-actions"
            footer={
                <div className="delete-post-form">
                    <ErrorModal error={error} onClear={clearError} />
                {isLoading && <LoadingSpinner asOverlay />}
            <button className="modal-button-inverse" onClick={cancelDeleteHandler}>
              CANCEL
            </button>
            <button className="modal-button" onClick={deletePostHandler}>
              DELETE
            </button>
          </div>
            }
            >
            <p>
          Are you sure you want to delete this post. Please note it can't be undone once you delete it.
        </p>
            </Modal>
            <Modal
            className="edit-post"
            show={showEditConfirmModal}
            onCancel={cancelEditHandler}
            header={
                <div className="modal-header">
                <h4>Edit Post</h4>
                <ErrorModal error={error} onClear={clearError} />
                </div>
            }
            footerClass="place-item__modal-actions"
            footer={
                <React.Fragment>
          </React.Fragment>
            }
            >
                <div className="addpost-user__details">
                <div style={profilePic} className="avatar"></div>
                <h4>Adam Power</h4>
                </div>
            <form className="addpost-form-inputs">
            {isLoading && <LoadingSpinner asOverlay />}
                    {inputs}
                    <button onClick={editPostHandler} className="button" type="submit">Edit Post</button>
                </form>
            </Modal>
        <Card className="post">
            <div className="post-user">
                <div><div style={profilePic} className="avatar"></div></div>
                <div className="post-user__details">
                <div className="user-details">
                <h4>{props.post.authorName}</h4>
                <small>{props.post.uploadTime}</small>
                </div>
                {(props.isUserPosts)
                ? <div className="post-menu"><div onClick={() => setIsPostMenu(!isPostMenu)} className="post-menu-trigger">
                <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                </div>
                </div>
                : null
            }
            </div>
            </div>
            {(isPostMenu && props.isUserPosts) ? 
            <React.Fragment>
                <TransparentBackdrop />
                <Card className="post-dropdown">
                <ul>
                    <li><button onClick={showEditHandler}><i className="fa fa-pencil" aria-hidden="true"></i>Edit Post</button></li>
                    <li><button onClick={showDeleteWarningHandler}><i className="fa fa-trash" aria-hidden="true"></i>Delete Post</button></li>
                </ul>
            </Card>
            </React.Fragment> : null}
            <div className="post-content">
                <div className="post-caption">
                    <p>{props.post.caption}</p>
    <a href="/" className="post-tags">{props.post.tags}</a>
                </div>
                <img src={`http://localhost:5000/${props.post.picture}`} className="post-picture" alt="Post"></img>
            </div>
            <div className="post-footer">
            </div>
        </Card>
        </React.Fragment>
    )
}

export default Post;