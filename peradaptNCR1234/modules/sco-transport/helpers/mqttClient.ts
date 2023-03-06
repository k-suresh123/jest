import { QualityOfService,ServiceConfig } from @ncr-swt-retail/scoxutils-js
import {TransportMqtt} from '@ncr-swt-retail/scoxutils-js/transport/mqtt/transportMqttWs';
import { MqttOptions } from '@nestjs/microservices';
import { APPLICATION_ID, SOURCE_NAME} from '../../../constants';


const mqttClient = new TransportMqtt();

let connecting= false;

export const bootstrapMqttClient = (qos: QualityOfService,clientOptions:MqttOptions['options']) =>
new Promise<void>((resolve,reject)=>{

    if(connecting)
    resolve();

  connecting = true;

  mqttClient.sourceName = SOURCE_NAME;
  mqttClient.QualityOfService = qos;
  mqttClient.applicationID = APPLICATION_ID;

   const brokerConnectionTimeout = setTimeOut(() =>{
    ServiceConfig.scoLogger.error('failed to connect broker after 10 sec...');
    reject();
   }, 10000);

   mqttClient.onConnect = () => {
    ServiceConfig.scoLogger.info('connected to mqtt broker successfully');
    clearTimeout(brokerConnectionTimeout);
    resolve();
   };

   ServiceConfig.scoLogger.infor(
    `connecting to broker host: ${clientOptions.host} and port: ${clientOptions.port}...`
   );

   mqttClient.connect(clientOptions.host, clientOptions.port, clientOptions)

})

export default mqttClient;
