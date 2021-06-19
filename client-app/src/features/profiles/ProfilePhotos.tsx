import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent } from 'react'
import { useState } from 'react';
import { Tab, Header, Card, Image, Grid, Button } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/ImageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface props {
    profile: Profile;
}

export default observer(function ProfilePhoto({ profile }: props) {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading,
        loading, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setPhotoMode] = useState(false);
    const [target,setTarget] = useState('');

    function uploadPhotoHandler(file: Blob) {
        uploadPhoto(file).then(() => setPhotoMode(false))
    }

    function handleSetMainPhoto(photo:Photo,e: SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleSetDeletephoto(photo:Photo,e: SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        deletePhoto(photo.id);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => { setPhotoMode(!addPhotoMode) }} />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhotoHandler={uploadPhotoHandler} uploading={uploading} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(
                                photo => (
                                    <Card key={photo.id}>
                                        <Image src={photo.url} />
                                        {isCurrentUser && (
                                            <Button.Group fluid widths={2}>
                                                <Button basic 
                                                color='green' 
                                                content='Main' 
                                                name={photo.id} 
                                                disabled={photo.isMain}
                                                loading={loading && photo.id === target}
                                                onClick={e => handleSetMainPhoto(photo,e)}
                                                />
                                            <Button basic 
                                                color='red' 
                                                icon='trash'
                                                name={photo.id+"delete"} 
                                                disabled={loading && photo.id+"delete" === target}
                                                loading={loading && photo.id+"delete" === target}
                                                onClick={e => handleSetDeletephoto(photo,e)}
                                                />
                                            </Button.Group>
                                        )}
                                    </Card>
                                ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>


        </Tab.Pane>
    )
})