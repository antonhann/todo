import React from "react";
import { useSession } from "../../SessionContext";
import Todo from "./Todo";

const Home: React.FC = () => {
    const { user } = useSession();
    return (
        <div>
            <div className="d-flex justify-content-center flex-column align-items-center">
                <h1>
                    Welcome{user ? `, ${user.username}` : ""}!
                </h1>
                <h3>
                    {user
                        ? "We're glad to see you back. Explore your todos and stay organized!"
                        : "Please log in or register to get started with your todos."}
                </h3>
                <Todo/>
            </div>
        </div>
    );
};

export default Home;
