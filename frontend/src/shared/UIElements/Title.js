import ReactDOM from 'react-dom';

const Title = props => {
    return ReactDOM.createPortal(props.title, document.getElementById('title'));
}

export default Title;