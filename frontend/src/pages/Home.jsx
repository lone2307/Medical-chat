import './stylesheet/Home.css'
import DotBackground from '../components/DotBackground.jsx';
import ThreePart from '../components/threePart.jsx';
import CircleWheel from '../components/circleMenu.jsx'


function Home() {
    return(
        <div>
            <div className="header">    
                <div className='dot-background'>
                    <DotBackground />
                </div>
                <div className=''>
                    <h1>Welcome To MedGPT</h1>
                    <h2>Where Healthcare is on another level</h2>
                </div>
            </div>
            <div className='mainBody'>
                <div className="introduction">
                    <h1>Who We Are</h1>
                    <p>
                    At MedGPT, we are a team of healthcare enthusiasts, medical advisors, and technology experts united by a common mission: making reliable health information accessible to everyone. We believe that understanding your health should never feel overwhelming or out of reach. By combining medical expertise with cutting-edge artificial intelligence, we’ve built a chatbot that provides guidance, education, and support—anytime you need it. While our chatbot does not replace professional care, we are committed to empowering individuals with trustworthy information and resources that help them take more confident steps toward better health.
                    </p>
                </div>
                <h1 className='teamHeading'>Our Target</h1>
                <CircleWheel />
                <h1 className='teamHeading'>Our Team</h1>
                <ThreePart />
            </div>
        </div>
    )
}

export default Home