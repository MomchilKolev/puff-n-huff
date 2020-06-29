import React from "react";

import styles from "./Home.module.scss";

import Button from "../../components/Button/Button";

export default props => (
    <div className={styles.home}>
        <h1>Puff N Huff</h1>
        <div className={styles.buttons}>
            <Button
                to="/register/producer"
                text="Register as Producer"
                color="2"
            />
            <Button to="/register/consumer" text="Register as Consumer" />
            <Button to="/login" text="Login" color="0" />
        </div>
    </div>
);
