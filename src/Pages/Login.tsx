import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Logo } from '../assets/Images/image';
import SvgIcons from '../assets/Svg/SvgIcons';
import { useEvmWallet } from '../hooks/useEvmWallet';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useAppSelector } from '../store/redux';

const getSignatureMessage = (walletAddress: string) =>
  `Sign in to The Rich Crowd\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const Login = () => {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const {
    address,
    hasProvider,
    isConnecting,
    isSigning,
    error: walletError,
    connect,
    signMessage,
  } = useEvmWallet();
  const { authenticateWallet, isAuthenticating, error: authError } = useAuth();

  const [signature, setSignature] = useState('');

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [navigate, token]);

  useEffect(() => {
    if (!walletError) return;
    toast.error(walletError);
  }, [walletError]);

  useEffect(() => {
    if (!authError) return;
    toast.error(authError);
  }, [authError]);

  useEffect(() => {
    if (address) return;
    setSignature('');
  }, [address]);

  const handleConnectWallet = async () => {
    const connectedAddress = await connect();
    if (connectedAddress) toast.success('Wallet connected successfully.');
  };

  const handleAuthenticate = async (event: FormEvent) => {
    event.preventDefault();
    if (!address) return;

    if (!signature) {
      const message = getSignatureMessage(address);
      const signed = await signMessage(message);
      if (!signed) return;

      setSignature(signed);
      toast.success('Signature completed. Click authenticate to continue.');
      return;
    }

    try {
      await authenticateWallet({
        walletAddress: address
      });
      toast.success('Login successful.');
      navigate('/dashboard');
    } catch (_error) {
      // Error toast is handled from hook state.
    }
  };

  const walletLabel = useMemo(() => {
    if (!address) return '0x...';
    return shortenAddress(address);
  }, [address]);

  const buttonLabel = useMemo(() => {
    if (!address) return 'Connect wallet first';
    if (!signature) return isSigning ? 'Awaiting Signature...' : 'Sign Wallet Message';
    return isAuthenticating ? 'Authenticating...' : 'Authenticate Access';
  }, [address, signature, isSigning, isAuthenticating]);

  const isSubmitDisabled =
    !address || isConnecting || isSigning || isAuthenticating || !hasProvider;

  return (
    <>
      <div className="login-outer">
        <div className="background-wrapper">
          <div className="bg-orb orb-1" />
          <div className="bg-orb orb-2" />
          <div className="background-grid" />
        </div>
        <div className="auth-container">
          <div className="logo-container">
            <Link to="/">
              <img src={Logo} alt="The Rich Crowd Logo" />
            </Link>
          </div>
          <h2>Member Access</h2>
          <p className="sub-title">Secure Decentralized Gateway</p>
          <div className="wallet-connect">
            <button
              type="button"
              id="connectWallet"
              onClick={handleConnectWallet}
              disabled={isConnecting || !hasProvider}
            >
              {SvgIcons.waletIcon}
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
            <div className={`wallet-info ${address ? 'connected' : ''}`} id="walletInfo">
              <div className="status-dot" />
              <span id="walletAddress">{walletLabel}</span>
            </div>
          </div>
          <form action="#" method="post" id="loginForm" onSubmit={handleAuthenticate}>
            <input
              type="hidden"
              name="wallet_address"
              id="walletAddressInput"
              value={address ?? ''}
              readOnly
            />
            <input type="hidden" name="signature" id="walletSignature" value={signature} readOnly />
            <button
              type="submit"
              id="loginButton"
              className={address ? 'enabled' : ''}
              disabled={isSubmitDisabled}
            >
              {buttonLabel}
            </button>
          </form>
          <div className="register-link">
            Not a member yet?{' '}
            <Link to="/register">Join the Elite</Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
