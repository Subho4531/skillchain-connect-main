'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, content, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
    >
      <StyledWrapper>
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            {icon && <div className="text-zinc-400 scale-125">{icon}</div>}
            <span className="card__title">{title}</span>
          </div>
          <p className="card__content">
            {content}
          </p>
          <div className="card__glitch-container">
            <button className="card__button">Learn More</button>
          </div>
        </div>
      </StyledWrapper>
    </motion.div>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 320px;
    min-height: 250px;
    padding: 25px;
    background: #0a0a0a;
    border: 4px solid #3f3f46; /* text-zinc-700 approx */
    box-shadow: 10px 10px 0 #1e1e1e;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card:hover {
    transform: translate(-5px, -5px);
    box-shadow: 15px 15px 0 #ffffff;
    border-color: #ffffff;
  }

  .card__title {
    font-size: 24px;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;
    display: block;
    position: relative;
    overflow: hidden;
  }

  .card__title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #ffffff;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .card:hover .card__title::after {
    transform: translateX(0);
  }

  .card__content {
    font-size: 15px;
    line-height: 1.6;
    color: #a1a1aa; /* text-zinc-400 */
    margin-bottom: 25px;
  }

  .card__button {
    border: 2px solid #3f3f46;
    background: transparent;
    color: #fff;
    padding: 12px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    width: 100%;
  }

  .card__button::before {
    content: "Explore";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(100%);
    transition: transform 0.3s;
  }

  .card__button:hover::before {
    transform: translateY(0);
  }

  .card__button:active {
    transform: scale(0.95);
  }

  .glitch {
    animation: glitch 0.3s infinite;
  }

  @keyframes glitch {
    0% { transform: translate(2px, 2px); }
    25% { transform: translate(-2px, -2px); }
    50% { transform: translate(-2px, 2px); }
    75% { transform: translate(2px, -2px); }
    100% { transform: translate(2px, 2px); }
  }
`;

export default FeatureCard;
