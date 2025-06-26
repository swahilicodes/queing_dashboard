'use client';
import Image from "next/image";
import styles from "./page.module.scss";
import Head from "next/head";
import useFetch from "@/utils/fetch";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TicketData = {
  stage: string;
  tickets: Array<{ [time: string]: number }>;
};

export default function Home() {
  const [duration, setDuration] = useState('day');
  const [total, setTotal] = useState(0);
  const [fields, setFields] = useState({
    start_date: "",
    end_date: "",
    status: "all"
  });
  const { data, loading, error } = useFetch("http://localhost:5000/sales-analytics/sales_analytics",
    { duration, start_date: fields.start_date, end_date: fields.end_date, status: fields.status }
  );
  const { data: barData, loading: barLoading, error: barError } = useFetch("http://localhost:5000/sales-analytics/sales_analytics",
    { duration, start: fields.start_date, end: fields.end_date, status: fields.status });

  function round(num: number): number {
    return parseFloat(num.toFixed(1));
  }

  function calculateStageStats(
    data: TicketData,
    selectedTime: number
  ): { total: number; percentage: number } {
    if (!data?.tickets) return { total: 0, percentage: 0 };
    
    // Sum all ticket values
    const total = data.tickets.reduce((sum, ticket) => {
      const value = Object.values(ticket)[0];
      return sum + (value || 0);
    }, 0);

    const selectedValue = selectedTime || 0;

    // Calculate percentage safely
    const percentage = total > 0 ? (selectedValue / total) * 100 : 0;
    return {
      total: total,
      percentage: Math.floor(percentage)
    };
  }

  useEffect(() => {
    
  }, [barLoading]);

  const barAnimation = {
    hidden: { height: 0 },
    visible: (i: number) => ({
      height: `${i}%`,
      transition: {
        delay: i * 0.005,
        duration: 0.8,
        type: "spring",
        damping: 10
      }
    })
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Home Page</title>
      </Head>
      <main>
        <div className={styles.selectors}>
          <div className={styles.left}>
            <div className={styles.selector}>
              <label>Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
              >
                <option value="" disabled>--select--</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="all">All Time</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {
              duration === "custom" && (
                <div className={styles.duration}>
                  <div className={styles.duration_item}>
                    <label>Start</label>
                    <input
                      type="date"
                      value={fields.start_date}
                      onChange={e => setFields({ ...fields, start_date: e.target.value })}
                    />
                  </div>
                  <div className={styles.duration_item}>
                    <label>End</label>
                    <input
                      type="date"
                      value={fields.end_date}
                      onChange={e => setFields({ ...fields, end_date: e.target.value })}
                    />
                  </div>
                </div>
              )
            }
          </div>
          <div className={styles.right}>
            <div className={styles.selector}>
              <label>Status</label>
              <select
                value={fields.status}
                onChange={e => setFields({ ...fields, status: e.target.value })}
              >
                <option value="" disabled>--select--</option>
                <option value="waiting">Waiting</option>
                <option value="pending">Pending</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Analytics Boxes */}
        <div className={styles.analytics}>
          <div className={styles.analytics_box}>
            <div className={styles.left}>
              <div className={styles.title}>
                <h3>Total Tickets</h3>
              </div>
              <div className={styles.content}>
                <h3>{loading || !data ? "Loading..." : data?.total_tickets || 0}</h3>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.wrapper}>
                <div className={styles.outer} style={{ width: `${!loading && data ? ((data?.total_tickets || 0) / (data?.total_tickets || 1)) * 100 : 0}%` }}></div>
              </div>
              <div className={styles.percentage}>
                {round(loading || !data ? 0 : ((data?.total_tickets || 0) / (data?.total_tickets || 1)) * 100)}%
              </div>
            </div>
          </div>
          
          {/* Other analytics boxes with similar protection */}
          <div className={styles.analytics_box}>
            <div className={styles.left}>
              <div className={styles.title}>
                <h3>Medical Tickets</h3>
              </div>
              <div className={styles.content}>
                <h3>{loading || !data ? "Loading..." : data?.medical_tickets || 0}</h3>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.wrapper}>
                <div className={styles.outer} style={{ width: `${!loading && data ? ((data?.medical_tickets || 0) / (data?.total_tickets || 1)) * 100 : 0}%` }}></div>
              </div>
              <div className={styles.percentage}>
                {round(loading || !data ? 0 : ((data?.medical_tickets || 0) / (data?.total_tickets || 1)) * 100)}%
              </div>
            </div>
          </div>
          
          {/* Cashier Tickets */}
          <div className={styles.analytics_box}>
            <div className={styles.left}>
              <div className={styles.title}>
                <h3>Cashier Tickets</h3>
              </div>
              <div className={styles.content}>
                <h3>{loading || !data ? "Loading..." : data?.account_tickets || 0}</h3>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.wrapper}>
                <div className={styles.outer} style={{ width: `${!loading && data ? ((data?.account_tickets || 0) / (data?.total_tickets || 1)) * 100 : 0}%` }}></div>
              </div>
              <div className={styles.percentage}>
                {round(loading || !data ? 0 : ((data?.account_tickets || 0) / (data?.total_tickets || 1)) * 100)}%
              </div>
            </div>
          </div>
          
          {/* Clinic Tickets */}
          <div className={styles.analytics_box}>
            <div className={styles.left}>
              <div className={styles.title}>
                <h3>Clinic Tickets</h3>
              </div>
              <div className={styles.content}>
                <h3>{loading || !data ? "Loading..." : data?.clinic_tickets || 0}</h3>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.wrapper}>
                <div className={styles.outer} style={{ width: `${!loading && data ? ((data?.clinic_tickets || 0) / (data?.total_tickets || 1)) * 100 : 0}%` }}></div>
              </div>
              <div className={styles.percentage}>
                {round(loading || !data ? 0 : ((data?.clinic_tickets || 0) / (data?.total_tickets || 1)) * 100)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Graphs Section */}
        <div className={styles.graphs}>
          {barLoading ? (
            <div className={styles.loading}>Loading graph data...</div>
          ) : barError ? (
            <div className={styles.error}>Error loading graph data</div>
          ) : !barData || barData.length === 0 ? (
            <div className={styles.no_data}>No data available for the selected period</div>
          ) : (
            <div className={styles.wrapper}>
              {barData.map((item: any, index: number) => (
                <div className={styles.graph_child} key={index}>
                  <div className={styles.title}>{item.stage}</div>
                  <div className={styles.hours}>
                    {item.tickets?.map((data: any, i: number) => {
                      const [[time, value]] = Object.entries(data) as [string, number][];
                      const { percentage } = calculateStageStats(item, value);
                      return (
                        <motion.div
                          className={styles.hour_wrapper}
                          initial="hidden"
                          animate="visible"
                          custom={percentage + 10}
                          variants={barAnimation}
                          style={{ backgroundColor: '#4F46E5' }}
                          key={time}
                        >
                          <div className={styles.hour_bar} style={{color:"white",display:"flex",alignItems:"center",justifyContent:"center",background:"transparent"}}>
                            {value || 0}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className={styles.hours_true}>
                    {item.tickets?.map((data: any) => {
                      const [[time, value]] = Object.entries(data) as [string, number][];
                      return (
                        <div className={styles.hawa} key={time}>{time}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Other Analytics Section */}
        <div className={styles.other_analytics}>
          <div className={styles.others}>
            <div className={styles.other}>
              <div className={styles.title}>Peak Times</div>
              <div className={styles.content}>
                {loading || !data ? (
                  <div className={styles.loading}>Loading...</div>
                ) : !data.peak_times || data.peak_times.length === 0 ? (
                  <div className={styles.no_data}>No peak times data</div>
                ) : (
                  data.peak_times.map((item: any, index: number) => (
                    <div className={styles.content_item} key={index}>
                      <div className={styles.namba}>{index + 1}</div>
                      <div className={styles.item}>{item}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className={styles.other}>
              <div className={styles.title}>Average Waiting Times</div>
              <div className={styles.content}>
                {loading || !data ? (
                  <div className={styles.loading}>Loading...</div>
                ) : !data.output_times ? (
                  <div className={styles.no_data}>No waiting times data</div>
                ) : (
                  Object.entries(data.output_times || {}).map(([key, value], index) => (
                    <div className={styles.content_item} key={index}>
                      <div className={styles.namba}>{index + 1}</div>
                      <div className={styles.item}>
                        <div className={styles.key}>{key}</div>
                        <div className={styles.value}>{String(value)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className={styles.other}>
              <div className={styles.title}>Date Range</div>
              <div className={styles.content}>
                {loading || !data ? (
                  <div className={styles.loading}>Loading...</div>
                ) : (
                  <>
                    {(data.duration !== "day" && data.duration !== "all") ? (
                      Object.entries(data.period || {}).map(([key, value], index) => (
                        <div className={styles.content_item} key={index}>
                          <div className={styles.namba}>{index + 1}</div>
                          <div className={styles.item}>
                            <div className={styles.key}>{key}</div>
                            <div className={styles.value}>{String(value)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.content_item}>
                        <div className={styles.namba}>1</div>
                        <div className={styles.item}>
                          <div className={styles.key}>date</div>
                          <div className={styles.value}>{data?.date || 'N/A'}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}