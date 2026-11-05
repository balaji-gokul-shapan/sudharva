"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import StepperForm from "@/components/registration/StepperForm";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [identifier, setIdentifier] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 850);

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {!isAuthenticated && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -32, scale: 0.97, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <RegisterForm
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              setIdentifier={setIdentifier}
              identifier={identifier}
            />
          </motion.div>
        )}
        {isAuthenticated && (
          <motion.div
            key="redirect-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-surface/75"
          >
            <motion.p
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.38, delay: 0.08 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background/90 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Redirecting to Login
            </motion.p>
          </motion.div>
        )}
        {/* {isAuthenticated && (
          <motion.div
            key="register-stepper"
            initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-success"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Signed in - complete your registration
            </motion.p>
            <StepperForm
              identifier={identifier}
              setIdentifier={setIdentifier}
            />
          </motion.div>
        )} */}
      </AnimatePresence>
    </div>
  );
};

export default Index;
