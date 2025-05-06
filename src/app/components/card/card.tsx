'use client'

import React, { useRef, useState, forwardRef, useEffect } from 'react';
import './card.css';
import FrontSide from './front-side';
import BackSide from './back-side';
import { CONFIG } from '@/config/config';
import * as motion from "motion/react-client"
import { PanInfo, useAnimation } from 'motion/react';
import { useCustomerContext } from '@/context/customer-context';

interface CardProps {
  id: string;
  number: string;
  sign: string;
  color: string;
  flipped: boolean;
  draggable: boolean;
  translate: number;
  onDragOver: (event: React.PointerEvent<HTMLDivElement>) => void; // onPointerOver, todo
  onDragEnd: (event: MouseEvent | TouchEvent, info: PanInfo) => { x: number; y: number; column: number } | null;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, number, sign, color, flipped, draggable, translate, onDragOver, onDragEnd }, ref) => {
    const { openModal } = useCustomerContext();
    
    const controls = useAnimation();
    const cardRef = useRef<HTMLDivElement>(null);

    // const handleFlip = () => setFlipped(!flipped);
    const [active, setActive] = useState<string | null>(null);

    const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
      if (onDragEnd) {
        const closestPoint = onDragEnd(event, info); // Call the parent function
        console.log('Closest Point in Card:', closestPoint); // Access the return value
        if (closestPoint) {
        // Animate card to closest snap point
        if (cardRef.current) {
          // const rect = cardRef.current.getBoundingClientRect();
          controls.start({
            x: closestPoint.x ,
            y: closestPoint.y ,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
          });
        }
      }
      }
    };

    useEffect(()  => {
       controls.start({
            y: translate,
            scale: 1,
            transition: { duration: 0.5, type: 'spring', bounce: 0.3 },
          })
    }, [translate, controls])

    // Card Click Listener
    const handleClick = async () => {
      if (!flipped && active === null) {
          setActive(id);
          animations.zoomIn();
          console.log('Clicked card:', id);
      }
    };

    // Clickaway Listener
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(event.target as Node) && !openModal) {
          setActive(null);
          animations.zoomOut();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [openModal, cardRef]);

    const animations = React.useMemo(() => ({
      zoomIn: async () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();

        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        // Current card center
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        // Calculate translation needed to center card
        const deltaX = viewportCenterX - cardCenterX;
        const deltaY = viewportCenterY - cardCenterY;

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
        scale: 4,
        transition: { duration: 0.5, type: 'spring', bounce: 0.3 },
        });
      }
      },
      zoomOut: async () => {
      // Animate back to original position and scale when user clicks away
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
      },
    }), [controls, translate]);


    return (
      <>
        <motion.div
          id={id}
          drag={draggable}
            // dragListener={false}
            // onDragOver={onDragOver}
            onPointerMove={(e) => {
              e.preventDefault();
              onDragOver(e);
            }}
            onDragEnd={handleDragEnd}
            animate={controls}
            transition={{
              duration: 0.5, // Adjust duration as needed
              type: 'spring',
              bounce: 0.3,
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
            // overflow: active ? 'scroll' : 'none',
            zIndex: active ? 99 : ''
          }}>
            <div className="flip-card-front">
              <FrontSide
                dataId={color === "black" ? 0 : 1}
               defaultData={CONFIG[color === "black" ? 0 : 1]} color={color} active={active !== null} />
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
