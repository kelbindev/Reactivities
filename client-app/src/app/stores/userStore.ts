import { User, UserFormValues } from "../models/user";
import { makeAutoObservable, runInAction } from "mobx";
import agent from '../api/agent';
import { store } from "./store";
import { history } from "../..";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        try 
        {
            const result = await agent.Account.login(creds);
            store.commonStore.setToken(result.token);
            runInAction(() => this.user = result);
            history.push('/activities');
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error
        }
    }

    logout = () => {
        store.commonStore.token = null;
        this.user = null;
        localStorage.removeItem('jwt');
        history.push('/');
    }

    getCurrentUser = async () => {
        try{
            const result = await agent.Account.current();
            runInAction(() =>{this.user = result});
        } catch (error) { 
            console.log(error);
        }
       
    }

    register = async (creds: UserFormValues) => {
        try{
            const result = await agent.Account.register(creds);
            store.commonStore.setToken(result.token);
            runInAction(() => this.user = result);
            history.push('/activities');
            store.modalStore.closeModal();
        }catch (error) { 
            throw error;
        }
    }

}