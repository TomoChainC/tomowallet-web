// Modules
import React, { PureComponent, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardImg,
} from 'reactstrap';
// Custom Components
// -- TO-DO: Update style for Navigation Bar component into following styled component:
import NavBarStyler from './style';
import {
  LinkHeader,
  DropdownToggleHeader,
} from '../../styles';
// Utilities & Constants
import { withWeb3 } from '../Web3';
import { withIntl } from '../IntlProvider';
import { ROUTE, RPC_SERVER, LIST, MSG } from '../../constants';
// -- TO-DO: Import TomoWallet logo's source
// IMG
import logo_tomochain from '../../assets/images/logo-tomochain.png';

// ===== MAIN COMPONENT =====
class NavigationBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isExpandOptions: false,
      networkTitle: Object.keys(RPC_SERVER)[0],
    };

    this.handleRenderPublicBar = this.handleRenderPublicBar.bind(this);
    this.handleRenderPrivateBar = this.handleRenderPrivateBar.bind(this);
    this.handleRedirectToHomepage = this.handleRedirectToHomepage.bind(this);
    this.handleToggleOptions = this.handleToggleOptions.bind(this);
    this.handleChangeNetwork = this.handleChangeNetwork.bind(this);
  }

  handleRenderPublicBar() {
    const {
      language,
      changeLocale,
      intl: { formatMessage },
    } = this.props;

    return (
      <Fragment>
        <Nav className='ml-auto' navbar>
          <NavItem>
            <LinkHeader>{formatMessage(MSG.HEADER_NAVBAR_OPTION_ABOUT)}</LinkHeader>
          </NavItem>
          <NavItem>
            <LinkHeader>{formatMessage(MSG.HEADER_NAVBAR_OPTION_FAQS)}</LinkHeader>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggleHeader nav caret>
              {(LIST.LANGUAGES.find(opt => opt.value === language) || {}).label}
            </DropdownToggleHeader>
            <DropdownMenu right>
              {LIST.LANGUAGES.map((opt, optIdx) => (
                <DropdownItem
                  key={`language_${optIdx + 1}`}
                  onClick={() => changeLocale(opt.value)}
                >
                  {opt.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Fragment>
    );
  }

  handleRenderPrivateBar() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { networkTitle } = this.state;

    return (
      <Fragment>
        <Nav className='ml-auto' navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {networkTitle}
            </DropdownToggle>
            <DropdownMenu right>
              {Object.keys(RPC_SERVER).map((title, titleIdx) => (
                <DropdownItem
                  key={`network_${titleIdx + 1}`}
                  onClick={() => this.handleChangeNetwork(title)}
                >
                  {title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {formatMessage(MSG.HEADER_NAVBAR_OPTION_MY_WALLET)}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                {formatMessage(
                  MSG.HEADER_NAVBAR_OPTION_MY_WALLET_OPTION_SHOW_PROFILE,
                )}
              </DropdownItem>
              <DropdownItem>
                {formatMessage(
                  MSG.HEADER_NAVBAR_OPTION_MY_WALLET_OPTION_SETTINGS,
                )}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => this.handleRedirectToHomepage()}>
                {formatMessage(
                  MSG.HEADER_NAVBAR_OPTION_MY_WALLET_OPTION_LOG_OUT,
                )}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Fragment>
    );
  }

  handleRedirectToHomepage() {
    const { history } = this.props;
    history.push(ROUTE.LOGIN);
  }

  handleToggleOptions() {
    this.setState(({ isExpandOptions }) => ({
      isExpandOptions: !isExpandOptions,
    }));
  }

  handleChangeNetwork(title) {
    const { switchRPCServer } = this.props;
    this.setState({
      networkTitle: title,
    });
    switchRPCServer(title);
  }

  render() {
    const {
      isLoggedIn,
      intl: { formatMessage },
    } = this.props;
    const { isExpandOptions } = this.state;

    return (
      <NavBarStyler light expand='lg'>
        <NavbarBrand onClick={this.handleRedirectToHomepage}>
          {/* -- TO-DO: Add TomoChain logo's source */}
          <CardImg src={logo_tomochain} alt={formatMessage(MSG.HEADER_NAVBAR_LOGO_ALT)} />
        </NavbarBrand>
        <NavbarToggler onClick={this.handleToggleOptions} />
        <Collapse isOpen={isExpandOptions} navbar>
          {isLoggedIn
            ? this.handleRenderPrivateBar()
            : this.handleRenderPublicBar()}
        </Collapse>
      </NavBarStyler>
    );
  }
}
// ==========================

// ===== PROP TYPES =====
NavigationBar.propTypes = {
  /** React Intl's instance object */
  intl: PropTypes.object,
  /** Condition flag to check authentication state for proper option view */
  isLoggedIn: PropTypes.bool,
  /** Current chosen locale */
  language: PropTypes.string,
  /** Action to change locale */
  changeLocale: PropTypes.func,
  /** React Router's API object */
  history: PropTypes.object,
  /** Action to change current RPC Server */
  switchRPCServer: PropTypes.func,
};
// ======================

export default compose(
  withRouter,
  withWeb3,
  withIntl,
)(NavigationBar);