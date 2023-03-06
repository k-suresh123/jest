import { applyDecorators} from '@nestjs/common';
import { EventPattern} from '@nestjs/microservices';
import { BrokerEventTopic } from '../types';

export function ScoEventPattern( subTopic: BrokerEventTopic){
    return applyDecorators(EventPattern(`scox/+/+/+/+/${subTopic}/events`))
}