import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { apiUrl } from '../../config/api';
import HobbyBadge from '../HobbyBadge';

const TransactionHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportingId, setReportingId] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(apiUrl('/api/swaps/my-swaps'), {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error('Failed to fetch transaction history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const reportSwap = async (swapId) => {
    const reason = window.prompt('Report reason (e.g., "Used item labeled Mint")');
    if (!reason) return;
    try {
      setReportingId(swapId);
      await axios.post(apiUrl('/api/disputes'), { swapId, reason }, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('Report submitted. Admins can review it in the dispute portal.');
    } catch (e) {
      alert('Failed to submit report.');
    } finally {
      setReportingId('');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading transaction history...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Your Transaction History</h2>

      {history.length === 0 ?
      <p className="text-center text-muted">
          You haven't completed any swaps yet!
        </p> :

      <div className="row">
          {history.map((swap) => {
          const isRequester = swap.requester?._id === userId;
          const tradePartner = isRequester ? swap.receiver : swap.requester;

          return (
            <div key={swap._id} className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-success">{swap.status}</span>
                      <small className="text-muted">
                        {swap.updatedAt ?
                      new Date(swap.updatedAt).toLocaleDateString() :
                      ''}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between text-center mb-3">
                      <div className="flex-fill">
                        <div className="text-muted small">You Traded</div>
                        <div className="fw-semibold">
                          {isRequester ?
                        swap.offeredItem?.title :
                        swap.requestedItem?.title}
                        </div>
                      </div>
                      <div className="mx-3 fs-3 text-muted">🔄</div>
                      <div className="flex-fill">
                        <div className="text-muted small">You Received</div>
                        <div className="fw-semibold">
                          {isRequester ?
                        swap.requestedItem?.title :
                        swap.offeredItem?.title}
                        </div>
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded mt-auto">
                      <div className="mb-2">
                        <strong>Trade Partner:</strong>{' '}
                        {tradePartner?.username || tradePartner?.name || 'Collector'}
                        {tradePartner?.hobbyNiche &&
                        <span className="ms-2 align-middle">
                            <HobbyBadge niche={tradePartner.hobbyNiche} />
                          </span>
                        }
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-2">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => reportSwap(swap._id)}
                          disabled={reportingId === swap._id}>
                          {reportingId === swap._id ? 'Reporting...' : 'Report dispute'}
                        </button>
                        <span className="small text-muted">For issues like “Used labeled Mint”.</span>
                      </div>
                      <ReviewForm
                      swapId={swap._id}
                      revieweeId={tradePartner?._id}
                      onReviewSubmitted={() => window.location.reload()} />
                    
                    </div>
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

};

export default TransactionHistory;
