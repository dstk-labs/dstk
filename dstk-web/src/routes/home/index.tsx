import { useLogout } from '@/hooks';
import { Button } from '@/components/ui';

export const Home = () => {
    const logout = useLogout();
    // TODO: Just here until we get to User UI Stuff
    return <Button onClick={logout}>Logout</Button>;
};
