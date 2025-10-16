import React, { useState } from "react";
import "./css/circleMenu.css";
import { Ambulance, Rabbit, ShieldPlus, Cpu, Columns3Cog } from 'lucide-react'

const CircleWheel = () => {
  const items = [
    { id: 0, icon: <Ambulance />, color: "#ff7675", heading: "Professionalism", text: "Professionalism is the foundation of everything we do. It means showing respect, integrity, and reliability in every interaction, delivering high-quality results, and holding ourselves to the highest standards. By combining expertise with a commitment to excellence, we create an environment built on trust, accountability, and consistency." },
    { id: 1, icon: <Rabbit />, color: "#fdcb6e", heading: "Quick Response", text: "Our medical chatbot is designed with Quick Response technology, providing instant answers to common health questions and guiding patients to the right resources in seconds. With real-time support, users can quickly find the information they need—whether it’s symptom guidance, appointment scheduling, or general health advice—making healthcare more accessible and efficient." },
    { id: 2, icon: <ShieldPlus />, color: "#6c5ce7", heading: "Information Security", text: "Your privacy and security are our top priority. Our medical chatbot is built with advanced information security measures to protect your personal and health data. All conversations are encrypted, and your information is kept confidential in compliance with healthcare privacy standards. You can feel confident knowing your sensitive details are safe with us." },
    { id: 3, icon: <Cpu />, color: "#ffeaa7", heading: "Efficient", text: "Our medical chatbot is designed to provide fast and efficient support, helping users find the information they need in seconds. Whether it’s answering common health questions, guiding you to the right resources, or assisting with appointments, it ensures a smooth experience without long waits—making healthcare more accessible anytime, anywhere." },
    { id: 4, icon: <Columns3Cog />, color: "#55efc4", heading: "Customizable", text: "Our medical chatbot is fully customizable, allowing clinics, hospitals, and healthcare providers to tailor conversations, features, and design to fit their unique services. From adjusting medical FAQs to integrating appointment booking and patient support, the chatbot adapts to your practice—ensuring patients get accurate, relevant, and personalized assistance every time." },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const radius = 120;
  const angleStep = 360 / items.length;

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="container">
      <div
        className="circle-wheel"
        style={{
          transform: `rotate(-${activeIndex * angleStep}deg)`,
        }}
      >
        <div className="orbit" />
        {items.map((item, i) => {
          const angle = i * angleStep;
          return (
            <div
              key={item.id}
              className="circle-item"
              style={{
                backgroundColor: item.color,
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg) rotate(${activeIndex * angleStep}deg)`,
              }}
              onClick={() => handleClick(i)}
            >
              {item.icon}
            </div>
          );
        })}
      </div>

      <div className="text-box">
        <h2>{items[activeIndex].heading}</h2>
        <p>{items[activeIndex].text}</p>
      </div>
    </div>
  );
};

export default CircleWheel;
