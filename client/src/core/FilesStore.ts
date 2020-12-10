import { makeAutoObservable } from 'mobx'
import { GetFiles, DeleteFile, GetAllUsers } from './api'
import { User } from './types';
export class FilesStore {
    files: any[] = []
    users: User[] = []
    constructor() {
        makeAutoObservable(this)
    }
    loadFiles = async () => {
        const res = await GetFiles()
        const {data} = res;
        this.files = data
    }
    deleteFile = async (id: string) => {
        await DeleteFile(id)
        this.loadFiles()
    }
    getAllUsers = async() => {
        const res = await GetAllUsers()
        const { data } = res;
        this.users = data
        
    }
}