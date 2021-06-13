import { Formik, Form } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Header, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup'
import MyTextInput from '../../../app/common/MyTextInput'
import MyTextArea from '../../../app/common/MyTextArea'
import MySelectInput from '../../../app/common/MySelectInput'
import MyDateInput from '../../../app/common/MyDateInput'

import {CategoryOptions} from '../../../app/common/options/CategoryOptions'
import { Activity } from '../../../app/models/activity'
import { dir } from 'console'

export default observer(function ActivityForm() {
    const history = useHistory()
    const { activityStore } = useStore()
    const { createActivity, updateActivity, isSubmitting, loadActivity, loadingInitial } = activityStore
    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('Activity title is required'),
        description: Yup.string().required('Description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is Required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

    useEffect(() => {
        if (id) {
            loadActivity(id).then(
                (e) => {
                    setActivity(e!)
                }
            )
        };
    }, [id, loadActivity]);

    function handleFormSubmit(activity:Activity) {
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

    function handleCancel() {
        activity.id ? history.push(`/activities/${activity.id}`) : history.push('/activities')
    }

    if (loadingInitial) return <LoadingComponent />

    return (
        <Segment clearing>
            <Header sub color='teal' content='Activity Details' />
            <Formik validationSchema={validationSchema}
                enableReinitialize initialValues={activity}
                onSubmit={(values) => handleFormSubmit(values)}>
                {({ handleSubmit, isSubmitting,isValid,dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea  rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={CategoryOptions} placeholder='Category' name='category' />
                        <MyDateInput 
                        placeholderText='Date' 
                        name='date'
                        showTimeSelect
                        timeCaption='time'
                        dateFormat='MMMM d, yyyy h:mm aa'
                        />
                         <Header sub color='teal' content='Location Details' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button 
                            disabled = {isSubmitting||!isValid|| !dirty}
                            floated='right' positive type='submit' content='Submit' loading={isSubmitting} />
                        <Button floated='right' type='button' content='Cancel' onClick={handleCancel} />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})