import React, { useState } from "react";
import "../Css/Educationsection.css";

// Import all certificate images
import fairtradeImg from "./images/fairtrade.jpg";
import gotsImg from "./images/gots.png";
import bluesignImg from "./images/bluesign.webp";
import compactImg from "./images/compact.webp";
import c2cImg from "./images/C2C.jpg";
import epeatImg from "./images/epeat.png";
import rwsImg from "./images/rws.png";
import ecologoImg from "./images/ecologo.jpg";
import greensealImg from "./images/greenseal.png";
import plantbasedImg from "./images/plantbased.png";

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
            <tr><td>ISO 14001</td><td>+5</td></tr>
            <tr><td>Energy Star</td><td>+3</td></tr>
            <tr><td>EU Ecolabel</td><td>+4</td></tr>
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
            <tr><th>Grade</th><th>Green Pts</th><th>Tree Pts</th></tr>
          </thead>
          <tbody>
            <tr><td>A+ (90–100)</td><td>15</td><td>15</td></tr>
            <tr><td>A  (75–89)</td><td>12</td><td>12</td></tr>
            <tr><td>B  (60–74)</td><td>8</td><td>8</td></tr>
            <tr><td>C  (40–59)</td><td>4</td><td>4</td></tr>
            <tr><td>D  (40)</td><td>0</td><td>0</td></tr>
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
            <tr><th>Level</th><th>TP Range</th><th>Trees Planted</th><th>Badge</th><th>Perks</th></tr>
          </thead>
          <tbody>
            <tr><td>Seedling</td><td>0–499</td><td>0</td><td>🌱</td><td>50 GP, ribbon</td></tr>
            <tr><td>Sapling</td><td>500–999</td><td>1</td><td>🌿</td><td>Early access, 100 GP</td></tr>
            <tr><td>Young Grove</td><td>1000–1499</td><td>2</td><td>🌳</td><td>Badge frame, +1% boost</td></tr>
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
        <li>Tree Points → real trees (500 TP = 1 tree).</li>
        <li>Combine both for exclusive bundles and early access.</li>
      </ul>
    ),
  },
];

const certificates = [
  {
    title: "Fairtrade International",
    img: fairtradeImg,
    desc: "Products are produced in line with ethical and environmental standards, supporting farmers to tackle climate change challenges.",
  },
  {
    title: "Global Organic Textile Standard",
    img: gotsImg,
    desc: "Certifies each step of the organic textile supply chain against strict ecological and social standards.",
  },
  {
    title: "Bluesign",
    img: bluesignImg,
    desc: "Products are responsibly manufactured using safer chemicals and fewer resources, including less energy, in production.",
  },
  {
    title: "Compact by Design",
    img: compactImg,
    desc: "Amazon-developed products remove excess air and water, reducing the carbon footprint of shipping and packaging.",
  },
  {
    title: "Cradle to Cradle Certified",
    img: c2cImg,
    desc: "Made with safer materials and responsible processes; achievement levels include Bronze, Silver, Gold, and Platinum.",
  },
  {
    title: "EPEAT",
    img: epeatImg,
    desc: "Assessed against criteria including energy use and reduced sustainability impact; ratings: Silver and Gold.",
  },
  {
    title: "Responsible Wool Standard",
    img: rwsImg,
    desc: "Wool from farms that support animal welfare and responsible land management practices.",
  },
  {
    title: "ECOLOGO",
    img: ecologoImg,
    desc: "Certified products meet standards that can reduce the environmental impact of one or more lifecycle stages.",
  },
  {
    title: "Green Seal",
    img: greensealImg,
    desc: "Products have reduced climate and environmental impacts at one or more stages of their lifecycle.",
  },
  {
    title: "Plant‑Based Fiber Blended",
    img: plantbasedImg,
    desc: "Made with at least 50% plant‑based content and produced in a way that restricts harmful chemicals.",
  },
];

