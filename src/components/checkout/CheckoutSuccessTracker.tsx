"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  buildCheckoutTrackingBase,
  trackCheckoutEvent,
} from "@/lib/checkout-tracking";

export default function CheckoutSuccessTracker() {
  const searchParams = useSearchParams();
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackCheckoutEvent(
      "payment_success",
      buildCheckoutTrackingBase(searchParams, null),
    );
  }, [searchParams]);

  return null;
}
