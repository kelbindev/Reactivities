import React from 'react'
import {Tab} from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import ProfilePhoto from './ProfilePhotos'

interface props{
    profile: Profile;
}

export default function  ProfileContent({profile}:props) {
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane>},
        {menuItem: 'Photos', render: () => <ProfilePhoto profile={profile} />},
        {menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane>},
        {menuItem: 'Followers', render: () => <Tab.Pane>Followers Content</Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane>Following Content</Tab.Pane>}
    ]

    return (
        <Tab
            menu={{fluid:true, vertical:true}}
            menuPosition='right'
            panes={panes}
            />
    )
}