"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  CreditCard,
  FileText,
  MapPin,
  Mail,
  Phone,
  SplitSquareHorizontal,
  X
} from "lucide-react";

// ---- Sample payload (you can replace this with live data) ----
const DATA = {
  draft_order: {
    id: 1069920479,
    note: null,
    email: "bob.norman@mail.example.com",
    taxes_included: false,
    currency: "USD",
    invoice_sent_at: null,
    created_at: "2025-07-01T14:30:12-04:00",
    updated_at: "2025-07-01T14:30:12-04:00",
    tax_exempt: false,
    completed_at: null,
    name: "#D3",
    "allow_discount_codes_in_checkout?": false,
    "b2b?": false,
    status: "open",
    line_items: [
      {
        id: 1066630385,
        variant_id: null,
        product_id: null,
        title: "Custom Tee",
        variant_title: null,
        sku: null,
        vendor: null,
        quantity: 2,
        requires_shipping: false,
        taxable: true,
        gift_card: false,
        fulfillment_service: "manual",
        grams: 0,
        tax_lines: [
          {
            rate: 0.06,
            title: "Tax",
            price: "1.80",
          },
        ],
        applied_discount: null,
        name: "Custom Tee",
        properties: [],
        custom: true,
        price: "20.00",
        admin_graphql_api_id: "gid://shopify/DraftOrderLineItem/1066630385",
      },
    ],
    api_client_id: 755357713,
    shipping_address: {
      first_name: null,
      address1: "Chestnut Street 92",
      phone: "555-625-1199",
      city: "Louisville",
      zip: "40202",
      province: "Kentucky",
      country: "United States",
      last_name: null,
      address2: "",
      company: null,
      latitude: null,
      longitude: null,
      name: "",
      country_code: "US",
      province_code: "KY",
    },
    billing_address: {
      first_name: null,
      address1: "Chestnut Street 92",
      phone: "555-625-1199",
      city: "Louisville",
      zip: "40202",
      province: "Kentucky",
      country: "United States",
      last_name: null,
      address2: "",
      company: null,
      latitude: null,
      longitude: null,
      name: "",
      country_code: "US",
      province_code: "KY",
    },
    invoice_url:
      "https://jsmith.myshopify.com/548380009/invoices/fddb533e1f232d8d82b3cd87f855114e",
    created_on_api_version_handle: "unstable",
    applied_discount: {
      description: "Custom discount",
      value: "10.0",
      title: "Custom",
      amount: "10.00",
      value_type: "fixed_amount",
    },
    order_id: null,
    shipping_line: null,
    tax_lines: [
      {
        rate: 0.06,
        title: "Tax",
        price: "1.80",
      },
    ],
    tags: "",
    note_attributes: [],
    total_price: "31.80",
    subtotal_price: "30.00",
    total_tax: "1.80",
    payment_terms: null,
    presentment_currency: "USD",
    total_line_items_price_set: {
      shop_money: { amount: "40.00", currency_code: "USD" },
      presentment_money: { amount: "40.00", currency_code: "USD" },
    },
    total_price_set: {
      shop_money: { amount: "31.80", currency_code: "USD" },
      presentment_money: { amount: "31.80", currency_code: "USD" },
    },
    subtotal_price_set: {
      shop_money: { amount: "30.00", currency_code: "USD" },
      presentment_money: { amount: "30.00", currency_code: "USD" },
    },
    total_tax_set: {
      shop_money: { amount: "1.80", currency_code: "USD" },
      presentment_money: { amount: "1.80", currency_code: "USD" },
    },
    total_discounts_set: {
      shop_money: { amount: "10.00", currency_code: "USD" },
      presentment_money: { amount: "10.00", currency_code: "USD" },
    },
    total_shipping_price_set: {
      shop_money: { amount: "0.00", currency_code: "USD" },
      presentment_money: { amount: "0.00", currency_code: "USD" },
    },
    total_additional_fees_set: null,
    total_duties_set: null,
    amount_due_now_set: {
      shop_money: { amount: "31.80", currency_code: "USD" },
      presentment_money: { amount: "31.80", currency_code: "USD" },
    },
    amount_due_later_set: {
      shop_money: { amount: "0.00", currency_code: "USD" },
      presentment_money: { amount: "0.00", currency_code: "USD" },
    },
    admin_graphql_api_id: "gid://shopify/DraftOrder/1069920479",
    customer: {
      id: 207119551,
      email: "bob.norman@mail.example.com",
      created_at: "2025-07-01T14:28:21-04:00",
      updated_at: "2025-07-01T14:28:21-04:00",
      first_name: "Bob",
      last_name: "Norman",
      orders_count: 1,
      state: "disabled",
      total_spent: "199.65",
      last_order_id: 450789469,
      note: null,
      verified_email: true,
      multipass_identifier: null,
      tax_exempt: false,
      tags: "Léon, Noël",
      last_order_name: "#1001",
      currency: "USD",
      phone: "+16136120707",
      tax_exemptions: [],
      email_marketing_consent: {
        state: "not_subscribed",
        opt_in_level: null,
        consent_updated_at: "2004-06-13T11:57:11-04:00",
      },
      sms_marketing_consent: {
        state: "not_subscribed",
        opt_in_level: "single_opt_in",
        consent_updated_at: "2024-01-01T07:00:00-05:00",
        consent_collected_from: "OTHER",
      },
      admin_graphql_api_id: "gid://shopify/Customer/207119551",
      default_address: {
        id: 207119551,
        customer_id: 207119551,
        first_name: null,
        last_name: null,
        company: null,
        address1: "Chestnut Street 92",
        address2: "",
        city: "Louisville",
        province: "Kentucky",
        country: "United States",
        zip: "40202",
        phone: "555-625-1199",
        name: "",
        province_code: "KY",
        country_code: "US",
        country_name: "United States",
        default: true,
      },
    },
  },
} as const;

