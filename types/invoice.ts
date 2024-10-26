export interface Invoice {
  id: number;
  status: "Delivering" | "Delivered" | "Canceled";
  totalPrice: number;
  paymentMethodId?: number;
  addressToShipId?: number;
  shipperId: number; // Corrected the shipperId type to number
  myBidDTO: MyBidDTO;
  creationDate: string;
  statusInvoiceDTOs: statusInvoiceDTOs[];
}

export interface MyBidDTO {
  id: number; // Corrected static values to number types
  status: string;
  isDeposit: boolean;
  autoBidPrice: number | null;
  priceLimit: number | null;
  isWinner: boolean | null;
  isRefunded: boolean | null;
  isInvoiced: boolean | null;
  lotId: number;
  yourMaxBidPrice: number | null;
  lotDTO: LotDTO;
}

export interface LotDTO {
  id: number;
  title: string;
  startPrice: number;
  minPrice: number | null;
  currentPrice: number | null;
  finalPriceSold: number | null;
  status: string;
  bidIncrement: number | null;
  deposit: number;
  buyNowPrice: number;
  floorFeePercent: number;
  startTime: string; // Kept date as string for simplicity
  endTime: string;
  actualEndTime: string | null;
  isExtend: boolean;
  haveFinancialProof: boolean;
  lotType: string;
  imageLinkJewelry: string;
  sellerId: number | null;
  staffId: number;
  jewelryId: number;
  auctionId: number;
}

export interface statusInvoiceDTOs {
  id: number;
  status: string;
  imageLink: string;
  currentDate: string;
  invoiceId: number;
}
