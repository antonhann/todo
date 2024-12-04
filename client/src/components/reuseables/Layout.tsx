
import TopNav from "./TopNav"
export const Layout = ({ children} : any) => {
    return (
        <div className = "app-container">
            <TopNav/>
            <section className="main-container">
                {children}
            </section>
        </div>
    )
}