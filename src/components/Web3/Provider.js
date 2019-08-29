/**
 *
 * TomoWallet - Web3 Provider
 *
 */
// ===== IMPORTS =====
// Modules
import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { createStructuredSelector } from 'reselect';
import Web3 from 'web3';
import _get from 'lodash.get';
import _isEmpty from 'lodash.isempty';
// Custom Components
import { FailureComponent, LoadingComponent } from './';
// Utilities & Constants
import {
  getWeb3Info,
  generateWeb3,
  getNetwork,
  setNetwork,
  getWalletInfo,
} from '../../utils';
import { RPC_SERVER, ENUM } from '../../constants';
import { storeWallet, releaseWallet } from '../../containers/Global/actions';
import { selectWallet } from '../../containers/Global/selectors';
// ===================

// ===== Web3 Context =====
const Web3Context = createContext({
  web3: {},
  web3Status: '',
  switchRPCServer: () => {},
});
// ========================

// ===== Web3 Provider Component =====
class Web3Provider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: {},
      status: ENUM.WEB3_STATUSES.LOADING,
      error: null,
      rpcServer: {},
    };

    this.handleSetMetaMaskProvider = this.handleSetMetaMaskProvider.bind(this);
    this.handleSetWeb3 = this.handleSetWeb3.bind(this);
    this.handleTryProvider = this.handleTryProvider.bind(this);
    this.handleUpdateRpcServer = this.handleUpdateRpcServer.bind(this);
  }

  componentDidMount() {
    const { onReleaseWallet } = this.props;
    if (Web3.givenProvider) {
      console.warn('Mounting MetaMask...', Web3.givenProvider);
      this.handleSetMetaMaskProvider();
      window.ethereum.enable();
      window.ethereum.on('accountsChanged', this.handleSetMetaMaskProvider);
      this.checkMetaMaskLogin = setInterval(() => {
        Web3.givenProvider._metamask.isUnlocked().then(bool => {
          const { wallet } = this.props;
          if (!_isEmpty(wallet) && !bool) {
            onReleaseWallet();
          }
        });
      }, 1000);
    } else {
      const web3Info = getWeb3Info();
      if (_get(web3Info, 'recoveryPhrase')) {
        const { recoveryPhrase } = web3Info;
        const rpcServer = RPC_SERVER[getNetwork()];
        const newWeb3 = generateWeb3(recoveryPhrase, rpcServer);

        this.handleSetWeb3(newWeb3);
        this.setState({
          rpcServer,
        });
      } else {
        const networkKey = getNetwork();
        if (networkKey) {
          this.handleUpdateRpcServer(networkKey);
        } else {
          this.handleUpdateRpcServer(Object.keys(RPC_SERVER)[0]);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.checkMetaMaskLogin) {
      this.checkMetaMaskLogin.clearInterval();
    }
    window.ethereum.removeListener(
      'accountsChanged',
      this.handleSetMetaMaskProvider,
    );
  }

  handleSetMetaMaskProvider() {
    const { onStoreWallet } = this.props;
    const newWeb3 = new Web3(Web3.givenProvider);
    console.warn('Changing account...', Web3.givenProvider);

    this.handleSetWeb3(newWeb3);
    getWalletInfo(newWeb3).then(walletInfo => {
      if (walletInfo) {
        onStoreWallet(walletInfo);
      }
    });
  }

  handleSetWeb3(web3) {
    this.setState({ web3: new Web3(web3) }, () =>
      this.state.web3.eth.net
        .isListening()
        .then(() =>
          this.setState({
            status: ENUM.WEB3_STATUSES.INITIALIZED,
          }),
        )
        .catch(() => this.setState({ status: ENUM.WEB3_STATUSES.FAILED })),
    );
  }

  handleTryProvider(web3, next = null) {
    if (web3) {
      this.handleSetWeb3(web3);
    } else if (next) {
      next();
    } else {
      this.setState({
        status: ENUM.WEB3_STATUSES.FAILED,
        error: 'Unexpected Web3 error!',
      });
    }
  }

  handleUpdateRpcServer(newKey) {
    this.setState(
      {
        rpcServer: _get(RPC_SERVER, newKey, {}),
      },
      () => {
        setNetwork(newKey);
        const newWeb3 = new Web3(this.state.rpcServer.host, null, {});
        this.handleSetWeb3(newWeb3);
      },
    );
  }

  render() {
    const { children } = this.props;
    const { web3, status, rpcServer } = this.state;

    return (
      <Web3Context.Provider
        value={{
          web3,
          web3Status: status,
          rpcServer,
          switchRPCServer: this.handleUpdateRpcServer,
          updateWeb3: this.handleSetWeb3,
        }}
      >
        {children}
      </Web3Context.Provider>
    );
  }
}

// ===== INJECTIONS =====
const mapStateToProps = () =>
  createStructuredSelector({
    wallet: selectWallet,
  });
const mapDispatchToProps = dispatch => ({
  onReleaseWallet: () => dispatch(releaseWallet()),
  onStoreWallet: wallet => dispatch(storeWallet(wallet)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
// ======================

export default withConnect(Web3Provider);
// ===================================

// ===== Web3 Injection =====
export const withWeb3 = WrappedComponent => {
  class Web3Consumer extends Component {
    render() {
      return (
        <Web3Context.Consumer>
          {({ web3, rpcServer, switchRPCServer, updateWeb3 }) => (
            <WrappedComponent
              {...this.props}
              web3={web3}
              rpcServer={rpcServer}
              switchRPCServer={switchRPCServer}
              updateWeb3={updateWeb3}
            />
          )}
        </Web3Context.Consumer>
      );
    }
  }

  if (WrappedComponent.defaultProps) {
    Web3Consumer.defaultProps = { ...WrappedComponent.defaultProps };
  }

  return hoistNonReactStatics(Web3Consumer, WrappedComponent);
};

export const withWeb3AndState = WrappedComponent => {
  class Web3AndStateConsumer extends Component {
    render() {
      return (
        <Web3Context.Consumer>
          {({ web3, web3Status, rpcServer, switchRPCServer, updateWeb3 }) =>
            (web3Status === ENUM.WEB3_STATUSES.LOADING && (
              <LoadingComponent />
            )) ||
            (web3Status === ENUM.WEB3_STATUSES.FAILED && (
              <FailureComponent />
            )) ||
            (web3Status === ENUM.WEB3_STATUSES.INITIALIZED && (
              <WrappedComponent
                {...this.props}
                web3={web3}
                web3Status={web3Status}
                rpcServer={rpcServer}
                switchRPCServer={switchRPCServer}
                updateWeb3={updateWeb3}
              />
            ))
          }
        </Web3Context.Consumer>
      );
    }
  }

  if (WrappedComponent.defaultProps) {
    Web3AndStateConsumer.defaultProps = { ...WrappedComponent.defaultProps };
  }

  return hoistNonReactStatics(Web3AndStateConsumer, WrappedComponent);
};
// ==========================
