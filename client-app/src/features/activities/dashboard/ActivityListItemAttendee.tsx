import React from 'react'
import { Image, List, Popup } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { Profile } from '../../../app/models/profile'
import { Link } from 'react-router-dom'
import ProfileCard from '../../profiles/ProfileCard'

interface Props {
    attendees: Profile[]
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees.map((e) => (
                <Popup key={e.username} hoverable
                    trigger={
                        <List.Item key={e.username} as={Link} to={`/profiles/${e.username}`}>
                            <Image size='mini' circular src={e.image || '/assets/user.png'} />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={e} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    )
})