import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useHistory } from "react-router-dom";

import { web3State, currentAccountState, contractState } from "../../../state/state";

import styles from "./Form.module.scss";

import Button from "../../../components/Button/Button";

/**
 *
 * @param {String} type - producer/consumer/login
 * @param {String} to - link on submit
 */
const Form = React.memo(props => {
    const history = useHistory();

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // https://github.com/facebookexperimental/Recoil/issues/12
    // https://github.com/final-form/react-final-form/issues/751#issuecomment-606212893
    // https://github.com/facebook/react/issues/18178
    const web3 = useRecoilValue(web3State);
    const currentAccount = useRecoilValue(currentAccountState);
    const contract = useRecoilValue(contractState)

    const headings = {
        producer: "Register as Producer",
        consumer: "Register as Consumer",
        login: "Login"
    };

    const handleChange = e => {
        setPassword(e.target.value);
    };

    const validate = () => {
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const submit = type => async () => {
        if (validate()) {
            setError("");
            // Before deciding to store and auth on blockchain
            // Don't
            if (type === "login") {
                // Login
                    const loginPass = web3.utils.fromAscii(password)
                    const login = await contract.methods.login(loginPass).call({from: currentAccount});
                if (login === 0) {
                    setError("Incorrect Password");
                }
                else {
                    history.push(`/${+login === 1 ? 'producer' : 'store'}`);
                }
            } else {
                // Create user on blockchain
                // if currentAccount doesn't already exist
                const registerPass = web3.utils.fromAscii(password)
                contract.methods
                    .createUser(registerPass, props.type === 'producer' ? 1 : 2)
                    .send({ from: currentAccount, gasLimit: web3.utils.toWei("1"), gas: 1000000 })
                    .then(() => history.push('/login'))
                    .catch(e => setError(e.message));
            }
        }
    };

    return (
        <form className={styles.form}>
            <h1>{headings[props.type]}</h1>
            <p>Current account: {currentAccount}</p>
            <label htmlFor="password">Password</label>
            <input name="password" onChange={handleChange} type="text" />
            {error ? <span className={styles.error}>{error}</span> : null}
            <Button
                text="Submit"
                onClick={
                    props.type === "login"
                        ? submit("login")
                        : submit("register")
                }
            />
        </form>
    );
});

export default Form;
