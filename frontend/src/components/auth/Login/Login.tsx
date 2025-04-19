'use client'

import React from 'react'
import styles from './Login.module.css'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from './LoginForm'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const Login = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.title}>SiteCraft</CardTitle>
          <CardDescription className={styles.description}>
            Create and manage your online store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className={styles.footer}>
          <div>
            By continuing, you agree to our{" "}
            <a href="#" className={styles.link}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" className={styles.link}>Privacy Policy</a>.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
