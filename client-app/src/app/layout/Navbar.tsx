import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react'
import { useStore } from '../stores/store';

export default observer(function NavBar() {
    const { userStore: { user, logout, isLoggedIn } } = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header exact as={NavLink} to='/'>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities" as={NavLink} to='/activities' />
                <Menu.Item name="Test Error" as={NavLink} to='/testerror' />
                <Menu.Item>
                    <Button positive content="create activity" as={NavLink} to='/createActivity' />
                </Menu.Item>
                {isLoggedIn ? (
                    <Menu.Item position='right'>
                        <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                        <Dropdown pointing='top left' text={user?.displayName}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/profile/${user?.username}`} text='My Profile' icon='user' />
                                <Dropdown.Item onClick={logout} text='Logout' icon='user' />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                ) : <Container/> }

            </Container>
        </Menu>
    )
})