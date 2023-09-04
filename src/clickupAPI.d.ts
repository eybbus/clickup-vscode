/* eslint-disable @typescript-eslint/naming-convention */
export type InvitedBy = {
  color: string | null
  email: string | null
  id: string | null
  initials: string | null
  profilePicture: string | null
  username: string | null
};

export type AuthenticatedUser = {
  id: string | null
  username: string | null
  email: string | null
  color: string | null
  profilePicture: string | null
  initials: string | null
  week_start_day: number | null
  global_font_support: boolean | null
  timezone: string | null
};

export type User = {
  color: string | null
  custom_role: string | null
  date_invited: string | null
  date_joined: string | null
  email: string | null
  id: string | null
  initials: string | null
  last_active: string | null
  profilePicture: string | null
  role: string | null
  username: string | null
};


export type Member = {
  can_create_views: boolean
  can_edit_tags: boolean
  can_see_points_estimated: boolean
  can_see_time_estimated: boolean
  can_see_time_spent: boolean
  invited_by: InvitedBy
  user: User
};

export type Team = {
  avatar: string | null
  color: string | null
  id: string | null
  name: string | null
  members: Member[]
};



export type Statuse = {
  id: string | null
  status: string | null
  type: string | null
  orderindex: number | null
  color: string | null
};

export type Statuses = Statuse[];

export type Priorities = {
  color: string | null
  id: string | null
  orderindex: number | null
  priority: string | null
};

export type Features = {
  due_dates: {
      enabled: boolean,
      start_date: boolean,
      remap_due_dates: boolean,
      remap_closed_due_date: boolean
  },
  sprints: {
      enabled: boolean
  },
  points: {
      enabled: boolean
  },
  custom_items: {
      enabled: boolean
  },
  priorities: {
      enabled: boolean,
      priorities: Priorities[]
  },
  tags: {
      enabled: boolean
  },
  time_estimates: {
      enabled: boolean,
      rollup: boolean,
      per_assignee: boolean
  },
  check_unresolved: {
      enabled: boolean,
      subtasks: any,
      checklists: any,
      comments: any
  },
  zoom: {
      enabled: boolean
  },
  milestones: {
      enabled: boolean
  },
  custom_fields: {
      enabled: boolean
  },
  dependency_warning: {
      enabled: boolean
  },
  status_pies: {
      enabled: boolean
  },
  multiple_assignees: {
      enabled: boolean
  },
  emails: {
      enabled: boolean
  },
  archived: boolean
};

export type Space = {
  id: string | null
  name: string | null
  color: string | null
  private: boolean
  avatar: string | null
  admin_can_manage: boolean
  statuses: Statuses
  multiple_assignees: boolean
  features: Features
  archived: boolean
};

export type List = {
  id: string | null
  name: string | null
  orderindex: number | null
  content: string | null
  status: string | null
  priority: string | null
  assignee: string | null
  task_count: number | null
  due_date: string | null
  start_date: string | null
  folder: Pick<Folder, 'id' | 'name'| 'hidden'> & { access: boolean} // should also have "access" field that is boolean TODO
  space: Pick<Space, 'id' | 'name'> & { access: boolean} // should also have "access" field that is boolean TODO
  archived: boolean
  override_statuses: boolean
  statuses: Statuses
  permission_level: string | null
};

export type Folder = {
  id: string | null
  name: string | null
  orderindex: number | null
  override_statuses: boolean
  hidden: boolean
  space: Pick<Space, 'id' | 'name'>
  task_count: string | null
  archived: boolean
  statuses: Statuses
  lists: any[]
  permission_level: string | null
};

type CustomFieldOption = {
  id: string,
  name: string,
  color: string | null,
  orderindex: number
};

type CustomField = {
  id: string,
  name: string,
  type: string,
  type_config: {
      placeholder?: string,
      new_drop_down?: boolean,
      options?: CustomFieldOption[]
  },
  date_created: string,
  hide_from_guests: boolean,
  required: boolean
};

type Creator = Pick<User, 'id' | 'username'  | 'color' | 'profilePicture' | 'email'>;
type Assignee = Pick<User, 'id' | 'username' | 'initials' | 'color' | 'profilePicture' | 'email'>;

type Task = {
  id: string,
  custom_id: string,
  name: string,
  text_content: string,
  description: string,
  status: {
      status: string,
      color: string,
      type: string,
      orderindex: number
  },
  orderindex: string,
  date_created: string,
  date_updated: string,
  date_closed: string | null,
  date_done: string | null,
  archived: boolean,
  creator: Creator,
  assignees: Assignee[],
  watchers: any[],
  checklists: any[],
  tags: any[],
  parent: any,
  priority: {
      color: string,
      id: string,
      orderindex: string,
      priority: string
  } | null,
  due_date: string | null,
  start_date: string | null,
  points: any,
  time_estimate: any,
  custom_fields: CustomField[],
  dependencies: any[],
  linked_tasks: any[],
  team_id: string,
  url: string,
  sharing: {
      public: boolean,
      public_share_expires_on: string | null,
      public_fields: string[],
      token: string | null,
      seo_optimized: boolean
  },
  permission_level: string,
  list: {
      id: string,
      name: string,
      access: boolean
  },
  project: {
      id: string,
      name: string,
      hidden: boolean,
      access: boolean
  },
  folder: {
      id: string,
      name: string,
      hidden: boolean,
      access: boolean
  },
  space: {
      id: string
  }
};

// Response types

export type TeamResponse = {
  teams: Team[]
};

export type SpaceResponse = {
  spaces: Space[]
};

export type FolderResponse = {
  folders: Folder[]
};

export type ListResponse = {
  lists: List[]
};

export type TaskResponse = {
  tasks: Task[]
};

export type AuthenticatedUserResponse = {
  user: AuthenticatedUser
};