// ---- Utils ----
const fmtMoney = (num: number | string, currency = "USD") => {
  const n = typeof num === "string" ? Number(num) : num;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
};

function Address({ title, addr }: { title: string; addr?: any }) {
  if (!addr) return null;
  const lines = [addr.address1, addr.address2].filter(Boolean).join(", ");
  return (
    <div className="rounded-xl border border-gray-700/60 bg-gradient-to-br from-gray-800 to-gray-900 p-4 space-y-2">
      <div className="flex items-center gap-2 text-yellow-400 font-semibold">
        <MapPin className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <div className="text-sm text-gray-200">{lines}</div>
      <div className="text-sm text-gray-400">
        {[addr.city, addr.province, addr.zip].filter(Boolean).join(", ")} {addr.country ? `• ${addr.country}` : ""}
      </div>
      {addr.phone && (
        <div className="text-sm text-gray-300 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {addr.phone}
        </div>
      )}
    </div>
  );
}

function LineItems({ items, currency }: { items: any[]; currency: string }) {
  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700/60">
        <div className="col-span-6">Item</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-2 text-right">Total</div>
      </div>
      {items.map((li) => {
        const price = Number(li.price || 0);
        const qty = Number(li.quantity || 0);
        const total = price * qty;
        return (
          <div key={li.id} className="grid grid-cols-12 px-4 py-4 border-b border-gray-800/60">
            <div className="col-span-6 flex flex-col">
              <span className="text-sm font-semibold text-white">{li.title}</span>
              {li.variant_title && (
                <span className="text-xs text-gray-400">{li.variant_title}</span>
              )}
              {li.custom && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 mt-1">
                  <BadgePercent className="w-3 h-3" /> Custom Item
                </span>
              )}
            </div>
            <div className="col-span-2 text-right text-sm text-gray-200">
              {fmtMoney(price, currency)}
            </div>
            <div className="col-span-2 text-right text-sm text-gray-200">{qty}</div>
            <div className="col-span-2 text-right text-sm font-semibold text-white">
              {fmtMoney(total, currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Totals({ d }: { d: any }) {
  const currency = d.currency || d.presentment_currency || "USD";
  const discount = d.total_discounts_set?.shop_money?.amount || 0;
  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-br from-gray-800 to-gray-900 p-4 space-y-3">
      <div className="flex justify-between text-sm text-gray-300">
        <span>Subtotal</span>
        <span className="font-medium text-white">{fmtMoney(d.subtotal_price || 0, currency)}</span>
      </div>
      {Number(discount) > 0 && (
        <div className="flex justify-between text-sm text-emerald-300">
          <span className="inline-flex items-center gap-1">
            <BadgePercent className="w-4 h-4" />
            Discount
          </span>
          <span>-{fmtMoney(discount, currency)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm text-gray-300">
        <span>Tax</span>
        <span className="font-medium text-white">{fmtMoney(d.total_tax || 0, currency)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-300">
        <span>Shipping</span>
        <span className="font-medium text-white">
          {fmtMoney(d.total_shipping_price_set?.shop_money?.amount || 0, currency)}
        </span>
      </div>
      <div className="border-t border-gray-700/60 pt-3 flex justify-between text-base">
        <span className="text-gray-200 font-semibold">Total</span>
        <span className="text-yellow-400 font-bold">{fmtMoney(d.total_price || 0, currency)}</span>
      </div>
    </div>
  );
}

// ---------- Split Bill Modal ----------
function SplitBillModal({
  open,
  onClose,
  total,
  currency,
  items,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  currency: string;
  items: { id: number | string; title: string; price: number; quantity: number }[];
}) {
  const [mode, setMode] = useState<"equal" | "custom" | "byItems">("equal");
  const [people, setPeople] = useState<number>(2);

  // custom rows
  const [rows, setRows] = useState<{ name: string; amount: number }[]>([
    { name: "Payer 1", amount: 0 },
    { name: "Payer 2", amount: 0 },
  ]);

  // by items: matrix [payer][itemId] => qty
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>(() => {
    const base: Record<string, Record<string, number>> = {};
    for (let i = 0; i < people; i++) {
      base[`P${i + 1}`] = Object.fromEntries(items.map((it) => [String(it.id), 0]));
    }
    return base;
  });

  // sync matrix/rows when people count changes
  const ensurePeople = (n: number) => {
    setPeople(n);
    setRows((prev) => {
      const next = [...prev];
      while (next.length < n) next.push({ name: `Payer ${next.length + 1}`, amount: 0 });
      if (next.length > n) next.length = n;
      return next;
    });
    setMatrix((prev) => {
      const next: Record<string, Record<string, number>> = { ...prev };
      const keys = Object.keys(next);
      // add rows
      for (let i = keys.length; i < n; i++) {
        next[`P${i + 1}`] = Object.fromEntries(items.map((it) => [String(it.id), 0]));
      }
      // remove extra
      for (let i = n; i < keys.length; i++) delete next[`P${i + 1}`];
      return next;
    });
  };

  const equalSplit = useMemo(() => total / Math.max(people, 1), [total, people]);

  const customSum = rows.reduce((s, r) => s + (isFinite(r.amount) ? r.amount : 0), 0);
  const customRemaining = total - customSum;

  // compute by-items per payer totals
  const byItemTotals = useMemo(() => {
    const per: Record<string, number> = {};
    Object.entries(matrix).forEach(([payer, m]) => {
      let sum = 0;
      items.forEach((it) => {
        const q = Math.max(0, Math.min(m[String(it.id)] ?? 0, it.quantity));
        sum += q * it.price;
      });
      per[payer] = sum;
    });
    return per;
  }, [matrix, items]);

  const byItemAssignedOk = useMemo(() => {
    // validate each item assigned qty <= ordered
    return items.every((it) => {
      const assigned = Object.values(matrix).reduce((s, m) => s + (m[String(it.id)] || 0), 0);
      return assigned <= it.quantity;
    });
  }, [matrix, items]);

  const equalUI = (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">People</span>
        <input
          type="number"
          min={2}
          max={20}
          value={people}
          onChange={(e) => ensurePeople(Math.max(2, Math.min(20, Number(e.target.value || 0))))}
          className="w-20 rounded-md bg-gray-800 border border-gray-700 px-2 py-1 text-sm text-white"
        />
      </div>
      <div className="rounded-md bg-gray-800/60 border border-gray-700 divide-y divide-gray-700">
        {Array.from({ length: people }, (_, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-200">Payer {i + 1}</span>
            <span className="text-sm font-semibold text-white">{fmtMoney(equalSplit, currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const customUI = (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setRows((r) => [...r, { name: `Payer ${r.length + 1}`, amount: 0 }])}
        className="text-xs rounded-full border border-gray-600 px-3 py-1 text-gray-200 hover:bg-gray-800"
      >
        + Add payer
      </button>
      <div className="rounded-md bg-gray-800/60 border border-gray-700 divide-y divide-gray-700">
        {rows.map((r, idx) => (
          <div key={idx} className="flex items-center justify-between px-3 py-2 gap-3">
            <input
              value={r.name}
              onChange={(e) => setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
              className="flex-1 rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-sm text-white"
            />
            <input
              type="number"
              min={0}
              step={0.01}
              value={r.amount}
              onChange={(e) =>
                setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, amount: Number(e.target.value || 0) } : x)))
              }
              className="w-32 rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-sm text-right text-white"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">Remaining</span>
        <span className={`font-semibold ${customRemaining === 0 ? "text-emerald-400" : customRemaining < 0 ? "text-red-400" : "text-yellow-400"}`}>
          {fmtMoney(customRemaining, currency)}
        </span>
      </div>
    </div>
  );

  const byItemsUI = (
    <div className="space-y-4">
      <div className="text-xs text-gray-400">Assign quantities to each payer per item. (Unassigned quantity remains unpaid.)</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="py-2 pr-4">Payer</th>
              {items.map((it) => (
                <th key={it.id} className="py-2 px-2 whitespace-nowrap">{it.title} (x{it.quantity})</th>
              ))}
              <th className="py-2 pl-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: people }, (_, i) => `P${i + 1}`).map((pid) => (
              <tr key={pid} className="border-t border-gray-800">
                <td className="py-2 pr-4">
                  <input
                    className="rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-xs text-white"
                    value={pid}
                    onChange={() => {}}
                    readOnly
                  />
                </td>
                {items.map((it) => (
                  <td key={it.id} className="py-2 px-2">
                    <input
                      type="number"
                      min={0}
                      max={it.quantity}
                      value={matrix[pid]?.[String(it.id)] ?? 0}
                      onChange={(e) =>
                        setMatrix((prev) => ({
                          ...prev,
                          [pid]: { ...prev[pid], [String(it.id)]: Math.max(0, Math.min(Number(e.target.value || 0), it.quantity)) },
                        }))
                      }
                      className="w-20 rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-xs text-white"
                    />
                  </td>
                ))}
                <td className="py-2 pl-4 text-right text-white font-semibold">
                  {fmtMoney(byItemTotals[pid] || 0, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!byItemAssignedOk && (
        <div className="text-xs text-red-400">Assigned quantities exceed ordered quantity for at least one item.</div>
      )}
    </div>
  );

  const renderBody = () => {
    switch (mode) {
      case "equal":
        return equalUI;
      case "custom":
        return customUI;
      case "byItems":
        return byItemsUI;
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    if (mode === "equal") {
      const payload = Array.from({ length: people }, (_, i) => ({ name: `Payer ${i + 1}`, amount: Number((equalSplit).toFixed(2)) }))
      console.groupCollapsed("✅ Split Bill — Equal");
      console.log({ total, currency, people, shares: payload });
      console.groupEnd();
    } else if (mode === "custom") {
      console.groupCollapsed("✅ Split Bill — Custom Amounts");
      console.log({ total, currency, rows, remaining: Number(customRemaining.toFixed(2)) });
      console.groupEnd();
    } else {
      console.groupCollapsed("✅ Split Bill — By Items");
      console.log({ total, currency, matrix, perPayerTotals: byItemTotals });
      console.groupEnd();
    }
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-black shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2 text-yellow-400 font-semibold">
            <SplitSquareHorizontal className="w-5 h-5" />
            Split Bill
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10">
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "equal", label: "Equal" },
              { key: "custom", label: "Custom Amounts" },
              { key: "byItems", label: "By Items" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setMode(opt.key as any)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  mode === opt.key
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "border-gray-600 text-gray-200 hover:bg-gray-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {renderBody()}
        </div>

        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-300">Total: <span className="font-semibold text-white">{fmtMoney(total, currency)}</span></div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-600 text-gray-200 hover:bg-gray-800">Cancel</button>
            <button onClick={handleConfirm} className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-600">Confirm Split</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const d = DATA.draft_order;
  const currency = d.currency || d.presentment_currency || "USD";
  const created = useMemo(() => new Date(d.created_at).toLocaleString(), [d.created_at]);

  const total = Number(d.total_price || 0);
  const items = d.line_items.map((li) => ({ id: li.id, title: li.title, price: Number(li.price || 0), quantity: Number(li.quantity || 0) }));

  // split bill UI state
  const [splitOpen, setSplitOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Checkout</h1>
            <p className="text-sm text-gray-400 mt-1">
              Draft {d.name} • Created {created}
            </p>
          </div>
          <a
            href={d.invoice_url}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400 px-4 py-2 text-yellow-400 hover:bg-yellow-400/10"
          >
            <FileText className="w-4 h-4" /> View Invoice
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Customer + Addresses */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-br from-gray-800 to-gray-900 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-white font-semibold text-lg">Customer</div>
                  <div className="text-sm text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {d.email}
                  </div>
                  {d.customer?.phone && (
                    <div className="text-sm text-gray-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {d.customer.phone}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>
                    Currency: <span className="text-gray-200 font-medium">{currency}</span>
                  </div>
                  <div>
                    Status: <span className="text-yellow-400 font-medium capitalize">{d.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Address title="Shipping Address" addr={d.shipping_address} />
              <Address title="Billing Address" addr={d.billing_address} />
            </div>

            <div>
              <div className="mb-3 text-white font-semibold text-lg">Order Items</div>
              <LineItems items={d.line_items} currency={currency} />
            </div>
          </div>

          {/* Right: Summary + Pay */}
          <div className="space-y-6">
            {!!d.applied_discount && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4">
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <BadgePercent className="w-4 h-4" /> Discount Applied
                </div>
                <div className="mt-2 text-sm text-emerald-200">
                  {d.applied_discount.title}: {d.applied_discount.description} (
                  {d.applied_discount.value_type === "fixed_amount"
                    ? fmtMoney(d.applied_discount.amount, currency)
                    : `${d.applied_discount.value}%`}
                  )
                </div>
              </div>
            )}

            <Totals d={d} />

            {/* Split bill control (COD removed) */}
            <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-br from-gray-800 to-gray-900 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Payment Options</div>
                  <p className="text-xs text-gray-400">Split among friends or pay in full.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSplitOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-400/70 px-4 py-2 text-blue-300 hover:bg-blue-500/10"
                >
                  <SplitSquareHorizontal className="w-4 h-4" /> Split Bill
                </button>
              </div>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-semibold text-black shadow-yellow-500/30 hover:shadow-lg hover:from-yellow-600 hover:to-yellow-700"
              onClick={() => {
                // Here you would kick off your payment flow
                console.groupCollapsed("✅ Pay Now clicked");
                console.log({
                  draftId: d.id,
                  name: d.name,
                  total: d.total_price,
                  currency,
                  email: d.email,
                  customerId: d.customer?.id,
                  lineItems: d.line_items.map((li: any) => ({ id: li.id, title: li.title, qty: li.quantity, price: li.price })),
                });
                console.groupEnd();
              }}
            >
              <CreditCard className="w-5 h-5" /> Pay {fmtMoney(d.amount_due_now_set?.shop_money?.amount || d.total_price, currency)}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Modal */}
      <SplitBillModal open={splitOpen} onClose={() => setSplitOpen(false)} total={total} currency={currency} items={items} />
    </div>
  );
}
