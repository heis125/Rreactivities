import React, { Fragment, useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../modules/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent';
function App() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelctedActivity] = useState<Activity | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


 useEffect(() => {
     agent.Activities.list().then(response => {
         let activities: Activity[] = [];
         response.forEach(activity => {
             activity.date = activity.date.split('T')[0];
             activities.push(activity)
         })
         setActivities(activities);
         setLoading(false);
         })
 }, [])

    function handleSelectActivity(id: string) {
        setSelctedActivity(activities.find(x => x.id === id));
    }
    function handelCancelSelectActivity() {
        setSelctedActivity(undefined);
    }
    function handleFormOpen(id?: string) {
        id ? handleSelectActivity(id) : handelCancelSelectActivity();
        setEditMode(true);
    }
    function handleFormClose() {
        setEditMode(false);
    }
    function handleCreateOrEridActivity(activity: Activity) {
        setSubmitting(true);

        if (activity.id) {
            agent.Activities.update(activity).then(() => {
                setActivities([...activities.filter(x => x.id !== activity.id), activity])
                setSelctedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            })
        } else {
            activity.id = uuid();
            agent.Activities.create(activity).then(() => {
                setActivities([...activities, activity]);
                setSelctedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            })
        }
    }
    function handleDeleteActivity(id: string) {
        setSubmitting(true);
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter(x => x.id !== id)]);
            setSubmitting(false);
        })
        
    }

    if(loading) return <LoadingComponent/>

    return (
        <Fragment>
            <NavBar openForm={handleFormOpen} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activities}
                    selectedActivity={selectedActivity}
                    selectActivity={handleSelectActivity}
                    cancelSelectActivity={handelCancelSelectActivity}
                    editMode={editMode}
                    openForm={handleFormOpen}
                    closeForm={handleFormClose}
                    createOrEdit={handleCreateOrEridActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                />
          </Container>
         
        </Fragment>
  );
}

export default App;
