'use client';

import React from 'react';
import styled from 'styled-components';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  hoverText?: string;
  className?: string;
}

const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  hoverText = "Explore",
  className = "",
  ...props
}) => {
  return (
    <StyledWrapper className={className}>
      <button className="neo-button" {...props}>
        <span className="neo-button__content">{children}</span>
        <span className="neo-button__hover" data-hover={hoverText}></span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;
  
  .neo-button {
    border: 2px solid #3f3f46;
    background: transparent;
    color: #fff;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 160px;
  }

  .neo-button__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    transition: transform 0.3s;
  }

  .neo-button:hover .neo-button__content {
    transform: translateY(-100%);
  }

  .neo-button__hover {
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
    z-index: 2;
  }

  .neo-button__hover::before {
    content: attr(data-hover);
  }

  .neo-button:hover .neo-button__hover {
    transform: translateY(0);
  }

  .neo-button:active {
    transform: scale(0.95);
  }

  .neo-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default NeoButton;
