import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import MyTextInput from '../../app/common/MyTextInput';
import { Button, Header } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup'
import ValidationError from '../errors/ValidationError'

export default observer(function RegisterForm() {
    var { userStore } = useStore();

    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors, setSubmitting }) => {
                userStore.register(values)
                    .catch((error) => 
                    {
                    setErrors({ error })}
                    ).finally(() => setSubmitting(false))
                
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                password: Yup.string().required(),
                email: Yup.string().required().email()
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' autoComplete='off' onSubmit={handleSubmit}>
                    <Header as='h2' content='Register Reactivities Account' color='teal' textAlign='center' />
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextInput name='username' placeholder='User Name' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage
                        name='error' render={() =>
                            <ValidationError errors={errors.error} />
                            // <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />
                        }
                    />
                    <Button loading={isSubmitting} disabled={!isValid || !dirty || isSubmitting} positive content='Register' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})