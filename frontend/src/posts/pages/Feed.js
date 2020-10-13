import React, { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import Title from '../../shared/UIElements/Title';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Feed = () => {
const { isLoading, error, sendRequest, clearError} = useHttpClient();
const [loadedPosts, setLoadedPosts] = useState();

useEffect(() => {
    const getPosts = async () => {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/posts');
            setLoadedPosts(responseData.posts);
        }
        catch (err) {}
    }

    getPosts();
}, [sendRequest])

    return (
        <React.Fragment>
            <Title title="Acenet | Home" />
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
        {!isLoading && loadedPosts && <PostList isUserPosts={false} posts={loadedPosts} />}
        </React.Fragment>
    )
};

export default Feed;