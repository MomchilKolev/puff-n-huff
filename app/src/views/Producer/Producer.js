import React, { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import styles from "./Producer.module.scss";

import { currentAccountState, currentProducerState, contractState } from '../../state/state'

import MJ from "../../components/MJ/MJ";
import AddButton from "./components/AddButton/AddButton";
import AddMJModal from "./components/AddMJModal/AddMJModal";

export default props => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('')

    const [products, setProducts] = useRecoilState(currentProducerState);
    const currentAccount = useRecoilValue(currentAccountState);
    const contract = useRecoilValue(contractState);

    const updateProducts = () => {
        contract.methods.getProducts(currentAccount).call({from: currentAccount}).then(products => {
            if (error) setError()
            setProducts(products.map((p, index) => [...p, index]))
        }).catch(err => setError(err.message))
    }

    useEffect(() => {
        if (currentAccount)
            updateProducts()
    }, [currentAccount, contract])

    return (
        <div>
            <h1>Producer</h1>
            {error ? <span className={styles.error}>{error}</span> : null}
            <div className={styles.products}>
                {error ? null : products.map(mj => (
                    <MJ
                        key={mj[0]}
                        id={mj[0]}
                        name={mj[3]}
                        strainType={mj[4]}
                        state={mj[5]}
                        amount={mj[6]}
                        price={mj[7]}
                        index={mj[8]}
                    />
                ))}
            </div>
            <AddButton setShowModal={setShowModal} />
            {showModal ? <AddMJModal setShowModal={setShowModal} updateProducts={updateProducts}/> : null}
        </div>
    );
}
