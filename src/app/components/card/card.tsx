'use client'

import React, { useRef, useState, forwardRef, useEffect } from 'react';
import './card.css';
import FrontSide from './front-side';
import BackSide from './back-side';
import { CONFIG } from '@/app/config/config';
import * as motion from "motion/react-client"
import { PanInfo, useAnimation } from 'motion/react';

interface FrontSideProps {
  number: string;
  sign: string;
  color: string;
  flipped: boolean;
  draggable: boolean;
  translate: number;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: MouseEvent | TouchEvent, info: PanInfo) => { x: number; y: number; column: number } | null;
}

const Card = forwardRef<HTMLDivElement, FrontSideProps>(
  ({ number, sign, color, flipped, draggable, translate, onDragOver, onDragEnd }, ref) => {
    const controls = useAnimation();
    const cardRef = useRef<HTMLDivElement>(null);

    // const handleFlip = () => setFlipped(!flipped);
    const [active, setActive] = useState(false);

    const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
      if (onDragEnd) {
        const closestPoint = onDragEnd(event, info); // Call the parent function
        console.log('Closest Point in Card:', closestPoint); // Access the return value
        if (closestPoint) {
        // Animate card to closest snap point
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          controls.start({
            x: closestPoint.x ,
            y: closestPoint.y ,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
          });
        }

      }

      }
    };

    const handleClick = async () => {
      if (!flipped && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();

        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        // Current card center
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        // Calculate translation needed to center card
        const deltaX = viewportCenterX - cardCenterX;
        const deltaY = viewportCenterY - cardCenterY;

        if (!active) {
          // Animate to center and scale up
            // Clone the card's current position to avoid layout shift
            const clonedRect = { ...rect };

            // Apply fixed positioning without affecting other cards
            cardRef.current.style.position = 'fixed';
            cardRef.current.style.top = `${clonedRect.top}px`;
            cardRef.current.style.left = `${clonedRect.left}px`;
            cardRef.current.style.width = `${clonedRect.width}px`;
            cardRef.current.style.height = `${clonedRect.height}px`;

            // Snap to current position before animating
            await controls.start({
            x: 0,
            y: 0,
            scale: 1,
            transition: { duration: 0 }, // snap to current position fixed first
            });

          await controls.start({
            x: deltaX,
            y: deltaY + translate,
            scale: 5,
            transition: { duration: 0.5, type: 'spring', bounce: 0.3 },
          });
        } else {
          // Animate back to original position and scale
          await controls.start({
            x: 0,
            y: 0 + translate,
            scale: 1,
            transition: { duration: 0.5, type: 'spring', bounce: 0.3 },
          });

          await controls.start({
            position: 'relative',
            top: 'auto',
            left: 'auto',
            transition: { duration: 0 },
          });
        }

        setActive(!active);
      }
    };

    return (
      <>
        <motion.div
          drag={draggable}
          onDragOver={onDragOver}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ scale: 1, x: 0, y: 0 + translate, position: 'relative', top: 'auto', left: 'auto' }}
          transition={{
            duration: 1,
            scale: { type: "spring", duration: 0.4, bounce: 0.5 },
          }}
          className={`flip-card ${active && "active"}`}
          onClick={handleClick}
          ref={(node) => {
            cardRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.RefObject<HTMLDivElement | null>).current = node;
            }
          }}
        >
          <div className="flip-card-inner" style={{
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            overflow: active ? 'scroll' : 'none',
            zIndex: active ? 99 : ''
          }}>
            <div className="flip-card-front">
              <FrontSide title={CONFIG[color === "red" ? 0 : 1].title} services={CONFIG[color === "red" ? 0 : 1].services} notes={CONFIG[color === "red" ? 0 : 1].notes ?? []} color={color} active={active} />
            </div>
            <div className="flip-card-back">
              <BackSide number={number} sign={sign} color={color} />
            </div>
          </div>
        </motion.div> 
      </>   
    );
  }
);

Card.displayName = 'Card';

export default Card;
