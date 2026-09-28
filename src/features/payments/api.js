import {
  addPayment as apiAddPayment,
  listInvoices as apiListInvoices,
  markPaymentPaid as apiMarkPaymentPaid,
} from "@/src/lib/api";

export async function listInvoices() {
  return apiListInvoices();
}

export async function addPayment(input) {
  return apiAddPayment(input);
}

export async function markPaymentPaid(id) {
  return apiMarkPaymentPaid(id);
}
