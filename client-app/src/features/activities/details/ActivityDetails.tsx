import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityDetailHeader from './ActivityDetailHeader'
import ActivityDetailContent from './ActivityDetailContent'
import ActivityDetailSidebar from './ActivityDetailSidebar'
import ActivityDetailChat from './ActivityDetailChat'

export default observer(function ActivityDetails() {
    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) { 
            loadActivity(id) 
        };
    }, [id, loadActivity]);

    if (loadingInitial || !activity) return <LoadingComponent />;

    return (
       <Grid>
           <Grid.Column width={10}>
                <ActivityDetailHeader activity={activity}/>
                <ActivityDetailContent activity={activity}/>
                <ActivityDetailChat />
           </Grid.Column>
           <Grid.Column width={6}>
                <ActivityDetailSidebar />
           </Grid.Column>
       </Grid>
    )
})