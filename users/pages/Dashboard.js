import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../../posts/components/PostList';
import Title from '../../shared/UIElements/Title';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Dashboard = () => {
    const userId = useParams().userId;
    const auth = useContext(AuthContext);
    const userName = auth.user.name;
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPosts, setLoadedPosts] = useState();
    useEffect(() => {
        const getUserPosts = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/posts/user/${userId}`);
                setLoadedPosts(responseData.posts);
            }
            catch (err) {
                setLoadedPosts(null);
            }
        }
    
        getUserPosts();
    }, [sendRequest, userId, auth.user.name])
    
    return (
        <React.Fragment>
            <Title title={`Acenet | ${userName}`} />
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
        {!isLoading && loadedPosts && <PostList isUserPosts={true} posts={loadedPosts} />}
        </React.Fragment>
    )
};

export default Dashboard;