'use client'

import { useEffect, useRef, useState } from 'react';
import Card from './components/card/card';
import { generateCards, sortCardsToTableau, TCardWithIdx } from '../config/card-config';
import './components/card/card.css';
import { PanInfo } from 'motion/react';
import Link from 'next/link';
import useScreenSize from '../hooks/useScreenSize';
import { useCustomerContext } from '@/context/customer-context';
import PasswordInput from './components/password/password-input';
import { useSearchParams } from 'next/navigation';
import { getSessionStorageWithExpiry } from '../utils/session-storage';

export default function Home() {
  const searchParams = useSearchParams()
   
  const currency = searchParams.get('currency');

  const { setCurrency, setData } = useCustomerContext();
  
  useEffect(() => {
    if (currency) setCurrency(currency);
  }, [currency]);

  useEffect(() => {
  const validateToken = async () => {
    const token = getSessionStorageWithExpiry('token') || searchParams.get('token');
    const currency = searchParams.get('currency');

    if (token && currency) {
      try {
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, currency }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          console.log('Token validated successfully:', data.data);
          setData(data.data); // Set the validated data
        } else {
          console.error('Failed to validate token:', data.error);
          sessionStorage.removeItem('token'); // Remove invalid token
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    }
  };

  validateToken(); // Call the async function
}, [searchParams, setData]);

  const { isMobile } = useScreenSize()
  const lastCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [snapPoints, setSnapPoints] = useState<({ x: number; y: number; column: number; } | null)[]>([]);
  const [tableauCards, setTableauCards] = useState<TCardWithIdx[][] | null>([]);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { openModal, setOpenModal } = useCustomerContext();
  
  // Init: Sort card 
  useEffect(() => {
    const generatedCards = generateCards()
    setTableauCards(sortCardsToTableau(generatedCards))
  }, []);

  // Init: Set snap points
  useEffect(() => {
    if (!tableauCards) return;

    const points = lastCardRefs.current.map((card, idx) => {
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        column: idx,
      };
    }).filter(Boolean);

    setSnapPoints(points);
  }, [tableauCards]);

  const handleDragOver = (dragEvent: React.PointerEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const containerLeft = containerRect ? containerRect.left : 0;
    dragEvent.preventDefault();

    const closestColumn = Math.floor((dragEvent.clientX - containerLeft) / (isMobile ? 38 + 2 : 100 + 4));
    if (closestColumn >= 0 && closestColumn <= 6) {
      setHoveredColumn(closestColumn)
    }

    console.log('hovered on', hoveredColumn)
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo, position: number[]): {x: number; y: number; column: number; } | null => {

      const { point } = info;

      // Find closest snap point
      let closestPoint: { x: number; y: number; column: number } | null = null as { x: number; y: number; column: number } | null;
      let minDistance = Infinity;

      snapPoints.forEach((snapPoint) => {
        if (snapPoint === null) return;

        const dx = point.x - snapPoint.x;
        const dy = point.y - snapPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = { x: snapPoint.x, y: snapPoint.y, column: snapPoint.column };
        }
      });
 
      // set the moved card to the new column in tableauCards according to the snapPoint.column found from closestPoint 
      if (closestPoint && tableauCards && hoveredColumn) {
        // Remove the card from its current position
        const updatedTableau = [...tableauCards];
        const movedCard = updatedTableau[position[0]][position[1]];
        if (!movedCard) {
          console.error('Card to move is undefined. Aborting move.', position);
          return closestPoint;
        }
        updatedTableau[position[0]].splice(position[1], 1);
      
        console.log('moved card:', movedCard, 'hovered on', hoveredColumn)
        // Add the card to the new column
        updatedTableau[hoveredColumn].push(movedCard);
        // update the position of the moved card in the array
        updatedTableau[hoveredColumn][updatedTableau[closestPoint.column].length - 1].position = [hoveredColumn, updatedTableau[closestPoint.column].length - 1];


        // Update the other card at the end of other decks to flip
        if (updatedTableau[position[0]][updatedTableau[position[0]].length - 1])  {
          updatedTableau[position[0]][updatedTableau[position[0]].length - 1].flipped = true;

          console.log('updated tableau for card at', position[0], updatedTableau)

          setHoveredColumn(null)
        }

        // Update the tableauCards state
        setTableauCards(updatedTableau);
      }

      return closestPoint
    };

  return (
    <>
    <PasswordInput open={openModal} onClose={() => setOpenModal(false)} />

    <div className={`w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-green-700 flex flex-col gap-2 items-center ${openModal ? 'pointer-events-none blur-sm' : ''} transition-all`}
    >
    <Link href="https://e-kezia.com" target="_blank">
    <div className="tableau-container flex gap-2 font-jacquard12 text-2xl text-amber-200 group" ref={containerRef}>
        {/* Stock Pile */}
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between group-hover:bg-amber-400"><span className="block">@</span> <span className="block">R</span> </div>

        {/* Waste Pile */}
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between"><span className="block">E</span> <span className="block">A</span> </div>

        {/* Empty */}
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between"><span className="block">K</span> <span className="block">T</span> </div>

        {/* Foundation */}
        <div className="flex gap-2">
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between"><span className="block">E</span> <span className="block">E</span> </div>
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between"><span className="block">Z</span> <span className="block">C</span> </div>
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between"><span className="block">I</span> <span className="block">R</span> </div>
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-[4px] lg:p-2 flex flex-col items-center justify-between"><span className="block">A</span> <span className="block">D</span> </div>
        </div>
    </div>
    </Link>

      {/* Tableau */}
      <div className="tableau-container flex gap-2">
      {
        tableauCards?.map((deck, columnIdx) => {
          return(
            <div
              className="column border border-dashed border-amber-50 rounded-sm min-w-[42px] lg:min-w-[109px]"
              id={`column-${columnIdx}`}
              key={columnIdx}
              onPointerOver={handleDragOver}
              style={{
                backgroundColor: hoveredColumn === columnIdx ? 'rgba(255, 255, 0, 0.5)' : 'transparent',
                transition: 'background-color 0.3s ease-in-out',
              }}
            >
              {
                deck.map((card, cardIdx) => {
                  return (
                    // <motion.div
                    //   initial={{  scale: 0 }}
                    //   animate={{  scale: 1 }}
                    //   transition={{
                    //       duration: 1,
                    //       scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    //       delay: 0.05 * cardIdx * columnIdx
                    //   }}
                    //   key={cardIdx} 
                    //   className={cardIdx === deck.length - 1 ? "cursor-grab" : "cursor-pointer"}
                    // >
                      <Card
                        id={`card-${cardIdx}`}
                        draggable={cardIdx === deck.length -1}
                        number={card.property.number}
                        sign={card.property.sign}
                        color={card.property.color}
                        flipped={card.flipped}
                        translate={cardIdx * (isMobile ? -30 : -100)}
                        ref={cardIdx === deck.length - 1 ? el => { lastCardRefs.current[columnIdx] = el; } : null}
                        onDragOver={handleDragOver}
                        onDragEnd={(event, info) => handleDragEnd(event, info, card.position)}
                        key={cardIdx}
                      />
                    // </motion.div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
    </div>
    </>
  );
}