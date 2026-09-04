export type CategoryType =
  | 'ROAD'
  | 'STREETLIGHT'
  | 'WASTE'
  | 'WATER'
  | 'DRAINAGE'
  | 'TRAFFIC'
  | 'ENVIRONMENT'
  | 'OTHER';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 'REPORTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'DUPLICATE' | 'REJECTED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN' | 'RESIDENT';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  communityArea: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  category: CategoryType;
  location: string;
  severity: Severity;
  peopleAffected: number;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  status: IssueStatus;
  supportCount: number;
  reportedBy: number;
  reportedByName?: string;
  adminNotes?: string;
  assignedOfficer?: number;
  assignedOfficerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IssueCreateDTO {
  title: string;
  description: string;
  category: CategoryType;
  location: string;
  severity: Severity;
  peopleAffected: number;
  reportedBy?: number;
  reportedByName?: string;
}

export interface IssueUpdateDTO {
  title?: string;
  description?: string;
  location?: string;
  severity?: Severity;
  peopleAffected?: number;
}

export interface Category {
  id: string;
  code: CategoryType;
  name: string;
  description: string;
  iconName: string;
}
