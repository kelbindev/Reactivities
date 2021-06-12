import React from 'react'
import { Container, Header } from 'semantic-ui-react';
import {useStore} from '../../app/stores/store'
import {Segment} from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';

export default observer(function ServerError(){
    const {commonStore} = useStore();
    return (
        <Container>
            <Header as='h1' content='Server Error'/>
            <Header sub as='h5' color='red' content={commonStore.error?.message}/>
            {commonStore.error?.details??
                <Segment>
                    <Header as='h4' content='Stack Trace' color='teal' />
                    <code style={{marginTop:'10px'}}>{commonStore.error?.details}</code>
                </Segment>
            }
        </Container>
    )
})