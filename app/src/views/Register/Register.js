import React from "react";
import { useLocation } from "react-router-dom";

import Form from "../components/Form/Form";

export default props => {
    const { pathname } = useLocation();

    const type = pathname.split("/").pop();

    return (
        <Form
            type={type === "producer" ? "producer" : "consumer"}
            to="/login"
        />
    );
};
