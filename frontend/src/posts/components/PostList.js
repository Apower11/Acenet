import React from 'react';
import Post from '../components/Post';
import './css/PostList.css';

const PostList = props => {
    return( (props.posts.length === 0)
    ? <div>
        <h2>No posts found</h2>
    </div>
    : 
    <ul className="post-list">
        {props.posts.map(post => (
            <Post isUserPosts={props.isUserPosts} key={post.id} post={post} />
        ))}
    </ul>
    )
}

export default PostList;