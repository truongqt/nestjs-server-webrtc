import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface SocketData {
    callerId?: string;
    calleeId?: string;
    rtcMessage: string | null;
}

@WebSocketGateway(3500, {
    // namespace: 'chat',
})
export class ChatGateWay {
    @WebSocketServer() server: Server;

    users: {
        userId: string,
        socketClientId: string
    }[] = [];

    handleConnection(client: Socket) {

        const userId = client.handshake.query.userId;
        console.log('Connect userId: ', userId);
        this.users = this.users.filter(item => item.userId !== userId);

        this.users.push({
            userId: userId as string,
            socketClientId: client.id
        });
        // client.join(userName);
        // console.log('userName: ', client.client);
        console.log('users: ', this.users)
    }

    handleDisconnect(client) {
        console.log('Disonnected: ', client.id);
        this.users = this.users.filter(item => item.socketClientId !== client.id);
    }

    // @SubscribeMessage('register')
    // handleRegister(@MessageBody() userData: {
    //     userName: string
    // }, @ConnectedSocket() client: any) {
    //     console.log('userData:', userData);
    //     this.users = this.users.filter(item => item.id !== client.id);
    //     const user = this.users?.find(item => item.userName === userData.userName);
    //     const newUserInfo = {
    //         userName: userData.userName,
    //         id: client.id
    //     }
    //     if (user) {
    //         this.users = this.users.filter(item => item.userName !== userData.userName);
    //     }
    //     this.users.push(newUserInfo);
    //     console.log('this users: ', this.users);
    //     this.server.to(client.id).emit('registerSuccess', newUserInfo);
    // }

    // @SubscribeMessage('message')
    // handleMessage(@MessageBody() message: string) {
    //     console.log('received message: ', JSON.stringify(message))
    // }

    @SubscribeMessage('call')
    async handleCall(@MessageBody() data: SocketData, @ConnectedSocket() client) {
        console.log('on make call data: ', data)
        const calleeId = data.calleeId;
        const rtcMessage = data.rtcMessage;
        const calleeInfo = this.users.find(user => user.userId === calleeId);
        const callerInfo = this.users.find(user => user.socketClientId === client.id);

        this.server.to(calleeInfo?.socketClientId).emit('newCall', {
            callerId: callerInfo?.userId,
            rtcMessage
        } as SocketData);
    }

    @SubscribeMessage('answerCall')
    async handleAnswerCall(@MessageBody() data: SocketData, @ConnectedSocket() client) {
        console.log('answerCall data: ', data)
        const callerId = data.callerId;
        const rtcMessage = data.rtcMessage;
        const callerInfo = this.users.find(user => user.userId === callerId);
        const calleeInfo = this.users.find(user => user.socketClientId === client.id);
        this.server.to(callerInfo?.socketClientId).emit('callAnswered', {
            calleeId: calleeInfo?.userId,
            rtcMessage,
        } as SocketData)
    }

    @SubscribeMessage('ICEcandidate')
    async handleICEcandidate(@MessageBody() data: SocketData, @ConnectedSocket() client) {
        console.log('ICEcandidate data: ', data)
        const calleeId = data.calleeId;
        const rtcMessage = data.rtcMessage;
        const calleeInfo = this.users.find(user => user.userId === calleeId);
        const callerInfo = this.users.find(user => user.socketClientId === client.id);
        this.server.to(calleeInfo?.socketClientId).emit("ICEcandidate", {
            sender: callerInfo?.userId,
            rtcMessage,
        } as SocketData)
    }



    // @SubscribeMessage('call')
    // async messages(client: Socket, data: { userName: string, message: string }) {
    //     console.log('call to name: ', this.users?.find(user => user.userName === data.userName)?.userName);
    //     console.log('call to id: ', this.users?.find(user => user.userName === data.userName)?.id);
    //     // console.log('received data: ', data);
    //     this.server.to(this.users.find(user => user.userName === data.userName).id).emit('newCall', data.message)
    // }

}