import React from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore()
    const {selectedActivity, isEditMode} = activityStore

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !isEditMode &&
                    <ActivityDetails />}
                {isEditMode &&
                    <ActivityForm />}
            </Grid.Column>
        </Grid>
    )
})