const sustainabilityFeatures = [
  {
    id: "ai-delivery",
    icon: "🤖",
    title: "AI Powered Delivery Scheduler",
    subtitle: "Smart Timing, Lower Emissions",
    problem: {
      title: "The Delivery Challenge",
      description: "Customers' inability to receive deliveries due to inconvenient timing increases repeat trips, raising carbon emissions significantly.",
      stats: [
        { label: "High Carbon Emissions", detail: "Transportation accounts for a significant portion of Amazon's carbon footprint, with last-mile delivery being a key contributor." },
        { label: "Inefficient Timing", detail: "Missed deliveries from poor timing require repeat trips, increasing fuel consumption and emissions." },
        { label: "Unoptimized Windows", detail: "Lack of customer-focused scheduling leads to increased environmental costs, hindering net-zero carbon goals." }
      ]
    },
    solution: {
      features: [
        {
          title: "AI-Optimized Scheduling",
          description: "Predicts ideal delivery times using customer history and real-time data (traffic, weather) to minimize missed deliveries and extra trips."
        },
        {
          title: "Low-Impact Delivery Rewards",
          description: "Recommends \"green\" delivery slots with messages like \"Pick this window to cut emissions by 15%\" and rewards users with discounts/credits."
        },
        {
          title: "Route Consolidation",
          description: "Groups nearby orders and syncs with group buys to reduce fuel use and last-mile emissions."
        }
      ]
    }
  },
  {
    id: "group-buying",
    icon: "🏘️",
    title: "Group Buying for Environmental Impact",
    subtitle: "Community Power, Reduced Footprint",
    problem: {
      title: "The Fragmentation Problem",
      description: "Frequent repeat deliveries to the same region increase carbon emissions. Customers often place separate orders, leading to excessive packaging and high delivery emissions.",
      highlight: {
        stat: "15%",
        label: "of e-commerce emissions caused by transportation",
        source: "MIT Real Estate Innovation Lab, 2023"
      },
      stats: [
        { label: "Excessive Individual Orders", detail: "Customers placing separate orders leads to multiple delivery trips to the same areas." },
        { label: "No Coordination System", detail: "There's no simple way for nearby individuals to synchronize local deliveries and reduce environmental impact." }
      ]
    },
    solution: {
      features: [
        {
          title: "Community Group Shopping",
          description: "Pool local orders to minimize last-mile carbon emissions & waste, with bulk delivery to shared pickup points. Reward participation with discounts & track collective impact via AWS IoT."
        },
        {
          title: "Voice-Activated via Alexa",
          description: "\"Alexa, join a group buy\" – shop sustainably with hands-free ordering. Seamless integration for eco-friendly product bundles."
        }
      ]
    }
  },
  {
    id: "sustainable-packaging",
    icon: "♻️",
    title: "Sustainable Packaging & Returns",
    subtitle: "Circular Economy in Action",
    problem: {
      title: "The Waste Crisis",
      description: "Excess packaging waste and frequent returns drive up emissions. Customers often discard packaging boxes, unaware that this adds to landfill waste and increases emissions.",
      stats: [
        { label: "Packaging Waste", detail: "E-commerce's biggest GHG contributor, with cardboard that can be reused up to 5 times being wasted." },
        { label: "Product Returns", detail: "The #2 source of emissions, with no efficient system to handle them sustainably." },
        { label: "Material Loss", detail: "Reusable materials and logistical inefficiencies result in significant waste of recyclable resources." }
      ]
    },
    solution: {
      locationBased: [
        {
          type: "Large Cities",
          icon: "🏙️",
          description: "Community-based deposit centers for cardboard drop-off, recycling, and package returns to enhance urban sustainability."
        },
        {
          type: "Small Towns",
          icon: "🏘️",
          description: "Delivery personnel collect packaging and return items during routes. Customers receive notifications about delivery routes and can request pickups via the Amazon app or website."
        }
      ],
      benefits: [
        "Reduces landfill waste by up to 80%",
        "Maximizes cardboard reuse (up to 5 cycles)",
        "Streamlines return logistics",
        "Provides convenient pickup notifications"
      ]
    }
  }
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
              style={{ maxHeight: openIndex === i ? "1200px" : "0px" }}
            >
              {topic.content}
            </div>
          </div>
        ))}
      </div>

      {/* Certificates Section */}
      <div className="certificates-section">
        <h2>Certifications & Standards</h2>
        <p className="cert-intro">Recognized global standards that verify sustainability, ethical sourcing, and eco-friendly manufacturing practices.</p>
        <div className="cert-grid sleek">
          {certificates.map((cert, idx) => (
            <div className="cert-item sleek" key={idx}>
              <div className="cert-img-wrapper">
                <img src={cert.img} alt={cert.title} />
              </div>
              <div className="cert-text">
                <h4>{cert.title}</h4>
                <p>{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Sustainability Features Section */}
      <div className="sustainability-features">
        <div className="features-header">
          <h2>Sustainability Innovation</h2>
          <p>Advanced solutions tackling environmental challenges in e-commerce</p>
        </div>

        <div className="features-grid">
          {sustainabilityFeatures.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-header">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-title-group">
                  <h3>{feature.title}</h3>
                  <p className="feature-subtitle">{feature.subtitle}</p>
                </div>
              </div>

              <div className="feature-content">
                {/* Problem Section */}
                <div className="problem-block">
                  <h4 className="problem-title">🚛 {feature.problem.title}</h4>
                  <p className="problem-description">{feature.problem.description}</p>
                  
                  {feature.problem.highlight && (
                    <div className="stat-highlight">
                      <div className="stat-number">{feature.problem.highlight.stat}</div>
                      <div className="stat-details">
                        <span className="stat-label">{feature.problem.highlight.label}</span>
                        <span className="stat-source">{feature.problem.highlight.source}</span>
                      </div>
                    </div>
                  )}

                  <div className="problem-stats">
                    {feature.problem.stats.map((stat, idx) => (
                      <div key={idx} className="stat-item">
                        <strong>{stat.label}:</strong> {stat.detail}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solution Section */}
                <div className="solution-block">
                  <h4 className="solution-title">✨ Smart Solutions</h4>
                  
                  {feature.solution.features && (
                    <div className="solution-features">
                      {feature.solution.features.map((solutionFeature, idx) => (
                        <div key={idx} className="solution-feature">
                          <h5>{solutionFeature.title}</h5>
                          <p>{solutionFeature.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {feature.solution.locationBased && (
                    <div className="location-solutions">
                      {feature.solution.locationBased.map((location, idx) => (
                        <div key={idx} className="location-solution">
                          <h5>{location.icon} {location.type}</h5>
                          <p>{location.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {feature.solution.benefits && (
                    <div className="benefits-block">
                      <h5>Key Benefits:</h5>
                      <ul>
                        {feature.solution.benefits.map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}