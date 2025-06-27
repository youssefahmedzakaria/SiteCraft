"use client";

import React from "react";
import styles from "./Register.module.css";
import { SignupForm } from "./Signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/SiteCraft/ui/card";

export const Register = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.title}>Create an Account</CardTitle>
          <CardDescription className={styles.description}>
            Join SiteCraft and start building your online store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter className={styles.footer}>
          <div>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>
              Log in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
