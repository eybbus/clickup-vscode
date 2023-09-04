
import axios from 'axios';
import * as vscode from 'vscode';
import { AuthenticatedUser, AuthenticatedUserResponse, Folder, FolderResponse, List, ListResponse, Space, SpaceResponse, Task, TaskResponse, Team, TeamResponse } from './clickupAPI';

const clickupAPI = 'https://api.clickup.com/api/v2';


export class ClickupProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
  private _tasks: Record<string, Task[]>;

  private _teams: Team[] | undefined;
  private _spaces: Record<string, Space[]> = {};

  private _folders: Record<string, Folder[]> = {};

  private _lists: Record<string, List[]> = {};

  private _authenticatedUser: AuthenticatedUser | undefined;

  constructor() {
    this._tasks = {};
  }

  init(apiKey: string) {
    axios.defaults.headers.common['Authorization'] = apiKey;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    this.getAuthenticatedUser();
    this.getTeams();
  }


  refresh(): void {
    this.getTeams();
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    console.log({element, this: this});
    
    if(element) {
      if(element.type === 'team') {
        let display: Dependency[] = [];
        this._spaces[element.id]?.forEach((el: Space) => {
          let state = vscode.TreeItemCollapsibleState.Collapsed;
          display.push(new Dependency(el.name || 'undefined', '', state, 'space', el.id as string));
        });
        return Promise.resolve(display);
      }
      if(element.type === 'space') {
        let folder = this._folders[element.id];
        if(folder === undefined) {
          this.getFolders(element.id);
          return Promise.resolve([new Dependency('Loading...', '', vscode.TreeItemCollapsibleState.None, 'folder', '0')]);
        } else {
          let display: Dependency[] = [];
          folder.forEach((el: Folder) => {
            let state = vscode.TreeItemCollapsibleState.Collapsed;
            display.push(new Dependency(el.name || 'undefined', '', state, 'folder', el.id as string));
          });
          return Promise.resolve(display);
        };
      }

      if(element.type === 'folder') {
        let list = this._lists[element.id];
        if(list === undefined) {
          this.getFolderList(element.id);
          return Promise.resolve([new Dependency('Loading...', '', vscode.TreeItemCollapsibleState.None, 'list', '0')]);
        } else {
          let display: Dependency[] = [];
          list.forEach((el: any) => {
            let state = vscode.TreeItemCollapsibleState.Collapsed;
            display.push(new Dependency(el.name || 'undefined', '', state, 'list', el.id as string));
          });
        
         return Promise.resolve(display);
        }
      }

      if(element.type === 'list') {
        let task = this._tasks[element.id];
        if(task === undefined) {
          this.getTasks(element.id);
          return Promise.resolve([new Dependency('Loading...', '', vscode.TreeItemCollapsibleState.None, 'task', '0')]);
        } else {
          let display: Dependency[] = [];
          task.forEach((el: Task) => {
            let state = vscode.TreeItemCollapsibleState.None;
            display.push(new Dependency(el.name || 'undefined', el.custom_id || 'undefined', state, 'task', el.id as string));
          });
          return Promise.resolve(display);
        }
      }

      console.log('element');
      console.log(element);
      let display: Dependency[] = [];

      return Promise.resolve(display);
    }

    let teams: Dependency[] = [];
    this._teams?.forEach((el: Team) => {
      let state = vscode.TreeItemCollapsibleState.Collapsed;
      teams.push(new Dependency(el.name || 'undefined', `[${el.members.length}]` || 'undefined', state, 'team', el.id as string));
    });

    return Promise.resolve(teams);
  }

  /**
   * This retrieves the authorized user information.
   * As in the user from the personal token.
   * endpoint: /user
   */
  getAuthenticatedUser() {
    axios.get<AuthenticatedUserResponse>(`${clickupAPI}/user`).then(({ data }) => {
      console.log({getAuthenticatedUser: data});
      this._authenticatedUser = data.user;
      return data;
    });
  }

  /**
   * endpoint: /team
   */
  getTeams() {
    axios.get<TeamResponse>(`${clickupAPI}/team`).then(({ data }) => {
        console.log({getTeams: data });
        if(data?.teams?.length > 0) {
          this._teams = data.teams;
          console.log({test: data.teams[0].id});
          data.teams.forEach((team: Team) => {
            if (team.id) {
              this.getSpaces(team.id);
            };
          });
          if(data.teams[0].id) {
            this.getSpaces(data.teams[0].id);
          }
        }
        return data;
      });
  }

  /**
   * endpoint: /team/{team_id}/space
   */
  getSpaces(teamId: string) {
    console.log('triggered getSpaces');
    axios.get<SpaceResponse>(`${clickupAPI}/team/${teamId}/space`).then(({ data }) => {
        console.log({getSpaces: data});
        if(data?.spaces?.length > 0) {
          this._spaces[teamId] = data.spaces;
          this._onDidChangeTreeData.fire();
        }
      }
    );
  }

  /**
   * endpoint: /space/{space_id}/folder
   */
  getFolders(spaceId: string) {

    axios.get<FolderResponse>(`${clickupAPI}/space/${spaceId}/folder`).then(({ data }) => {
        console.log({getFolders: data});
        if(data?.folders?.length > 0) {
          this._folders[spaceId] = data.folders;
          this._onDidChangeTreeData.fire();
        }
      }
    );
  }


  /**
   * Use the Get Folderless Lists endpoint to find the Folderless Lists in a given Space.
   * endpoint: /space/{space_id}/folder
   */
  getSpaceList(spaceId: string) {}

  /**
   * Use the Get Lists endpoint to find the Lists in a given Folder.
   * endpoint: /folder/{folder_id}/list
   */
  getFolderList(folderId: string) {
    axios.get<ListResponse>(`${clickupAPI}/folder/${folderId}/list`).then(({ data }) => {
      console.log({getFolderList: data});
      if(data?.lists?.length > 0) {
        this._lists[folderId] = data.lists;
        this._onDidChangeTreeData.fire();
      }
    });
  }
  
  /**
   * Use the Get Tasks endpoint to find the Tasks in a given List.
   * endpoint: /list/{list_id}/task
   * 34136586
   */
  getTasks(listId: string) {
    const assigness = [this._authenticatedUser?.id];

    axios.get<TaskResponse>(`${clickupAPI}/list/${listId}/task`, { params: { assignees: assigness } }).then(({data}) => {
      console.log(data);
      this._tasks[listId] = data.tasks;
      this._onDidChangeTreeData.fire();
    }).catch((error) => {
      console.log(error);
    });
  }
}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private readonly status: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState, 
    public readonly type: 'team' | 'space' | 'folder' | 'list' | 'task',
    public readonly id: string,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}-[${this.status}]`;
		this.description = this.status.toUpperCase();
	}

	contextValue = 'dependency';
}