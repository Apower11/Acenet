import React, {useState, useContext, useEffect} from 'react';
import Card from '../../shared/UIElements/Card';
import Title from '../../shared/UIElements/Title';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './css/Auth.css';

const Auth = props => {
    const auth = useContext(AuthContext);
    
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [profilePic, setProfilePic] = useState();
    const [isValid, setIsValid] = useState(false);

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
            setProfilePic(pickedFile);
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    const switchModeHandler = () => {
    setIsLoginMode(!isLoginMode);
    };

    let inputs;
    (isLoginMode)
    ? inputs = (
        <div className="inputs">
            <input type="email" placeholder="Email Address" onChange={event => setEmail(event.target.value)} />
            <input type="password" placeholder="Password" onChange={event => setPassword(event.target.value)} />
        </div>
    )
    : inputs = (
        <div className="inputs">
            <input type="text" id="name" placeholder="Full Name" onChange={event => setName(event.target.value)} />
            {previewUrl &&
            <div id="profilePicture">
    {previewUrl && 
    <React.Fragment>
    <div className="profile-pic-preview" style={{backgroundImage: `url(${previewUrl})`}}>
    <span onClick={() => setPreviewUrl(null)} className="image-cross"><i className="fa fa-times" aria-hidden="true"></i></span>
    </div>
    </React.Fragment>}
    {!previewUrl && null}
</div>}
        <div className="profile-picture-container">
    <input id="addpost-file" className="addpost-file" type="file" accept=".jpg,.png,.jpeg" onChange={pickedHandler} />
    <label htmlFor="addpost-file"><i className="fa fa-picture-o" aria-hidden="true"></i></label>
    <span>Add a Profile Picture</span>
    {!isValid && <p>{props.errorText}</p>}
    </div>
            <input type="date" id="birthday" placeholder="Birthday" />
            <input type="email" id="email" placeholder="Email Address" onChange={event => setEmail(event.target.value)} />
            <input type="password" id="password" placeholder="Password" onChange={event => setPassword(event.target.value)} />
            <input type="password" id="confirm-password" placeholder="Confirm Password" />
        </div>
    );

    const authSubmitHandler = async event => {
        event.preventDefault();

        if(isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email,
                        password
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.user._id, responseData.user, responseData.token); 
            } catch (err) {
            }
        } else {
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', name);
                formData.append('password', password);
                formData.append('profilePic', profilePic);
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    formData
                );

                auth.login(responseData.user._id, responseData.user, responseData.token); 
            } catch(err) {}
        }
    };

    return (
        <React.Fragment>
            <Title title="Acenet" />
            <ErrorModal error={error} onClear={clearError} />
            <div className="form-container">
            <Card className="authenticate-form">
            {isLoading && <LoadingSpinner asOverlay />}
            <h1>AceNet</h1>
                <form onSubmit={authSubmitHandler}>
                    {inputs}
                    <button type="submit">{isLoginMode ? "Log In" : "Sign Up"}</button>
                    {isLoginMode && <p className="forgot-password">Forgot Password?</p>}
                </form>
            </Card>
            <div className="auth-switch">
                <p>{isLoginMode ? "Don't have an account?" : "Already have an account?"} <s onClick={switchModeHandler}>{isLoginMode ? "Sign Up" : "Log In"}</s></p>
            </div>
        </div>
        </React.Fragment>
    )
}

export default Auth;