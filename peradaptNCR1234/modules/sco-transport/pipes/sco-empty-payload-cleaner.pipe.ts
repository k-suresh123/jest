import { ArgumentMetadata,Injectable,PipeTransform} from '@nestjs/common';

@Injectable()
export class ScoEmptyPayloadCleaner implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
               
        if(metadata.type === 'body'){
            if(typeof value === 'string'){
                return{
                    event : 'emptyPayload',
                    params :{}
                }

            }
        }
        return value;
    }
}