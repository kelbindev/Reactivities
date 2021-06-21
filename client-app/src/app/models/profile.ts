import { User } from "./user";

export interface Profile{
    username: string
    displayName: string
    image?:string
    bio?:string
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

    constructor(profile: Profile){
        if (profile){
            this.username = profile.username;
            this.displayName = profile.displayName;
            this.bio = profile.bio;
        }
    }
}