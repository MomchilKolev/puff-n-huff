import React, {useEffect} from "react";
import {useRecoilState, useRecoilValue} from 'recoil'

import { allProductState, contractState, currentAccountState } from '../../state/state'

import styles from './MyPurchases.module.scss'

import MJ from '../../components/MJ/MJ'

export default props => {
  const [myPurchases, setMyPurchases] = useRecoilState(allProductState)

  const currentAccount = useRecoilValue(currentAccountState)
  const contract = useRecoilValue(contractState)

  useEffect(() => {
    (async () => {
      const producerAddresses = await contract.methods.getProducers().call({from: currentAccount})
      let producers = await Promise.all(producerAddresses.filter((p, i, arr) => arr.indexOf(p) === i).map(p => contract.methods.getProducts(p).call({from: currentAccount})))
      const products = producers.map(producer => producer.map((p, i) => [...p, i]))
      setMyPurchases(products.flat().filter(p => p[2].toLowerCase() === currentAccount))
    })()
  }, [contract.methods, setMyPurchases, currentAccount])

  return ( 
    <div>
      <h1>My Purchases</h1>
      <div className={styles.products}>
      {
        myPurchases.length ? myPurchases.map((mj) => 
        {
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
          )
        }
        )
       : null}
      </div>
    </div>
  )

};
