'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaUserMd, FaMoneyBillWave, FaNotesMedical, FaSpinner } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './attendants.module.scss';
import useFetch from '@/utils/fetch';

interface Attendant {
  id: number;
  name: string;
  category: string;
  performance_score: number;
  tickets_handled: number;
  avg_processing_time: number;
  profile_image?: string;
}

export default function AttendantsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagesize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'meds', 'accounts', 'nurse_station'];
  const [fields, setFields] = useState({
    duration: "day",
    stage: "accounts"
  })
  const {data,loading:docLoading} = useFetch("http://localhost:5000/doctors/get_doctors",{page,pagesize})
  const {data:perfomers,loading:perfLoading} = useFetch("http://localhost:5000/attend-new/top-performers",{duration:fields.duration,stage:fields.stage})

  useEffect(() => {
    if(!perfLoading){
      console.log('perfomers are ',perfomers.data)
    }
  }, [page, pagesize,perfomers]);

  const filteredAttendants = selectedCategory === 'all'
    ? !docLoading && data.data
    : !docLoading && data.data.filter((attendant:any) => attendant.service.toLowerCase() === selectedCategory);

  const topPerformers = !docLoading && data.data
    .sort((a:any, b:any) => b.performance_score - a.performance_score)
    .slice(0, 3);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Attendants Dashboard</title>
        <meta name="description" content="View and manage hospital attendants" />
      </Head>
      <main className={styles.main}>
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.header}
        >
          <h1>Attendants Dashboard</h1>
          <p>Explore our dedicated team of healthcare professionals</p>
        </motion.div>

        {/* Top Performers */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.top_performers}
        >
          <h2>Top Performers</h2>
          <div className={styles.top_performers_grid}>
            {!perfLoading && perfomers.data.map((attendant:any, index:number) => (
              <motion.div
                key={attendant.id}
                variants={itemVariants}
                className={styles.top_performer_card}
              >
                <div className={styles.avatar_container}>
                  <img
                    src={attendant.profile_image || '/placeholder.jpg'}
                    alt={attendant.name}
                    className={styles.avatar}
                  />
                  <div className={styles.star_icon}>
                    <FaStar />
                  </div>
                </div>
                <h3>{attendant.name}</h3>
                {/* <p className={styles.category}>{attendant.category.replace('_', ' ')}</p> */}
                <p className={styles.category}>{attendant.role.replace('_', ' ')}</p>
                <p className={styles.score}>
                  Score: {attendant.score}/100
                </p>
                <p className={styles.stats}>
                  Tickets: {attendant.totalTickets} | Avg. Time: {attendant.avgProcessingTime}s
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.filters}
        >
          {categories.map((category) => (
            <button
              key={fields.stage}
              onClick={() => handleCategoryChange(category)}
              className={`${styles.filter_button} ${selectedCategory === category ? styles.active : ''}`}
            >
              {category === 'all' ? 'All' : category.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Attendants Grid */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className={styles.attendants}>
          { docLoading ? (
            <div className={styles.loading}>
              <FaSpinner className={styles.spinner} />
            </div>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : filteredAttendants.length === 0 ? (
            <p className={styles.no_results}>No attendants found.</p>
          ) : (
            <div className={styles.attendants_grid}>
              {filteredAttendants.map((attendant:any) => (
                <motion.div
                  key={attendant.id}
                  variants={itemVariants}
                  className={styles.attendant_card}
                >
                  <div className={styles.attendant_info}>
                    <img
                      src={attendant.profile_image || '/default-avatar.png'}
                      alt={attendant.name}
                      className={styles.attendant_avatar}
                    />
                    <div>
                      <h3>{attendant.name}</h3>
                      {/* <p className={styles.category}>{attendant.category.replace('_', ' ')}</p> */}
                      <p className={styles.category}>{attendant.service.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className={styles.attendant_stats}>
                    <p>
                      <FaUserMd className={styles.icon} />
                      Performance: {attendant.performance_score}/100
                    </p>
                    <p>
                      <FaNotesMedical className={styles.icon} />
                      Tickets Handled: {attendant.tickets_handled}
                    </p>
                    <p>
                      <FaMoneyBillWave className={styles.icon} />
                      Avg. Time: {attendant.avg_processing_time}s
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Pagination */}
        {!loading && filteredAttendants.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.pagination}
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={styles.pagination_button}
            >
              <IoIosArrowBack />
            </button>
            <span className={styles.pagination_text}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={styles.pagination_button}
            >
              <IoIosArrowForward />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}