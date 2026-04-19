import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { API_BASE_URL, apiUrl } from '../config/api';
import HobbyBadge from './HobbyBadge';

const Header = ({ isAuthenticated, userProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [darkText, setDarkText] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(apiUrl('/api/auth/me'), {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (data && data._id) setCurrentUserId(data._id);
      } catch (err) {
      }
    };
    fetchUser();
  }, [isAuthenticated]);




  useEffect(() => {
    if (!isAuthenticated) return;
    const newSocket = io.connect(API_BASE_URL);

    const onNotification = (data) => {
      const notificationId = Date.now();
      const notificationWithId = { ...data, id: notificationId };
      setNotifications((prev) => [notificationWithId, ...prev]);
      setUnreadCount((c) => c + 1);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      }, 6000);
    };

    newSocket.on('new_notification', onNotification);
    if (currentUserId) {
      newSocket.emit('register_user', { userId: currentUserId });
    }
    return () => {
      newSocket.off('new_notification', onNotification);
      newSocket.disconnect();
    };
  }, [isAuthenticated, currentUserId]);


  useEffect(() => {
    if (location.pathname.startsWith('/negotiate')) {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    const getBackgroundColor = (el) => {
      while (el && el !== document.documentElement) {
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && !bg.includes('rgba(0, 0, 0, 0)')) {
          return bg;
        }
        el = el.parentElement;
      }
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      return bodyBg || 'rgb(255, 255, 255)';
    };

    const checkBg = () => {
      const x = window.innerWidth / 2;
      const y = headerEl.offsetHeight + 5;
      let elem = document.elementFromPoint(x, y);
      if (elem && elem.id === 'header') {
        elem = elem.nextElementSibling || elem;
      }
      const bg = getBackgroundColor(elem);
      const rgb = bg.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        setDarkText(lum > 200);
      } else {
        setDarkText(false);
      }
    };
    window.addEventListener('scroll', checkBg);
    window.addEventListener('resize', checkBg);
    checkBg();
    return () => {
      window.removeEventListener('scroll', checkBg);
      window.removeEventListener('resize', checkBg);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');

    window.location.href = "/";
  };

  const handleNotificationClick = (swapId) => {
    if (swapId) {
      navigate(`/negotiate/${swapId}`);
    }
  };

  return (
    <header id="header" className={`header d-flex align-items-center fixed-top ${darkText ? 'dark-text' : ''}`}>
      {notifications.length > 0 &&
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '350px'
      }}>
          {notifications.map((notif) =>
        <div
          key={notif.id}
          className="alert alert-info alert-dismissible fade show mb-2"
          style={{ cursor: notif.swapId ? 'pointer' : 'default' }}
          onClick={() => handleNotificationClick(notif.swapId)}>
          
              <strong>
                {notif.type === 'swap_request' ? '🔁 Swap request' :
                notif.type === 'swap_accepted' ? '✅ Swap accepted' :
                notif.type === 'dispute_created' ? '⚠️ New dispute' :
                notif.type === 'dispute_updated' ? '🛠️ Dispute updated' :
                '🔔 Notification'}
                :
              </strong>{' '}
              {notif.message}
              <button
            onClick={(e) => {
              e.stopPropagation();
              setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
            }}
            className="btn-close">
          </button>
            </div>
        )}
        </div>
      }

      <nav className="navbar navbar-expand-xl w-100">
        <div className="container-fluid container-xl">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <span className="fw-bold">SwapSphere</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="ssNavbar"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${mobileOpen ? 'show' : ''}`} id="ssNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-xl-0 flex-wrap">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/how-it-works">How it works</Link></li>

              {isAuthenticated &&
              <>
                  <li className="nav-item"><Link className="nav-link" to="/marketplace">Marketplace</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/create-listing">List an Item</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/wishlist">Wishlist</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/my-requests">Incoming Requests</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/transaction-history">History & Reviews</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/export">Export</Link></li>
                  <li className="nav-item" style={{ position: 'relative' }}>
                    <Link className="nav-link" to="/negotiate/active">
                      My Negotiations
                      {unreadCount > 0 &&
                      <span className="badge bg-danger ms-2 align-text-top">{unreadCount}</span>
                      }
                    </Link>
                  </li>
                  {userProfile?.isAdmin &&
                  <li className="nav-item"><Link className="nav-link" to="/admin/disputes">Admin Disputes</Link></li>
                  }
                </>
              }

              <li className="nav-item"><a className="nav-link" href="/#about">About</a></li>
              <li className="nav-item"><a className="nav-link" href="/#services">Services</a></li>
            </ul>

            {isAuthenticated && userProfile &&
            <div className="d-none d-xl-flex align-items-center gap-2 me-3">
                <span className="small text-muted">Signed in as</span>
                <span className="fw-semibold">{userProfile.username}</span>
                <HobbyBadge niche={userProfile.hobbyNiche} />
              </div>
            }

            {!isAuthenticated ?
            <Link className="btn btn-primary" to="/login">
                Start Swapping
              </Link> :
            <button className="btn btn-outline-secondary" onClick={handleLogout}>
                Logout
              </button>
            }
          </div>
        </div>
      </nav>
    </header>);

};

export default Header;
