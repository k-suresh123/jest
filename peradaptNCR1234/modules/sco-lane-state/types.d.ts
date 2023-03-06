
export type ScoCoupon = CartCouponData & { itemId: string}

export type ScoReward = CartRewardData & { itemId : string}

export type ScoPayment = CartPaymentData & { itemId: string}

export type ScoItemview = CartItemViewData & { itemId: string}

export interface IScoLaneState{
    topicData:TopicData;
    baseTopic:string;
    timedOut:boolean;
    totals:MediaSessionActionDetails;
    items:Record<string,ScoItemview>;
    cartStatus:'open'| 'tender'|'finalized'|'totals'|undefined;
    scoState: ScoState | undefined;
    transactionId: string| undefined;
    sessionId: string|undefined;
    storeId : string|undefined;
    tillId: string;
    touchpointGroupId:string;
    loggedInUser: string |undefined;
    userPassword: string | undefined;
    loggedInToken:string | undefined;
    isPinPadAvailable :boolean;
    lastPrintReceiptIds:string[];
    transactionHasReceipt: boolean;
    epsTransactionIds:Record<string,string>;
    epsSessionId:string;
    cardData:EpsCardDetails|undefined;
    cartInterventions:Record<string,LaneStateInterventionData>;
    pendingStateChange:ScoPendingStateChange;
    scoDepartmentList:ScoDeparment[];
    payments?:Record<string,ScoPayment>;
    rewards?:Record<string,ScoReward>;
    coupons?:Record<string,ScoCoupon>;
    scoModes:IScoModes;
    operatorId?: string;
    eod:eodConfig;
    validTenders: Map<string,SellableTenders>;
    tendersReferences:Map<string,string>;
    serviceConfig:ScoConfig.Service | undefined;
    cachedServiceConfig: ScoConfig.Service | undefined;
    iam: ScoIAM | undefined ;
    tenderEligilbitiesAmounts: Map<string,number>;
    pendingGetCardDetails:boolean;
}