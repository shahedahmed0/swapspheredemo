import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { apiUrl } from '../../config/api';

const TransactionHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
