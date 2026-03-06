import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Logo } from '../assets/Images/image';
import SvgIcons from '../assets/Svg/SvgIcons';
import { useEvmWallet } from '../hooks/useEvmWallet';
import { useRegisterMutation } from '../features/auth/hooks/useRegisterMutation';
import { useAppSelector } from '../store/redux';

const getRegisterSignatureMessage = (walletAddress: string) =>
  `Register on The Rich Crowd\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const Register = () => {
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
  const { mutateAsync: registerUser, isPending: isRegistering, error: registerError } =
    useRegisterMutation();

  const [sponsorId, setSponsorId] = useState('');
  const [name, setName] = useState('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [navigate, token]);

  useEffect(() => {
    if (!walletError) return;
    toast.error(walletError);
  }, [walletError]);

  useEffect(() => {
    if (!registerError) return;
    const message = registerError instanceof Error ? registerError.message : 'Registration failed.';
    toast.error(message);
  }, [registerError]);

  useEffect(() => {
    if (address) return;
    setSignature('');
  }, [address]);

  const handleConnectWallet = async () => {
    const connectedAddress = await connect();
    if (connectedAddress) toast.success('Wallet connected successfully.');
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!address) return;

    if (!signature) {
      const message = getRegisterSignatureMessage(address);
      const signed = await signMessage(message);
      if (!signed) return;
      setSignature(signed);
      toast.success('Signature completed. Processing registration...');
    }

    await registerUser({
      sponsorId: sponsorId.trim(),
      name: name.trim(),
      walletAddress: address.toLowerCase(),
    });

    toast.success('Registration successful.');
    navigate('/dashboard');
  };

  const walletLabel = useMemo(() => {
    if (!address) return '0x...';
    return shortenAddress(address);
  }, [address]);

  const isSubmitDisabled =
    !address ||
    !sponsorId.trim() ||
    !name.trim() ||
    isConnecting ||
    isSigning ||
    isRegistering ||
    !hasProvider;

  return (
    <>
      <div className="register-outer ">
        <div className="login-outer">
          <div className="background-wrapper">
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
            <div className="background-grid" />
          </div>
          <div className="auth-container">
            <div className="logo-container">
              <Link to="/">
                <img
                  src={Logo}
                  alt="The Rich Crowd Logo"
                />
              </Link>
            </div>
            <h2>Create Account</h2>
            <p className="sub-title">Join the Future of Decentralized Wealth</p>
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
                <div className="wallet-detail">
                  <div className="status-dot" />
                  <span id="walletAddress">{walletLabel}</span>
                </div>
              </div>
            </div>
            <form action="#" method="post" id="registrationForm" onSubmit={handleRegister}>
              <input
                type="hidden"
                name="wallet_address"
                id="walletAddressInput"
                value={address ?? ''}
                required
                readOnly
              />
              <input type="hidden" name="signature" id="walletSignature" value={signature} readOnly />
              <div className="form-group">
                <input
                  type="text"
                  name="sponsor_id"
                  id="sponsor_id"
                  placeholder="Sponsor ID"
                  value={sponsorId}
                  onChange={(event) => setSponsorId(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                id="registerButton"
                className={address ? 'enabled' : ''}
                disabled={isSubmitDisabled}
              >
                {isSigning ? 'Awaiting Signature...' : isRegistering ? 'Registering...' : 'Register Account'}
              </button>
            </form>
            <div className="login-link">
              Already a member?{' '}
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
