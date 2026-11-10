// src/app/(public_gate)/buy-pin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { paymentService } from '@/services/paymentService';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { formatNaira } from '@/utils/formatters';
import { CreditCard, Mail, Phone, CheckCircle, Download, AlertCircle } from 'lucide-react';

const PIN_UNIT_PRICE = 2000;

export default function BuyPinPage() {
  const { branding } = useSchoolTheme();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchasedPins, setPurchasedPins] = useState<Array<{ pin_code: string; serial_number: string }> | null>(null);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  const totalAmount = quantity * PIN_UNIT_PRICE;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');

    if (!reference) return;

    let isMounted = true;
    paymentService
      .verifyPayment(reference)
      .then((res) => {
        if (isMounted) {
          setTransactionRef(reference);
          setPurchasedPins(res.pins);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Payment verification pending or reference invalid.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const initData = await paymentService.initializePinPurchase({
        email: email.trim(),
        phone_number: phone.trim(),
        quantity,
      });

      if (initData.authorization_url) {
        window.location.href = initData.authorization_url;
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Payment gateway connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Image
          src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
          alt={branding.schoolName}
          width={56}
          height={56}
          className="mx-auto h-14 w-14 object-contain"
          unoptimized
        />
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Buy Scratch PIN Online</h2>
        <p className="text-xs text-slate-500">Pay securely via Paystack for instant 12-digit voucher activation</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {purchasedPins ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Payment Confirmed!</h4>
                <p className="text-xs">Your generated scratch PIN details:</p>
              </div>

              <div className="space-y-2">
                {purchasedPins.map((pin, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <p className="text-slate-500">
                      Serial: <span className="font-mono text-slate-800 font-semibold">{pin.serial_number}</span>
                    </p>
                    <p className="text-slate-500">
                      PIN: <span className="font-mono text-primary font-bold text-sm">{pin.pin_code}</span>
                    </p>
                  </div>
                ))}
              </div>

              {transactionRef && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => paymentService.downloadReceiptPdf(transactionRef)}
                >
                  <Download className="w-4 h-4" /> Download Official Receipt
                </Button>
              )}

              <Link href="/check-result">
                <Button className="w-full mt-2">Proceed to Check Result</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="08012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Voucher Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white text-xs"
                >
                  {[1, 2, 3, 5, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} Voucher{num > 1 ? 's' : ''} ({formatNaira(num * PIN_UNIT_PRICE)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center text-xs">
                <span className="text-slate-600">Total Charged:</span>
                <span className="text-sm font-bold text-slate-900">{formatNaira(totalAmount)}</span>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                <CreditCard className="w-4 h-4" /> Pay {formatNaira(totalAmount)} with Paystack
              </Button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-3 text-center">
            <Link href="/check-result" className="text-xs text-slate-500 hover:text-slate-800">
              ← Return to Result Verification Gate
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}