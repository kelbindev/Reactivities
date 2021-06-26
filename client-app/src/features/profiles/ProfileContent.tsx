import React from 'react'
import {Tab} from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import ProfilePhoto from './ProfilePhotos'
import ProfileAbout from './ProfileAbout'
import ProfileFollowing from './profileFollowings'
import { useStore } from '../../app/stores/store'

interface props{
    profile: Profile;
}

export default function  ProfileContent({profile}:props) {
    const {profileStore} = useStore();

    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout profile={profile} />},
        {menuItem: 'Photos', render: () => <ProfilePhoto profile={profile} />},
        {menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane>},
        {menuItem: 'Followers', render: () => <ProfileFollowing predicate={'followers'} />},
        {menuItem: 'Following', render: () => <ProfileFollowing predicate={'following'} />}
    ]

    return (
        <Tab
            menu={{fluid:true, vertical:true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e,data) => {profileStore.setActiveTab(data.activeIndex)}}
            />
    )
}