import React, {useState} from 'react';
import AvatarEditor from "react-avatar-editor";
import ReactAvatarEditor from 'react-avatar-editor';
import {Modal} from "@mui/material";

// this will be used in the future, on destructuring.
const UserProfileAvatarModal = (props) => {

    const {
        userInfo,
        handleChange,
        selectProfilePic,
        selectBannerPic,
        saveProfile,
        isEquals,
        errorState,
        close,
        modalEditAvatar
    } = props;

    return (
        <div>

        </div>

    );
};

export default UserProfileAvatarModal;