import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';
import './css/NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext);
    let profilePicture = {backgroundImage: `url(http://localhost:5000/${auth.user.profilePic})`}; 
    
    return (
        <React.Fragment>
            <ul className="nav-links">
            {auth.isLoggedIn && (
                <li className="left-link">
                <NavLink activeClassName="nav-link-selected" to="/" exact>{props.mode === 'navbar' ? <i className="fa fa-home"></i> : 'Home'}</NavLink>
                {props.mode === 'navbar' && <div className="tooltip-text">Home</div>}
                </li>
            )}
        </ul>
        <ul className="right nav-links">
        {auth.isLoggedIn && (
                <li className="right-link">
                    <div className="user-menu">
                    <div className="user-icon">
                    <div style={profilePicture} className="avatar"></div>
                    </div>
                    <div className="user-dropdown">
                        <ul className="user-menu-list">
                        <li><span className="username">{auth.user.name}</span></li>
                        <li><NavLink activeClassName="nav-link-selected" to={`/posts/${auth.user._id}`} exact>Dashboard</NavLink></li>
                        <li><a href="/auth" onClick={() => auth.logout()} className="logout">Logout</a></li>
                        </ul>
                    </div>
                    </div>
                </li>
            )}
        </ul>
        </React.Fragment>
    )
};

export default NavLinks;