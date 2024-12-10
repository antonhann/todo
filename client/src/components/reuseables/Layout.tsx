
import { Link } from "react-router-dom"
import TopNav from "./TopNav"
export const Layout = ({ children} : any) => {
    return (
        <div className = "app-container">
            <TopNav/>
            <section className="main-container">
                {children}
            </section>
            <footer>
                <p>After sending the first request to the backend server please wait a minute or two, your request will be fulfilled then the backend will act normally (the backend server needs to be started up after inactive for a period!)</p>
                <Link to="/backend" className="backend-link">Click for backend instructions!</Link>
            </footer>
        </div>
    )
}