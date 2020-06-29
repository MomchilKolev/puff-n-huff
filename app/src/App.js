import React, {useEffect} from "react";
import { useSetRecoilState } from "recoil";
import { Switch, Route } from "react-router-dom";

import { currentAccountState } from "./state/state";

import Navbar from "./components/Navbar/Navbar";
import Home from "./views/Home/Home";
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import Producer from "./views/Producer/Producer";
import Store from "./views/Store/Store";
import MyPurchases from "./views/MyPurchases/MyPurchases";
import "./App.scss";

const App = () => {
    const setCurrentAccount = useSetRecoilState(currentAccountState)

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', accounts => {
            setCurrentAccount(accounts[0])
        })
    }

    useEffect(() => {
        setCurrentAccount(window.ethereum.selectedAddress)
    }, [setCurrentAccount])

    return (
            <React.Fragment>
                <Navbar />
                <div className="container">
                    <React.Suspense fallback="Loading...">
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route path="/register">
                                <Register />
                            </Route>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/producer">
                                <Producer />
                            </Route>
                            <Route path="/store">
                                <Store />
                            </Route>
                            <Route path="/my-purchases">
                                <MyPurchases />
                            </Route>
                        </Switch>
                    </React.Suspense>
                </div>
            </React.Fragment>
    );
};

export default App;
