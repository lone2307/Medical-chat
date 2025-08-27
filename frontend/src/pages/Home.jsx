import './stylesheet/Home.css'
import doctor from '../img/doctor.jpg';
import programmer from '../img/programmer.jpg';
import ceo from '../img/ceo.jpg';


function Home() {
    return(
        <div>
            <div className="header">
                <h1>Welcome To MedGPT</h1>
                <h2>Where Healthcare is on another level</h2>
            </div>
            <div className='mainBody'>
                <div className="introduction">
                    <h1>Who We Are</h1>
                    <p>
                    At MedGPT, we are a team of healthcare enthusiasts, medical advisors, and technology experts united by a common mission: making reliable health information accessible to everyone. We believe that understanding your health should never feel overwhelming or out of reach. By combining medical expertise with cutting-edge artificial intelligence, we’ve built a chatbot that provides guidance, education, and support—anytime you need it. While our chatbot does not replace professional care, we are committed to empowering individuals with trustworthy information and resources that help them take more confident steps toward better health.
                    </p>
                </div>
                <h1>Our Team</h1>
                <div className="three-grid">
                    <div className="cell">
                        <h3>Doctor P</h3>
                        <img src={doctor} alt="doctor" />
                    </div>
                    <div className="cell">
                        <h3>Programmer D</h3>
                        <img src={programmer} alt="programmer" />
                    </div>
                    <div className="cell">
                        <h3>CEO E</h3>
                        <img src={ceo} alt="ceo" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home