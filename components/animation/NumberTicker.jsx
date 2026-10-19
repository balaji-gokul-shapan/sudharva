"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

// Split a display value like "10,000+" or "1 Cause" into its numeric part
// and the surrounding text, so the ticker can animate the number while
// rendering prefix/suffix as-is.
function parseDisplayValue(input) {
  if (typeof input === "number" && Number.isFinite(input)) {
    return { numeric: input, prefix: "", suffix: "" }
  }

  const text = String(input ?? "")
  const match = text.match(/-?\d[\d,]*(?:\.\d+)?/)

  if (!match || match.index === undefined) {
    return { numeric: null, prefix: "", suffix: text }
  }

  const numeric = Number(match[0].replace(/,/g, ""))

  if (!Number.isFinite(numeric)) {
    return { numeric: null, prefix: "", suffix: text }
  }

  return {
    numeric,
    prefix: text.slice(0, match.index),
    suffix: text.slice(match.index + match[0].length),
  }
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}) {
  const ref = useRef(null)
  const { numeric: target, prefix, suffix } = parseDisplayValue(value)
  const numericStart = Number(startValue) || 0
  const isNumeric = target !== null

  const motionValue = useMotionValue(
    isNumeric ? (direction === "down" ? target : numericStart) : 0
  )
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    let timer = null

    if (isInView && isNumeric) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? numericStart : target)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, target, direction, numericStart, isNumeric])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))
        }
      }),
    [springValue, decimalPlaces]
  )

  // Non-numeric values (e.g. "1 Cause") can't animate — render as plain text.
  if (!isNumeric) {
    return (
      <span
        className={cn(
          "inline-block tracking-wider tabular-nums",
          className
        )}
        {...props}
      >
        {String(value ?? "")}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-block tracking-wider tabular-nums",
        className
      )}
      {...props}
    >
      {prefix}
      <span ref={ref}>{numericStart}</span>
      {suffix}
    </span>
  )
}
