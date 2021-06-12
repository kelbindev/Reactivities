import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import ActivityFilter from './ActivityFilter'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore()
    const {loadAcitivites, activityRegistry} = activityStore

    useEffect(() => {
        if (activityRegistry.size <= 1) loadAcitivites()
    }, [activityRegistry,loadAcitivites])
 
    if (activityStore.loadingInitial) return (
     <LoadingComponent />
   )

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilter />
            </Grid.Column>
        </Grid>
    )
})