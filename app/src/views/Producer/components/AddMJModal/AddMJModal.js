import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilValue } from "recoil";

import { web3State, currentAccountState, contractState } from "../../../../state/state";

import styles from "./AddMJModal.module.scss";

import Button from "../../../../components/Button/Button";

const AddMJModal = React.memo(props => {

    const web3 = useRecoilValue(web3State);
    const currentAccount = useRecoilValue(currentAccountState);

    const contract = useRecoilValue(contractState);
    
    const [state, setState] = useState({
        name: "",
        strainType: "Indica",
        amount: 0,
        price: 0
    });
    const [error, setError] = useState('')

    const handleChange = dataType => e => {
        setState({ ...state, [dataType]: e.target.value });
    };

    const validate = () =>  {
        return state.name && state.strainType && state.amount && state.price
    }

    const createProduct = async e => {
        if (validate()) {
            const {name, strainType, amount, price} = state
            await contract.methods.createProduct(name, strainType, +amount, +price).send({from: currentAccount, gasLimit: web3.utils.toWei("1"), gas: 1000000})
            .then(props.updateProducts)
        } else {
            setError('Please fill all 4 fields')
        }
    }

    return ReactDOM.createPortal(
        <div className={styles["modal-container"]}>
            <div className={styles.shadow}></div>

            <div className={styles.modal}>
                <span
                    className={styles["close-button"]}
                    onClick={() => props.setShowModal(false)}
                >
                    X
                </span>
                <h3>Add new product</h3>
                <form className={styles.form}>
                    <div className={styles["data-input"]}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" onChange={handleChange("name")} />
                    </div>
                    <div className={styles["data-input"]}>
                        <label htmlFor="type">Strain type:</label>
                        <select onChange={handleChange("strainType")}>
                            {
                                ['Indica', 'Sativa', 'Hybrid'].map(type => <option value={type} key={type}>{type}</option>)
                            }
                        </select>
                    </div>
                    <div className={styles["data-input"]}>
                        <label htmlFor="amount">Amount:</label>
                        <input type="text" onChange={handleChange("amount")} placeholder="Amount in grams"/>
                    </div>
                    <div className={styles["data-input"]}>
                        <label htmlFor="price">Price:</label>
                        <input type="text" onChange={handleChange("price")} placeholder="Maximum price in dollars $256"/>
                    </div>
                    {error ? <span className={styles.error}>{error}</span> : null}
                    <Button text="Create" onClick={createProduct} />
                </form>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
})

export default AddMJModal;
