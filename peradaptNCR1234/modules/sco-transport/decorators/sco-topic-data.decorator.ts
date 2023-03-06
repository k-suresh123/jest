import { TopicData,TopicType} from "@ncr--swt--retail/scoxutils-js";
import { createParamDecorator,ExecutionContext} from '@nestjs/common';
import { MqttContext} from '@nestjs/microservices';
 
export const ScoTopicData =  createParamDecorator<string, ExecutionContext, TopicData>(
    (data: string, ctx:ExecutionContext) => {
        const mqttCtx : MqttContext = ctx.getArgByIndex(1);
        const topic =  mqttCtx.getTopic();

        const parts = topic.split('/');
        const retailer =  parts[2];
        const store = parts[3];
        const endpoint = parts[4];
        const version = parts[1];
        const domains  = parts.slice(5,parts.length - 2).map(domain => domain);

        let type = TopicType.Response ;
        let requestID = '';

        if(parts[parts.length - 1] === 'request'){
            type = TopicData.Request;
        }

        if(parts[parts.length - 1] === 'event'){
          type = TopicData.Event;
        }

        if(type === TopicType.Response){
            requestID = parts[parts.length - 1]
        }

        return {
            retailer,
            store,
            endpoint,
            domains,
            requestID,
            topic,
            type,
            version
        };
    },
)
