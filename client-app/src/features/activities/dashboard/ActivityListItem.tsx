import React from 'react'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import ActivityItemListAttendee from './ActivityListItemAttendee'

interface props {
    activity: Activity;
}

export default function ActivityItemList({ activity }: props) {
    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled && (
                    <Label color='red' attached='top' content='Cancelled' style={{ textAlign: 'center' }} />
                )}
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={activity.host?.image || '/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Content>
                                Hosted By
                                <Link to={`/Profiles/${activity.hostUsername}`}> {activity.host?.displayName}</Link>
                                {activity.isHost && (
                                    <Item.Description>
                                        <Label basic color='orange'>
                                            Your are hosting this activity
                                        </Label>
                                    </Item.Description>
                                )}

                                {!activity.isHost && activity.isGoing && (
                                    <Item.Description>
                                        <Label basic color='green'>
                                            Your are going to this activity
                                        </Label>
                                    </Item.Description>
                                )}
                            </Item.Content>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' />{format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' />{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityItemListAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View' />
            </Segment>
        </Segment.Group>
    )
}