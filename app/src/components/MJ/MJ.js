import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {useLocation} from 'react-router-dom'

import styles from "./MJ.module.scss";

import states from "./MJStates";

import { web3State, currentAccountState, currentProducerState, contractState } from '../../state/state'

/**
 *
 * @param {String} name - name of product
 * @param {String} state - current state of product
 * @param {String} strainType - strainType of products
 * @param {Number} amount - number of grams
 * @param {Number} price - price in dollars
 */
const MJ = props => {
    const [showChangeState, setShowChangeState] = useState(false);
    const [error, setError] = useState('')

    const setProducts = useSetRecoilState(currentProducerState);
    const web3 = useRecoilValue(web3State);
    const currentAccount = useRecoilValue(currentAccountState);
    const contract = useRecoilValue(contractState)

    const location = useLocation().pathname.split('/').pop()

    const handleChange = show => e => {
            setShowChangeState(show);
    };

    const handleStateChange = (id, state) => e => {
        contract.methods.changeState(props.index, state).send({from: currentAccount, gasLimit: web3.utils.toWei("1"), gas: 1000000 }).then(res => {
            setProducts(prevState => {
                const newState = [...prevState]
                newState[props.index][5] = state
                return newState
            })
        })
    };

    const handleClick = type => e => {
        if (location === 'store' && currentAccount.toLowerCase() === props.producer.toLowerCase()) setError("You can't purchase your own product")
        else {
            if (error) setError('')
            if (type === 'buy')
                contract.methods.buy(props.producer, props.index).send({from: currentAccount, gasLimit: web3.utils.toWei("1"), gas: 1000000})
            else if (type === 'send')
                handleStateChange(props.id, 'Sent')()
            else if (type === 'receive') {
                contract.methods.receive(props.producer, props.index).send({from: currentAccount, gasLimit: web3.utils.toWei("1"), gas: 1000000})
            }
        }
    }

    const hiddenProducer = props.state === 'Sold' ? (
        <div className={styles['send-container']}>
            <button className={styles.send} onClick={handleClick('send')} type="text">Send</button>
            {error ? <span className={styles.error}>{error}</span> : null}
        </div>
        ) : ['Sent', 'Received'].includes(props.state) ? null : (
        <React.Fragment>
        <span>Current state: {props.state}</span>
        {Object.entries(states)
            // Producer should not be able to change state to current, Sold or Received
            .filter(s => ![...props.state, 'Sold', 'Received', 'Sent'].includes(s[0]))
            .map(s => (
                <span
                    className={`${styles.state} ${
                        styles[`state-${s[1]}`]
                    }`}
                    key={s[0]}
                    onClick={handleStateChange(props.id, s[0])}
                >
                    {s[0]}
                </span>
            ))}
        </React.Fragment>
    )

    const hiddenConsumer = 
        <div className={styles['buy-container']}>
            <button className={styles.buy} onClick={handleClick('buy')} type="text">Buy</button>
            {error ? <span className={styles.error}>{error}</span> : null}
        </div>

    const hiddenMyPurchase = 
        <div className={styles['my-purchases-container']}>
            <button className={styles.receive} onClick={handleClick('receive')} type="text">Receive</button>
            {error ? <span className={styles.error}>{error}</span> : null}
        </div>

    const hiddenView = location === 'producer' ? hiddenProducer : location === 'store' ? hiddenConsumer : hiddenMyPurchase

    let style
    if (location === 'producer') style = props.state === 'Sold' ? styles['producer-sold'] : styles.producer
    else if (location === 'store') style = styles.consumer
    else style = styles['my-purchases']

    return (
        <div
            className={`${styles.mj} ${style}`}
            onClick={handleChange(true)} // quick solution for onMouseOver triggered from Modal
            onMouseLeave={handleChange(false)}
        >
            <div
                className={`${styles["mj-view"]} ${
                    showChangeState ? styles.inactive : ""
                }`}
            >
                <div className={styles["image-container"]}>
                    <span
                        className={`${styles.state} ${
                            styles[`state-${states[props.state]}`]
                        }`}
                    >
                        {props.state}
                    </span>
                    <span className={styles.strainType}>{props.strainType}</span>
                    <span className={styles.offer}>{props.amount}g for ${props.price}</span>
                    <span className={styles.image}>Image</span>
                </div>
                <p>{props.name}</p>
            </div>
            <div
                className={`${styles["mj-hidden"]} ${
                    showChangeState ? styles.active : ""
                }`}
            >
                {hiddenView}
            </div>
        </div>
    );
};

export default MJ;
