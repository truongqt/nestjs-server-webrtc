import { Controller, Get, Query, Req } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Controller('pa')
@WebSocketGateway(3001, { namespace: 'chat' })
export class PlayaroundController {
    @WebSocketServer() server: Server;
    // @SubscribeMessage('message')
    // handleMessage(@MessageBody() message: string): void {
    //     this.server.emit('message', message);
    // }

    @Get()
    getText(@Query() queryParams: {
        name: string,
        age: number
    }): string {
        console.log('queryParams: ', queryParams)
        this.server.emit('message', "XIN CHAO");
        return "Your Request: "
    }
}
