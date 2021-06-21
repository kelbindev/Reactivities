import React from 'react'
import {Profile} from '../../app/models/profile'
import {observer} from 'mobx-react-lite'
import {Card, Icon, Image} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

interface Props{
    profile: Profile
}

function truncate(str : string = '', n : number){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  };

export default observer(function ProfileCard({profile}:Props){
    return(
        <Card as={Link} to={`profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncate(profile.bio,30)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                20 followers
            </Card.Content>
        </Card>
    )
})