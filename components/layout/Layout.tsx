import Navbar from "./navbar";

function Layout(props: any) {
    return (
        <div>
            <Navbar />
            {props.children}
        </div>
    );
}

export default Layout;
