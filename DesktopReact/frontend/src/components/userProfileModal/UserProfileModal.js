import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setActualProfile} from "../../store/slices/Profile.slice";
import {updateProfile} from "../../api/profile.httpService";
import UserProfileModalView from './UserProfileModalView'
import {STATUS_OK} from "../../api/httpConfig";
import {validateFileSize} from "../../utils/helper";
import UserProfileAvatarModal from "./UserProfileAvatarModal";

const UserProfileModal = ({user, close}) => {
    const loadedSocialPersona = useSelector(state => state.profile.socialPersona)
    const dispatch = useDispatch();
    const [errorState, setErrorState] = useState(false);
    const [userInfo, setUserInfo] = useState(user);
    const [modalEditAvatar, setModalEditAvatar] = useState(false);
    const handleClickCallback = () => setModalEditAvatar(!modalEditAvatar);
    const [modalEditBanner, setModalEditBanner] = useState(false);
    const [currentAvatarEditPic, setCurrentAvatarEditPic] = useState();
    const [avatarEditor, setAvatarEditor] = useState(
        {
            image: userInfo.profilePic,
            croppedImg: '',
            allowZoomOut: false,
            position: {x: 0.5, y: 0.5},
            scale: 1,
            rotate: 0,
            borderRadius: 200,
            preview: null,
            width: 300,
            height: 300,
        }
    )
    const [bannerEditor, setBannerEditor] = useState(
        {
            image: userInfo.bannerPic,
            croppedImg: '',
            allowZoomOut: false,
            position: { x: 0.5, y: 0.5 },
            scale: 1,
            rotate: 0,
            borderRadius: 0,
            preview: null,
            width: 300,
            height: 300,
        }
    )

    useEffect(() => {
        setUserInfo(user);
    }, []);
    let editor = "";

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const selectProfilePic = async (e) => {
        let profilePic = e.target.files[0];
        if (profilePic && validateFileSize(profilePic, 0.4)) {
            let newInfo = {...userInfo};
            newInfo.profilePic = await toBase64(profilePic);
            setUserInfo(newInfo);
            setModalEditAvatar(!modalEditAvatar); // todo needs better approach?
            setAvatarEditor({...avatarEditor, image: profilePic})
        } else {
            alert('Image is too big or in a wrong format')
        }

    }

    const selectBannerPic = async (e) => {
        let bannerPic = e.target.files[0];
        if (bannerPic && validateFileSize(bannerPic, 0.4)) {
            let newInfo = {...userInfo};
            newInfo.bannerPic = await toBase64(bannerPic);
            setUserInfo(newInfo)
            setModalEditBanner(true)
            setModalEditAvatar(!modalEditAvatar); // todo needs better approach?
            setBannerEditor({...bannerEditor, image: bannerPic})
        } else {
            alert('Image is too big or in a wrong format')
        }
    }

    const handleChange = (event) => { // todo if reached max chars give warning message/indicator
        let newValue = event.target.value;
        let field = event.target.id;
        setErrorState(field === 'name' && (!newValue));
        setUserInfo({
            ...userInfo,
            [field]: newValue
        });
    }

    const saveProfile = async () => {
        let {result} = await updateProfile({
            ...userInfo,
            originSocialPersonaId: loadedSocialPersona.nodeId
        }).then(response => response.json());
        if (result === STATUS_OK) {
            dispatch(setActualProfile(userInfo));
            close();
        }
    }

    const isEquals = () => {
        let differentKey = Object.keys(user).find(key => user[key] !== userInfo[key]);
        return !differentKey;
    }
    /*const UserProfileAvatarModal = () => { // this will be used in the future, on destructuring.
        return <UserProfileAvatarModal
            modalEditAvatar={modalEditAvatar}
            selectProfilePic={selectProfilePic}
            close={handleClickCallback}
        />
    }*/
    const handleNewImage = (e) => {
        if (setEditorRef) {
            const croppedImg = editor.getImageScaledToCanvas().toDataURL();
            if(avatarEditor.image === userInfo.image) {
                setModalEditBanner(false);
                setAvatarEditor({
                    ...avatarEditor,
                    croppedImg: croppedImg
                });
                setUserInfo({
                    ...userInfo,
                    profilePic: croppedImg
                })
            } else if (bannerEditor.image === userInfo.image) {
                setModalEditAvatar(false);
                setBannerEditor({
                    ...bannerEditor,
                    croppedImg: croppedImg
                });
                setUserInfo({
                    ...userInfo,
                    profilePic: croppedImg
                })
            }
        }
        handleClickCallback();
    }

    const handleScale = (e) => {
        const scale = parseFloat(e.target.value);
        setAvatarEditor({ ...avatarEditor, scale });
    }

    const handlePositionChange = position => {
        setAvatarEditor({ ...avatarEditor, position });
    }

    const setEditorRef = (ed) => {
        editor = ed;
    };

    const avatarEditorClose = () => {
            setUserInfo({...user});
            setModalEditAvatar(false);
            setModalEditBanner(false);
    };

    return <UserProfileModalView
        userInfo={userInfo}
        handleChange={handleChange}
        selectProfilePic={selectProfilePic}
        selectBannerPic={selectBannerPic}
        saveProfile={saveProfile}
        isEquals={isEquals}
        errorState={errorState}
        close={close}
        modalEditAvatar={modalEditAvatar}
        modalEditBanner={modalEditBanner}
        avatarEditorClose={avatarEditorClose}
        avatarEditor={avatarEditor}
        bannerEditor={bannerEditor}
        handleNewImage={handleNewImage}
        handleScale={handleScale}
        handlePositionChange={handlePositionChange}
        setEditorRef={setEditorRef}
    />
}

export default UserProfileModal