import React from 'react';
import { NavLink } from 'react-router-dom';
import {Button, Container, Menu} from 'semantic-ui-react'

export default function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header exact as={NavLink} to ='/'>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities" as={NavLink} to ='/activities'/>
                <Menu.Item>
                    <Button positive content="create activity" as={NavLink} to ='/createActivity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}