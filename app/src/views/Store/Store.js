import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
    allProductState,
    contractState,
    currentAccountState
} from "../../state/state";

import styles from "./Store.module.scss";

import MJ from "../../components/MJ/MJ";

export default props => {
    const [error, setError] = useState("");
    const [allProducts, setAllProducts] = useRecoilState(allProductState);

    const currentAccount = useRecoilValue(currentAccountState);
    const contract = useRecoilValue(contractState);

    useEffect(() => {
        contract.methods
            .getProducers()
            .call({ from: currentAccount })
            .then(producers => {
                if (error) setError();
                Promise.all(
                    producers
                        .filter((p, i, arr) => arr.indexOf(p) === i)
                        .map(p =>
                            contract.methods
                                .getProducts(p)
                                .call({ from: currentAccount })
                        )
                )
                    .then(allProducers => {
                        if (error) setError();
                        // Show only Available and not owned products
                        const allProducts = allProducers.map(producer =>
                            producer
                                .filter(
                                    p =>
                                        p[2] ===
                                            "0x0000000000000000000000000000000000000000" &&
                                        p[5] === "Available"
                                )
                                .map((product, index) => [...product, index])
                        );
                        setAllProducts(allProducts.flat());
                    })
                    .catch(err => setError(err.message));
            })
            .catch(err => setError(err.message));
    }, [contract.methods, setAllProducts, currentAccount]);

    return (
        <div>
            <h1>Store</h1>
            {error ? <span className={styles.error}>{error}</span> : null}
            <div className={styles.products}>
                {allProducts.length && !error
                    ? allProducts.map(mj => {
                          return (
                              <MJ
                                  key={mj[0]}
                                  id={mj[0]}
                                  producer={mj[1]}
                                  name={mj[3]}
                                  strainType={mj[4]}
                                  state={mj[5]}
                                  amount={mj[6]}
                                  price={mj[7]}
                                  index={mj[8]}
                              />
                          );
                      })
                    : null}
            </div>
        </div>
    );
};
