import { ResponseResult} from '@ncr-swt-retail/scoutils';
import { RpcException} from '@nestjs/microservices';

export type ScoExceptionType = 
| 'ApiFailure'
|'AuthenticationFailure'
| 'EmptyPayloadOnGuardRoute'
| 'InternalError'
|'InvalidParam'
|'NotFound'
|'Unhandled';

export class ScoRpcEmptyPayloadOnGuardedException extends ScoRpcException{
    constructor(){
        super('EmptyPayloadOnGuardedRoute');
    }
}