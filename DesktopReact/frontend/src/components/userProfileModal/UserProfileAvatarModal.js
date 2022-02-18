import React from 'react';
import AvatarEditor from "react-avatar-editor";
import {Box, Button, IconButton, Modal, Typography} from "@mui/material";
import {CloseOutlined, ZoomInOutlined, ZoomOutOutlined} from "@mui/icons-material";

const UserProfileAvatarModal = ({ modalEditAvatar,
                                    modalEditBanner,
                                    avatarEditorClose,
                                    handleNewImage,
                                    avatarEditor,
                                    bannerEditor,
                                    handlePositionChange,
                                    setEditorRef,
                                    handleScale
                                }) => {

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
        </>
    );
};

export default UserProfileAvatarModal;