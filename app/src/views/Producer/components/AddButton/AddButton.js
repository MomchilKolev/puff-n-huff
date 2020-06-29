import React from "react";

import styles from "./AddButton.module.scss";

const AddButton = props => {
    return (
        <div
            className={styles["add-button"]}
            onClick={() => props.setShowModal(prevState => !prevState)}
        >
            <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="40" cy="40" r="40" fill="#02C39A" />
                <rect
                    x="35.2"
                    y="16"
                    width="9.6"
                    height="48"
                    rx="4.8"
                    fill="white"
                />
                <rect
                    x="16"
                    y="44.8"
                    width="9.6"
                    height="48"
                    rx="4.8"
                    transform="rotate(-90 16 44.8)"
                    fill="white"
                />
            </svg>
        </div>
    );
};

export default AddButton;
