import sys
import subprocess
import socket
import thread
import time

#raspberry related
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(17,GPIO.IN)

def stdout_thread(p):
    host = "localhost"
    port = 1234
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try :
        s.connect((host, port))
    except :
        print 'Unable to connect'
        return
     
    #print 'Thread Connected to the server.'
    
    while 1:
        data = p.stdout.readline()
        s.send(data)
    

proc = subprocess.Popen('python client-pubsub.py', shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE)

thread.start_new_thread(stdout_thread, (proc, ) )

while 1:
	if(GPIO.input(17) == 1):
        	sendData = '{"Twist": {"linear" : {"x":4,"y":0,"z":0}, "angular":{"x":0,"y":0,"z":0}}}'
		#print str(sendData)
        	proc.stdin.write('{"command":"publish", "address":"1010", "value":' + sendData + '}\n')
		time.sleep(1);
    
