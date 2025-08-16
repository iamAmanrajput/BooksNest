import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {
  AlertCircle,
  CreditCard,
  IndianRupee,
  CreditCardIcon,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const PayFine = ({ amount, clearFineHandler }) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handlePayFine = async () => {
    setLoading(true);
    try {
      if (!amount || amount <= 0) {
        toast.error("Invalid payment amount");
        setLoading(false);
        return;
      }

      // 1. Create Order from Backend
      const orderRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/generate-payment`,
        { amount },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!orderRes?.data?.success || !orderRes?.data?.data) {
        toast.error(orderRes?.data?.message || "Order creation failed");
        setLoading(false);
        return;
      }

      const orderData = orderRes.data.data;

      // 2. Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nexlib Library",
        description: "Fine Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );

            if (verifyRes?.data?.success) {
              toast.success(verifyRes.data.message || "Payment Successful");
              clearFineHandler();
            } else {
              toast.error(
                verifyRes?.data?.message || "Payment Verification Failed"
              );
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error(
              error?.response?.data?.message || "Verification Failed"
            );
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || "Guest User",
          email: user?.email || "guest@example.com",
          contact: user?.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment Cancelled");
            setLoading(false);
          },
        },
      };

      // 3. Open Razorpay Payment Modal
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white mt-6 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg w-full">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 sm:items-center items-start justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-zinc-900 dark:text-white text-xl">
                Outstanding Fines
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 text-xs font-semibold">
                Please clear your pending fines
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={amount === 0 ? "default" : "destructive"}
            className="text-sm min-w-[75px] text-center"
          >
            {amount === 0 ? "No Dues" : `₹ ${amount} Total`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4 space-y-6">
        {amount === 0 ? (
          // Agar fine nahi hai
          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-[#F4F4F5] dark:bg-[#1D1D20] border border-accent/20 text-center">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
              🎉 You have no outstanding fines
            </h3>
            <p className="text-sm text-muted-foreground">
              You have cleared all your pending dues.
            </p>
          </div>
        ) : (
          // Agar fine hai
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-lg bg-[#F4F4F5] dark:bg-[#1D1D20] border border-accent/20">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Pay All Outstanding Fine
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Clear your pending fines with a single payment
                </p>
              </div>

              <div className="text-right flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-1 text-2xl font-bold text-customGray">
                  <IndianRupee className="h-6 w-6" />
                  {amount}
                </div>

                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-foreground"
                  size="lg"
                  onClick={handlePayFine}
                >
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay Fine
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Razorpay & Card Payments Info (sirf tab dikhana jab fine ho) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center sm:text-left text-zinc-600 dark:text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Card Payments Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Secure Payments via Razorpay</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PayFine;
