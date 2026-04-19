import React, { useEffect } from 'react';

const Stats = ({ userProfile }) => {
  useEffect(() => {
    if (window.PureCounter) {
      new window.PureCounter();
    }
  }, []);

  return (
    <section id="stats" className="stats section light-background">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="1250" data-purecounter-duration="1" className="purecounter"></span>
              <p>Active Collectors</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="3420" data-purecounter-duration="1" className="purecounter"></span>
              <p>Successful Swaps</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="8500" data-purecounter-duration="1" className="purecounter"></span>
              <p>Items Listed</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="45" data-purecounter-duration="1" className="purecounter"></span>
              <p>Hobby Niches</p>
            </div>
          </div>

        </div>

        <div className="row gy-4 mt-4">
          <div className="col-lg-8 mx-auto">
            <div className="stats-item w-100 h-100 text-center shadow-sm rounded-4 p-4" style={{ background: '#0f172a', color: '#e5e7eb' }}>
              <h3 className="mb-3" style={{ color: '#f9fafb' }}>Reputation System (Karma Points)</h3>
              {userProfile ?
              <>
                  <p className="mb-2">
                    Your Karma measures how trusted you are across the SwapSphere community.
                    Earn points for great trades and fair reviews.
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-4 mt-3 flex-wrap">
                    <div className="reputation-chip">
                      <span>⭐ Rating</span>
                      <span>{userProfile.rating > 0 ? userProfile.rating.toFixed(1) : 'Unrated'}/5</span>
                    </div>
                    <div className="reputation-chip">
                      <span>🔥 Karma</span>
                      <span>{userProfile.karmaPoints} pts</span>
                    </div>
                    <div className="reputation-chip">
                      <span>✅ Verified Swaps</span>
                      <span>{userProfile.reviewCount}</span>
                    </div>
                  </div>
                  <p className="small mt-3 mb-0 text-muted">
                    High karma and ratings make your swap requests more attractive to other collectors.
                  </p>
                </> :

              <>
                  <p className="mb-2">
                    Trade fairly, collect positive reviews, and grow your Karma score to unlock trusted status in the community.
                  </p>
                  <p className="small mb-0 text-muted">
                    Log in, complete swaps, and leave honest reviews to start building your reputation.
                  </p>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default Stats;
