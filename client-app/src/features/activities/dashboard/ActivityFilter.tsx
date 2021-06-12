import React from 'react'
import { Menu, Header } from 'semantic-ui-react'
import Calendar from 'react-calendar'

export default function ActivityFilters() {
    return (
        <>
         <Menu vertical size='large' style={{ width: '100%', marginTop:26}}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item content='All Activities' />
                <Menu.Item content="I'm going" />
                <Menu.Item content="I'm hosting" />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
}