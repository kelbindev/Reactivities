import { observer } from 'mobx-react-lite';
import React from 'react'
import { Card, Grid, Tab } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import ProfileActivityCard from './ProfileActivityCard';

interface props {
    predicate: string;
}

export default observer(function ProfileEventActivities({ predicate }: props) {
    const { profileStore } = useStore();
    const { activities, loadingFollowing } = profileStore;

    return (
        <Tab.Pane loading={loadingFollowing}>
            <Grid>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {activities.map(e => {
                            return <ProfileActivityCard key={e.id} activity={e} />
                        })}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})