import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity'
import NavBar from './Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid'
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent'

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(repsonse => {
      let activities: Activity[] = [];

      repsonse.forEach(e => {
        e.date = e.date.split('T')[0];
        activities.push(e);
      });

      setActivities(activities);
      setLoading(false);
    });
  }, [])

  function handleSelectedActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectedActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateEditActivity(activity: Activity) {
    setSubmitting(true);

    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setSubmitting(false);
        setEditMode(false);
        setSelectedActivity(activity);
      })
    }
    else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, { ...activity, id: uuid() }]);
        setSubmitting(false);
        setEditMode(false);
        setSelectedActivity(activity);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(()=> {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    });
  }

  if (isLoading) return (
    <LoadingComponent />
  )

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={isSubmitting}
        />
      </Container>
    </Fragment>
  );
}

export default App;
