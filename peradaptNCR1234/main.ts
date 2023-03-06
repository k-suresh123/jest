import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/core";
import { ServerMqtt } from './modules/sco-transport/sco-broker-server';
import {AppModule } from './app.module'

async function bootstrap(){
    const config: ScoConfig.Config = await memorizedGetScoConfig();

    const clientOptions = getScoBrokerClientOptions();

    await bootstrapMqttClient(ServiceConfig.BROKER_OPTIONS.qos as QualityOfService, clientOptions);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
        startegy:new ServerMqtt({
            ...clientOptions,
            serilizer:new OutboundResponseIdentitySerialzer(),
        })
    })

    app.useGlobalInterceptors(
        new ScoBrokerMessageLoggingInterceptor(
            app.get(ScoLoggerService),
            app.get(ScoBaseTrnasportService)
        ),
        new ScoBrokerUnhandledRequestInterceptor(
            app.get(ScoLoggerService),
            app.get(ScoBaseTrnasportService)    
        ),
        new ScoRolesInterceptor(
            app.get(ScoLoggerService),
            app.get(ScoBaseTrnasportService),
            app.get(ScoLaneStateService),
            app.get(ScoRolesGuardService)
        )
    );

  app.useGlobalPipes(new ScoEmptyPayloadCleaner());

  app.useGlobalFilters(
    new ScoBrokerMessageExceptionFilter(
        app.get(ScoLoggerService),
        app.get(ScoBaseTrnasportService)    
    )
  )

  app.listen();


}