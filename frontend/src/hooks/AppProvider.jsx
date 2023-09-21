import { UserProvider } from './auth/auth';

const AppProvider = ({ children }) => (
    <>
        <UserProvider>{ children }</UserProvider>
    </>
);

export default AppProvider;