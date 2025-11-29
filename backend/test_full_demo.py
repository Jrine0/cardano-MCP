import socketio
import time

sio = socketio.Client()

@sio.event
def connect():
    print("Connected to backend")
    # Send the prompt that triggers all new tools
    prompt = "Create a trading agent named 'AlphaTrader' that uses a scalping strategy, opens a Hydra Head, and executes a trade for 100 ADA."
    print(f"Sending prompt: {prompt}")
    sio.emit('generate_workflow', {'prompt': prompt})

@sio.event
def node_created(data):
    print(f"Node created: {data}")

@sio.event
def edge_created(data):
    print(f"Edge created: {data}")

@sio.event
def workflow_complete(data):
    print("Workflow generation complete")
    sio.disconnect()

@sio.event
def log(data):
    print(f"Log: {data['message']}")

if __name__ == '__main__':
    sio.connect('http://localhost:8000')
    sio.wait()
