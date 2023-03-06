import { TopicType } from '@ncr-swt-retail/scoutilss-js';
import {Catch,ArgumentsHost,RpcExceptionFilter, Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ScoBrokerClientService } from 'sco-broker-messaging/sco-broker-cliet.service';
import {ScoLoggerService } from 'module/sco-logger/services/sco-logger.service';
import {ScoRpcException, ScoRpcInternalErrorException } from 'ScoRpcException';

@Catch()
export class ScoBrokerMessageExceptionFilter implements RpcExceptionFilter<RpcException>{
   constructor(
    private readonly scoLoggerService: ScoLoggerService,
    private readonly scoBrokerClientService: ScoBrokerClientService
   ){}

   catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
      const ctx = host.switchToRpc().getContext();
      const topic = ctx.args[0];
      
      switch(exception.type){
        case 'EmptyPayloadOnGuardedRoute':{
            this.scoLoggerService.info({
                message: `Empty payload received on ${topic} - ignored due to route guard`
            });
            return;
        }
      }
      default:{

      } 
   }

   const payload = host.switchToRpc().getData();
   const stringfiedPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  
    if(!exception.getError){

        this.ScoLoggerService.warn('faking Rpc Exception');
        const fakeException = new ScoRpcInternalErrorException(exception.message);
        fakeException.stack = exception.stack;
        exception = fakeException;
        

    }





}