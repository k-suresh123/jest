import { Injectable } from "@nestjs/common";
import { CartCouponData } from '@transaction/interfaces/cart.response';
import { Observable } from 'rxjs';
import {ScoItemsMappingService } from 'posless-adapter/modules/sco-bff-mapping/services/sco-items-mapping/sco-items-mapping.service'
import ScoPriceMappingService  from 'posless-adapter/modules/sco-bff-mapping/services/sco-pirce-mapping/sco-price-mapping.service'
import { ScoCartsTopicService} from 'posless-adapter/modules/sco-broker-api/sco-topic-services/sco-carts-topic/sco-carts-topic.service'; 
import { IScoLaneState, ScoCoupon } from "modules/sco-lane-state/types";
import {ScoLoggerService } from  'posless-adapter/modules/sco-logger/services/sco-logger.service';
import { BrokerResponse} from 'posless-adapter/modules/sco-transport/types';

@Injectable()
export abstract class ScoCompareAndUPdateCoupons{
    constructor(
        protected readonly scoLoggerService:ScoLoggerService,
        protected readonly scoCartsTopicService:ScoCartsTopicService,
        protected readonly scoItemMappingService:ScoItemsMappingService,
        protected readonly scoPriceMappingServie:ScoPriceMappingService
    ){}

abstract handleCompareAndUupdateCoupons(
    scoLaneState:IScoLaneState,
    cartCoupons:CartCouponData[],
    couponsSnapshot:Record<string,ScoCoupon>
):Array<Observable<BrokerResponse>>

protected abstract addCoupon(
    scoLaneState:IScoLaneState,
    coupons:CartCouponData,
    couponsSnapshot:Record<string,ScoCoupon>,
    scoCouponList:Array<Observable<BrokerResponse>>
):void;

protected abstract updateCoupon(
    scoLaneState:IScoLaneState,
    coupons:CartCouponData,
    couponsSnapshot:Record<string,ScoCoupon>,
    scoCouponList:Array<Observable<BrokerResponse>>
):void;

protected abstract removeCoupon(
    scoLaneState:IScoLaneState,
    coupons:CartCouponData,
    couponsSnapshot:Record<string,ScoCoupon>,
    scoCouponList:Array<Observable<BrokerResponse>>
):void;






}