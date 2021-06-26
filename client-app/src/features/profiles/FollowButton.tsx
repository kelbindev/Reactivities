import React, { SyntheticEvent } from 'react'
import { Reveal, Button } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite'
import { useStore } from '../../app/stores/store';

interface props {
    profile: Profile;
}

export default observer(function FollowButton({ profile }: props) {
    const { profileStore, userStore } = useStore();
    const { updateFollowing, loading } = profileStore;

    function handleFollow(e: SyntheticEvent, username: string) {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true)
    }

    if (userStore.user?.username === profile?.username) return null;

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button fluid color='teal'
                    content={profile?.following
                        ? 'Following' : 'Not Following'} />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button fluid basic
                    color={profile?.following ? 'red' : 'green'}
                    content={profile?.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    disabled={loading}
                    onClick={(e) => {
                        handleFollow(e, profile?.username)
                    }}
                />
            </Reveal.Content>
        </Reveal>
    )
})

