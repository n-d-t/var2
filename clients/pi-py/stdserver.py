import socket
import sys
 
HOST = 'localhost'   # Symbolic name, meaning all available interfaces
PORT = 1234          # Arbitrary non-privileged port
 
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    s.bind((HOST, PORT))
except socket.error as msg:
    print 'Bind failed. Error Code : ' + str(msg[0]) + ' Message ' + msg[1]
    sys.exit()
     
s.listen(1)
conn, addr = s.accept();
print 'Connected with ' + addr[0] + ':' + str(addr[1])

while 1:
    data = "";    
    c = conn.recv(1);
    while c != "\n":
        data = data + c;
        c = conn.recv(1);
    print "Packetified ==> ", data;
    
s.close()