import { Injectable } from "@nestjs/common";
import { CartItemViewData } from '@transaction/interfaces/cart.response';
import { Observable } from 'rxjs';
import {ScoItemsMappingService } from 'posless-adapter/modules/sco-bff-mapping/services/sco-items-mapping/sco-items-mapping.service'
import ScoPriceMappingService  from 'posless-adapter/modules/sco-bff-mapping/services/sco-pirce-mapping/sco-price-mapping.service'
import { ScoCartsTopicService} from 'posless-adapter/modules/sco-broker-api/sco-topic-services/sco-carts-topic/sco-carts-topic.service'; 
import { IScoLaneState, ScoCoupon, ScoItemview } from "modules/sco-lane-state/types";
import {ScoLoggerService } from  'posless-adapter/modules/sco-logger/services/sco-logger.service';
import {ScoCartItem } from 'posless-adapter/modules/sco-transaction/services/sco-items/types'
import { BrokerResponse} from 'posless-adapter/modules/sco-transport/types';

@Injectable()
export abstract class ScoCompareAndUPdateItems{
    constructor(
        protected readonly scoLoggerService:ScoLoggerService,
        protected readonly scoCartsTopicService:ScoCartsTopicService,
        protected readonly scoItemMappingService:ScoItemsMappingService,
        protected readonly scoPriceMappingServie:ScoPriceMappingService
    ){}

abstract handleCompareAndUupdateItems(
    scoLaneState:IScoLaneState,
    cartItems:CartItemViewData[],
    couponsSnapshot:Record<string,ScoCoupon>
):Array<Observable<BrokerResponse>>

protected abstract addItem(
    scoLaneState:IScoLaneState,
    cartItems:CartItemViewData[],
    itemsSnapshot:Record<string,ScoItemview>,
    scoItemList:Array<Observable<BrokerResponse>>
):void;

protected abstract updateItem(
    scoLaneState:IScoLaneState,
    cartItems:CartItemViewData[],
    itemsSnapshot:Record<string,ScoItemview>,
    scoItemList:Array<Observable<BrokerResponse>>
):void;

protected abstract removeItem(
    scoLaneState:IScoLaneState,
    cartItems:CartItemViewData[],
    itemsSnapshot:Record<string,ScoItemview>,
    scoItemList:Array<Observable<BrokerResponse>>
):void;

protected compareItems(newItem:CartItemViewData,oldItem:ScoItemview):Partial<ScoCartItem>{
  const updateScoItem:Partial<ScoCartItem> = {};

  const newQuantity:number = newItem.lineItem?.quantity?.value;
  if(newQuantity !== oldItem.lineItem?.quantity?.value){
     updateScoItem.isChangeQuantity =true;
     updateScoItem.quantity = newQuantity;
  }

  const newPrice :number = newItem.price?.unitPrice;
  if(newPrice !== oldItem.price?.unitPrice){
    updateScoItem.isChangePirce = true;
    updateScoItem.price = this.scoPriceMappingServie.mapBffPriceToScoPrice(newPrice)
  }

  if(newItem.extendedAmount !== oldItem.extendedAmount){
    updateScoItem.extendedPirce = this.scoPriceMappingServie.mapBffPriceToScoPrice(
        newItem.extendedAmount
    )

  }

  this.scoLoggerService.debug('updateScoItems',JSON.stringify(updateScoItem))
  return updateScoItem;
}




}