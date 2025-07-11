'use client'
import React from 'react'
import styles from './layout.module.scss'
import { TbMenuDeep } from "react-icons/tb";
import { IoPowerSharp } from 'react-icons/io5';
import Link from 'next/link';
import { MdDashboard } from 'react-icons/md';
import {usePathname} from 'next/navigation'
import cx from 'classnames'
import { FaUsers } from 'react-icons/fa';
import useMenuStore from '@/store/atoms/isMenu';

function LayoutComponent({children}:any) {
 const {isMenu, openMenu,closeMenu} = useMenuStore()
 const router = usePathname()

 function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 17) {
    return "Good afternoon";
  } else if (currentHour < 20) {
    return "Good evening";
  } else {
    return "Good night";
  }
}

  return (
    <div className={styles.layout_component}>
        <div className={styles.wrapper}>
            <div className={cx(styles.menu,isMenu && styles.isMenu)}>
                <div className={styles.menu_header}>
                  <h2>{isMenu ? 'Q' : 'Queue'}</h2>
                </div>
                <ul>
                    <li className={cx(router ==="/" && styles.active)}>
                        <Link href="/" className={styles.menu_link}>
                          <MdDashboard className={styles.icon} size={24}/>
                          {!isMenu && <span>Dashboard</span>}
                        </Link>
                    </li>
                    <li className={cx(router ==="/attends" && styles.active)}>
                        <Link href="/attends" className={styles.menu_link}>
                          <FaUsers className={styles.icon} size={24}/>
                          {!isMenu && <span>Attendants</span>}
                        </Link>
                    </li>
                </ul>
                <div className={styles.menu_footer}>
                  {!isMenu && <p>Queue v1.0</p>}
                </div>
            </div>
            <div className={cx(styles.children,isMenu && styles.isMenu)}>
                <div className={styles.top_menu}>
                    <div className={styles.left}>
                        <button className={styles.menu_toggle} onClick={isMenu?closeMenu:openMenu}>
                            <TbMenuDeep size={24} />
                        </button>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.user_info}>
                            <div className={styles.greeting}>{getGreeting()}</div>
                            <div className={styles.username}>Mamc User</div>
                        </div>
                        <div className={styles.user_avatar} style={{backgroundImage:`url(./placeholder.jpg)`}}></div>
                        <button className={styles.logout_button}>
                            <IoPowerSharp size={20}/>
                        </button>
                    </div>
                </div>
                <div className={styles.children_box}>
                  <div className={styles.content_container}>
                    {children}
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LayoutComponent