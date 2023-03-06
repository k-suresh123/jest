import { Test,TestingModule} from '@nestjs/testing';
import {ScoCompareAndUpdateCart } from './sco-compare-update.service';
import {ScoLoggerService } from 'posless-adapter/modules/sco-logger/service/sco-logger.service';
import { mockScoLoggerService} from 'posless-adapter/modules/sco-logger/service/sco-logger.mock.service'; 
import {ScoLaneStateService } from 'posless-adapter/modules/sco-lane-service/service/sco-lane.state.service';
import {mockScoLaneStateService } from 'posless-adapter/modules/sco-lane-service/service/sco-lane.state.mock.service';
import { ScoCompareAndUpdateItems} from './sco-items-compare-update.service';
import { 
    mockScoCompareAndUpdateCoupons,
    mockScoCompareAndUpdateItems,
    mockScoCompareAndUpdatePayments,
    mockScoCompareAndUpdateRewards,
} from './sco-compare-update.service.mock';
import { ScoCompareAndUpdateCoupons} from './sco-coupons-compare-update.service';
import { ScoCompareAndUpdateRewards} from './sco-rewards-compare-update.service';
import { ScoCompareAndUpdatePayments} from './sco-payments-compare-update.service';
import { CartItemViewData,CartResponse} from '@transport/interface/cart.response';
import { IScoLaneState } from 'modules/sco-lane-state/types';
import  generatePosCartResponse,{
    generatePosCartItemViewData
} from posless-adatper/testing-utiliites/posCartResponseFactory;
import { exampleDefaultLaneState} from 'posless-adapter/testing-utiliites/scoLaneStateFactory';
import { generatePosCartRewardData} from 'posless-adapter/testing-utiliites/posCartResponseFactory';
import { generatePosCartCouponData } from 'posless-adapter/testing-utiliites/posCartResponseFactory';
import { of} from 'rxjs';
import { BrokerResponse } from 'posless-adapter/modules/sco-transport/types';


describe('ScoCompareAndUpdateService',()=>{
   
    let service : ScoCompareAndUpdateCart;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers : [
                ScoCompareAndUpdateCart,
                {
                  provide:ScoLoggerService,
                  useValue:mockScoLoggerService  
                },
                {
                  provide:ScoLaneStateService,
                  useValue:mockScoLaneStateService  
                },
                {
                    provide:ScoCompareAndUpdateItems,
                    useValue:mockScoCompareAndUpdateItems  
                },
                {
                    provide:ScoCompareAndUpdateCoupons,
                    useValue:mockScoCompareAndUpdateCoupons  
                },
                {
                    provide:ScoCompareAndUpdateRewards,
                    useValue:mockScoCompareAndUpdateRewards  
                },
                {
                    provide:ScoCompareAndUpdatePayments,
                    useValue:mockScoCompareAndUpdatePayments  
                  }

            ]
        }).compile();
        service = module.get<ScoCompareAndUpdateCart>(ScoCompareAndUpdateCart);
        jest.clearAllMocks();
});

it('should be defined',async ()=>{
    expect(service).toBeDefined();
});

describe('compareAndUpdateFromCart',()=>{
    let compareAndUPdateItemsSpy: jest.SpyInstance;
    let compareAndUPdateRewardsSpy: jest.SpyInstance;
    let compareAndUPdateCouponsSpy: jest.SpyInstance;
    let compareAndUPdatePaymentsSpy: jest.SpyInstance;

    beforeEach(() =>{
        compareAndUPdateItemsSpy = jest.spyOn(service,'compareAndUpdateItems' as any);
        compareAndUPdateRewardsSpy = jest.spyOn(service,'compareAndUpdateRewards' as any)
        compareAndUPdateCouponsSpy = jest.spyOn(service,'compareAndUpdateCoupons' as any)
        compareAndUPdatePaymentsSpy = jest.spyOn(service,'compareAndUpdatePayments' as any)
    });

    it('should call compareAndUpdateItems to process items fromt the cart',()=>{
        const mockLaneState:IScoLaneState = {
            ...exampleDefaultLaneState,
            items:{},
            rewards:{
                2:{itemId:'2', ...generatePosCartRewardData}
            }
        };
        const mockcartResponse:CartResponse = generatePosCartResponse({
            rewards:[generatePosCartRewardData(),generatePosCartRewardData()],
            coupons:[generatePosCartCouponData(),generatePosCartCouponData()]
        })

        service.compareAndUpdateFromCart(mockLaneState,mockcartResponse);
        expect(compareAndUPdateItemsSpy).toHaveBeenCalledTimes(1);
        expect(compareAndUPdateRewardsSpy).toHaveBeenCalledTimes(1);
        expect(compareAndUPdateCouponsSpy).toHaveBeenCalledTimes(1);
        expect(compareAndUPdatePaymentsSpy).toHaveBeenCalledTimes(1);
    });
});

describe('compareAndUpdateItems',()=>{
    let handleCompareAndUPdateItemsSpy: jest.SpyInstance;
    const mockLaneState:IScoLaneState = {
        ...exampleDefaultLaneState,
        items:{}
    };
    const mockcartResponse:CartItemViewData[] = [{}];
    
    it('will execute the observable,if handleCompareAndUpdate return the observable array',done =>{
         let count = 0;
         handleCompareAndUPdateItemsSpy= jest
         .spyOn(mockScoCompareAndUpdateItems,'handleCompareAndUpdateItems')
         .mockReturnValueOnce([
            of(({} as unknown) as BrokerResponse),
            of(({} as unknown) as BrokerResponse)
         ]);

         service['compareAndUpdateItems'](mockLaneState,mockcartResponse).subscribe({
            next(){
                expect(handleCompareAndUPdateItemsSpy).toHaveBeenCalledTimes(1);
                expect(mockScoLaneStateServicel.set).toHaveBeenCalledTimes(1);
                count = 1;
                done();
            },
            error(err){
                expect(1).toBe(2)
            },
            complete(){
                expect(count).toBe(1);
                done();
            }
         })
    })

    it('will not execute the observable,if handleCompareAndUpdate return the observable array',done =>{
        let count = 0;
        handleCompareAndUPdateItemsSpy = jest
        .spyOn(mockScoCompareAndUpdateItems,'handleCompareAndUpdateItems')
        .mockReturnValueOnce([])

        service['compareAndUpdateItems'](mockLaneState,mockcartResponse).subscribe({
            next(){
                expect(handleCompareAndUPdateItemsSpy).toHaveBeenCalledTimes(1);
                expect(mockScoLaneStateService.set).toHaveBeenCalledTimes(0);
                count =1;
                done();            
            },
            error(err){
                expect(1).toBe(2)
            },
            complete(){
                expect(count).toBe(1);
                done();
            }
        })
    })
})
  
})//desc
