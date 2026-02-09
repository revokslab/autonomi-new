import type { Socket } from "socket.io";

interface ConnectionState {
	lastSeen: number;
	taskId?: string;
	reconnectCount: number;
	bufferPosition: number;
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
