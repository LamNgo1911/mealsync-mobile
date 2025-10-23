export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserPreference {
  id: string;
  dietaryRestrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  notifications: {
    push: boolean;
    email: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  userPreference: UserPreference;
}
