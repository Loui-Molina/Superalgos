import './Feed.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import PostPlaceholder from "../postPlaceholder/PostPlaceholder";
import PostsFeed from "../postsFeed/PostsFeed";
import { getFeed } from "../../api/post.httpService";
import { getProfile } from '../../api/profile.httpService'
import { setPostList } from '../../store/slices/post.slice'
import { STATUS_OK } from "../../api/httpConfig";
import Post from "../post/Post";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const socialPersona = useSelector(state => state.profile.socialPersona);
    const postsList = useSelector( state => state.post.postsList)
    useEffect(() => {
        loadPosts();
    }, []);

    const drawFeedPosts = async (rawPosts) => {
        const mappedPosts = await Promise.all(
            rawPosts.map( async (post, index) => {
                if (post.eventType === 10) {
                    const {data, result} = await getProfile({socialPersonaId: post.originPost.originSocialPersonaId})
                        .then(response => response.json())
                    const postData = {
                        index: post.index,
                        postText: post?.postText,
                        originPostHash: post?.originPost.originPostHash,
                        reactions: post?.originPost.reactions,
                        postType: post?.originPost.postType,
                        repliesCount: post?.originPost.repliesCount,
                        creator: {
                            name: data?.name,
                            profilePic: data?.profilePic,
                            originSocialPersonaId: data?.nodeId,
                            username: data?.userProfileHandle
                        }
                    }
                    return <Post key={Math.random()} id={index} postData={postData}/>
                }

            })
        )
        setPosts(mappedPosts)
        dispatch( setPostList(postsList.concat(mappedPosts)) );
    }

    const onScroll = () => {
        if (listInnerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
          if (scrollTop + clientHeight === scrollHeight) {
           loadPosts();
          }
        }
      };

    const loadPosts = async () => {
        setLoading(true);
        const queryParams = {
            originSocialPersonaId: socialPersona.nodeId,
            pagination: 10,
            tailIndex: postsList[postsList.lenght -1].index ? postsList[postsList.lenght -1].index : 0,
        };
        const { data, result } = await getFeed(queryParams).then( response => response.json() );
        if (result === STATUS_OK) {
            await drawFeedPosts(data);
        }
        setLoading(false);
    }

    return (
        <div className="feed" onScroll={onScroll}>
            <div className="feedContainer">
                <PostPlaceholder reloadPostCallback={loadPosts}/>
            </div>
            <PostsFeed posts={postsList} loading={loading}/>
        </div>
    );
}

export default Feed;
