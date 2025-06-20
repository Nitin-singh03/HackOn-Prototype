import React, { useState } from "react";
import "../Css/Educationsection.css";

const topics = [
  {
    title: "What is EcoScore?",
    content: (
      <>
        <p>
          <strong>EcoScore</strong> is a sustainability rating (0–100) quantifying a product's environmental impact.
        </p>
        <pre>
EcoScore = (ComponentScore × 100) + min(CertificationBonus, 10)
        </pre>
        <h4>ComponentScore Breakdown</h4>
        <ul>
          <li>Material Impact (30%)</li>
          <li>Manufacturing Emissions (25%)</li>
          <li>Transportation Emissions (20%)</li>
          <li>Packaging Sustainability (15%)</li>
          <li>Sustainability Bonus (10%)</li>
        </ul>
        <h4>Certification Bonuses (cap 10 pts)</h4>
        <table>
          <thead>
            <tr><th>Certification</th><th>Pts</th></tr>
          </thead>
          <tbody>
            <tr><td>ISO 14001</td><td>+5</td></tr>
            <tr><td>Energy Star</td><td>+3</td></tr>
            <tr><td>EU Ecolabel</td><td>+4</td></tr>
            <tr><td>FSC</td><td>+3</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "Earning Green & Tree Points",
    content: (
      <>
        <p>Earn points per ₹100 spent based on EcoScore grade:</p>
        <table>
          <thead>
            <tr><th>Grade</th><th>Green Pts</th><th>Tree Pts</th></tr>
          </thead>
          <tbody>
            <tr><td>A+ (90–100)</td><td>15</td><td>15</td></tr>
            <tr><td>A  (75–89)</td><td>12</td><td>12</td></tr>
            <tr><td>B  (60–74)</td><td>8</td><td>8</td></tr>
            <tr><td>C  (40–59)</td><td>4</td><td>4</td></tr>
            <tr><td>D  (40)</td><td>0</td><td>0</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "Levels & Badges",
    content: (
      <>
        <p>Advance by collecting Tree Points:</p>
        <table>
          <thead>
            <tr><th>Level</th><th>TP Range</th><th>Trees Planted</th><th>Badge</th><th>Perks</th></tr>
          </thead>
          <tbody>
            <tr><td>Seedling</td><td>0–499</td><td>0</td><td>🌱</td><td>50 GP, ribbon</td></tr>
            <tr><td>Sapling</td><td>500–999</td><td>1</td><td>🌿</td><td>Early access, 100 GP</td></tr>
            <tr><td>Young Grove</td><td>1000–1499</td><td>2</td><td>🌳</td><td>Badge frame, +1% boost</td></tr>
            <tr><td>Forest</td><td>1500–2499</td><td>3</td><td>🌲</td><td>Newsletter, 200 GP</td></tr>
            <tr><td>Canopy</td><td>2500–3999</td><td>5</td><td>🌴</td><td>5% off monthly</td></tr>
            <tr><td>Rainforest</td><td>4000–5999</td><td>8</td><td>🌳</td><td>Swag, 300 GP</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "Benefits & Redemption",
    content: (
      <ul>
        <li>Green Points → discounts, free shipping, gift cards.</li>
        <li>Tree Points → real trees (500 TP = 1 tree).</li>
        <li>Combine both for exclusive bundles and early access.</li>
      </ul>
    ),
  },
];

const certificates = [
  {
    title: "Fairtrade International",
    img: "/images/fairtrade.png",
    desc: "Products are produced in line with ethical and environmental standards, supporting farmers to tackle climate change challenges.",
  },
  {
    title: "Global Organic Textile Standard",
    img: "/images/gots.png",
    desc: "Certifies each step of the organic textile supply chain against strict ecological and social standards.",
  },
  {
    title: "Bluesign",
    img: "/images/bluesign.png",
    desc: "Products are responsibly manufactured using safer chemicals and fewer resources, including less energy, in production.",
  },
  {
    title: "Compact by Design",
    img: "/images/compact.png",
    desc: "Amazon-developed products remove excess air and water, reducing the carbon footprint of shipping and packaging.",
  },
  {
    title: "Cradle to Cradle Certified",
    img: "/images/cradle.png",
    desc: "Made with safer materials and responsible processes; achievement levels include Bronze, Silver, Gold, and Platinum.",
  },
  {
    title: "EPEAT",
    img: "/images/epeat.png",
    desc: "Assessed against criteria including energy use and reduced sustainability impact; ratings: Silver and Gold.",
  },
  {
    title: "Responsible Wool Standard",
    img: "/images/rws.png",
    desc: "Wool from farms that support animal welfare and responsible land management practices.",
  },
  {
    title: "ECOLOGO",
    img: "/images/ecologo.png",
    desc: "Certified products meet standards that can reduce the environmental impact of one or more lifecycle stages.",
  },
  {
    title: "Green Seal",
    img: "/images/greenseal.png",
    desc: "Products have reduced climate and environmental impacts at one or more stages of their lifecycle.",
  },
  {
    title: "Plant‑Based Fiber Blended",
    img: "/images/plantbased.png",
    desc: "Made with at least 50% plant‑based content and produced in a way that restricts harmful chemicals.",
  },
];

export default function EducationSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="education-section">
      {/* Header */}
      <div className="edu-header">
        <h1>EcoPoints & EcoScore Details</h1>
        <p className="edu-intro">
          In-depth calculations for EcoScore, point accrual, levels, badges, and redemptions.
        </p>
      </div>

      {/* Accordion */}
      <div className="edu-accordion">
        {topics.map((topic, i) => (
          <div className="edu-item" key={i}>
            <button className="edu-toggle" onClick={() => toggle(i)}>
              <span>{topic.title}</span>
              <span className={`icon ${openIndex === i ? "open" : ""}`}>
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            <div
              className={`edu-content ${openIndex === i ? "expanded" : ""}`} 
              style={{ maxHeight: openIndex === i ? "800px" : "0px" }}
            >
              {topic.content}
            </div>
          </div>
        ))}
      </div>

      {/* Certificates Section */}
      <div className="certificates-section">
        <h2>Certifications & Standards</h2>
        <div className="cert-grid">
          {certificates.map((cert, idx) => (
            <div className="cert-item" key={idx}>
              <img src={cert.img} alt={cert.title} />
              <h4>{cert.title}</h4>
              <p>{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}