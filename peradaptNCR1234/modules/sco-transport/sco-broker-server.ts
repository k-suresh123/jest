import { TransportMqtt } from '@ncr-swt-retail/scoutils-js';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import mqttClient from './helpers/mqttClient';
import {
 CustomTransportStrategy,
 IncomingRequest,
 MessageHandler,
 MqttContext,
 MqttOptions,
 PacketId,
 ReadPacket,
 Server,
 Transport,
} from '@nestjs/microservices'
import { channel } from 'diagnostics_channel';
import { buffer } from 'stream/consumers';


export class ServerMqtt extends Server implements CustomTransportStrategy{
   public readonly transportId = Transport.MQTT;
   private transport : TransportMqtt;
   private readonly url:string;

   constructor(private readonly options: MqttOptions['options']){
     super();
     this.url = this.getOptionsProp(options, 'url') || 'localhost';
     this.transport = mqttClient;

     mqttPackage = this.loadPackage('mqtt',ServerMqtt.name,()=>require('mqtt'));

     this.initializeSerializer(options);
     this.initializeDeSerializer(options);

     this.transport.Server = this;

   }

   public async listen(callback:(err?: unknown, ...optionalParams:unknown[]) => void){
       try{
          this.transport.Client = this.createMqttClient();
          this.start(callback)
       }catch(err){
             callback(err)
       }

   }

   public start(callback: (err?: unknown,...optionalParams: unknown[]) => void){
    this.handleError(this.transport.Client);
    this.bindEvents(this.transport.Client)
    
    this.transport.Client.on('connect',()=> callback());

    this.transport.onConnect();
   }

   public bindEvents(client: MqttClient){
    client.on('message',this.getMessageHandler(client).bind(this));
    const registeredPatterns = [ ...this.messageHandlers.keys()];
    registeredPatterns.forEach(pattern => {
        const { isEventHandler } = this.messageHandlers.get(pattern);
        client.subcribe(isEventHandler ? pattern : this.getRequestPattern(pattern));
    })
   }

   public close(){
    this.transport.close();
   }

   public createMqttClient(): MqttClient{
    return mqttPackage.connect(this.url,this.options)
   }

   public getMessageHandler(
     pub: MqttClient,
   ) : (channel : string, buffer:Buffer,originalPacket?: Record<string,any> => Promise<any>{
    return async (channel : string, buffer:Buffer,originalPacket?: Record<string,any>) =>
    this.handleMessage(channel,buffer,pub,originalPacket)
   })

   public async handleMessage(
    channel:string,
    buffer:Buffer,
    pub:MqttClient,
    originalPacket?: Record<string,any> 
   ):Promise<any>{
       const rewPacket = this.parseMessage(buffer.toString());
       const packet = await this.deserializer.deserialize(rawPacket,{channel});
       const mqttContext = new MqttContext([channel,originalPacket]);
       const responseTopic = mqttContext.getPacket().properties?.responseTopic;

       //if response topic created by transport layer, unsubscribe

       if(this.transport.ResponseTopics.indexOf(channel) !== -1){
        this.transport.unsubscribe(channel);
       }

       if(!responseTopic){
        return this.handleEvent(channel,packet,mqttContext)
       }

       const publish = this.getPublisher(pub,responseTopic,responseTopic);
       const handler = this.getHandlerByPatter(channel);

       if(!handler){
        const status = 'error';
        const noHandlerPacket = {
            id:( packet as InComingRequest).id,
            status,
            err: 'There is no matching message handler defined in the remote service'
        };
        return publish(noHandlerPacket);
       }

       const response$ = this.transformToObservable(await handler(packet.data,mqttContext));

       //tslint:disable-next-line:no-unused-expression
       response$ && this.send(response$,publish);
   }

   publish getPublisher(client: MqttClient,pattern:any, id:string):any{
       
       return (response: any) => {
             if(response.err){
                return;
             }
         }

         Object.assign(response,{id});
         const outgoingResponse: Partial<any> = this.serializer.serialize(response);
         if(!outgoingResponse){
            return;
         }
         let options = {};
         options = outgoingResponse.options;
         delete outgoingResponse.on;
         return client.publish(pattern,JSON.stringify(outgoingResponse),{
            ...options,
            properties:{
                userProperties:{
                    source:this.transport.sourceName,
                },
                contentType:'application/json'
            }
         })


   }

   publish parseMessage():ReadPacket & PacketId{
      try{
        return JSON.parse(content);
      }catch(e){
        return content
      }
   }

   public matchMqttPattern(pattern:string,topic:string){
      const patternSegments = pattern.split('/');
      const topicSegments = topic.split('/');

      const patternSegmentsLength = patternSegments.length;
      const topicSegmetsLength = topicSegments.length;
      const lastIndex = patternSegmentsLength - 1;

      for(let i =0;i < patternSegmentsLength;i++){
        const currentPattern = patternSegments[i];
        const patterChar = currentPattern[0];
        const currentTopic = topicSegments[i];

        if(!currentTopic && !currentPattern){
                continue;
        }
          
        if(!currentTopic && currentPattern !== '#'){
            return false;
         }

         if(patterChar === '#'){
            return i === lastIndex;
         }

         if(patterChar !== '+' && currentPattern !== currentTopic){
            return false;
         }
      }
      
      return patternSegmentsLength === topicSegmetsLength

   }

   public getHandlerByPattern(pattern:string):MessageHandler | null {
    const route = this.getRequestPattern(pattern);
    if(this.messageHandlers.has(route)){
      return this.messageHandlers.get(route) || null;
    }

    for(const [key,value] of this.messageHandlers){
        if(!key.includes('+') && !key.includes('#')){
            continue;
        }
        if(this.matchMqttPattern(key,route)){
           return value;
        }
    }
    return null;
   }

   public getRequestPattern(pattern:string):string{
    return pattern ;
   }

   public getReplyPattern(pattern:string):string{
    return `${pattern}/reply`;
   }
  
   public handleError(stream:any){
    Stream.on('error',(err:any)=> this.logger.error(err));
   }





  


}