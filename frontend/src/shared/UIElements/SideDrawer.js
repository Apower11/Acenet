import React from 'react';
import ReactDOM from 'react-dom';

import './css/SideDrawer.css';
import { CSSTransition } from 'react-transition-group';

const SideDrawer = props => {
    let content = (
        <CSSTransition
        in={props.show}
      timeout={200}
      classNames="my-node"
      mountOnEnter
      unmountOnExit
    >
        <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside> 
    </CSSTransition>
    )

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
}

export default SideDrawer;