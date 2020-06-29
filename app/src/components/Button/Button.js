import React from "react";
import { Link } from "react-router-dom";

import styles from "./Button.module.scss";

/**
 *
 * @param {String} color - number of color to use (0-5)
 * @param {String} to - Link to
 * @param {Function} onClick - function to run onClick
 */
const Button = props => (
    <div
        className={`${styles.button} ${
            props.color !== undefined
                ? styles[`color-${props.color}`]
                : styles[`color-1`]
        }`}
    >
        {props.to ? (
            <Link to={props.to} onClick={props.onClick || null}>
                {props.text}
            </Link>
        ) : (
            <span onClick={props.onClick || null}>{props.text}</span>
        )}
    </div>
);

export default Button;
