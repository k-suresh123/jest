import { of } from 'rxjs';
import { ScoCompareAndUpdateCart } from './sco-compare-update.service';
import { ScoCompareAndUPdateItems } from './sco-items-compare-update.service';
import { ScoCompareAndUPdateCoupons } from './sco-coupons-compare-update.service';
import { ScoCompareAndUPdatePayments } from './sco-payments-compare-update.service';
import { ScoCompareAndUPdateRewards } from './sco-rewards-compare-update.service;
import { BrokerResponse } from 'posless-adapter/modules/sco-transport/types';


export const mockScoCompareAndUpdateService: Partial<ScoCompareAndUpdateCart> = {
    compareAndUpdateFromCart : jest.fn(() => of(void 0))
}

export const mockScoCompareAndUpdateItems: Partial<ScoCompareAndUPdateItems> = {
    handleCompareAndUpdateItems : jest.fn(() =>[ of(([] as unknown) as BrokerResponse)])
}

export const mockScoCompareAndUpdateCoupons: Partial<ScoCompareAndUPdateCoupons> = {
    handleCompareAndUpdateCoupons : jest.fn(() =>[ of(([] as unknown) as BrokerResponse)])
}

export const mockScoCompareAndUpdateRewards: Partial<ScoCompareAndUPdateRewards> = {
    handleCompareAndUpdateRewards : jest.fn(() =>[ of(([] as unknown) as BrokerResponse)])
}

export const mockScoCompareAndUpdatePayments: Partial<ScoCompareAndUPdatePayments> = {
    handleCompareAndUpdatePayments : jest.fn(() =>[ of(([] as unknown) as BrokerResponse)])
}