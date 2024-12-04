import { Link } from 'react-router-dom';
import { useSession } from '../../SessionContext';

const TopNav = () => {
    const {user, logout} = useSession();
    const handleLog = async () => {
        if(user){
            await logout()
        }
    }
    return (
        <div className="top-nav">
            <h1 className="top-nav-logo">
                <Link to ="/"> Todo-List </Link>
            </h1>
            <div>
                <Link to ={user ? "/" : "/Login"} onClick={() => handleLog()}> {user ? "Logout" : "Login"} </Link>
            </div>
        </div>
    );
};

export default TopNav;