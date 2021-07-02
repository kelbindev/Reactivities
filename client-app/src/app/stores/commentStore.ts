import { ChatComment } from '../models/comment'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import { makeAutoObservable, runInAction } from "mobx"
import { store } from './store'


export default class CommentStore {
    comment: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_CHAT_URL + '?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

                this.hubConnection?.start().catch(error => console.log('error establishing connection:', error))

                this.hubConnection?.on('LoadComments', (comments: ChatComment[]) => {
                    comments.forEach(e => 
                        e.createdAt = new Date(e.createdAt + 'Z')
                        );

                    runInAction(() => this.comment = comments);
                })

                this.hubConnection?.on('ReceiveComment', (comments: ChatComment) => {
                    comments.createdAt = new Date(comments.createdAt);
                    runInAction(() => this.comment.unshift(comments));
                })

        }
    }

    stopHubConnection = () => {
        if (this.hubConnection !== null) {
            this.hubConnection.stop().catch(error => console.log('error closing connection:', error))
        }
    }

    clearComments = () => {
        this.comment = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try{
            await this.hubConnection?.invoke("SendComment",values);
        }catch (error){
            console.log(error);
        }
    }
}