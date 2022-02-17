import React from 'react';
import {
    Box,
    Button,
    CardContent,
    CardMedia,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    Modal,
    OutlinedInput,
    Typography
} from "@mui/material";
import styled from "@emotion/styled";
import "./UserProfileModal.css"
import {
    AddAPhotoOutlined,
    CloseOutlined,
    Input,
    ZoomInOutlined,
    ZoomOutOutlined
} from "@mui/icons-material";
import pfp from "../../images/superalgos.png";
import AvatarEditor from "react-avatar-editor";

const UserProfileModalView = (props) => {
    const {
        userInfo,
        handleChange,
        selectProfilePic,
        selectBannerPic,
        saveProfile,
        isEquals,
        errorState,
        close,
        modalEditAvatar,
        modalEditBanner,
        avatarEditorClose,
        avatarEditor,
        bannerEditor,
        handleNewImage,
        handleScale,
        handlePositionChange,
        setEditorRef
    } = props;
    const inputCharLimit = [{name: 50, bio: 150, location: 30, web: 100}] // temporal char limiter constant. Use json file instead?
    const Input = styled('input')({
        display: 'none',
    });

    const formHeader = () => {
        return (
            <div className="editProfileHeader">
                <div className="editProfileCloseBtn">
                    <IconButton onClick={close}>
                        <CloseOutlined/>
                    </IconButton>
                </div>
                <div className="editProfileHeaderTitleAndBtn">
                    <Typography className="editProfileTitle" variant="h5">
                        Edit Profile
                    </Typography>
                </div>
            </div>
        )
    }

    const setBanner = () => {
        return <CardMedia className='banner'
                          alt='banner'
                          src={userInfo.bannerPic ? `${userInfo.bannerPic}` : pfp}
                          component='img'/>
    }

    const profilePicSetter = () => {
        return <div className="profilePicBG">
            <CardMedia
                className='profileAvatar'
                alt='ProfilePic'
                src={userInfo.profilePic ? `${userInfo.profilePic}` : pfp}
                component='img'/>
        </div>
    }

    const profilePic = () => {
        return <label htmlFor="profilePic" className="profileUploadButton">
            <Input className="input" accept="image/*" id="profilePic" multiple type="file"
                   onChange={selectProfilePic}
            />
            <Button className="profilePicButtons" component="span" size="small">
                <AddAPhotoOutlined/>
                <span className="editProfileTooltipText">Add photo</span>
            </Button>
        </label>
    }

    const bannerPic = () => {
        return <div>
            <label htmlFor="bannerPic" className="bannerUploadButton">
                <Input className="input" accept="image/*" id="bannerPic" multiple type="file"
                       onChange={selectBannerPic}/>
                <Button className="profilePicButtons" component="span">
                    <AddAPhotoOutlined/>
                    <span className="editProfileTooltipText">Add photo</span>
                </Button>
            </label>
        </div>
    }

    const avatarContainer = () => {
        return <div className="editAvatar">
            <div className="profileCard">
                {profilePicSetter()}
                {profilePic()}
                {bannerPic()}
            </div>
        </div>
    }

    const formFields = () => {
        return (
            <div className="editProfileInputBoxes">
                <FormControl className="editProfile" required error={errorState}>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <OutlinedInput
                        id="name"
                        value={userInfo.name}
                        onChange={handleChange}
                        label="Name"
                        inputProps={{maxLength: inputCharLimit[0].name}}
                    />
                    {errorState ? (
                        <FormHelperText id="name-error">Name can't be blank</FormHelperText>
                    ) : null}
                </FormControl>
                <FormControl className="editProfile">
                    <InputLabel htmlFor="bio">Bio</InputLabel>
                    <OutlinedInput
                        id="bio"
                        value={userInfo.bio}
                        onChange={handleChange}
                        label="Bio"
                        inputProps={{maxLength: inputCharLimit[0].bio}}
                    />
                </FormControl>
                <FormControl className="editProfile">
                    <InputLabel htmlFor="location">Location</InputLabel>
                    <OutlinedInput
                        id="location"
                        value={userInfo.location}
                        onChange={handleChange}
                        label="Location"
                        inputProps={{maxLength: inputCharLimit[0].location}}
                    />
                </FormControl>
                <FormControl className="editProfile">
                    <InputLabel htmlFor="web">Web</InputLabel>
                    <OutlinedInput
                        id="web"
                        value={userInfo.web}
                        onChange={handleChange}
                        label="Web"
                        inputProps={{maxLength: inputCharLimit[0].web}}
                    />
                </FormControl>
            </div>
        )
    }

    const formSaveButton = () => {
        return (
            <div className="editProfileFooter">
                <Button disabled={errorState || isEquals()} onClick={saveProfile}
                        variant="outlined">Save
                </Button>
            </div>
        )
    }

    const modalEditAvatarHeader = () => {
        return (<>
            <IconButton onClick={avatarEditorClose}>
                <CloseOutlined/>
            </IconButton>
            <Typography>
                Edit media
            </Typography>
            <Button variant="outlined"
                className="editProfileAvatarHeaderApplyButton"
                onClick={handleNewImage}>
                Apply
            </Button>
        </>)
    }

    const modalEditAvatarBody = () => {
        return (<>
            <AvatarEditor className="reactAvatarEditor"
                          image={modalEditBanner ? bannerEditor.image : avatarEditor.image}
                          width={modalEditBanner ? bannerEditor.width : avatarEditor.width}
                          height={modalEditBanner ? bannerEditor.height : avatarEditor.height}
                          borderRadius={modalEditBanner ? bannerEditor.borderRadius : avatarEditor.borderRadius}
                          scale={parseFloat(modalEditBanner ? bannerEditor.scale : avatarEditor.scale)}
                          position={modalEditBanner ? bannerEditor.position : avatarEditor.position}
                          onPositionChange={handlePositionChange}
                          ref={setEditorRef}
            />
        </>)
    }

    const modalEditAvatarFooter = () => {
        return (<>
            <ZoomOutOutlined/>
            <input className="editProfileAvatarFooterZoom"
                name="scale"
                type="range"
                onChange={handleScale}
                min={modalEditBanner ? bannerEditor.allowZoomOut ? '0.1' : '1' : avatarEditor.allowZoomOut ? '0.1' : '1'}
                max="2"
                step="0.01"
                defaultValue="1"
            /><ZoomInOutlined/>
        </>)
    }

    return (<>
            <Modal open={modalEditAvatar}
                   onClose={avatarEditorClose}>
                <Box className="editProfileAvatar">
                    <div className="editProfileAvatarHeader">
                        {modalEditAvatarHeader()}
                    </div>
                    <div className="editProfileAvatarBody">
                        {modalEditAvatarBody()}
                    </div>
                    <div className="editProfileAvatarFooter">
                        {modalEditAvatarFooter()}
                    </div>
                </Box>
            </Modal>
            <Modal open
                   onClose={close}>
                <Box className="editUserBox" component="form" noValidate autoComplete="off">
                    <CardContent className="userSection">
                        {formHeader()}
                        <div className="editBannerAvatarContainer">
                            {setBanner()}
                            {avatarContainer()}
                            {formFields()}
                            {formSaveButton()}
                        </div>
                    </CardContent>
                </Box>
            </Modal>
        </>
    );
}

export default UserProfileModalView