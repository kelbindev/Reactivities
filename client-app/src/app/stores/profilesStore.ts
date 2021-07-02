import { Photo, Profile } from '../models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx'
import agent from "../api/agent";
import { store } from './store';
import { ProfileActivity } from '../models/profileActivity';

export default class ProfileStore {
    profile: Profile | null = null
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    activities: ProfileActivity[] = [];
    loadingFollowing: boolean = false;
    activeTab:number = 0;

    activeEventTab:number = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            at => {
                if (at === 3 || at === 4) {
                    const predicate = at === 3 ? 'followers' : 'following'
                    this.loadFollowings(predicate);
                }
                else if (at === 2) {
                    this.clearProfileActivities();
                    var predicate = "";
                    switch (at.toString()){
                        case "0":
                           predicate = 'future';
                            break;
                        case "1":
                            predicate = 'past';
                            break;
                        case "2":
                            predicate = 'isHost';
                            break;
                    }

                    this.loadProfileEvents(predicate);
                }
                else {
                    this.clearFollowings();
                }
            }
        );

        reaction(
            () => this.activeEventTab,
            at => {
                var predicate = "";
                this.clearProfileActivities();
                switch (at.toString()){
                    case "0":
                       predicate = 'future';
                        break;
                    case "1":
                        predicate = 'past';
                        break;
                    case "2":
                        predicate = 'isHost';
                        break;
                }

                this.loadProfileEvents(predicate)
            }
        )
    }

    setActiveTab = (tabIndex:any) => {
        this.activeTab = tabIndex;
    }

    setActiveEventTab = (tabIndex:any) => {
        this.activeEventTab = tabIndex;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username
        }

        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            this.profile = profile;
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loadingProfile = false)
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo)
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url)
                        this.profile.image = photo.url;
                    }
                }
            })

        } catch (error) {
            console.log(error)
        } finally {
            runInAction(
                () => this.uploading = false
            )
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true
        try {
            await agent.Profiles.setMainPhoto(photo.id)
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(x => x.isMain === true)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(
                () => this.loading = false
            )
        }
    }

    deletePhoto = async (photoId: string) => {
        this.loading = true
        try {
            await agent.Profiles.deletePhoto(photoId)
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(x => x.id !== photoId)
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(
                () => this.loading = false
            )
        }
    }

    updateAbout = async (profile: Profile) => {
        try {
            await agent.Profiles.updateAbout(profile)
            runInAction(() => {
                if (this.profile) {
                    this.profile.displayName = profile.displayName
                    this.profile.bio = profile.bio
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.username === store.userStore.user?.username){
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(e => {
                    if (e.username === username) {
                        e.following ? e.followersCount-- : e.followersCount++;
                        e.following = !e.following;
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowing = true;
        try {
            const following = await agent.Profiles.listFollowing(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = following;

            });
        } catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => {
                this.loadingFollowing = false;
            })
        }
    }

    clearFollowings = () => {
        this.followings = []
    }

    clearProfileActivities = () => {
        this.activities = []
    }

    loadProfileEvents = async (predicate:string) => {
        this.loadingFollowing = true;

        try {
            const activities = await agent.Profiles.getProfileActivities(this.profile!.username, predicate);
            console.log(activities);
            runInAction(() => {
                this.activities = activities;

            });
        } catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => {
                this.loadingFollowing = false;
            })
        }
    }


}