import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../app/stores/store';
import {Card, Grid, Header, Tab} from 'semantic-ui-react'
import ProfileCard from './ProfileCard';

interface props{
    predicate:string;
}

export default observer(function ProfileFollowings({predicate}:props){
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowing,activeTab} = profileStore;

    return (
        <Tab.Pane loading={loadingFollowing}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' 
                    content={activeTab === 3 ? `People following ${profile?.displayName}` : `People ${profile?.displayName} are following`} />
                </Grid.Column> 
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(e => {
                           return <ProfileCard key={e.username} profile={e} />
                        })}
                    </Card.Group>
                </Grid.Column> 
            </Grid>
        </Tab.Pane>
    )
})