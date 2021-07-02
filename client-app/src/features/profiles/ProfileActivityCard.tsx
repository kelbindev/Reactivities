import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'
import { ProfileActivity } from '../../app/models/profileActivity'

interface Props{
    activity?: ProfileActivity
}

export default observer(function ProfileActivityCard({activity}:Props){
    return(
        <Card as={Link} to={`/activities/${activity?.id}`}>
            <Image src={`/assets/categoryImages/${activity?.category}.jpg`} fluid />
            <Card.Content>
                <Card.Header>{activity?.title}</Card.Header>
                <Card.Description>{activity?.category}</Card.Description>
            </Card.Content>
        </Card>
    )
})