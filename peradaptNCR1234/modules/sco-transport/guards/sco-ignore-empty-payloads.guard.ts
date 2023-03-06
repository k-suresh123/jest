import {Injectable,CanActivate,ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ScoRpcEmptyPayloadOnGuardedException } from 'ScoRpcException';

@Injectable()
export class  EmptyPayloadGuard  implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
       if(context.switchToRpc().getData() !== ''){
             return true;
       } 
       
       throw new ScoRpcEmptyPayloadOnGuardedException();
    }
}