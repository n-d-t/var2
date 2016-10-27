import socket, select, string, sys
 
#main function
if __name__ == "__main__":

    host = "192.168.43.96"
    port = 1222
     
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
     
    # connect to remote host  
    try :
        s.connect((host, port))
    except :
        sys.stdout.write('Unable to connect' + '\n');
        sys.stdout.flush()
        sys.exit()
     
    sys.stdout.write('Connected' + '\n');
    sys.stdout.flush()
     
    while 1:
        socket_list = [sys.stdin, s]
         
        # Get the list sockets which are readable
        read_sockets, write_sockets, error_sockets = select.select(socket_list , [], [])
         
        for sock in read_sockets:
            #incoming message from remote server
            if sock == s:
                
                data = "";
                c = s.recv(1);
                while c!="\n":
                    data = data+c;
                    c = s.recv(1);
                
                if not data :
                    sys.stdout.write('Disconnected from the server' + '\n');
                    sys.stdout.flush()
                    sys.exit()
                else :
                    #print data
                    sys.stdout.write(data + '\n')
                    sys.stdout.flush()
             
            #user entered a message
            else :
                msg = sys.stdin.readline()
                s.send(msg)


# value to be copied and pasted when <You> displayed
# {"command":"subscribe","address":"1010"}
# {"command":"unsubscribe","address":"1010"}
# {"command":"fetch","address":"1010"}
