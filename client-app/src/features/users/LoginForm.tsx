import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import MyTextInput from '../../app/common/MyTextInput';
import { Button, Header, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';

export default observer(function LoginForm() {
    var { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, {setErrors,setSubmitting}) => {
                userStore.login(values)
                .catch((error) => setErrors({error:'Invalid email or password'}))
                .finally(() => setSubmitting(false))
            }}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' autoComplete='off' onSubmit={handleSubmit}>
                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage 
                        name='error' render={() => 
                        <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />
                        }
                    />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})