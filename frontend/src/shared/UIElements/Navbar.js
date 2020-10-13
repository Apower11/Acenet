import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from './Backdrop';
import Modal from './Modal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import './css/Navbar.css';

const Navbar = props => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const captionRef = useRef(); 

    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const [picture, setPicture] = useState();
    
    let profilePic = {backgroundImage: `url(http://localhost:5000/${auth.user.profilePic})`};

    useEffect(() => {
        if(!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }, [file]);

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

    let inputs = <div className="inputs">
    <div className="addpost-form">
    <div ref={captionRef} contentEditable="true" data-placeholder={auth.user.name && `What's on your mind, ${auth.user.name.split(" ")[0]}?`} className="addpost-caption"></div>
    {previewUrl &&
    <div className="image-preview">
    {previewUrl && 
    <React.Fragment>
        <span onClick={() => setPreviewUrl(null)} className="image-cross"><i class="fa fa-times" aria-hidden="true"></i></span>
    <img src={previewUrl} alt="Preview" />
    </React.Fragment>}
    {!previewUrl && null}
</div>}
    </div>
        <div className="addpost-picture-container">
    <input id="addpost-file" className="addpost-file" type="file" accept=".jpg,.png,.jpeg" onChange={pickedHandler} />
    <label htmlFor="addpost-file"><i className="fa fa-picture-o" aria-hidden="true"></i></label>
    <span>Add an image</span>
    {!isValid && <p>{props.errorText}</p>}
    </div>
    </div>;

    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    };

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    };

    const showAddHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelAddHandler = () => {
        setShowConfirmModal(false);
    };

    const history = useHistory();

    const postSubmitHandler = async event => {
        event.preventDefault();
        console.log(auth.user);
        try {
            const formData = new FormData();
            formData.append('caption', captionRef.current.textContent.toString())
            formData.append('picture', picture);
            formData.append('author', auth.user._id);
            formData.append('profilePic', auth.user.profilePic);
            formData.append('authorName', auth.user.name);
            await sendRequest(
                'http://localhost:5000/api/posts',
                'POST',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token
                });
                setShowConfirmModal(false);
                history.push('/');
        }
     catch (err) {
         console.log(err);
     }
}

    return (
        <React.Fragment>
            <Modal
            className="add-post"
            contentClass="post-form"
            show={showConfirmModal}
            onCancel={cancelAddHandler}
            header={
                <div className="modal-header">
                <h4>Create Post</h4>
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
                <h4>{auth.user.name}</h4>
                </div>
                <ErrorModal error={error} onClear={clearError} />
                <form className="addpost-form-inputs">
                {isLoading && <LoadingSpinner asOverlay />}
                    {inputs}
                    <button onClick={postSubmitHandler} className="button" type="submit">Post</button>
                </form>
            </Modal>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
            <img className="logo" src="./images/AceNet-logo.png" alt="AceNet" />
                <NavLinks mode='sideDrawer' />
            </SideDrawer>

            <div className={`navbar ${auth.isLoggedIn ? 'white' : 'green'}`}>
                {auth.isLoggedIn &&
                <button
                className="main-navigation__menu-btn"
                onClick={openDrawerHandler}>
                   <span />
                   <span />
                   <span />
                </button>}
            <img className="logo" src="./images/AceNet-logo.png" alt="AceNet" />
            {!auth.isLoggedIn && <h1>AceNet</h1>}
            <NavLinks mode='navbar' />
            {auth.isLoggedIn && (
                <div className="add-post-icon-link"><li><button onClick={showAddHandler}><i className="fa fa-plus"></i></button><div className="tooltip-text">Create</div></li></div>
            )}
            
            </div>
        </React.Fragment>
    )
}

export default Navbar;