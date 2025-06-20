'use client'
import useFetch from '@/utils/fetch';
import React, { useState } from 'react'
import styles from './attends.module.scss'
import cx from 'classnames'
import { FaSpinner, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Attends() {
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pagesize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const categories = [
        {
            key: "All",
            value: "all"
        },
        {
            key: "Medical Records",
            value: "meds"
        },
        {
            key: "Accounts",
            value: "accounts"
        },
        {
            key: "Nurse Station",
            value: "nurse_station"
        },
        {
            key: "Clinic",
            value: "clinic"
        }
    ];
    const [fields, setFields] = useState({
        duration: "day",
        stage: "all",
        page: 1,
        name: ""
    })
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
    const { data, loading: docLoading } = useFetch("http://localhost:5000/doctors/get_doctors", { page, pagesize })
    const { data: perfomers, loading: perfLoading } = useFetch("http://localhost:5000/attend-new/top-performers", { duration: fields.duration, stage: fields.stage,page: fields.page, name: fields.name })
    return (
        <div className={styles.attends}>
            <div className={styles.attends_top}>
                <div className={styles.left}>
                    <div className={styles.title}>Top Perfomers</div>
                    <div className={styles.duration}>
                        <select onChange={e => setFields({...fields,duration: e.target.value})}>
                            <option value="all">All</option>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div className={styles.search}>
                        <input 
                        type="text"
                        value={fields.name} 
                        onChange={e => setFields({...fields,name: e.target.value})}
                        placeholder='Search Here'
                        />
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.navigations}>
                        {
                            categories.map((item: any, index: number) => (
                                <div className={cx(styles.navigation, item.value === fields.stage && styles.active)} onClick={() => setFields({ ...fields, stage: item.value })} key={index}>{item.key}</div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.analytics}>
                    {
                        perfLoading
                        ? <div className={styles.ana_content}>
                            <div className={styles.item}></div>
                        </div>
                        : <div className={styles.ana_content}>
                            <div className={styles.item}>
                                <div className={styles.title}>All Attendants</div>
                                <div className={styles.idadi}>{perfomers.departmentCounts.all}</div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.title}>Medical Recorders</div>
                                <div className={styles.idadi}>{perfomers.departmentCounts.medical_recorders}</div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.title}>Accountants</div>
                                <div className={styles.idadi}>{perfomers.departmentCounts.accountants}</div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.title}>Nurses</div>
                                <div className={styles.idadi}>{perfomers.departmentCounts.nurses}</div>
                            </div>
                        </div>
                    }
                </div>
                {
                    perfLoading
                        ? <div className={styles.loader}>
                            <FaSpinner className={styles.spinner} />
                        </div>
                        : <div className={styles.perfomers}>
                            {
                                perfomers === undefined && (
                                    <div className="error">There is an error</div>
                                )
                            }
                            {
                                perfomers.data.map((item: any, index: number) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        className={styles.top_performer_card}
                                    >
                                        <div className={styles.avatar_container}>
                                            <img
                                                src={item.profile_image || '/placeholder.jpg'}
                                                alt={item.name}
                                                className={styles.avatar}
                                            />
                                            <div className={styles.star_icon}>
                                                <FaStar />
                                            </div>
                                        </div>
                                        <h3>{item.name}</h3>
                                        <p className={styles.category}>{item.role.replace('_', ' ')}</p>
                                        <p className={styles.score}>
                                            Score: {item.score}/100
                                        </p>
                                        <p className={styles.stats}>
                                            Tickets: {item.totalTickets} | Avg. Time: {item.avgProcessingTime}s
                                        </p>
                                    </motion.div>
                                ))
                            }
                        </div>
                }
                <div className={styles.pagination}>
                    {
                        !perfLoading && (
                            <div className={styles.pagination_content}>
                                {
                                    Array.from({ length: perfomers.pagination.totalPages }, (_, i) => i + 1).map((item:any,index:number)=> (
                                        <div className={cx(styles.page,index+1 ===fields.page && styles.active)} onClick={()=> setFields({...fields,page: index+1})}>{index+1}</div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Attends
