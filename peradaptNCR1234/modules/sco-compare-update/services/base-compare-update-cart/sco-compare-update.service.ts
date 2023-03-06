import { Injectable } from '@nestjs/common';
import {
    IScoLaneState,
    ScoCoupon,
    ScoItemview,
    ScoPayment,
    ScoReward
} from '../../../sco-lane-state/types';
import {
    CartCouponData,
    CartItemViewData,
    CartPaymentData,
    CartResponse,
    CartRewardData
} from '@transaction/interface/cart.response';
import { ScoEnterTenderParams } from 'posless-adatpter/controllers/types';
import { Observable, catchError, concat, forkJoin, map, of, switchMap, tap, toArray } from 'rxjs';
import { ScoLaneStateService } from 'posless-adapter/modules/sco-lane-state/Services/sco-lane-state.service';
import { ScoLoggerService } from 'posless-adapter/modules/sco-lane-state/Services/sco-logger.service';
import { ScoCompareAndUpdateCoupons } from './sco-coupons-compare-update.service';
import { ScoCompareAndUpdateItems } from './sco-items-compare-update.service';
import { ScoCompareAndUpdateRewards } from './sco-rewards-compare-update.service';
import { ScoCompareAndUpdatePayments } from './sco-payments-compare-update.service';
import { ScoRpcInternalErrorException } from 'posless-adapter/ScoRpcException';

@Injectable()
export class ScoCompareAndUpdateCart {
    constructor(
        protected readonly scoLoggerServcie: ScoLoggerService,
        protected readonly scoLaneStateService: ScoLaneStateService,
        protected readonly compareCartItems: ScoCompareAndUpdateItems,
        protected readonly compareCartRewards: ScoCompareAndUpdateRewards,
        protected readonly compareCartCoupons: ScoCompareAndUpdateCoupons,
        protected readonly compareCartPayments: ScoCompareAndUpdatePayments
    ) { }

    public compareAndUpdateFromCart(
        scoLaneState: IScoLaneState,
        cartResponse: CartResponse,
        scoEnterTenderParams?: ScoEnterTenderParams
    ): Observable<void> {
        const updateCart: Array<Observable<void>> = [];

        if (cartResponse.items && cartResponse.items?.length > 0) {
            this.scoLoggerServcie.debug("cart items", cartResponse.items);
            updateCart.push(
                this.compareCartItems(scoLaneState, cartResponse.items).pipe(
                    tap(() => {
                        this.scoLoggerServcie.info('complted items')
                    })
                )
            )


        }
        if (
            Object.keys(scoLaneState.rewards).length > 0 ||
            (cartResponse.rewards && cartResponse.rewards?.length > 0)
        ) {
            this.scoLoggerServcie.debug('cart rewards', cartResponse.rewards);
            updateCart.push(
                this.compareCartRewards(scoLaneState, cartResponse.rewards ?? []).pipe(
                    tap(() => {
                        this.scoLoggerServcie.info('complted rewards')
                    })
                )
            )

        }

        if (
            Object.keys(scoLaneState.coupons).length > 0 ||
            (cartResponse.coupons && cartResponse.coupons?.length > 0)
        ) {
            this.scoLoggerServcie.debug('cart coupons', cartResponse.coupons);
            updateCart.push(
                this.compareCartCoupons(scoLaneState, cartResponse.coupons ?? []).pipe(
                    tap(() => {
                        this.scoLoggerServcie.info('complted coupons')
                    })
                )
            )

        }

        if (cartResponse.payments && cartResponse.payments?.length > 0) {
            this.scoLoggerServcie.debug('cart payments', cartResponse.payments);
            updateCart.push(
                this.compareCartPayments(
                    scoLaneState,
                    cartResponse.payments,
                    scoEnterTenderParams
                ).pipe(
                    tap(() => {
                        this.scoLoggerServcie.info('complted payments')
                    })
                )
            )

        }

        return forkJoin(updateCart).pipe(
            tap(() => {
                this.scoLoggerServcie.info('completed all updates')
            }),
            map(() => void 0),
            catchError(err => {
                this.scoLoggerServcie.error('error in updating cart:', err);
                throw new ScoRpcInternalErrorException(err?.message)
            })
        )
    }

