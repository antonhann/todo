import React from "react";
import { useSession } from "../../SessionContext";
import Todo from "./Todo";

const Home: React.FC = () => {
    const { user } = useSession();
    return (
        <div>
            <div>
                <h1>
                    Welcome{user ? `, ${user.username}` : ""}!
                </h1>
                <p>
                    {user
                        ? "We're glad to see you back. Explore your todos and stay organized!"
                        : "Please log in or register to get started with your todos."}
                </p>
                <Todo/>
            </div>
        </div>
    );
};

export default Home;
