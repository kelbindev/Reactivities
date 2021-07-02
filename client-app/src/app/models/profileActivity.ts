export interface ProfileActivity{
    id: string;
    title:string;
    category: string;
    date: Date;
}

export class ProfileActivity implements ProfileActivity {
    constructor(values?: ProfileActivity) {
      Object.assign(this, values);
    }
  }

