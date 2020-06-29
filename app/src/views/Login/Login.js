import React from "react";

import Form from "../components/Form/Form";

export default props => {
    // TODO: verify password
    // Verify using current user address and stored hash of password on contract

    return (
        <Form type={"login"} to="/login" />
    );
};
