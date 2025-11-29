import asyncio
import socketio

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print("Connected to server")
    await sio.emit('generate_workflow', {'prompt': 'Create a wallet and swap ADA for DJED'})

@sio.event
async def node_created(data):
    print(f"Node created: {data}")

@sio.event
async def edge_created(data):
    print(f"Edge created: {data}")

@sio.event
async def workflow_complete(data):
    print("Workflow complete")
    await sio.disconnect()

@sio.event
async def error(data):
    print(f"Error received: {data}")
    await sio.disconnect()

async def main():
    await sio.connect('http://localhost:8000')
    await sio.wait()

if __name__ == '__main__':
    asyncio.run(main())
