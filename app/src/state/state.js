import Web3 from "web3";
import { atom, selector } from "recoil";

import contractAddress from "./contractAddress";

import jsonInterface from "../contracts/PuffNHuff";

const defaultAddress = contractAddress;

export default atom({
    key: "productState",
    default: []
});

export const allProductState = atom({
    key: "allProductState",
    default: []
});

export const web3State = atom({
    key: "web3State",
    default: new Web3("http://localhost:7545")
});

export const accountState = selector({
    key: "accountState",
    get: async ({ get }) => {
        const web3 = get(web3State);
        return await web3.eth.getAccounts();
    }
});

const currentAccount = atom({
    key: "currentAccount",
    default: ""
});

export const currentAccountState = selector({
    key: "currentAccountState",
    get: ({ get }) => {
        return (
            get(currentAccount) ||
            window.ethereum.selectedAddress ||
            get(accountState)[0]
        );
    },
    set: ({ get, set }, acc) => {
        set(currentAccount, acc);
    }
});

export const currentProducerState = atom({
    key: "currentProducerState",
    default: [],
    dangerouslyAllowMutability: true
});

// AS OF 26.06.2020 cannot safely get and set contract as atom
// https://github.com/facebookexperimental/Recoil/issues/406
export const contractState = selector({
    key: "contractState",
    get: ({ get }) => {
        const web3 = get(web3State);
        return new web3.eth.Contract(jsonInterface.abi, defaultAddress);
    },
    dangerouslyAllowMutability: true
});
