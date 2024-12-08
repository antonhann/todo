
import TopNav from "./TopNav"
export const Layout = ({ children} : any) => {
    return (
        <div className = "app-container">
            <TopNav/>
            <section className="main-container">
                {children}
            </section>
            <footer><p>After sending the first request to the backend server please wait a minute or two then try again and the backend server needs to be started up after inactive for a period!</p></footer>
        </div>
    )
}