import { User } from "./user";

export interface Profile{
    username: string
    displayName: string
    image?:string
    bio?:string
    following: boolean
    followingCount: number
    followersCount: number
    photos?: Photo[]
}

export class Profile implements Profile {
    constructor(user: User){
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo{
    id: string
    url: string
    isMain: boolean
    
}

export class ProfileAbouts {
    username: string = ''
    displayName: string = ''
    bio: string | undefined
    following: boolean = false
    followingCount: number = 0
    followersCount: number = 0

    constructor(profile: Profile){
        if (profile){
            this.username = profile.username;
            this.displayName = profile.displayName;
            this.bio = profile.bio;
            this.following = profile.following;
            this.followersCount = profile.followersCount;
            this.followingCount = profile.followingCount;
        }
    }
}