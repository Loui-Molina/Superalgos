import "./UserProfile.css"
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux'
import { useDispatch } from 'redux';
import {useLocation} from 'react-router-dom'
import {Alert, Snackbar, Stack} from "@mui/material";
import UserProfileHeader from "../userProfileHeader/UserProfileHeader";
import Post from "../post/Post";
import PostsFeed from "../postsFeed/PostsFeed";
import {getPosts} from "../../api/post.httpService";
import {getProfile} from "../../api/profile.httpService";
import { setPostList } from '../../store/slices/post.slice'
import {STATUS_OK} from "../../api/httpConfig";

const UserProfile = () => {
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const [postLoading, setPostLoading] = useState(true);
    const [openSnack, setSnackOpen] = useState(false);
    const [externalProfile, setExternalProfile] = useState();
    const actualUser = useSelector(state => state.profile.actualUser);
    const postsList = useSelector( state => state.post.postsList);
    const {search} = useLocation();
    const urlSearchParams = React.useMemo(() => new URLSearchParams(search), [search]);
    const queryParams = {
        externalProfile: urlSearchParams.get("p"),
    }

    useEffect(() => {
        const loadExternalprofile = async () => {
            const {
                data,
                result
            } = await getProfile({socialPersonaId: queryParams.externalProfile}).then(response => response.json())
            if (result === STATUS_OK) {
                setExternalProfile(data);
            }
        }
        if (queryParams.externalProfile) {
            loadExternalprofile();
        } else {
            setExternalProfile(null)
        }
        loadPosts();
    }, [queryParams.externalProfile]);

    const drawPosts = (rawPosts) => {
        const mappedPosts = rawPosts.map((post) => {
            const postData = {
                index: post.index,
                postText: post.postText,
                originPostHash: post.originPostHash,
                reactions: post.reactions,
                postType: post.postType,
                repliesCount: post.repliesCount,
                creator: {
                    name: actualUser.name,
                    profilePic: actualUser.profilePic,
                    originSocialPersonaId: actualUser.originSocialPersonaId,
                    username: actualUser.userProfileHandle
                }
            }
            return <Post key={post.originPostHash} id={post.originPostHash}
                         postData={postData}/>
        });
        setPosts(mappedPosts)
        dispatch( setPostList(postsList.concat(mappedPosts)) );
    }

    const loadPosts = async () => {
        setPostLoading(true)
        const queryParams = {
            tailIndex: postsList[postsList.length - 1].index,
            pagination: 10
        }
        const {data, result} = await getPosts().then(response => response.json());
        if (result === STATUS_OK) {
            drawPosts(data);
        }
        setPostLoading(false);
    }

    const onScroll = () => {
        if (listInnerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
          if (scrollTop + clientHeight === scrollHeight) {
           loadPosts();
          }
        }
      };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
    };

    return (<>
        <Stack direction="column"
               justifyContent="flex-start"
               alignItems="center"
               spacing={1}
               className="middleSection"
               onScroll={onScroll}>
            <UserProfileHeader user={externalProfile ? externalProfile : actualUser}
                               isExternalProfile={!!externalProfile}/>
            {
                !externalProfile
                    ? <PostsFeed posts={postsList} loading={postLoading}/>
                    : <></>
            }
        </Stack>
        <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnackClose}>
            <Alert onClose={handleSnackClose} severity="info" sx={{width: '100%'}}>
                Changes might take up to 10 minutes to reflect
            </Alert>
        </Snackbar>
    </>);
};

export default UserProfile;
