import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>
                <Link to={"/"}>KYY 's</Link>
            </h1>
            <nav className={styles.navigation}>
                <ul>
                    <li>
                        <NavLink
                            to={"/"}
                            className={({ isActive }) =>
                                isActive ? styles.active : undefined
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={"/projects"}
                            className={({ isActive }) =>
                                isActive ? styles.active : undefined
                            }
                        >
                            Projects
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={"/blog"}
                            className={({ isActive }) =>
                                isActive ? styles.active : undefined
                            }
                        >
                            Blog
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
