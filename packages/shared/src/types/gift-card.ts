export interface GiftCard {
  id: string;
  code: string;
  amount: number; // cents
  balance: number; // cents
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface GiftCardPurchaseRequest {
  amount: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
}
