import React from 'react';
import PostList from '../components/PostList';
import { useParams } from 'react-router-dom';

const DUMMY_POSTS = [
    {
        id: 'p1',
        author: 'Adam Power',
        uploadTime: '29 June',
        profilePic: 'https://d3d71ba2asa5oz.cloudfront.net/62001271/images/arsenal%20fc.jpg',
        caption: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        picture: "https://futboltriangle.files.wordpress.com/2015/08/arsenalbarclaysasiatrophyo3zh14ufidtl.jpg?w=616",
        tags: "#myfirstpost",
        userId: 'u1'
    },
    {
        id: 'p2',
        author: 'John Doe',
        uploadTime: '30 June',
        profilePic: 'https://d3d71ba2asa5oz.cloudfront.net/62001271/images/arsenal%20fc.jpg',
        caption: "Hello from John",
        picture: "https://www.waltons.co.uk/_imagesWT/products/2018-SI-001-001-0002-7x5-Overlap-Apex-006.jpg",
        tags: "#mysecondpost",
        userId: 'u1'
    }
]

const UserPosts = () => {
    const userId = useParams().userId;
    const loadedPosts = DUMMY_POSTS.filter(post => post.userId === userId);
    return (
        <PostList isUserPosts={true} posts={loadedPosts} />
    )
};

export default UserPosts;