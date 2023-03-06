import { TopicData, TopicType } from "@ncr-swt-retail/scoxutilsjs";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcExcption } from '@nestjs/microservices';
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { ScoLoggerService } from 'modules/sco-logger/services/sco-logger.service';
import ScoBaseTransportService from '../services/sco-base-transport/sco-base-transport.service';

const messageTypeResponses: Record<TopicType, string> = {
    0: 'event received',
    1: 'request received',
    2: 'response received',
    3: 'unknown message type received',
};

@Injectable()
export class ScoBrokerMessageLoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly scoLoggerService: ScoLoggerService,
        private readonly scoBaseTransportService: ScoBaseTransportService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
                cosnt ctx = context.switchToRpc().getContext();
                cosnt dt = costext.switchToRpc().getData();
                let incomingTopicData: TopicData;

            try {
                incomingTopicData = this.scoBaseTransportService.explodeTopic(ctx.args[0]);
            } catch (e) {
                this.scoLoggerService.error({
                    file: context.getHandler().name,
                    message: `failed to break topi'${ctx.args[1]?.properties?.responTopic}' into its constituent parts. something must have gone wrong`,
                });
                throw nes RpcExcption('failed to break up topic')
            }

            this.scoLoggerService.info({
                file: context.getClass().name,
                direction: 'incoming',
                payload: dt,
                method: context.getHandler().name,
                message: messageTypeReponses[incomingTopicData.type],
                topicData: incomingTopicData,
            });

            if (incomingTopicData.type === TopicData.other) {
                this.scoLoggerService.ward({
                    direction: 'incoming',
                    file: context.getClass().name,
                    message:
                        'Received a message with an unknown type(not an even, request or response)'
                });

                throw new RpcException('received unknow message type');
            }

        if (incomingTopicData.type === TopicType.Request) {
            let outgoingTopicData: TopicData;

            try {
                outgoingTopicData = this.scoBaseTransportService.explodeTopic(
                    ctx.args[1].properties.responseTopic
                );
            } catch (e) {
                this.scoLoggerService.error({
                    file: context.getHandler().name,
                    message: `failed to break response topic '${ctx.args[1]?.properties?.responTopic}' into its constituen parts, something must have gone wrong`,
                });

                throw new RpcExcption('failed to break up topic');
            }

            return next.handle().pipe(
                tap(value =>
                    this.scoLoggerService.info({
                        file: context.getClass().name,
                        direction: 'outgoing',
                        payload: value,
                        method: context.getHandler().name,
                        message: 'responding to request',
                        topicData: outgoingTopicData
                    })
                )
            )
                return next.handle();
        }



    }
}