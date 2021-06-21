import React, { useState } from 'react'
import { Tab, Header, Grid, Button, Form, Segment, Item, Divider } from 'semantic-ui-react';
import MyTextInput from '../../app/common/MyTextInput';
import MyTextArea from '../../app/common/MyTextArea';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup'
import { Formik } from 'formik';
import { Profile, ProfileAbouts } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface props {
    profile: Profile;
}

export default observer(function ProfileAbout({ profile }: props) {
    const { profileStore: { isCurrentUser, updateAbout } } = useStore();
    const [editMode, setEditMode] = useState(false);
    const abouts = new ProfileAbouts(profile!);

    function handleSubmit(about: ProfileAbouts) {
        about.username = profile!.username;
        console.log(about);
        updateAbout(about).then(() => { setEditMode(false) });
    }

    function handleCancel() {
        setEditMode(false);
    }

    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display Name is required')
    })

    return (
        <Segment clearing>
            <Tab.Pane>
                <Grid>
                    <Grid.Column width={16}>
                        <Header floated='left' icon='user' content={'About ' + profile?.displayName} />
                        {isCurrentUser && (
                            <Button floated='right' basic content={editMode ? 'Cancel' : 'Edit About'}
                                onClick={() => { setEditMode(!editMode) }} />
                        )}
                    </Grid.Column>

                    {editMode ? (
                        <Grid.Column width={16}>
                            <Formik initialValues={abouts} validationSchema={validationSchema}
                                onSubmit={(val) => handleSubmit(val)} enableReinitialize>
                                {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                        <MyTextInput name='displayName' placeholder='Display Name' />
                                        <MyTextArea name='bio' placeholder='Bio' rows={3} />
                                        <Button
                                            disabled={isSubmitting || !isValid || !dirty}
                                            floated='right' positive type='submit' content='Submit' loading={isSubmitting} />
                                        <Button floated='right' type='button' content='Cancel' onClick={handleCancel} />
                                    </Form>
                                )}
                            </Formik>
                        </Grid.Column>
                    ) : (
                        <Grid.Column width={16}>
                            <Item>
                                <Item.Content>
                                    <Item.Header as='h3'>
                                        {profile?.displayName}
                                    </Item.Header>
                                </Item.Content>
                                <Divider />
                                <Item.Content>
                                    {profile?.bio}
                                </Item.Content>
                            </Item>
                        </Grid.Column>
                    )}
                </Grid>
            </Tab.Pane>
        </Segment>
    )
})