    protected compareAndUpdateItems(
        scoLaneState: IScoLaneState,
        cartItemResponse: CartItemViewData[],
    ): Observable<void> {
        const itemsSnapshot: Record<string, ScoItemView> = { ...scoLaneState.items };
        const scoItemList = this.compareCartItems.handleCompareAndUpdateItems(
            scoLaneState,
            cartItemResponse,
            itemsSnapshot
        );

        if (scoItemList.length) {

              return forkJoin(scoItemList).pipe(
                toArray(),
                switchMap(res => {
                    this.scoLoggerServcie.debug('updating all items',res);
                    scoLaneState.items = itemsSnapshot;
                    return //this.scoLaneStateService.set(scoLaneState.topicData,'items',itemsSnapshot);
                    }),
                    catchError(err => {
                        this.scoLoggerServcie.error('error in updating items:',err)
                        throw new ScoRpcInternalErrorException(err?.message)
                    })

              );
        }
        return of(null);
    }

    protected compareAndUpdateRewards(
        scoLaneState: IScoLaneState,
        cartRewardResponse: CartItemViewData[],
    ): Observable<void> {
        const rewardsSnapshot: Record<string, ScoReward> = { ...scoLaneState.rewards };
        const scoRewardList = this.compareCartItems.handleCompareAndUpdateRewards(
            scoLaneState,
            cartRewardResponse,
            itemsSnapshot
        );

        if (scoRewardList.length) {

              return forkJoin(scoRewardList).pipe(
                toArray(),
                switchMap(res => {
                    this.scoLoggerServcie.debug('updating all rewards',res);
                    scoLaneState.rewards = rewardsSnapshot;
                    return //this.scoLaneStateService.set(scoLaneState.topicData,'rewards',rewardsSnapshot);
                    }),
                    catchError(err => {
                        this.scoLoggerServcie.error('error in updating rewards:',err)
                        throw new ScoRpcInternalErrorException(err?.message)
                    })

              );
        }
        return of(null);
    }

    protected compareAndUpdateCoupons(
        scoLaneState: IScoLaneState,
        cartCouponResponse: CartCouponData[],
    ): Observable<void> {
        const couponsSnapshot: Record<string, ScoReward> = { ...scoLaneState.coupons };
        const scoCouponList = this.compareCartCoupons.handleCompareAndUpdateCoupons(
            scoLaneState,
            cartCouponResponse,
            couponsSnapshot
        );

        if (scoCouponList.length) {

              return forkJoin(scoCouponList).pipe(
                toArray(),
                switchMap(res => {
                    this.scoLoggerServcie.debug('updating all rewards',res);
                    scoLaneState.rewards = couponsSnapshot;
                    return //this.scoLaneStateService.set(scoLaneState.topicData,'coupons',couponsSnapshot);
                    }),
                    catchError(err => {
                        this.scoLoggerServcie.error('error in updating coupons:',err)
                        throw new ScoRpcInternalErrorException(err?.message)
                    })

              );
        }
        return of(null);
    }

    protected compareAndUpdatePayments(
        scoLaneState: IScoLaneState,
        cartPaymentResponse: CartCouponData[],
        scoEnterTenderParams?: ScoEnterTenderParams
    ): Observable<void> {
        const paymentsSnapshot: Record<string, ScoReward> = { ...scoLaneState.payments };
        const epsTransactionIds = {
            ...scoLaneState.epsTransactionIds
        }
        const scoPaymentsList = this.compareCartCoupons.handleCompareAndUpdatePayments(
            scoLaneState,
            cartPaymentResponse,
            paymentsSnapshot,
            epsTransactionIds
            scoEnterTenderParams
        );

        if (scoPaymentsList.length) {

              return forkJoin(scoPaymentsList).pipe(
                toArray(),
                switchMap( () => {
                   
                    scoLaneState.payments = paymentsSnapshot;
                    return //this.scoLaneStateService.set(scoLaneState.topicData,'payments',paymentsSnapshot);
                    }),
                 switchMap(() =>{
                    scoLaneState.epsTransactionIds = epsTransactionIds;
                    return //this.scoLaneStateService.set(
                        scoLaneState.topicData,
                        'epsTransactionIds',
                        epsTransactionIds
                    )
                 })   
                    catchError(err => {
                        this.scoLoggerServcie.error('error in updating paymets:',err)
                        throw new ScoRpcInternalErrorException(err?.message)
                    })

              );
        }
        return of(null);
    }
}