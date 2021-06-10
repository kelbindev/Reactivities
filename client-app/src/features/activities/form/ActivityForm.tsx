import { observer } from 'mobx-react-lite'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Form, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'

export default observer(function ActivityForm() {
    const history = useHistory()
    const { activityStore } = useStore()
    const { createActivity, updateActivity, isSubmitting, loadActivity,loadingInitial } = activityStore
    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) { 
            loadActivity(id).then(
                (e) => {
                   setActivity(e!)
                }
            ) 
        };
    }, [id, loadActivity]);

    function handleSubmit() {
        if(activity.id){
            updateActivity(activity).then(
                () => history.push(`/activities/${activity.id}`)
            )
        }
        else
        {
            createActivity(activity).then(
                () => history.push(`/activities/${activity.id}`)
            )
        }
    }
    
    function handleCancel(){
        activity.id? history.push(`/activities/${activity.id}`) : history.push('/activities')
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value })
    }

    if (loadingInitial)  return <LoadingComponent />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}  autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button floated='right' positive type='submit' content='Submit' loading={isSubmitting} />
                <Button floated='right' type='button' content='Cancel' onClick={handleCancel} />
            </Form>
        </Segment>
    )
})