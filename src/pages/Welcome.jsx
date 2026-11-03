import portrait from '../assets/welcome/athlete-portrait.png'
import dumbbell from '../assets/welcome/dumbbell.svg'
import arrowRight from '../assets/welcome/arrow-right.svg'
import '../styles/welcome.css'

export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <img className="welcome-bg" src={portrait} alt="" />
      <div className="welcome-shade" />

      <div className="welcome-content">
        <div className="welcome-copy">
          <div className="welcome-brand">
            <img src={dumbbell} alt="" width="24" height="24" />
            <span className="welcome-wordmark">
              FIT<span>TRACK</span>
            </span>
          </div>

          <div className="welcome-quote">
            <span className="welcome-quote-rule" />
            <p>“One more rep. One step closer.”</p>
          </div>

          <div className="welcome-text">
            <div className="welcome-eyebrow">
              <span className="welcome-eyebrow-dash" />
              <span>WELCOME TO FITTRACK</span>
            </div>
            <h1 className="welcome-headline">
              BUILT BY
              <br />
              <span>SHOWING UP.</span>
            </h1>
            <p className="welcome-description">
              Welcome! Your day one starts here.
              <br />
              Track every rep. Build your routine. Turn your effort into progress.
            </p>
          </div>

          <div className="welcome-actions">
            <button type="button" className="welcome-start" onClick={onStart}>
              <span>Get started</span>
              <img src={arrowRight} alt="" width="22" height="22" />
            </button>
            <p className="welcome-signin">
              Already a member? <button type="button" onClick={onStart}>Sign in</button>
            </p>
          </div>
        </div>

        <div className="welcome-visual">
          <img src={portrait} alt="" />
          <div className="welcome-visual-overlay" />
        </div>
      </div>
    </div>
  )
}
