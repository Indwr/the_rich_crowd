import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Logo } from '../assets/Images/image';
import SvgIcons from '../assets/Svg/SvgIcons';
import { useEvmWallet } from '../hooks/useEvmWallet';
import { useRegisterMutation } from '../features/auth/hooks/useRegisterMutation';
import { checkSponsorName, checkTrainerId } from '../features/auth/services/authAPI';
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
  const [trainerId, setTrainerId] = useState('');
  const [name, setName] = useState('');
  const [signature, setSignature] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorMessage, setSponsorMessage] = useState('');
  const [isSponsorValid, setIsSponsorValid] = useState(false);
  const [isCheckingSponsor, setIsCheckingSponsor] = useState(false);
  const [trainerMessage, setTrainerMessage] = useState('');
  const [isTrainerValid, setIsTrainerValid] = useState(false);
  const [isCheckingTrainer, setIsCheckingTrainer] = useState(false);

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

  useEffect(() => {
    const trimmedSponsorId = sponsorId.trim();

    if (!trimmedSponsorId) {
      setSponsorName('');
      setSponsorMessage('');
      setIsSponsorValid(false);
      setIsCheckingSponsor(false);
      return;
    }

    setSponsorName('');
    setSponsorMessage('');
    setIsSponsorValid(false);

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsCheckingSponsor(true);
        const response = await checkSponsorName({ sponser_id: trimmedSponsorId });

        if (response.statusCode === 200) {
          setSponsorName(response.data?.name ?? '');
          setSponsorMessage(response.message ?? 'Sponsor Name is valid');
          setIsSponsorValid(true);
          return;
        }

        setSponsorName('');
        setSponsorMessage(response.message ?? 'Invalid sponsor ID');
        setIsSponsorValid(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to verify sponsor ID.';
        setSponsorName('');
        setSponsorMessage(message);
        setIsSponsorValid(false);
      } finally {
        setIsCheckingSponsor(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      setIsCheckingSponsor(false);
    };
  }, [sponsorId]);

  useEffect(() => {
    const trimmedTrainerId = trainerId.trim();
    const trimmedSponsorId = sponsorId.trim();

    if (!trimmedTrainerId) {
      setTrainerMessage('');
      setIsTrainerValid(false);
      setIsCheckingTrainer(false);
      return;
    }

    if (!trimmedSponsorId) {
      setTrainerMessage('Please enter Sponsor ID first.');
      setIsTrainerValid(false);
      setIsCheckingTrainer(false);
      return;
    }

    setTrainerMessage('');
    setIsTrainerValid(false);

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsCheckingTrainer(true);
        const response = await checkTrainerId({
          trainer_id: trimmedTrainerId,
          sponser_id: trimmedSponsorId,
        });

        if (response.statusCode === 200 && response.data?.status === true) {
          setTrainerMessage('Trainer ID is valid');
          setIsTrainerValid(true);
          return;
        }

        setTrainerMessage(response.message || 'Trainer ID is invalid');
        setIsTrainerValid(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to verify trainer ID.';
        setTrainerMessage(message);
        setIsTrainerValid(false);
      } finally {
        setIsCheckingTrainer(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      setIsCheckingTrainer(false);
    };
  }, [trainerId, sponsorId]);

  const handleConnectWallet = async () => {
    const connectedAddress = await connect();
    if (connectedAddress) toast.success('Wallet connected successfully.');
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!address) return;
    if (!isSponsorValid) {
      toast.error(sponsorMessage || 'Please enter a valid sponsor ID.');
      return;
    }
    if (!isTrainerValid) {
      toast.error(trainerMessage || 'Please enter a valid trainer ID.');
      return;
    }

    if (!signature) {
      const message = getRegisterSignatureMessage(address);
      const signed = await signMessage(message);
      if (!signed) return;
      setSignature(signed);
      toast.success('Signature completed. Processing registration...');
    }

    await registerUser({
      sponsorId: sponsorId.trim(),
      trainerId: trainerId.trim(),
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
    !isSponsorValid ||
    !trainerId.trim() ||
    !isTrainerValid ||
    !name.trim() ||
    isConnecting ||
    isSigning ||
    isRegistering ||
    isCheckingSponsor ||
    isCheckingTrainer ||
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
                {isCheckingSponsor && sponsorId.trim() ? (
                  <small style={{ color: '#9ca3af' }}>Checking sponsor...</small>
                ) : null}
                {!isCheckingSponsor && sponsorMessage ? (
                  <small style={{ color: isSponsorValid ? '#10b981' : '#ef4444' }}>{sponsorMessage}</small>
                ) : null}
                {!isCheckingSponsor && sponsorName ? (
                  <small style={{ display: 'block', color: '#e5e7eb' }}>Sponsor Name: {sponsorName}</small>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="trainer_id"
                  id="trainer_id"
                  placeholder="Trainer ID"
                  value={trainerId}
                  onChange={(event) => setTrainerId(event.target.value)}
                  required
                />
                {isCheckingTrainer && trainerId.trim() ? (
                  <small style={{ color: '#9ca3af' }}>Checking trainer...</small>
                ) : null}
                {!isCheckingTrainer && trainerMessage ? (
                  <small style={{ color: isTrainerValid ? '#10b981' : '#ef4444' }}>{trainerMessage}</small>
                ) : null}
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
