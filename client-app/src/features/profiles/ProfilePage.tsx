import React from 'react'
import { Grid } from 'semantic-ui-react';
import ProfileHeader from './ProfileHeader'
import ProfileContent from './ProfileContent'
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useStore } from '../../app/stores/store';
import { useEffect } from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent';

export default observer(function ProfilePage(){
    const {username} = useParams<{username: string}>();
    const {profileStore} = useStore();
    const {loadProfile, profile,loadingProfile} = profileStore;

    useEffect(()=>{
        loadProfile(username);
    },[loadProfile,username])

    if (loadingProfile) return <LoadingComponent content='Loading Profile...' />

    return(
        <Grid>
            <Grid.Column width='16'>
                <ProfileHeader profile={profile!} />
                <ProfileContent profile={profile!} />
            </Grid.Column>
        </Grid>
    );
})