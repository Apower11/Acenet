import React, { useState, useEffect } from 'react';
import './css/ImageUpload.css';

export const AddPostInputs = props => {
    const [caption, setCaption] = useState();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
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

    

    return (
        <React.Fragment>
        
        </React.Fragment>
    )
}