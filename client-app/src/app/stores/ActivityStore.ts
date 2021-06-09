import { makeAutoObservable, runInAction, } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"
import { v4 as uuid } from 'uuid'

export default class ActivityStore {
    activityRegistry = new Map<String,Activity>();
    selectedActivity: Activity | undefined = undefined;
    isEditMode: boolean = false;
    isSubmitting: boolean = false;
    loadingInitial: boolean = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activities(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=>
        Date.parse(a.date) - Date.parse(b.date))
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
                e.date = e.date.split('T')[0];
                // this.activities.push(e);
                this.activityRegistry.set(e.id,e)
            })

            this.setLoading(false);

        }
        catch (error) {
            console.log(error);

            this.setLoading(false);
        }
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id)
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.clearSelectedActivity()
        this.setEditMode(true);
    }

    closeForm = () => {
        this.setEditMode(false);
    }

    createActivity = async (activity: Activity) => {
        try {
            this.isSubmitting = true;
            activity.id = uuid()
            await agent.Activities.create(activity)
            runInAction(() => {
                // this.activities.push(activity);
                this.activityRegistry.set(activity.id,activity)
                this.isSubmitting = false;
                this.setEditMode(false);
                this.selectActivity(activity.id)
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
                // var index = this.activities.findIndex(x=> x.id === activity.id)                
                // this.activities[index] = activity;

                this.activityRegistry.set(activity.id,activity)

                this.isSubmitting = false;
                this.setEditMode(false);
                this.selectActivity(activity.id)
            })
        }
        catch (error) {
            console.log(error)
            runInAction(() => {
                this.isSubmitting = false;
            })
        }
    }

    deleteActivity = async (id:string) => {
        this.isSubmitting = true;
        try
        {
            await agent.Activities.delete(id);      
            // this.activities = [...this.activities.filter(x => x.id !== id)]
            this.activityRegistry.delete(id);
            if (this.selectedActivity?.id === id){
                this.clearSelectedActivity();
            }

            runInAction(() => {
                this.isSubmitting = false;
            })
        }
        catch (error){
            console.log(error);
            runInAction(() => {
                this.isSubmitting = false;
            })
        }
    }

}