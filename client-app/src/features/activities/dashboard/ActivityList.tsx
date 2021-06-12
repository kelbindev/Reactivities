import { Fragment } from 'react'
import { observer } from 'mobx-react-lite';
import { Header } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem'

export default observer(function ActivityList() {
    const { activityStore } = useStore()
    const { groupedActivities } = activityStore

    return (
        <>
            {
                groupedActivities.map(([group, groupVal]) => (
                    <Fragment key={group}>
                        <Header sub color='teal'>
                            {group}
                        </Header>
                        {groupVal.map(e => (
                            <ActivityListItem key={e.id} activity={e} />
                        ))}
                    </Fragment>
                ))
            }
        </>
    )
})