import { applyDecorators} from '@nestjs/common';
import { MessagePattern} from '@nestjs/microservices';
import { BrokerRequestTopic } from '../types';

export function ScoMessagePattern( subTopic: BrokerRequestTopic){
    return applyDecorators(MessagePattern(`scox/+/+/+/+/${subTopic}/requests`))
}