import React from "react";
import "./css/threePart.css";

import doctor from '../img/doctor.jpg';
import programmer from '../img/programmer.jpg';
import ceo from '../img/ceo.jpg';


export default function ThreePart() {
  return (
    <div className="three-part">
      <section className="part">
        <img
          src={doctor}
          alt="Doctor Wo"
          className="part-bg"
        />
        <div className="part-content">
          <h2>Doctor Wo</h2>
          <p>Dr. Wo is a dedicated physician committed to delivering high-quality, patient-centered care. With a strong focus on listening and understanding each individual’s needs, Dr. Wo combines medical expertise with compassion to support patients in achieving better health and long-term wellness.</p>
        </div>
      </section>

      <section className="part">
        <img
          src={programmer}
          alt="Programmer We"
          className="part-bg"
        />
        <div className="part-content">
          <h2>Programmer We</h2>
          <p>Programmer We is a skilled developer with a passion for creating efficient, reliable, and innovative software solutions. With a strong foundation in coding and problem-solving, Programmer We is dedicated to building technology that makes a real impact and delivers value to users.</p>
        </div>
      </section>

      <section className="part">
        <img
          src={ceo}
          alt="CEO He"
          className="part-bg"
        />
        <div className="part-content">
          <h2>CEO He</h2>
          <p>CEO He is a visionary leader recognized for driving innovation and guiding organizations toward sustainable growth. With a strong commitment to excellence, CEO He combines strategic insight with a people-first approach, fostering teamwork, creativity, and long-term success.</p>
        </div>
      </section>
    </div>
  );
}
