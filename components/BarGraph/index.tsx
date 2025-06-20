"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.scss";

type BarData = {
  [key: string]: number;
};

type BarGraphProps = {
  data: BarData[];
  title?: string;
};

const BarGraph: React.FC<BarGraphProps> = ({ data, title = "Percentage Bar Diagram" }) => {
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    value: number;
    label: string;
  } | null>(null);

  const values = data.map((d) => Object.values(d)[0]);
  const maxValue = Math.max(...values, 0);

  const getYSteps = (max: number) => {
    if (max <= 10) return [0, 5, 10];
    if (max <= 50) return [0, 10, 20, 30, 40, 50];
    if (max <= 100) return [0, 20, 40, 60, 80, 100];
    if (max <= 200) return [0, 50, 100, 150, 200];
    
    const step = Math.ceil(max / 5 / 10) * 10;
    return Array.from({ length: 6 }, (_, i) => i * step);
  };

  const ySteps = getYSteps(maxValue);
  const maxYValue = ySteps[ySteps.length - 1] || 100;

  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      
      <div className={styles.graphArea}>
        <div className={styles.yAxis}>
          {[...ySteps].reverse().map((val) => (
            <span key={val} className={styles.yLabel}>
              {val}
            </span>
          ))}
        </div>

        <div className={styles.bars}>
          {data.map((item) => {
            const [label, value] = Object.entries(item)[0];
            const heightPercentage = (value / maxYValue) * 100;

            return (
              <motion.div
                key={label}
                className={styles.barWrapper}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoverInfo({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    value,
                    label,
                  });
                }}
                onMouseLeave={() => setHoverInfo(null)}
              >
                <span className={styles.barValue} style={{ height: `${heightPercentage}%` }}>{value}</span>
                <motion.div
                  className={styles.bar}
                  style={{ height: `${heightPercentage}%` }}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, scaleY: 1.05 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
                <span className={styles.time}>{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {hoverInfo && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              left: hoverInfo.x,
              top: hoverInfo.y,
              transform: 'translateX(-50%)'
            }}
          >
            {hoverInfo.label}: {hoverInfo.value}%
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BarGraph;