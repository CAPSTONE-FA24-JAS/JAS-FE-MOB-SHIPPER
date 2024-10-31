export interface Invoice {
  winnerId: number;
  winnerName: string;
  winnerPhone: string;
  winnerEmail: string;
  lotNumber: any;
  lotId: number;
  productId: number;
  productName: string;
  tax: any;
  note: any;
  addressToShip: any;
  statusInvoiceDTOs: StatusInvoiceDto[];
  id: number;
  status: string;
  totalPrice: number;
  linkBillTransaction: string;
  paymentMethodId: any;
  addressToShipId: any;
  shipperId: number;
  creationDate: string;
  myBidDTO: MyBidDTO;
}

export interface StatusInvoiceDto {
  id: number;
  status: string;
  imageLink: string;
  currentDate: string;
  invoiceId: number;
}

export interface MyBidDTO {
  id: number;
  status: string;
  isDeposit: boolean;
  autoBidPrice: any;
  priceLimit: any;
  isWinner: boolean;
  isRefunded: any;
  isInvoiced: any;
  yourMaxBidPrice: any;
  lotId: number;
  lotDTO: LotDTO;
  historyCustomerLots: HistoryCustomerLot[];
}

export interface HistoryCustomerLot {
  currentTime: string;
  status: string;
  customerLotId: number;
}

export interface LotDTO {
  id: number;
  title: string;
  startPrice: any;
  minPrice: any;
  currentPrice: number;
  finalPriceSold: any;
  status: string;
  bidIncrement: any;
  deposit: number;
  buyNowPrice: number;
  floorFeePercent: number;
  startTime: string;
  endTime: string;
  actualEndTime: any;
  isExtend: boolean;
  haveFinancialProof: boolean;
  lotType: string;
  imageLinkJewelry: string;
  sellerId: any;
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
