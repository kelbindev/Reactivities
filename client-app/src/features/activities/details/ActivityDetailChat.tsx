import { Formik,Form, Field, FieldProps } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup'
import { formatDistanceToNow } from 'date-fns/esm'

interface props {
    activityId: string
}

export default observer(function ActivityDetailChat({ activityId }: props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, activityId])

    const validationSchema = Yup.object({
        body: Yup.string().required('Comment cannot be empty')
    })

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comment.map(comment => (
                        <Comment key={comment.id.toString()}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace:'pre-wrap'}}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}

                    <Formik validationSchema={validationSchema}
                        onSubmit={(values, {resetForm}) => commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps)=> (
                                        <div style={{position: 'relative'}}>
                                            <Loader active={isSubmitting} />
                                            <textarea 
                                                placeholder='Enter your comment' 
                                                rows={2} 
                                                {...props.field}
                                                onKeyPress={e=> {
                                                    if (e.key=== 'Enter' && e.shiftKey ){
                                                        return;
                                                    }
                                                    if (e.key=== 'Enter'&& !e.shiftKey){
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }} />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                </Comment.Group>
            </Segment>
        </>

    )
})