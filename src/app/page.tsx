'use client'

import { useEffect, useRef, useState } from 'react';
import Card from './components/card/card';
import { generateCards, sortCardsToTableau, TCard, TCardWithIdx } from './config/card-config';
import './components/card/card.css';
import { PanInfo } from 'motion/react';
import Link from 'next/link';

export default function Home() {
  const lastCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [snapPoints, setSnapPoints] = useState<({ x: number; y: number; column: number; } | null)[]>([]);
  const [cards, setCards] = useState<TCard[] | null>([]);
  const [tableauCards, setTableauCards] = useState<TCardWithIdx[][] | null>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Init: Sort card 
  useEffect(() => {
    const generatedCards = generateCards()
    console.log('gen cards:', generatedCards[48])
    setCards(generatedCards)

    // console.log('sorted cards:', sortCardsToTableau(generatedCards))

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

    // for (let i = 0; i < tableauCards.length; i++) {
    //   for (let j = 0; j < tableauCards[i].length; j++) {
    //     if (!tableauCards[i][j].property.number || !tableauCards[i][j].property.number) {
    //     console.log('card is error', tableauCards[i][j])
    //     }
    //   }
    // }

    console.log('new tableau card', tableauCards)
  }, [tableauCards]);

  const handleDragOver = (dragEvent: React.DragEvent) => {
    dragEvent.preventDefault();

    const rect = dragEvent.currentTarget.getBoundingClientRect();
    const x = dragEvent.clientX - rect.left;
    const y = dragEvent.clientY - rect.top;

    // Find the column being dragged over
    const columnIndex = snapPoints.findIndex((snapPoint) => {
      if (!snapPoint) return false;
      const dx = x - snapPoint.x;
      const dy = y - snapPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 50; // Adjust the threshold as needed
    });

      console.log(`Dragging over column: ${columnIndex}`);

    if (columnIndex !== -1) {
      console.log(`Dragging over column: ${columnIndex}`);
      // Change the background color of the column
      const columnElement = document.getElementById(`column-${columnIndex}`);
      if (columnElement) {
        columnElement.style.backgroundColor = 'rgba(255, 255, 0, 0.5)'; // Highlight color
      }
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo, position: number[]): {x: number; y: number; column: number; } | null => {

      const { point } = info; // current drag point relative to viewport

      // Find closest snap point
      let closestPoint: { x: number; y: number; column: number } | null = null as { x: number; y: number; column: number } | null;
      let minDistance = Infinity;

      snapPoints.forEach((snapPoint) => {
        // console.log('snap point', snapPoint)
        if (snapPoint === null) return;

        const dx = point.x - snapPoint.x;
        const dy = point.y - snapPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = { x: snapPoint.x, y: snapPoint.y, column: snapPoint.column };
        }
      });
      console.log('Just drag:', position, 'to', closestPoint)

      // set the moved card to the new column in tableauCards according to the snapPoint.column found from closestPoint 
      if (closestPoint && tableauCards) {
        // Remove the card from its current position
        const updatedTableau = [...tableauCards];
        const movedCard = updatedTableau[position[0]][position[1]];
        if (!movedCard) {
          console.error('Card to move is undefined. Aborting move.', position);
          return closestPoint;
        }
        updatedTableau[position[0]].splice(position[1], 1);
      
        console.log('moved card:', movedCard)
        // Add the card to the new column
        updatedTableau[closestPoint.column].push(movedCard);
        // update the position of the moved card in the array
        updatedTableau[closestPoint.column][updatedTableau[closestPoint.column].length - 1].position = [closestPoint.column, updatedTableau[closestPoint.column].length - 1];


        // Update the other card at the end of other decks to flip
        if (updatedTableau[position[0]][updatedTableau[position[0]].length - 1])  {
          updatedTableau[position[0]][updatedTableau[position[0]].length - 1].flipped = true;

          console.log('updated tableau for card at', position[0], updatedTableau)
        }

        // Update the tableauCards state
        setTableauCards(updatedTableau);
      }

      return closestPoint
    };

  return (
    <div className="w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-green-700 flex flex-col gap-2 items-center">
    
    <Link href="https://e-kezia.com" target="_blank">
    <div className="tableau-container flex gap-2 font-jacquard12 text-2xl text-amber-200 group" ref={containerRef}>
        {/* Stock Pile */}
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between group-hover:bg-amber-400"><span className="block">@</span> <span className="block">R</span> </div>

        {/* Waste Pile */}
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between"><span className="block">E</span> <span className="block">A</span> </div>

        {/* Empty */}
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between"><span className="block">K</span> <span className="block">T</span> </div>

        {/* Foundation */}
        <div className="flex gap-2">
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between"><span className="block">E</span> <span className="block">E</span> </div>
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between"><span className="block">Z</span> <span className="block">C</span> </div>
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between"><span className="block">I</span> <span className="block">R</span> </div>
        <div className="flip-card bg-amber-200 border border-amber-400 w-full h-full p-2 flex flex-col items-center justify-between"><span className="block">A</span> <span className="block">D</span> </div>
        </div>
    </div>
    </Link>

      {/* Tableau */}
      <div className="tableau-container flex gap-2">
      {
        tableauCards?.map((deck, columnIdx) => {
          return(
            <div
              className="column border border-dashed border-amber-50 rounded-sm min-w-[109px]"
              id={`column-${columnIdx}`}
              key={columnIdx}
              onDragOver={handleDragOver}
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
                        draggable={cardIdx === deck.length -1}
                        number={card.property.number}
                        sign={card.property.sign}
                        color={card.property.color}
                        flipped={card.flipped}
                        translate={cardIdx * -100}
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
  );
}