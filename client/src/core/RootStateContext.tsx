import React, { Children } from 'react'
import { FilesStore } from './FilesStore';

type RootStateContextValue = {
    filesStore: FilesStore
}

const RootStateContext = React.createContext<RootStateContextValue>({} as RootStateContextValue)

const filesStore = new FilesStore()

export const RootStateProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    return <RootStateContext.Provider value={{ filesStore }}>
        {children}
    </RootStateContext.Provider>
}

export const useRootStore = () => React.useContext(RootStateContext)