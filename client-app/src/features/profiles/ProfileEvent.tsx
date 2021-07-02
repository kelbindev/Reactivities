import React from 'react'
import { Grid, Header, Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store';
import ProfileEventActivities from './ProfileEventActivities'

interface props{
    profile: Profile;
}

export default function ProfileEvent({profile}:props) {
    const {profileStore} = useStore();
    
    const panes = [
        { menuItem: 'Future Events', render: () => <ProfileEventActivities predicate='future' /> },
        { menuItem: 'Past Events', render: () => <ProfileEventActivities predicate='past' /> },
        { menuItem: 'Hosting', render: () => <ProfileEventActivities predicate='isHost' /> },
    ]

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content='Activities' />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ fluid: true, vertical: false }}
                        panes={panes}
                        onTabChange={(e, data) => {profileStore.setActiveEventTab(data.activeIndex) }}
                    />
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}