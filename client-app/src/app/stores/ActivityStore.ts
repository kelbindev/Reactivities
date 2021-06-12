import { makeAutoObservable, runInAction, } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"
import { v4 as uuid } from 'uuid'

export default class ActivityStore {
    activityRegistry = new Map<String, Activity>();
    selectedActivity: Activity | undefined = undefined;
    isEditMode: boolean = false;
    isSubmitting: boolean = false;
    loadingInitial: boolean = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activities() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            Date.parse(a.date) - Date.parse(b.date))
    }

    get groupedActivities(){
        return Object.entries(
            this.activities.reduce((_activities,_activity) => {
                const date = _activity.date
                _activities[date] = _activities[date] ?  [..._activities[date],_activity] : [_activity]
                return _activities
            }, {} as {[key: string]: Activity[]})
        )
    }

    setLoading(loading: boolean) {
        this.loadingInitial = loading
    }

    setEditMode(isEdit: boolean) {
        this.isEditMode = isEdit
    }

    loadAcitivites = async () => {
        this.setLoading(true);

        try {
            const activities = await agent.Activities.list()

            activities.forEach(e => {
                this.setActivity(e)
            })

            this.setLoading(false);

        }
        catch (error) {
            console.log(error);

            this.setLoading(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await (await agent.Activities.details(id)).data;
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                
                this.setLoading(false);
                return activity;
            }
            catch (error) {
                console.log(error);
                this.setLoading(false);
            }
        }
    }

    private getActivity(id: string) {
        return this.activityRegistry.get(id);
    }

    private setActivity(activity: Activity) {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity)
    }

    createActivity = async (activity: Activity) => {
        try {
            this.isSubmitting = true;
            activity.id = uuid()
            await agent.Activities.create(activity)
            runInAction(() => {
                // this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity)
                this.isSubmitting = false;
                this.setEditMode(false);
            })
        }
        catch (error) {
            console.log(error)
            runInAction(() => {
                this.isSubmitting = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        try {
            this.isSubmitting = true;
            await agent.Activities.update(activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.isSubmitting = false;
                this.setEditMode(false);
            })
        }
        catch (error) {
            console.log(error)
            runInAction(() => {
                this.isSubmitting = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.isSubmitting = true;
        try {
            await agent.Activities.delete(id);
            // this.activities = [...this.activities.filter(x => x.id !== id)]
            this.activityRegistry.delete(id);
            runInAction(() => {
                this.isSubmitting = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.isSubmitting = false;
            })
        }
    }

}