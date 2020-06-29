import React from "react";
import { Link } from "react-router-dom";

import styles from "./Navbar.module.scss";

export default props => (
    <div className={styles.navbar}>
        <Link to="/">Home</Link>
        <Link to="/producer">Producer</Link>
        <Link to="/store">Store</Link>
        <Link to="/my-purchases">My purchases</Link>
    </div>
);
